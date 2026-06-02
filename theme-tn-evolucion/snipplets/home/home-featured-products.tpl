{% set has_featured = has_featured | default(false) and sections.primary.products %}
{% set has_new = has_new | default(false) and sections.new.products %}
{% set has_sale = has_sale | default(false) and sections.sale.products %}
{% set has_promotion = has_promotion | default(false) and sections.promotion.products %}
{% set has_best_seller = has_best_seller | default(false) and sections.best_seller.products %}

{% if has_featured or has_new or has_sale or has_promotion or has_best_seller %}
  {% set productos = [] %}
  {% set titulo_sec = '' %}
  {% set section_id = '' %}
  {% set data_store_name = '' %}
  {% set featured_section_classes = '' %}

  {% if has_featured %}
    {% set productos = sections.primary.products %}
    {% set titulo_sec = (settings.featured_products_title | default('Destacados')) | trim %}
    {% set section_id = 'featured' %}
    {% set data_store_name = 'featured' %}
    {% set featured_section_classes = settings.featured_product_colors ? 'section-featured-products-home section-featured-products-home-colors' : 'section-featured-products-home' %}
  {% elseif has_new %}
    {% set productos = sections.new.products %}
    {% set titulo_sec = (settings.new_products_title | default('Novedades')) | trim %}
    {% set section_id = 'new' %}
    {% set data_store_name = 'new' %}
    {% set featured_section_classes = settings.new_product_colors ? 'section-new-products-home section-new-products-home-colors' : 'section-new-products-home' %}
  {% elseif has_sale %}
    {% set productos = sections.sale.products %}
    {% set titulo_sec = (settings.sale_products_title | default('Ofertas')) | trim %}
    {% set section_id = 'sale' %}
    {% set data_store_name = 'sale' %}
    {% set featured_section_classes = settings.sale_product_colors ? 'section-sale-products-home section-sale-products-home-colors' : 'section-sale-products-home' %}
  {% elseif has_promotion %}
    {% set productos = sections.promotion.products %}
    {% set titulo_sec = (settings.promotion_products_title | default('Promociones')) | trim %}
    {% set section_id = 'promotion' %}
    {% set data_store_name = 'promotion' %}
    {% set featured_section_classes = settings.promotion_product_colors ? 'section-promotion-products-home section-promotion-products-home-colors' : 'section-promotion-products-home' %}
  {% else %}
    {% set productos = sections.best_seller.products %}
    {% set titulo_sec = (settings.best_seller_products_title | default('Más vendidos')) | trim %}
    {% set section_id = 'best-seller' %}
    {% set data_store_name = 'best-seller' %}
    {% set featured_section_classes = settings.best_seller_product_colors ? 'section-best-seller-products-home section-best-seller-products-home-colors' : 'section-best-seller-products-home' %}
  {% endif %}

  {% if productos and productos|length %}
    <section class="js-section-products-{{ section_id }} section-featured-home {{ featured_section_classes }}" data-store="home-products-{{ data_store_name }}">
      {% set fake_sections = { (section_id): { 'products': productos } } %}
      {% include 'snipplets/kg-carrusel.tpl' with { 
          sections: fake_sections, 
          seccion: section_id, 
          titulo: titulo_sec, 
          global_sections: global_sections 
      } %}
    </section>
  {% endif %}
{% endif %}
