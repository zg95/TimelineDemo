import { createApp } from "vue";
import App from "./App.vue";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import "mars3d/mars3d.css";
import chbimTimeAxis from "chbim-time-axis";
import "../node_modules/chbim-time-axis/Index.css";

const Vue = createApp(App);

Vue.use(chbimTimeAxis);

Vue.mount("#app");
