<template>
	<app-preloader />

	<template v-if="isHTMLVisible">
		<app-header @go-to-section="goToSection" />
	</template>

	<main class="content">
		<template v-if="isCanvasVisible">
			<app-three-canvas />
		</template>

		<template v-if="isHTMLVisible">
			<div ref="scrollContainer" class="wrap-sections">
				<section-hero />
				<section-why-we />
				<section-roadmap />
				<section-converter-coins />
				<section-features />
				<section-token-specifics />
				<section-main-collection />
				<section-collection />
				<section-FAQ />
			</div>
		</template>
	</main>

	<template v-if="isHTMLVisible">
		<app-footer />
	</template>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import AppPreloader from "@/components/AppPreloader.vue";
import AppThreeCanvas from "@/components/AppThreeCanvas.vue";
import SectionHero from "@/components/sections/SectionHero.vue";
import SectionWhyWe from "@/components/sections/SectionWhyWe.vue";
import SectionRoadmap from "@/components/sections/SectionRoadmap.vue";
import SectionConverterCoins from "@/components/sections/SectionConverterCoins.vue";
import SectionFeatures from "@/components/sections/SectionFeatures.vue";
import SectionTokenSpecifics from "@/components/sections/SectionTokenSpecifics.vue";
import SectionMainCollection from "@/components/sections/SectionMainCollection.vue";
import SectionCollection from "@/components/sections/SectionCollection.vue";
import SectionFAQ from "@/components/sections/SectionFAQ.vue";

// gsap
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

export default {
	name: "App",
	data: () => ({
		timeout: null,
		lenisScroll: null,
		timelineApp: null,
		isScrolling: false,
		positions: []
	}),
	components: {
		AppHeader,
		AppFooter,
		AppPreloader,
		AppThreeCanvas,
		SectionHero,
		SectionWhyWe,
		SectionRoadmap,
		SectionConverterCoins,
		SectionFeatures,
		SectionTokenSpecifics,
		SectionMainCollection,
		SectionCollection,
		SectionFAQ
	},
	watch: {
		preloaderIsShown(val) {
			if (!val && !this.timelineApp) {
				this.initAppTimeline();
				this.initLenisScroll();
				this.calculatePositionsSection();
			}
		}
	},
	computed: {
		...mapState(useAppStore, ["breakpoints", "preloaderIsShown"]),
		isHTMLVisible() {
			const viteVar = import.meta.env.VITE_DEV_WITH_HTML;
			const isProductionMode = import.meta.env.PROD;
			const isVisible = viteVar == "false" ? false : true;

			return isProductionMode || isVisible;
		},
		isCanvasVisible() {
			const viteVar = import.meta.env.VITE_DEV_WITH_CANVAS;
			const isProductionMode = import.meta.env.PROD;
			const isVisible = viteVar == "false" ? false : true;

			return isProductionMode || isVisible;
		}
	},
	created() {
		this.setBreakpoints();
		this.checkActiveBreakpoint();

		window.addEventListener("resize", () => {
			this.calculatePositionsSection();
			this.checkActiveBreakpoint();
		});
	},
	methods: {
		...mapActions(useAppStore, ["setBreakpoint", "setActiveBreakpoint"]),
		initAppTimeline() {
			this.timelineApp = gsap.timeline({
				scrollTrigger: {
					trigger: document.documentElement,
					start: "top top",
					end: "bottom bottom",
					markers: false,
					onUpdate: ({ progress }) => {
						window.dispatchEvent(
							new CustomEvent("scroll:update-normalize-y", {
								detail: {
									currentPoint: progress
								}
							})
						);
					}
				}
			});
		},
		initLenisScroll() {
			this.lenis = new Lenis({
				lerp: 0.06
			});

			this.lenis.on("scroll", ScrollTrigger.update);
			gsap.ticker.add((time) => {
				this.lenis.raf(time * 1000);
			});
			gsap.ticker.lagSmoothing(0);

			// Scroll to top
			this.lenis.scrollTo(0, { lerp: 0, duration: 0, lock: true, force: true });
		},
		goToSection(sectionId) {
			const container = this.$refs.scrollContainer;
			const section = container.querySelector(`#${sectionId}`);
			const parent = section.parentElement;
			let targetElement = section;

			if (parent.classList.contains("pin-spacer")) {
				targetElement = parent;
			}

			this.lenis.scrollTo(targetElement, {
				offset: 10,
				lock: true
			});
		},
		calculatePositionsSection() {
			const container = this.$refs.scrollContainer;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const sections = Array(...container.children);

			this.positions = [];

			sections.forEach((section, index) => {
				const rect = section.getBoundingClientRect();
				const scrollY = window.scrollY;
				const sectionTop = rect.top + scrollY;
				const progress = sectionTop / docHeight;

				this.positions.push(progress);
			});

			window.dispatchEvent(
				new CustomEvent("scroll:update-breakpoints", {
					detail: {
						breakpoints: [...this.positions]
					}
				})
			);
		},
		checkActiveBreakpoint() {
			const breakpoints = Object.keys(this.breakpoints);
			const activeKey = breakpoints.find((key, i) => {
				const breakpoint = this.breakpoints[key];

				return window.innerWidth <= breakpoint || i === breakpoints.length - 1;
			});

			this.setActiveBreakpoint(activeKey);
		},
		setBreakpoints() {
			const htmlComputedStyle = getComputedStyle(document.documentElement);

			["md", "xl", "xxl"].forEach((key) => {
				this.setBreakpoint(
					key,
					parseFloat(htmlComputedStyle.getPropertyValue(`--breakpoint-${key}`))
				);
			});
		}
	}
};
</script>
