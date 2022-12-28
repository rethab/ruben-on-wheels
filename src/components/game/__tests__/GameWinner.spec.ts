import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import GameWinner from "../GameWinner.vue";

import vuetify from "@/plugins/vuetify";

const pushedRoutes: string[] = [];
const mockRouter = {
  push: (route: string) => {
    pushedRoutes.push(route);
  },
};

function mountComponent(winner: string) {
  return mount(GameWinner as any, {
    props: {
      winner,
    },
    global: {
      plugins: [vuetify],
      mocks: {
        $router: mockRouter,
      },
    },
  });
}

describe("GameWinner", () => {
  it("renders full component", () => {
    const wrapper = mountComponent("Alice");

    expect(wrapper.html()).toMatchSnapshot();
  });

  it.each(["ruben", "Ruben"])("%s wins his own game", (winner) => {
    const wrapper = mountComponent(winner);

    expect(wrapper.find(".v-card-subtitle").text()).toBe(
      "Of course he wins his own Game."
    );
  });

  it("other players need to pay Ruben a visit", () => {
    const wrapper = mountComponent("Alice");

    expect(wrapper.find(".v-card-subtitle").text()).toBe(
      "Don't forget to pay Ruben a visit!"
    );
  });

  it("clicking on Play Again redirects to the init view", async () => {
    const wrapper = mountComponent("Alice");

    await wrapper.find(".v-btn").trigger("click");

    expect(pushedRoutes).toContain("init");
  });
});
