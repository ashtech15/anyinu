<template>
	<g-layout-section id="hero" :timelines-options="timelinesOptions">
		<div class="section-hero">
			<div class="container">
				<div class="section-hero__content">
					<div class="section-hero__header">
						<h1 ref="header" class="section-hero__header-text">
							<span class="first">AI —</span>
							<span class="second">Any Inu</span>
						</h1>
					</div>
					<div class="section-hero__desc">
						<p ref="desc-text" class="section-hero__desc-text">
							It's where smarts meet wags – Any Inu, the dog that's leading the crypto
							pack – and beyond!
						</p>

						<a
							ref="desc-btn"
							class="section-hero__desc-button g-button g-button--default g-button--animation"
							href="https://matcha.xyz/tokens/ethereum/0x2598c30330d5771ae9f983979209486ae26de875?sellChain=1&sellAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
							target="_blank"
						>
							Buy Now

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
import { gsap } from "gsap";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionHero",
	mixins: [mixinActiveSection],
	computed: {
		timelinesOptions() {
			return [
				{
					scrollTrigger: {
						onEnter: this.setCurrentSection,
						onEnterBack: this.setCurrentSection
					},
					callback: this.createMainTimeline
				}
			];
		}
	},
	methods: {
		createMainTimeline() {
			const header = this.$refs.header;
			const descText = this.$refs["desc-text"];
			const descBtn = this.$refs["desc-btn"];

			gsap.to(header.children[0], { y: 0, duration: 1, opacity: 1, delay: 0.3 });
			gsap.to(header.children[1], { y: 0, duration: 1, opacity: 1, delay: 0.7 });

			gsap.to(descText, { y: 0, duration: 1, opacity: 1, delay: 1.3 });
			gsap.to(descBtn, { y: 0, duration: 1, opacity: 1, delay: 1.8 });
		}
	},
	mounted() {
		this.$nextTick(() => {
			const header = this.$refs.header;
			const descText = this.$refs["desc-text"];
			const descBtn = this.$refs["desc-btn"];

			gsap.set(header.children[0], { y: 50, opacity: 0 });
			gsap.set(header.children[1], { y: 50, opacity: 0 });
			gsap.set(descText, { y: -20, opacity: 0 });
			gsap.set(descBtn, { y: -20, opacity: 0 });
		});
	}
};
</script>
