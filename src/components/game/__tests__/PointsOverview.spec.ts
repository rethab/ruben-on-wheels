import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PointsOverview from "../PointsOverview.vue";

describe("PointsOverview", () => {
  it("renders properly", () => {
    const wrapper = mount(PointsOverview, {
      props: { players: [], currentPlayerIndex: 0 },
    });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
