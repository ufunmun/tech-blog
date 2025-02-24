import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig, defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.SUPABASE_URL as string,
    config.public.SUPABASE_KEY as string,
  );
  return {
    provide: { supabase },
  };
});
