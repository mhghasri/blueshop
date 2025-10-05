// document.getElementById("form-search").addEventListener("submit", function(e){
//     e.preventDefault();

//     var serializedData = $(this).serialize();
//     $.ajax({
//         type: 'POST',
//         url: "ajax_search",
//         data: serializedData,
//         success: function (response) {
//             $("#result-search").load(location.href + "#result-search");
//         },
//         error: function (response) {
//             alert(response)
//         }
//     })
// });

// به جای گوش دادن به فرم، به فیلد ورودی گوش دهید
$("#input-search").on("keyup", function(e){
    // 1. دریافت مقدار جستجو
    var searchQuery = $(this).val();

    // 2. مطمئن شوید که حداقل یک کاراکتر وارد شده است
    if (searchQuery.length > 0) {
        
        // 3. آماده‌سازی داده‌ها شامل مقدار جستجو و توکن CSRF
        var serializedData = {
            'q': searchQuery,
            // توکن CSRF را به صورت دستی دریافت می‌کنیم زیرا از serialize فرم استفاده نمی‌کنیم
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val() 
        };

        $.ajax({
            type: 'POST',
            url: "ajax_search", // آدرس URL جنگو
            data: serializedData,
            success: function (response) {
                
                // 4. نتایج قبلی را پاک کنید
                $("#result-search").empty(); 
                
                // 5. نتایج جستجو در عنوان (span) را به‌روزرسانی کنید
                $('.text-blue-400').text(searchQuery);

                // 6. حلقه‌زنی بر روی داده‌های JSON و اضافه کردن آیتم‌های جدید
                if (response.length > 0) {
                    $.each(response, function(index, product) {
                        
                        // ✅ اصلاح این قسمت: استفاده از pk و slug با اسلش جداکننده
                        var productUrl = '/product/' + product.pk + '/' + product.slug; 

                        var listItem = '<li>' +
                                            // استفاده از URL ساختاریافته جدید
                                            '<a href="' + productUrl + '" class="flex items-center gap-x-2">' +
                                                '<svg class="size-5"><use href="#search" /></svg>' +
                                                product.title +
                                            '</a>' +
                                            '<svg class="size-4"><use href="#arrow-up-right" /></svg>' +
                                        '</li>';
                        $("#result-search").append(listItem);
                });
                            } else {
                    // در صورت عدم وجود نتیجه
                    $("#result-search").append('<li><p>نتیجه‌ای برای "' + searchQuery + '" یافت نشد.</p></li>');
                }
            },
            error: function (response) {
                console.error("خطا در AJAX:", response);
            }
        });
    } else {
        // اگر فیلد جستجو خالی شد، نتایج را پاک کنید
        $("#result-search").empty();
        $('.text-blue-400').text(''); // یا آن را به حالت پیش‌فرض برگردانید
    }
});