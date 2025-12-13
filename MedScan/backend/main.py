from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pytesseract
import pdfplumber
from PIL import Image
import io
import os
from typing import List, Dict, Any, Optional
import json
import re
from datetime import datetime, timedelta
import requests
import fitz  # PyMuPDF
import hashlib
import logging
import time

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar la ruta de Tesseract y el directorio de datos
TESSERACT_PATH = r'C:\Program Files\Tesseract-OCR'
pytesseract.pytesseract.tesseract_cmd = os.path.join(TESSERACT_PATH, 'tesseract.exe')
os.environ['TESSDATA_PREFIX'] = os.path.join(TESSERACT_PATH, 'tessdata')

# Verificar que Tesseract está instalado correctamente
try:
    pytesseract.get_tesseract_version()
    logger.info("Tesseract está funcionando correctamente")
except Exception as e:
    logger.error(f"Error al inicializar Tesseract: {str(e)}")
    print(f"Por favor, asegúrate de que Tesseract está instalado en: {TESSERACT_PATH}")
    print(f"Y que el archivo spa.traineddata está en: {os.path.join(TESSERACT_PATH, 'tessdata')}")

# Configuración de Hugging Face
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/mbart-large-50-many-to-many-mmt"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")

SYSTEM_PROMPT = """Eres un asistente especializado en procesar informes médicos de laboratorio.
Tu tarea es extraer y estructurar la información en un formato JSON consistente.
Debes identificar:
1. Información del paciente (nombre, edad, sexo, fecha)
2. Categorías de exámenes (ej: Hemograma, Perfil Bioquímico)
3. Resultados individuales con sus valores, unidades y rangos de referencia
4. Conclusiones o notas adicionales

El JSON debe seguir esta estructura:
{
    "info_paciente": {
        "nombre": string,
        "edad": string,
        "sexo": string,
        "fecha": string (formato DD/MM/YYYY)
    },
    "categorias": [
        {
            "nombre": string,
            "examenes": [
                {
                    "nombre": string,
                    "valor": number,
                    "unidad": string,
                    "rango": {
                        "min": number | null,
                        "max": number | null
                    }
                }
            ]
        }
    ],
    "conclusiones": string
}"""

app = FastAPI(title="MedScan API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar configuración
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 5242880))  # 5MB por defecto
ALLOWED_EXTENSIONS = json.loads(os.getenv("ALLOWED_EXTENSIONS", '["pdf","jpg","jpeg","png"]'))

# Sistema de caché
class Cache:
    def __init__(self, max_size=100, ttl_hours=24):
        self.cache = {}
        self.max_size = max_size
        self.ttl = timedelta(hours=ttl_hours)
    
    def get(self, key: str) -> Dict:
        if key in self.cache:
            data, timestamp = self.cache[key]
            if datetime.now() - timestamp < self.ttl:
                return data
            del self.cache[key]
        return None
    
    def set(self, key: str, value: Dict):
        if len(self.cache) >= self.max_size:
            # Eliminar la entrada más antigua
            oldest_key = min(self.cache.items(), key=lambda x: x[1][1])[0]
            del self.cache[oldest_key]
        self.cache[key] = (value, datetime.now())

# Inicializar caché
try:
    cache = Cache()
    logger.info("Sistema de caché inicializado correctamente")
except Exception as e:
    logger.error(f"Error al inicializar caché: {str(e)}")

@app.on_event("startup")
async def startup_event():
    """Evento que se ejecuta al iniciar la aplicación."""
    try:
        logger.info("Iniciando aplicación...")
        # Verificar que Tesseract está instalado
        pytesseract.get_tesseract_version()
        logger.info("Tesseract está funcionando correctamente")
        
        # Verificar que PyMuPDF está instalado
        fitz.__version__
        logger.info("PyMuPDF está funcionando correctamente")
        
        # Verificar conexión con Hugging Face
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        response = requests.get(HUGGINGFACE_API_URL, headers=headers)
        if response.status_code == 200:
            logger.info("Conexión con Hugging Face establecida correctamente")
        else:
            logger.error(f"Error al conectar con Hugging Face: {response.text}")
            
    except Exception as e:
        logger.error(f"Error durante el inicio de la aplicación: {str(e)}")
        raise

@app.get("/")
async def root():
    """Endpoint de prueba."""
    return {"message": "API funcionando correctamente"}

