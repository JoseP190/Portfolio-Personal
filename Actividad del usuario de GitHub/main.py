# En este proyecto, crearás una interfaz de línea de comandos (CLI) sencilla para obtener la actividad reciente de un usuario de GitHub y mostrarla en la terminal. Este proyecto te ayudará a practicar tus habilidades de programación, incluyendo el trabajo con API, el manejo de datos JSON y la creación de una aplicación CLI sencilla.

# Requisitos
# La aplicación debe ejecutarse desde la línea de comandos, aceptar el nombre de usuario de GitHub como argumento, obtener la actividad reciente del usuario mediante la API de GitHub y mostrarla en la terminal. El usuario debe poder:

# Proporcione el nombre de usuario de GitHub como argumento al ejecutar la CLI.
# github-activity <username>
# Obtenga la actividad reciente del usuario de GitHub especificado mediante la API de GitHub. Puede usar el siguiente punto de conexión para obtener la actividad del usuario:

# # https://api.github.com/users/<username>/events
# # Example: https://api.github.com/users/kamranahmedse/events


# Muestra la actividad obtenida en la terminal.

# Output:
# - Pushed 3 commits to kamranahmedse/developer-roadmap
# - Opened a new issue in kamranahmedse/developer-roadmap
# - Starred kamranahmedse/developer-roadmap
# - ...

# Puede obtener más información sobre la API de GitHub aquí .
# Maneje errores con elegancia, como nombres de usuario no válidos o fallas de API.
# Utilice un lenguaje de programación de su elección para construir este proyecto.
# No utilice ninguna biblioteca o marco externo para obtener la actividad de GitHub.

import requests
import sys
from collections import Counter


def get_github_activity(usuario):
    """Funcion para obtener la actividad de un usuario de github"""

    url = f"https://api.github.com/users/{usuario}/events"

    response = requests.get(url, timeout=10)

    if response.status_code == 200:
        print("Peticion exitosa")
        data = response.json()

        # Contadores
        event_count = Counter()
        commit_count = 0
        commit_per_date = Counter()

        for event in data:
            date = event["created_at"].split("T")[0]  # Extraer solo la fecha
            event_count[event["type"]] += 1

            # Contar commits solo si es un PushEvent
            if event["type"] == "PushEvent":
                commits = event.get("payload", {}).get("commits", [])
                num_commits = len(commits)
                commit_count += num_commits
                commit_per_date[date] += num_commits

        # Total de eventos
        total_events = sum(event_count.values())

        # Resultados
        print("Conteo de eventos:", dict(event_count))
        print("Total de Eventos: ", total_events)
        print("Total de commits:", commit_count)
        print("Commits por fecha:", dict(commit_per_date))

    else:
        print(f"Error en la petición GET: {response.status_code}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        get_github_activity(sys.argv[1])
    else:
        print("Por favor, proporciona el nombre de usuario de GitHub.")
