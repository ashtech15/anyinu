<template>
	<div class="g-layout-section">
		<slot ref="slot"></slot>
	</div>
</template>

<script>
import { gsap } from "gsap";

export default {
	name: "LayoutSection",
	props: {
		timelinesOptions: {
			type: Array,
			required: true
		}
	},
	mounted() {
		this.timelinesOptions.forEach(({ scrollTrigger, media, callback }) => {
			const tlConfig = {
				scrollTrigger: {
					trigger: this.$el,
					overwrite: true,
					// invalidateOnRefresh: true,
					...scrollTrigger
				}
			};
			this.createTimeline(tlConfig, media, callback);
		});
	},
	methods: {
		createTimeline(tlConfig, media, callback) {
			let tl;
			let timeoutId;

			if (media) {
				const mm = gsap.matchMedia();
				mm.add(media, (context) => {
					const { isDestroy } = context.conditions;

					if (!isDestroy) {
						tl = gsap.timeline(tlConfig);
						callback(tl, context);
					}
				});
			} else {
				tl = gsap.timeline(tlConfig);
				callback(tl);
			}

			window.addEventListener("resize", () => {
				clearTimeout(timeoutId);

				timeoutId = setTimeout(() => {
					tl?.scrollTrigger?.refresh();
				}, 300);
			});
		}
	}
};
</script>
