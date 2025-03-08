import { defineNuxtRouteMiddleware } from "nuxt/app";
import { useAuth } from "~/composables/useAuth";
import { navigateTo } from "nuxt/app";

// 認証チェックを行うミドルウェア
export default defineNuxtRouteMiddleware((to) => {
  // 認証状態を取得
  const { isAuthenticated } = useAuth();

  // ログインページへの遷移は許可
  if (to.path === "/login") return;

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
