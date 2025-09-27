from django.shortcuts import render, get_object_or_404, redirect
from products.models import *

# ------ products ------ #

def products(request):

    # products_data = Product.objects.values('pk', 'slug', 'image_1', 'title', 'price', 'discount', 'final_price', 'special_sells', 'is_available')
                                                            # image make conflict and dont showing
    
    products_data = Product.objects.all().order_by('-created_at')

    context = {
        "products_data" : products_data,
    }

    return render (request, "cAdmin_product/products.html", context)

# ------ product_edits ------ #

def products_edit(request, **kwargs):

    product_detail = get_object_or_404(Product.objects.select_related('brand').prefetch_related('categories', 'product_package', 'imagegallery', 'attribute'), pk=kwargs['pk'])


    # exclude product category
    product_categories_pks = product_detail.categories.values_list('pk', flat=True)     # value_list -> [(1, ), (2, ), (3, )] --- flat=True -> [1, 2, 3]

    all_categories = Category.objects.all().exclude(pk__in=product_categories_pks)


    # ecclude product suppliers
    product_suppliers_pks = product_detail.suppliers.values_list('pk', flat=True)

    all_suppliers = Supplier.objects.all().exclude(pk__in=product_suppliers_pks)

    all_brnads = Brand.objects.all().exclude(pk=product_detail.brand.pk)

    context = {
        "product" : product_detail,
        "attributes" : product_detail.attribute.all(),
        "imagegallery" : product_detail.imagegallery.all(),
        "product_categories" : product_detail.categories.all(),
        'product_suppliers' : product_detail.suppliers.all(),
        'categories' : all_categories,
        'suppliers' : all_suppliers,
        'brands' : all_brnads
    }

    if request.POST:

        update_fields = {}

        title = request.POST.get('title')
        full_detail = request.POST.get('full_detail')
        description = request.POST.get('description')
        price = request.POST.get('price')
        discount = request.POST.get('discount')
        special_sells = request.POST.get('special_sells')
        is_available = request.POST.get('is_available')
        description = request.POST.get('description')

        image_1 = request.FILES.get('image_1')
        image_2 = request.FILES.get('image_2')

        brand_id = request.POST.get('brand')
        brand_obj = None

        if brand_id and brand_id != "":
            brand_obj = Brand.objects.get(pk=int(brand_id))

        
        # make a dictionary for update
        if title and title != product_detail.title:
            update_fields['title'] = title
        
        if full_detail and full_detail != product_detail.full_detail:
            update_fields['full_detail'] = full_detail

        if description and description != product_detail.description:
            update_fields['description'] = description


        # numeric data
        if price and price.isdigit():

            price = int(price)

            if price != product_detail.price:
                update_fields['price'] = price

        if discount and discount.isdigit():

            discount = int(discount)
            
            if discount != product_detail.discount:
                update_fields['discount'] = discount

        if (special_sells == "on") != product_detail.special_sells:
            update_fields['special_sells'] = (special_sells == "on")

        if (is_available == "on") != product_detail.is_available:
            update_fields['is_available'] = (is_available == "on")

        if brand_obj and brand_obj.pk != product_detail.brand.pk:
            update_fields['brand'] = brand_obj

        # for files and images
        if image_1:
            product_detail.image_1.delete(save=False)
            product_detail.image_1 = image_1

        if image_2:
            product_detail.image_2.delete(save=False)
            product_detail.image_2 = image_2


        # assign new data to update fields and value
        for field, value in update_fields.items():
            setattr(product_detail, field, value)

        product_detail.save()

        # get ids with id list
        selected_categories_ids = request.POST.getlist('selected_categories')
        selected_suppliers_ids = request.POST.getlist('selected_suppliers')


        # make many to many relations

        if selected_categories_ids:
            product_detail.categories.set(selected_categories_ids)

        if selected_suppliers_ids:
            product_detail.suppliers.set(selected_suppliers_ids)


        # handdle image gallery
        gallery_images = request.FILES.getlist('gallery_images')

        if gallery_images:

            product_detail.imagegallery.all().delete()

            for image_file in gallery_images:
                ImageGallery.objects.create(
                    image = image_file,
                    product = product_detail
                )

        # handdle attributes
        attribute_titles = request.POST.getlist('attribute_titles')
        attribute_values = request.POST.getlist('attribute_values')

        # فقط وقتی کاربر حداقل یک attribute جدید وارد کرده
        has_new_attributes = any(title.strip() for title in attribute_titles) and any(value.strip() for value in attribute_values)

        if has_new_attributes:

            # پاک کردن attributeهای قبلی
            product_detail.attribute.all().delete()

            if len(attribute_titles) == len(attribute_values):
                for title, value in zip(attribute_titles, attribute_values):
                    if title.strip() and value.strip(): # make sure its not empty
                        Attribute.objects.create(
                            title=title,
                            value=value,
                            product=product_detail
                        )

        if update_fields or selected_categories_ids or selected_suppliers_ids:

            return redirect('cadmin_product')



    return render(request, "cAdmin_product/product_edit.html", context)

# ------ create_products ------ #

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


        # handdle image gallery
        gallery_images = request.FILES.getlist('gallery_images')
        for image_file in gallery_images:
            ImageGallery.objects.create(
                image = image_file,
                product = product
            )

        # handdle attributes
        attribute_titles = request.POST.getlist('attribute_titles')
        attribute_values = request.POST.getlist('attribute_values')

        # make sure value len and title len are equal
        if len(attribute_titles) == len(attribute_values):
            for i in range(len(attribute_titles)):
                if attribute_titles[i] and attribute_values[i]: # make sure they are not empty
                    Attribute.objects.create(
                        title = attribute_titles[i],
                        value = attribute_values[i],
                        product = product
                    )



    return render(request, "cAdmin_product/create.html", context)