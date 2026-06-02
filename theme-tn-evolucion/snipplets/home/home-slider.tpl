{% set has_main_slider = settings.slider and settings.slider is not empty %}
{% set has_mobile_slider = settings.toggle_slider_mobile and settings.slider_mobile and settings.slider_mobile is not empty %}
{% set slider_align = settings.slider_align %}
{% set slider_animation = settings.slider_animation ? 'true' : 'false' %}

{% if not mobile %}
<div class="js-home-main-slider-container {% if not has_main_slider and not params.preview %}hidden{% endif %}">
{% endif %}
	<div class="{% if mobile %}js-home-mobile-slider{% else %}js-home-main-slider{% endif %}-visibility {% if has_main_slider and has_mobile_slider %}{% if mobile %}d-md-none{% else %}d-none d-md-block{% endif %}{% elseif not settings.toggle_slider_mobile and mobile %}hidden{% endif %}{% if not settings.slider_full %} mt-4{% endif %}">
		<div class="section-slider position-relative">
			<div class="js-home-slider-container container{% if settings.slider_full %}-fluid p-0{% endif %}">
				<div class="js-home-slider-row row{% if settings.slider_full %} no-gutters{% endif %}">
					<div class="col-12">
						<div class="js-home-slider{% if mobile %}-mobile{% endif %} h-100 swiper-container swiper-container-horizontal" data-align="{{ slider_align }}" data-animation="{{ slider_animation }}">
							<div class="swiper-wrapper">
								{% if mobile %}
									{% set slider = settings.slider_mobile %}
								{% else %}
									{% set slider = settings.slider %}
								{% endif %}
								{% for slide in slider %}
									{% set has_text = slide.title or slide.description or slide.button %}
									<div class="swiper-slide slide-container swiper-{{ slide.color }}">
										{% if slide.link %}
											<a href="{{ slide.link | setting_url }}" aria-label="{{ 'Carrusel' | translate }} {{ loop.index }}">
										{% endif %}
										<div class="slider-slide">

											{% set apply_lazy_load = not (loop.first and ((has_main_slider and not has_mobile_slider) or (has_mobile_slider and mobile))) %}

											{% if apply_lazy_load %}
												{% set slide_src = 'images/empty-placeholder.png' | static_url %}
											{% else %}
												{% set slide_src = slide.image | static_url | settings_image_url('large') %}
											{% endif %}

											<img 
												{% if slide.width and slide.height %} width="{{ slide.width }}" height="{{ slide.height }}" {% endif %}
												{% if apply_lazy_load %}data-{% endif %}src="{{ slide_src }}"
												{% if apply_lazy_load %}data-{% endif %}srcset="{{ slide.image | static_url | settings_image_url('large') }} 480w, {{ slide.image | static_url | settings_image_url('huge') }} 640w, {{ slide.image | static_url | settings_image_url('original') }} 1024w, {{ slide.image | static_url | settings_image_url('1080p') }} 1920w"  
												class="js-slider-image slider-image {% if settings.slider_animation %}slider-image-animation{% endif %} {% if apply_lazy_load %}swiper-lazy fade-in{% endif %}{% if not settings.slider_full %} card{% endif %}" alt="{{ 'Carrusel' | translate }} {{ loop.index }}"
											/>
											<div class="placeholder-fade"></div>
											{% if has_text %}
												<div class="js-swiper-text swiper-text{% if slider_align == 'center' %} swiper-text-centered{% endif %} swiper-text-{{ slide.color }}">
													{% if slide.title %}
														<div class="h1-huge mb-2">{{ slide.title }}</div>
													{% endif %}
													{% if slide.description %}
														<p class="mb-2">{{ slide.description }}</p>
													{% endif %}
													{% if slide.button and slide.link %}
														<div class="btn btn-default btn-small d-inline-block">{{ slide.button }}</div>
													{% endif %}
												</div>
											{% endif %}
										</div>
										{% if slide.link %}
											</a>
										{% endif %}
									</div>
								{% endfor %}
							</div>
						</div>
						<div class="{% if settings.slider_full %}js-swiper-home-arrows {% endif %}d-none d-md-block">
							<div class="js-swiper-home-control js-swiper-home-prev{% if mobile %}-mobile{% endif %} swiper-button-prev{% if not settings.slider_full %} swiper-button-outside{% endif %} svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
							<div class="js-swiper-home-control js-swiper-home-next{% if mobile %}-mobile{% endif %} swiper-button-next{% if not settings.slider_full %} swiper-button-outside{% endif %} svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="js-swiper-home-control js-swiper-home-pagination{% if mobile %}-mobile{% endif %} swiper-pagination swiper-pagination-bullets position-relative my-3">
				{% if slider | length > 1 and not params.preview %}
					{% for slide in slider %}
						<span class="swiper-pagination-bullet"></span>
					{% endfor %}
				{% endif %}
			</div>
		</div>
	</div>
{% if not mobile %}
</div>
{% endif %}