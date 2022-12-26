import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PointsOverview from "../PointsOverview.vue";

import vuetify from "@/plugins/vuetify";

function mountComponent() {
  return mount(PointsOverview as any, {
    props: {
      players: [
        { name: "Alice", currentCity: "Zurich", motivation: 10, points: 131 },
        { name: "Bob", currentCity: "Basel" },
        { name: "Carl", currentCity: "Cologne" },
      ],
      currentPlayerIndex: 1,
    },
    global: {
      plugins: [vuetify],
    },
  });
}

describe("PointsOverview", () => {
  it("shows current player first", () => {
    const wrapper = mountComponent();

    expect(wrapper.findAll(".v-card-title")[0].text()).toContain("Bob");
    expect(wrapper.findAll(".v-card-title")[1].text()).toContain("Carl");
    expect(wrapper.findAll(".v-card-title")[2].text()).toContain("Alice");
  });

  it("current player is highlighted", () => {
    const wrapper = mountComponent();

    expect(
      wrapper.findAll(".v-card-text")[0].find(".bg-orange").exists()
    ).toBeTruthy();
    expect(
      wrapper.findAll(".v-card-text")[1].find(".bg-orange").exists()
    ).toBeFalsy();
    expect(
      wrapper.findAll(".v-card-text")[2].find(".bg-orange").exists()
    ).toBeFalsy();
  });

  it("shows attributes of player", () => {
    const wrapper = mountComponent();
    expect(wrapper.findAll(".v-card-title")[2].text()).toContain("Alice");
    expect(wrapper.findAll(".v-card-subtitle")[2].text()).toContain(
      "City: Zurich"
    );
    expect(wrapper.findAll(".v-card-text")[2].text()).toContain(
      "10 Motivation"
    );
    expect(wrapper.findAll(".v-card-text")[2].text()).toContain("131 Points");
  });
});
