from django.contrib import admin
from .models import Usuario, Categoria , Producto, Dimensiones, Resena 
# Register your models here.
admin.site.register(Usuario)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Dimensiones)
admin.site.register(Resena) 