from twilio.rest import Client
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
import os 
# Función para cargar las variables desde un archivo .env
def cargar_variables_entorno(archivo='.env'):
    try:
        with open(archivo, 'r') as f:
            for linea in f:
                # Ignorar líneas vacías o comentarios
                if linea.strip() and not linea.startswith('#'):
                    clave, valor = linea.split('=', 1)  # Separar por el primer '='
                    os.environ[clave.strip()] = valor.strip()  # Establecer en el entorno
    except FileNotFoundError:
        print(f"El archivo {archivo} no se encuentra.")
        raise

# Llamar a la función para cargar las variables de entorno
cargar_variables_entorno()

twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
print(twilio_account_sid)
twilio_auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.environ.get('TWILIO_PHONE_NUMBER')

def send_sms(to, message):
    client = Client(twilio_account_sid, twilio_auth_token)
    message = client.messages.create(
        to=to,
        from_=twilio_phone_number,
        body=message
    )
    return message.sid

def send_email(request):
    subject = "Hello from Django!"
    message = "This is a test email sent from Django using Mailgun."
    from_email = 'your_email@your_mailgun_domain'
    recipient_list = ['recipient_email@example.com']
    
    send_mail(subject, message, from_email, recipient_list)
    return HttpResponse("Email sent!")