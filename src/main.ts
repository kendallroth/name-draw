import { createApp } from "vue";

import directivesPlugin from "@plugins/directives";
import vuetifyPlugin from "@plugins/vuetify";
import { rootPiniaStore } from "@stores";

import App from "./App.vue";
import router from "./router";

import "@styles/app.scss";
import "@styles/vuetify.scss";

// NOTE: Fonts should be loaded via installed '@fontsource' packages vs webfontloader, due to
//         benefits gained by self-hosting fonts.
// Source: https://fontsource.org/docs/introduction
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/500.css";
import "@fontsource/mulish/600.css";

const app = createApp(App);

app.use(rootPiniaStore);
app.use(vuetifyPlugin);
app.use(directivesPlugin);
app.use(router);

app.mount("#app");
