<template>
	<g-layout-section id="token-specifics" :timelines-options="timelinesOptions">
		<div class="section-token-specifics">
			<div class="container">
				<div class="section-token-specifics__content">
					<div class="section-token-specifics__header">
						<h2 ref="title" class="section-token-specifics__header-title">
							Token Specifics
						</h2>

						<p ref="desc" class="section-token-specifics__header-desc font-fira-code">
							Embark on an odyssey through the cryptoverse with Any Inu's Interstellar
							Express. Why settle for one blockchain when you can romp through a
							cosmic playground of 15+ chains? Explore like never before, purchase
							with a tap, and track your journey across the infinite possibilities.
						</p>

						<a
							ref="link"
							class="section-token-specifics__header-button g-button g-button--default"
							href="https://docs.anyinu.xyz/technical/token-specifics"
							target="_blank"
						>
							Learn more

							<div class="icon-wrap">
								<g-arrow-down-right />
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";

export default {
	name: "SectionTokenSpecifics",
	mixins: [mixinActiveSection],
	computed: {
		...mapState(useAppStore, ["breakpoints", "activeBreakpoint"]),
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						pin: true,
						markers: false,
						start: "top top",
						end: "bottom+=300 bottom",
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
					},
					media: {
						isDesktop: `(min-width: ${this.breakpoints.xl + 0.5}px)`
					},
					callback: this.createTimeline
				},
				{
					scrollTrigger: {
						markers: false,
						start: "top-=300 top"
					},
					media: {
						isMobile: `(max-width: ${this.breakpoints.xl}px)`
					},
					callback: this.createTimeline
				}
			];
		}
	},
	methods: {
		createTimeline(tl) {
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
