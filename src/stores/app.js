import {
    defineStore
} from "pinia";

export const useAppStore = defineStore("app", {
    state: () => ({
        breakpoints: {},
        activeBreakpoint: "xxl",
        preloaderIsShown: true,
        currentSectionId: ""
    }),
    actions: {
        setBreakpoint(key, value) {
            this.breakpoints[key] = value;
        },
        setActiveBreakpoint(activeKey) {
            this.activeBreakpoint = activeKey;
        },
        hidePreloader() {
            this.preloaderIsShown = false;
        },
        setCurrentSectionId(value) {
            this.currentSectionId = value;
        }
    }
});