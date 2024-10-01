<template>
	<footer class="app-footer">
		<div class="app-footer__container container">
			<div class="app-footer__content">
				<div class="app-footer__logo">
					<div class="app-footer__logo-image">
						<img src="@/assets/images/footer-logo.png" alt="logo" />
					</div>
				</div>

				<div class="app-footer__contact right">
					<h2 class="app-footer__contact-title">Contact Us</h2>

					<a
						href="mailto:anyinucoin@gmail.com"
						class="app-footer__contact-item font-fira-code"
					>
						<img class="icon" src="/images/icons/icon-blue-mail.svg" alt="" />
						anyinucoin@gmail.com
					</a>
				</div>

				<div class="app-footer__menu">
					<h2 class="app-footer__menu-title">Other useful links:</h2>

					<ul v-if="menu && menu.length" class="app-footer__menu-list list-unstyled">
						<li
							v-for="(item, index) in menu"
							class="app-footer__menu-item"
							:key="index"
						>
							<a
								:href="item.url"
								:target="item.target"
								class="app-footer__menu-link uppercase"
								>{{ item.title }}</a
							>
						</li>
					</ul>
				</div>

				<h2 class="app-footer__title right">Any Inu</h2>
			</div>

			<div class="app-footer__bottom">
				<p class="app-footer__info">© 2024 Any Inu - The Alpha Dog of Crypto.</p>

				<ul class="app-footer__social-list list-unstyled">
					<li
						v-for="(item, index) in social"
						class="app-footer__social-item"
						:key="index"
					>
						<a
							:href="item.url"
							class="app-footer__social-link"
							:aria-label="item.title"
						>
							<img :src="item.icon" :alt="item.title" />
						</a>
					</li>
				</ul>

				<p class="app-footer__copyright right">
					All rights reserved, but belly rubs are free!
				</p>
			</div>
		</div>
	</footer>
</template>

<script>
import footerData from "@/data/footer.json";
import socialNetworks from "@/data/social-networks.json";

export default {
	name: "AppFooter",
	data: () => ({
		menu: footerData.menu,
		social: socialNetworks
	})
};
</script>
