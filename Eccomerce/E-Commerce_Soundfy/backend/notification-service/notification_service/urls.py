from django.urls import path
from notification_service import views

urlpatterns = [
    path('send-sms/', views.send_notification, name='send_notification')
]