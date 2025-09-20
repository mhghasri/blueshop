from django.shortcuts import render

# -------------- products -------------- #

def products(request):
    context ={

    }

    return render(request, "products.html", context)

# -------------- product-detail -------------- #

def product_detail(request, **kwargs):
    context = {

    }

    return render(request, "product_detail.html", context)