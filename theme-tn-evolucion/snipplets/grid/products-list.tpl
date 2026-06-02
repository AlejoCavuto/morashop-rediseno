{% set noFilterResult = "No tenemos resultados para tu búsqueda. Por favor, intentá con otros filtros." %}
{% set list_data_store = template == 'category' ? 'category-grid-' ~ category.id : 'search-grid' %}

{% if products or template == 'category' %}
    <div class="col" data-store="{{ list_data_store}}">
{% endif %}
    {% if products %}
        <div class="js-product-table row row-grid">
            {% include 'snipplets/product_grid.tpl' %}
        </div>
        {% if settings.pagination == 'infinite' %}
            {% set pagination_type_val = true %}
        {% else %}
            {% set pagination_type_val = false %}
        {% endif %}
        {% include "snipplets/grid/pagination.tpl" with {infinite_scroll: pagination_type_val} %}
    {% else %}
        {% if template == 'category' %}
            <div class="h6 text-center" data-component="filter.message">
                {{(has_filters_enabled ? noFilterResult : "Próximamente") | translate}}
            </div>
        {% elseif template == 'search' %}
            <h5 class="my-4 {% if has_applied_filters %}text-center{% endif %} {% if not has_applied_filters %}text-uppercase font-weight-normal{% endif %}">
                {{ ((has_applied_filters and query) or has_applied_filters ?  noFilterResult : "Escribilo de otra forma y volvé a intentar.") | translate }}
            </h5>
        {% endif %}
    {% endif %}
{% if products or template == 'category'%}
    </div>
{% endif %}

