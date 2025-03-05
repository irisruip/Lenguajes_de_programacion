from django.urls import path
from user_service import views

urlpatterns = [
    path('registro/', views.registro, name='registro')
]

