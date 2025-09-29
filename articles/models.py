from django.utils.text import slugify
from django.db import models
import string
import random
import os

# ------------------------ function ------------------------ #

# --------- uploads to --------- #

def article_image_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"articles/django-image-{random_string}{ext}"

def article_gallery_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"articles/gallery/django-image-{random_string}{ext}"

# -------------- Author -------------- # 

class Author(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Author name | {self.name}"

# -------------- Category -------------- #

class Category(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, blank=True, null=True, related_name="child")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Article | {self.name}"

# -------------- Article -------------- #

class Article(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateField(auto_now_add=True)
    image = models.ImageField(upload_to=article_image_path, default='articles/placeholder.png')
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='articles_author')
    categories = models.ManyToManyField(Category, related_name="articles")
    views = models.PositiveIntegerField(default=0)      # for views from users
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    is_news = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Article | {self.title} --- {self.author.name} --- {self.categories.name}"
    
    class Meta:
        verbose_name_plural = "Article List"

# -------------- Attributes -------------- # 

class Attribute(models.Model):
    name = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='attributes')

    def __str__(self):
        return f"Article | {self.article.title} --- {self.name}"
    
# -------------- ImageGallery -------------- # 

class ArticleImage(models.Model):
    image = models.ImageField(upload_to=article_gallery_path)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='images')

    def __str__(self):
        return f"Article | {self.article.title}"