from django.shortcuts import render
from django.http import JsonResponse
from .models import Carrito, CarritoItem
#importa csrf_exempt para que no se requiera el token de seguridad
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import os
from django.conf import settings
from django.http import JsonResponse

# Create your views here.

# Agregar item al carrito
@csrf_exempt
def add_to_cart(request):
    if request.method == 'POST':
        try:

            # Leer los datos JSON desde el cuerpo de la solicitud
            data = json.loads(request.body)
            user_id = data.get('user_id')
            product_id = data.get('id_album')
            quantity = data.get('quantity', 1)
            # Verificar que se haya recibido toda la información necesaria
            if not user_id or not product_id:
                return JsonResponse({'error': 'Faltan parámetros'}, status=400)

            # Leer los datos de los álbumes
            try:
                with open('static/data/data.json', 'r') as file:
                    albums_data = json.load(file)
                    albums = albums_data.get('albums', [])
            except FileNotFoundError:
                return JsonResponse({'error': 'Archivo de albums no encontrado'}, status=500)

            # Buscar el producto en los álbumes
            product_data = next((album for album in albums if album['id'] == product_id), None)
            if not product_data:
                return JsonResponse({'error': 'Producto no encontrado'}, status=404)

            price = product_data['price']

            # Obtener o crear el carrito
            cart, created = Carrito.objects.get_or_create(user_id=user_id)

            # Obtener o crear el item en el carrito
            cart_item, created = CarritoItem.objects.get_or_create(
                cart=cart,
                product_id=product_id,
                defaults={'quantity': quantity},
                price=data.get('price'),
                format=data.get('format')
            )

            # Si el item ya existe, actualizamos la cantidad
            if not created:
                cart_item.quantity += quantity
                cart_item.save()

            # Obtener todos los items actualizados del carrito
            items = CarritoItem.objects.filter(cart=cart)
            cart_data = {
                'cart_id': cart.id,
                'user_id': cart.user_id,
                'items': [{'product_id': item.product_id, 'quantity': item.quantity} for item in items],
            }

            return JsonResponse({'cart': cart_data})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Error al procesar los datos JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error: {e}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
    
#eliminar item del carrito
@csrf_exempt
def delete_item(request, usuario_id, producto_id):
    if request.method == 'DELETE':
        try:
            # Buscar el carrito del usuario
            cart = Carrito.objects.get(user_id=usuario_id)
            # Buscar el item en el carrito
            item = CarritoItem.objects.get(cart=cart, product_id=producto_id)
            # Eliminar el item del carrito
            item.delete()
            return JsonResponse({'message': 'Item eliminado correctamente'})
        except Carrito.DoesNotExist:
            return JsonResponse({'error': 'Carrito no encontrado'}, status=404)
        except CarritoItem.DoesNotExist:
            return JsonResponse({'error': 'Item no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error: {e}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

#eliminar todos los items del carrito
@csrf_exempt
def delete_cart(request, usuario_id):
    if request.method == 'DELETE':
        try:
            # Buscar el carrito del usuario
            cart = Carrito.objects.get(user_id=usuario_id)
            # Eliminar todos los items del carrito
            CarritoItem.objects.filter(cart=cart).delete()
            return JsonResponse({'message': 'Carrito eliminado correctamente'})
        except Carrito.DoesNotExist:
            return JsonResponse({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error: {e}'}, status=500)
    
#obtener el carrito
@csrf_exempt
def get_cart(request, usuario_id):
    if request.method == 'GET':
        try:
            # Obtener el carrito del usuario
            cart = Carrito.objects.get(user_id=usuario_id)
            items = CarritoItem.objects.filter(cart=cart)

            # Cargar el archivo JSON con la información de los productos
            json_file_path = os.path.join(settings.BASE_DIR, 'static', 'data', 'data.json')
            with open(json_file_path, 'r') as file:
                product_data = json.load(file)
            
            # Crear un diccionario para acceder más fácilmente a los productos por ID
            product_dict = {product['id']: product for product in product_data['albums']}

            cart_data = {
                'cart_id': cart.id,
                'user_id': cart.user_id,
                'items': [
                    {
                        'product_id': item.product_id,
                        'quantity': item.quantity,
                        'format': item.format,
                        'price': item.price,
                        'title': product_dict.get(item.product_id, {}).get('title', 'Unknown Title'),
                        'artist': product_dict.get(item.product_id, {}).get('artist', 'Unknown Artist'),
                        'cover': product_dict.get(item.product_id, {}).get('cover', 'Unknown Cover')
                    }
                    for item in items
                ],
            }
            return JsonResponse({'cart': cart_data})
        except Carrito.DoesNotExist:
            return JsonResponse({'error': 'Carrito no encontrado'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Ocurrió un error: {e}'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

