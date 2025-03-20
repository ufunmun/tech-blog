import { defineNuxtRouteMiddleware } from "nuxt/app";
import { useAuth } from "~/composables/useAuth";
import { navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();
  const publicPages = ["/login", "/signup"];

  // ログイン済みユーザーがパブリックページにアクセス -> ホームへ
  if (isAuthenticated.value && publicPages.includes(to.path)) {
    console.log(
      "認証済みユーザーのパブリックページへアクセス -> ホームへリダイレクト",
    );
    return navigateTo("/");
  }

  // 未認証ユーザーが保護されたページにアクセス -> ログインへ
  if (!isAuthenticated.value && !publicPages.includes(to.path)) {
    console.log(
      "未認証ユーザーの保護ページへアクセス -> ログインへリダイレクト",
    );
    return navigateTo("/login");
  }

  // その他のケースは許可
  return;
});
