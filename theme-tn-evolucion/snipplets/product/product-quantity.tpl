{# Product quantity #}

<div class="col-4 {% if not quickshop %}col-md-3{% endif %} pr-0">
    {% embed "snipplets/forms/form-input.tpl" with{
    type_number: true, input_value: '1',
    input_name: 'quantity' ~ item.id, 
    input_custom_class: 'js-quantity-input form-control-big', 
    input_label: false, 
    input_append_content: true, 
    input_group_custom_class: 'js-quantity form-quantity', 
    form_control_container_custom_class: 'col px-0',
    form_data_component: 'product.adding-amount',
    form_control_quantity: true,
    input_min: '1',
    data_component: 'adding-amount.value',
    input_aria_label: 'Cambiar cantidad' | translate } %}
        {% block input_prepend_content %}
        <div class="form-row m-0 align-items-center" data-component="product.quantity">
            <span class="js-quantity-down form-quantity-icon btn icon-30px font-small" data-component="product.quantity.minus">
                {% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline mt-2"} %}
            </span>
        {% endblock input_prepend_content %}
        {% block input_append_content %}
            <span class="js-quantity-up form-quantity-icon btn icon-30px font-small" data-component="product.quantity.plus">
                {% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline mt-2"} %}
            </span>
        </div>
        {% endblock input_append_content %}
    {% endembed %}

    {% if settings.product_stock %}
        {% set qty = product.selected_or_first_available_variant.stock|default(0) %}
        <div class="font-small py-2 text-center">
            {# Mantener comportamiento original cuando qty <= 0 #}
            {% if qty <= 0 %}
                <span class="js-product-stock">{{ product.selected_or_first_available_variant.stock }}</span> {{ "en stock" | translate }}

            {% elseif qty < 100 %}
                {# 1–99: número exacto #}
                <span class="js-product-stock">{{ qty }}</span> {{ "en stock" | translate }}

            {% else %}
                {# 100 o más: +100 #}
                <span class="js-product-stock">+100</span> {{ "en stock" | translate }}
            {% endif %}
        </div>
    {% endif %}
</div>
