# Supabase Backend Integration

Bu loyiha Supabase backend'idan to'liq foydalanadi.

## O'rnatish

1. **Supabase Package o'rnatilgan:**

   ```bash
   npm install @supabase/supabase-js
   ```

2. **Environment Variables:**
   `.env` faylini yarating va quyidagilarni qo'shing:

   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

   **OpenAI API Key:** [OpenAI Platform](https://platform.openai.com/api-keys) dan oling.

3. **Database Setup:**
   `SUPABASE_SETUP.md` faylida batafsil ko'rsatma bor. SQL kodini Supabase SQL Editor'da ishga tushiring.

## Funksiyalar

### Authentication

- ✅ Login sahifasi (`/admin` ga kirishda login talab qilinadi)
- ✅ Protected routes (faqat authenticated userlar kirishi mumkin)
- ✅ Logout funksiyasi (sidebar'da)

### Blog Posts

- ✅ Barcha blog postlar Supabase'dan o'qiladi
- ✅ Yangi blog post qo'shish (rich text editor)
- ✅ Blog post tahrirlash
- ✅ Blog post o'chirish (confirmation bilan)

### Settings

- ✅ Sayt nomi o'zgartirish
- ✅ Hero matn o'zgartirish (Hero.jsx'da ko'rsatiladi)
- ✅ Muallif ismi va email

### About

- ✅ "Men Haqimda" sahifasi Supabase'dan o'qiladi
- ✅ Admin panelda rich text editor bilan tahrirlash

### Transcription

- ✅ Audio/Video fayllarni Whisper AI yordamida matnga aylantirish
- ✅ MP3, WAV, M4A, MP4, WEBM, OGG formatlarini qo'llab-quvvatlash
- ✅ Natija ko'chirish funksiyasi

## Services

- `blogService.js` - Blog posts CRUD operatsiyalari
- `settingsService.js` - Settings o'qish/yangilash
- `aboutService.js` - About content o'qish/yangilash
- `navigationService.js` - Navigation items CRUD operatsiyalari

## Security

- Row Level Security (RLS) faollashtirilgan
- Faqat authenticated userlar CRUD operatsiyalarini bajarishi mumkin
- Public userlar faqat o'qish imkoniyatiga ega
