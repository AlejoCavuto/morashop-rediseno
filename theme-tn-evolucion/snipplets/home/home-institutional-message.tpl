{% if settings.institutional_message or settings.institutional_text %}
	<div class="js-section-institutional-message section-institutional-home {% if settings.institutional_colors %}section-institutional-home-colors{% endif %}">
		<div class="container {% if settings.institutional_colors %}py-md-3{% endif %}">
			<div class="js-section-institutional-message-align row{% if settings.institutional_align == 'center' %} text-center{% endif %} justify-content-center">
				<div class="col-md-7">
					<h2 class="js-institutional-message-title h1-md mb-3" {% if not settings.institutional_message %}style="display: none"{% endif %}>{{ settings.institutional_message }}</h2>
					<p class="js-institutional-message-text mb-3" {% if not settings.institutional_text %}style="display: none"{% endif %}>{{ settings.institutional_text }}</p>

					{% set has_link = settings.institutional_button and settings.institutional_link %}

					<a href="{{ settings.institutional_link }}" class="js-institutional-message-link btn btn-default {% if has_link %}d-inline-block{% endif %} mt-1" {% if not has_link %}style="display: none"{% endif %} data-url="{{ settings.institutional_link ? 'true' : 'false' }}">{{ settings.institutional_button }}</a>
				</div>
			</div>
		</div>
	</div>
{% endif %}
