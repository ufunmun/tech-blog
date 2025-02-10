// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    // サーバーサイドでのみ利用可能な環境変数
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,

    // クライアントサイドでも利用可能な環境変数（必要な場合）
    public: {
      // 現時点では空
    },
  },
});
