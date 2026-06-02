<div id="single-product" class="js-has-new-shipping js-product-detail js-product-container js-shipping-calculator-container background-secondary pb-4 pt-md-4 pb-md-3" data-variants="{{product.variants_object | json_encode }}" data-store="product-detail">
    <div class="container pt-md-1">
        <div class="row">
            <div class="col-md-7 pb-3">
                <div class="row">
                    <div class="col-md-auto d-none d-md-block pr-0">
                        <div class="product-thumbs-container position-relative">
                            <div class="js-swiper-product-thumbs-demo swiper-product-thumb swiper-container-vertical"> 
                                <div class="swiper-wrapper">
                                    <div class="swper-slide h-auto w-auto">
                                        <a href="#" class="js-product-thumb product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3 selected">
                                            {% include "snipplets/svg/help/help-product-3.tpl" with {svg_custom_class:'w-100'} %}
                                        </a>
                                    </div>
                                    <div class="swper-slide h-auto w-auto">
                                        <a href="#" class="js-product-thumb product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3">
                                            {% include "snipplets/svg/help/help-product-3-green.tpl" with {svg_custom_class:'w-100'} %}
                                        </a>
                                    </div>
                                    <div class="swper-slide h-auto w-auto">
                                        <a href="#" class="js-product-thumb product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3">
                                            {% include "snipplets/svg/help/help-product-3-red.tpl" with {svg_custom_class:'w-100'} %}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col p-0 px-md-3">
                        <div class="js-swiper-product-demo swiper-container">
                            <div class="labels-absolute">
                                <div class="label label-big label-accent">
                                    {% include "snipplets/svg/truck.tpl" with {svg_custom_class: "icon-inline mr-1"} %}{{ "Gratis" | translate }}
                                </div>
                            </div>
                            <div class="swiper-wrapper">
                                 <div class="js-product-slide swiper-slide product-slide slider-slide" data-image="0" data-image-position="0">
                                    <a href="{{ image | product_image_url('huge') }}" data-fancybox="product-gallery" class="d-block p-relative">
                                        {% include "snipplets/svg/help/help-product-3.tpl" with {svg_custom_class:'product-slider-image'} %}
                                    </a>
                                 </div>
                                 <div class="js-product-slide swiper-slide product-slide slider-slide" data-image="1" data-image-position="1">
                                    <a href="{{ image | product_image_url('huge') }}" data-fancybox="product-gallery" class="d-block p-relative">
                                        {% include "snipplets/svg/help/help-product-3-green.tpl" with {svg_custom_class:'product-slider-image'} %}
                                    </a>
                                 </div>
                                 <div class="js-product-slide swiper-slide product-slide slider-slide" data-image="2" data-image-position="2">
                                    <a href="{{ image | product_image_url('huge') }}" data-fancybox="product-gallery" class="d-block p-relative">
                                        {% include "snipplets/svg/help/help-product-3-red.tpl" with {svg_custom_class:'product-slider-image'} %}
                                    </a>
                                 </div>
                            </div>
                        </div>
                        <div class="js-swiper-product-pagination-demo swiper-pagination position-relative py-3 d-md-none"></div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="pt-md-3 px-md-3">
                    <section class="page-header">
                        <div class="breadcrumbs">
                            <a class="crumb" href="{{ store.url }}" title="{{ store.name }}">{{ "Inicio" | translate }}</a>
                            <span class="separator">></span>
                            <a class="crumb" href="{{ store.products_url }}" title="{{ "Productos" | translate }}">{{ "Productos" | translate }}</a>
                            <span class="separator">></span>
                            <span class="crumb active">{{ "Producto de ejemplo" | translate }}</span>
                        </div>
                        <h1 class="mb-3">{{ "Producto de ejemplo" | translate }}</h1>
                    </section>

                    <div class="labels mb-2">
                        <div class="label label-inline label-big">
                          -35% OFF
                        </div>
                    </div>

                    {# Product price #}

                    {% set product_can_show_installments = product.show_installments and product.display_price %}

                    {% if store.country == 'BR' %}
                        <div class="price-container mb-3">
                            <span class="d-inline-block">
                                <div class="js-price-display h3 font-largest" id="price_display">{{"18200" | money }}</div>
                            </span>
                            <span class="d-inline-block h3 font-weight-normal">
                               <div id="compare_price_display" class="js-compare-price-display price-compare" style="display:block;">{{"28000" | money }}</div>
                            </span>
                        </div>
                    {% else %}
                        <div class="price-container mb-3">
                            <span class="d-inline-block">
                                <div class="js-price-display h3 font-largest" id="price_display">{{"182000" | money }}</div>
                            </span>
                            <span class="d-inline-block h3 font-weight-normal">
                               <div id="compare_price_display" class="js-compare-price-display price-compare" style="display:block;">{{"280000" | money }}</div>
                            </span>
                        </div>
                    {% endif %}

                    {# Product installments #}

                    <div class="mb-3">{{ "Hasta 12 cuotas" | translate }}</div>

                    {# Product form, includes: Variants, CTA and Shipping calculator #}

                    <form id="product_form" class="js-product-form overflow-none" method="post" action="">
                        <input type="hidden" name="add_to_cart" value="2243561" />

                        <div class="js-product-variants row mb-2">
                            <div class="col-12">
                                <div class="form-group">
                                    <label class="form-label" for="variation_1">{{ "Color" | translate }}</label>
                                    <select id="variation_1" class="form-select js-variation-option js-refresh-installment-data  " name="variation[0]">
                                        <option value="{{ "Verde" | translate }}">{{ "Verde" | translate }}</option>
                                        <option value="{{ "Rojo" | translate }}">{{ "Rojo" | translate }}</option>
                                    </select>
                                    <div class="form-select-icon">
                                        {% include "snipplets/svg/chevron-down.tpl" with {svg_custom_class: "icon-inline icon-w-14"} %}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-4 mb-md-3">
                            <div class="col-4 col-md-3 pr-0">
                                {% embed "snipplets/forms/form-input.tpl" with{
                                type_number: true, input_value: '1', 
                                input_name: 'quantity' ~ item.id, 
                                input_custom_class: 'js-quantity-input form-control-big form-control-inline', 
                                input_label: false, 
                                input_append_content: true, 
                                input_group_custom_class: 'js-quantity form-quantity', 
                                form_control_container_custom_class: 'col px-0', 
                                form_control_quantity: true,
                                input_min: '1'} %}
                                    {% block input_prepend_content %}
                                    <div class="form-row m-0 align-items-center">
                                        <span class="js-quantity-down form-quantity-icon icon-30px font-small">
                                            {% include "snipplets/svg/minus.tpl" with {svg_custom_class: "icon-inline"} %}
                                        </span>
                                    {% endblock input_prepend_content %}
                                    {% block input_append_content %}
                                        <span class="js-quantity-up form-quantity-icon icon-30px font-small">
                                            {% include "snipplets/svg/plus.tpl" with {svg_custom_class: "icon-inline"} %}
                                        </span>
                                    </div>
                                    {% endblock input_append_content %}
                                {% endembed %}
                            </div>
                            <div class="col-8 col-md-9 pl-3">
                                <input type="submit" class="js-addtocart js-prod-submit-form btn btn-primary btn-big btn-block cart" value="{{ 'Agregar al carrito' | translate }}" />
                            </div>
                        </div>

                    </form>

                    {# Product description #}

                    <h5 class="mt-2 mb-4">{{ "Descripción" | translate }}</h5>

                    <div class="user-content font-small mb-4">
                        <p>{{ "¡Este es un producto de ejemplo! Para poder probar el proceso de compra, debes" | translate }}
                            <a href="/admin/products" target="_top">{{ "agregar tus propios productos." | translate }}</a>
                        </p>
                    </div>

                    {# Product share #}

                    {% include 'snipplets/social/social-share.tpl' %}
                </div>                
            </div>
        </div>
    </div>  
</div>
<section class="section-products-related position-relative" data-store="related-products">
    <div class="container">
        <div class="row">
            <div class="col-12 pr-0 pr-md-3">
                <h2 class="section-title h3 mb-3">{{ "Productos relacionados" | translate }}</h2>
                <div class="js-swiper-related-demo swiper-container swiper-products p-1">
                    <div class="swiper-wrapper">
                        {% include 'snipplets/defaults/help_item.tpl' with {'slide_item': true, 'help_item_1': true}  %}
                        {% include 'snipplets/defaults/help_item.tpl' with {'slide_item': true, 'help_item_2': true}  %}
                        {% include 'snipplets/defaults/help_item.tpl' with {'slide_item': true, 'help_item_4': true}  %}
                        {% include 'snipplets/defaults/help_item.tpl' with {'slide_item': true, 'help_item_6': true}  %}
                        {% include 'snipplets/defaults/help_item.tpl' with {'slide_item': true, 'help_item_7': true}  %}
                    </div>
                </div>
                <div class="js-swiper-related-prev-demo swiper-button-prev swiper-button-outside d-none d-md-block svg-icon-text">{% include "snipplets/svg/chevron-left.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
                <div class="js-swiper-related-next-demo swiper-button-next swiper-button-outside d-none d-md-block svg-icon-text">{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline icon-lg"} %}</div>
            </div>
        </div>
    </div>
</section>