from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, default='')
    last_name = models.CharField(max_length=255, default='')
    middle_name = models.CharField(max_length=50, default='', null=True)
    organization = models.CharField(max_length=250, default='')
    country = models.CharField(max_length=100, default='')
    email = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.user.username
