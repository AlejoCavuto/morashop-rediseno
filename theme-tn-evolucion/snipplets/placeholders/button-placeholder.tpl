<div class="js-addtocart js-addtocart-placeholder btn {% if direct_add %}btn-small{% endif %} btn-primary btn-block btn-transition {{ custom_class }} disabled" style="display: none;">
    <div class="d-inline-block">
        <span class="js-addtocart-text">
            {% if direct_add %}
                <div class="d-flex justify-content-center align-items-center">
                    {{ 'Comprar' | translate }}
                    {% include "snipplets/svg/bag.tpl" with {svg_custom_class: 'icon-inline ml-1 ' ~ buy_icon_classes} %}
                </div>
            {% else %}
                {{ 'Agregar al carrito' | translate }}
            {% endif %}
        </span>
        <span class="js-addtocart-success transition-container">
            {% if direct_add %}
                {% include "snipplets/svg/check.tpl" with {svg_custom_class: "icon-inline font-body"} %}
            {% else %}
                {{ '¡Listo!' | translate }}
            {% endif %}
        </span>
        <div class="js-addtocart-adding transition-container transition-icon">
            {% if direct_add %}
                {% include "snipplets/svg/spinner-third-thick.tpl" with {svg_custom_class: "icon-inline icon-spin"} %}
            {% else %}
                {% include "snipplets/svg/spinner-third.tpl" with {svg_custom_class: "icon-inline icon-spin icon-loading mt-1"} %}
            {% endif %}
        </div>
    </div>
</div>