<template>
	<g-layout-section id="chains" :timelines-options="timelinesOptions">
		<div class="section-converter-coins">
			<div class="container">
				<div class="section-converter-coins__content">
					<div ref="info" class="section-converter-coins__info">
						<h2 ref="title" class="section-converter-coins__info-title">
							Galactic Gateway to Crypto Glory - Any Inu's Interstellar Express!
						</h2>

						<p ref="desc" class="section-converter-coins__info-desc font-fira-code">
							Embark on an odyssey through the cryptoverse with Any Inu's Interstellar
							Express. Why settle for one blockchain when you can romp through a
							cosmic playground of 15+ chains? Explore like never before, purchase
							with a tap, and track your journey across the infinite possibilities.
						</p>

						<a
							ref="link"
							class="section-converter-coins__info-button g-button g-button--default"
							href="https://stats.anyinu.xyz/"
							target="_blank"
						>
							Stats Dashboard

							<div class="icon-wrap">
								<g-arrow-down-right />
							</div>
						</a>
					</div>

					<div class="section-converter-coins__widget">
						<iframe
							class="section-converter-coins__iframe"
							width="440"
							height="690"
							src="https://widget.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22any-inu-8ba9fded-f6fc-41b2-8bb5-2078ddd0308b%22%2C%22companyName%22%3A%22Any%20Inu%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%236A61FF%22%2C%22baseContent%22%3A%22%23FDFDFD%22%2C%22base100%22%3A%22%23342C90%22%2C%22base200%22%3A%22%23181C63%22%2C%22base300%22%3A%22%2313164E%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%232EAEB0%22%2C%22primary%22%3A%22%236C5BE0%22%2C%22secondary%22%3A%22%234030FA%22%2C%22secondaryContent%22%3A%22%23F6F7FB%22%2C%22neutral%22%3A%22%230C1536%22%2C%22roundedBtn%22%3A%228px%22%2C%22roundedCornerBtn%22%3A%22999px%22%2C%22roundedBox%22%3A%2212px%22%2C%22roundedDropDown%22%3A%228px%22%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22enableExpress%22%3Atrue%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22mainLogoUrl%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2Fanyinu%2FMediaAssets%2Ff660da8963f55e249353f62522d0b479d6dbc7a0%2Fai.svg%22%2C%22comingSoonChainIds%22%3A%5B%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Swap%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Select%20Token%22%2C%22chains%22%3A%22Select%20Chain%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Select%20Token%22%2C%22destination%22%3A%22Destination%20address%22%2C%22depositAddress%22%3A%22Deposit%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22environment%22%3A%22mainnet%22%2C%22showOnRampLink%22%3Atrue%2C%22defaultTokens%22%3A%5B%5D%7D"
							frameborder="0"
						></iframe>
					</div>

					<div ref="list" class="section-converter-coins__wrap-list">
						<div
							ref="coinsList"
							:data-lenis-prevent="enableCoinsListScroll ? '' : null"
							class="section-converter-coins__list custom-scrollbar"
							@pointerenter="pointerenter"
							@pointerleave="pointerleave"
						>
							<div
								class="section-converter-coins__item"
								v-for="(item, index) in list"
								:key="index"
							>
								<div class="section-converter-coins__item-icon">
									<img
										class="img"
										:src="`/images/coins/${item.image}`"
										:alt="item.title"
									/>
								</div>

								<div class="section-converter-coins__item-desc">
									<h4 class="section-converter-coins__item-title">
										{{ item.title }}
									</h4>
									<a
										class="section-converter-coins__item-token font-fira-code"
										:href="`${item.explorer}`"
										target="_blank"
									>
										{{ item.token }}
									</a>
								</div>

								<a
									class="section-converter-coins__item-button g-button g-button--default"
									:href="item.link"
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
			</div>
		</div>
	</g-layout-section>
</template>

<script>
import data from "@/data/coins.json";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import { gsap } from "gsap";
import { addBaseAnimationsToTimeline } from "@/helpers/base-timeline-creator.js";
import mixinActiveSection from "@/mixins/mixinActiveSection.js";

export default {
	name: "SectionConverter",
	mixins: [mixinActiveSection],
	data: () => ({
		list: data,
		enableCoinsListScroll: false
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
		}
	},
	beforeUnmount() {
		this.$refs.coinsList.removeEventListener("wheel", this.handleScroll);
	},
	methods: {
		createMainTimeline(tl) {
			const { info, list } = this.$refs;

			gsap.set(list, { yPercent: 100, opacity: 0 });

			tl.addLabel("begin")
				.addLabel("show_list", "+=0.5")
				.to(info, { yPercent: -150, opacity: 0 }, "show_list")
				.to(list, { yPercent: 0, opacity: 1 }, "show_list")
				.addLabel("end");
		},
		createSecondaryTimeline(tl) {
			const { title, desc, link } = this.$refs;

			addBaseAnimationsToTimeline(tl, [
				{ elem: title },
				{ elem: desc, delay: 0.2 },
				{ elem: link, delay: 0.2 }
			]);
		},
		pointerenter({ target }) {
			if (target.scrollHeight > target.offsetHeight) {
				target.addEventListener("wheel", this.handleScroll);
				this.enableCoinsListScroll = true;
			}
		},
		pointerleave({ target }) {
			target.removeEventListener("wheel", this.handleScroll);
			this.enableCoinsListScroll = false;
		},
		handleScroll({ currentTarget, deltaY }) {
			const scrollTop = currentTarget.scrollTop;
			const scrollLimit = currentTarget.scrollHeight - currentTarget.clientHeight - 5;

			if ((scrollTop === 0 && deltaY < 0) || (scrollTop >= scrollLimit && deltaY > 0)) {
				this.enableCoinsListScroll = false;
			} else {
				this.enableCoinsListScroll = true;
			}
		}
	}
};
</script>