def get_text_hash(text: str) -> str:
    """Genera un hash único para el texto."""
    return hashlib.md5(text.encode()).hexdigest()

def preprocess_text(text: str) -> str:
    """Preprocesa el texto para mejorar la detección."""
    # Eliminar espacios múltiples
    text = re.sub(r'\s+', ' ', text)
    # Normalizar caracteres especiales
    text = text.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    # Eliminar caracteres no deseados
    text = re.sub(r'[^\w\s.,;:()/-]', '', text)
    return text.strip()

def clean_text(text: str) -> str:
    """Limpia el texto extraído."""
    # Eliminar espacios múltiples
    text = re.sub(r'\s+', ' ', text)
    # Eliminar caracteres especiales pero mantener puntos y comas
    text = re.sub(r'[^\w\s.,;:()/-]', '', text)
    # Corregir errores comunes de OCR
    text = text.replace('0', 'O').replace('1', 'I').replace('5', 'S')
    return text.strip()

def extract_structured_data(text: str) -> List[Dict[str, Any]]:
    """Extrae datos estructurados del texto."""
    # Patrones comunes para exámenes médicos
    patterns = [
        # Patrón: Nombre del examen: Valor Unidad
        r'([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+):\s*([\d.,]+)\s*([A-Za-zÁáÉéÍíÓóÚúÑñ/%]+)',
        # Patrón: Nombre del examen = Valor Unidad
        r'([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)\s*=\s*([\d.,]+)\s*([A-Za-zÁáÉéÍíÓóÚúÑñ/%]+)',
        # Patrón: Nombre del examen Valor Unidad
        r'([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)\s+([\d.,]+)\s+([A-Za-zÁáÉéÍíÓóÚúÑñ/%]+)'
    ]
    
    results = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        for pattern in patterns:
            matches = re.finditer(pattern, line)
            for match in matches:
                exam_name = match.group(1).strip()
                value = match.group(2).strip()
                unit = match.group(3).strip()
                
                # Limpiar el nombre del examen
                exam_name = re.sub(r'\s+', ' ', exam_name)
                
                results.append({
                    "examen": exam_name,
                    "valor": value,
                    "unidad": unit
                })
    
    return results

def validate_file(file: UploadFile) -> bool:
    """Valida el tipo y tamaño del archivo."""
    if file.content_type not in [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ]:
        return False
    
    # Verificar extensión
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False
    
    return True

