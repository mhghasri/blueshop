from django.shortcuts import render
from products.models import Brand, Category, Supplier

def create_brand(request):

    categories = Category.objects.all()

    context = {
        "categories" : categories
    }

    if request.POST:

        brand_title = request.POST.get('brand_title')
        category_title = request.POST.get('category_title')
        supplier_title = request.POST.get('supplier_title')

        if brand_title and brand_title != "":
            Brand.objects.create(
                title = brand_title,
                slug = request.POST.get('brand_slug')
            )

        if category_title and category_title != "":
            category_parent_id = request.POST.get('parent')
            parent_obj = None

            if category_parent_id and category_parent_id != "":
                parent_obj = Category.objects.get(pk=int(category_parent_id))

            Category.objects.create(
                title=category_title,
                slug = request.POST.get('category_slug'),

                parent = parent_obj
            )

        if supplier_title and supplier_title != "":
            Supplier.objects.create(
                title = supplier_title,
                description = request.POST.get('supplier_description'),
                image = request.FILES['image_1'],
                slug = request.POST.get("supplier_slug")
            )

    return render(request, "cAdmin_brand/brand.html", context)