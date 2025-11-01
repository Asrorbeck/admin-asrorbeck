import { supabase } from "../config/supabase";

export const aboutService = {
  // About content olish
  async get() {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .single();
    
    return { data, error };
  },

  // About content yangilash
  async update(content) {
    const { data, error } = await supabase
      .from("about")
      .upsert({ id: 1, content }, { onConflict: "id" })
      .select()
      .single();
    
    return { data, error };
  },
};

