import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import SelectActivity from "../SelectActivity.vue";

import vuetify from "@/plugins/vuetify";
import type { Action } from "../../../../services/types";

function mountComponent(action: Action) {
  return mount(SelectActivity as any, {
    props: {
      player: {
        name: "Alice",
        currentCity: "Zurich",
        motivation: 13,
        points: 143,
      },
      action,
    },
    global: {
      plugins: [vuetify],
    },
  });
}

describe("SelectActivity", () => {
  const testAction: Action = {
    text: "sample action text",
    type: "motivation",
    effect: "increase",
  };

  it("renders full component: motivation increase", () => {
    const wrapper = mountComponent(testAction);

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders full component: points decrease", () => {
    const wrapper = mountComponent({
      ...testAction,
      type: "points",
      effect: "decrease",
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
