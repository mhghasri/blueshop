from django.urls import path
from . views import *

urlpatterns = [
    path('contactus', contact_us, name='contact_us'),
    path('aboutus', about_us, name='about_us'),
    path('questions', questions, name='questions')
]
