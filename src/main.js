import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import "./vee-validate";
import "./registerServiceWorker";

import "./assets/styles/index.scss";

import router from "./router";
import store from "./store";
import i18n from "./i18n";
import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAXeHWW-H_wMfKQcomssYJOVn_AKSB6qBo",
    libraries: "places"
  },
  installComponents: true
});

import { VueTreeList } from "vue-tree-list";

import "./permission"; // permission control

import "font-awesome/css/font-awesome.min.css";
import moment from "moment";
Vue.component(
  "VueFontawesome",
  require("vue-fontawesome-icon/VueFontawesome.vue").default
);
Vue.config.productionTip = false;

// import firebase from "./firebase";
// Vue.prototype.$messaging = firebase.messaging();
// navigator.serviceWorker
//   .register("/firebase-messaging-sw.js")
//   .then(registration => {
//     Vue.prototype.$messaging.useServiceWorker(registration);
//   })
//   .catch(err => {
//     console.log(err);
//   });

Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("YYYY-MM-DD hh:mm");
  }
});
Vue.use(VueTreeList);
window.Vue = Vue;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
