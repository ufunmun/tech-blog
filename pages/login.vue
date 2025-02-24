<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4"> ログイン </v-card-title>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              required
              variant="outlined"
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              label="パスワード"
              type="password"
              required
              variant="outlined"
              class="mb-4"
            />

            <v-btn type="submit" color="primary" block class="mt-2">
              ログイン
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig, useRouter } from "nuxt/app";

const config = useRuntimeConfig();
const router = useRouter();
const supabase = createClient(
  config.public.SUPABASE_URL as string,
  config.public.SUPABASE_KEY as string,
);

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // ログイン成功時の処理
    console.log("ログイン成功:", data);
    router.push("/");
  } catch (error) {
    console.error("ログインエラー:", error);
    alert("ログインに失敗しました");
  }
};
</script>
