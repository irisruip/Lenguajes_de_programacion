from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def create_order(request, user_id):
    return JsonResponse({'status': 'success'})

def get_orders(request, user_id):
    return JsonResponse({'status': 'success'})

def get_order(request, user_id, order_id):
    return JsonResponse({'status': 'success'})

def update_order(request, order_id):
    return JsonResponse({'status': 'success'})
