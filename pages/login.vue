<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4">ログイン</v-card-title>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              required
              variant="outlined"
              class="mb-4"
              :error-messages="errorMessage ? [errorMessage] : []"
              :disabled="isLoading"
            />

            <v-text-field
              v-model="password"
              label="パスワード"
              required
              variant="outlined"
              class="mb-4"
              :disabled="isLoading"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-2"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ isLoading ? "ログイン中..." : "ログイン" }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useSupabase } from "~/composables/useSupabase";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const supabase = useSupabase();
const { user } = useAuth();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);

// ログイン済みの場合はホームにリダイレクト
watch(
  user,
  (newUser) => {
    if (newUser) {
      router.push("/");
    }
  },
  { immediate: true },
);

const handleLogin = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // 明示的にホームページに遷移
    await router.push("/");
  } catch (error: any) {
    console.error("Login error:", error.message);
    errorMessage.value =
      "ログインに失敗しました。メールアドレスとパスワードを確認してください。";
  } finally {
    isLoading.value = false;
  }
};
</script>
