from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Usuario
from django.shortcuts import redirect
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime
# Create your views here.
import json

@csrf_exempt
def registro(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Validar que todos los campos estén presentes
            required_fields = ['nombre', 'email', 'password', 'telefono', 'direccion', 'pais', 'ciudad', 'codigoPostal']
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
                pais=data['pais'],
                ciudad=data['ciudad'],
                codigo_postal=data['codigoPostal'],
            )
            #

            return JsonResponse({'status': 'Usuario registrado con éxito'}, status=200)
        


        except Exception as e:
            return JsonResponse({'status': 'Error al registrar usuario', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)

@csrf_exempt
def login(request):
    print("entro")
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
                'ciudad': user.ciudad,
                'pais': user.pais,
                'codigo_postal': user.codigo_postal,
                'password': user.password,

            })
        except Usuario.DoesNotExist:
            return JsonResponse({'status': 'Error', 'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'Error', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)
@csrf_exempt 
def actualizar_usuario(request,id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = Usuario.objects.get(id=id)
            user.username = data.get('nombre', user.username)
            user.email = data.get('email', user.email)
            user.telefono = data.get('telefono', user.telefono)
            user.direccion = data.get('direccion', user.direccion)
            user.ciudad = data.get('ciudad', user.ciudad)
            user.pais = data.get('pais', user.pais)
            user.codigo_postal = data.get('codigoPostal', user.codigo_postal)
            user.password = make_password(data.get('password', user.password))
            user.save()
            return JsonResponse({'status': 'Usuario actualizado con éxito'})
        except Usuario.DoesNotExist:
            return JsonResponse({'status': 'Error', 'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'Error', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)
    
@csrf_exempt
def change_password(request, id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            current_password = data.get('currentPassword')
            new_password = data.get('newPassword')
            confirm_new_password = data.get('confirmNewPassword')

            if not current_password or not new_password or not confirm_new_password:
                return JsonResponse({'status': 'Error', 'error': 'Faltan campos obligatorios'}, status=400)

            if new_password != confirm_new_password:
                return JsonResponse({'status': 'Error', 'error': 'Las contraseñas no coinciden'}, status=400)

            user = Usuario.objects.get(id=id)

            # Verifica si la contraseña actual es correcta
            if not check_password(current_password, user.password):
                return JsonResponse({'status': 'Error', 'error': 'La contraseña actual es incorrecta'}, status=400)

            # Actualiza la contraseña
            user.password = make_password(new_password)
            user.save()

            return JsonResponse({'status': 'Contraseña actualizada con éxito'})

        except Usuario.DoesNotExist:
            return JsonResponse({'status': 'Error', 'error': 'Usuario no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'Error', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Error', 'error': 'Método no permitido'}, status=405)
