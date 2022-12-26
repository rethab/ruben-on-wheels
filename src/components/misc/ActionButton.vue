<template>
  <v-btn
    color="primary"
    variant="tonal"
    @click="$router.push(link)"
    prepend-icon="mdi-play"
    >{{ text }}</v-btn
  >
</template>

<script setup lang="ts">
defineProps<{ link: string; text: string }>();
</script>
