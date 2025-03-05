
## Colaboradores  
- **Emilio Uzcátegui**  
- **Irisbel Ruiz**  
- **Juan Ruiz**  
- **Rodrigo Torres**  

# como correr lo que esta hecho hasta ahora

agarrense fuerte porque les voy a explicar que hay que hacer para correr este proyecto 

es posible que tengan algun error, la verdad no se cual. pero si ocurre me escriben

para empezar deben tener docker desktop ejecutandose, luego se van a ubicar en la carpeta
backend y van a ejecutar el comando: 

**docker compose up --build**

Esto cosntruira las imagenes y montara todos los contenedores tanto de los microservicios como el del
frontend. 

en este paso ya deberian tener los contenedores corriendo, puede que la primera vez tarde un poquito ya que debe
instalar las imagenes de postgres, nginx y las dependencias de cada microservicio, asi como las dependencias del frontend,
pero eso luego ya lo tendran cacheado y sera mas rapido.

para ejecutar el frontend solo vayan al localhost:5172 y se vera bien, lo unico es que por los momentos
backend y frontend no estan conectados asi que no va a ocurrir nada.

por los momentos no he encontrado una manera de que al hacer cambios estos se reflejen en tiempo real con el contenedor corriendo, asi
que si hacen cambios tendran que tumbar y volver a montar los contenedores. esto se logra con los siguientes comandos:

**docker compose down (tumbamos los contenedores)**
**docker compose up --build (los volvemos a montar)**

esto es poco practico y lento asi que voy a conseguir una manera de que se reflejen los cambios automaticamente

# Que falta?

- hacer la api

- crear los modelos de la base de datos

- conectar frontend y backend

## Contenido del Repositorio  

###  1. Documentación en Jupyter Notebook  
Se han desarrollado notebooks con información detallada sobre:  
- **Lenguajes de Programación:**  
  - Go  
  - Rust  
  - PHP  
  - C#  
- **Bases de Datos:**  
  - Relacionales  
  - No relacionales  
  - Bases de datos escalables  

###  2. Desarrollo de un Formulario en PHP  
Se elaborará un formulario básico en PHP como parte de los ejercicios prácticos.  

### 3. Futuros Trabajos  
Además del contenido actual, se incluirán futuras actividades relacionadas con la materia, como nuevos lenguajes y documentación adicional.  

## Requisitos  
Para visualizar y ejecutar los notebooks, asegúrate de tener instalado:  
- **Python** (versión 3.8 o superior)  
- **Jupyter Notebook**  
- Librerías necesarias (según cada notebook). 

