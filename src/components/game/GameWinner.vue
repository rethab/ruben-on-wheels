<template>
  <section class="finish panel panel--lit">
    <span class="panel-rail" aria-hidden="true"></span>
    <div class="finish-flag" aria-hidden="true">
      <span v-for="n in 24" :key="n" class="flag-cell"></span>
    </div>

    <p class="eyebrow finish-eyebrow">Stage Result · Wageningen</p>
    <p class="finish-name display" aria-hidden="true">{{ winner }}</p>
    <h1 class="finish-line num">{{ winner }} has arrived in Wageningen 🚲</h1>

    <p class="finish-note">
      <template v-if="isRuben">Of course he wins his own game.</template>
      <template v-else>Don't forget to pay Ruben a visit!</template>
      It was a long and bumpy ride, but the mission is accomplished.
      Congratulations!
    </p>

    <div class="finish-actions">
      <ActionButton text="Play Again" link="init" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ActionButton from "@/components/misc/ActionButton.vue";

const props = defineProps({
  winner: { type: String, required: true },
});

const isRuben = computed(() => props.winner.toLowerCase() === "ruben");
</script>

<style scoped>
.finish {
  text-align: center;
  padding: 48px 32px 40px;
  overflow: hidden;
}

.finish-flag {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 220px;
  height: 16px;
  margin: 0 auto 26px;
  border-radius: 4px;
  overflow: hidden;
  opacity: 0.85;
}
.flag-cell {
  background: var(--text);
}
.flag-cell:nth-child(odd) {
  background: transparent;
}

.finish-eyebrow {
  color: var(--hiviz);
}

.finish-name {
  font-size: clamp(3rem, 9vw, 5.5rem);
  font-weight: 700;
  line-height: 1;
  margin: 12px 0 6px;
  background: linear-gradient(100deg, var(--dawn-1), var(--dawn-2), var(--hiviz));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.finish-line {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text);
  margin: 0 0 22px;
}

.finish-note {
  color: var(--muted);
  max-width: 46ch;
  margin: 0 auto 30px;
  line-height: 1.65;
}

.finish-actions {
  display: flex;
  justify-content: center;
}
</style>
