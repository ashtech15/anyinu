<template>
	<g-layout-section id="collection-gallery" :timelines-options="timelinesOptions">
		<div class="section-main-collection">
			<div class="section-main-collection__container container">
				<div class="section-main-collection__content">
					<div class="section-main-collection__main">
						<h2 ref="title" class="section-main-collection__title center">AI Doggos</h2>

						<p ref="desc" class="section-main-collection__desc center font-fira-code">
							Introducing AI Doggos! A playful and unique PFP collection where
							adorable canines meet cutting-edge technology. These AI-powered pups
							exist across multiple blockchains, ready to be your loyal companions in
						    the digital world. AI Doggos aren't just about the art – they're a key to a
							vibrant community. 100% of funds collected by Any Inu will go towards 
							CEX listings and marketing.
						</p>

						<a
							ref="link"
							href="https://app.mintlabz.io/minting/ai-doggos"
							target="_blank"
							class="section-main-collection__link g-button g-button--default"
						>
							See all
							<span class="icon-wrap">
								<g-arrow-down-right />
							</span>
						</a>
					</div>

					<div class="section-main-collection__list-wrapper">
						<swiper-container
							:space-between="20"
							:breakpoints="sliderBreakpoints"
							:injectStyles="['.swiper {overflow: visible;}']"
							slides-per-view="auto"
							class="section-main-collection__list"
						>
							<swiper-slide
								ref="items"
								v-for="(item, index) in filteredCollection"
								:key="index"
								class="section-main-collection__item"
							>
								<div class="section-main-collection__item-wrapper">
									<div class="section-main-collection__item-image">
										<img
											:src="`/images/collections/${index + 1}.jpg`"
											:alt="item.title"
										/>
									</div>

									<div class="section-main-collection__item-body">
										<p
											class="section-main-collection__item-info font-fira-code"
										>
											{{ item.info }}
										</p>

										<h3 class="section-main-collection__item-title">
											{{ item.title }}
										</h3>
									</div>
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
import { gsap } from "gsap";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import data from "@/data/collections.json";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";

export default {
	name: "SectionMainCollection",
	mixins: [mixinActiveSection],
	data: () => ({
		collection: data.test,
		snapConfig: {
			snapTo: "labels",
			duration: { min: 0.1, max: 3 },
			ease: "expo.out"
		}
	}),
	computed: {
		...mapState(useAppStore, ["breakpoints", "activeBreakpoint"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						scrub: 1,
						snap: this.snapConfig,
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
					media: {
						isMobile: `(max-width: ${this.breakpoints.xl}px)`
					},
					callback: this.createSecondaryTimeline
				}
			];
		},
		filteredCollection() {
			return this.collection.slice(0, 4);
		},
		sliderBreakpoints() {
			return {
				[this.breakpoints.xl + 0.5]: {
					slidesPerView: 4
				}
			};
		}
	},
	methods: {
		createMainTimeline(tl) {
			const { title, desc, link, items } = this.$refs;

			gsap.set(title, { y: -20, opacity: 0 });
			gsap.set(desc, { y: -20, opacity: 0 });
			gsap.set(link, { y: -20, opacity: 0 });

			tl.addLabel("begin");
			tl.addLabel("rotate");
			items.forEach((item, i) => {
				const wrap = item.querySelector(".section-main-collection__item-wrapper");

				gsap.set(wrap, { rotationY: 0 });

				if (i === 0) {
					tl.to(
						wrap,
						{
							rotationY: 50,
							backgroundImage:
								"linear-gradient(273deg, rgba(0, 0, 0, 0.16) 2.7%, rgba(0, 0, 0, 0.80) 50.25%)",
							duration: 1
						},
						"rotate"
					);
				} else if (i === 1) {
					tl.to(
						wrap,
						{
							rotationY: 44,
							backgroundImage:
								"linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 96.63%)",
							xPercent: -60,
							duration: 1
						},
						"rotate"
					);
				} else if (i === 2) {
					tl.to(
						wrap,
						{
							rotationY: -44,
							backgroundImage:
								"linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 96.63%)",
							xPercent: 60,
							duration: 1
						},
						"rotate"
					);
				} else {
					tl.to(
						wrap,
						{
							rotationY: -50,
							backgroundImage:
								"linear-gradient(273deg, rgba(0, 0, 0, 0.16) 2.7%, rgba(0, 0, 0, 0.80) 50.25%)",
							duration: 1
						},
						"rotate"
					);
				}
			});

			tl.addLabel("beforeEnd");
			tl.to(title, { y: 0, opacity: 1 }, "-=0.5");
			tl.to(desc, { y: 0, opacity: 1, delay: 0.1 }, "-=0.5");
			tl.to(link, { y: 0, opacity: 1, delay: 0.15 }, "-=0.5");

			tl.addLabel("end");
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
