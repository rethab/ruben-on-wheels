<template>
  <v-card-subtitle>
    <span :class="lost ? 'text-red' : ''">
      Points: {{ player.points }}, Motivation: {{ player.motivation }}, City:
      {{ player.currentCity }}
    </span>
  </v-card-subtitle>
</template>

<script setup lang="ts">
import type { Player } from "@/services/types";

interface Props {
  player: Player;
  lost?: boolean;
}
withDefaults(defineProps<Props>(), {
  lost: false,
});
</script>
