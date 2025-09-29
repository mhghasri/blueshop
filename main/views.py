from django.shortcuts import render
from products.models import Product
from articles.models import Article
from banners.models import *

def index(request):

    # ----- query ----- #
    products = Product.objects.all()

    articles = Article.objects.all()

    banners = Banner.objects.select_related('brand', 'category', 'product').order_by('-created_at')

    # ----- special sells ----- #

    only_discounted = products.filter(discount__gt=0)

    new_products = products.order_by('-created_at')

    popular_articles = articles.order_by('-views')
    
    context = {
        'banners' : banners,
        'products' : products,
        'articles' : articles,
        'only_discounted' : only_discounted,
        'new_products' : new_products,
        'popular_articles' : popular_articles,
    }
    return render(request, 'index.html', context)