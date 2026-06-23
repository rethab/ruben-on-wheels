<template>
  <TurnCard :player="player" :step="0">
    <p>
      You've rolled into <strong>{{ player.currentCity }}</strong>. Scout the
      streets to see what the road throws at you, then decide your next move.
    </p>

    <template #actions>
      <button class="btn btn-primary" @click="$emit('exploreCity')">
        <span aria-hidden="true">⌖</span> Explore {{ player.currentCity }}
      </button>
    </template>
  </TurnCard>
</template>

<script setup lang="ts">
import type { Player } from "@/services/types";
import TurnCard from "@/components/game/turn/TurnCard.vue";

interface Props {
  player: Player;
}
defineProps<Props>();
defineEmits(["exploreCity"]);
</script>