async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extrae texto de un archivo PDF usando PyMuPDF."""
    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        logger.error(f"Error al procesar PDF: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el PDF: {str(e)}"
        )

async def extract_text_from_image(file: UploadFile) -> str:
    """Extrae texto de una imagen usando Tesseract."""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        text = pytesseract.image_to_string(image, lang='spa')
        image.close()
        return text
    except Exception as e:
        logger.error(f"Error al procesar imagen: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la imagen: {str(e)}"
        )

def extract_patient_info(text: str) -> Dict[str, str]:
    """Extrae información del paciente del texto."""
    info = {
        "nombre": "",
        "edad": "",
        "sexo": "",
        "fecha": "",
        "id": ""
    }
    
    # Patrones mejorados para buscar información del paciente
    patrones = {
        "nombre": [
            r"(?i)(?:paciente|nombre)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|\s*(?:edad|fecha|id|$))",
            r"(?i)nombre\s+del\s+paciente\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)paciente\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "edad": [
            r"(?i)(?:edad)\s*[:=]\s*(\d+(?:\s*años)?)",
            r"(?i)edad\s+del\s+paciente\s*[:=]\s*(\d+(?:\s*años)?)",
            r"(?i)años\s*[:=]\s*(\d+)"
        ],
        "sexo": [
            r"(?i)(?:sexo)\s*[:=]\s*([MF])",
            r"(?i)sexo\s+del\s+paciente\s*[:=]\s*([MF])",
            r"(?i)genero\s*[:=]\s*([MF])"
        ],
        "fecha": [
            r"(?i)(?:fecha)\s*[:=]\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
            r"(?i)fecha\s+del\s+examen\s*[:=]\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
            r"(?i)fecha\s+de\s+muestra\s*[:=]\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})"
        ],
        "id": [
            r"(?i)(?:id|identificación|cedula|cédula)\s*[:=]\s*([A-Z0-9-]+)",
            r"(?i)historia\s+clínica\s*[:=]\s*([A-Z0-9-]+)",
            r"(?i)no\.?\s*de\s+identificación\s*[:=]\s*([A-Z0-9-]+)"
        ]
    }
    
    for key, patterns in patrones.items():
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                info[key] = match.group(1).strip()
                break
    
    return info

def extract_medical_info(text: str) -> Dict[str, str]:
    """Extrae información médica del texto."""
    info = {
        "medico": "",
        "especialidad": "",
        "clinica": "",
        "numero_registro": "",
        "tipo_muestra": "",
        "condiciones": "",
        "metodo_analisis": ""
    }
    
    # Patrones mejorados para información médica
    patrones = {
        "medico": [
            r"(?i)(?:médico|doctor|dr\.?|dra\.?)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)interpretado\s+por\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)firmado\s+por\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "especialidad": [
            r"(?i)(?:especialidad)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)especialista\s+en\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "clinica": [
            r"(?i)(?:clínica|hospital|centro|laboratorio)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)institución\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "numero_registro": [
            r"(?i)(?:registro|licencia|matrícula)\s*[:=]\s*([A-Z0-9-]+)",
            r"(?i)no\.?\s*de\s+registro\s*[:=]\s*([A-Z0-9-]+)"
        ],
        "tipo_muestra": [
            r"(?i)(?:tipo\s+de\s+muestra|muestra)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)material\s+analizado\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "condiciones": [
            r"(?i)(?:condiciones|estado)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)estado\s+de\s+la\s+muestra\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ],
        "metodo_analisis": [
            r"(?i)(?:método|metodo)\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)",
            r"(?i)técnica\s+utilizada\s*[:=]\s*([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?=\n|$)"
        ]
    }
    
    for key, patterns in patrones.items():
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                info[key] = match.group(1).strip()
                break
    
    return info

def extract_conclusions_and_recommendations(text: str) -> Dict[str, str]:
    """Extrae conclusiones y recomendaciones del texto."""
    result = {
        "conclusiones": "",
        "recomendaciones": ""
    }
    
    # Patrones mejorados para conclusiones
    conclusion_patterns = [
        r"(?i)conclusi[óo]n(?:es)?[:\s]+(.*?)(?=\s*(?:recomendaci|firma|$))",
        r"(?i)interpretaci[óo]n[:\s]+(.*?)(?=\s*(?:recomendaci|firma|$))",
        r"(?i)resultados?[:\s]+(.*?)(?=\s*(?:recomendaci|firma|$))",
        r"(?i)comentarios?[:\s]+(.*?)(?=\s*(?:recomendaci|firma|$))"
    ]
    
    # Patrones mejorados para recomendaciones
    recommendation_patterns = [
        r"(?i)recomendaci[óo]n(?:es)?[:\s]+(.*?)(?=\s*(?:firma|$))",
        r"(?i)sugerencias?[:\s]+(.*?)(?=\s*(?:firma|$))",
        r"(?i)observaciones?[:\s]+(.*?)(?=\s*(?:firma|$))"
    ]
    
    # Buscar conclusiones
    for pattern in conclusion_patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            result["conclusiones"] = match.group(1).strip()
            break
    
    # Buscar recomendaciones
    for pattern in recommendation_patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            result["recomendaciones"] = match.group(1).strip()
            break
    
    return result

def process_text_with_rules(text: str) -> dict:
    """Procesa el texto usando reglas y patrones predefinidos."""
    result = {
        "titulo_examen": "",
        "info_paciente": {},
        "info_medica": {},
        "datos_estructurados": [],
        "conclusiones": "",
        "recomendaciones": ""
    }

    # Extraer información del paciente
    result["info_paciente"] = extract_patient_info(text)
    
    # Extraer información médica
    result["info_medica"] = extract_medical_info(text)
    
    # Extraer conclusiones y recomendaciones
    conclusions_data = extract_conclusions_and_recommendations(text)
    result["conclusiones"] = conclusions_data["conclusiones"]
    result["recomendaciones"] = conclusions_data["recomendaciones"]

    # Lista de campos a ignorar que no son resultados de análisis
    campos_ignorar = {
        'edad', 'fecha', 'nombre', 'sexo', 'paciente', 
        'médico', 'medico', 'doctor', 'doctora', 'dr', 'dra',
        'registro', 'cédula', 'cedula', 'identificación', 'identificacion',
        'muestra', 'método', 'metodo', 'número', 'numero', 'resultado',
        'parámetro', 'parametro', 'categoría', 'categoria', 'estado',
        'referencia', 'rango', 'valor', 'unidad', 'interpretación',
        'interpretacion', 'observaciones', 'notas', 'comentarios'
    }

    # Lista de categorías comunes en exámenes de laboratorio
    categorias_comunes = {
        'HEMOGRAMA', 'BIOQUÍMICA', 'BIOQUIMICA', 'QUÍMICA SANGUÍNEA', 'QUIMICA SANGUINEA',
        'FUNCIÓN RENAL', 'FUNCION RENAL', 'FUNCIÓN HEPÁTICA', 'FUNCION HEPATICA',
        'ELECTROLITOS', 'LÍPIDOS', 'LIPIDOS', 'HORMONAS', 'TIROIDES',
        'COAGULACIÓN', 'COAGULACION', 'UROANÁLISIS', 'UROANALISIS',
        'CULTIVOS', 'MICROBIOLOGÍA', 'MICROBIOLOGIA', 'INMUNOLOGÍA', 'INMUNOLOGIA'
    }

    # Dividir el texto en líneas y limpiar
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Detectar título del examen
    for line in lines[:5]:
        if re.search(r'(?i)(examen|análisis|informe|reporte)\s+(?:de\s+)?(?:laboratorio|médico|clínico)', line):
            result["titulo_examen"] = line.strip()
            break

    # Variables para el procesamiento de categorías y exámenes
    current_category = ""
    in_resultados = False

    # Patrones flexibles para detectar exámenes
    exam_patterns = [
        # Patrón 1: Nombre Valor Unidad (Rango)
        r'([^:]+?)\s+([\d,\.]+)\s+((?:mg/dL|g/dL|U/L|%|mg/L|µL|millones/µL|/µL|mEq/L|mm3|g/24h|/hpf|/lpf|/campo|/mm2|/mm3|/dl|/l|/ml|/ul|/mm|/h|/min|/seg|/día|/dia|/semana|/mes|mmol/L)?)\s*(?:\(([^)]+)\))?',
        
        # Patrón 2: Nombre: Valor Unidad (Rango)
        r'([^:]+?)\s*[:=]\s*([\d,\.]+)\s*((?:mg/dL|g/dL|U/L|%|mg/L|µL|millones/µL|/µL|mEq/L|mm3|g/24h|/hpf|/lpf|/campo|/mm2|/mm3|/dl|/l|/ml|/ul|/mm|/h|/min|/seg|/día|/dia|/semana|/mes|mmol/L)?)\s*(?:\(([^)]+)\))?',
        
        # Patrón 3: Nombre = Valor Unidad (Rango)
        r'([^:]+?)\s*=\s*([\d,\.]+)\s*((?:mg/dL|g/dL|U/L|%|mg/L|µL|millones/µL|/µL|mEq/L|mm3|g/24h|/hpf|/lpf|/campo|/mm2|/mm3|/dl|/l|/ml|/ul|/mm|/h|/min|/seg|/día|/dia|/semana|/mes|mmol/L)?)\s*(?:\(([^)]+)\))?'
    ]

    # Procesar línea por línea
    for line in lines:
        # Detectar sección de resultados
        if re.match(r'(?i)^(?:resultados?|parámetros?|parametros?|valores?|exámenes?|examenes?)', line):
            in_resultados = True
            continue

        # Detectar categorías
        if re.match(r'^[A-ZÁÉÍÓÚÑ][^:]+$', line.strip()) and not ':' in line:
            if line.strip() in categorias_comunes:
                current_category = line.strip()
            continue

        # Procesar línea de examen usando múltiples patrones
        if in_resultados:
            for pattern in exam_patterns:
                exam_match = re.match(pattern, line)
                if exam_match:
                    nombre = exam_match.group(1).strip()
                    # Verificar si el nombre del examen está en la lista de campos a ignorar
                    if nombre.lower() not in campos_ignorar and not re.match(r'^[A-ZÁÉÍÓÚÑ][^:]+$', nombre):
                        valor_str = exam_match.group(2).replace(',', '.')
                        unidad = exam_match.group(3) if exam_match.group(3) else ""
                        rango_str = exam_match.group(4) if len(exam_match.groups()) > 3 else ""

                        try:
                            valor = float(valor_str)
                            rango_min = None
                            rango_max = None

                            if rango_str:
                                # Procesar diferentes formatos de rango
                                if '-' in rango_str:
                                    rango_parts = [p.strip().replace(',', '.') for p in rango_str.split('-')]
                                    if len(rango_parts) == 2:
                                        rango_min = float(rango_parts[0])
                                        rango_max = float(rango_parts[1])
                                elif '<' in rango_str:
                                    rango_max = float(rango_str.replace('<', '').strip().replace(',', '.'))
                                elif '>' in rango_str:
                                    rango_min = float(rango_str.replace('>', '').strip().replace(',', '.'))

                            # Solo añadir si tenemos un nombre válido y un valor numérico
                            if nombre and not nombre.isspace() and valor is not None:
                                result["datos_estructurados"].append({
                                    "categoria": current_category,
                                    "examen": nombre,
                                    "valor": str(valor),
                                    "unidad": unidad,
                                    "rango_referencia": {
                                        "min": rango_min,
                                        "max": rango_max
                                    }
                                })
                                break
                        except (ValueError, IndexError) as e:
                            print(f"Error procesando valor: {line} - {str(e)}")
                            continue

    return result

async def process_with_ai(text: str) -> Dict[str, Any]:
    """Procesa el texto usando el modelo de IA especializado."""
    try:
        print("Iniciando procesamiento con IA...")
        
        # Verificar caché
        text_hash = get_text_hash(text)
        cached_result = cache.get(text_hash)
        if cached_result:
            print("Resultado encontrado en caché")
            return cached_result

        # Preprocesar texto
        print("Preprocesando texto...")
        processed_text = preprocess_text(text)
        
        print("Enviando solicitud a Hugging Face...")
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json={"inputs": processed_text})
        
        if response.status_code != 200:
            print(f"Error en la API de Hugging Face: {response.text}")
            raise Exception(f"Error en la API de Hugging Face: {response.text}")
            
        print("Procesando resultados de la IA...")
        results = response.json()
        
        # Procesar los resultados de la IA
        processed_data = {
            "titulo_examen": "",
            "info_paciente": {},
            "info_medica": {
                "medico": "",
                "especialidad": "",
                "clinica": "",
                "numero_registro": "",
                "tipo_muestra": "",
                "condiciones": "",
                "metodo_analisis": ""
            },
            "datos_estructurados": [],
            "conclusiones": "",
            "recomendaciones": ""
        }
        
        # Procesar entidades reconocidas
        current_category = ""
        for entity in results:
            if entity["entity"] == "PER":
                # Persona (médico o paciente)
                if "médico" in processed_text.lower() or "doctor" in processed_text.lower():
                    processed_data["info_medica"]["medico"] = entity["word"]
                else:
                    processed_data["info_paciente"]["nombre"] = entity["word"]
            elif entity["entity"] == "ORG":
                # Organización (clínica)
                processed_data["info_medica"]["clinica"] = entity["word"]
            elif entity["entity"] == "MISC":
                # Misceláneo (títulos, categorías)
                if entity["word"].isupper():
                    current_category = entity["word"]
                elif "examen" in entity["word"].lower() or "análisis" in entity["word"].lower():
                    processed_data["titulo_examen"] = entity["word"]
        
        print("Procesando valores numéricos y rangos...")
        # Procesar valores numéricos y rangos
        lines = processed_text.split('\n')
        for line in lines:
            # Detectar parámetros y valores
            if re.match(r'^[A-ZÁÉÍÓÚÑ][^:]+$', line.strip()):
                current_category = line.strip()
                continue
                
            # Patrón para detectar parámetros con valores y rangos
            param_match = re.match(r'([^:]+?)\s+([\d,\.]+)\s+((?:mg/dL|g/dL|U/L|%|mg/L|µL|millones/µL|/µL|mEq/L|mm3|g/24h|/hpf|/lpf|/campo|/mm2|/mm3|/dl|/l|/ml|/ul|/mm|/h|/min|/seg|/día|/dia|/semana|/mes|mmol/L)?)\s*(?:\(([^)]+)\))?', line)
            if param_match:
                nombre = param_match.group(1).strip()
                valor = param_match.group(2).replace(',', '.')
                unidad = param_match.group(3) if param_match.group(3) else ""
                rango = param_match.group(4) if param_match.group(4) else ""
                
                try:
                    valor_float = float(valor)
                    rango_min = None
                    rango_max = None
                    
                    if rango and '-' in rango:
                        rango_parts = [p.strip().replace(',', '.') for p in rango.split('-')]
                        if len(rango_parts) == 2:
                            rango_min = float(rango_parts[0])
                            rango_max = float(rango_parts[1])
                    
                    processed_data["datos_estructurados"].append({
                        "categoria": current_category,
                        "examen": nombre,
                        "valor": str(valor_float),
                        "unidad": unidad,
                        "rango_referencia": {
                            "min": rango_min,
                            "max": rango_max
                        }
                    })
                except ValueError:
                    continue
        
        print("Procesando conclusiones y recomendaciones...")
        # Procesar conclusiones y recomendaciones
        conclusiones_match = re.search(r'(?i)conclusi[óo]n(?:es)?[:\s]+(.*?)(?=\s*(?:recomendaci|$))', processed_text, re.DOTALL)
        if conclusiones_match:
            processed_data["conclusiones"] = conclusiones_match.group(1).strip()
            
        recomendaciones_match = re.search(r'(?i)recomendaci[óo]n(?:es)?[:\s]+(.*?)(?=\s*(?:firma|$))', processed_text, re.DOTALL)
        if recomendaciones_match:
            processed_data["recomendaciones"] = recomendaciones_match.group(1).strip()
        
        print("Guardando resultado en caché...")
        # Guardar en caché
        cache.set(text_hash, processed_data)
        print("Procesamiento completado")
        return processed_data
        
    except Exception as e:
        print(f"Error en procesamiento con IA: {str(e)}")
        print("Cambiando a procesamiento basado en reglas...")
        return process_text_with_rules(text)  # Fallback a reglas si falla la IA

def flatten_structured_data(ai_response: Dict) -> List[Dict]:
    """Convierte la respuesta estructurada en el formato esperado por el frontend."""
    if not ai_response:
        return []
        
    # Los datos ya vienen estructurados en el formato correcto
    return ai_response.get("datos_estructurados", [])

@app.post("/api/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Endpoint para extraer y procesar texto de archivos."""
    print("Iniciando extracción de texto...")
    if not validate_file(file):
        raise HTTPException(
            status_code=400,
            detail="Tipo de archivo no permitido"
        )
    
    try:
        # Extraer texto
        print(f"Procesando archivo de tipo: {file.content_type}")
        if file.content_type == "application/pdf":
            text = await extract_text_from_pdf(file)
        else:
            text = await extract_text_from_image(file)
            
        print(f"Texto extraído: {text[:200]}...")  # Mostrar primeros 200 caracteres
        
        # Procesar con IA
        print("Iniciando procesamiento con IA...")
        processed_data = await process_with_ai(text)
        if not processed_data:
            raise HTTPException(
                status_code=500,
                detail="Error al procesar el texto"
            )
            
        print("Procesamiento completado, enviando respuesta...")
        return {
            "texto_original": text,
            "texto_limpio": text.strip(),
            "titulo_examen": processed_data.get("titulo_examen", "Análisis de Laboratorio"),
            "info_paciente": processed_data.get("info_paciente", {}),
            "info_medica": processed_data.get("info_medica", {}),
            "datos_estructurados": processed_data.get("datos_estructurados", []),
            "conclusiones": processed_data.get("conclusiones", ""),
            "recomendaciones": processed_data.get("recomendaciones", "")
        }
    
    except Exception as e:
        print(f"Error en el procesamiento: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el archivo: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    """Endpoint para verificar el estado de la API."""
    return {"status": "healthy"}

@app.post("/process")
async def process_file(file: UploadFile = File(...)):
    """Endpoint para procesar archivos."""
    try:
        logger.info(f"Iniciando procesamiento de archivo: {file.filename}")
        
        # Leer contenido del archivo
        content = await file.read()
        
        # Determinar el tipo de archivo y extraer texto
        if file.filename.lower().endswith('.pdf'):
            logger.info("Procesando archivo PDF")
            text = await extract_text_from_pdf(file)
        else:
            logger.info("Procesando archivo de imagen")
            text = await extract_text_from_image(file)
        
        logger.info(f"Texto extraído (preview): {text[:200]}...")
        
        # Procesar el texto
        results = await process_with_ai(text)
        
        logger.info("Procesamiento completado exitosamente")
        return results
        
    except Exception as e:
        logger.error(f"Error en el procesamiento: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 