from django.shortcuts import render, redirect
from products.models import Product, Supplier, Package

def create_packages(request):

    products = Product.objects.values_list('pk', 'title').order_by('-created_at')

    suppliers = Supplier.objects.values_list('pk', 'title')

    context = {
        'products' : products,
        'suppliers' : suppliers
    }

    if request.POST:
        color_hex = request.POST.get('color_hex')
        color_name = request.POST.get('color_name')
        price = request.POST.get('price')

        # get id
        product_id = request.POST.get('product_pk')
        product_obj = None

        selected_supplier_id = request.POST.getlist('supplier_pk')

        # make object
        product = Product.objects.get(pk=int(product_id))
        product_obj = product

        product = Package.objects.create(
            color_hex = color_hex,
            color_name = color_name,
            price = int(price),
            product = product_obj,
        )

        product.suppliers.set(selected_supplier_id)


    return render(request, "cAdmin_package/package.html", context)