import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import RouteOverview from "../RouteOverview.vue";

import vuetify from "@/plugins/vuetify";

function mountComponent() {
  return mount(RouteOverview as any, {
    props: {
      players: [
        { name: "Alice", currentCity: "Zurich" },
        { name: "Bob", currentCity: "Basel" },
        { name: "Carl", currentCity: "Basel" },
      ],
      currentPlayer: {
        name: "Bob",
        currentCity: "Basel",
      },
      cities: [{ name: "Zurich" }, { name: "Basel" }, { name: "Köln" }],
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

  it("players are shown in their city", () => {
    const wrapper = mountComponent();
    const [zurich, basel, cologne] = wrapper.findAll(".v-timeline-item");

    expect(zurich.find(".v-card-subtitle").text()).toBe("Zurich");
    expect(zurich.find(".v-card-text").text()).toBe("Alice");

    expect(basel.find(".v-card-subtitle").text()).toBe("Basel");
    expect(basel.find(".v-card-text").text()).toBe("Bob, Carl");

    expect(cologne.find(".v-card-subtitle").text()).toBe("Köln");
    expect(cologne.find(".v-card-text").text()).toBe("");
  });

  it("city of current player is highlighted", () => {
    const wrapper = mountComponent();

    const [zurich, basel, cologne] = wrapper.findAll(".v-timeline-item");
    expect(
      zurich
        .find(".v-timeline-divider__dot")
        .find(".bg-orange-lighten-2")
        .exists()
    ).toBeFalsy();
    expect(
      basel
        .find(".v-timeline-divider__dot")
        .find(".bg-orange-lighten-2")
        .exists()
    ).toBeTruthy();
    expect(
      cologne
        .find(".v-timeline-divider__dot")
        .find(".bg-orange-lighten-2")
        .exists()
    ).toBeFalsy();
  });
});
