# GitHub Pages 404 Muammosini Tezkor Yechish

## Muammo: `/admin` va boshqa route'larda 404 xatosi

### Yechim 1: Manual 404.html yaratish (tezkor)

Agar workflow hali deploy qilinmagan bo'lsa, quyidagilarni bajaring:

1. **Local'da build qiling:**

   ```bash
   npm run build
   ```

2. **404.html yarating:**

   ```bash
   cp build/index.html build/404.html
   ```

3. **Manual deploy qiling (`gh-pages` paketidan):**

   ```bash
   npm run deploy
   ```

   Bu `build` folder'dagi barcha fayllarni (shu jumladan `404.html`) GitHub Pages'ga yuklaydi.

### Yechim 2: GitHub Actions Workflow (tavsiya etiladi)

1. **Kodlarni push qiling:**

   ```bash
   git add .
   git commit -m "Add postbuild script for 404.html"
   git push origin main
   ```

2. **GitHub Actions'da deploy:**

   - GitHub → **Actions** → **Deploy to GitHub Pages** → **Run workflow**

3. **2-3 daqiqa kuting** va browser cache'ni tozalang

### Yechim 3: Agar ikkala yondashuv ham ishlamasa

1. GitHub repository → **Settings** → **Pages**
2. **Source** ni **None** ga o'zgartiring
3. **Save**
4. Keyin yana **GitHub Actions** ga qaytaring
5. **Save**
6. **Actions** → **Run workflow**

## Tekshirish

Deploy bo'lgach:

- `https://asrorbeck.uz/404.html` - Bu sahifa mavjud bo'lishi kerak
- `https://asrorbeck.uz/admin` - Login sahifasi ochilishi kerak
- `https://asrorbeck.uz/blog` - Blog sahifasi ishlashi kerak

## Eslatma

`package.json` da `postbuild` script qo'shildi - endi har safar `npm run build` qilganda, `404.html` avtomatik yaratiladi.
