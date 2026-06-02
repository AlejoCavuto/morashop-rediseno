{% set has_home_testimonials = false %}
{% set num_testimonials = 0 %}
{% for testimonial in ['testimonial_01', 'testimonial_02', 'testimonial_03'] %}
	{% set testimonial_image = "#{testimonial}.jpg" | has_custom_image %}
	{% set testimonial_name = attribute(settings,"#{testimonial}_name") %}
	{% set testimonial_description = attribute(settings,"#{testimonial}_description") %}
	{% set has_testimonial = testimonial_name or testimonial_description or testimonial_image %}
	{% if has_testimonial %}
		{% set has_home_testimonials = true %}
		{% set num_testimonials = num_testimonials + 1 %}
	{% endif %}
{% endfor %}

{% if has_home_testimonials or params.preview %}
	<div class="js-section-testimonials section-testimonials-home overflow-none">
		<div class="container">
			<div class="row align-items-center">
				<div class="js-testimonial-title-container {% if num_testimonials == 3 %}col-12{% else %}col-md-2{% endif %}" {% if not settings.testimonials_title %}style="display: none"{% endif %}>
					<h2 class="js-testimonial-title h6 mb-3">{{ settings.testimonials_title }}</h2>
				</div>
				<div class="js-testimonial-container {% if num_testimonials == 3 %}col-12{% else %}col-md-10{% endif %}{% if num_testimonials > 1 %} p-0 px-md-3{% endif %}">
					<div class="js-swiper-testimonials swiper-testimonials swiper-container p-1">
						<div class="swiper-wrapper">
							{% for testimonial in ['testimonial_01', 'testimonial_02', 'testimonial_03'] %}
								{% set testimonial_image = "#{testimonial}.jpg" | has_custom_image %}
								{% set testimonial_name = attribute(settings,"#{testimonial}_name") %}
								{% set testimonial_description = attribute(settings,"#{testimonial}_description") %}
								{% set has_testimonial = testimonial_name or testimonial_description or testimonial_image %}
								
								<div class="js-testimonial-slide {% if loop.last %}js-last-testimonial-slide mr-md-0{% endif %} swiper-slide {% if num_testimonials == 1 %} col-md-6 m-0{% else %} col-md{% endif %} p-0" {% if not has_testimonial %}style="display: none;"{% endif %}>
									<div class="card p-3 text-center">
										<div class="js-testimonial-img-container testimonials-image mb-2" {% if not testimonial_image %}style="display: none"{% endif %}>
											<img class="js-testimonial-img js-testimonial-img-{{ loop.index }} testimonials-image-background lazyload" {% if testimonial_image %}src="{{ 'images/empty-placeholder.png' | static_url }}" data-src='{{ "#{testimonial}.jpg" | static_url | settings_image_url("small") }}'{% endif %} {% if testimonial_name %}alt="{{ testimonial_name }}"{% else %}alt="{{ 'Testimonio de' | translate }} {{ store.name }}"{% endif %} />
											<div class="placeholder-fade"></div>
										</div>
										
										<h3 class="js-testimonial-name js-testimonial-name-{{ loop.index }} font-smallest font-weight-bold mb-2" {% if not testimonial_name %}style="display: none"{% endif %}>{{ testimonial_name }}</h3>
										<p class="js-testimonial-description js-testimonial-description-{{ loop.index }} font-small mb-2" {% if not testimonial_description %}style="display: none"{% endif %}>{{ testimonial_description }}</p>
									</div>
								</div>
							{% endfor %}
						</div>
					</div>
					<div class="js-swiper-testimonials-pagination swiper-pagination swiper-pagination-bullets position-relative d-block d-md-none"></div>
				</div>
			</div>
		</div>
	</div>
{% endif %}