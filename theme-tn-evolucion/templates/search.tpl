{% set has_filters_available = products and has_filters_enabled and (filter_categories is not empty or product_filters is not empty) %}

{% if settings.pagination == 'infinite' %}
	{% paginate by 12 %}
{% else %}
	{% if settings.grid_columns_desktop == '5' %}
		{% paginate by 50 %}
	{% else %}
		{% paginate by 48 %}
	{% endif %}
{% endif %}


<div class="background-secondary mb-md-3">
	<div class="container">
		{% set page_header_class_value = 'py-3 pt-md-4 ' ~ (search_filter ? 'pb-md-2' : 'pb-md-4') %}
		{% set page_header_padding_value = not products ? true %}
		{% embed "snipplets/page-header.tpl" with { breadcrumbs: false, container: false, padding: page_header_padding_value, page_header_class: page_header_class_value } %}
			{% block page_header_text %}
				{% if products %}
					{{ 'Resultados de búsqueda' | translate }}
				{% else %}
					{{ "No encontramos nada para" | translate }}<span class="ml-2">"{{ query }}"</span>
				{% endif %}
			{% endblock page_header_text %}
		{% endembed %}
		{% if products %}
			<div class="row align-items-center">
				<div class="col">
					<h2 class="h5 mb-4 mb-md-0 font-weight-normal">
						{{ "Mostrando los resultados para" | translate }}<span class="ml-2 font-weight-bold">"{{ query }}"</span>
					</h2>
				</div>
				{% if search_filter %}
					<div class="col-auto py-3 py-md-4">
						<a href="#" class="js-modal-open btn-link d-none d-md-block" data-toggle="#sort-by">
							<div class="d-flex justify-content-center align-items-center">
								{% include "snipplets/svg/sort.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
								{{ 'Ordenar' | t }}
							</div>
						</a>
						{% if products | length > 1 %}
							<div class="d-md-none text-right font-small mb-1">
								{{ products_count }} {{ 'productos' | translate }}
							</div>
						{% endif %}
					</div>
				{% endif %}
			</div>
		{% endif %}
	</div>
</div>

{% if products and search_filter %}
	{% include 'snipplets/grid/filters-modals.tpl' %}
	<section class="js-category-controls-prev category-controls-sticky-detector"></section>
{% endif %}

<section class="category-body overflow-none">
	<div class="container {% if has_applied_filters %}mt-md-0{% endif %}mb-5 {% if products %}mt-3{% endif %}">
		{% if products %}
			<div class="row"> 
		{% endif %}
			{% if has_applied_filters %}
				<div class="col-12 mb-3 mb-md-4 d-flex justify-content-md-end align-items-center visible-when-content-ready">
					{% include "snipplets/grid/filters.tpl" with {applied_filters: true} %}
				</div>
			{% endif %}
			{% if has_filters_available and search_filter %} 
				{% include 'snipplets/grid/filters-sidebar.tpl' %}
			{% endif %}
			{% include 'snipplets/grid/products-list.tpl' %}
		{% if products %}
			</div>
		{% endif %}
	</div>
</section>