<div class="swiper-slide col-auto col-md{% if num_banners_services == 1 %}-6 px-3 px-md-0{% endif %} p-0{% if loop.last %} mr-md-0{% endif %}">
    {% if banner_services_url %}
        <a href="{{ banner_services_url | setting_url }}">
    {% endif %}
    <div class="card p-3">
        <div class="row no-gutters">
            <div class="col-auto icon-60px icon-circle home-circle-image">
                {% if banner_services_icon == 'image' and banner_services_image %}
                    <img class="service-item-image align-item-middle lazyload" src="{{ 'images/empty-placeholder.png' | static_url }}" data-src='{{ "#{banner}.jpg" | static_url | settings_image_url("large") }}' {% if banner_services_title %}alt="{{ banner_services_title }}"{% else %}alt="{{ 'Banner de' | translate }} {{ store.name }}"{% endif %} />
                {% elseif banner_services_icon == 'shipping' %}
                    {% include "snipplets/svg/truck.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'card' %}
                    {% include "snipplets/svg/credit-card.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'security' %}
                    {% include "snipplets/svg/security.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'returns' %}
                    {% include "snipplets/svg/returns.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'whatsapp' %}
                    {% include "snipplets/svg/whatsapp-line.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'promotions' %}
                    {% include "snipplets/svg/promotions.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% elseif banner_services_icon == 'cash' %}
                    {% include "snipplets/svg/cash.tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
                {% endif %}
            </div>
            {% if banner_services_title or banner_services_description %}
                <div class="col pl-3">
                    <div class="align-item-middle">
                        {% if banner_services_title %}
                            <h3 class="h6 mb-1">{{ banner_services_title }}</h3>
                        {% endif %}
                        {% if banner_services_description %}
                            <p class="m-0 font-small service-text">{{ banner_services_description }}</p>
                        {% endif %}
                    </div>
                </div>
            {% endif %}
        </div>
    </div>
    {% if banner_services_url %}
        </a>
    {% endif %}
</div>
