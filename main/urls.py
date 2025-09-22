from django.conf.urls.static import static
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from . views import *


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name="index"),
    path('', include("products.urls")),
    path('cadmin/', include("cAdmin.urls"))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)