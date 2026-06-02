{% if products and pages.is_last %}
	<div class="last-page" style="display:none;"></div>
{% endif %}
{% for product in products %}   
    {% include 'snipplets/grid/item.tpl' %}
{% endfor %}


{% if template == 'search' %}
<style>
/* ===== SOLO Resultados de búsqueda ===== */

/* Caja de imagen */
.template-search .item-image{
  position:relative;
  overflow:hidden;
  width:100%;
}

/* Contenedor que el tema usa para el ratio */
.template-search .item-image .js-item-image-padding{
  position:relative !important;
  display:block !important;
  width:100% !important;
  height:220px !important;      /* ajusta el alto deseado */
  padding-bottom:0 !important;   /* anula ratio dinámico */
}

/* Si hay swiper interno, que respete el alto fijo */
.template-search .item-image .swiper-container,
.template-search .item-image .swiper-wrapper,
.template-search .item-image .swiper-slide{
  height:100% !important;
}

/* Imagen centrada y contenida dentro del alto fijo */
.template-search .item-image img{
  position:absolute !important;
  top:0 !important;
  left:0 !important;
  right:0 !important;
  bottom:0 !important;
  width:100% !important;
  height:100% !important;
  object-fit:contain !important;
  transform:none !important;
  transition:transform 0.3s ease !important;  /* transición suave */
}

/* Efecto zoom en hover */
.template-search .item-image img:hover{
  transform:scale(1.05) !important;   /* leve zoom */
}
</style>
{% endif %}
