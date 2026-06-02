{% if settings.welcome_message or settings.welcome_text %}
	<div class="js-section-welcome-message section-welcome-home {% if settings.welcome_colors %}section-welcome-home-colors{% endif %}">
		<div class="container {% if settings.welcome_colors %}py-md-3{% endif %}">
			<div class="js-section-welcome-message-align row{% if settings.welcome_align == 'center' %} text-center{% endif %} justify-content-center">
				<div class="col-md-7">
					<h2 class="js-welcome-message-title h1-md mb-3" {% if not settings.welcome_message %}style="display: none"{% endif %}>{{ settings.welcome_message }}</h2>
					<p class="js-welcome-message-text mb-3" {% if not settings.welcome_text %}style="display: none"{% endif %}>{{ settings.welcome_text }}</p>

					{% set has_link = settings.welcome_button and settings.welcome_link %}

					<a href="{{ settings.welcome_link }}" class="js-welcome-message-link btn btn-default {% if has_link %}d-inline-block{% endif %} mt-1" {% if not has_link %}style="display: none"{% endif %} data-url="{{ settings.welcome_link ? 'true' : 'false' }}">{{ settings.welcome_button }}</a>
				</div>
			</div>
		</div>
	</div>
{% endif %}
