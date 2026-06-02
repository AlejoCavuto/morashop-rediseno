{# Testimonials that work as examples #}

<div class="js-section-testimonials js-testimonials-placeholder section-testimonials-home overflow-none">
	<div class="container">
		<div class="row align-items-center">
			<div class="col-12">
				<h2 class="js-testimonial-title h6 mb-3">{{ 'Testimonios' | translate }}</h2>
			</div>
			<div class="col-12 p-0 px-md-3">
				<div class="js-swiper-testimonials-demo swiper-testimonials swiper-container p-1">
					<div class="swiper-wrapper">
						<div class="swiper-slide col-md p-0">
							<div class="card p-3 text-center">
								<div class="testimonials-image icon-circle mb-2">
									{% include "snipplets/svg/user.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text icon-2x opacity-50"} %}
								</div>
								<h3 class="font-smallest font-weight-bold mb-2">{{ 'Testimonio' | translate }}</h3>
								<p class="font-small mb-2">{{ 'Descripción del testimonio' | translate }}</p>
							</div>
						</div>
						<div class="swiper-slide col-md p-0">
							<div class="card p-3 text-center">
								<div class="testimonials-image icon-circle mb-2">
									{% include "snipplets/svg/user.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text icon-2x opacity-50"} %}
								</div>
								<h3 class="font-smallest font-weight-bold mb-2">{{ 'Testimonio' | translate }}</h3>
								<p class="font-small mb-2">{{ 'Descripción del testimonio' | translate }}</p>
							</div>
						</div>
						<div class="swiper-slide col-md p-0 mr-md-0">
							<div class="card p-3 text-center">
								<div class="testimonials-image icon-circle mb-2">
									{% include "snipplets/svg/user.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text icon-2x opacity-50"} %}
								</div>
								<h3 class="font-smallest font-weight-bold mb-2">{{ 'Testimonio' | translate }}</h3>
								<p class="font-small mb-2">{{ 'Descripción del testimonio' | translate }}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="js-swiper-testimonials-pagination-demo swiper-pagination swiper-pagination-bullets position-relative d-block d-md-none"></div>
			</div>
		</div>
	</div>
</div>

{# Skeleton of "true" section accessed from instatheme.js #}
<div class="js-testimonials-top" style="display:none">    
    {% include 'snipplets/home/home-testimonials.tpl' %}
</div>