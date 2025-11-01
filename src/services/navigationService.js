import { supabase } from "../config/supabase";

export const navigationService = {
  // Barcha navigation items olish (faqat active bo'lganlar)
  async getAll() {
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });
    
    return { data, error };
  },

  // Barcha navigation items olish (admin uchun, active/ inactive ham)
  async getAllForAdmin() {
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .order("order_index", { ascending: true });
    
    return { data, error };
  },

  // Yangi navigation item qo'shish
  async create(item) {
    const { data, error } = await supabase
      .from("navigation_items")
      .insert([item])
      .select()
      .single();
    
    return { data, error };
  },

  // Navigation item yangilash
  async update(id, updates) {
    const { data, error } = await supabase
      .from("navigation_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    return { data, error };
  },

  // Navigation item o'chirish
  async delete(id) {
    const { error } = await supabase
      .from("navigation_items")
      .delete()
      .eq("id", id);
    
    return { error };
  },
};

