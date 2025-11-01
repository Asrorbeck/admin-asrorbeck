# Supabase Backend Setup Guide

Bu loyiha Supabase backend'idan foydalanadi. Quyidagi qadamlarni bajarib, backend'ni sozlang.

## 1. Supabase Project Yaratish

1. [Supabase](https://supabase.com) saytiga kirib, yangi project yarating
2. Project yaratgandan keyin, **Settings > API** bo'limiga o'ting
3. Quyidagi ma'lumotlarni oling:
   - Project URL
   - `anon` public key

## 2. Environment Variables

Loyiha ildizida `.env` faylini yarating va quyidagilarni qo'shing:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

**Eslatma:** OpenAI API key olish uchun [OpenAI Platform](https://platform.openai.com/api-keys) ga o'ting va yoki platformada hisob oching.

## 3. Database Schema

Supabase Dashboard'da **SQL Editor** ga o'ting va `supabase_setup.sql` faylini ochib, barcha SQL kodlarni copy-paste qiling yoki fayl ichidagi kodlarni to'g'ridan-to'g'ri ishga tushiring.

**Yoki quyidagi SQL kodlarni ketma-ket ishga tushiring:**

```sql
-- Blog Posts jadvali
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL DEFAULT 'Asrorbek Tursunpulatov',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Settings jadvali
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT NOT NULL DEFAULT 'Asrorbek''s Blog',
  hero_body_text TEXT NOT NULL DEFAULT 'Exploring life''s wonders, one story at a time.',
  author_name TEXT NOT NULL DEFAULT 'Asrorbek Tursunpulatov',
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT settings_single_row CHECK (id = 1)
);

-- About jadvali
CREATE TABLE about (
  id INTEGER PRIMARY KEY DEFAULT 1,
  content TEXT NOT NULL DEFAULT '<p>Men haqimda ma''lumotlar...</p>',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT about_single_row CHECK (id = 1)
);

-- Row Level Security (RLS) Policies

-- Blog Posts uchun
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Barcha userlar blog postlarni o'qishi mumkin
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (true);

-- Faqat authenticated userlar blog post yozishi mumkin
CREATE POLICY "Blog posts can be created by authenticated users"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Faqat authenticated userlar blog post yangilashi mumkin
CREATE POLICY "Blog posts can be updated by authenticated users"
  ON blog_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Faqat authenticated userlar blog post o'chirishi mumkin
CREATE POLICY "Blog posts can be deleted by authenticated users"
  ON blog_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Settings uchun
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Barcha userlar settingsni o'qishi mumkin
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

-- Faqat authenticated userlar settingsni yangilashi mumkin
CREATE POLICY "Settings can be updated by authenticated users"
  ON settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- About uchun
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- Barcha userlar about contentni o'qishi mumkin
CREATE POLICY "About is viewable by everyone"
  ON about FOR SELECT
  USING (true);

-- Faqat authenticated userlar about contentni yangilashi mumkin
CREATE POLICY "About can be updated by authenticated users"
  ON about FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initial data
INSERT INTO settings (id, site_name, hero_body_text, author_name, email)
VALUES (1, 'Asrorbek''s Blog', 'Exploring life''s wonders, one story at a time.', 'Asrorbek Tursunpulatov', 'asrorbek@example.com');

INSERT INTO about (id, content)
VALUES (1, '<p>Men haqimda ma''lumotlar...</p>');
```

## 4. Authentication Setup

1. Supabase Dashboard'da **Authentication > Providers** ga o'ting
2. Email provider'ni faollashtiring
3. **Authentication > Users** bo'limida admin user yarating:
   - Email va password kiriting
   - User yaratilgandan keyin, email tasdiqlash shart emas (development uchun)

## 5. Test Qilish

1. `.env` faylini to'ldiring
2. `npm start` bilan loyihani ishga tushiring
3. `/admin` ga o'ting
4. Login qiling va barcha funksiyalarni test qiling

## 6. Production Deployment

Production uchun:

1. `.env.production` faylini yarating
2. Production Supabase project URL va key'larini qo'shing
3. Build qiling: `npm run build`

## Eslatmalar

- RLS (Row Level Security) faollashtirilgan
- Faqat authenticated userlar CRUD operatsiyalarini bajarishi mumkin
- Public userlar faqat o'qish mumkin
- Barcha jadvallar `updated_at` va `created_at` timestamp'larga ega
