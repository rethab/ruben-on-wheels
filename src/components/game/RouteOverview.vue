<template>
  <div>
    <v-timeline side="end" density="compact">
      <v-timeline-item
        :dot-color="dotColor(city.name)"
        size="x-small"
        v-for="(city, index) in cities"
        :key="index"
      >
        <v-card density="compact">
          <v-card-subtitle>{{ city.name }}</v-card-subtitle>
          <v-card-text>
            {{ showPlayers(city.name) }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup lang="ts">
import type { City, Player } from "@/services/types";

interface Props {
  currentPlayer?: Player;
  players: Player[];
  cities: City[];
}

const props = defineProps<Props>();

function dotColor(cityName: string) {
  const color =
    props.currentPlayer?.currentCity === cityName ? "orange" : "grey";
  return `${color}-lighten-2`;
}

function playersInCity(cityName: string): Player[] {
  return props.players.filter(({ currentCity }) => currentCity === cityName);
}

function showPlayers(name: string) {
  const players = playersInCity(name);

  if (players.length === 0) return;

  return players.map(({ name }) => name).join(", ");
}
</script>
