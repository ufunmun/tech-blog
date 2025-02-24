import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import { useSupabase } from "~/composables/useSupabase";

// グローバルな状態管理
const user = ref<User | null>(null);

export const useAuth = () => {
  const supabase = useSupabase();

  if (process.client) {
    // 認証状態の変更を監視
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email); // デバッグ用
      user.value = session?.user || null;
    });
  }

  return {
    user,
    isAuthenticated: computed(() => !!user.value),
  };
};
