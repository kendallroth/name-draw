import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi-svg";

// NOTE: Import Vuetify style overrides to be applied during compilation, although
//         currently this drastically increases initially compilation times!
//       Only import 'vuetify/styles' if NOT using Vite plugin to expose styles,
//         as importing when using Vite plugin will prevent overriding!
// Source: https://next.vuetifyjs.com/en/getting-started/installation/#usage
// Source: https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin#style-loading
import "vuetify/styles";

const lightTheme = {
  dark: false,
  colors: {
    error: "#e76f51",
    primary: "#2a9d8f",
    secondary: "#264653",
    background: "#f9f9f9",
    warning: "#e9c46a",
  },
};

export default createVuetify({
  defaults: {
    VBtn: {
      rounded: "lg",
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: lightTheme,
    },
  },
});
