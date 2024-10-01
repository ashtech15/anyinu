<template>
	<div class="app-header-pagination">
		<div class="app-header-pagination__container container">
			<ul ref="paginationList" class="app-header-pagination__list list-unstyled">
				<li
					v-for="(item, index) in paginationList"
					:key="index"
					:class="{ active: item.sectionId === currentSectionId }"
					class="app-header-pagination__item"
				>
					<a
						:href="`/#${item.sectionId}`"
						:aria-label="item.title"
						class="app-header-pagination__item-link"
						@click.prevent="$emit('go-to-section', item.sectionId)"
						>{{ index + 1 < 10 ? `0${index + 1}` : index + 1 }}</a
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { gsap } from "gsap";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";

export default {
	name: "AppHeaderPaginationList",
	props: {
		paginationList: {
			type: Array,
			required: true
		},
		currentSectionId: {
			type: String,
			required: true
		}
	},
	emits: ["go-to-section"],
	computed: {
		...mapState(useAppStore, ["breakpoints"])
	},
	mounted() {
		setTimeout(this.createTimeline, 0);
	},
	methods: {
		createTimeline() {
			const { paginationList } = this.$refs;
			let tl;
			let timeoutId;

			const mm = gsap.matchMedia();
			mm.add(`(min-width: ${this.breakpoints.xl + 0.5}px)`, () => {
				tl = gsap.timeline({
					scrollTrigger: {
						trigger: ".app-footer",
						start: "top bottom",
						end: "+=200",
						markers: false,
						scrub: true,
						onEnter: this.onEnter,
						onLeaveBack: this.onLeaveBack
					}
				});

				tl.to(paginationList, { autoAlpha: 0 });
			});

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
