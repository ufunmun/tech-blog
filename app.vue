<template>
  <v-app>
    <AppBar />
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/useAuth";
import AppBar from "~/components/AppBar.vue";

const { user } = useAuth();
</script>
