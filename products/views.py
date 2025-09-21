from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q, Min, Max
from django.urls import reverse
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
        
        category = get_object_or_404(Category, slug=slug)
        products = products.filter(categories = category)

    # ---------- price range ---------- #

    min_price_range = request.GET.get('min_price_range')

    max_price_range = request.GET.get('max_price_range')

    if min_price_range and max_price_range:
        products = products.filter(
            Q(final_price__gte=int(min_price_range)) & Q(final_price__lte=int(max_price_range))
        )

    # ---------- search ---------- #

    search = request.GET.get("q")

    if search:
        products = products.filter(title__icontains=search)

    # ---------- only available ---------- #

    only_available = request.GET.get('only_available')

    if only_available:
        products = products.filter(is_available=True)

    # ---------- discounted ---------- #

    only_discounted = request.GET.get('only_discounted')

    if only_discounted:
        products = products.filter(discount__gt = 0)

    # ---------- sort ---------- #

    sort = request.GET.get('sort')

    if sort == 'newest':
        products = products.order_by('-created_at')

    if sort == 'oldest':
        products = products.order_by('created_at')

    if sort == 'cheap':
        products = products.order_by('final_price')

    if sort == 'expensive' :
        products = products.order_by('-final_price')
    
    # ---------- brand ---------- #

    brand_params = request.GET.get('brand')

    if brand_params:

        products = products.filter(brand__slug=brand_params)

    # ---------- paginator ---------- #

    supplier_params = request.GET.get('supplier')

    if supplier_params:
        products = products.filter(suppliers__slug=supplier_params)

    # ---------- paginator ---------- #

    paginator = Paginator(products, 9)

    page_number = request.GET.get('page')

    products = paginator.get_page(page_number)

    query_params = request.GET.copy()

    if 'page' in query_params:
        del query_params['page']

    query_string = query_params.urlencode()

    # ---------- total ---------- #

    total = len(list(products))

    context ={

        #query
        "products" : products,
        
        "brands" : brands,

        "categories" : categories,

        "suppliers" : suppliers,

        # paginator
        'base_url' : f"?{query_string}&" if query_string else "?",

        # total
        "total" : total,
    }

    return render(request, "products.html", context)

# -------------- product-detail -------------- #

def product_detail(request, **kwargs):
    context = {

    }

    return render(request, "product_detail.html", context)