<template>
  <v-container>
    <div v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="error">
      <v-alert type="error">{{ error }}</v-alert>
    </div>

    <div v-else-if="post">
      <h1 class="text-h4 mb-4">{{ post.title }}</h1>
      <v-card>
        <v-card-text>
          <p>{{ post.content }}</p>
          <div class="text-caption mt-4">
            作成日: {{ new Date(post.created_at).toLocaleString() }}
            <br />
            更新日: {{ new Date(post.updated_at).toLocaleString() }}
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// 型定義
interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const route = useRoute();
const post = ref<Post | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// 記事データを取得
const fetchPost = async () => {
  try {
    const response = await fetch(`/api/posts/${route.params.id}`);
    const data = await response.json();

    if (response.ok) {
      post.value = data.post;
    } else {
      error.value = data.message;
    }
  } catch (e) {
    error.value = "記事の取得に失敗しました";
  } finally {
    loading.value = false;
  }
};

// コンポーネントマウント時に記事を取得
onMounted(() => {
  fetchPost();
});
</script>
