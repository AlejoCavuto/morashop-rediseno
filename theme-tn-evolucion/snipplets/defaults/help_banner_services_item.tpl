<div class="swiper-slide col-auto col-md p-0">
    <div class="card p-3">
        <div class="row no-gutters">
            <div class="col-auto icon-60px icon-circle home-circle-image">
                {% set help_icon_name = help_item_1 ? 'truck' : help_item_2 ? 'credit-card' : help_item_3 ? 'promotions' : 'returns' %}
                {% include "snipplets/svg/" ~ help_icon_name ~ ".tpl" with {svg_custom_class: "icon-inline icon-lg align-item-middle svg-icon-text"} %}
            </div>
            <div class="col pl-3">
                <div class="align-item-middle">
                    <h3 class="h6 mb-1">
                    	{% if help_item_1 %}
                    		{{ 'Medios de envío' | translate }}
                    	{% elseif help_item_2 %}
                    		{{ 'Medios de pago' | translate }}
                    	{% elseif help_item_3 %}
                    		{{ 'Promociones' | translate }}
                    	{% elseif help_item_4 %}
                    		{{ 'Cambios y devoluciones' | translate }}
                    	{% endif %}
                    </h3>
                </div>
            </div>
        </div>
    </div>
</div>
