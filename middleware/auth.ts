import { defineNuxtRouteMiddleware } from "nuxt/app";
import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.SUPABASE_URL as string,
    config.public.SUPABASE_KEY as string,
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && to.path !== "/login") {
    return "/login";
  }

  if (session && to.path === "/login") {
    return "/";
  }
});
