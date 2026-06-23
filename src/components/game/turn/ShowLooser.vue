<template>
  <TurnCard :player="player" :lost="true">
    <div class="dnf">
      <span class="dnf-icon" aria-hidden="true">🚆</span>
      <p class="dnf-text">
        Oh no, {{ player.name }}! You've run out of road. You have to take the
        train from <strong>{{ player.currentCity }}</strong> to Wageningen —
        you're out of the race.
      </p>
    </div>

    <template #actions>
      <button class="btn btn-primary" @click="$emit('nextPlayer')">
        Next Player <span aria-hidden="true">→</span>
      </button>
    </template>
  </TurnCard>
</template>

<script setup lang="ts">
import TurnCard from "@/components/game/turn/TurnCard.vue";
import type { Player } from "@/services/types";

interface Props {
  player: Player;
}
defineProps<Props>();
defineEmits(["nextPlayer"]);
</script>

<style scoped>
.dnf {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 18px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 84, 112, 0.3);
  background: rgba(255, 84, 112, 0.06);
}

.dnf-icon {
  font-size: 2rem;
  line-height: 1;
}

.dnf-text {
  margin: 0;
  line-height: 1.65;
}
</style>
