import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import RouteOverview from "../RouteOverview.vue";

import vuetify from "@/plugins/vuetify";

function mountComponent() {
  return mount(RouteOverview, {
    props: {
      players: [
        { name: "Alice", currentCity: "Zurich", points: 500, motivation: 75 },
        { name: "Bob", currentCity: "Basel", points: 400, motivation: 60 },
        { name: "Carl", currentCity: "Basel", points: 300, motivation: 50 },
      ],
      currentPlayer: {
        name: "Bob",
        currentCity: "Basel",
        points: 400,
        motivation: 60,
      },
      cities: [
        { name: "Zurich", actions: [], activities: [] },
        { name: "Basel", actions: [], activities: [] },
        { name: "Köln", actions: [], activities: [] },
      ],
    },
    global: {
      plugins: [vuetify],
    },
  });
}

describe("RouteOverview", () => {
  it("renders full component", () => {
    const wrapper = mountComponent();

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("all cities are plotted on the route", () => {
    const wrapper = mountComponent();

    const labels = wrapper.findAll(".route-label").map((l) => l.text());
    expect(labels).toEqual(["Zurich", "Basel", "Köln"]);
  });

  it("every player is shown as a rider on the route", () => {
    const wrapper = mountComponent();

    const initials = wrapper.findAll(".rider-initial").map((r) => r.text());
    expect(initials.sort()).toEqual(["A", "B", "C"]);
  });

  it("city of current player is highlighted", () => {
    const wrapper = mountComponent();

    const active = wrapper.findAll(".route-node--active");
    expect(active).toHaveLength(1);

    // and the active rider (Bob) is emphasised
    expect(wrapper.findAll(".rider-dot--active")).toHaveLength(1);
  });
});
