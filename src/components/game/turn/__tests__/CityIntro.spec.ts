import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CityIntro from "../CityIntro.vue";

import vuetify from "@/plugins/vuetify";

function mountComponent() {
  return mount(CityIntro as any, {
    props: {
      player: {
        name: "Alice",
        currentCity: "Zurich",
        motivation: 13,
        points: 143,
      },
    },
    global: {
      plugins: [vuetify],
    },
  });
}

describe("CityIntro", () => {
  it("renders full component", () => {
    const wrapper = mountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("emits exploreCity event when clicking button", async () => {
    const wrapper = mountComponent();

    await wrapper.find(".v-btn").trigger("click");

    expect(wrapper.emitted()).toHaveProperty("exploreCity");
  });
});
