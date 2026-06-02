{% set sort_text = {
'score-descending': 'Relevancia',
'user': 'Destacado',
'price-ascending': 'Precio: Menor a Mayor',
'price-descending': 'Precio: Mayor a Menor',
'alpha-ascending': 'A - Z',
'alpha-descending': 'Z - A',
'created-ascending': 'Más Viejo al más Nuevo',
'created-descending': 'Más Nuevo al más Viejo',
'best-selling': 'Más Vendidos',
} %}
<div class="js-sort-by-list radio-button-container"> 
	{% for sort_method in sort_methods %}
		{# This is done so we only show the user sorting method when the user chooses it #}
		{% if sort_method != 'user' or category.sort_method == 'user' %}
			<a href="#" class="js-apply-sort radio-button radio-button-item {% if sort_by == sort_method %}selected{% endif %}" data-sort-value="{{ sort_method }}">
				<div class="radio-button-content {% if sort_method == 'user' %}mb-0{% endif %}">
					<span class="radio-button-icons-container">
						<div class="radio-button-icons">
							<div class="radio-button-icon unchecked"></div>
							<div class="radio-button-icon checked"></div>
						</div>
					</span>
					<span class="radio-button-label">
						{{ sort_text[sort_method] | t }}
					</span>
				</div>
			</a>
		{% endif %}
	{% endfor %}
</div>