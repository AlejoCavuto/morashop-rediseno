{# /*============================================================================
  #Home featured grid
==============================================================================*/

#Properties

#Featured Slider

#}

{% set featured_products = featured_products | default(false) %}
{% set new_products = new_products | default(false) %}
{% set sale_products = sale_products | default(false) %}
{% set promotion_products = promotion_products | default(false) %}
{% set best_seller_products = best_seller_products | default(false) %}
{% set theme_editor = params.preview %}

{# Check if slider is used #}

{% set has_featured_products_and_slider = featured_products and settings.featured_products_format == 'slider' %}
{% set has_new_products_and_slider = new_products and settings.new_products_format == 'slider' %}
{% set has_sale_products_and_slider = sale_products and settings.sale_products_format == 'slider' %}
{% set has_promotion_products_and_slider = promotion_products and settings.promotion_products_format == 'slider' %}
{% set has_best_seller_products_and_slider = best_seller_products and settings.best_seller_products_format == 'slider' %}
{% set use_slider = has_featured_products_and_slider or has_new_products_and_slider or has_sale_products_and_slider or has_promotion_products_and_slider or has_best_seller_products_and_slider %}

{% if featured_products %}
    {% set sections_products = sections.primary.products %}
    {% set section_name = 'primary' %}
    {% set section_image_desktop = "featured_product_image.jpg" %}
    {% set section_image_mobile = "featured_product_image_mobile.jpg" %}
    {% set section_horizontal_item = settings.featured_products_horizontal_item ? true : false %}
    {% set section_columns_desktop = settings.featured_products_desktop %}
    {% set section_columns_mobile = settings.featured_products_mobile %}
    {% set section_slider = settings.featured_products_format == 'slider' %}
    {% set section_format = settings.featured_products_format %}
    {% set section_id = 'featured' %}
    {% set section_title = settings.featured_products_title %}
{% endif %}
{% if new_products %}
    {% set sections_products = sections.new.products %}
    {% set section_name = 'new' %}
    {% set section_image_desktop = "new_product_image.jpg" %}
    {% set section_image_mobile = "new_product_image_mobile.jpg" %}
    {% set section_horizontal_item = settings.new_products_horizontal_item ? true : false %}
    {% set section_columns_desktop = settings.new_products_desktop %}
    {% set section_columns_mobile = settings.new_products_mobile %}
    {% set section_slider = settings.new_products_format == 'slider' %}
    {% set section_format = settings.new_products_format %}
    {% set section_id = 'new' %}
    {% set section_title = settings.new_products_title %}
{% endif %}
{% if sale_products %}
    {% set sections_products = sections.sale.products %}
    {% set section_name = 'sale' %}
    {% set section_image_desktop = "sale_product_image.jpg" %}
    {% set section_image_mobile = "sale_product_image_mobile.jpg" %}
    {% set section_horizontal_item = settings.sale_products_horizontal_item ? true : false %}
    {% set section_columns_desktop = settings.sale_products_desktop %}
    {% set section_columns_mobile = settings.sale_products_mobile %}
    {% set section_slider = settings.sale_products_format == 'slider' %}
    {% set section_format = settings.sale_products_format %}
    {% set section_id = 'sale' %}
    {% set section_title = settings.sale_products_title %}
{% endif %}
{% if promotion_products %}
    {% set sections_products = sections.promotion.products %}
    {% set section_name = 'promotion' %}
    {% set section_image_desktop = "promotion_product_image.jpg" %}
    {% set section_image_mobile = "promotion_product_image_mobile.jpg" %}
    {% set section_columns_desktop = settings.promotion_products_desktop %}
    {% set section_horizontal_item = settings.promotion_products_horizontal_item ? true : false %}
    {% set section_columns_mobile = settings.promotion_products_mobile %}
    {% set section_slider = settings.promotion_products_format == 'slider' %}
    {% set section_format = settings.promotion_products_format %}
    {% set section_id = 'promotion' %}
    {% set section_title = settings.promotion_products_title %}
{% endif %}
{% if best_seller_products %}
    {% set sections_products = sections.best_seller.products %}
    {% set section_name = 'best_seller' %}
    {% set section_image_desktop = "best_seller_product_image.jpg" %}
    {% set section_image_mobile = "best_seller_product_image_mobile.jpg" %}
    {% set section_horizontal_item = settings.best_seller_products_horizontal_item ? true : false %}
    {% set section_columns_desktop = settings.best_seller_products_desktop %}
    {% set section_columns_mobile = settings.best_seller_products_mobile %}
    {% set section_slider = settings.best_seller_products_format == 'slider' %}
    {% set section_format = settings.best_seller_products_format %}
    {% set section_id = 'best-seller' %}
    {% set section_title = settings.best_seller_products_title %}
{% endif %}
{% set section_columns_slider_mobile = section_columns_mobile == '1' ? '1.15' : '2.25' %}
{% set image_desktop = section_image_desktop | has_custom_image %}
{% set image_mobile = section_image_mobile | has_custom_image %}

<div class="js-products-{{ section_id }}-container container" data-image-desktop="{{ image_desktop ? 'true' : 'false' }}" data-image-mobile="{{ image_mobile ? 'true' : 'false' }}" data-item-color-variants="{{ settings.product_color_variants ? 'true' : 'false' }}" data-item-stock="{{ settings.product_item_stock ? 'true' : 'false' }}" data-item-quickshop="{{ settings.quick_shop ? 'true' : 'false' }}">
    <div class="row">
        <div class="js-products-{{ section_id }}-horizontal-title-col col-{% if section_horizontal_item == true %}md-2{% else %}12{% endif %}{% if use_slider and not section_horizontal_item == true %} pr-0 pr-md-3{% endif %}">
            <h2 class="js-products-{{ section_id }}-title section-title h3 mb-3{% if section_horizontal_item == true %} mt-md-3{% endif %}" {% if not section_title %}style="display: none;"{% endif %}>{{ section_title }}</h2>
        {% if section_horizontal_item == true %}
        </div>
        <div class="js-products-{{ section_id }}-horizontal-content-col col-md-10{% if use_slider %} pr-0 pr-md-3{% endif %}">
        {% endif %}
            {% if use_slider %}
                <div class="js-swiper-{{ section_id }} swiper-container p-1">
            {% endif %}
                    <div class="js-products-{{ section_id }}-grid {% if use_slider %}swiper-wrapper{% else %}row row-grid{% endif %}" data-desktop-columns="{{ section_columns_desktop }}" data-mobile-columns="{{ section_columns_mobile }}" data-mobile-slider-columns="{{ section_columns_slider_mobile }}" data-format="{{ section_format }}" data-horizontal-item="{{ section_horizontal_item }}">
                        {% for product in sections_products %}
                            {% if use_slider %}
                                {% include 'snipplets/grid/item.tpl' with {'slide_item': true, 'section_name': section_name, 'section_columns_desktop': section_columns_desktop, 'section_columns_mobile': section_columns_mobile, 'horizontal_item': section_horizontal_item } %}
                            {% else %}
                                {% include 'snipplets/grid/item.tpl' with {'horizontal_item': section_horizontal_item } %}
                            {% endif %}
                        {% endfor %}
                    </div>
            {% if use_slider %}
                </div>
                <div class="js-swiper-{{ section_id }}-prev swiper-button-prev swiper-button-outside d-none d-md-block svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
                <div class="js-swiper-{{ section_id }}-next swiper-button-next swiper-button-outside d-none d-md-block svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
            {% endif %}
        </div>
    </div>
</div>

{% if image_desktop or image_mobile or theme_editor %}
    {% if image_desktop or theme_editor %}
        <img {% if image_desktop %}src="{{ 'images/empty-placeholder.png' | static_url }}" data-srcset='{{ section_image_desktop | static_url | settings_image_url('large') }} 480w, {{ section_image_desktop | static_url | settings_image_url('huge') }} 640w, {{ section_image_desktop | static_url | settings_image_url('original') }} 1024w, {{ section_image_desktop | static_url | settings_image_url('1080p') }} 1920w'{% endif %} class='js-products-{{ section_id }}-desktop-image js-products-section-image lazyload background-home-image{% if not section_slider %} h-auto{% endif %}{% if image_mobile %} d-none d-md-block{% endif %}' {% if not image_desktop %}style="display: none;"{% endif %}/>
    {% endif %}
    {% if image_mobile or theme_editor %}
        <img {% if image_mobile %}src="{{ 'images/empty-placeholder.png' | static_url }}" data-srcset='{{ section_image_mobile | static_url | settings_image_url('large') }} 480w, {{ section_image_mobile | static_url | settings_image_url('huge') }} 640w, {{ section_image_mobile | static_url | settings_image_url('original') }} 1024w'{% endif %} class="js-products-{{ section_id }}-mobile-image js-products-section-image lazyload background-home-image{% if not section_slider %} h-auto{% endif %}{% if image_desktop %} d-block d-md-none{% endif %}" {% if not image_mobile %}style="display: none;"{% endif %}/>
    {% endif %}
{% endif %}

