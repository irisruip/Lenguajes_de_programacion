from twilio.rest import Client
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse

def send_sms(to, message):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(
        to=to,
        from_=settings.TWILIO_PHONE_NUMBER,
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