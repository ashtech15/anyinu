<template>
	<g-layout-section id="roadmap" :timelines-options="timelinesOptions">
		<div class="section-roadmap">
			<div class="container">
				<div class="section-roadmap__content">
					<div class="section-roadmap__header">
						<h2 ref="title" class="section-roadmap__header-title">Project Roadmap</h2>
						<p ref="desc" class="section-roadmap__header-desc">
							Dive into the fun-filled journey of Any Inu. Here's our roadmap,
							showcasing how we're evolving into the alpha dog of the crypto world.
						</p>
					</div>
					<div ref="body" class="section-roadmap__body">
						<div ref="itemsContainer" class="section-roadmap__wrap-transform">
							<div class="section-roadmap__laser">
								<div ref="laserLine" class="section-roadmap__laser-line">
									<div
										class="section-roadmap__laser-line--active"
										:style="`height: calc(${activePointPercentPosition}% + var(--offset-circle))`"
									>
										<div class="section-roadmap__laser-dot"></div>
									</div>
									<div class="section-roadmap__laser-points">
										<div
											ref="points"
											class="section-roadmap__laser-point"
											v-for="(_, index) in list"
											:key="index"
											:class="{ active: index <= activeIndexItem }"
										>
											<div class="circle outer-circle">
												<div class="circle inner-circle">
													<div class="circle center-circle"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="section-roadmap__list">
								<div
									ref="items"
									class="section-roadmap__item"
									v-for="(item, index) in list"
									:key="index"
									:class="{ reverse: index % 2 }"
								>
									<div class="section-roadmap__item-header">
										<h4 class="section-roadmap__item-title">
											{{ item.title }}
										</h4>
									</div>
									<div class="section-roadmap__item-info">
										<div
											class="section-roadmap__item-row"
											v-for="(row, indexJ) in item.infoList"
											:key="indexJ"
										>
											<b class="head">{{ row.head }} &nbsp;</b>
											<span class="text">{{ row.text }}</span>
										</div>
									</div>
								</div>
							</div>
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
import data from "@/data/section-roadmap.json";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionRoadmap",
	mixins: [mixinActiveSection],
	data: () => ({
		list: data,
		points: [],
		items: [],
		snapConfig: {
			snapTo: "labelsDirectional",
			duration: { min: 0.1, max: 3 },
			ease: "expo.out"
		},
		activeIndexItem: -1,
		activePointPercentPosition: 0
	}),
	watch: {
		activeIndexItem() {
			this.getActivePositionPoint();
		}
	},
	computed: {
		...mapState(useAppStore, ["breakpoints"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						scrub: true,
						snap: this.snapConfig,
						end: this.calculateEndSection,
						onUpdate: this.onUpdateSection,
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
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
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.points = this.$refs.points || [];
			this.items = this.$refs.items || [];

			setTimeout(() => {
				this.checkPositionsPoints();
				this.getActivePositionPoint();
			}, 100);
			window.addEventListener("resize", this.resize.bind(this));
		});
	},
	unmounted() {
		window.removeEventListener("resize", this.resize.bind(this));
	},
	methods: {
		resize() {
			this.checkPositionsPoints();
			this.getActivePositionPoint();
		},
		createMainTimeline(tl) {
			const { items, itemsContainer, laserLine } = this.$refs;

			gsap.set(laserLine, { opacity: 0 });

			tl.to(laserLine, { opacity: 1 });

			tl.addLabel("begin");

			items.forEach((item, i) => {
				const itemTitle = item.querySelector(".section-roadmap__item-title");
				const itemInfo = item.querySelector(".section-roadmap__item-info");

				const prevItem = items[i - 1] || items[0];
				const nextItem = items[i + 1] || items[items.length - 1];

				const itemTitlePrev = prevItem.querySelector(".section-roadmap__item-title");
				const itemInfoPrev = prevItem.querySelector(".section-roadmap__item-info");

				gsap.set(itemTitle, { y: 20, opacity: 0 });
				gsap.set(itemInfo, { y: 10, opacity: 0 });

				const indexPlusOne = i + 1;

				tl.addLabel(`start_${indexPlusOne}`);

				if (i === 0) {
					tl.to(itemTitle, {
						y: 0,
						opacity: 1,
						onStart: () => {
							this.activeIndexItem = i;
						},
						onReverseComplete: () => {
							this.activeIndexItem = i - 1;
						}
					});
					tl.to(itemInfo, {
						y: 0,
						opacity: 1
					});
				} else {
					tl.to(
						itemsContainer,
						{
							y: `-=${item.offsetHeight + 20}`,
							onStart: () => {
								this.activeIndexItem = i;
							},
							onReverseComplete: () => {
								this.activeIndexItem = i - 1;
							}
						},
						`start_${indexPlusOne}+=0.1`
					);

					tl.to(
						itemTitle,
						{
							opacity: 1,
							y: 0
						},
						`-=0.1`
					);
					tl.to(
						itemInfo,
						{
							opacity: 1,
							y: 0
						},
						`-=0.1`
					);

					tl.to(
						itemTitlePrev,
						{
							opacity: 0,
							y: -20
						},
						`start_${indexPlusOne}-=0.05`
					);
					tl.to(
						itemInfoPrev,
						{
							opacity: 0,
							y: -20
						},
						`start_${indexPlusOne}-=0.05`
					);
				}
			});

			tl.addLabel("end");
		},
		createSecondaryTimeline(tl) {
			const { title, desc } = this.$refs;

			addBaseAnimationsToTimeline(tl, [{ elem: title }, { elem: desc, delay: 0.2 }]);
		},
		calculateEndSection() {
			const { body } = this.$refs;

			return body.offsetHeight * 5;
		},
		getActivePositionPoint() {
			if (this.activeIndexItem <= this.points.length - 1) {
				const laserLine = this.$refs?.laserLine;
				const height = laserLine?.scrollHeight || 0;
				const posPoint = this.points[this.activeIndexItem]?.offsetTop || 0;
				const percent = (posPoint / height) * 100;

				this.activePointPercentPosition = percent || 0;
			} else {
				this.activePointPercentPosition = 100;
			}
		},
		checkPositionsPoints() {
			const offset = window.innerWidth > 768 ? 8 : 3;

			this.items.forEach((item, index) => {
				const { offsetTop } = item;
				const point = this.points[index];

				point.style.top = `${offsetTop + offset}px`;
			});
		},
		onUpdateSection(cnx) {
			// console.log(cnx, "cnx");
		}
	}
};
</script>
