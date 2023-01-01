<template>
  <v-card>
    <v-card-title>{{ player.name }}'s turn</v-card-title>
    <CardSubtitle :player="player" />

    <v-card-text>
      You are currently in <strong>{{ player.currentCity }}</strong
      >. Click below to explore {{ player.currentCity }} and decide what
      activity to do next.
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('exploreCity')" color="primary" variant="tonal"
        >Explore {{ player.currentCity }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Player } from "@/services/types";
import CardSubtitle from "@/components/game/turn/CardSubtitle.vue";

interface Props {
  player: Player;
}
defineProps<Props>();
defineEmits(["exploreCity"]);
</script>
