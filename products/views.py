from django.shortcuts import render, get_object_or_404
from . models import *

# -------------- products -------------- #

def products(request, slug=None):

    # ---------- query ---------- #
    products = Product.objects.all()
    categories = Category.objects.all()
    brands = Brand.objects.all()
    suppliers = Supplier.objects.all()

    # ---------- slug ---------- #

    if slug:

        if slug == "category":
            category = get_object_or_404(Category, slug=slug)
            products = products.filter(categories=category)

        elif slug == "brand":
            brand = get_object_or_404(Brand, slug=slug)
            products = products.filter(brand=brand)

        elif slug == "supplier":
            supplier = get_object_or_404(Supplier, slug=slug)
            products = products.filter(suppliers=supplier)

    

    # ---------- total ---------- #

    total = len(list(products))

    context ={
        "products" : products,
        "total" : total,
    }

    return render(request, "products.html", context)

# -------------- product-detail -------------- #

def product_detail(request, **kwargs):
    context = {

    }

    return render(request, "product_detail.html", context)