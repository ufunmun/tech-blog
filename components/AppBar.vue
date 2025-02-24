<template>
  <v-app-bar>
    <v-app-bar-title>Tech Blog</v-app-bar-title>
    <v-spacer />

    <!-- 新規投稿ボタン -->
    <v-btn
      v-if="isAuthenticated"
      to="/posts/new"
      color="primary"
      variant="text"
      class="mr-4"
    >
      <v-icon left>mdi-plus</v-icon>
      新規投稿
    </v-btn>

    <!-- ログアウトボタン -->
    <v-btn
      v-if="isAuthenticated"
      @click="handleLogout"
      :loading="isLoading"
      color="primary"
      variant="text"
    >
      <v-icon left>mdi-logout</v-icon>
      ログアウト
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSupabase } from "~/composables/useSupabase";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const supabase = useSupabase();
const { isAuthenticated } = useAuth();
const isLoading = ref(false);

// デバッグ用
console.log("Auth status:", isAuthenticated.value);

const handleLogout = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await router.push("/login");
  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
