from django.db import models
from django.db import models

class Formato(models.TextChoices):
    DIGITAL = 'digital', 'Digital'
    CD = 'cd', 'CD'
    VINILO = 'vinilo', 'Vinilo'
    CASSETTE = 'cassette', 'Cassette'

class EstadoPedido(models.TextChoices):
    PENDIENTE = 'Pendiente', 'Pendiente'
    PROCESANDO = 'Procesando', 'Procesando'
    ENVIADO = 'Enviado', 'Enviado'
    ENTREGADO = 'Entregado', 'Entregado'
    CANCELADO = 'Cancelado', 'Cancelado'

class Pedido(models.Model):
    usuario_id = models.IntegerField()
    numero = models.CharField(max_length=20, unique=True)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=EstadoPedido.choices, default=EstadoPedido.PENDIENTE)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'pedidos'


    def __str__(self):
        return f"Pedido #{self.numero} - {self.usuario}" 

class PedidoItem(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto_id = models.IntegerField()
    cantidad = models.PositiveIntegerField()

    class Meta:
        db_table = 'pedidos_items'

    def subtotal(self):
        return self.cantidad * self.producto.precio

    def __str__(self):
        return f"{self.producto.titulo} x{self.cantidad}"