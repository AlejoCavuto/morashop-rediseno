{% if settings.quick_shop %}
    {% embed "snipplets/modal.tpl" with{modal_id: 'quickshop-modal', modal_class: 'quickshop bottom modal-overflow-none', modal_position: 'bottom', modal_transition: 'slide', modal_footer: false, modal_mobile_full_screen: true, modal_width: 'centered-md modal-centered-medium', modal_header_class: 'modal-floating-close modal-header-no-title d-md-none', modal_body_class: 'modal-scrollable p-0 p-md-3'} %}
        {% block modal_body %}
            <div class="js-item-product modal-scrollable modal-scrollable-area" data-product-id="">
                <div class="js-product-container js-quickshop-container js-quickshop-modal js-quickshop-modal-shell" data-variants="" data-quickshop-id="">
                    <div class="row no-gutters">
                        <div class="col-md-6 mb-1">
                            <div class="quickshop-image-container">
                                <div class="js-quickshop-image-padding">
                                    <img srcset="" class="js-item-image js-quickshop-img quickshop-image img-absolute-centered"/>
                                </div>
                            </div>
                        </div>
                        <div class="js-item-variants col-md-6 p-3 pt-md-2 pr-md-3">
                            <div class="row no-gutters align-items-center mt-md-0 mr-md-1">
                                <div class="col">
                                    <div class="js-item-name h3 mb-2 mb-md-0" data-store="product-item-name-{{ product.id }}"></div>
                                </div>
                                <div class="col-auto d-none d-md-block">
                                    <a class="js-modal-close modal-close pr-0">
                                        {% include "snipplets/svg/times.tpl" with {svg_custom_class: "icon-inline svg-icon-text"} %}
                                    </a>
                                </div>
                            </div>
                            <div class="item-price-container mb-4 mr-md-1" data-store="product-item-price-{{ product.id }}">
                                <span class="js-price-display h2 font-huge"></span>
                                <span class="js-compare-price-display h3 font-largest price-compare font-weight-normal"></span>
                                {{ component('payment-discount-price', {
                                        visibility_condition: settings.payment_discount_price,
                                        location: 'product',
                                        container_classes: "font-big text-accent font-weight-bold mt-2",
                                    }) 
                                }}
                            </div>
                            {# Image is hidden but present so it can be used on cart notifiaction #}
                            
                            <div id="quickshop-form" class="mr-md-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        {% endblock %}
    {% endembed %}
{% endif %}