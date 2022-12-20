<template>
  <v-btn
    color="primary"
    variant="tonal"
    @click="$router.push(link)"
    prepend-icon="mdi-play"
    >{{ text }}</v-btn
  >
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    link: { type: String, required: true },
    text: { type: String, required: true },
  },
});
</script>
