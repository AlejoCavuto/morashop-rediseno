<div id="single-product" class="js-product-container section-main-product-home" data-store="home-product-main">
    <div class="container">
        <div class="row justify-content-md-center">
            <div class="col-md-11">
                <div class="row">
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-auto d-none d-md-block pr-0">
                                <div class="product-thumbs-container position-relative">
                                    <div class="js-swiper-product-thumbs-demo swiper-product-thumb swiper-container-vertical"> 
                                        <div class="swiper-wrapper">
                                            <div class="swper-slide h-auto w-auto">
                                                <span class="product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3 selected">
                                                    {% include "snipplets/svg/help/help-product-3.tpl" with {svg_custom_class:'w-100'} %}
                                                </span>
                                            </div>
                                            <div class="swper-slide h-auto w-auto">
                                                <span class="product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3">
                                                    {% include "snipplets/svg/help/help-product-3-green.tpl" with {svg_custom_class:'w-100'} %}
                                                </span>
                                            </div>
                                            <div class="swper-slide h-auto w-auto">
                                                <span class="product-thumb d-block position-relative mr-3 mr-md-0 mb-md-3">
                                                    {% include "snipplets/svg/help/help-product-3-red.tpl" with {svg_custom_class:'w-100'} %}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col p-0 px-md-3">
                                <div class="js-swiper-product-demo swiper-container">
                                    <div class="labels-absolute mb-2">
                                        <div class="label label-big label-accent">
                                            {% include "snipplets/svg/truck.tpl" with {svg_custom_class: "icon-inline mr-1"} %}{{ "Gratis" | translate }}
                                        </div>
                                    </div>
                                    <div class="swiper-wrapper">
                                         <div class="js-product-slide-demo swiper-slide product-slide slider-slide" data-image="0" data-image-position="0">
                                            <div class="d-block p-relative">
                                                {% include "snipplets/svg/help/help-product-3.tpl" with {svg_custom_class:'product-slider-image'} %}
                                            </div>
                                         </div>
                                         <div class="js-product-slide-demo swiper-slide product-slide slider-slide" data-image="1" data-image-position="1">
                                            <div class="d-block p-relative">
                                                {% include "snipplets/svg/help/help-product-3-green.tpl" with {svg_custom_class:'product-slider-image'} %}
                                            </div>
                                         </div>
                                         <div class="js-product-slide-demo swiper-slide product-slide slider-slide" data-image="2" data-image-position="2">
                                            <div class="d-block p-relative">
                                                {% include "snipplets/svg/help/help-product-3-red.tpl" with {svg_custom_class:'product-slider-image'} %}
                                            </div>
                                         </div>
                                    </div>
                                </div>
                                <div class="js-swiper-product-pagination-demo swiper-pagination position-relative py-3 d-md-none swiper-pagination-bullets"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="pt-md-3 px-md-3 mt-2 mt-md-0 mb-md-3">
                            <h1 class="h1-md mb-3">{{ "Producto de ejemplo" | translate }}</h1>
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

                            <form id="product_form" class="js-product-form mt-4" method="post" action="">
                                <input type="hidden" name="add_to_cart" value="2243561" />

                                <div class="js-product-variants row">
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
                                <div class="row mb-4">
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
    </div>  
</div>