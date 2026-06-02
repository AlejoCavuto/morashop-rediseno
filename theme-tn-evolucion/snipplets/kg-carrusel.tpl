{%- set coll = null -%}
{%- if sections and seccion -%}
  {%- set coll = attribute(sections, seccion) | default(null) -%}
{%- endif -%}

{# Capturamos la promo local y limpiamos la global #}
{%- set __promo = promocion|default(null) -%}
{%- set promocion = null -%}

{% if coll and coll.products %}
{% set visibles = 4 %}
{% set ancho_producto = 232 %}

{# --- Flash deals por colección y/o SKU --- #}
{% set flash_ids = [] %}
{% set flash_skus = ['STARNU0 DOYMONO','ENA0 DOYMONO'] %}

{% if global_sections is defined
      and attribute(global_sections, 'ofertasrelampagos') is defined
      and attribute(global_sections, 'ofertasrelampagos').products %}
  {% for p in attribute(global_sections, 'ofertasrelampagos').products %}
    {% set flash_ids = flash_ids | merge([p.id]) %}
  {% endfor %}
{% endif %}


<style>
/* ====== Carrusel base ====== */
.carrusel-container{display:flex;gap:24px;align-items:flex-start;flex-wrap:nowrap}
.carrusel-banner{flex:0 0 220px}
.carrusel-frame{flex:1 1 auto;min-width:0;box-sizing:border-box;position:relative}
.carrusel-banner img{max-height:400px;width:auto;height:auto;object-fit:contain}

.carrusel-btn{background:#fff;border:1px solid #000e35;font-size:28px;font-weight:700;color:#000e35;cursor:pointer;position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%}
.carrusel-btn.left{left:25px}.carrusel-btn.right{right:25px}

.producto-card{width:220px;background:#fff;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.1);text-align:center;padding:12px;box-sizing:border-box;flex:0 0 auto;min-height:380px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.producto-card img{width:100%;height:auto;object-fit:contain;max-height:220px}
.producto-nombre{font-size:14px;font-weight:400;margin:6px 0 2px;line-height:1.3em;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-overflow:ellipsis;max-height:calc(1.3em * 2)}
.producto-descuento{font-size:12px;color:red;font-weight:700;margin:0}
.producto-precio{font-size:18px;font-weight:700;margin:0}
.producto-anterior{font-size:14px;color:gray;text-decoration:line-through;margin:0}
.producto-boton{background-color:#000e35;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-weight:700;cursor:pointer;width:100%;display:inline-block;text-align:center}

.section-title{font-size:20px;font-weight:700;margin-bottom:16px;text-align:center;line-height:1.25em;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;text-overflow:ellipsis;white-space:normal;max-height:calc(1.25em * 3)}

.carrusel-viewport{overflow:hidden;width:100%}
.carrusel-items{display:flex;gap:12px;transition:transform .3s ease;max-width:min(calc(232px * 4 + 12px * 3),100%)}

body{overflow-x:hidden}

/* ====== Mobile ====== */
@media (max-width:768px){
  .section-title{font-size:18px}
  .carrusel-container{flex-direction:column;align-items:center}
    .producto-card{
      flex: 0 0 50%;   /* ocupa ~50% del carrusel */
      max-width: 50%;
    }
  .producto-card img{max-height:180px}
  .carrusel-btn.left{left:5px}.carrusel-btn.right{right:5px}
  .carrusel-banner{text-align:center;margin:auto}

  /* mostrar solo banner mobile */
  .banner-desktop,
  .banner-wrapper-desktop {display:none!important}
  .banner-mobile,
  .banner-wrapper-mobile {display:block!important;width:100%!important;text-align:center}
  .banner-wrapper-mobile img{width:100%!important;height:auto;display:block;margin:auto}
}

/* ====== Desktop: con banner centrado, sin banner a la izquierda ====== */
@media (min-width:769px){
  /* grid evita que el track se meta debajo del banner */
  .carrusel-container{display:grid;grid-template-columns:1fr;column-gap:24px;align-items:start}
  .carrusel-container.has-banner{grid-template-columns:220px 1fr}
  .carrusel-container.has-banner .carrusel-banner{grid-column:1}
  .carrusel-container.has-banner .carrusel-frame{grid-column:2}
  .carrusel-container.no-banner .carrusel-frame{grid-column:1 / -1}

  /* alineación */
  .carrusel-container.has-banner .carrusel-items{margin-left:auto;margin-right:auto}  /* centrado */
  .carrusel-container.no-banner  .carrusel-items{margin-left:0;margin-right:auto}     /* pegado izquierda */

  /* mostrar solo banner desktop */
  .banner-desktop,
  .banner-wrapper-desktop {display:block!important}
  .banner-mobile,
  .banner-wrapper-mobile {display:none!important}
}

/* controles y utilidades */
@media (min-width:769px) and (max-width:1360px){
  .carrusel-btn.left{left:24px}.carrusel-btn.right{right:24px}
}
.carrusel-viewport{padding-right:12px}

.badge-sin-stock{position:absolute;top:8px;left:8px;background:#001a6e;color:#fff;border-radius:6px;padding:4px 8px;font-size:12px;font-weight:700;z-index:2}

/* Cuando el producto está sin stock */
.producto-card.agotado {
  filter: grayscale(100%) brightness(0.9); /* blanco y negro + más apagado */
  opacity: 0.7; /* opcional: un poco transparente */
}


.producto-boton.disabled{background:#bdbdbd;cursor:not-allowed}
.btn-placeholder.producto-boton{display:none;align-items:center;justify-content:center;gap:8px}
.btn-placeholder .js-addtocart-adding,.btn-placeholder .js-addtocart-success{display:none}
.btn-placeholder .js-addtocart-adding.active,.btn-placeholder .js-addtocart-success.active{display:inline-flex}
.btn-placeholder .spinner{width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:girar .8s linear infinite}
@keyframes girar{to{transform:rotate(360deg)}}
.producto-boton,.producto-boton:hover,.producto-boton:visited,.producto-boton:active{color:#fff!important;text-decoration:none!important}

.producto-cuotas{font-size:12px;color:red;font-weight:400;margin:0;white-space:nowrap}
.envio-cartel{display:inline-block;font-size:13px;font-weight:600;background-color:#ead8bb;color:#001e50;padding:4px 8px;border-radius:6px;margin:4px 0 2px}
.producto-card{position:relative}
.badge-envio-gratis {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  background: #d40000;
  color: #fff;
  font-size: 10px;       /* antes 11px */
  font-weight: 600;
  padding: 3px 6px;      /* antes 4px 8px */
  border-radius: 0 0 5px 5px;
  z-index: 5;
  text-align: center;
  white-space: nowrap;
}



@media (min-width:769px){
  .carrusel-container.has-banner {
    display: grid;
    grid-template-columns: 220px 1fr;
    column-gap: 24px;
    align-items: center; /* centrado vertical */
  }

  .carrusel-banner.banner-wrapper-desktop {
    margin-top: 0; /* quitamos el desplazamiento manual */
    display: flex;
    align-items: center;
  }
}


.badge-cuotas {
  position: absolute;
  bottom: 6px;
  left: 6px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  font-weight: 700;
  font-size: 11px; /* más chico */
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  overflow: hidden;
  z-index: 5;
  background: #1953bc; /* azul medio */
  color: #fff;
}

.badge-cuotas .num {
  background: #011a51; /* azul oscuro */
  color: #fff;
  padding: 4px 6px;  /* menos padding */
  font-size: 12px;   /* más chico */
}

.badge-cuotas .texto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.1;
  padding: 4px 6px;  /* menos padding */
  text-transform: uppercase;
  font-size: 10px;   /* más chico */
}


.section-featured-home .producto-nombre,
.section-featured-home .kg-stock,
.section-featured-home .js-card-stock {
  display:block !important;
  visibility:visible !important;
  opacity:1 !important;
  font-size:14px !important;
  color:#000 !important;
}


/* Forzar estilo del stock en Home */
.js-products-featured-container .item-stock,
.js-products-sale-container .item-stock,
.js-products-new-container .item-stock,
.js-products-promotion-container .item-stock,
.js-products-best-seller-container .item-stock {
  font-size: 12px !important;
  line-height: 1.2 !important;
  white-space: nowrap !important; /* evita salto */
  display: inline-block !important;
  text-align: center !important;
  margin-top: 2px !important;
}

.js-products-featured-container .item-stock span,
.js-products-sale-container .item-stock span,
.js-products-new-container .item-stock span,
.js-products-promotion-container .item-stock span,
.js-products-best-seller-container .item-stock span {
  display: inline !important;
}


/* 🔒 Forzar stock en una sola línea */
.producto-card .kg-stock,
.producto-card .js-card-stock,
.producto-card .item-stock,
.js-product-stock {
  white-space: nowrap !important;
  text-align: center !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
}

/* ✅ Alinear número y texto perfectamente (sin negrita) */
.kg-stock {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important; /* corrige el desnivel */
  gap: 4px;
}

.kg-stock .js-card-stock {
  font-weight: normal !important;   /* sin bold */
  display: inline-block !important;
  vertical-align: middle !important;
}


/* Badge violeta OFERTA RELÁMPAGO (centrado debajo de la imagen) */
.badge-flash {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff7931;   /* violeta */
  color: #fff;
  font-weight: 700;
  font-size: 10px;       /* un poco más visible */
  padding: 3px 6px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: .2px;
  z-index: 6;
  white-space: nowrap;
}

/* ====== Ajuste flechas fuera del carrusel SOLO en home ====== */
@media (min-width:769px){
  .section-featured-home .carrusel-btn.left {
    left: -50px !important;
  }
  .section-featured-home .carrusel-btn.right {
    right: -50px !important;
  }
}



</style>




<script>
  let posiciones = {};
  function moverCarrusel(id, dir) {
    const carrusel = document.getElementById("carrusel-" + id);
    const visibles = window.innerWidth <= 768 ? 2 : 4;

    // ancho real de la primera tarjeta (incluye márgenes y gap)
    const firstItem = carrusel.querySelector(".producto-card");
    const ancho = firstItem ? firstItem.offsetWidth + 12 : (window.innerWidth <= 768 ? window.innerWidth/2 : 232+12);

    if (!posiciones[id]) posiciones[id] = 0;
    const total = carrusel.children.length;
    const max = total - visibles;

    posiciones[id] = Math.max(0, Math.min(posiciones[id] + dir, max));
    carrusel.style.transform = `translateX(-${posiciones[id] * ancho}px)`;
  }


  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carrusel-items").forEach(carrusel => {
      let startX = 0, currentX = 0, isDragging = false, startTarget = null;
      let id = carrusel.id.replace("carrusel-", "");

      carrusel.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        startTarget = e.target; // guardamos el elemento donde arrancó
      });

      carrusel.addEventListener("touchmove", e => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
      });

      carrusel.addEventListener("touchend", e => {
        if (!isDragging) return;
        let d = currentX - startX;

        if (Math.abs(d) > 50) {
          // fue swipe → mover carrusel
          d < 0 ? moverCarrusel(id, 1) : moverCarrusel(id, -1);
          e.preventDefault(); // evitamos que el link se active en swipe
        } else {
          // fue tap → si arrancó en un botón/link, dejamos que funcione normal
          if (startTarget.closest("button, .producto-boton, form, a")) {
            // no hacemos nada, deja que siga el click
          }
        }

        isDragging = false;
        startX = 0;
        currentX = 0;
        startTarget = null;
      });
    });
  });

</script>




<script>
  // clamp numerico para cards y modal
  function clampNumber(el){
    const max=99;
    const n=parseInt((el.textContent||'').replace(/[^\d]/g,''),10)||0;
    const want=n>=max?`+${max}`:String(n);
    if(el.textContent!==want) el.textContent=want;
  }
  function clampAllStock(){
    document.querySelectorAll('.js-card-stock, .js-product-stock').forEach(clampNumber);
  }
  document.addEventListener('DOMContentLoaded', clampAllStock);

  // observar cambios de stock en modales
  (function observeModalStock(){
    function attach(root){
      root.querySelectorAll('.js-product-stock').forEach(el=>{
        if(el._mo) return;
        const mo=new MutationObserver(()=>clampNumber(el));
        mo.observe(el,{childList:true,characterData:true,subtree:true});
        el._mo=mo; clampNumber(el);
      });
    }
    document.addEventListener('DOMContentLoaded',()=>attach(document));
    document.addEventListener('click',e=>{
      if(e.target.closest('.js-insta-variant')) setTimeout(()=>attach(document),0);
    });
    document.addEventListener('change',e=>{
      if(e.target.classList && e.target.classList.contains('js-variation-option')) setTimeout(()=>attach(document),0);
    });
  })();
</script>

<section class="container mt-4 carrusel-container{% if banner_url and banner_link %} has-banner{% else %} no-banner{% endif %}">
  {% if banner_url %}
    <a href="{{ banner_link }}" target="_blank" class="carrusel-banner banner-wrapper-desktop">
      <img src="{{ banner_url }}" alt="Banner" />
    </a>
  {% endif %}

  {% if banner_url_mobile is defined and banner_url_mobile | length > 5 %}
    <a href="{{ banner_link }}" target="_blank" class="carrusel-banner banner-wrapper-mobile">
      <img src="{{ banner_url_mobile }}" alt="Banner Mobile" />
    </a>
  {% endif %}

  <div class="carrusel-frame" style="flex-grow:1;flex-shrink:1;flex-basis:0;position:relative;width:100%;">
    <h2 class="section-title carrusel-titulo">{{ titulo }}</h2>

  <div class="carrusel-viewport">
    <div id="carrusel-{{ seccion }}" class="carrusel-items{% if coll.products | length <= visibles %} center{% endif %}">
      {% for product in coll.products %}
        {# disponible robusto: usa available si viene, si no, deduce por algún stock > 0 #}
        {% set __sv = (product.selected_or_first_available_variant is defined and product.selected_or_first_available_variant.stock is defined) ? (product.selected_or_first_available_variant.stock|default(0)) : 0 %}
        {% set __ps = product.stock|default(0) %}
        {% set available_kg = (product.available is defined) ? product.available : ((__sv + __ps) > 0) %}
        {% set sin_stock = (not available_kg) %}



        <div class="producto-card{% if sin_stock %} agotado{% endif %} js-product-container">
          {% if sin_stock %}<div class="badge-sin-stock">SIN STOCK</div>{% endif %}

          <a href="{{ product.url }}" style="text-decoration:none;color:inherit;">
            {% if not sin_stock and product.compare_at_price|default(0) >= 5000000 %}
              <div class="badge-envio-gratis">ENVÍO GRATIS A TODO EL PAÍS!</div>
            {% endif %}


            {# --- Imagen con wrapper relativo para anclar el badge --- #}
            <div class="producto-imagen-wrapper" style="position:relative;">
              <img src="{{ product.featured_image | product_image_url('medium') }}" alt="{{ product.name }}">

              {# 🔥 OFERTA RELÁMPAGO: por colección "ofertasrelampagos" o por SKU #}
              {% set is_flash = (product.id in flash_ids) or (product.sku is defined and product.sku in flash_skus) %}
              {% if is_flash %}
                <div class="badge-flash">MÁS VENDIDO</div>
              {% endif %}
            </div>



            <p class="producto-nombre js-product-name">{{ product.name }}</p>

            {% set descuento = 0 %}
            {% if product.compare_at_price > product.price %}
              {% set descuento = ((product.compare_at_price - product.price) / product.compare_at_price * 100) | round %}
            {% endif %}

            {# calcular precio en efectivo: 15% menos sobre el promocional #}
            {% set precio_efectivo = (product.price * 0.85) | round %}

            <p class="producto-descuento" style="color:#1fa22e; font-weight:700; margin-bottom:2px;">
              -15% OFF en Efectivo
            </p>

            <p class="producto-precio js-price-display" style="background:#1fa22e; color:#fff; font-size:20px; font-weight:700; padding:4px 8px; display:inline-block; border-radius:4px; margin-bottom:12px;">
              {{ precio_efectivo | money }}
            </p>

            {% if __promo %}
              <p class="producto-promo" style="font-size:13px; font-weight:700; color:#d40000; margin:4px 0 8px;">
                {{ __promo }}
              </p>
            {% endif %}



            {% if product.compare_at_price > product.price %}
              <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:0;">
                <p class="producto-anterior" style="color:gray; text-decoration:line-through; margin:0; font-size:14px;">
                  {{ product.compare_at_price | money }}
                </p>
                <span style="background:#d40000; color:#fff; font-weight:700; font-size:10px; padding:1px 4px; border-radius:4px;">
                  {{ descuento }}% OFF
                </span>
              </div>
            {% endif %}

            <p class="producto-precio js-price-display" style="color:#001c4b; font-size:18px; font-weight:700; margin-top:0px; margin-bottom:0px;">
              {{ product.price | money }}
            </p>


            <p class="producto-cuotas">
              3 x {{ (product.price / 3) | money }} sin interés
            </p>



            <div class="envio-cartel" data-price="{{ product.price|default(0) }}"></div>
          </a>

          {# ✅ mostrar stock (con +99) sólo si hay stock #}
          {% if not sin_stock %}
            {% set total_stock = 0 %}
            {% if product.total_stock is defined %}
              {% set total_stock = product.total_stock|default(0) %}
            {% elseif product.variants is defined and product.variants %}
              {% for vr in product.variants %}
                {% set total_stock = total_stock + (vr.stock | default(0)) %}
              {% endfor %}
            {% elseif product.selected_or_first_available_variant is defined
                  and product.selected_or_first_available_variant.stock is defined %}
              {% set total_stock = product.selected_or_first_available_variant.stock|default(0) %}
            {% else %}
              {% set total_stock = product.stock|default(0) %}
            {% endif %}

            <div class="font-small py-1 text-center kg-stock">
              <span class="js-card-stock" data-max="99" data-value="{{ total_stock }}">
                {% if total_stock >= 99 %}+99{% else %}{{ total_stock }}{% endif %}
              </span> {{ "en stock" | translate }}
            </div>
          {% endif %}




          {% if sin_stock %}
            <button class="producto-boton disabled" disabled>SIN STOCK</button>
          {% elseif product.display_price and (not product.variations) %}
            <form class="js-product-form" method="post" action="{{ store.cart_url }}">
              <input type="hidden" name="add_to_cart" value="{{ product.id }}" />
              <input type="submit" class="producto-boton js-addtocart js-prod-submit-form" value="COMPRAR" />
              <div class="js-addtocart-placeholder btn-placeholder producto-boton" aria-hidden="true">
                <span class="js-addtocart-text">COMPRAR</span>
                <span class="js-addtocart-adding"><span class="spinner"></span> Agregando...</span>
                <span class="js-addtocart-success">✔ Listo</span>
              </div>
              <img class="js-product-slide-img" data-srcset="{{ product.featured_image | product_image_url('large') }} 1x" alt="" style="display:none;">
            </form>
          {% elseif product.display_price and product.variations %}
            <a class="producto-boton" href="{{ product.url }}">VER VARIANTES</a>


            {% embed "snipplets/modal.tpl" with {
              modal_id: "product-variants-" ~ product.id,
              modal_class: "centered-md",
              modal_position: "centered",
              modal_transition: "fade",
              modal_header_title: false,
              modal_width: "box",
              modal_mobile_full_screen: "true"
            } %}
              {% block modal_body %}
                <div class="row no-gutters align-items-start">
                  <div class="col-12 col-md-6 text-center px-3 mb-3 mb-md-0">
                    <img src="{{ product.featured_image | product_image_url('large') }}" alt="{{ product.name }}" class="img-fluid">
                  </div>
                  <div class="col-12 col-md-6 px-3">
                    <h3 class="h4 mb-2">{{ product.name }}</h3>
                    <div class="mb-2">
                      <span class="h4 text-primary">{{ product.price | money }}</span>
                      {% if product.compare_at_price > product.price %}
                        <span class="text-muted" style="text-decoration:line-through;">
                          {{ product.compare_at_price | money }}
                        </span>
                      {% endif %}
                    </div>
                    <form id="product_form_{{ product.id }}" class="js-product-form mt-4" method="post" action="{{ store.cart_url }}" data-store="product-form-{{ product.id }}">
                      <input type="hidden" name="add_to_cart" value="{{ product.id }}" />
                      {% include "snipplets/product/product-variants.tpl" with { quickshop: true } %}
                      {% set total_stock = 0 %}
                      {% for v in product.variants %}
                        {% set total_stock = total_stock + (v.stock | default(0)) %}
                      {% endfor %}
                      <div class="font-small py-2 text-center">
                        <span id="stock-val-{{ product.id }}" class="js-product-stock" data-max="99">
                          {% if total_stock >= 99 %}+99{% else %}{{ total_stock }}{% endif %}
                        </span> {{ "en stock" | translate }}
                      </div>
                      <div id="variant-combos-{{ product.id }}" class="js-variant-combos" style="display:none">
                        {% for v in product.variants %}
                          <div class="variant-row"
                              data-o1="{{ v.option1 | default('') }}"
                              data-o2="{{ v.option2 | default('') }}"
                              data-o3="{{ v.option3 | default('') }}"
                              data-vid="{{ v.id }}"
                              data-stock="{{ v.stock | default(0) }}"></div>
                        {% endfor %}
                      </div>
                      {% set __init_vid = product.selected_or_first_available_variant.id %}
                      {% set __init_stock = 0 %}
                      {% for v in product.variants %}
                        {% if v.id == __init_vid %}{% set __init_stock = v.stock | default(0) %}{% endif %}
                      {% endfor %}
                      <div class="font-small py-2 text-center">
                        <span id="stock-val-{{ product.id }}" class="js-product-stock" data-max="99">
                          {% if __init_stock >= 99 %}+99{% else %}{{ __init_stock }}{% endif %}
                        </span> {{ "en stock" | translate }}
                      </div>
                      <input type="submit" class="js-addtocart js-prod-submit-form btn-add-to-cart btn btn-primary btn-big btn-block mt-3"
                            value="{{ "Agregar al carrito" | translate }}"
                            data-store="product-buy-button" data-component="product.add-to-cart" />
                      {% include 'snipplets/placeholders/button-placeholder.tpl' with {custom_class: "btn-big"} %}
                    </form>
                  </div>
                </div>
              {% endblock %}
            {% endembed %}
          {% else %}
            <a class="producto-boton" href="{{ product.url }}" target="_blank">CONSULTAR</a>
          {% endif %}
        </div>
      {% endfor %}
    </div>
  </div>




    <button class="carrusel-btn left" onclick="moverCarrusel('{{ seccion }}', -1)">‹</button>
    <button class="carrusel-btn right" onclick="moverCarrusel('{{ seccion }}', 1)">›</button>
  </div>
  <!-- KG: interceptor AJAX de agregar al carrito para modales de variantes -->
  <script>
  if(!window._kgAjaxCartBound){
    window._kgAjaxCartBound = true;
    (function(){
      function showToast(info){
        document.dispatchEvent(new CustomEvent('cart:refresh'));
        document.dispatchEvent(new CustomEvent('addtocart:success', { detail: info }));
        if (document.querySelector('.kg-toast')) return;
        const css = `.kg-toast{position:fixed;top:90px;right:16px;z-index:9999;opacity:0;transform:translateY(-10px);transition:all .2s}
  .kg-toast.show{opacity:1;transform:none}
  .kg-toast-box{background:#fff;border:1px solid #e0e0e0;box-shadow:0 6px 16px rgba(0,0,0,.12);border-radius:8px;padding:10px 12px;display:flex;gap:10px;align-items:center}
  .kg-toast-img{width:48px;height:48px;background-size:cover;background-position:center;border-radius:6px}`;
        if (!document.getElementById('kg-toast-css')) {
          const s=document.createElement('style'); s.id='kg-toast-css'; s.textContent=css; document.head.appendChild(s);
        }
        const t=document.createElement('div');
        t.className='kg-toast';
        t.innerHTML=`<div class="kg-toast-box">
          <div class="kg-toast-img"></div>
          <div><b>Agregado al carrito</b><div>${info.qty||1} × ${info.title||''}</div></div>
        </div>`;
        document.body.appendChild(t);
        if (info.img) t.querySelector('.kg-toast-img').style.backgroundImage = `url("${info.img}")`;
        requestAnimationFrame(()=>t.classList.add('show'));
        setTimeout(()=>t.classList.remove('show'),3000);
        setTimeout(()=>t.remove(),3600);
      }

      document.addEventListener('submit', async function(e){
        const form = e.target;
        if (!form.matches('.js-product-form')) return;
        const modal = form.closest('[id^="product-variants-"]');
        if (!modal) return; // no toca formularios fuera del modal

        e.preventDefault();

        // asegura quantity
        let qtyHidden = form.querySelector('input[name="quantity"]');
        if (!qtyHidden) {
          const v = form.querySelector('input.js-quantity-input, input.js-qty-input, input[type="number"]');
          qtyHidden = document.createElement('input');
          qtyHidden.type='hidden'; qtyHidden.name='quantity'; qtyHidden.value = v && v.value ? v.value : '1';
          form.appendChild(qtyHidden);
        }

        const data = new FormData(form);
        try{
          await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
          });

          // cierra el modal si existe botón de cierre
          const closeBtn = modal.querySelector('.js-modal-close,[data-dismiss="modal"],.modal-close');
          if (closeBtn) closeBtn.click();

          // dispara eventos del tema + toast fallback
          const info = {
            qty: data.get('quantity') || 1,
            title: modal.querySelector('h3')?.textContent || '',
            img: modal.querySelector('img.img-fluid')?.src || ''
          };
          showToast(info);
        } catch(err){
          console.error('add-to-cart ajax error', err);
          // opcional: mostrar un toast de error
          alert("No se pudo agregar al carrito, intente nuevamente.");
        }
      });
    })();
  }
  </script>

  
  <script>
  (function(){
    function initModal(modal){
      const form=modal.querySelector('form.js-product-form');
      if(!form) return;
      const out=modal.querySelector('.js-product-stock');
      const combos=modal.querySelector('.js-variant-combos');
      const groups=[...modal.querySelectorAll('.js-product-variants-group')];
      const qtyInput=form.querySelector('input[name="quantity"], input.js-quantity-input, input.js-qty-input, input[type="number"]');
      const qtyBox=form.querySelector('.js-product-quantity') || form;

      function selOptIdByGroup(g){
        const gid=g.getAttribute('data-variation-id');
        const btn=g.querySelector('.js-insta-variant.selected[data-variation-id="'+gid+'"]');
        if(btn) return btn.getAttribute('data-option');
        const sel=g.querySelector('select[name="variation['+gid+']"]');
        if(sel && sel.value) return sel.value;
        return '';
      }
      function currentOptionIds(){
        const ids=groups.map(selOptIdByGroup);
        return {o1:ids[0]||'', o2:ids[1]||'', o3:ids[2]||''};
      }
      function findStock(){
        const {o1,o2,o3}=currentOptionIds();
        let stock=0, found=false;
        combos.querySelectorAll('.variant-row').forEach(row=>{
          const r1=row.dataset.o1||'', r2=row.dataset.o2||'', r3=row.dataset.o3||'';
          if((!o1||o1===r1) && (!o2||o2===r2) && (!o3||o3===r3) && !found){
            stock=parseInt(row.dataset.stock||'0',10)||0;
            found=true;
          }
        });
        return stock;
      }
      function setQtyMax(n){
        if(!qtyInput) return;
        qtyInput.setAttribute('max', n);
        if(qtyInput.hasAttribute('aria-valuemax')) qtyInput.setAttribute('aria-valuemax', n);
        const val=parseInt(qtyInput.value||'1',10)||1;
        if(val>n) qtyInput.value=n;
      }
      function syncQtyHidden(){
        const v=parseInt((qtyInput && qtyInput.value)?qtyInput.value:'1',10)||1;
        let q=form.querySelector('input[name="quantity"]');
        if(!q){
          q=document.createElement('input');
          q.type='hidden'; q.name='quantity';
          form.appendChild(q);
        }
        q.value=v;
      }
      function render(){
        if(!out) return;
        const stock=findStock();
        const clampMax=parseInt(out.dataset.max||'99',10);
        out.textContent = stock>=clampMax?('+'+clampMax):String(stock);
        setQtyMax(stock);

        // 🔄 sincroniza el label nativo si existe
        const native=[...form.querySelectorAll('.js-product-stock')].find(el=>el!==out);
        if(native){
          native.textContent = (stock>=clampMax?('+'+clampMax):String(stock)) + ' en stock';
        }
      }

      // eventos de variantes
      modal.addEventListener('click',e=>{
        if(e.target.closest('.js-insta-variant')) setTimeout(()=>{ render(); syncQtyHidden(); },0);
      });
      modal.addEventListener('change',e=>{
        if(e.target.classList && e.target.classList.contains('js-variation-option')) setTimeout(()=>{ render(); syncQtyHidden(); },0);
      });

      // eventos de cantidad
      ['input','change','keyup'].forEach(ev=>qtyBox.addEventListener(ev, syncQtyHidden));
      qtyBox.addEventListener('click',e=>{
        if(e.target.matches('.js-quantity-plus, .js-quantity-minus, [data-action="plus"], [data-action="minus"]'))
          setTimeout(syncQtyHidden,0);
      });
      form.addEventListener('submit', syncQtyHidden);

      // inicial
      render();
      syncQtyHidden();
    }

    document.addEventListener('DOMContentLoaded',()=>{
      document.querySelectorAll('[id^="product-variants-"]').forEach(initModal);
    });
  })();
  </script>

  <script>
  (function(){
    function renderCartel(card, cmp){
      const price = cmp/100; // pesos
      const now = new Date(
        new Date().toLocaleString("en-US",{timeZone:"America/Argentina/Buenos_Aires"})
      );
      const day = now.getDay(); // 0=Dom..6=Sab
      const h   = now.getHours();

      let msgVerde = "";

      if(price >= 30000 && price < 50000){
        if(day==0 && h>=10){
          msgVerde = "Llega GRATIS mañana CABA/GBA";
        } else if((day==5 && h>=10) || day==6 || day==0){
          msgVerde = "Llega GRATIS el lunes CABA/GBA";
        } else if(h < 10){
          msgVerde = "Llega GRATIS hoy CABA/GBA";
        } else {
          msgVerde = "Llega GRATIS mañana CABA/GBA";
        }
      } else if(price < 30000){
        if(day==0 && h>=10){
          msgVerde = "Llega mañana CABA/GBA";
        } else if((day==5 && h>=10) || day==6 || day==0){
          msgVerde = "Llega el lunes CABA/GBA";
        } else if(h < 10){
          msgVerde = "Llega hoy CABA/GBA";
        } else {
          msgVerde = "Llega mañana CABA/GBA";
        }
      } else {
        // precio >= 50k: igual mostramos "gratis"
        if(day==0 && h>=10){
          msgVerde = "Llega GRATIS mañana CABA/GBA";
        } else if((day==5 && h>=10) || day==6 || day==0){
          msgVerde = "Llega GRATIS el lunes CABA/GBA";
        } else if(h < 10){
          msgVerde = "Llega GRATIS hoy CABA/GBA";
        } else {
          msgVerde = "Llega GRATIS mañana CABA/GBA";
        }
      }

      const greenEl = card.querySelector('.envio-cartel');
      if(greenEl) greenEl.textContent = msgVerde;
    }

    document.addEventListener("DOMContentLoaded",()=>{
      document.querySelectorAll(".producto-card").forEach(card=>{
        const cmp = parseInt(card.querySelector('.envio-cartel')?.dataset.price || '0', 10);
        renderCartel(card, cmp);
      });
    });
  })();
  </script>






</section>
{% endif %}




