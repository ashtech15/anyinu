<template>
    <canvas ref="canvas" class="app-three-scene"></canvas>
</template>

<script>
import { initScene } from "../three-scene/index";

export default {
    name: "AppThreeCanvas",
    mounted() {
        this.$nextTick(() => {
            const { canvas } = this.$refs;

            initScene({
                canvas
            });
        });
    }
};
</script>
