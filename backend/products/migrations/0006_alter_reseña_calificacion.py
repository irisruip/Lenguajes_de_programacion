# Generated by Django 5.1.3 on 2024-12-03 20:34

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_alter_producto_dimensiones_alter_producto_imagen_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reseña',
            name='calificacion',
            field=models.PositiveSmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
        ),
    ]
