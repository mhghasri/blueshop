from django.urls import path
from . view.cAdmin_products import create_product
from . view.cAdmin_brand import create_brand

urlpatterns = [
    path('create', create_product, name="cadmin_create_product"),
    path('brand', create_brand, name="cadmin_create_brand")
]
