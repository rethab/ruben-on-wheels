import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import PointsOverview from "../PointsOverview.vue";

describe("PointsOverview", () => {
  it("renders properly", () => {
    const wrapper = mount(PointsOverview, { props: { msg: "Hello Vitest" } });
    expect(wrapper.text()).toContain("Hello Vitest");
  });
});
