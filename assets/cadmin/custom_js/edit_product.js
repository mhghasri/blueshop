

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

// ---------------- submit all selected categories before send ---------------- //

// قبل از submit همه گزینه‌های داخل select های مقصد انتخاب بشن
document.getElementById("productForm").addEventListener("submit", function() {
    // دسته‌بندی‌ها
    const selectedCategories = document.getElementById("selected_categories").options;
    for (let option of selectedCategories) {
        option.selected = true;
    }

    // تامین‌کننده‌ها
    const selectedSuppliers = document.getElementById("selected_suppliers").options;
    for (let option of selectedSuppliers) {
        option.selected = true;
    }
});

// ---------------- fix style ---------------- //

// استایل برای حذف هایلایت انتخاب‌شده‌ها در همه selectهای ما
const style = document.createElement("style");
style.innerHTML = `
  #all_categories option:checked,
  #selected_categories option:checked,
  #all_suppliers option:checked,
  #selected_suppliers option:checked {
      background-color: inherit !important;
      color: inherit !important;
  }
`;
document.head.appendChild(style);

// جلوگیری از انتخاب شدن (highlight) با کلیک
["all_categories", "selected_categories", "all_suppliers", "selected_suppliers"].forEach(id => {
    const select = document.getElementById(id);
    if (select) {
        select.addEventListener("mousedown", function(e) {
            e.preventDefault(); // جلوی انتخاب شدن رو می‌گیره
        });
    }
});
