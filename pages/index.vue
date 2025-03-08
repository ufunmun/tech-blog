<template>
  <div>
    <h1>ホーム画面</h1>
    <p>ログイン中のユーザー：{{ userEmail }}</p>
    <v-btn color="error" @click="handleLogout">ログアウト</v-btn>

    <!-- 投稿一覧 -->
    <div class="mt-4">
      <h2>投稿一覧</h2>
      <v-progress-circular
        v-if="pending"
        indeterminate
        color="primary"
      ></v-progress-circular>

      <v-list v-else>
        <v-list-item
          v-for="post in posts"
          :key="post.id"
          :title="post.title"
          :subtitle="post.created_at"
          @click="navigateTo(`/posts/${post.id}`)"
          class="cursor-pointer"
        >
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import { useAsyncData, navigateTo } from "nuxt/app";
import { useAuth } from "~/composables/useAuth";

// 投稿型定義
type Post = {
  id: string;
  title: string;
  content: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// Supabaseインスタンス取得
const supabase = useSupabase();
// 認証状態を管理するコンポーザブル
const { user } = useAuth();
// ログイン中のユーザーのメールアドレス
const userEmail = computed(() => user.value?.email ?? "ゲスト");

// ログアウト処理
const handleLogout = async () => {
  await supabase.auth.signOut();
  navigateTo("/login");
};

// 投稿一覧を取得
const { data, pending } = useAsyncData("posts", async () => {
  const response = await $fetch<{ posts: Post[] }>("/api/posts");
  return response.posts;
});

// 投稿一覧をcomputedで取得
const posts = computed(() => data.value || []);
</script>
