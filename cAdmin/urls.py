from django.urls import path
from . view.cAdmin_products import *

urlpatterns = [
    path('create', create_product, name="cadmin_create"),
]
