from django.db import models

# Create your models here.

# Modelo de Item del Carrito
class Cart(models.Model):
    user_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def subtotal(self):
        return sum(item.total_price() for item in self.cart_items.all())

    def tax(self):
        return self.subtotal() * 0.1  # 10% de impuestos

    def total(self):
        return self.subtotal() + self.tax()

    def __str__(self):
        return f"Cart ({self.user.username})"
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='cart_items', on_delete=models.CASCADE)
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        return self.album.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.album.title} - {self.cart.user.username}"
