
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

// <!--filters category-->

function toggleAccordion(id) {
    // برای آکاردئون‌های مختلف، از شناسه (ID) استفاده می‌کنیم
    const panel = document.getElementById('content-' + id);
    // آیکون مربوط به هر دکمه هم با ID مشخص میشه
    const icon  = document.getElementById('icon-' + id);
    if (!panel) return;

    // بررسی می‌کنیم که آکاردئون باز هست یا بسته
    const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
    if (isOpen) {
        // اگر بازه، اون رو ببند
        panel.style.maxHeight = '0px';
        if (icon) icon.firstElementChild?.classList.remove('rotate-90');
        panel.setAttribute('aria-expanded', 'false');
    } else {
        // اگر بسته است، اون رو باز کن
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (icon) icon.firstElementChild?.classList.add('rotate-90');
        panel.setAttribute('aria-expanded', 'true');
    }
}

    document.addEventListener('DOMContentLoaded', function () {
    // ===== فقط هندل دسته‌بندی در آکاردئون موجود =====
    (function handleCategoryInAccordion() {
        const accId     = 1;                          // همونی که برای content-1 / icon-1 داری
        const panel     = document.getElementById('content-' + accId);
        const icon      = document.getElementById('icon-' + accId);
        const container = document.querySelector('#cat-filter'); // ظرف آیتم‌ها (موجود)
        const allBox    = document.getElementById('cat-all');

        if (!panel || !container || !allBox) return;

        // همه چک‌باکس‌های کتگوری (به‌جز «همه»)
        const boxes = Array.from(
        container.querySelectorAll('input[type="checkbox"][name="category"]')
        ).filter(el => el !== allBox);

        // نرمال‌سازی مسیرها برای مقایسه
        const norm = (u) => new URL(u, location.origin).pathname.replace(/\/+$/, '/');
        const currentPath  = norm(location.href);
        const productsPath = norm(allBox.dataset.href);

        // تعیین انتخاب فعلی بر اساس URL
        let hasSelection = false;
        boxes.forEach(b => {
        const bp = norm(b.dataset.href || '');
        const matched = bp && (bp === currentPath);
        b.checked = matched;
        hasSelection = hasSelection || matched;
        });
        // «همه» زمانی چک است که انتخاب دیگری نیست یا مسیر فعلی همان محصولات است
        allBox.checked = !hasSelection || (currentPath === productsPath);

        // حالت اولیه آکاردئون:
        // - اگر روی محصولات هستیم (بدون انتخاب) → بسته
        // - اگر روی یک کتگوری هستیم → باز
        if (hasSelection) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.setAttribute('aria-expanded', 'true');
        if (icon) icon.firstElementChild?.classList.add('rotate-90');
        } else {
        panel.style.maxHeight = '0px';
        panel.setAttribute('aria-expanded', 'false');
        if (icon) icon.firstElementChild?.classList.remove('rotate-90');
        }

        // اگر تعداد آیتم‌ها > 4 → اسکرول داخلی ظرف آیتم‌ها
        const totalItems = boxes.length + 1; // + گزینه «همه»
        if (totalItems > 4) {
        container.style.overflowY = 'auto';
        // سعی می‌کنیم ارتفاع واقعی آیتم را بگیریم؛ اگر نشد، 44px
        const sampleDiv = (boxes[0] || allBox)?.closest('div.inline-flex');
        const itemH = sampleDiv ? sampleDiv.offsetHeight : 44;
        container.style.maxHeight = (itemH * 4) + 'px';
        } else {
        container.style.overflowY = '';
        container.style.maxHeight = '';
        }

        // ناوبری با کلیک روی «همه»
        allBox.addEventListener('change', () => {
        if (allBox.checked) {
            const href = allBox.dataset.href;
            if (href) location.assign(href);
        } else {
            // اگر کاربر تیک «همه» را برداشت ولی هیچ‌کدام انتخاب نشد، دوباره «همه» را فعال نگه داریم
            if (!boxes.some(x => x.checked)) allBox.checked = true;
        }
        });

        // ناوبری با کلیک روی هر کتگوری
        boxes.forEach(b => b.addEventListener('change', () => {
        if (b.checked) {
            boxes.forEach(x => { if (x !== b) x.checked = false; });
            allBox.checked = false;
            const href = b.dataset.href;
            if (href) location.assign(href);
        } else {
            // اگر هیچ انتخابی باقی نماند، برگرد روی «همه»
            if (!boxes.some(x => x.checked)) {
            allBox.checked = true;
            const href = allBox.dataset.href;
            if (href) location.assign(href);
            }
        }
        }));
    })();
});


