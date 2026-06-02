{% set notification_without_recommendations_classes = 'js-alert-added-to-cart notification-floating notification-cart-container notification-hidden notification-fixed position-absolute' %}
{% set notification_wrapper_classes = 
    related_products ? 'row no-gutters p-3 mb-4' 
    : not related_products and not settings.head_fix_desktop ? notification_without_recommendations_classes ~ ' position-fixed-md' 
    : notification_without_recommendations_classes 
%}

<div class="{{ notification_wrapper_classes }} item" {% if not related_products %}style="display: none;"{% endif %}>
    <div class="{% if related_products %}col-12 col-md mb-3 mb-md-0{% else %}notification notification-primary notification-cart{% endif %}">
        {% if not related_products %}
            <div class="js-cart-notification-close notification-close mr-2 mt-2">
                {% include "snipplets/svg/times.tpl" with {svg_custom_class: "icon-inline icon-lg notification-icon"} %}
            </div>
        {% endif %}
        <div class="js-cart-notification-item row no-gutters" data-store="cart-notification-item">
            <div class="col-auto pr-0 notification-img">
                <img src="" class="js-cart-notification-item-img img-absolute-centered-vertically" />
            </div>
            <div class="col text-left py-2 pl-2">
                <div class="{% if related_products %}mb-2{% else %}mb-1{% endif %} mr-4">
                    <span class="js-cart-notification-item-name"></span>
                    <span class="js-cart-notification-item-variant-container" style="display: none;">
                        {% if related_products %}
                        <span class="font-small">
                        {% endif %}
                            (<span class="js-cart-notification-item-variant"></span>)
                        {% if related_products %}
                        </span>
                        {% endif %}
                    </span>
                </div>
                <div class="mb-1">
                    <span class="js-cart-notification-item-quantity"></span>
                    <span> x </span>
                    <span class="js-cart-notification-item-price"></span>
                </div>
                {% if not related_products %}
                    <strong>{{ '¡Agregado al carrito!' | translate }}</strong>
                {% endif %}
            </div>
        </div>
    </div>
    {% if related_products %}
        <div class="col-12 col-md-auto">
            <div class="mb-3">
                <div class="row text-primary h6 font-body mb-3">
                    <span class="col-auto text-left">
                        <strong>{{ "Total" | translate }}</strong> 
                        (<span class="js-cart-widget-amount">
                            {{ "{1}" | translate(cart.items_count ) }} 
                        </span>
                        <span class="js-cart-counts-plural" style="display: none;">
                            {{ 'productos' | translate }}):
                        </span>
                        <span class="js-cart-counts-singular" style="display: none;">
                            {{ 'producto' | translate }}):
                        </span>
                    </span>
                    <strong class="js-cart-total col text-right">{{ cart.total | money }}</strong>
                </div>
            </div>
            <a href="#" data-toggle="#modal-cart" data-modal-url="modal-fullscreen-cart" class="js-modal-close js-modal-open js-fullscreen-modal-open btn btn-primary d-block">{{ 'Ver carrito' | translate }}</a>
        </div>
    {% endif %}
</div>