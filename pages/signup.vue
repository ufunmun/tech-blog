<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4">新規登録</v-card-title>

          <v-form ref="form" @submit.prevent="handleSignup">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              required
              variant="outlined"
              class="mb-4"
              :rules="emailRules"
              :error-messages="errorMessage ? [errorMessage] : []"
              :disabled="isLoading"
            />

            <v-text-field
              v-model="password"
              label="パスワード"
              required
              variant="outlined"
              class="mb-4"
              :rules="passwordRules"
              :disabled="isLoading"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
              hint="8文字以上で、英字・数字を含む必要があります"
              persistent-hint
            />

            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-2"
              :loading="isLoading"
            >
              {{ isLoading ? "登録中..." : "登録" }}
            </v-btn>

            <v-card-text class="text-center mt-4">
              すでにアカウントをお持ちの方は
              <v-btn
                variant="text"
                color="primary"
                @click="navigateTo('/login')"
              >
                ログイン
              </v-btn>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import { navigateTo } from "nuxt/app";

const supabase = useSupabase();
const form = ref<any>(null);
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

const emailRules = [
  (v: string) => !!v || "メールアドレスは必須です",
  (v: string) =>
    /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください",
];

const passwordRules = [
  (v: string) => !!v || "パスワードは必須です",
  (v: string) => v.length >= 8 || "パスワードは8文字以上である必要があります",
  (v: string) =>
    (/[A-Za-z]/.test(v) && /[0-9]/.test(v)) ||
    "パスワードは英字と数字を含む必要があります",
];

const handleSignup = async () => {
  const { valid } = (await form.value?.validate()) || { valid: false };
  if (!valid || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (existingUser.user) {
      errorMessage.value = "このメールアドレスは既に登録されています。";
      await supabase.auth.signOut();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    await navigateTo("/");
  } catch (error: any) {
    console.error("Signup error:", error.message);
    errorMessage.value = "登録に失敗しました。入力内容を確認してください。";
  } finally {
    isLoading.value = false;
  }
};
</script>
