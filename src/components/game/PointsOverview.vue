<template>
  <v-container class="px-0">
    <v-row>
      <v-col :cols="cols" v-for="(player, index) in players" :key="index">
        <v-card>
          <v-card-title
            :class="{
              'text-medium-emphasis': !active(index),
              'text-subtitle-1': true,
            }"
            >{{ player.name }}</v-card-title
          >
          <v-card-text>
            <v-progress-linear
              height="12"
              :class="{
                'mb-2': true,
                'text-medium-emphasis': !active(index),
              }"
              :color="active(index) ? 'orange' : 'grey'"
              style="white-space: nowrap"
              :model-value="player.motivation"
              max="100"
              >{{ player.motivation }} Motivation</v-progress-linear
            >
            <v-progress-linear
              height="12"
              :class="{ 'text-medium-emphasis': !active(index) }"
              :color="active(index) ? 'orange' : 'grey'"
              style="white-space: nowrap"
              :model-value="player.points"
              max="500"
              >{{ player.points }} Points</v-progress-linear
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useGameStore } from "@/stores/game";

export default defineComponent({
  computed: {
    players() {
      const { players, currentPlayerIndex: idx } = useGameStore();
      return [...players.slice(idx, players.length), ...players.slice(0, idx)];
    },
    currentPlayerIndex() {
      return useGameStore().currentPlayerIndex;
    },
    cols() {
      const { xs } = this.$vuetify.display;
      return xs ? 6 : 4;
    },
  },
  methods: {
    active(index: number): boolean {
      return index === 0;
    },
  },
});
</script>
