from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

import json

@csrf_exempt
def registro(request):
    return JsonResponse({'status': 'exito al acceder a la ruta de registro'})

@csrf_exempt
def login(request):
    return JsonResponse({'status': 'exito al acceder a la ruta de login'})
 
