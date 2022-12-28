import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import GameOver from "../GameOver.vue";

import vuetify from "@/plugins/vuetify";

const pushedRoutes: string[] = [];
const mockRouter = {
  push: (route: string) => {
    pushedRoutes.push(route);
  },
};

function mountComponent() {
  return mount(GameOver as any, {
    global: {
      plugins: [vuetify],
      mocks: {
        $router: mockRouter,
      },
    },
  });
}

describe("GameOver", () => {
  it("renders full component", () => {
    const wrapper = mountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("clicking on Play Again redirects to the init view", async () => {
    const wrapper = mountComponent();

    await wrapper.find(".v-btn").trigger("click");

    expect(pushedRoutes).toContain("init");
  });
});
