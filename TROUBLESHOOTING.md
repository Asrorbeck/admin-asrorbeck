# GitHub Pages Route'lar Muammosi - Yechim

## Muammo: `/admin` yoki boshqa route'larda 404 xatosi

### Yechim 1: Yangi Deploy qilish (Asosiy)

1. **Kodlarni push qiling:**
   ```bash
   git add .
   git commit -m "Fix GitHub Pages SPA routes"
   git push origin main
   ```

2. **GitHub Actions'da deploy:**
   - GitHub repository → **Actions** tab
   - **Deploy to GitHub Pages** workflow ni tanlang
   - **Run workflow** tugmasini bosing

3. **2-3 daqiqa kuting** - Deploy jarayoni tugaguncha

4. **Browser cache'ni tozalang:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - Yoki incognito/private mode'da oching

### Yechim 2: Manual 404.html tekshirish

Agar hali ham muammo bo'lsa:

1. GitHub repository → **Settings** → **Pages**
2. **Visit site** tugmasini bosing
3. `https://asrorbeck.uz/404.html` ga o'ting
4. Agar bu sahifa ishlayotgan bo'lsa, muammo cache'da

### Yechim 3: GitHub Pages Cache'ni tozalash

1. Repository → **Settings** → **Pages**
2. **Source** ni boshqa qiymatga o'zgartiring (masalan: **None**)
3. **Save**
4. Keyin yana **GitHub Actions** ga qaytaring
5. **Save**

### Yechim 4: Workflow Log'larini tekshirish

1. **Actions** tab → So'nggi workflow run ni oching
2. **build** job ni kengaytiring
3. **Create 404.html** step'ni tekshiring
4. Agar xatolik ko'rsatilsa, log'larni ko'ring

## Tekshirish

Deploy bo'lgach, quyidagilarni tekshiring:

- ✅ `https://asrorbeck.uz/` - Bosh sahifa
- ✅ `https://asrorbeck.uz/blog` - Blog sahifasi
- ✅ `https://asrorbeck.uz/about` - About sahifasi
- ✅ `https://asrorbeck.uz/admin` - Admin panel (login bo'lishi kerak)
- ✅ `https://asrorbeck.uz/404.html` - 404.html mavjudligi

## Eslatmalar

- **Workflow avtomatik `build/index.html` ni `build/404.html` ga ko'chiradi**
- **Bu GitHub Pages'da SPA route'lar uchun zarur**
- **Agar `404.html` mavjud bo'lsa, GitHub Pages barcha route'larni to'g'ri ishlatadi**

## Muammo davom etsa

Agar barcha yechimlar ishlamasa:

1. Repository → **Settings** → **Pages** da **Custom domain** ni tekshiring
2. DNS sozlamalarini tekshiring
3. GitHub Actions workflow log'larini to'liq ko'rib chiqing
4. Browser console'da JavaScript xatolarini tekshiring

