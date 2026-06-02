{# Brands that work as examples #}

<section class="section-brands-home overflow-none" data-store="home-brands">
	<div class="container">
		<div class="row align-items-center">
			<div class="col-md-2">
				<h2 class="h6 mb-3 m-md-0">{{ 'Marcas' | translate }}</h2>
			</div>
			<div class="col-md-10">
				<div class="js-swiper-brands-demo swiper-container text-center w-auto mx-4 m-md-0">
					<div class="swiper-wrapper">
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
						<div class="swiper-slide slide-container text-center">
							<div class="home-circle-image home-circle-image-demo home-circle-image-md opacity-10-line background-secondary">
								{% include "snipplets/svg/help/help-logo.tpl" with {svg_custom_class: "icon-inline icon-lg opacity-50"} %}
							</div>
						</div>
					</div>
				</div>
				<div class="js-swiper-brands-prev-demo swiper-button-prev swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
				<div class="js-swiper-brands-next-demo swiper-button-next swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
				{% if admin_user %}
					<div class="placeholder-overlay placeholder-slider transition-soft">
						<div class="placeholder-info">
							{% include "snipplets/svg/edit.tpl" with {svg_custom_class: "icon-inline icon-3x"} %}
							<div class="placeholder-description font-small-xs">
								{{ "Podés subir logos para el" | translate }} </br><strong>"{{ "Marcas" | translate }}"</strong>
							</div>
							{% if not params.preview %}
								<a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
							{% endif %}
						</div>
					</div>
				{% endif %}
			</div>
		</div>
	</div>
</section>
