import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

const rideOs = {
  dark: true,
  colors: {
    background: "#0a0e1a",
    surface: "#161d33",
    primary: "#c6f24e",
    secondary: "#4de1ff",
    accent: "#ff3d7f",
    error: "#ff5470",
    info: "#4de1ff",
    success: "#c6f24e",
    warning: "#ffb13d",
    "on-primary": "#0a0e1a",
    "on-surface": "#eaf0ff",
    "on-background": "#eaf0ff",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "rideOs",
    themes: { rideOs },
  },
  icons: { defaultSet: "mdi", aliases, sets: { mdi } },
  components,
  directives,
});

// Export for test.
export { components, directives };
