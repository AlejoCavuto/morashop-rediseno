{% if options %}
  {% if store.show_shipping_emergency_message %}
    <div class="alert alert-warning mb-4">{{ store.shipping_emergency_message }}</div> 
  {% endif %}

  <div class="{% if cart.items_count > 0 and not cart.free_shipping.cart_has_free_shipping %}js-product-shipping-label{% endif %} font-small mb-4" style="display: none;">
    {{ 'Opciones para tu compra <strong>si sumás este producto</strong>.' | translate }}
  </div>

  {# ===== Cálculos ===== #}
  {% set has_featured_shipping = false %}
  {% for option in options_to_show if option.shipping_type == 'ship' or option.shipping_type == 'delivery' or (option.method == 'table' and option.shipping_type == 'custom') %}
    {% if option|length >= 1 %}{% set has_featured_shipping = true %}{% endif %}
  {% endfor %}

  {% set has_non_featured_shipping = false %}
  {% for option in options_to_hide if option.shipping_type == 'ship' or option.shipping_type == 'delivery' or (option.method == 'table' and option.shipping_type == 'custom') %}
    {% if option|length >= 1 %}{% set has_non_featured_shipping = true %}{% endif %}
  {% endfor %}

  {% set has_non_featured_pickup = false %}
  {% set has_featured_pickup = false %}
  {% for option in options_to_show if option.shipping_type == 'pickup' and option.method != 'branch' %}
    {% if option|length >= 1 %}{% set has_featured_pickup = true %}{% endif %}
  {% endfor %}
  {% for option in options_to_hide if option.shipping_type == 'pickup' and option.method != 'branch' %}
    {% if option|length >= 1 %}{% set has_non_featured_pickup = true %}{% endif %}
  {% endfor %}

  {# ===== Acordeón ===== #}
  <div class="shipping-tabs">
    {% if has_featured_shipping %}
      <div class="shipping-accordion">
        <div class="shipping-header" data-target="#tab-envio">
          🚚 {{ "Envío a domicilio" | translate }}
          <span class="arrow">▼</span>
        </div>
        <div id="tab-envio" class="shipping-panel">
          <ul class="radio-button-container list-unstyled mb-4">
            {% for option in options_to_show if option.shipping_type == 'ship' or option.shipping_type == 'delivery' or (option.method == 'table' and option.shipping_type == 'custom') %}
              {% include "snipplets/shipping/shipping-calculator-item.tpl" with {'featured_option': true} %}
            {% endfor %}

            {% if has_non_featured_shipping %}
              <div class="js-other-shipping-options float-left w-100" style="display:none;">
                {% for option in options_to_hide if option.shipping_type == 'ship' or option.shipping_type == 'delivery' or (option.method == 'table' and option.shipping_type == 'custom') %}
                  {% include "snipplets/shipping/shipping-calculator-item.tpl" %}
                {% endfor %}
              </div>
              <div class="js-toggle-more-shipping-options js-show-more-shipping-options d-inline-block w-100 my-3 text-center">
                <a href="#" class="btn-link font-small">
                  <span class="js-shipping-see-more">{{ 'Ver más opciones de envío' | translate }}</span>
                  <span class="js-shipping-see-less" style="display:none;">{{ 'Ver menos opciones de envío' | translate }}</span>
                </a>
              </div>
            {% endif %}
          </ul>
        </div>
      </div>
    {% endif %}

    {% if has_featured_pickup %}
      <div class="shipping-accordion">
        <div class="shipping-header" data-target="#tab-retirar">
          📍 {{ "Retirar por" | translate }}
          <span class="arrow">▼</span>
        </div>
        <div id="tab-retirar" class="shipping-panel">
          <ul class="radio-button-container list-unstyled mb-4">
            {% for option in options_to_show if option.shipping_type == 'pickup' and option.method != 'branch' %}
              {% include "snipplets/shipping/shipping-calculator-item.tpl" with {'featured_option': true, 'pickup': true} %}
            {% endfor %}

            {% if has_non_featured_pickup %}
              <div class="js-other-pickup-options list-unstyled p-0 w-100" style="display:none;">
                {% for option in options_to_hide if option.shipping_type == 'pickup' and option.method != 'branch' %}
                  {% include "snipplets/shipping/shipping-calculator-item.tpl" with {'pickup': true} %}
                {% endfor %}
              </div>
              <div class="js-toggle-more-shipping-options js-show-other-pickup-options d-inline-block w-100 my-3 text-center">
                <a href="#" class="btn-link font-small">
                  <span class="js-shipping-see-more">{{ 'Ver más opciones de retiro' | translate }}</span>
                  <span class="js-shipping-see-less" style="display:none;">{{ 'Ver menos opciones de retiro' | translate }}</span>
                </a>
              </div>
            {% endif %}
          </ul>
        </div>
      </div>
    {% endif %}
  </div>

  {% if store.has_smart_dates and show_time %}
    <div class="font-small mb-3">{{ "El tiempo de entrega <strong>no considera feriados</strong>." | translate }}</div>
  {% endif %}
{% else %}
  <span>{{ "No hay costos de envío para el código postal dado." | translate }}</span>
{% endif %}

{# Don't remove this #}
<input type="hidden" name="after_calculation" value="1"/>
<input type="hidden" name="zipcode" value="{{ zipcode }}"/>

<style>
/* ===== Acordeón de envíos ===== */
.shipping-tabs { margin-bottom: 12px; }
.shipping-tab { display: none !important; } /* oculta tabs viejos del tema */
.shipping-accordion { margin-bottom: 8px; }
.shipping-header{
  background:#f5f5f5;border:1px solid #ccc;padding:10px 14px;cursor:pointer;
  font-weight:600;border-radius:6px;display:flex;justify-content:space-between;align-items:center;
  user-select:none;
}
.shipping-header .arrow{ transition: transform .2s; }
.shipping-header.active{ background:#001c4b; color:#fff; }
.shipping-panel{
  display:none;border:1px solid #ccc;border-top:none;padding:12px;border-radius:0 0 6px 6px;background:#fff;
}
.shipping-accordion.open .shipping-panel{ display:block !important; }
.shipping-accordion.open .arrow{ transform: rotate(180deg); }
.radio-button-container{ margin:0; padding:0; list-style:none; }
.shipping-header:focus{ outline:2px solid #001c4b; outline-offset:2px; }
.shipping-header:hover{ filter:brightness(.98); }
</style>
