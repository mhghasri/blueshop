from django.db import models
from django.urls import reverse     # for making dynamic url for banner
from urllib.parse import urlencode  # for making dynamic url for banner

'''
reverse: برای اینه که ما وقتی یک یو آر ال تعریف کردیم بتوانیم بر اساس آن به اون یو آر ال لینک بزنیم به وسیله کلاس اتریبیوت های اون آبجکت
urlencode: وظیفه اش اینه که وقتی ما بهش یک دیکشنری میدیم بر اساس کی و ولیو که میگیره برای ما انکد آنرا انجام میدهد
'''

# Create your models here.
from products.models import Brand, Product, Category
from django.core.exceptions import ValidationError
from django.db import models
import os
import random
import string

# ------------------------ function ------------------------ #

# --------- uploads to --------- #

def banner_image_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    random_string = ''.join(random.choices(string.ascii_letters, k=10))
    return f"banner/django-image-{random_string}{ext}"

# ------------------------ Models ------------------------ #

# --------- Brand Model --------- #

class Banner(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to=banner_image_path)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='banner_brand', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='banner_product', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='banner_category', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def dynamic_url(self):      # product_id just need pk of prduct but when we use . like product.slug we access to object and get query for this
        if self.product_id:
            return reverse('product_detail', args=(self.product_id, self.product.slug))
        
        base = reverse ('products')
        
        if self.brand_id:
            return f"{base}?{urlencode({'brand': self.brand.slug})}"        # url encoded by urlencode -> {base}?brnad=brand.slug
        
        if self.category_id:
            return reverse('category', args=(self.category.slug, ))
        
        
        return base

    def clean(self):
        '''this function is for admin just use one of the brnad/product/category'''
        fields = [bool(self.brand), bool(self.product), bool(self.category)]

        if sum(fields) != 1:
            raise ValidationError("لطفا فقط یکی از موارد برند، دسته بندی و یا محصول را انتخاب کنید.")

    def __str__(self):
        return f"Banner | {self.title}"
    
    class Meta:
        verbose_name_plural = "لیست بنر ها"
