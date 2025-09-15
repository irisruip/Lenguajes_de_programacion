# Guía para instalar y ejecutar la aplicación de VibeScreens

## Índice
- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
- [Notas Adicionales](#notas-adicionales)

## Descripción
VibeScreens es una aplicación móvil que utiliza la API de [TheMovieDB](https://www.themoviedb.org/) para ofrecer contenido dinámico. En este repositorio encontrarás el código fuente y las instrucciones necesarias para clonar, configurar y ejecutar la app en tus dispositivos mediante Expo Go.

## Requisitos Previos
- **Git**: Para clonar el repositorio.
- **Node.js y npm**: Asegúrate de tener instalados Node.js y npm.
- **Visual Studio Code (VSCode)**: Recomendado para editar el código.
- **Expo Go**: La aplicación en tu teléfono para visualizar la app.
- **API Key de TheMovieDB**: Necesaria para el correcto funcionamiento de la aplicación.

## Instalación

1. **Clonar el Repositorio**  
   Clonan el repositorio ejecutando el siguiente comando:
   ```bash
   git clone https://github.com/irisruip/Lenguajes_de_programacion.git

2. **Abrir Vscode**
    Abren la carpeta clonada en VSCode. La estructura de carpetas debería verse similar a la siguiente:

    Lenguajes_de_programacion/ <br>
    └── App_Movil/ <br>
        └── VibeScreens/ <br>
            ├── app/ <br>
            ├── assets/ <br>
            ├── context/ <br>
            ├── navigation/ <br>
            ├── screens/ <br>
            ├── .gitignore <br>
            ├── app.json <br>
            ├── App.jsx <br>
            └── ... (otros archivos) 

3. **Navegar a la App**
    Se dirigen a la carpeta de la aplicación:
    ```bash
    cd App_Movil/VibeScreen

4. **Instalar Dependencias**
    Una vez dentro de la carpeta de la app, instalan las dependencias con:
    ```bash
    npm install

## Configuración

1. **Crear archivo .env**
    En la raíz del proyecto, crean un archivo llamado .env y agrega la siguiente línea con la API Key:
    `API_KEY=api_key_de_TheMovieDB`

2. **Alternativa en caso de errores**
    Si encuentran problemas al utilizar el archivo .env, pueden comentar la importación en MovieContext.jsx (ubicado en la carpeta context) y declarar la API Key directamente:

    `// import { API_KEY } from '@env';` <br>
    `const API_KEY = 'tu_api_key_de_TheMovieDB';`

## Ejecución de la Aplicación
    
1. **Descargar Expo Go**
    Descarguen e instalen la aplicación Expo Go en sus teléfonos desde este link en Drive debido a temas de compatibilidad esta versión es la que funciona

    link de descarga: https://drive.google.com/file/d/12yREu_-KUpYn0MCKLqqmoLz9ZHRwvmUU/view?usp=drive_link 

2. **Iniciar el Servidor**
    Dentro de la carpeta VibeScreen, inician el servidor de Expo con:
    ```bash
    npx expo start

3. **Escanear el Código QR**
    Una vez iniciado, se generará un código QR. Abran Expo Go en sus teléfonos y escaneen el código para visualizar la aplicación. Asegurense de mantener la computadora encendida y conectada a la misma red local y también de no tener ninguna VPN activa.

## Notas Adicionales

- API Key: Si necesitas la API Key de TheMovieDB, contáctame para proporcionártela.

- Actualizaciones: Si se realizan cambios en el repositorio, asegúrate de hacer un git pull para mantener tu copia actualizada.

- Problemas: Verifica que tu archivo .env esté bien configurado y que tu red permita la comunicación entre tu computadora y tu dispositivo móvil.


## Cambios hechos en los últimos commits

Esto lo voy a hacer para tener correctamente todos los cambios que tenga en cada commit 

- Ultimo cambio: "fix: se cambia el idioma de español de España a español latino" cambié como 5 archivos para cambiar de español españo a latino, lo hice, pero no funciona con los posters...



