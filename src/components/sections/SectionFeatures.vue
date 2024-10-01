<template>
	<g-layout-section id="diamond-hands" :timelines-options="timelinesOptions">
		<div class="section-features">
			<div class="container">
				<div class="section-features__content">
					<h2 ref="title" class="section-features__title center">
						Diamond Hands App: The Ultimate Loyalty Program for the Crypto Canine
						Enthusiast!
					</h2>

					<p ref="desc" class="section-features__desc center font-fira-code">
						Lock your $AI and let the Diamond Hands app be the trusty leash that keeps
						your tokens safe and sound. It's like a digital doghouse for your tokens,
						but with a lot more treats!
					</p>

					<a
						ref="link"
						href="https://app.anyinu.xyz/"
						class="section-features__link g-button g-button--default"
					>
						Enter Diamond Hands
						<span class="icon-wrap">
							<g-arrow-down-right />
						</span>
					</a>
				</div>
			</div>

			<div class="section-features__list-wrapper">
				<div ref="featuresList" class="container">
					<swiper-container
						ref="swiperEl"
						:space-between="20"
						:breakpoints="sliderBreakpoints"
						:injectStyles="['.swiper {overflow: visible;}']"
						slides-per-view="auto"
						class="section-features__list"
					>
						<swiper-slide
							v-for="(item, index) in list"
							:key="index"
							class="section-features__item"
						>
							<div class="section-features__item-icon">
								<img :src="item.icon" alt="" />
							</div>

							<h3 class="section-features__item-title">{{ item.title }}</h3>

							<p class="section-features__item-desc font-fira-code">
								{{ item.desc }}
							</p>
						</swiper-slide>
					</swiper-container>
				</div>
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import data from "@/data/section-features.json";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionFeatures",
	mixins: [mixinActiveSection],
	data: () => ({
		list: data.list
	}),
	computed: {
		...mapState(useAppStore, ["breakpoints", "activeBreakpoint"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						scrub: true,
						snap: "labelsDirectional",
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
					},
					media: {
						isDesktop: `(min-width: ${this.breakpoints.xl + 0.5}px)`
					},
					callback: this.createMainTimeline
				},
				{
					scrollTrigger: {
						markers: false,
						start: "top-=200 top"
					},
					callback: this.createSecondaryTimeline
				}
			];
		},
		sliderBreakpoints() {
			return {
				[this.breakpoints.xl + 0.5]: {
					allowTouchMove: false
				}
			};
		}
	},
	methods: {
		createMainTimeline(tl, context) {
			const { isDesktop } = context.conditions;

			if (isDesktop) {
				tl.addLabel("begin");

				this.list.forEach((_, index) => {
					tl.add(() => {
						this.$refs.swiperEl.swiper?.slideTo(index);
					}, `+=1`).addLabel(`slide_${index}`);
				});

				tl.addLabel("end");
			}
		},
		createSecondaryTimeline(tl) {
			const { title, desc, link } = this.$refs;

			addBaseAnimationsToTimeline(tl, [
				{ elem: title },
				{ elem: desc, delay: 0.2 },
				{ elem: link, delay: 0.2 }
			]);
		}
	}
};
</script>
