import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import router from "./router";
import App from "./App.vue";

import piaTheme from "./theme/pia-theme";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { piaAlert } from "@/services/piaAlert";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "pia",

    themes: {
      pia: piaTheme,
    },
  },
});

const options = {
  confirmButtonColor: "#38923b",
  cancelButtonColor: "#b91300ff",
};

const app = createApp(App);

app.use(createPinia());
app.use(VueSweetalert2, options);
app.use(router);
app.use(vuetify);

app.config.globalProperties.$piaAlert = piaAlert;

app.mount("#app");
