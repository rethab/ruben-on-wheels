<template>
  <section class="over panel">
    <span class="panel-rail" aria-hidden="true"></span>
    <span class="over-icon" aria-hidden="true">🚆</span>
    <p class="eyebrow over-eyebrow">Race Neutralised</p>
    <h1 class="display over-title">Game Over</h1>
    <p class="over-note">
      Every rider ran out of road. Nobody is going to visit Ruben this time 🥲
    </p>
    <div class="over-actions">
      <ActionButton text="Play Again" link="init" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ActionButton from "@/components/misc/ActionButton.vue";
</script>

<style scoped>
.over {
  text-align: center;
  padding: 48px 32px 40px;
}

.over-icon {
  font-size: 2.6rem;
  display: block;
  margin-bottom: 16px;
}

.over-eyebrow {
  color: var(--danger);
}

.over-title {
  font-size: clamp(2.4rem, 7vw, 4rem);
  font-weight: 700;
  margin: 10px 0 16px;
  color: var(--text);
}

.over-note {
  color: var(--muted);
  max-width: 42ch;
  margin: 0 auto 30px;
  line-height: 1.65;
}

.over-actions {
  display: flex;
  justify-content: center;
}
</style>
