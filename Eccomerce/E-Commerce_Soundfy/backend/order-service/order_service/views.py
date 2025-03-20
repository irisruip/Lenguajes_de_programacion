from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Pedido, PedidoItem
from django.shortcuts import redirect


# Create your views here.

def create_order(request, user_id):
    return JsonResponse({'status': 'success'})

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
                    'total': pedido.total
                })
            return JsonResponse(data, safe=False)
        except Exception as e:
            return JsonResponse({'status': 'Error al obtener pedidos', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Método no permitido'}, status=405)

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
    


def update_order(request, order_id):
    return JsonResponse({'status': 'success'})
