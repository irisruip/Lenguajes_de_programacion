from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Pedido, PedidoItem
import json


# Create your views here.
@csrf_exempt
def create_order(request, user_id):
    if (request.method == 'POST'):
        try:
            data = json.loads(request.body)
            pedido = Pedido.objects.create(
                usuario_id=user_id,
                numero=data['numero_pedido'],
                fecha=data['fecha'],
                estado=data['estado'],
                total=data['total'],
                direccion_envio=data['direccion_envio'],
                ciudad_envio=data['ciudad_envio'],
                pais_envio=data['pais_envio'],
                codigo_postal_envio=data['codigo_postal_envio'],
                impuestos=data['impuestos'],
                costo_envio=data['costo_envio'],
                fecha_envio=data['fecha_envio'],
                subtotal=data['subtotal'],
            )
            for item in data['items']:
                PedidoItem.objects.create(
                    pedido_id=pedido.id,
                    producto_id=item['product_id'],
                    cantidad=item['quantity']
                )
            return JsonResponse({'status': 'Orden creada con éxito'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 'Error al crear orden', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Método no permitido'}, status=405)
@csrf_exempt
def get_orders(request, user_id):
    if (request.method == 'GET'):
        try:
            pedidos = Pedido.objects.filter(usuario_id=user_id)
            data = []
            for pedido in pedidos:
                data.append({
                    'id': pedido.id,
                    'numero': pedido.numero,
                    'fecha': pedido.fecha,
                    'estado': pedido.estado,
                    'total': pedido.total,
                    'direccion_envio': pedido.direccion_envio,
                    'ciudad_envio': pedido.ciudad_envio,
                    'pais_envio': pedido.pais_envio,
                    'codigo_postal_envio': pedido.codigo_postal_envio,
                    'metodo_pago': pedido.metodo_pago,
                    'impuestos': pedido.impuestos,
                    'costo_envio': pedido.costo_envio,
                    'fecha_envio': pedido.fecha_envio,
                    'subtotal': pedido.subtotal,
                })
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'status': 'Error al obtener pedidos', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Método no permitido'}, status=405)
@csrf_exempt
def get_order(request, order_id):
    if (request.method == 'GET'):
        try:
            pedido = Pedido.objects.filter(id=order_id)
            data=[]
            for p in pedido:
                data.append({
                    'id': p.id,
                    'numero': p.numero,
                    'fecha': p.fecha,
                    'estado': p.estado,
                    'total': p.total,
                    'direccion_envio': p.direccion_envio,
                    'ciudad_envio': p.ciudad_envio,
                    'pais_envio': p.pais_envio,
                    'codigo_postal_envio': p.codigo_postal_envio,
                    'metodo_pago': p.metodo_pago,
                    'impuestos': p.impuestos,
                    'costo_envio': p.costo_envio,
                    'fecha_envio': p.fecha_envio,
                    'subtotal': p.subtotal,
                })

            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'status': 'Error al obtener pedido', 'error': str(e)}, status=500)


@csrf_exempt
def get_order_items(request, order_id):
    if (request.method == 'GET'):
        try:
            pedido_items = PedidoItem.objects.filter(pedido_id=order_id)
            data = []
            for pedido_item in pedido_items:
                data.append({
                    'id': pedido_item.id,
                    'pedido_id': pedido_item.pedido_id,
                    'producto_id': pedido_item.producto_id,
                    'cantidad': pedido_item.cantidad
                })
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'status': 'Error al obtener items de pedido', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Método no permitido'}, status=405)
    

@csrf_exempt
def update_order(request, order_id):
    return JsonResponse({'status': 'success'})
