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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSupabase } from "~/composables/useSupabase";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { user } = useAuth();
const client = useSupabase();

const title = ref("");
const content = ref("");
const titleError = ref("");
const contentError = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  // すでに実行中なら何もしない
  if (isLoading.value) return;

  // バリデーション
  titleError.value = "";
  contentError.value = "";

  if (!title.value.trim()) {
    titleError.value = "タイトルを入力してください";
    return;
  }
  if (!content.value.trim()) {
    contentError.value = "本文を入力してください";
    return;
  }

  isLoading.value = true;

  try {
    const { error } = await client.from("posts").insert({
      title: title.value.trim(),
      content: content.value.trim(),
      user_id: user.value?.id,
      status: "published",
    });

    if (error) throw error;

    // 成功したら記事一覧ページへ
    await router.push("/");
  } catch (error: any) {
    console.error("Error:", error.message);
    alert("記事の投稿に失敗しました");
  } finally {
    isLoading.value = false;
  }
};
</script>
