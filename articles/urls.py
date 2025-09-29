from django.urls import path, register_converter
from . views import articles, article_details

class UnicodeSlugConverter:
    regex = r'[-\w\u0600-\u06FF]+'

    def to_python(self, value):
        return value
    
    def to_url(self, value):
        return value

register_converter(UnicodeSlugConverter, 'uslug')

urlpatterns = [
    path('articles', articles, name='articles'),
    path('articles/category/<uslug:slug>', articles, name="article_category"),
    path('article/<int:pk>/<uslug:slug>', article_details, name='article_details')
]
