from django.shortcuts import render

def index(requeset):
    context = {

    }

    return render(requeset, "index.html", context)