import type { Category } from "~/types/category";
import { useSupabase } from "~/composables/useSupabase";
import { useState } from "nuxt/app";

export const useCategories = () => {
  const supabase = useSupabase();
  const categories = useState<Category[]>("categories", () => []);
  const loading = useState<boolean>("categoriesLoading", () => false);

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      categories.value = data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    fetchCategories,
  };
};
