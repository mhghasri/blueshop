from django.contrib import admin
from . models import *

# -------------------- TabularInline -------------------- #

# ----------- AtributeInline ----------- #

class AttributeInline(admin.TabularInline):
    model = Attribute
    extra = 0

# ----------- GalleryInline ----------- #

class ImageGalleryInline(admin.TabularInline):
    model = ImageGallery
    extra = 0

# ----------- Warranty ----------- #

class WarrantyInline(admin.TabularInline):
    model = Warranty
    extra = 0

# -------------------- AdminModel -------------------- #

# ----------- Product ----------- #

class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "price", "discount", "final_price", "special_sells", "is_available"]
    inlines = [AttributeInline, ImageGalleryInline]

    fieldsets = [
        ("Information", {"fields" : ("title", "full_detail", "desciption", "image_1", "image_2", "is_available")}),
        ("Price", {"fields" : ("price", "discount")}),
        ("Special Sells", {"fields" : ("special_sells", )}),
        ("Brand", {"fields" : ("brand", )}),
        ("Category", {"fields" : ("categories", )}),
    ]

    filter_vertical = ("categories", )


# ----------- Packages ----------- #

class PackagesAdmin(admin.ModelAdmin):
    list_display = ["product", "final_price"]

    fieldsets = [
        ("Product", {'fields' : ("product", )}),
        ("Supplier", {'fields' : ("suppliers", )}),
        ("Color Detail", {'fields' : ("color_hex", "color_name")}),
        ("Price", {'fields' : ("price", )}),
    ]

    filter_vertical = ("suppliers", )

# ----------- Supplier ----------- #

class SupplierAdmin(admin.ModelAdmin):
    list_display = ["title"]

    inlines = [WarrantyInline]

    fieldsets = [
        ("Information", {"fields" : ("title", "description", "image")})
    ]

# ----------- Category ----------- #

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title", "parent"]

    fieldsets = [
        ("Information", {"fields": ("title", "slug", "parent")})
    ]

# ----------- Brand ----------- #

class BrandAdmin(admin.ModelAdmin):
    list_display = ["title"]

    fieldsets = [
        ("Information", {"fields" : ("title", "slug")})
    ]


admin.site.register(Brand, BrandAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Supplier, SupplierAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Warranty)
admin.site.register(Package, PackagesAdmin)
admin.site.register(ImageGallery)
admin.site.register(Attribute)
