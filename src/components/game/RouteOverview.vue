<template>
  <RouteProfile
    :cities="cities"
    :players="players"
    :current-player="currentPlayer"
    variant="play"
  />
</template>

<script setup lang="ts">
import type { City, Player } from "@/services/types";
import RouteProfile from "@/components/RouteProfile.vue";

interface Props {
  currentPlayer?: Player;
  players: Player[];
  cities: City[];
}

defineProps<Props>();
</script>
