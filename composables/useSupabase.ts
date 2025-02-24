import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "nuxt/app";

// シングルトンインスタンスの保持
let supabaseInstance: SupabaseClient | null = null;

export const useSupabase = () => {
  // インスタンスが既に存在する場合はそれを返す
  if (supabaseInstance) return supabaseInstance;

  const config = useRuntimeConfig();

  // 新しいインスタンスを作成
  supabaseInstance = createClient(
    String(config.public.SUPABASE_URL),
    String(config.public.SUPABASE_KEY),
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: process.client ? window.localStorage : undefined,
      },
    },
  );

  return supabaseInstance;
};
