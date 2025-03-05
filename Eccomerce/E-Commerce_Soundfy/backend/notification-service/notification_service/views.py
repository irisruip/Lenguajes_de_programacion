from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services import send_sms
import json

# Create your views here.
@csrf_exempt
def send_notification(request):
    data = json.loads(request.body)
    print(data)
    to = data.get('to')
    message = data.get('message')
    print(to, message)
    send_sms(to, message)
    return JsonResponse({'status': 'success'})
