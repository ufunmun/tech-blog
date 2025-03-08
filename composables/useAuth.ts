// 1.ログイン状態（true/false）を管理
// 2.この状態をほかのファイルで使えるように提供
// 3.ログイン/ログアウトを検知して状態を更新
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import { useSupabase } from "~/composables/useSupabase";

// グローバルな状態管理
const user = ref<User | null>(null);

export const useAuth = () => {
  const supabase = useSupabase();

  if (process.client) {
    // 認証状態の変更を監視
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user || null;
    });
  }

  return {
    user,
    isAuthenticated: computed(() => !!user.value),
  };
};
