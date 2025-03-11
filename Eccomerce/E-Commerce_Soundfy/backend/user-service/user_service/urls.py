from django.urls import path
from user_service import views

urlpatterns = [
    path('registro/', views.registro, name='registro'),
    path('login/', views.login, name='login'),
    path('<int:id>/', views.obtener_usuario, name='usuario'),
]

