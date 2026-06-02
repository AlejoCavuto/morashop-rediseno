{% if infinite_scroll %}
	{% if pages.current == 1 and not pages.is_last %}
		<div class="js-load-more text-center my-4">
			<a class="btn btn-default d-inline-block">
				<span class="js-load-more-spinner" style="display:none;">{% include "snipplets/svg/spinner-third.tpl" with {svg_custom_class: "icon-inline icon-spin"} %}</span>
				{{ 'Mostrar más productos' | t }}
			</a>
		</div>
		<div id="js-infinite-scroll-spinner" class="my-4 text-center w-100" style="display:none">
			{% include "snipplets/svg/spinner-third.tpl" with {svg_custom_class: "icon-inline icon-30px svg-icon-text icon-spin"} %} 
		</div>
	{% endif %}
{% else %}
	<div class="row justify-content-center align-items-center mt-4">
		{% if pages.numbers %}
			<div class="col-auto">
				<a {% if pages.previous %}href="{{ pages.previous }}"{% endif %} class="swiper-button-prev {% if not pages.previous %}opacity-30 disabled{% endif %}">
					{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg pr-1"} %}
				</a>
			</div>
			<div class="col-auto">
				<div class="h4 mb-0 text-center font-weight-normal">
					{% for page in pages.numbers %}
						{% if page.selected %}
							<span>{{ page.number }}</span>
						{% endif %}
					{% endfor %}
					<span>/</span>
					<span>{{ pages.amount }}</span>
				</div>
			</div>
			<div class="col-auto">
				<a {% if pages.next %}href="{{ pages.next }}"{% endif %} class="swiper-button-next {% if not pages.next %}opacity-30 disabled{% endif %}">
					{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg pl-1"} %}
				</a>
			</div>
		{% endif %}
	</div>
{% endif %}