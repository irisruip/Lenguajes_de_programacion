from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):
    AbstractUser._meta.get_field('email')._unique = True
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    pais=models.CharField(max_length=255,blank=True,null=True)
    ciudad=models.CharField(max_length=255,blank=True,null=True)
    codigo_postal = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)

    # Agregar related_name a los campos de grupos y permisos
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True,
        help_text='Los grupos a los que pertenece este usuario.',
        verbose_name='grupos'
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_set',
        blank=True,
        help_text='Permisos específicos para este usuario.',
        verbose_name='permisos de usuario'
    )
    
    class Meta:
        db_table = 'usuarios'
    
    def __str__(self):
        return self.nombre
