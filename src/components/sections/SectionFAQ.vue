<template>
	<g-layout-section id="faq" :timelines-options="timelinesOptions">
		<div class="section-faq">
			<div class="container">
				<div class="section-faq__content">
					<div class="section-faq__header">
						<h2 class="section-faq__header-title" ref="title">
							Fetching Answers to Bark Worthy Questions - The Any Inu FAQ Pack!
						</h2>
					</div>
					<div class="section-faq__list">
						<div
							ref="items"
							class="section-faq__item"
							v-for="(item, index) in list"
							:key="index"
							:class="{ active: index === activeIndexItem }"
						>
							<div class="section-faq__item-header" @click="toggleAccordion(index)">
								<div class="section-faq__item-number font-fira-code">
									//{{ (index + 1).toString().padStart(2, "0") }}
								</div>
								<h4 class="section-faq__item-title">
									{{ item.title }}
								</h4>
								<img
									class="section-faq__item-icon"
									src="@/assets/images/plus.svg"
									alt="plus"
								/>
							</div>
							<p
								ref="accordionList"
								class="section-faq__item-desc font-fira-code"
								v-html="item.content"
							></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import data from "@/data/faq.json";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";

export default {
	name: "SectionFAQ",
	mixins: [mixinActiveSection],
	data: () => ({
		list: data,
		activeIndexItem: -1,
		accordionList: []
	}),
	computed: {
		...mapState(useAppStore, ["breakpoints", "activeBreakpoint"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						markers: false,
						start: "top-=200 top"
					},
					callback: this.createTimeline
				}
			];
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.accordionList = this.$refs?.accordionList || [];
		});
	},
	methods: {
		createTimeline(tl) {
			const { title, items } = this.$refs;

			addBaseAnimationsToTimeline(tl, [
				{ elem: title },
				...items.map((item, index) => ({ elem: item, delay: (index + 1) * 0.1 }))
			]);
		},
		toggleAccordion(index) {
			const accordionCurrentContent = this.accordionList[this.activeIndexItem];
			const accordionNextContent = this.accordionList[index];

			if (accordionCurrentContent) {
				accordionCurrentContent.style.maxHeight = "0px";
			}

			if (accordionNextContent) {
				if (this.activeIndexItem === index) {
					this.activeIndexItem = -1;
				} else {
					this.activeIndexItem = index;
					accordionNextContent.style.maxHeight = `${accordionNextContent.scrollHeight}px`;
				}
			}
		}
	}
};
</script>
