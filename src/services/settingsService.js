import { supabase } from "../config/supabase";

export const settingsService = {
  // Settings olish
  async get() {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();
    
    return { data, error };
  },

  // Settings yangilash
  async update(updates) {
    // Settings jadvalida faqat bitta qator bo'lishi kerak
    const { data, error } = await supabase
      .from("settings")
      .upsert(updates, { onConflict: "id" })
      .select()
      .single();
    
    return { data, error };
  },
};

