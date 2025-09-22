
(function(){
const TRANSITION_MS = 200;
const BUFFER_MS = 50;
let timerAv = null, timerDis = null;

function applyParamAfterDelay(name, checked, value, delay, timerRefName) {
    // لغو درخواست قبلی
    if (window[timerRefName]) clearTimeout(window[timerRefName]);

    window[timerRefName] = setTimeout(() => {
    const url = new URL(window.location.href);
    const p = url.searchParams;

    if (checked) p.set(name, value);
    else p.delete(name);

    p.delete('page'); // هر تغییر -> صفحه 1
    url.search = p.toString();
    window.location.assign(url.toString());
    }, delay);
}

const swAvail = document.getElementById('switch-available');
const swDisc  = document.getElementById('switch-discounted');

if (swAvail) {
    swAvail.addEventListener('change', function(){
    applyParamAfterDelay(this.name, this.checked, this.value, TRANSITION_MS + BUFFER_MS, 'timerAv');
    });
}

if (swDisc) {
    swDisc.addEventListener('change', function(){
    applyParamAfterDelay(this.name, this.checked, this.value, TRANSITION_MS + BUFFER_MS, 'timerDis');
    });
}
})();

// <!--price slider-->
(function () {
const RANGE_MIN = 0;
const RANGE_MAX = 200000000; // مقدار جدید برای محدوده
const DELAY_MS  = 300;

const content  = document.getElementById('content-3');
const iconWrap = document.getElementById('icon-3');
const iconSvg  = iconWrap ? iconWrap.querySelector('svg') : null;

const minRange = content?.querySelector('.min-range[name="min_price_range"]');
const maxRange = content?.querySelector('.max-range[name="max_price_range"]');
const minOut   = content?.querySelector('.min-input');
const maxOut   = content?.querySelector('.max-input');
const prog     = content?.querySelector('.progress');

const fmt = n => Number(n).toLocaleString('fa-IR');
const isDefault = () => (+minRange.value === RANGE_MIN && +maxRange.value === RANGE_MAX);

function openAcc() {
    if (!content) return;
    content.dataset.open = '1';
    content.classList.remove('max-h-0');
    content.style.maxHeight = '0px';
    requestAnimationFrame(() => {
    content.style.maxHeight = content.scrollHeight + 'px';
    });
    iconSvg?.classList.add('rotate-90');
}
function closeAcc() {
    if (!content) return;
    content.dataset.open = '0';
    iconSvg?.classList.remove('rotate-90');
    content.style.maxHeight = '0px';
    content.classList.add('max-h-0');
}

function updateUI() {
    const a = +minRange.value, b = +maxRange.value;
    if (minOut) minOut.textContent = fmt(a);
    if (maxOut) maxOut.textContent = fmt(b);
    if (prog) {
    const left  = ((a - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
    const right = 100 - ((b - RANGE_MIN) / (RANGE_MAX - RANGE_MIN)) * 100;
    prog.style.left  = left + '%';
    prog.style.right = right + '%';
    }
}
function normalize(which) {
    const a = +minRange.value, b = +maxRange.value;
    if (a > b) { if (which === 'min') maxRange.value = a; else minRange.value = b; }
}

function hydrate() {
    const url = new URL(location.href); const q = url.searchParams;
    let a = q.has('min_price_range') ? +q.get('min_price_range') : RANGE_MIN;
    let b = q.has('max_price_range') ? +q.get('max_price_range') : RANGE_MAX;
    a = Math.max(RANGE_MIN, Math.min(a, RANGE_MAX));
    b = Math.max(RANGE_MIN, Math.min(b, RANGE_MAX));
    if (a > b) [a, b] = [b, a];

    minRange.value = a; maxRange.value = b; updateUI();

    if (a !== RANGE_MIN || b !== RANGE_MAX) openAcc();
    else closeAcc();
}

let tId;
function navigateDebounced() {
    clearTimeout(tId);
    tId = setTimeout(() => {
    const a = +minRange.value, b = +maxRange.value;
    const url = new URL(location.href); const q = url.searchParams;

    if (a === RANGE_MIN && b === RANGE_MAX) {
        q.delete('min_price_range'); q.delete('max_price_range');
        q.delete('page');
        url.search = q.toString();
        closeAcc();
    } else {
        q.set('min_price_range', a); q.set('max_price_range', b);
        q.delete('page');
        url.search = q.toString();
        openAcc();
    }
    location.assign(url.toString());
    }, DELAY_MS);
}

// این قسمت از کد که مشکل داشت، حالا اصلاح شده
window.toggleAccordion = function (id) {
    if (id !== 3) {
    const panel = document.getElementById('content-' + id);
    const icon  = document.getElementById('icon-' + id)?.querySelector('svg');
    if (!panel) return;
    const isOpen = panel.dataset.open === '1' || (panel.style.maxHeight && panel.style.maxHeight !== '0px');
    if (isOpen) {
        panel.dataset.open = '0'; panel.style.maxHeight = '0px'; panel.classList.add('max-h-0'); icon?.classList.remove('rotate-90');
    } else {
        panel.dataset.open = '1'; panel.classList.remove('max-h-0'); panel.style.maxHeight = '0px';
        requestAnimationFrame(()=> panel.style.maxHeight = panel.scrollHeight + 'px'); icon?.classList.add('rotate-90');
    }
    return;
    }
    
    // در این بخش، قانون "فقط وقتی استفاده شده باز باشد" رو برداشتم
    // چون در حالتی که هنوز انتخاب نشده، کاربر باید بتونه آکاردئون رو باز کنه
    if (content.dataset.open === '1') {
        closeAcc();
    } else {
        openAcc();
    }
};

if (minRange && maxRange && content) {
    if (!minRange.value) minRange.value = RANGE_MIN;
    if (!maxRange.value) maxRange.value = RANGE_MAX;

    minRange.addEventListener('input', () => { normalize('min'); updateUI(); });
    maxRange.addEventListener('input', () => { normalize('max'); updateUI(); });

    ['change','pointerup','keyup'].forEach(ev => {
    minRange.addEventListener(ev, () => { normalize('min'); updateUI(); navigateDebounced(); });
    maxRange.addEventListener(ev, () => { normalize('max'); updateUI(); navigateDebounced(); });
    });

    hydrate();

    window.addEventListener('resize', () => {
    if (content.dataset.open === '1') content.style.maxHeight = content.scrollHeight + 'px';
    updateUI();
    });
}
})();


// -------------------------------------------------------------- //

// <!--sort-->

(function () {
    const sortList = document.getElementById('sortList');
    if (!sortList) return;

    // هایلایت آیتم فعال بر اساس URL
    const params = new URLSearchParams(window.location.search);
    const activeSort = params.get('sort') || 'newest';
    sortList.querySelectorAll('li').forEach(li => {
        if (li.dataset.sort === activeSort) {
            li.classList.remove('text-gray-400');
            li.classList.add('text-blue-500');
        } else {
            li.classList.remove('text-blue-500');
            li.classList.add('text-gray-400');
        }
    });

    // کلیک روی آیتم
    sortList.addEventListener('click', function (e) {
        const li = e.target.closest('li[data-sort]');
        if (!li) return;

        const sortValue = li.dataset.sort;
        const url = new URL(window.location.href);
        url.searchParams.set('sort', sortValue);
        url.searchParams.delete('page'); // صفحه رو ریست کنیم
        window.location.href = url.toString();
    });
})();

// <!--filters category and ... accardion-->

document.addEventListener('DOMContentLoaded', function () {
 
    // تابع عمومی برای باز و بسته کردن آکاردئون‌ها (بدون تغییر)
    function toggleAccordion(id) {
        const panel = document.getElementById('content-' + id);
        const icon  = document.getElementById('icon-' + id);
        if (!panel) return;
        const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
        if (isOpen) {
            panel.style.maxHeight = '0px';
            if (icon) icon.firstElementChild?.classList.remove('rotate-90');
            panel.setAttribute('aria-expanded', 'false');
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            if (icon) icon.firstElementChild?.classList.add('rotate-90');
            panel.setAttribute('aria-expanded', 'true');
        }
    }
 
    // ===== بخش فیلتر رنگ (تک‌انتخابی) - کد نهایی =====
    (function handleSingleColorFilter() {
        const container = document.getElementById('color-filter');
        if (!container) return;
 
        const allColorsCheckbox = document.getElementById('color-all');
        const colorCheckboxes = Array.from(container.querySelectorAll('input[type="checkbox"][name="color"]'));
        const panel = document.getElementById('content-6');
        const icon = document.getElementById('icon-6');
 
        // تابع برای همگام‌سازی وضعیت چک‌باکس‌ها با URL
        const syncCheckboxesWithUrl = () => {
            const params = new URLSearchParams(location.search);
            const urlColor = params.get('color'); // از get() برای یک مقدار استفاده می‌کنیم
 
            if (urlColor) {
                allColorsCheckbox.checked = false;
                colorCheckboxes.forEach(cb => {
                    cb.checked = (cb.value === urlColor);
                });
                if (panel) toggleAccordion(6);
            } else {
                allColorsCheckbox.checked = true;
                colorCheckboxes.forEach(cb => cb.checked = false);
                if (panel) panel.style.maxHeight = '0px';
                if (icon) icon.firstElementChild?.classList.remove('rotate-90');
            }
        };
 
        // رویداد شنونده برای چک‌باکس "همه رنگ‌ها"
        allColorsCheckbox.addEventListener('change', () => {
            if (allColorsCheckbox.checked) {
                // تمام چک‌باکس‌های رنگی دیگر را از انتخاب خارج کن
                colorCheckboxes.forEach(cb => cb.checked = false);
                // URL را پاک کن
                const p = new URLSearchParams(location.search);
                p.delete('color');
                p.delete('page');
                location.assign(location.pathname + (p.toString() ? '?' + p.toString() : ''));
            }
        });
 
        // رویداد شنونده برای چک‌باکس‌های رنگی
        colorCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (cb.checked) {
                    // تمام چک‌باکس‌های دیگر را از انتخاب خارج کن
                    colorCheckboxes.filter(c => c !== cb).forEach(c => c.checked = false);
                    allColorsCheckbox.checked = false;
                    // URL را بر اساس رنگ انتخاب‌شده به‌روزرسانی کن
                    const p = new URLSearchParams(location.search);
                    p.set('color', cb.value);
                    p.delete('page');
                    location.assign(location.pathname + (p.toString() ? '?' + p.toString() : ''));
                } else {
                    // اگر هیچ چک‌باکسی تیک نخورده بود، به حالت "همه" برگرد
                    if (!colorCheckboxes.some(checkbox => checkbox.checked)) {
                        allColorsCheckbox.checked = true;
                        const p = new URLSearchParams(location.search);
                        p.delete('color');
                        p.delete('page');
                        location.assign(location.pathname + (p.toString() ? '?' + p.toString() : ''));
                    }
                }
            });
        });
 
        // همگام‌سازی اولیه در هنگام بارگذاری صفحه
        syncCheckboxesWithUrl();
 
        // باز کردن آکاردئون هنگام بارگذاری صفحه
        window.addEventListener('load', () => {
            const params = new URLSearchParams(location.search);
            if (params.get('color') && panel) {
                panel.style.maxHeight = panel.scrollHeight + 'px';
                if (icon) icon.firstElementChild?.classList.add('rotate-90');
            }
        });
        // مدیریت اسکرول داخلی برای آیتم‌های زیاد
        const totalItems = colorCheckboxes.length;
        if (totalItems > 5) { // تغییر عدد از 3 به 5
            container.style.overflowY = 'auto';
            // سعی می‌کنیم ارتفاع واقعی آیتم را بگیریم؛ اگر نشد، ۴۴px
            const sampleDiv = colorCheckboxes[0]?.closest('div.inline-flex');
            const itemH = sampleDiv ? sampleDiv.offsetHeight : 44;
            container.style.maxHeight = (itemH * 5) + 'px'; // تغییر عدد از 3 به 5
        } else {
            container.style.overflowY = '';
            container.style.maxHeight = '';
        }
    })();
});