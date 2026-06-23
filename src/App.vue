<template>
  <div class="app">
    <header class="topbar">
      <div class="shell topbar-inner">
        <RouterLink to="/" class="brand" aria-label="Ruben on Wheels home">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <circle cx="9" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="23" cy="22" r="6" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M9 22 L15 12 L23 22 M15 12 L20 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="9" cy="22" r="1.6" fill="currentColor" />
            </svg>
          </span>
          <span class="brand-text">
            <span class="brand-name">RIDE&nbsp;OS</span>
            <span class="brand-sub">Ruben on Wheels · v2</span>
          </span>
        </RouterLink>

        <div class="topbar-status">
          <template v-if="running">
            <span class="chip"><span class="dot" style="background: var(--cyan); box-shadow: 0 0 10px var(--cyan)"></span>{{ leg }}</span>
            <span class="chip">{{ store.players.length }} riders</span>
            <button class="btn btn-ghost btn-sm" @click="quit">Abandon</button>
          </template>
          <span v-else class="chip chip--live"><span class="dot"></span>System ready</span>
        </div>
      </div>
    </header>

    <main class="content">
      <RouterView v-slot="{ Component }">
        <Transition name="screen" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import { cities } from "@/services/cities";

const store = useGameStore();
const router = useRouter();

const running = computed(() => store.isGameRunning);

const leg = computed(() => {
  const city = store.currentPlayer?.currentCity;
  const idx = cities.findIndex((c) => c.name === city);
  if (idx < 0) return "En route";
  return `Leg ${idx + 1}/${cities.length}`;
});

function quit() {
  store.endGame();
  router.push("/");
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(10, 14, 26, 0.97), rgba(10, 14, 26, 0.92));
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 62px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}

.brand-mark {
  color: var(--hiviz);
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(198, 242, 78, 0.08);
  border: 1px solid rgba(198, 242, 78, 0.25);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.16em;
  font-size: 0.96rem;
}

.brand-sub {
  font-size: 0.68rem;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.topbar-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-sm {
  padding: 0.5em 1em;
  font-size: 0.78rem;
}

.content {
  flex: 1;
  padding: 40px 0 72px;
}

@media (max-width: 600px) {
  .brand-sub { display: none; }
  .content { padding: 24px 0 56px; }
}

/* Route transition */
.screen-enter-active,
.screen-leave-active {
  transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.screen-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.screen-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
