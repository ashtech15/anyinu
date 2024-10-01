<template>
	<g-layout-section id="why-we" :timelines-options="timelinesOptions">
		<div class="section-why-we">
			<div class="container">
				<div class="section-why-we__content">
					<div ref="header" class="section-why-we__header">
						<h2 ref="title" class="section-why-we__header-title">
							Why Any Inu? – Unleash the Distinctive Bark in the Crypto Park
						</h2>

						<p ref="desc" class="section-why-we__header-desc">
							Dive into the quirky and innovative world of Any Inu, where cutting-edge
							technology meets a community with a sense of humor.
						</p>
					</div>
					<div class="section-why-we__cards">
						<div
							ref="cards"
							class="section-why-we__card"
							v-for="(item, index) in list"
							:key="index"
						>
							<h3 class="section-why-we__card-title">
								{{ item.title }}
							</h3>
							<p class="section-why-we__card-desc">
								{{ item.desc }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import { gsap } from "gsap";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import data from "@/data/section-why-we.json";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionWhyWe",
	mixins: [mixinActiveSection],
	data: () => ({
		list: data,
		snapConfig: {
			snapTo: "labels",
			duration: { min: 2, max: 3 },
			ease: "power1.in"
		}
	}),
	computed: {
		...mapState(useAppStore, ["activeBreakpoint", "breakpoints"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						scrub: true,
						snap: this.snapConfig,
						end: this.calculateEndSection,
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
					},
					media: {
						isDesktop: `(min-width: ${this.breakpoints.xl + 0.5}px)`,
						isTablet: `(min-width: ${this.breakpoints.md + 0.5}px)`,
						isDestroy: `(max-width: ${this.breakpoints.md}px)`
					},
					callback: this.createMainTimeline
				},
				{
					scrollTrigger: {
						markers: false,
						start: "top top"
					},
					media: {
						isDesktop: `(min-width: ${this.breakpoints.md + 0.5}px)`
					},
					callback: this.createSecondaryTimeline
				},
				{
					scrollTrigger: {
						markers: false,
						start: "top-=200 top"
					},
					media: {
						isMobile: `(max-width: ${this.breakpoints.md}px)`
					},
					callback: this.createSecondaryTimeline
				}
			];
		}
	},
	methods: {
		createMainTimeline(tl, context) {
			const cardMarginDesktop = 50;
			const cardMarginTablet = 50;

			const { isDesktop, isDestroy } = context.conditions;
			if (!isDestroy) {
				const { cards } = this.$refs;
				let cardMargin = cardMarginTablet;

				if (isDesktop) {
					cardMargin = cardMarginDesktop;
				}

				tl.addLabel("begin");
				tl.addLabel("afterBegin");

				cards.forEach((card, i) => {
					const index = i + 1;
					const middle = Math.ceil(cards.length / 2);
					const offset = (index - middle) * cardMargin;

					gsap.set(card, {
						yPercent: -50,
						y: window.innerHeight / 3,
						opacity: 0
					});

					tl.addLabel(`start_${index}`);

					tl.to(card, { yPercent: -50, y: offset, opacity: 1 }, `start_${index}+=1`);
				});

				tl.addLabel("end");
				tl.pause();
			}
		},
		createSecondaryTimeline(tl) {
			const { title, desc } = this.$refs;
			addBaseAnimationsToTimeline(tl, [{ elem: title }, { elem: desc, delay: 0.2 }]);
		},
		calculateEndSection() {
			const { cards, header } = this.$refs;
			const heightCards = cards.reduce((acc, el) => acc + el.offsetHeight, 0);

			return (header.offsetHeight + heightCards) * 1.5;
		}
	}
};
</script>
