<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card>
          <v-card-title class="text-center">ログイン</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                type="email"
                required
              />
              <v-text-field
                v-model="password"
                label="パスワード"
                type="password"
                required
              />
              <v-btn type="submit" color="primary" block class="mt-4">
                ログイン
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
const email = ref("");
const password = ref("");

const login = async () => {
  try {
    // TODO: ログイン処理の実装
    console.log("Login attempt:", {
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
