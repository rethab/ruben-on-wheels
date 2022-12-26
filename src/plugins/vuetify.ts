import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  icons: { defaultSet: "mdi", aliases, sets: { mdi } },
  components,
  directives,
});

// Export for test.
export { components, directives };
