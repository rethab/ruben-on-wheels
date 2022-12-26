import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InitView from "../views/InitView.vue";
import PlayGame from "../views/PlayGame.vue";
import { useGameStore } from "@/stores/game";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/init",
      name: "init",
      component: InitView,
    },
    {
      path: "/play",
      name: "play",
      component: PlayGame,
      beforeEnter: () => {
        if (!useGameStore().isGameRunning) {
          return "/";
        }
      },
    },
  ],
});
