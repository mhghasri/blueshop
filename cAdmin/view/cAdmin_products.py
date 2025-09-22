from django.shortcuts import render
from products.models import *


def create_product(request):

    brands = Brand.objects.all()

    categories = Category.objects.all()

    suppliers = Supplier.objects.all()



    context = {
        "brands" : brands,
        "categories" : categories,
        "suppliers" : suppliers
    }

    if request.POST:

        Product.objects.create(
            title = request.POST.get('title'),
            full_detail = request.POST.get('full_detail'),
            description = request.POST.get('description'),
            price = int(request.POST.get('price')),
            discount = int(request.POST.get('discount')),
            image_1 = request.FILES['image_1'],
            image_2 = request.FILES['image_2'],
            special_sells = request.POST.get('special_sells'),
            is_available = request.POST.get('is_available'),
            brand = request.POST.get('brand'),
            categories = request.POST.get('categories'),
            suppliers = request.POST.get('categories')
        )

    return render(request, "cAdmin_product/create.html", context)