<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-4">新規記事作成</h1>

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

          <v-select
            v-model="selectedCategoryId"
            :items="categories"
            item-title="name"
            item-value="id"
            label="カテゴリー"
            required
            variant="outlined"
            class="mb-4"
            :error-messages="categoryError ? [categoryError] : []"
            :disabled="isLoading"
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
import { useFetch, navigateTo } from "nuxt/app";

const router = useRouter();
const { user } = useAuth();
const { categories, fetchCategories } = useCategories();

const title = ref("");
const content = ref("");
const selectedCategoryId = ref<string | null>(null);
const titleError = ref("");
const contentError = ref("");
const categoryError = ref("");
const isLoading = ref(false);

onMounted(() => {
  fetchCategories();
});

const handleSubmit = async () => {
  if (isLoading.value) return;

  titleError.value = "";
  contentError.value = "";
  categoryError.value = "";

  if (!title.value.trim()) {
    titleError.value = "タイトルを入力してください";
    return;
  }
  if (!content.value.trim()) {
    contentError.value = "本文を入力してください";
    return;
  }
  if (!selectedCategoryId.value) {
    categoryError.value = "カテゴリーを選択してください";
    return;
  }

  isLoading.value = true;

  try {
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
      throw error.value;
    }

    await navigateTo("/");
  } catch (error: any) {
    console.error("Error:", error);
    alert("記事の投稿に失敗しました");
  } finally {
    isLoading.value = false;
  }
};
</script>
