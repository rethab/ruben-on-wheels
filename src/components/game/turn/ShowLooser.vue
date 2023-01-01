<template>
  <v-card>
    <v-card-title>{{ player.name }}'s turn</v-card-title>
    <CardSubtitle :lost="true" :player="player" />

    <v-card-text
      >😭 Oh no, {{ player.name }}! You have to take the train from
      {{ player.currentCity }} to Wageningen.
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('nextPlayer')" color="primary" variant="tonal"
        >Next Player</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import CardSubtitle from "@/components/game/turn/CardSubtitle.vue";
import type { Player } from "@/services/types";

interface Props {
  player: Player;
}
defineProps<Props>();
defineEmits(["nextPlayer"]);
</script>
