from django.shortcuts import render, redirect, get_object_or_404
from articles.models import Article, Author, Category

# *--------------* start of articles *--------------* #

def articles(request):

    articles = Article.objects.all()

    for article in articles:
        print(article.categories.last().name)

    context = {
        'articles' : articles
    }

    return render(request, 'cAdmin_articles/articles.html', context)

# *--------------* end of articles *--------------* #

# *--------------* start of article_edit *--------------* #

def article_edit(request, **kwargs):

    context = {

    }

    return render(request, 'cAdmin_articles/article_edit.html', context)

# *--------------* end of article_edit *--------------* #

# *--------------* start of create_article *--------------* #

def create_article(request):

    authors = Author.objects.all()

    categories = Category.objects.all()

    context = {
        'authors' : authors,
        'categories' : categories
    }

    return render(request, 'cAdmin_articles/create_article.html', context)

# *--------------* end of create_article *--------------* #

