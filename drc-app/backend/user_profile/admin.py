from django.contrib import admin

from .models import UserProfile


class UserProfileAdmin(admin.ModelAdmin):
    fields = ['last_name', 'first_name', 'middle_name', 'organization', 'country', 'email']

admin.site.register(UserProfile, UserProfileAdmin)

