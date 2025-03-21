from django.db import models

# Create your models here.

class Formato(models.TextChoices):
    DIGITAL = 'digital', 'Digital'
    CD = 'cd', 'CD'
    VINILO = 'vinilo', 'Vinilo'
    CASSETTE = 'cassette', 'Cassette'

# Modelo de Item del Carrito
class Carrito(models.Model):
    user_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'carritos'

    def subtotal(self):
        return sum(item.total_price() for item in self.cart_items.all())

    def tax(self):
        return self.subtotal() * 0.1  # 10% de impuestos

    def total(self):
        return self.subtotal() + self.tax()

    def __str__(self):
        return f"Cart ({self.user.username})"
    
class CarritoItem(models.Model):
    cart = models.ForeignKey(Carrito, related_name='cart_items', on_delete=models.CASCADE)
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)
    format = models.CharField(max_length=20, choices=Formato.choices, default=Formato.CD)
    price= models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'carrito_items'

    def total_price(self):
        return self.album.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.album.title} - {self.cart.user.username}"
