import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CardSubtitle from "../CardSubtitle.vue";

import vuetify from "@/plugins/vuetify";

function mountComponent(lost?: boolean) {
  return mount(CardSubtitle as any, {
    props: {
      player: {
        name: "Alice",
        currentCity: "Zurich",
        motivation: 13,
        points: 123,
      },
      lost,
    },
    global: {
      plugins: [vuetify],
    },
  });
}

describe("CardSubtitle", () => {
  it("renders full component if not lost", () => {
    const wrapper = mountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders full component if lost", () => {
    const wrapper = mountComponent(true);

    expect(wrapper.html()).toMatchSnapshot();
  });
});
