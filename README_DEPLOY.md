# GitHub Pages Deployment - Qisqa Qo'llanma

## ⚠️ MUHIM: SPA Route'lar uchun

GitHub Pages'da `/admin`, `/blog` kabi route'lar ishlashi uchun:

1. **Yangi deploy qiling** - Workflow avtomatik `404.html` yaratadi
2. **Bir necha daqiqa kuting** - GitHub Pages cache'ni yangilaydi
3. **Browser cache'ni tozalang** - Ctrl+Shift+R yoki incognito mode

## Qadamlarni bajaring:

### 1. GitHub Secrets qo'shish

1. GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** tugmasini bosing
3. Quyidagi 2 ta secret qo'shing:

**Secret 1:**
- Name: `REACT_APP_SUPABASE_URL`
- Value: Supabase project URL

**Secret 2:**
- Name: `REACT_APP_SUPABASE_ANON_KEY`
- Value: Supabase anon public key

### 2. GitHub Pages ni sozlash

1. Repository **Settings** → **Pages**
2. **Source** qismida **GitHub Actions** ni tanlang
3. **Save** tugmasini bosing

### 3. Deploy qilish

`main` branch'ga push qilganda avtomatik deploy bo'ladi!

**Yoki manual deploy:**
- **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

---

## 🔧 Route'lar ishlamasa:

1. **Actions** tab'ida workflow muvaffaqiyatli yakunlangani tekshiring
2. `build/404.html` fayl mavjudligini tekshiring (workflow avtomatik yaratadi)
3. Bir necha daqiqa kutib, browser cache'ni tozalang
4. Agar hali ham muammo bo'lsa, GitHub Pages **Settings** → **Pages** da custom domain to'g'ri sozlanganligini tekshiring

---

## Eslatmalar:

- `.env` fayl GitHub'ga commit qilinmaydi
- Environment variables faqat GitHub Secrets'da saqlanadi
- Local development uchun `.env` faylidan foydalaning
- Workflow build qilganda `index.html` ni `404.html` ga ko'chiradi

---

Batafsil ma'lumot: `DEPLOYMENT.md` faylini ko'ring.
