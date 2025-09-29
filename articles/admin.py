from django.contrib import admin

# Register your models here.
from django.contrib import admin
from . models import *

# -------------- Inline -------------- #

class AttributeInline(admin.TabularInline):
    model = Attribute
    extra = 0

class ImageInline(admin.TabularInline):
    model = ArticleImage
    extra = 0

# -------------- Admin -------------- #

class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'views']

    inlines = [AttributeInline, ImageInline]

    fieldsets = [
        ('Information', {'fields' : ('title', 'description', 'image', 'is_news')}),
        ('Author', {'fields' : ('author', )}),
        ('Category', {'fields' : ('categories', )}),
    ]

    filter_vertical = ("categories", )

# -------------- register -------------- #

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

# -------------- register -------------- #

admin.site.register(Author)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Article, ArticleAdmin)
admin.site.register(Attribute)
admin.site.register(ArticleImage)