import { useAuth } from "~/composables/useAuth";
import { navigateTo } from "nuxt/app";
import { defineNuxtPlugin } from "nuxt/app";
import { addRouteMiddleware } from "nuxt/app";

export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    "auth",
    () => {
      const { isAuthenticated } = useAuth();
      if (!isAuthenticated.value) {
        return navigateTo("/login");
      }
    },
    { global: true },
  );
});
