from django.contrib import admin
from django.contrib import admin
from . models import *

# -------------------- BannerModel -------------------- #

class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'product', 'brand', 'category']

    fieldsets = [
        ('Information', {'fields' : ('title', 'image')}),
        ('Brand/Product/Category', {'fields' : ('brand', 'product', 'category')}),
    ]

# -------------------- register -------------------- #

admin.site.register(Banner, BannerAdmin)