from django.shortcuts import render
from . models import *

# -------------- contact_us-------------- #

def contact_us(request):

    about_us = AboutUs.objects.first()

    context = {
        'about_us' : about_us,
    }

    return render(request, 'contact_us.html', context)

# -------------- about_us -------------- #

def about_us(request):

    # ----- query ----- # 

    about_us = AboutUs.objects.first()
    
    links = Link.objects.all()

    # ----- filters ----- # 

    telegram = links.get(title='telegram')

    instagram = links.get(title='instagram')

    context = {
        'about_us' : about_us,
        'links' : links,
        'telegram' : telegram,
        'instagram' : instagram,
    }

    return render(request, 'about_us.html', context)

# -------------- popular_question -------------- #

def questions(request):

    questions = MostQuestion.objects.all()

    context = {
        'questions' : questions,
    }

    return render(request, 'questions.html', context)