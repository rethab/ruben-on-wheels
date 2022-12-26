<template>
  <v-container class="px-0">
    <v-row>
      <v-col :cols="cols" v-for="(player, index) in sortedPlayers" :key="index">
        <v-card>
          <v-card-title
            :class="{
              'text-medium-emphasis': !active(index),
              'text-subtitle-1': true,
              'pb-0': true,
            }"
            >{{ player.name }}</v-card-title
          >
          <v-card-subtitle>City: {{ player.currentCity }}</v-card-subtitle>
          <v-card-text class="pt-1">
            <v-progress-linear
              height="15"
              :class="{
                'mb-2': true,
                'text-medium-emphasis': !active(index),
              }"
              :color="active(index) ? 'orange' : 'grey'"
              style="white-space: nowrap; overflow: hidden"
              :model-value="player.motivation"
              max="100"
              >{{ player.motivation }} Motivation</v-progress-linear
            >
            <v-progress-linear
              height="15"
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

<style>
.v-progress-linear__content {
  justify-content: left !important;
  margin-left: 0.25em;
}
</style>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { Player } from "@/services/types";

interface Props {
  players: Player[];
  currentPlayerIndex: number;
}

const props = defineProps<Props>();

const sortedPlayers = computed(() => {
  const currentAndAfter = props.players.slice(
    props.currentPlayerIndex,
    props.players.length
  );
  const untilCurrent = props.players.slice(0, props.currentPlayerIndex);
  return [...currentAndAfter, ...untilCurrent];
});

const cols = computed(() => {
  const { xs } = useDisplay();
  return xs ? 6 : 4;
});

function active(index: number): boolean {
  return index === 0;
}
</script>
