import { createClient } from "@supabase/supabase-js";

// Supabase URL va Anon Key
// Bu qiymatlarni .env faylida saqlash kerak
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Environment variables tekshirish
if (!supabaseUrl || supabaseUrl === "your_supabase_project_url") {
  console.error(
    "❌ REACT_APP_SUPABASE_URL topilmadi!\n" +
      "Iltimos, .env faylida quyidagini qo'shing:\n" +
      "REACT_APP_SUPABASE_URL=your_supabase_project_url"
  );
}

if (!supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key") {
  console.error(
    "❌ REACT_APP_SUPABASE_ANON_KEY topilmadi!\n" +
      "Iltimos, .env faylida quyidagini qo'shing:\n" +
      "REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key"
  );
}

if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === "your_supabase_project_url" ||
  supabaseAnonKey === "your_supabase_anon_key"
) {
  throw new Error(
    "Supabase konfiguratsiyasi to'liq emas. Iltimos, .env faylini to'ldiring.\n" +
      "Qo'llanma: SUPABASE_SETUP.md faylini ko'ring."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
