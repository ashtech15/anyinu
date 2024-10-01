<template>
	<header class="app-header" :class="{ 'menu-opened': isMenuOpen }">
		<div class="app-header__content">
			<div class="app-header__frame">
				<img class="app-header__frame-image" src="@/assets/images/frame.png" alt="frame" />
			</div>

			<app-header-pagination
				:pagination-list="paginationList"
				:current-section-id="currentSectionId"
				@go-to-section="$emit('go-to-section', $event)"
			/>

			<div class="app-header__logo">
				<img class="app-header__logo-icon" src="@/assets/images/logo.svg" alt="logo" />
			</div>

			<button class="app-header__burger button" @click="toggleMobileMenu">
				<div class="app-header__burger-text">
					<transition name="slide" mode="out-in">
						<p class="text" v-if="isMenuOpen">close</p>
						<p class="text" v-else>menu</p>
					</transition>
				</div>

				<div class="app-header__burger-icon">
					<div></div>
				</div>
			</button>

			<div class="app-header__wrap-menu" data-lenis-prevent>
				<ul ref="menu" class="app-header__menu list-unstyled">
					<li v-for="(item, index) in menu" :key="index" class="app-header__menu-item">
						<button
							v-if="item.sectionId"
							class="app-header__menu-link"
							@click="$emit('go-to-section', item.sectionId)"
						>
							{{ item.title }}
						</button>

						<a v-else :href="item.url" class="app-header__menu-link">{{
							item.title
						}}</a>
					</li>
				</ul>

				<div class="app-header__follow">
					<div class="app-header__follow-head">Follow us</div>
					<div class="app-header__follow-list">
						<img
							class="app-header__follow-share"
							src="@/assets/images/share.svg"
							alt="share"
						/>

						<div class="app-header__follow-wrap">
							<a
								v-for="(item, index) in social"
								:href="item.url"
								:key="index"
								class="app-header__follow-link"
							>
								<img
									:src="item.icon"
									:alt="item.title"
									class="app-header__follow-img"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import headerData from "@/data/header.json";
import socialNetworks from "@/data/social-networks.json";
import { gsap } from "gsap";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app.js";
import AppHeaderPagination from "@/components/AppHeader/AppHeaderPagination.vue";

export default {
	name: "AppHeader",
	components: {
		AppHeaderPagination
	},
	emits: ["go-to-section"],
	data: () => ({
		isMenuOpen: false,
		items: [],
		social: socialNetworks,
		menu: headerData.menu,
		paginationList: headerData.pagination_list
	}),
	watch: {
		preloaderIsShown() {
			this.startAnimation();
		}
	},
	computed: {
		...mapState(useAppStore, ["preloaderIsShown", "currentSectionId"])
	},
	mounted() {
		this.$nextTick(() => {
			const menu = this.$refs.menu?.children || [];

			this.items = Array(...menu);

			this.items.forEach((item, i) => {
				gsap.set(item, { y: -20, opacity: 0 });
			});
		});

		window.addEventListener("resize", this.toggleMobileMenu.bind(this, false));
	},
	methods: {
		startAnimation() {
			const stepShowTime = 0.2;

			this.items.forEach((item, i) => {
				gsap.to(item, { y: 0, duration: 1, opacity: 1, delay: (i + 1) * stepShowTime });
			});
		},
		toggleMobileMenu(state = null) {
			if (typeof state !== "boolean") {
				this.isMenuOpen = !this.isMenuOpen;
			} else {
				this.isMenuOpen = state;
			}

			// TODO: hide scroll body GSAP
			if (this.isMenuOpen) {
				document.documentElement.classList.add("menu-opened");
			} else {
				document.documentElement.classList.remove("menu-opened");
			}
		}
	}
};
</script>
