from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

# ------------------- Models ------------------- #

# --------------- AboutUs --------------- #

class AboutUs(models.Model):
    name = models.CharField(max_length=50)
    number = models.CharField(max_length=11)
    email = models.EmailField(max_length=254)
    adress = models.TextField(blank=True)
    about_us = CKEditor5Field(config_name="default")
    short_about_us = models.TextField(blank=True)

    def __str__(self):
        return f"About us | {self.name}"
    
    class Meta:
        verbose_name_plural = "About us List"

# --------------- MostQuestion --------------- #

class MostQuestion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Question | {self.title}"
    
    class Meta:
        verbose_name_plural = "Question List"

# --------------- link --------------- #

class Link(models.Model):
    title = models.CharField(max_length=50)
    link = models.CharField(max_length=200)

    def __str__(self):
        return f"Link | {self.title}"
    
    class Meta:
        verbose_name_plural = "Link List"
