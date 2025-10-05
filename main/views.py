from django.http import JsonResponse
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

# def search_ajax(request):
#     search = request.POST.get('q')

#     data = []

#     if search:
#         products = Product.objects.filter(title__icontains = search)

#         for product in products:
#             data.append({
#                 "title" : product.title,
#                 "pk" : product.pk,
#                 "slug" : product.slug
#             })

#         return JsonResponse(data, status=200, safe=False)
    
#     return JsonResponse({}, status=404)

def search_ajax(request):
    # اطمینان از اینکه درخواست از نوع POST است
    if request.method == 'POST':
        search = request.POST.get('q')

        data = []

        if search:
            # بهتر است تعداد نتایج را محدود کنید (مثلاً 5 مورد) و تنها فیلدهای مورد نیاز را بگیرید
            products = Product.objects.filter(title__icontains=search).values('title', 'pk', 'slug')[:5]

            for product in products:
                data.append({
                    "title": product['title'],
                    "pk": product['pk'], # PK در فرانت‌اند ضروری نیست
                    "slug": product['slug'] 
                })

            # در صورت موفقیت‌آمیز بودن جستجو، داده‌ها را حتی اگر لیست خالی باشد، برگردانید
            return JsonResponse(data, status=200, safe=False)
        
        # اگر کوئری جستجو (search) خالی بود، یک لیست خالی برگردانید
        return JsonResponse(data, status=200, safe=False)
    
    # اگر متد POST نبود
    return JsonResponse({"error": "Invalid request method"}, status=405)