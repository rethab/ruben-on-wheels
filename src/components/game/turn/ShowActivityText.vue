<template>
  <TurnCard :player="player" :step="2">
    <div class="outcome" :class="isCycle ? 'outcome--ride' : 'outcome--rest'">
      <span class="outcome-tag eyebrow">{{
        isCycle ? "Leg complete" : "Recovery"
      }}</span>
      <p class="outcome-text" v-html="cityActivityText" />
    </div>

    <template #actions>
      <button class="btn btn-primary" @click="$emit('nextPlayer')">
        Next Player <span aria-hidden="true">→</span>
      </button>
    </template>
  </TurnCard>
</template>

<script setup lang="ts">
import type { Activity, Player } from "@/services/types";
import TurnCard from "@/components/game/turn/TurnCard.vue";

interface Props {
  player: Player;
  activity: Activity;
  motivationCost: number;
  pointsCost: number;
}

const props = defineProps<Props>();

defineEmits(["nextPlayer"]);

const isCycle = props.activity.type === "cycle";

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

<style scoped>
.outcome {
  padding: 18px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: rgba(10, 14, 26, 0.45);
}
.outcome--ride {
  border-color: rgba(198, 242, 78, 0.35);
  background: rgba(198, 242, 78, 0.06);
}
.outcome--rest {
  border-color: rgba(77, 225, 255, 0.3);
  background: rgba(77, 225, 255, 0.05);
}

.outcome-tag {
  display: block;
  margin-bottom: 10px;
  color: var(--hiviz);
}
.outcome--rest .outcome-tag {
  color: var(--cyan);
}

.outcome-text {
  margin: 0;
  line-height: 1.7;
}
</style>
