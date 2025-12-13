# MedScan - Extractor de Texto de Exámenes Médicos

Una aplicación web para extraer texto de exámenes médicos en formato PDF o imagen.

## Requisitos Previos

- Python 3.8+
- Node.js 16+
- Tesseract OCR instalado en el sistema

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd MedScan
```

2. Instalar dependencias del backend:
```bash
pip install -r requirements.txt
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

## Configuración

1. Asegúrate de tener Tesseract OCR instalado en tu sistema:
   - Windows: Descarga e instala desde https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt-get install tesseract-ocr`
   - macOS: `brew install tesseract`

2. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade las siguientes variables:
     ```
     MAX_FILE_SIZE=5242880  # 5MB en bytes
     ALLOWED_EXTENSIONS=["pdf","jpg","jpeg","png"]
     ```

## Ejecución

1. Iniciar el backend:
```bash
uvicorn backend.main:app --reload
```

2. Iniciar el frontend:
```bash
cd frontend
npm run dev
```

3. Abrir el navegador en `http://localhost:3000`

## Características

- Carga de archivos PDF e imágenes
- Extracción de texto mediante OCR
- Interfaz de usuario intuitiva
- Validación de tipos de archivo
- Límite de tamaño de archivo configurable

## Tecnologías Utilizadas

- Frontend: Next.js, Tailwind CSS, React Hook Form
- Backend: FastAPI, Tesseract OCR, pdfplumber 