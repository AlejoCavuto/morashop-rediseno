{% set has_advertising_bar = false %}
{% set num_messages = 0 %}
{% for adbar in ['ad_bar_01', 'ad_bar_02', 'ad_bar_03'] %}
    {% set advertising_text = attribute(settings,"#{adbar}_text") %}
    {% if advertising_text %}
        {% set num_messages = num_messages + 1 %}
    {% endif %}
{% endfor %}
{% set show_adbar_only_mobile = 'adbar_img_mobile.jpg' | has_custom_image and (not 'adbar_img_desktop.jpg' | has_custom_image and not num_messages) %}
{% set show_adbar_only_desktop = 'adbar_img_desktop.jpg' | has_custom_image and (not 'adbar_img_mobile.jpg' | has_custom_image and not num_messages) %}
{% set adbar_images = 'adbar_img_mobile.jpg' | has_custom_image or 'adbar_img_desktop.jpg' | has_custom_image %}
{% set both_images_without_messages = 'adbar_img_mobile.jpg' | has_custom_image and 'adbar_img_desktop.jpg' | has_custom_image and not num_messages %}

{% if settings.ad_bar and (num_messages or adbar_images ) %}
    <section class="js-adbar section-adbar {% if num_messages %}adbar-with-messages{% endif %}  {% if show_adbar_only_mobile %}d-md-none{% elseif show_adbar_only_desktop %}d-none d-md-block{% endif %}">
        {% if num_messages %}
            <div class="js-swiper-adbar swiper-container text-center">
                <div class="js-swiper-adbar-wrapper adbar-text-container font-smallest font-md-small text-uppercase font-weight-bold swiper-adbar swiper-wrapper align-items-center">
                    {% for adbar in ['ad_bar_01', 'ad_bar_02', 'ad_bar_03'] %}
                        {% set advertising_text = attribute(settings,"#{adbar}_text") %}
                        {% set advertising_url = attribute(settings,"#{adbar}_url") %}
                        {% if advertising_text %}
                            <div class="js-adbar-slide adbar-message swiper-slide slide-container {% if num_messages == 1 %}px-3{% endif %}">
                                {% if advertising_url %}
                                    <a href="{{ advertising_url }}" class="d-block w-100">
                                {% endif %}
                                        {{ advertising_text }}
                                {% if advertising_url %}
                                    </a>
                                {% endif %}
                            </div>
                        {% endif %}
                    {% endfor %}
                </div>
                {% if num_messages > 1 %}
                    <div class="js-swiper-adbar-prev swiper-button-absolute swiper-button-prev svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-sm"} %}</div>
                    <div class="js-swiper-adbar-next swiper-button-absolute swiper-button-next svg-icon-text ml-2">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-sm"} %}</div>
                {% endif %}
            </div>
        {% endif %}
        {% if num_messages and adbar_images %}
            <div class="adbar-img-container {% if num_messages %}adbar-with-messages{% endif %}">
        {% endif %}
        {% if 'adbar_img_mobile.jpg' | has_custom_image and not advertising_url | length %}
            {% if settings.adbar_img_mobile_url and not num_messages %}
                <a href="{{ settings.adbar_img_mobile_url }}" class="w-100 d-block d-md-none">
            {% endif %}
                    <img data-src="" data-srcset='{{ 'adbar_img_mobile.jpg' | static_url | settings_image_url('large') }} 480w, {{ 'adbar_img_mobile.jpg' | static_url | settings_image_url('huge') }} 640w, {{ 'adbar_img_mobile.jpg' | static_url | settings_image_url('original') }} 1024w' class='js-adbar-img-mobile lazyload adbar-img d-block d-md-none mb-neg-1'/>
            {% if settings.adbar_img_mobile_url and not num_messages %}
                </a>
            {% endif %}
        {% endif %}

        {% if 'adbar_img_desktop.jpg' | has_custom_image %}
            {% if settings.adbar_img_desktop_url and not num_messages %}
                <a href="{{ settings.adbar_img_desktop_url }}" class="w-100 d-none d-md-block">
            {% endif %}
                    <img data-src="" data-srcset='{{ 'adbar_img_desktop.jpg' | static_url | settings_image_url('large') }} 480w, {{ 'adbar_img_desktop.jpg' | static_url | settings_image_url('huge') }} 640w, {{ 'adbar_img_desktop.jpg' | static_url | settings_image_url('original') }} 1024w, {{ 'adbar_img_desktop.jpg' | static_url | settings_image_url('1080p') }} 1920w' class='js-adbar-img-desktop lazyload adbar-img d-none d-md-block mb-neg-1'/>
            {% if settings.adbar_img_desktop_url and not num_messages %}
                </a>
            {% endif %}
        {% endif %}
        {% if num_messages and adbar_images %}
            </div>
        {% endif %}
    </section>
{% endif %}
