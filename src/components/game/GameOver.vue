<template>
  <v-card>
    <v-card-title>Game Over</v-card-title>
    <v-card-text
      >Unfortunately, nobody is going to visit Ruben this time 🥲</v-card-text
    >
    <v-card-actions>
      <ActionButton text="Play Again" link="/init" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import ActionButton from "@/components/misc/ActionButton.vue";
</script>
