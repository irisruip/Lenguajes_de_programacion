from django.urls import path
from order_service import views

#como deberia ser la ruta si se espera que se pase un id de orden
#urlpatterns = [
#    path('/<int:order_id>', views.create_order, name='create_order'),
#]


urlpatterns = [
    #crear una orden
    path('<int:user_id>/', views.create_order, name='create_order'),
    #obtener todas las ordenes
    path('/<int:user_id>/', views.get_orders, name='get_orders'),
    #obtener una orden por id
    path('<int:user_id>/<int:order_id>/', views.get_order, name='get_order'),
    #actualizar una orden
    path('<int:order_id>/status/', views.update_order, name='update_order'),


]
