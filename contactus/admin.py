from django import forms
from django.contrib import admin
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from . models import *

# ------------------- AdminModels ------------------- #

class AboutUsAdmin(admin.ModelAdmin):
    list_display = ['name', 'number', 'email', 'adress']

    fieldsets = [
        ('Information', {'fields' : ('name', 'number' )}),
        ('Email', {'fields' : ('email', )}),
        ('Adress', {'fields' : ('adress', )}), 
        ('About us', {'fields' : ('about_us', )}), 
        ('Short About us', {'fields' : ('short_about_us', )}), 
    ]

# --------------- AboutUs --------------- #

# ------------------- Register ------------------- #
admin.site.register(AboutUs, AboutUsAdmin)
admin.site.register(MostQuestion)
admin.site.register(Link)