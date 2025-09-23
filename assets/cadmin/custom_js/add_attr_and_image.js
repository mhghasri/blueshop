// دریافت دکمه‌ها و کانتینرها با استفاده از ID
const addAttributeButton = document.getElementById('add-attribute');
const attributeContainer = document.getElementById('attribute-container');

const addGalleryImageButton = document.getElementById('add-gallery-image');
const galleryContainer = document.getElementById('gallery-container');

// --- تابع مشترک برای مدیریت نمایش نام فایل ---
function handleFileInputChange(event) {
    const fileInput = event.target;
    // با استفاده از closest، نزدیک‌ترین المان والد با کلاس مشخص را پیدا می‌کند.
    const parentFormGroup = fileInput.closest('.form-group');
    if (!parentFormGroup) return; // اگر المان والد پیدا نشد، از تابع خارج می‌شود

    // پیدا کردن span مربوط به نام فایل در همان والد
    const fileNameSpan = parentFormGroup.querySelector('.file-name');
    
    if (fileInput.files.length > 0) {
        fileNameSpan.textContent = fileInput.files[0].name;
    } else {
        fileNameSpan.textContent = 'فایلی انتخاب نشده';
    }
}

// اتصال تابع به فیلدهای از قبل موجود در HTML
document.getElementById('image_1').addEventListener('change', handleFileInputChange);
document.getElementById('image_2').addEventListener('change', handleFileInputChange);

// اتصال تابع به فیلد گالری اولیه در HTML
document.getElementById('gallery-image-0').addEventListener('change', handleFileInputChange);


// --- عملکرد برای ویژگی‌ها (Attributes) ---
addAttributeButton.addEventListener('click', () => {
    // ایجاد یک div جدید برای نگهداری فیلدها
    const newRow = document.createElement('div');
    newRow.classList.add('form-row', 'mb-2');

    newRow.innerHTML = `
        <div class="col">
            <input type="text" name="attribute_titles" class="form-control" placeholder="عنوان (مثلاً پردازنده)">
        </div>
        <div class="col">
            <input type="text" name="attribute_values" class="form-control" placeholder="مقدار (مثلاً i7)">
        </div>
    `;

    attributeContainer.appendChild(newRow);
});

// --- عملکرد برای تصاویر گالری (Image Gallery) ---
addGalleryImageButton.addEventListener('click', () => {
    const newFormGroup = document.createElement('div');
    newFormGroup.classList.add('form-group', 'gallery-file-input-wrapper');

    // ایجاد یک ID منحصر به فرد برای هر فیلد جدید
    const uniqueId = `gallery-image-${Date.now()}`;

    newFormGroup.innerHTML = `
        <label>تصویر گالری</label>
        <input name="gallery_images" type="file" class="d-none gallery-image-input" id="${uniqueId}" accept="image/jpeg, image/png, image/webp">
        <label class="btn btn-primary" for="${uniqueId}">انتخاب تصویر</label>
        <span class="ml-2 text-muted file-name">فایلی انتخاب نشده</span>
    `;
    
    galleryContainer.appendChild(newFormGroup);

    // اتصال تابع به فیلد جدید
    const newFileInput = newFormGroup.querySelector('.gallery-image-input');
    newFileInput.addEventListener('change', handleFileInputChange);
});