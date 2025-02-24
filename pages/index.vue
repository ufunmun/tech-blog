<template>
  <div>
    <h1>ホーム画面</h1>
    <p>ログイン中のユーザー：{{ user?.email }}</p>
    <v-btn color="error" @click="handleLogout">ログアウト</v-btn>

    <!-- 投稿一覧 -->
    <div class="mt-4">
      <h2>投稿一覧</h2>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>

      <v-list v-else>
        <v-list-item
          v-for="post in posts"
          :key="post.id"
          :title="post.title"
          :subtitle="post.content"
          @click="router.push(`/posts/${post.id}`)"
          :class="'cursor-pointer'"
        >
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createClient } from "@supabase/supabase-js";
import { useRuntimeConfig } from "nuxt/app";

// Supabaseクライアントの作成
const config = useRuntimeConfig();
const supabase = createClient(
  config.public.SUPABASE_URL as string,
  config.public.SUPABASE_KEY as string,
);

// 投稿の型定義
interface Post {
  id: number;
  title: string;
  content: string;
}

// ユーザー情報の型定義
interface User {
  email: string | null;
  id: string;
}

const router = useRouter();
const user = ref<User | null>(null);
const posts = ref<Post[]>([]);
const loading = ref(true);

// ユーザー情報の取得
onMounted(async () => {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  user.value = authUser as User;
});

// 投稿一覧を取得する関数
const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    posts.value = data;
  } catch (error) {
    console.error("投稿の取得に失敗:", error);
  } finally {
    loading.value = false;
  }
};

// コンポーネントのマウント時に投稿を取得
onMounted(() => {
  fetchPosts();
});

// ログアウトする関数
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    router.push("/login");
  } catch (error) {
    console.error("ログアウトエラー:", error);
  }
};
</script>
