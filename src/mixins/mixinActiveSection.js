import {
    mapActions
} from "pinia";
import {
    useAppStore
} from "@/stores/app.js";

export default {
    methods: {
        ...mapActions(useAppStore, ["setCurrentSectionId"]),
        setCurrentSection() {
            this.setCurrentSectionId(this.$el.id);
        }
    }
};