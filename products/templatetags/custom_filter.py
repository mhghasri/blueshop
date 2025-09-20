from django import template

register = template.Library()

# every filter is a function

@register.filter
def currency(price):
    try:
        return '{:,}'.format(int(price))
    
    except (ValueError, TypeError):
        return '{:,}'.format(price)