<template>
  <div class="home shell">
    <div v-if="store.isGameRunning" class="resume panel panel--lit">
      <span class="resume-icon" aria-hidden="true">⏵</span>
      <div class="resume-copy">
        <span class="eyebrow">Race in progress</span>
        <p class="resume-line">
          {{ store.currentPlayer?.name }} is on the road —
          {{ store.players.length }} riders still rolling.
        </p>
      </div>
      <button class="btn btn-primary" @click="resume">Resume race</button>
    </div>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">v2 · Stage Race</p>
        <h1 class="display hero-title">
          From <span class="hl-cyan">Zürich</span><br />
          to <span class="hl-dawn">Wageningen</span>
        </h1>
        <p class="hero-lede">
          Welcome to Ruben on Wheels — a pass-and-play stage race where every
          rider pedals north across Europe on a finite tank of points and
          motivation. Read the road, spend wisely, reach the finish first.
        </p>
        <div class="hero-cta">
          <button class="btn btn-primary" @click="begin">
            <span aria-hidden="true">▸</span> Begin
          </button>
          <span class="hero-meta num">6 checkpoints · 514&nbsp;km · 1 winner</span>
        </div>
      </div>

      <div class="panel hero-panel">
        <span class="panel-rail" aria-hidden="true"></span>
        <div class="hero-panel-head">
          <span class="eyebrow">Route Profile</span>
          <span class="chip chip--live"><span class="dot"></span>Live preview</span>
        </div>
        <RouteProfile :cities="cities" variant="hero" />
      </div>
    </section>

    <section class="brief">
      <h2 class="brief-title eyebrow">Race Protocol</h2>
      <div class="brief-grid">
        <article v-for="(r, i) in rules" :key="i" class="panel rule">
          <span class="rule-no num">{{ String(i + 1).padStart(2, "0") }}</span>
          <div>
            <h3 class="rule-head">{{ r.head }}</h3>
            <p class="rule-body">{{ r.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { cities } from "@/services/cities";
import { useGameStore } from "@/stores/game";
import RouteProfile from "@/components/RouteProfile.vue";

const router = useRouter();
const store = useGameStore();

function begin() {
  router.push({ name: "init" });
}

function resume() {
  router.push({ name: "play", params: { id: store.gameId } });
}

const rules = [
  {
    head: "Two or more riders",
    body: "Gather a peloton. Everyone lines up in Zürich and races the same road north.",
  },
  {
    head: "Start fully loaded",
    body: "Each rider begins with 500 points and 75% motivation — your fuel for the whole journey.",
  },
  {
    head: "Cycling burns both",
    body: "Riding to the next city costs points and motivation. Pace yourself between checkpoints.",
  },
  {
    head: "Low morale is expensive",
    body: "The lower your motivation, the more points each leg drains. Keep spirits high to ride cheap.",
  },
  {
    head: "Run dry and you're out",
    body: "Hit zero on either gauge and you take the train to Wageningen — eliminated from the race.",
  },
  {
    head: "First to Wageningen wins",
    body: "The first rider to roll into Wageningen takes the stage. Everyone else visits another time.",
  },
];
</script>

<style scoped>
.home {
  --gap: 0;
}

.resume {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  margin-top: 8px;
}

.resume-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: rgba(198, 242, 78, 0.1);
  border: 1px solid rgba(198, 242, 78, 0.3);
  color: var(--hiviz);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.resume-copy {
  flex: 1;
  min-width: 0;
}

.resume-line {
  margin: 4px 0 0;
  color: var(--text);
}

@media (max-width: 560px) {
  .resume {
    flex-wrap: wrap;
  }
  .resume .btn {
    flex: 1;
  }
}

.hero {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 48px;
  align-items: center;
  padding: 32px 0 64px;
}

.hero-title {
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 700;
  margin: 14px 0 22px;
}

.hl-cyan {
  color: var(--cyan);
}
.hl-dawn {
  background: linear-gradient(100deg, var(--dawn-1), var(--dawn-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-lede {
  color: var(--muted);
  font-size: 1.06rem;
  line-height: 1.65;
  max-width: 34ch;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.hero-meta {
  color: var(--faint);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
}

.hero-panel {
  padding: 22px 22px 10px;
}

.hero-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.brief {
  padding: 8px 0 32px;
}

.brief-title {
  margin: 0 0 20px;
}

.brief-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.rule {
  display: flex;
  gap: 16px;
  padding: 22px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.rule:hover {
  transform: translateY(-3px);
  border-color: rgba(198, 242, 78, 0.35);
}

.rule-no {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--hiviz);
  line-height: 1;
}

.rule-head {
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 600;
  margin: 2px 0 6px;
}

.rule-body {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0;
}

@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .brief-grid {
    grid-template-columns: 1fr;
  }
}
</style>