document.addEventListener('DOMContentLoaded', function () {
// ====== بخش مربوط به آکاردئون برند ======
const panelBra    = document.getElementById('content-2');
const iconWrapBra = document.getElementById('icon-2');
const containerBra= document.getElementById('bra-filter');
const allBoxBra   = document.getElementById('bra-all');

if (panelBra && containerBra && allBoxBra) {
    const boxesBra = Array.from(containerBra.querySelectorAll('input[type="checkbox"][name="brand"]'));
    const paramsBra = new URLSearchParams(location.search);
    const currentBra = paramsBra.get('brand');

    let hasSelectionBra = false;
    if (currentBra) {
        boxesBra.forEach(b => b.checked = (b.value === currentBra));
        allBoxBra.checked = false;
        hasSelectionBra = true;
    } else {
        boxesBra.forEach(b => b.checked = false);
        allBoxBra.checked = true;
        hasSelectionBra = false;
    }

    if (hasSelectionBra) {
        panelBra.style.maxHeight = panelBra.scrollHeight + 'px';
        panelBra.setAttribute('aria-expanded', 'true');
        iconWrapBra?.firstElementChild?.classList.add('rotate-90');
    } else {
        panelBra.style.maxHeight = '0px';
        panelBra.setAttribute('aria-expanded', 'false');
        iconWrapBra?.firstElementChild?.classList.remove('rotate-90');
    }

    const totalItemsBra = boxesBra.length + 1;
    if (totalItemsBra > 4) {
        const sampleDivBra = (boxesBra[0] || allBoxBra).closest('div.inline-flex');
        const itemH = sampleDivBra ? sampleDivBra.offsetHeight : 44;
        containerBra.style.overflowY = 'auto';
        containerBra.style.maxHeight = (itemH * 4) + 'px';
    } else {
        containerBra.style.overflowY = '';
        containerBra.style.maxHeight = '';
    }

    allBoxBra.addEventListener('change', () => {
        if (allBoxBra.checked) {
            boxesBra.forEach(b => b.checked = false);
            const p = new URLSearchParams(location.search);
            p.delete('brand');
            p.delete('page');
            const q = p.toString();
            location.assign(location.pathname + (q ? '?' + q : ''));
        } else {
            if (!boxesBra.some(x => x.checked)) allBoxBra.checked = true;
        }
    });

    boxesBra.forEach(b => b.addEventListener('change', () => {
        if (b.checked) {
            boxesBra.forEach(x => { if (x !== b) x.checked = false; });
            allBoxBra.checked = false;
            const p = new URLSearchParams(location.search);
            p.set('brand', b.value);
            p.delete('page');
            const q = p.toString();
            location.assign(location.pathname + (q ? '?' + q : ''));
        } else {
            if (!boxesBra.some(x => x.checked)) {
                allBoxBra.checked = true;
                const p = new URLSearchParams(location.search);
                p.delete('brand');
                p.delete('page');
                const q = p.toString();
                location.assign(location.pathname + (q ? '?' + q : ''));
            }
        }
    }));
}
// ----------------------------------------------------------------------
// ====== بخش مربوط به آکاردئون تامین کننده ======
const panelSup    = document.getElementById('content-5');
const iconWrapSup = document.getElementById('icon-5');
const containerSup= document.getElementById('supplier-filter');
const allBoxSup   = document.getElementById('supplier-all');

if (panelSup && containerSup && allBoxSup) {
    const boxesSup = Array.from(containerSup.querySelectorAll('input[type="checkbox"][name="supplier"]'));
    const paramsSup = new URLSearchParams(location.search);
    const currentSup = paramsSup.get('supplier');

    let hasSelectionSup = false;
    if (currentSup) {
        boxesSup.forEach(b => b.checked = (b.value === currentSup));
        allBoxSup.checked = false;
        hasSelectionSup = true;
    } else {
        boxesSup.forEach(b => b.checked = false);
        allBoxSup.checked = true;
        hasSelectionSup = false;
    }

    if (hasSelectionSup) {
        panelSup.style.maxHeight = panelSup.scrollHeight + 'px';
        panelSup.setAttribute('aria-expanded', 'true');
        iconWrapSup?.firstElementChild?.classList.add('rotate-90');
    } else {
        panelSup.style.maxHeight = '0px';
        panelSup.setAttribute('aria-expanded', 'false');
        iconWrapSup?.firstElementChild?.classList.remove('rotate-90');
    }
    
    const totalItemsSup = boxesSup.length + 1;
    if (totalItemsSup > 4) {
        const sampleDivSup = (boxesSup[0] || allBoxSup).closest('div.inline-flex');
        const itemH = sampleDivSup ? sampleDivSup.offsetHeight : 44;
        containerSup.style.overflowY = 'auto';
        containerSup.style.maxHeight = (itemH * 4) + 'px';
    } else {
        containerSup.style.overflowY = '';
        containerSup.style.maxHeight = '';
    }

    allBoxSup.addEventListener('change', () => {
        if (allBoxSup.checked) {
            boxesSup.forEach(b => b.checked = false);
            const p = new URLSearchParams(location.search);
            p.delete('supplier');
            p.delete('page');
            const q = p.toString();
            location.assign(location.pathname + (q ? '?' + q : ''));
        } else {
            if (!boxesSup.some(x => x.checked)) allBoxSup.checked = true;
        }
    });

    boxesSup.forEach(b => b.addEventListener('change', () => {
        if (b.checked) {
            boxesSup.forEach(x => { if (x !== b) x.checked = false; });
            allBoxSup.checked = false;
            const p = new URLSearchParams(location.search);
            p.set('supplier', b.value);
            p.delete('page');
            const q = p.toString();
            location.assign(location.pathname + (q ? '?' + q : ''));
        } else {
            if (!boxesSup.some(x => x.checked)) {
                allBoxSup.checked = true;
                const p = new URLSearchParams(location.search);
                p.delete('supplier');
                p.delete('page');
                const q = p.toString();
                location.assign(location.pathname + (q ? '?' + q : ''));
            }
        }
    }));
}
});