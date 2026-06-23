<template>
  <button class="btn btn-primary" @click="$router.push({ name: link })">
    <span aria-hidden="true">▸</span> {{ text }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ link: string; text: string }>();
</script>
