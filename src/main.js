import {
    createApp
} from "vue";
import {
    createPinia
} from "pinia";
import App from "./App.vue";
import {
    register
} from "/node_modules/swiper/swiper-element-bundle";

// global components
import GlobalModal from "./components/global/GlobalModal.vue";
import GlobalArrowDownRight from "./components/global/GlobalArrowDownRight.vue";
import GlobalLayoutSection from "./components/global/GlobalLayoutSection.vue";

const app = createApp(App);

app.use(createPinia());

app.component("g-modal", GlobalModal);
app.component("g-arrow-down-right", GlobalArrowDownRight);
app.component("g-layout-section", GlobalLayoutSection);

register();

app.mount("#app");

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
document.documentElement.scrollTop = 0;