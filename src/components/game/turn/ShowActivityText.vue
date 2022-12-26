<template>
  <v-card>
    <v-card-title>{{ props.player.name }}'s turn</v-card-title>
    <v-card-subtitle><span v-html="subtitle" /></v-card-subtitle>

    <v-card-text>
      <p v-html="cityActivityText" />
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
import type { Activity, Player } from "@/services/types";

interface Props {
  player: Player;
  activity: Activity;
  motivationCost: number;
  pointsCost: number;
  subtitle: string;
}

const props = defineProps<Props>();

defineEmits(["next-player"]);

let cityActivityText = "";

if (props.activity.type === "cycle") {
  cityActivityText = `Well done, you have cycled to <strong>${props.player.currentCity}</strong>.`;
  cityActivityText += "<br /><br />";
  cityActivityText += `Your points have dropped by ${props.pointsCost} and the motivation by ${props.motivationCost}.`;
} else {
  const smilies = ["😀", "☺️", "😌️", "😏", "🥳"];
  const smiley = smilies[Math.floor(Math.random() * smilies.length)];
  const move =
    (props.activity.type === "motivation"
      ? props.motivationCost
      : props.pointsCost) * -1;

  cityActivityText = props.activity.text();
  cityActivityText += "<br /><br/>";
  cityActivityText += `${smiley} Your ${props.activity.type} increase${
    props.activity.type === "motivation" ? "s" : ""
  } by ${move}.`;
}
</script>
