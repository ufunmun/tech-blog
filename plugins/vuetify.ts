// Vuetifyプラグイン設定ファイル
// Nuxtアプリケーションに対してVuetifyを統合するための設定を行う

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  // Vuetifyインスタンスの作成
  const vuetify = createVuetify({
    // 利用可能なコンポーネントの登録
    components,
    // 利用可能なディレクティブの登録
    directives,
    // デフォルトのテーマを設定（ライトテーマ）
    theme: {
      defaultTheme: "light",
    },
  });

  // VuetifyをNuxtアプリケーションに統合
  nuxtApp.vueApp.use(vuetify);
});
