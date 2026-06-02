{# Slider that work as example #}

<div class="js-home-slider-placeholder">
	<div class="section-slider position-relative">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="js-home-empty-slider h-100 swiper-container">
						<div class="swiper-wrapper">
							<div class="swiper-slide slide-container">
								{% include "snipplets/svg/help/help-slider.tpl" %}
							</div>
							<div class="swiper-slide slide-container">
								{% include "snipplets/svg/help/help-slider.tpl" %}
							</div>
							<div class="swiper-slide slide-container">
								{% include "snipplets/svg/help/help-slider.tpl" %}
							</div>
						</div>
						<div class="placeholder-overlay placeholder-slider transition-soft">
							<div class="placeholder-info">
								{% include "snipplets/svg/edit.tpl" with {svg_custom_class: "icon-inline icon-3x"} %}
								<div class="placeholder-description font-small-xs">
									{{ "Podés subir imágenes principales desde" | translate }} <strong>"{{ "Carrusel de imágenes" | translate }}"</strong>
								</div>
								{% if not params.preview %}
									<a href="{{ admin_link }}#instatheme=pagina-de-inicio" class="btn-primary btn btn-small placeholder-button">{{ "Editar" | translate }}</a>
								{% endif %}
							</div>
						</div>
					</div>
					<div class="{d-none d-md-block">
						<div class="js-swiper-empty-home-prev swiper-button-prev swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
						<div class="js-swiper-empty-home-next swiper-button-next swiper-button-outside svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="js-swiper-empty-home-pagination swiper-pagination swiper-pagination-bullets swiper-pagination position-relative my-3">
			<span class="swiper-pagination-bullet"></span>
			<span class="swiper-pagination-bullet"></span>
			<span class="swiper-pagination-bullet"></span>
		</div>
	</div>
</div>

{# Skeleton of "true" section accessed from instatheme.js #}
<div class="js-home-slider-top" style="display:none">
	{% include 'snipplets/home/home-slider.tpl' %}
	{% if has_mobile_slider %}
		{% include 'snipplets/home/home-slider.tpl' with {mobile: true} %}
	{% endif %}
</div>