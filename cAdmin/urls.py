from . view.cAdmin_products import create_product, products, products_edit
from django.urls import path, register_converter
from . view.cAdmin_brand import create_brand
from . view.cAdmin_packages import create_packages

class UnicodeSlugConverter:
    regex = r'[-\w\u0600-\u06FF]+'

    def to_python(self, value):
        return value
    
    def to_url(self, value):
        return value
    
register_converter(UnicodeSlugConverter, 'uslug')

urlpatterns = [
    path('products', products, name="cadmin_product"),
    path('product_edit/<int:pk>/<uslug:slug>', products_edit, name="cadmin_product_edit"),
    path('create', create_product, name="cadmin_create_product"),
    path('brand', create_brand, name="cadmin_create_brand"),
    path('packages', create_packages, name="cadmin_create_packages"),
]
