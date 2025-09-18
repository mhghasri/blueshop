1. پیکربندی فایل محیطی

در پروژه یک فایل نمونه به نام .env.example وجود دارد که قالب متغیرهای لازم را مشخص می‌کند:

📄 .env.example

# Database settings
DB_ENGINE=django.db.backends.mysql
DB_NAME=blueshop
DB_USER=root
DB_PASSWORD=Admin@123
DB_HOST=mysql
DB_PORT=3306

# Django settings
SECRET_KEY=your-secret-key
DEBUG=False


ابتدا یک کپی از این فایل بسازید و نام آن را .env بگذارید:

cp .env.example .env


سپس مقادیر را بر اساس محیط خود ویرایش کنید.

2. نصب و پیکربندی MySQL

ابتدا مطمئن شوید که ایمیج MySQL روی سیستم نصب است. اگر نبود، آخرین نسخه را بگیرید:

docker pull mysql:latest

3. بیلد کردن ایمیج Django

در روت پروژه (کنار Dockerfile) دستور زیر را اجرا کنید:

docker build . -t image-name


🔑 به جای image-name نام دلخواه خود را قرار دهید.

4. ساخت شبکه

برای ارتباط بین MySQL و Django یک شبکه اختصاصی بسازید:

docker network create network-name

5. اجرای MySQL

کانتینر MySQL را با دستور زیر بالا بیاورید:

docker run --name some-mysql \
    -v /my/custom:/etc/mysql/conf.d \
    -e MYSQL_ROOT_PASSWORD=Admin@123 \
    -d --network network-name mysql:latest


📌 مسیر /my/custom اختیاری است و فقط در صورتی لازم می‌شود که بخواهید کانفیگ اختصاصی MySQL داشته باشید.

6. اجرای کانتینر Django

در نهایت کانتینر Django را اجرا کنید:

docker run -d \
    --network network-name \
    -v $(pwd):/app \
    -v volume-name:/app/assets \
    -p 8000:8000 \
    --env-file .env \
    --name container-name \
    image-name


$(pwd):/app → کد پروژه داخل کانتینر

volume-name:/app/assets → نگهداری فایل‌های static/media

.env → فایل محیطی که از .env.example ساخته‌اید

7. دسترسی به پروژه

بعد از اجرای کانتینر، پروژه Django روی آدرس زیر در دسترس خواهد بود:

http://localhost:8000