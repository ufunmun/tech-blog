<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h4 mb-4">ホーム画面</h1>
        <p class="mb-4">ログイン中のユーザー：{{ userEmail }}</p>

        <div class="d-flex mb-6">
          <v-btn color="error" @click="handleLogout">ログアウト</v-btn>
        </div>

        <!-- カテゴリーフィルター -->
        <v-select
          v-model="selectedCategoryId"
          :items="categories"
          item-title="name"
          item-value="id"
          label="カテゴリーで絞り込む"
          variant="outlined"
          class="mb-4"
          clearable
          @update:model-value="fetchPosts"
        />

        <!-- 記事一覧 -->
        <div>
          <h2 class="text-h5 mb-4">投稿一覧</h2>
          <div v-if="isLoading" class="text-center">
            <v-progress-circular indeterminate />
          </div>
          <div v-else-if="posts.length === 0" class="text-center">
            記事が見つかりません
          </div>
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="post in posts"
              :key="post.id"
              class="p-4 border rounded-lg"
            >
              <NuxtLink
                :to="`/posts/${post.id}`"
                class="block no-underline text-inherit"
              >
                <h3 class="text-xl font-bold">{{ post.title }}</h3>
                <div class="text-sm text-gray-500">
                  {{ new Date(post.created_at).toLocaleDateString() }}
                </div>
                <div
                  v-if="post.posts_categories?.[0]?.categories"
                  class="mt-1 text-sm text-gray-500"
                >
                  カテゴリー: {{ post.posts_categories[0].categories.name }}
                </div>
                <div class="mt-2 text-gray-600">
                  {{ post.content.substring(0, 100) }}...
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useSupabase } from "~/composables/useSupabase";
import { useAuth } from "~/composables/useAuth";
import { useCategories } from "~/composables/useCategories";
import { navigateTo } from "nuxt/app";
import type { Post } from "~/types/post";

const { user } = useAuth();
const { categories, fetchCategories } = useCategories();
const userEmail = computed(() => user.value?.email ?? "ゲスト");

const posts = ref<Post[]>([]);
const selectedCategoryId = ref<string | null>(null);
const isLoading = ref(false);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    console.log("Fetching posts with categoryId:", selectedCategoryId.value);

    const response = await $fetch<{ posts: Post[]; message: string }>(
      `/api/posts${
        selectedCategoryId.value
          ? `?categoryId=${selectedCategoryId.value}`
          : ""
      }`,
    );

    console.log("Received response:", response);

    posts.value = response.posts || [];

    console.log("Updated posts:", posts.value.length);
  } catch (error) {
    console.error("Error fetching posts:", error);
  } finally {
    isLoading.value = false;
  }
};

// カテゴリー選択の監視
watch(selectedCategoryId, (newValue) => {
  console.log("Category changed to:", newValue);
  fetchPosts();
});

onMounted(async () => {
  await fetchCategories();
  await fetchPosts();
});

const handleLogout = async () => {
  const supabase = useSupabase();
  await supabase.auth.signOut();
  navigateTo("/login");
};
</script>
