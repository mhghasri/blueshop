from . view.cAdmin_packages import create_packages, packages, product_packages, edit_product_package
from . view.cAdmin_products import create_product, products, products_edit
from django.urls import path, register_converter
from . view.cAdmin_brand import create_brand

class UnicodeSlugConverter:
    regex = r'[-\w\u0600-\u06FF]+'

    def to_python(self, value):
        return value
    
    def to_url(self, value):
        return value
    
register_converter(UnicodeSlugConverter, 'uslug')

urlpatterns = [

    # *----- create-product-edit -----* #
    path('create', create_product, name="cadmin_create_product"),
    path('products', products, name="cadmin_product"),
    path('product_edit/<int:pk>/<uslug:slug>', products_edit, name="cadmin_product_edit"),
    # *----- end create-product-edit -----* #

    # *----- create-brand -----* #
    path('brand', create_brand, name="cadmin_create_brand"),
    # *----- end create-brand -----* #

    # *----- create-packages-edit -----* #
    path('create/package', create_packages, name="cadmin_create_packages"),
    path('packages', packages, name="cadmin_packages"),
    path('product_packages/<int:pk>/<uslug:slug>', product_packages, name="cadmin_product_packages"),
    path('product_edit_package/<int:pk>/<uslug:slug>', edit_product_package, name="cadmin_product_edit_package")
    # *----- end create-packages-edit -----* #
]
