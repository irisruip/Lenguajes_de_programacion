# Generated by Django 5.1.3 on 2025-03-21 16:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shopping_cart_service', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='carrito',
            table='carritos',
        ),
        migrations.AlterModelTable(
            name='carritoitem',
            table='carrito_items',
        ),
    ]
