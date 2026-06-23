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
  it("renders full component", () => {
    const wrapper = mountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("shows current player first", () => {
    const wrapper = mountComponent();

    expect(wrapper.findAll(".tel-name")[0].text()).toContain("Bob");
    expect(wrapper.findAll(".tel-name")[1].text()).toContain("Carl");
    expect(wrapper.findAll(".tel-name")[2].text()).toContain("Alice");
  });

  it("current player is highlighted", () => {
    const wrapper = mountComponent();
    const cards = wrapper.findAll(".tel-card");

    expect(cards[0].classes()).toContain("panel--lit");
    expect(cards[1].classes()).not.toContain("panel--lit");
    expect(cards[2].classes()).not.toContain("panel--lit");
  });

  it("shows attributes of player", () => {
    const wrapper = mountComponent();
    const alice = wrapper.findAll(".tel-card")[2];

    expect(alice.find(".tel-name").text()).toContain("Alice");
    expect(alice.find(".tel-city").text()).toContain("Zurich");
    expect(alice.text()).toContain("10%");
    expect(alice.text()).toContain("131");
  });
});
