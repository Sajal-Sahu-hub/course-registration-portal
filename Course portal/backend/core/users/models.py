from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('admin', 'Admin')], default='user')

    def __str__(self):
        return self.username
    