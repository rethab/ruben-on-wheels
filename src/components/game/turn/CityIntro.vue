<template>
  <v-card>
    <v-card-title>{{ props.player.name }}'s turn</v-card-title>
    <v-card-subtitle><span v-html="subtitle" /></v-card-subtitle>

    <v-card-text>
      You are currently in <strong>{{ props.player.currentCity }}</strong
      >. Click below to explore {{ props.player.currentCity }} and decide what
      activity to do next.
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('exploreCity')" color="primary" variant="tonal"
        >Explore {{ props.player.currentCity }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Player } from "@/services/types";

interface Props {
  player: Player;
  subtitle: string;
}
const props = defineProps<Props>();
defineEmits(["exploreCity"]);
</script>
