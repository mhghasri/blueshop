from django import template
from django.utils import timezone
from persiantools.jdatetime import JalaliDate, JalaliDateTime

register = template.Library()

@register.filter
def to_jalali(value, fmt='%Y/%m/%d'):
    if not value:
        return ''
    try:
        value = timezone.localtime(value)
    except Exception:
        pass
    # Datetime vs Date
    if hasattr(value, 'hour'):
        return JalaliDateTime(value).strftime(fmt)
    return JalaliDate(value).strftime(fmt)