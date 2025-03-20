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
        <v-card-actions class="d-flex justify-end">
          <!-- 削除ボタン -->
          <v-btn
            color="primary"
            variant="outlined"
            @click="navigateTo('/')"
            class="mr-2"
          >
            戻る
          </v-btn>
          <v-btn
            color="error"
            :loading="isDeleting"
            @click="handleDelete"
            class="mr-2"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { navigateTo } from "nuxt/app";

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
const isDeleting = ref(false);

// 記事データを取得
const fetchPost = async () => {
  try {
    loading.value = true;
    const response = await $fetch<{ post: Post }>(
      `/api/posts/${route.params.id}`,
    );
    post.value = response.post;
  } catch (e) {
    error.value = "記事の取得に失敗しました";
    console.error("Error:", e);
  } finally {
    loading.value = false;
  }
};

// 記事を削除
const handleDelete = async () => {
  if (!confirm("本当にこの記事を削除しますか？")) {
    return;
  }

  isDeleting.value = true;

  try {
    await $fetch(`/api/posts/${route.params.id}`, {
      method: "DELETE",
    });
    await navigateTo("/");
  } catch (e) {
    error.value = "記事の削除に失敗しました";
    console.error("Error:", e);
  } finally {
    isDeleting.value = false;
  }
};
// コンポーネントマウント時に記事を取得
onMounted(() => {
  fetchPost();
});
</script>
