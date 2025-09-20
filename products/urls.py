from django.urls import path, register_converter
from . views import *

# uslug
class UnicodeSlugConverter:
    regex = r'[-\w\u0600-\u06FF]+'

    def to_python(self, value):
        return value
    
    def to_url(self, value):
        return value
    
register_converter(UnicodeSlugConverter, 'uslug')

urlpatterns = [
    path('products', products, name="products"),
    path("products/category/<uslug:slug>",products, {"filter_by" : "category"},name="category"),
    path("products/supplier/<uslug:slug>", products, {"filter_by" : "supplier"}, name="supplier"),
    path("products/brand/<uslug:slug>", products, {"filter_by" : "brand"}, name="brand"),
    path('product/<int:pk>/<uslug:slug>', product_detail, name="product_detail")
]
