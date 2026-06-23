import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import GameWinner from "../GameWinner.vue";

import vuetify from "@/plugins/vuetify";

const pushedRoutes: unknown[] = [];
const mockRouter = {
  push: (route: unknown) => {
    pushedRoutes.push(route);
  },
};

function mountComponent(winner: string) {
  return mount(GameWinner, {
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

    expect(wrapper.find(".finish-note").text()).toContain(
      "Of course he wins his own game."
    );
  });

  it("other players need to pay Ruben a visit", () => {
    const wrapper = mountComponent("Alice");

    expect(wrapper.find(".finish-note").text()).toContain(
      "Don't forget to pay Ruben a visit!"
    );
  });

  it("clicking on Play Again redirects to the init view", async () => {
    const wrapper = mountComponent("Alice");

    await wrapper.find("button").trigger("click");

    expect(pushedRoutes).toContainEqual({ name: "init" });
  });
});
