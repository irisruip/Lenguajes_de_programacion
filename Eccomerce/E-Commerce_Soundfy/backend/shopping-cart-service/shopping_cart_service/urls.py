from django.urls import path
from shopping_cart_service import views

urlpatterns = [
    path('agregar_item/', views.add_to_cart, name='agregar_item'),
    path('ver_carrito/<int:usuario_id>/', views.get_cart, name='ver_carrito'),
    path('eliminar_carrito/<int:usuario_id>/', views.delete_cart, name='eliminar_carrito'),
    path('eliminar_item/<int:usuario_id>/<int:producto_id>/', views.delete_item, name='eliminar_item'),
]