from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.ChatGroup)
admin.site.register(models.GroupMessage)