<template>
	<div class="app-preloader" :class="{ hide: !preloaderIsShown }">
		<p class="app-preloader__percent">{{ percent }}%</p>
		<svg class="app-preloader__loader" viewBox="0 0 36 36">
			<path
				d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
				fill="none"
				stroke="#55CAFC"
				stroke-width="0.2"
				stroke-opacity="0.4"
			/>
			<path
				d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
				fill="none"
				stroke="#55CAFC"
				stroke-opacity="0.8"
				stroke-width="0.2"
				stroke-dasharray="100, 100"
				:stroke-dashoffset="`-${100 + percent}`"
			/>
		</svg>
	</div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useAppStore } from "@/stores/app.js";

export default {
	name: "AppPreloader",
	data: () => ({
		percent: 0,
		timeout: null
	}),
	computed: {
		...mapState(useAppStore, ["preloaderIsShown"])
	},
	created() {
		this.animatePercent(Math.round(Math.random() * 98));

		window.addEventListener(
			"app:models-loaded",
			() => {
				clearTimeout(this.timeout);
				document.documentElement.classList.remove("preloader-shown");

				this.animatePercent(100);

				setTimeout(() => {
					this.hidePreloader();
				}, 1000);
			},
			{
				once: true
			}
		);

		// hide preloader for slowly internet
		// this.timeout = setTimeout(this.hidePreloader.bind(this), 20000);
	},
	methods: {
		...mapActions(useAppStore, ["hidePreloader"]),
		lerp(start, end, alpha) {
			return (1 - alpha) * start + alpha * end;
		},
		animatePercent(target) {
			const duration = 1000;
			let startTime = null;

			const step = (timestamp) => {
				if (!startTime) startTime = timestamp;
				const elapsedTime = timestamp - startTime;
				const progress = (elapsedTime / duration).toFixed(3);

				if (progress < 1) {
					this.percent = Math.floor(this.lerp(this.percent, target, progress));
					requestAnimationFrame(step);
				} else {
					this.percent = target;
				}
			};

			requestAnimationFrame(step);
		}
	}
};
</script>
