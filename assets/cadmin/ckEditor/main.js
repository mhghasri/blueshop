/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NoRgNARATAdA7DArBSI6KokAWKBmATjwAY8AOANgrmu2LOznO0eO2orxAMwJ5QgBTAHYpiYUGHDjw0gLqQCAQzgBjAEZYIcoA===
 */

import {
    ClassicEditor,
    Alignment,
    Autoformat,
    AutoLink,
    Autosave,
    BalloonToolbar,
    Bold,
    CloudServices,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Fullscreen,
    Heading,
    Highlight,
    ImageBlock,
    ImageEditing,
    ImageInline,
    ImageResize,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Mention,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableToolbar,
    TextTransformation,
    Underline,
    WordCount
} from 'ckeditor5';

const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTk3OTUxOTksImp0aSI6IjZlNzA2NTBmLTRiNjktNDY0My1hNWM0LWJiNWMwZDk4ZDA2ZCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImUzNTcyYWE1In0.8f7OLqW8gg3OYd0VNQ4tAj-DVDWdCIMOMGbTT-lBY5QZQCG19rWDNB9LzSmij2Nr5EzoWcDGtmWjbO8_mg01BA';

const editorConfig = {
    toolbar: {
        items: [
            'undo',
            'redo',
            '|',
            'sourceEditing',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'link',
            'insertTable',
            'highlight',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'outdent',
            'indent'
        ],
        shouldNotGroupWhenFull: false
    },
    plugins: [
        Alignment,
        Autoformat,
        AutoLink,
        Autosave,
        BalloonToolbar,
        Bold,
        CloudServices,
        Code,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Fullscreen,
        Heading,
        Highlight,
        ImageBlock,
        ImageEditing,
        ImageInline,
        ImageResize,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        ImageUtils,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        Mention,
        Paragraph,
        PasteFromOffice,
        RemoveFormat,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableToolbar,
        TextTransformation,
        Underline,
        WordCount
    ],
    balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
    fontFamily: {
        supportAllValues: true
    },
    fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
    },
    fullscreen: {
        onEnterCallback: container =>
            container.classList.add(
                'editor-container',
                'editor-container_classic-editor',
                'editor-container_include-word-count',
                'editor-container_include-fullscreen',
                'main-container'
            )
    },
    heading: {
        options: [
            {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph'
            },
            {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
            },
            {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
            },
            {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
            },
            {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4'
            },
            {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5'
            },
            {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6'
            }
        ]
    },
    image: {
        toolbar: ['imageTextAlternative', '|', 'resizeImage']
    },
    initialData:
        '',
    licenseKey: LICENSE_KEY,
    link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    mention: {
        feeds: [
            {
                marker: '@',
                feed: [
                    /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                ]
            }
        ]
    },
    menuBar: {
        isVisible: true
    },
    placeholder: 'Type or paste your content here!',
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
};

ClassicEditor.create(document.querySelector('#editor'), editorConfig)
    .then(editor => {
        // این خط رو اضافه کن تا بتونی به ویرایشگر دسترسی داشته باشی
        window.myEditor = editor;

        // کدهای مربوط به WordCount
        const wordCount = editor.plugins.get('WordCount');
        document.querySelector('#editor-word-count').appendChild(wordCount.wordCountContainer);

        // فرم رو پیدا کن
        const form = document.querySelector('form');

        // به رویداد submit فرم گوش کن
        form.addEventListener('submit', function(event) {
            // محتوای CKEditor رو بگیر
            const editorData = window.myEditor.getData();

            // اون رو به textarea مخفی اضافه کن
            document.querySelector('#hidden-description').value = editorData;
        });

        return editor;
    })
    .catch(error => {
        console.error(error);
    });