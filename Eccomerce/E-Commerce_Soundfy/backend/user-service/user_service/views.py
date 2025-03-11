from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password
from datetime import datetime
# Create your views here.
import json

@csrf_exempt
def registro(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Validar que todos los campos estén presentes
            required_fields = ['nombre', 'email', 'password', 'telefono', 'direccion']
            if not all(field in data for field in required_fields):
                return JsonResponse({'status': 'Error', 'error': 'Faltan campos obligatorios'}, status=400)


            # Hashear la contraseña
            hashed_password = make_password(data['password'])

            # Crear usuario
            user = Usuario.objects.create(
                username=data['nombre'],
                email=data['email'],
                password=hashed_password,
                telefono=data['telefono'],
                direccion=data['direccion'],
            )
            #

            return JsonResponse({'status': 'Usuario registrado con éxito'}, status=200)
        


        except Exception as e:
            return JsonResponse({'status': 'Error al registrar usuario', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Autenticación basada en email (requiere un modelo personalizado de usuario)
            try:
                from .models import Usuario  # Asegúrate de importar tu modelo
                user = Usuario.objects.get(email=email)
            except Usuario.DoesNotExist:
                return JsonResponse({'status': 'Error', 'error': 'Usuario no encontrado'}, status=404)

            # Verificar contraseña
            if user.check_password(password):
                return JsonResponse({
                    'status': 'success',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                })
            else:
                return JsonResponse({'status': 'Error', 'error': 'Credenciales incorrectas'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'Error', 'error': str(e)}, status=500)

    return JsonResponse({'status': 'Método no permitido'}, status=405)

@csrf_exempt
def obtener_usuario(request, id):
    if request.method == 'GET':
        try:
            user = Usuario.objects.get(id=id)
            return JsonResponse({
                'id': user.id,
                'nombre': user.username,
                'email': user.email,
                'telefono': user.telefono,
                'direccion': user.direccion,
            })
        except Usuario.DoesNotExist:
            return JsonResponse({'status': 'Error', 'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'Error', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)
 
