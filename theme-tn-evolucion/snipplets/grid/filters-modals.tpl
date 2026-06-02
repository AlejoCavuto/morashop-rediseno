<section class="js-category-controls category-controls visible-when-content-ready d-md-none background-secondary">
	<div class="container category-controls-container">
		<div class="category-controls-row row">
			{% if products %}
				<div class="col category-control-item">
					<a href="#" class="js-modal-open d-block text-uppercase font-weight-bold font-small" data-toggle="#sort-by">
						<div class="d-flex justify-content-center align-items-center">
							{% include "snipplets/svg/sort.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
							{{ 'Ordenar' | t }}
						</div>
					</a>
					{% embed "snipplets/modal.tpl" with{modal_id: 'sort-by', modal_class: 'bottom modal-centered modal-bottom-sheet modal-right-md', modal_position: 'bottom', modal_position_desktop: right, modal_width: 'docked-md', modal_transition: 'slide', modal_header_title: true} %}
						{% block modal_head %}
							{{'Ordenar' | translate }}
						{% endblock %}
						{% block modal_body %}
							{% include 'snipplets/grid/sort-by.tpl' with { list: "true"} %}
							<div class="js-sorting-overlay filters-overlay" style="display: none;">
								<div class="filters-updating-message">
									<span class="h5 mr-2">{{ 'Ordenando productos' | translate }}</span>
									<span>
										{% include "snipplets/svg/circle-notch.tpl" with {svg_custom_class: "icon-inline h5 icon-spin svg-icon-text"} %}
									</span>
								</div>
							</div>
						{% endblock %}
					{% endembed %}
				</div>
			{% endif %}
			{% if has_filters_available %}
				<div class="visible-when-content-ready col category-control-item">
					<a href="#" class="js-modal-open js-fullscreen-modal-open d-block text-uppercase font-weight-bold font-small" data-toggle="#nav-filters" data-modal-url="modal-fullscreen-filters" data-component="filter-button">
						<div class="d-flex justify-content-center align-items-center">
							{% include "snipplets/svg/filter.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
							{{ 'Filtrar' | t }}
						</div>
					</a>
					{% embed "snipplets/modal.tpl" with{modal_id: 'nav-filters', modal_class: 'filters', modal_body_class: 'h-100 p-0', modal_position: 'right', modal_position_desktop: right, modal_transition: 'slide', modal_header_title: true, modal_width: 'docked-md', modal_mobile_full_screen: 'true' } %}
						{% block modal_head %}
							{{'Filtros ' | translate }}
						{% endblock %}
						{% block modal_body %}
							{% if has_filters_available %}
								{% if filter_categories is not empty %}
									{% include "snipplets/grid/categories.tpl" with {modal: true} %}
								{% endif %}
								{% if product_filters is not empty %}
							   		{% include "snipplets/grid/filters.tpl" with {modal: true} %}
							   	{% endif %}
								<div class="js-filters-overlay filters-overlay" style="display: none;">
									<div class="filters-updating-message">
										<span class="js-applying-filter h5 mr-2" style="display: none;">{{ 'Aplicando filtro' | translate }}</span>
										<span class="js-removing-filter h5 mr-2" style="display: none;">{{ 'Borrando filtro' | translate }}</span>
										<span class="js-filtering-spinner" style="display: none;">
											{% include "snipplets/svg/circle-notch.tpl" with {svg_custom_class: "icon-inline h5 icon-spin svg-icon-text"} %}
										</span>
									</div>
								</div>
							{% endif %}
						{% endblock %}
					{% endembed %}
				</div>
			{% endif %}
		</div>
	</div>
</section>