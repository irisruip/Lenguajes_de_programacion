from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class Producto(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=20, decimal_places=2)
    descuento = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    stock = models.PositiveIntegerField()
    categoria = models.ForeignKey('Categoria', on_delete=models.CASCADE, related_name='productos')
    marca = models.CharField(max_length=100)
    imagen = models.URLField(max_length=500)
    dimensiones = models.OneToOneField(
        'Dimensiones',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='producto'
    )
    estado_disponibilidad = models.CharField(max_length=50)
    politica_devolucion = models.CharField(max_length=200)
    cantidad_minima = models.PositiveIntegerField()
    sku = models.CharField(max_length=20, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo
    
class Dimensiones(models.Model):
    ancho = models.DecimalField(max_digits=5, decimal_places=2)
    alto = models.DecimalField(max_digits=5, decimal_places=2)
    profundidad = models.DecimalField(max_digits=5, decimal_places=2)
    peso = models.DecimalField(max_digits=5, decimal_places=2)
    def __str__(self):
        return f'{self.ancho} x {self.alto} x {self.profundidad}'
    # Aquí se añade related_name para evitar conflictos

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre
    
