import { supabase } from "../config/supabase";

export const transcriptionService = {
  // Barcha transcriptions olish
  async getAll() {
    const { data, error } = await supabase
      .from("transcriptions")
      .select("*")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Bitta transcription olish
  async getById(id) {
    const { data, error } = await supabase
      .from("transcriptions")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Yangi transcription qo'shish
  async create(transcription) {
    const { data, error } = await supabase
      .from("transcriptions")
      .insert([transcription])
      .select()
      .single();

    return { data, error };
  },

  // Transcription o'chirish
  async delete(id) {
    const { error } = await supabase
      .from("transcriptions")
      .delete()
      .eq("id", id);

    return { error };
  },
};

