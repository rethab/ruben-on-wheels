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

<script lang="ts">
import { useGameStore } from "@/stores/game";
import { cities } from "@/services/cities";

export default {
  setup() {
    return { cities };
  },
  methods: {
    dotColor(cityName: string) {
      const { currentPlayer } = useGameStore();
      const color = currentPlayer?.currentCity === cityName ? "orange" : "grey";
      return `${color}-lighten-2`;
    },
    showPlayers(name: string) {
      const { playersInCity } = useGameStore();
      const players = playersInCity(name);

      if (players.length === 0) return;

      return players.map(({ name }) => name).join(", ");
    },
  },
};
</script>
