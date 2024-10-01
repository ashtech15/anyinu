<template>
	<g-layout-section id="collection" :timelines-options="timelinesOptions">
		<div ref="body" class="section-collection">
			<div class="section-collection__container container">
				<div class="section-collection__content">
					<div class="section-collection__main">
						<h2 ref="title" class="section-collection__title">DogNexus 404</h2>

						<p ref="desc" class="section-collection__desc font-fira-code">
							The first gas efficient erc20 + erc721 hybrid token. A house for your
							doggo or your coins.
						</p>

						<a
							ref="link"
							href="https://opensea.io/collection/dognexus404"
							class="section-collection__link g-button g-button--default"
						>
							See all
							<span class="icon-wrap">
								<g-arrow-down-right />
							</span>
						</a>
					</div>

					<div class="section-collection__list-wrapper">
						<swiper-container
							ref="swiperEl"
							:centeredSlides="true"
							:space-between="50"
							:breakpoints="sliderBreakpoints"
							slides-per-view="auto"
							class="section-collection__list"
						>
							<swiper-slide
								ref="items"
								v-for="(item, index) in collection"
								:key="index"
								class="swiper-slide section-collection__item"
							>
								<div class="section-collection__item-image">
									<img
										:src="`/images/collections/dognexus_404/${index + 1}.jpg`"
										:alt="item.title"
									/>
								</div>
							</swiper-slide>
						</swiper-container>
					</div>
				</div>
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import data from "@/data/collections.json";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionCollection",
	mixins: [mixinActiveSection],
	data: () => ({
		collection: data.test
	}),
	computed: {
		...mapState(useAppStore, ["breakpoints"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						scrub: true,
						snap: "labelsDirectional",
						end: this.calculateEndSection,
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
					},
					media: {
						isDesktop: `(min-width: ${this.breakpoints.md + 0.5}px)`
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
		},
		sliderBreakpoints() {
			return {
				[this.breakpoints.md + 0.5]: {
					direction: "vertical",
					spaceBetween: 50,
					allowTouchMove: false
				},
				[this.breakpoints.xl + 0.5]: {
					direction: "vertical",
					spaceBetween: 70,
					allowTouchMove: false
				}
			};
		}
	},
	methods: {
		createMainTimeline(tl) {
			tl.addLabel("begin");

			this.collection.forEach((_, index) => {
				tl.add(() => {
					this.$refs.swiperEl.swiper?.slideTo(index);
				}, `+=1`).addLabel(`slide_${index}`);
			});

			tl.addLabel("end");
		},
		createSecondaryTimeline(tl) {
			const { title, desc, link } = this.$refs;

			addBaseAnimationsToTimeline(tl, [
				{ elem: title },
				{ elem: desc, delay: 0.2 },
				{ elem: link, delay: 0.2 }
			]);
		},
		calculateEndSection() {
			const { items, body } = this.$refs;

			const heightSection = body.offsetHeight;
			const heightItems = items.reduce((acc, item) => (acc += item.offsetHeight / 2), 0);

			return `+=${heightSection + heightItems}`;
		}
	}
};
</script>
