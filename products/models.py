from django.db.models import Q, Min, Max        # for aggrigate price
from django.utils.text import slugify
from django.db import models
import random
import string
import os

# ------------------------ function ------------------------ #

# --------- uploads to --------- #

def product_image_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"products/django-image-{random_string}{ext}"

def product_gallery_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"products/gallery/django-image-{random_string}{ext}"

def supplier_image_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"supplier/image/django-image-{random_string}{ext}"
# ------------------------ Models ------------------------ #

# --------- Brand Model --------- #

class Brand(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Brand | {self.title}"

# --------- Category Model --------- #

class Category(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="children")

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Category | {self.title}"

# --------- Supplier Model --------- #

class Supplier(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to=supplier_image_path)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"supplier | {self.title}"

# --------- Product Model --------- #
class Product(models.Model):
    title = models.CharField(max_length=100)
    full_detail = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.IntegerField()
    discount = models.IntegerField(default=0)
    final_price = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    image_1 = models.ImageField(upload_to=product_image_path)
    image_2 = models.ImageField(upload_to=product_image_path)
    special_sells = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    slug = models.SlugField(unique=True, blank=True, allow_unicode=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="product_brand")
    categories = models.ManyToManyField(Category, related_name="product_category")
    suppliers = models.ManyToManyField(Supplier, related_name="product_supplier")

    def save(self, *args, **kwargs):

        
        if self.pk:
            old_discount = Product.objects.filter(pk=self.pk).values_list('discount', flat=True).first()

            if self.discount!=old_discount:
                for p in self.product_package.all():
                    p.final_price = int(p.price - (p.price * self.discount / 100))
                    p.save(update_fields=['final_price'])
        else:
            self.final_price = int(self.price - (self.price * self.discount / 100))

        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)

        return super().save(*args, **kwargs)
    
    def __str__(self):
        return f"product | {self.title}"
    
    class Meta:
        verbose_name_plural = "Product List"

# --------- Warranty Model --------- #

class Warranty(models.Model):
    month = models.IntegerField()
    price = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="warranty_supplier")
    # product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="warranty_product")

    def __str__(self):
        return f"Warranty | {self.supplier.title} | {self.month}"
# --------- Package Model --------- #

class Package(models.Model):
    color_hex = models.CharField(max_length=7)
    color_name = models.CharField(max_length=100)
    price = models.IntegerField()
    final_price = models.IntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_package")
    suppliers = models.ManyToManyField(Supplier, related_name="supplier_package")

    def save(self, *args, **kwargs):
        self.final_price = int(self.price - (self.price * self.product.discount / 100))
        super().save(*args, **kwargs)

        min_price = self.product.product_package.aggregate(min=Min('final_price'))['min']

        if min_price != None and min_price != self.product.final_price:
            self.product.price = self.price
            self.product.final_price = min_price
            self.product.save()

    def __str__(self):
        return f"Product | {self.product.title} | {self.color_name}"
    
    class Meta:
        verbose_name_plural = "Package List"

# --------- ImageGallery Model --------- #

class ImageGallery(models.Model):
    image = models.ImageField(upload_to=product_gallery_path)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="imagegallery")

# --------- Attribute Model --------- #

class Attribute(models.Model):
    title = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="attribute")
    