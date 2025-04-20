<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-4">新規記事作成</h1>

        <!-- カテゴリーフィルター -->
        <v-select
          v-model="selectedCategoryId"
          :items="categories"
          item-title="name"
          item-value="id"
          label="カテゴリー"
          variant="outlined"
          class="mb-4"
          :disabled="isLoading"
          clearable
        />

        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="title"
            label="タイトル"
            required
            variant="outlined"
            class="mb-4"
            :error-messages="titleError ? [titleError] : []"
            :disabled="isLoading"
          />

          <v-textarea
            v-model="content"
            label="本文"
            required
            variant="outlined"
            class="mb-4"
            :error-messages="contentError ? [contentError] : []"
            :disabled="isLoading"
            rows="10"
          />

          <v-btn
            type="submit"
            color="primary"
            :loading="isLoading"
            :disabled="isLoading"
            class="mr-4"
          >
            投稿する
          </v-btn>

          <v-btn
            variant="outlined"
            :disabled="isLoading"
            @click="router.back()"
          >
            戻る
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useCategories } from "~/composables/useCategories";
import { navigateTo } from "nuxt/app";
import { useFetch } from "nuxt/app";
import { watch } from "vue";

const router = useRouter();
const { user } = useAuth();
const { categories, fetchCategories } = useCategories();

const title = ref("");
const content = ref("");
const selectedCategoryId = ref<string | null>(null);
const titleError = ref("");
const contentError = ref("");
const isLoading = ref(false);

onMounted(() => {
  fetchCategories();
});

const handleSubmit = async () => {
  if (isLoading.value) return;

  console.log("🔍 Form validation starting");

  titleError.value = "";
  contentError.value = "";

  // バリデーションのデバッグログ
  if (!title.value.trim()) {
    console.log("Validation failed: Title is empty");
    titleError.value = "タイトルを入力してください";
    return;
  }
  if (!content.value.trim()) {
    console.log("Validation failed: Content is empty");
    contentError.value = "本文を入力してください";
    return;
  }

  console.log("✅ Validation passed");

  isLoading.value = true;

  try {
    console.log("Submitting post with data:", {
      title: title.value.trim(),
      content: content.value.trim().substring(0, 50) + "...", // 長いコンテンツは省略
      status: "published",
      user_id: user.value?.id,
      categoryId: selectedCategoryId.value,
    });

    const { error } = await useFetch("/api/posts", {
      method: "POST",
      body: {
        title: title.value.trim(),
        content: content.value.trim(),
        status: "published",
        user_id: user.value?.id,
        categoryId: selectedCategoryId.value,
      },
    });

    if (error.value) {
      console.error("API error:", error.value);
      throw error.value;
    }

    console.log("Post submitted successfully");
    console.log("Navigating to home page");
    await navigateTo("/");
  } catch (error: any) {
    console.error("Error submitting post:", error);
    alert("記事の投稿に失敗しました");
  } finally {
    console.log("Request completed, isLoading set to false");
    isLoading.value = false;
  }
};

// カテゴリー取得のデバッグログも追加
onMounted(async () => {
  console.log("Fetching categories");
  await fetchCategories();
  console.log("Available categories:", categories.value);
});

// カテゴリー選択のwatcher追加
watch(
  () => selectedCategoryId.value,
  (newValue: string | null) => {
    console.log("Selected category changed:", newValue);
  },
);
</script>
