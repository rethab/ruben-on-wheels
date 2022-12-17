import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
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
      component: () => import("../views/InitView.vue"),
    },
    {
      path: "/play",
      name: "play",
      component: () => import("../views/PlayGame.vue"),
    },
  ],
});

export default router;
