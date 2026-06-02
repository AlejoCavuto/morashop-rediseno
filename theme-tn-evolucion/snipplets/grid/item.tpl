{# /*============================================================================
  #Item grid
==============================================================================*/

#Properties

#Slide Item

#}

{% set slide_item = slide_item | default(false) %}

{% if template == 'home'%}
    {% set columns_desktop = section_columns_desktop %}
    {% set columns_mobile = section_columns_mobile %}
    {% set section_slider = section_slider %}
{% else %}
    {% set columns_desktop = settings.grid_columns_desktop %}
    {% set columns_mobile = settings.grid_columns_mobile %}
    {% if template == 'product'%}
        {% set section_slider = true %}
    {% endif %}
{% endif %}

{% set appear_transition = appear_transition ?? true %}
{% set hide_bag_icon_on_mobile_class = columns_mobile == 2 ? 'item-quickshop-icon-md' : '' %}
{% set theme_editor = params.preview %}

{# Item image slider #}

{% set show_image_slider = 
    (template == 'category' or template == 'search')
    and settings.product_item_slider
    and not slide_item
    and not reduced_item 
    and not has_filters
    and product.other_images
%}

{% if show_image_slider %}
    {% set slider_control_class = 'icon-inline' %}
    {% set slider_controls_container_class = 'item-slider-controls-container svg-icon-text d-none d-md-block' %}
    {% set control_prev = include ('snipplets/svg/chevron-left.tpl', {svg_custom_class: slider_control_class}) %}
    {% set control_next = include ('snipplets/svg/chevron-right.tpl', {svg_custom_class: slider_control_class}) %}
{% endif %}

{# Secondary images #}

{% set show_secondary_image = settings.product_hover %}

{% if slide_item %}
    <div class="swiper-slide">
{% endif %}
    <div class="js-item-product{% if slide_item %} js-item-slide p-0{% endif %}{% if not slide_item %} col-{% if columns_mobile == 1 or horizontal_item %}12{% else %}6{% endif %} col-md-{% if horizontal_item %}4{% elseif columns_desktop == 4 %}3{% elseif columns_desktop == 5 %}2-4{% elseif columns_desktop == 5 %}{% else %}2{% endif %}{% endif %} item-product {% if reduced_item %}item-product-reduced{% endif %} col-grid" data-product-type="list" data-product-id="{{ product.id }}" data-store="product-item-{{ product.id }}" data-component="product-list-item" data-component-value="{{ product.id }}" {% if appear_transition %}data-transition="fade-in-up"{% endif %}>
        <div class="js-item-container item{% if horizontal_item %} item-horizontal{% endif %}{% if slide_item %} mb-0{% endif %}">

            {% if horizontal_item and not (settings.quick_shop or settings.product_color_variants) %}
                <div class="js-item-horizontal-container row{% if horizontal_item %} no-gutters{% endif %}">
            {% elseif not reduced_item and (settings.quick_shop or settings.product_color_variants) %}
                <div class="js-item-quickshop-or-colors-container js-product-container js-quickshop-container{% if product.variations %} js-quickshop-has-variants{% endif %} position-relative{% if horizontal_item %} row no-gutters{% endif %}" data-variants="{{ product.variants_object | json_encode }}" data-quickshop-id="quick{{ product.id }}">
            {% endif %}

            {% set product_url_with_selected_variant = has_filters ?  ( product.url | add_param('variant', product.selected_or_first_available_variant.id)) : product.url  %}

            {% if params.preview %}
                {% set mobile_image_viewport_space = '100' %}
                {% set desktop_image_viewport_space = '50' %}
            {% else %}
                {% if columns_mobile == 2 %}
                    {% set mobile_image_viewport_space = '50' %}
                {% else %}
                    {% set mobile_image_viewport_space = '100' %}
                {% endif %}

                {% if columns_desktop == 4 %}
                    {% set desktop_image_viewport_space = '25' %}
                {% elseif columns_desktop == 3 %}
                    {% set desktop_image_viewport_space = '33' %}
                {% else %}
                    {% set desktop_image_viewport_space = '50' %}
                {% endif %}
            {% endif %}

            {% set image_classes = 'js-item-image lazyautosizes lazyload img-absolute img-absolute-centered fade-in' %}
            {% set data_expand = show_image_slider ? '50' : '-10' %}

            {% set floating_elements %}
                {% if not reduced_item %}
                    {% include 'snipplets/labels.tpl' with {labels_floating: true} %}
                {% endif %}
            {% endset %}
            
            {{ component(
                'product-item-image', {
                    image_lazy: true,
                    image_lazy_js: true,
                    image_thumbs: ['small', 'medium', 'large', 'huge', 'original'],
                    image_data_expand: data_expand,
                    image_secondary_data_sizes: 'auto',
                    image_sizes: '(max-width: 768px)' ~ mobile_image_viewport_space ~ 'vw, (min-width: 769px)' ~ desktop_image_viewport_space ~ 'vw',
                    secondary_image: show_secondary_image,
                    slider: show_image_slider,
                    placeholder: true,
                    custom_content: floating_elements,
                    slider_pagination_container: true,
                    svg_sprites: false,
                    product_item_image_classes: {
                        image_container: 'item-image' ~ (columns == 1 ? ' item-image-big') ~ (show_image_slider ? ' item-image-slider') ~ (horizontal_item ? ' col-auto pr-0'),
                        image_padding_container: 'js-item-image-padding position-relative d-block',
                        image: image_classes,
                        image_featured: 'item-image-featured',
                        image_secondary: 'item-image-secondary',
                        slider_container: 'swiper-container position-absolute h-100 w-100',
                        slider_wrapper: 'swiper-wrapper',
                        slider_slide: 'swiper-slide item-image-slide',
                        slider_control_pagination_container: 'item-slider-pagination-container d-md-none ' ~ (product.images_count == 2 ? 'two-bullets'),
                        slider_control_pagination: 'swiper-pagination item-slider-pagination',
                        slider_control: 'icon-inline icon-lg',
                        slider_control_prev_container: 'swiper-button-prev ' ~ slider_controls_container_class,
                        slider_control_next_container: 'swiper-button-next ' ~ slider_controls_container_class,
                        more_images_message: 'item-more-images-message',
                        placeholder: 'placeholder-fade',
                    },
                    custom_control_prev: control_prev,
                    custom_control_next: control_next,
                })
            }}

            {% if (settings.quick_shop or settings.product_color_variants) and product.available and product.display_price and product.variations and not reduced_item %}
                <div class="js-item-variants hidden">
                    <form class="js-product-form" method="post" action="{{ store.cart_url }}">
                        <input type="hidden" name="add_to_cart" value="{{product.id}}" />
                        {% if product.variations %}
                            {% include "snipplets/product/product-variants.tpl" with {quickshop: true} %}
                        {% endif %}
                        {% set state = store.is_catalog ? 'catalog' : (product.available ? product.display_price ? 'cart' : 'contact' : 'nostock') %}
                        {% set texts = {'cart': "Agregar al carrito", 'contact': "Consultar precio", 'nostock': "Sin stock", 'catalog': "Consultar"} %}
                        {% set show_product_quantity = product.available and product.display_price %}
                        <div class="row mt-3">
                            {% if show_product_quantity %}
                                {% include "snipplets/product/product-quantity.tpl" with {quickshop: true} %}
                            {% endif %}
                            <div class="{% if show_product_quantity %}col-8{% else %}col-12{% endif %}">
                                <input type="submit" class="js-addtocart js-prod-submit-form btn-add-to-cart btn btn-primary btn-big w-100 {{ state }}" value="{{ texts[state] | translate }}" {% if state == 'nostock' %}disabled{% endif %} />
                                {% include 'snipplets/placeholders/button-placeholder.tpl' with {custom_class: "btn-big"} %}
                            </div>
                        </div>
                    </form>
                </div>
            {% endif %}
            {% set show_labels = not product.has_stock or product.compare_at_price or product.hasVisiblePromotionLabel %}
            <div class="js-item-description item-description{% if horizontal_item %} col{% endif %}" data-store="product-item-info-{{ product.id }}">
                <a href="{{ product_url_with_selected_variant }}" title="{{ product.name }}" aria-label="{{ product.name }}" class="item-link">
                    <div class="js-item-name item-name {% if horizontal_item or reduced_item %}mb-2{% else %}mt-1 mb-3{% endif %} opacity-80" data-store="product-item-name-{{ product.id }}">{{ product.name }}</div>
                    {% if not reduced_item %}
                        {% include 'snipplets/labels.tpl' %}
                    {% endif %}
                    {% if product.display_price %}
                        <div class="item-price-container" data-store="product-item-price-{{ product.id }}">
                            <span class="js-price-display item-price mr-1 {% if reduced_item %}font-body{% endif %} font-weight-bold" data-product-price="{{ product.price }}">
                                {{ product.price | money }}
                            </span>
                            {% if not reduced_item %}
                                <span class="js-compare-price-display price-compare mt-1 ml-0" {% if not product.compare_at_price or not product.display_price %}style="display:none;"{% else %}style="display:inline-block;"{% endif %}>
                                    {{ product.compare_at_price | money }}
                                </span>
                            {% endif %}
                            {% set product_can_show_installments = product.show_installments and product.display_price and product.get_max_installments.installment > 1 and settings.product_installments and not reduced_item %}
                            {% set discount_price_spacing_classes = product_can_show_installments ? 'mb-2' %}
                            {{ component('payment-discount-price', {
                                    visibility_condition: settings.payment_discount_price,
                                    location: 'product',
                                    container_classes: discount_price_spacing_classes ~ " mt-2 font-weight-bold",
                                }) 
                            }}
                            {% if product_can_show_installments %}
                                {{ component('installments', {'location' : 'product_item' , 'short_wording' : true, container_classes: { installment: "item-installments mt-1"}}) }}
                            {% endif %}
                        </div>
                    {% endif %}
                    {% if (settings.product_color_variants and not (horizontal_item or reduced_item)) or theme_editor %}
                        <div class="js-item-colors-container" {% if theme_editor and horizontal_item %}style="display: none;"{% endif %}>
                            {% include 'snipplets/grid/item-colors.tpl' %}
                        </div>
                    {% endif %}
                    {% if product.available and product.display_price and (settings.quick_shop or settings.product_item_stock) and not reduced_item %}
                        <div class="js-quickshop-or-stock-container row row-grid {% if horizontal_item %}mt-2{% else %}mt-3{% endif %} align-items-center">
                        {% if settings.quick_shop %}
                            <div class="js-item-quickshop-container item-actions col-grid {% if settings.product_item_stock %}col{% if horizontal_item %}-auto pr-0{% endif %}{% else %}{% if horizontal_item %}col-8{% endif %} col-md-9{% endif %}">
                                {% if product.variations %}
                                    <span data-toggle="#quickshop-modal" data-modal-url="modal-fullscreen-quickshop" href="#" class="js-quickshop-modal-open js-fullscreen-modal-open {% if slide_item %}js-quickshop-slide{% endif %} js-modal-open btn btn-primary btn-small d-flex justify-content-center align-items-center" title="{{ 'Compra rápida de' | translate }} {{ product.name }}" aria-label="{{ 'Compra rápida de' | translate }} {{ product.name }}" data-component="product-list-item.add-to-cart" data-component-value="{{product.id}}">
                                        <span class="js-open-quickshop-wording">{{ 'Comprar' | translate }}</span>
                                        {% include "snipplets/svg/bag.tpl" with {svg_custom_class: 'js-open-quickshop-icon icon-inline ml-1 ' ~ hide_bag_icon_on_mobile_class} %}
                                    </span>
                                {% else %}
                                    <form class="js-product-form" method="post" action="{{ store.cart_url }}">
                                        <input type="hidden" name="add_to_cart" value="{{product.id}}" />
                                        {% set state = store.is_catalog ? 'catalog' : (product.available ? product.display_price ? 'cart' : 'contact' : 'nostock') %}
                                        {% set texts = {'cart': "Comprar", 'contact': "Consultar precio", 'nostock': "Sin stock", 'catalog': "Consultar"} %}
                                        <div class="js-item-submit-container item-submit-container position-relative{% if not settings.product_item_stock %} float-left d-inline-block w-100{% endif %}">
                                            <input type="submit" class="js-addtocart js-prod-submit-form btn btn-primary btn-small btn-block {% if hide_bag_icon_on_mobile_class %}btn-small-quickshop-md{% else %}btn-small-quickshop{% endif %} {{ state }}" value="{{ texts[state] | translate }}" alt="{{ texts[state] | translate }}" {% if state == 'nostock' %}disabled{% endif %} data-component="product-list-item.add-to-cart" data-component-value="{{ product.id }}"/>
                                            {% include "snipplets/svg/bag.tpl" with {svg_custom_class: 'js-quickshop-bag icon-inline item-quickshop-icon ' ~ hide_bag_icon_on_mobile_class} %}
                                        </div>
                                        {% include 'snipplets/placeholders/button-placeholder.tpl' with {direct_add: true, buy_icon_classes: hide_bag_icon_on_mobile_class} %}
                                    </form>
                                {% endif %}
                            </div>
                        {% endif %}
                        {% if settings.product_item_stock and not reduced_item %}
                            <div class="js-item-stock-container item-stock {% if settings.quick_shop %}col-grid col-auto my-2 {% if columns_mobile == 2 and not horizontal_item %}pl-0 pl-md-1{% else %}pl-2{% endif %}{% if not horizontal_item %} pr-md-3{% endif %}{% else %}mt-3 mb-1{% endif %}">
                                <span class="js-product-stock">
                                    {% if product.stock < 100 %}
                                        {{ product.stock }}
                                    {% else %}
                                        +100
                                    {% endif %}
                                </span> {{ "en stock" | translate }}
                            </div>
                        {% endif %}
                        </div>
                    {% endif %}
                </a>
            </div>
            {% if not reduced_item and ((settings.quick_shop or settings.product_color_variants)) or (horizontal_item and not settings.quick_shop) %}
                </div>
            {% endif %}
            {{ component('structured-data', {'item': true}) }}
        </div>
    </div>
{% if slide_item %}
    </div>
{% endif %}
