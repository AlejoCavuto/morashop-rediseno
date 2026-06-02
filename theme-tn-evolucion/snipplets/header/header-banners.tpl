<div class="head-banners row align-items-center justify-content-end" data-store="head-banners">
    {% set has_1_banner = (not settings.head_informative_banner_01_show and settings.head_informative_banner_02_show) or (settings.head_informative_banner_01_show and not settings.head_informative_banner_02_show) %}
    {% for banner in ['head_informative_banner_01', 'head_informative_banner_02'] %}
        {% set head_informative_banner = attribute(settings,"#{banner}_show") %}
        {% set head_informative_banner_icon = attribute(settings,"#{banner}_icon") %}
        {% set head_informative_banner_image = "#{banner}.jpg" | has_custom_image %}
        {% set head_informative_banner_title = attribute(settings,"#{banner}_title") %}
        {% set head_informative_banner_url = attribute(settings,"#{banner}_url") %}
        {% set head_informative_banner_link_text = attribute(settings,"#{banner}_link_text") %}
        {% set header_banner_has_link = head_informative_banner_url and head_informative_banner_link_text %}
        {% set has_head_informative_banner =  head_informative_banner and (head_informative_banner_title or header_banner_has_link) %}
        {% if has_head_informative_banner %}
            <div class="col col-xl-auto head-banner-item">
                {% if head_informative_banner_url %}
                    <a href="{{ head_informative_banner_url | setting_url }}">
                {% endif %}
                <div class="row align-items-center {% if has_1_banner %}justify-content-center{% endif %}">
                    {% if head_informative_banner_icon != 'none' %}
                        <div class="col-auto pr-0">
                            {% if head_informative_banner_icon == 'image' and head_informative_banner_image %}
                                <img class="head-banner-item-image lazyload" src="{{ 'images/empty-placeholder.png' | static_url }}" data-src='{{ "#{banner}.jpg" | static_url | settings_image_url("large") }}' {% if head_informative_banner_title %}alt="{{ head_informative_banner_title }}"{% else %}alt="{{ 'Banner de' | translate }} {{ store.name }}"{% endif %} />
                            {% elseif head_informative_banner_icon == 'shipping' %}
                                {% include "snipplets/svg/map-marker-alt.tpl" with {svg_custom_class: "icon-inline head-banner-icon"} %}
                            {% elseif head_informative_banner_icon == 'store' %}
                                {% include "snipplets/svg/store.tpl" with {svg_custom_class: "icon-inline head-banner-icon head-banner-icon"} %}
                            {% elseif head_informative_banner_icon == 'card' %}
                                {% include "snipplets/svg/credit-card.tpl" with {svg_custom_class: "icon-inline head-banner-icon"} %}
                            {% elseif head_informative_banner_icon == 'cash' %}
                                {% include "snipplets/svg/cash.tpl" with {svg_custom_class: "icon-inline head-banner-icon"} %}
                            {% endif %}
                        </div>
                    {% endif %}
                    {% if head_informative_banner_title or header_banner_has_link %}
                        <div class="{% if has_1_banner %}col-auto{% else %}col{% endif %} {% if has_1_banner or head_informative_banner_icon == 'none' %} justify-content-center{% endif %} {% if head_informative_banner_icon == 'none' %}col-md-auto text-center text-md-left{% endif %} pl-0 pl-md-3">
                    {% endif %}
                        {% if head_informative_banner_title %}
                            <div class="text-uppercase font-weight-bold mb-1">{{ head_informative_banner_title }}</div>
                        {% endif %}
                        {% if header_banner_has_link %}
                            <div>{{ head_informative_banner_link_text }}</div>
                        {% endif %}
                    {% if head_informative_banner_title or header_banner_has_link %}
                        </div>
                    {% endif %}
                </div>
                {% if head_informative_banner_url %}
                    </a>
                {% endif %}
            </div>
        {% endif %}
    {% endfor %}
</div>