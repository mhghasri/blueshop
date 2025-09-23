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

        title = request.POST.get('title')
        full_detail = request.POST.get('full_detail')
        description = request.POST.get('description')
        price = int(request.POST.get('price'))
        discount = int(request.POST.get('discount'))
        image_1 = request.FILES['image_1']
        image_2 = request.FILES['image_2']
        special_sells = request.POST.get('special_sells') == "on"   # if check box == on make true
        is_available = request.POST.get('is_available') == "on"

        brand_id = request.POST.get('brand')
        brand_obj = None                                            # if user dont use brand this make error None type for make int brnad_id this secure error

        if brand_id and brand_id != "":
            brand_obj = Brand.objects.get(pk=int(brand_id))

        product = Product.objects.create(
            title = title,
            full_detail = full_detail,
            description = description,
            price = price if price else 0,
            discount = discount if discount else 0,
            image_1 = image_1,
            image_2 = image_2,
            special_sells = special_sells,
            is_available = is_available,

            brand = brand_obj

        )
        
        # get ids with id list
        selected_categories_ids = request.POST.getlist('categories')
        selected_suppliers_ids = request.POST.getlist('suppliers')


        # make many to many relations
        product.categories.set(selected_categories_ids)
        product.suppliers.set(selected_suppliers_ids)



    return render(request, "cAdmin_product/create.html", context)