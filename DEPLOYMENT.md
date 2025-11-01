# GitHub Pages Deployment Guide

Bu loyihani GitHub Pages orqali deploy qilish uchun qo'llanma.

## 1. GitHub Secrets sozlash

Environment variables'lar GitHub Secrets orqali saqlanadi:

1. GitHub repository'ga o'ting
2. **Settings** → **Secrets and variables** → **Actions** ga o'ting
3. **New repository secret** tugmasini bosing
4. Quyidagi 2 ta secret qo'shing:

   - **Name:** `REACT_APP_SUPABASE_URL`
     **Value:** Supabase project URL (masalan: `https://xxxxx.supabase.co`)

   - **Name:** `REACT_APP_SUPABASE_ANON_KEY`
     **Value:** Supabase anon public key

## 2. GitHub Pages ni faollashtirish

1. Repository **Settings** → **Pages** ga o'ting
2. **Source** ostida **GitHub Actions** ni tanlang
3. **Save** tugmasini bosing

## 3. Deploy qilish

### Avtomatik deploy:

- `main` branch'ga push qilganingizda avtomatik deploy bo'ladi
- **Actions** tab'ida workflow progress'ni ko'rishingiz mumkin

### Manual deploy:

1. **Actions** tab'iga o'ting
2. **Deploy to GitHub Pages** workflow ni tanlang
3. **Run workflow** tugmasini bosing

## 4. Domain sozlash

Agar custom domain ishlatmoqchi bo'lsangiz:

1. Repository'da **Settings** → **Pages** ga o'ting
2. **Custom domain** qismiga domeningizni kiriting (masalan: `asrorbeck.uz`)
3. DNS sozlamalaringizni o'zgartiring:
   - Type: `CNAME`
   - Name: `@` yoki `www`
   - Value: `your-username.github.io`

## 5. Build jarayoni

GitHub Actions avtomatik ravishda:
- Dependencies'ni o'rnatadi
- Environment variables'lar bilan build qiladi
- `index.html` ni `404.html` ga ko'chiradi (SPA route'lar uchun)
- GitHub Pages'ga deploy qiladi

## 6. SPA Route'lar bilan ishlash

React Router ishlatilgani uchun, GitHub Pages'da barcha route'lar to'g'ri ishlashi uchun:
- `index.html` ni `404.html` ga ko'chirish avtomatik amalga oshiriladi
- Bu orqali `/admin`, `/blog` va boshqa route'lar ishlaydi

## Eslatmalar

- `.env` fayl GitHub'ga commit qilinmaydi (`.gitignore` da)
- Faqat GitHub Secrets'da saqlangan qiymatlar ishlatiladi
- Build jarayonida environment variables GitHub Secrets'dan olinadi
- Local development uchun `.env` faylidan foydalaning

## Xatoliklarni tekshirish

Agar deploy ishlamasa:

1. **Actions** tab'ida workflow log'larini tekshiring
2. GitHub Secrets'lar to'g'ri qo'shilganligini tekshiring
3. Environment variable nomlari to'g'ri ekanligini tekshiring
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

Agar route'lar ishlamasa:
- `404.html` fayl mavjudligini tekshiring
- GitHub Pages **Settings** → **Pages** da custom domain to'g'ri sozlanganligini tekshiring
