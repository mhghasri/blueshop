// document.getElementById("product_pk").addEventListener("change", function(e){
//     var product_pk = $(this).val();
//     console.log("Selected product:", product_pk); // بررسی کن چاپ میشه یا نه

//     $.ajax({
//         type: "POST",
//         url: "/cadmin/package_ajax",
//         data: {
//             product_pk: product_pk,
//             csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
//         },
//         success: function(response){
//             console.log("Response:", response);
//             var supplierSelect = $("#supplier_pk");
//             supplierSelect.empty();
//             supplierSelect.append('<option value="" disabled selected>----------</option>');
//             response.forEach(function(supplier){
//                 supplierSelect.append('<option value="'+supplier[0]+'">'+supplier[1]+'</option>');
//             });
//         },
//         error: function(xhr, status, error){
//             console.log("XHR:", xhr);
//             console.log("Status:", status);
//             console.log("Error:", error);
//             alert("مشکلی پیش اومده. لطفاً کنسول مرورگر رو چک کن.");
//         }
//     });
// });
