from django.urls import path
from order_service import views

#como deberia ser la ruta si se espera que se pase un id de orden
#urlpatterns = [
#    path('/<int:order_id>', views.create_order, name='create_order'),
#]


urlpatterns = [
    #crear una orden
    path('get_orders/<int:user_id>/', views.get_orders, name='get_orders'),
    path('get_order_items/<int:order_id>/', views.get_order_items, name='get_order_items'),
    path('get_order/<int:order_id>/', views.get_order, name='get_order'),
    path('create_order/<int:user_id>/', views.create_order, name='create_order'),

]
