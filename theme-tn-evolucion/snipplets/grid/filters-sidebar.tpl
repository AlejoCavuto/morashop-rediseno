<div class="col-md-auto filters-sidebar d-none d-md-block visible-when-content-ready">
    {% if products %}
        {% if filter_categories is not empty %}
            {% include "snipplets/grid/categories.tpl" %}
        {% endif %}
        {% if product_filters is not empty %}	   
            {% include "snipplets/grid/filters.tpl" %}
        {% endif %}
    {% endif %}
</div>