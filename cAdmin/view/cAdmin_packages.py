from django.shortcuts import render, redirect, get_object_or_404
from products.models import Product, Supplier, Package


# *------------- create package -------------* #
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


    return render(request, "cAdmin_package/create_package.html", context)

# *------------- end create package -------------* #

# *------------- packages -------------* #

def packages(request):
    products_data = Product.objects.all().order_by('-created_at')

    context = {
        "products_data" : products_data,
    }

    return render(request, "cAdmin_package/packages.html", context)

# *------------- end packages -------------* #

# *------------- product_packages -------------* #

def product_packages(request, **kwargs):

    product = get_object_or_404(Product.objects.prefetch_related('product_package', 'suppliers'), pk=kwargs['pk'])

    packages = []

    for pkg in product.product_package.all():
        final_price = int(pkg.price - (pkg.price * product.discount / 100))

        packages.append({
            'package' : pkg,
            'final_price' : final_price
        })

    context = {
        'product' :product,
        'packages' : packages
    }

    return render(request, "cAdmin_package/product_package.html", context)

# *------------- end product_packages -------------* #

# *------------- product_package_edit -------------* #

def edit_product_package(request, **kwargs):
    context = {

    }

    return render(request, "cAdmin_package/edit_product_package.html", context)
# *------------- end product_package_edit -------------* #
