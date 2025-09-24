

// ----------------  change category and supplier ---------------- //

// تابع عمومی برای جابجایی آیتم‌ها بین دو لیست
function handleDoubleDblClick(sourceId, destinationId) {
    const sourceSelect = document.getElementById(sourceId);
    const destinationSelect = document.getElementById(destinationId);

    sourceSelect.addEventListener('dblclick', function(event) {
        // پیدا کردن گزینه ای که روش دابل کلیک شده
        const clickedOption = event.target;
        
        // اطمینان از اینکه المان کلیک‌شده یک <option> است
        if (clickedOption.tagName === 'OPTION') {
            destinationSelect.appendChild(clickedOption);
        }
    });
}

// فراخوانی تابع برای بخش دسته‌بندی‌ها
handleDoubleDblClick('all_categories', 'selected_categories');
handleDoubleDblClick('selected_categories', 'all_categories');

// فراخوانی تابع برای بخش تامین‌کننده‌ها
handleDoubleDblClick('all_suppliers', 'selected_suppliers');
handleDoubleDblClick('selected_suppliers', 'all_suppliers');

// ----------------  change category and supplier ---------------- //
