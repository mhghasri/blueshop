// ---------------- for show name of file in create or edit files ---------------- //

// for show file name in cadmin create.html

document.getElementById('image_1').addEventListener('change', function(e) {
    var fileName = e.target.files[0].name;
    document.getElementById('file-name-1').textContent = fileName;
});

document.getElementById('image_2').addEventListener('change', function(e) {
    var fileName = e.target.files[0].name;
    document.getElementById('file-name-2').textContent = fileName;
});

// ----------------  ---------------- //
