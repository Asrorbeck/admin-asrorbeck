import { supabase } from "../config/supabase";

export const blogService = {
  // Barcha blog postlarni olish
  async getAll() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });
    
    return { data, error };
  },

  // Bitta blog postni slug orqali olish
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();
    
    return { data, error };
  },

  // Bitta blog postni ID orqali olish
  async getById(id) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    
    return { data, error };
  },

  // Yangi blog post qo'shish
  async create(post) {
    const { data, error } = await supabase
      .from("blog_posts")
      .insert([post])
      .select()
      .single();
    
    return { data, error };
  },

  // Blog postni yangilash
  async update(id, updates) {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    return { data, error };
  },

  // Blog postni o'chirish
  async delete(id) {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);
    
    return { error };
  },
};

