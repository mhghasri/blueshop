from django.shortcuts import render, get_object_or_404
from . models import *
from django.core.paginator import Paginator
from django.db.models import F              # for setion views
from django.db.models import Count          # for count category

# Create your views here.

def articles(request, slug=None):
    
    # ---------- articles query ---------- #

    # articles = Article.objects.all()
    articles = Article.objects.select_related('author')      # article query foreignkey selected realation
    categories = Category.objects.all()


    # ---------- category query ---------- #

    if slug:
        category = get_object_or_404(Category, slug=slug)
        articles = articles.filter(categories=category)

    # ---------- sort ---------- #

    search = request.GET.get('q')

    if search:
        articles = articles.filter(title__icontains=search)
    
    # ---------- sort ---------- #

    sort = request.GET.get('sort')

    if sort == 'popular':
        articles = articles.order_by('-views')

    elif sort == 'newest':
        articles = articles.order_by('-created_at')

    elif sort == 'oldest':
        articles = articles.order_by('created_at')

    else:
        articles = articles.order_by('-views')

    # ---------- category ---------- #

    category_param = request.GET.get('category')

    if category_param:
        articles = articles.filter(category__slug=category_param)       # filter articles by they categories
    
    # ---------- paginator ---------- #

    paginator = Paginator(articles, 9)

    page_nmber = request.GET.get('page')

    articles = paginator.get_page(page_nmber)

    query_params = request.GET.copy()

    if 'page' in query_params:
        del query_params['page']

    query_string = query_params.urlencode()

    # ---------- total ---------- #

    count = len(list(articles))

    # ---- context ---- #

    context = {

        # articles
        'articles' : articles,

        # total
        'total' : count,

        # category
        'category' : categories,

        # pagination
        "base_url" : f"?{query_string}&" if query_string else "?",

        "clear_filter_url" : f"{request.path}?page={page_nmber}" if page_nmber else request.path,

    }

    return render(request, 'articles.html', context)

def article_details(request, **kwargs):

    articles = Article.objects.select_related('author')

    # category = Category.objects.all()

    category = Category.objects.annotate(article_count=Count('articles')).filter(parent__isnull = True) # Count('related_name')

    article = get_object_or_404(Article.objects.select_related('author').prefetch_related('attributes', 'images'), pk=kwargs['pk'])

    news = articles.exclude(pk=article.id)      # for dont show article to news list

    # ----- my solotion ----- #
    '''
    article.views += 1

    article.save(update_fields=['views'])
    
    '''
    # ----- with out cookies ----- #
    '''
    # viewed = request.session.get('viewed_articles', [])

    # if article.id not in viewed:

    #     # for add new view
    #     Article.objects.filter(pk=article.pk).update(views=F('views') + 1)

    #     # for show view to this render
    #     article.refresh_from_db(fields=['views'])

    #     # document this view to user
    #     viewed.append(article.id)
    #     request.session['viewed_articles'] = viewed
    
    '''

    context = {
        'articles' : articles,
        'article' : article,
        'news' : news,
        'images' : article.images.all(),
        'attributes' : article.attributes.all(),
        'category' : category,

    }

    # ----- cookies ----- #
    
    cookie_name = f'viewed_article_{article.id}'
    if not request.COOKIES.get(cookie_name):
        Article.objects.filter(pk=article.pk).update(views=F('views') + 1)
        article.refresh_from_db(fields=['views'])
        response = render(request, 'article_details.html', context)
        response.set_cookie(cookie_name, '1', max_age=60*60*24, httponly=True, samesite='Lax')
        return response   

    return render(request, 'article_details.html', context)