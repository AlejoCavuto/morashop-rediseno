{% set has_filters_available = products and has_filters_enabled and (filter_categories is not empty or product_filters is not empty) %}
{% set show_help = not has_products %}

{% if category.handle == "ofertas" %}
    {% paginate by 20 %}
{% else %}
    {% if settings.pagination == 'infinite' %}
        {% paginate by 12 %}
    {% else %}
        {% if settings.grid_columns_desktop == '5' %}
            {% paginate by 50 %}
        {% else %}
            {% paginate by 48 %}
        {% endif %}
    {% endif %}
{% endif %}


{% if not show_help %}

{# === SOLO PARA OFERTAS === #}
{% if category.handle == "ofertas" %}

  {# BANNER PRINCIPAL #}
  {%- set banner_url = 'https://i.ibb.co/RGWyyHSM/ofertas-categoria-041404c0284b5abd6017533654403296-1920-1920.webp' -%}
  {%- set banner_url_mobile = 'https://i.ibb.co/pSSZh1Z/banner-ofertas-horizontal.webp' -%}
  {%- set banner_link = 'https://www.morashop.ar/ofertas/' -%} 
  {% snipplet 'kg-bannerprincipal.tpl' %}

  {# CARRUSEL DE CATEGORIAS #}
  {%- set categorias = [
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/1-2091f046cdb9e699d617310762984465-1024-1024.webp',    
      link:'https://www.morashop.ar/ofertas/suplementos', nombre:'Suplementos' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/17556-4840ccc7c02df8bcba17448090777420-1024-1024.webp',    
      link:'https://www.morashop.ar/ofertas/combos', nombre:'Combos' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/92-b38ddf536a760b4d6e17328091017906-1024-1024.webp',    
      link:'https://www.morashop.ar/ofertas/supermercado', nombre:'Supermercado' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/cafetera-espresso-marca-ultracomb-modelo-ce-6108-color-rojo-8ec9c46ac61fb4626b17510467962943-320-0.webp',    
      link:'https://www.morashop.ar/ofertas/hogar', nombre:'Electro-Hogar' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/japi-roja-6c52b9acfb6ef513f917569147772016-320-0.webp',    
      link:'https://www.morashop.ar/ofertas/el-bananero', nombre:'El Bananero' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/45-9f55dcde946e8503b017265010630419-320-0.webp',    
      link:'https://www.morashop.ar/ofertas/comiqueria', nombre:'Comiqueria' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/panales-bebe-babysec-ultrasoft-genero-sin-genero-tamano-mediano-m-3d90ebfeeef7dd483717534634753040-640-0.webp',    
      link:'https://www.morashop.ar/ofertas/panales', nombre:'Pañales' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/banera-celeste1-2470e0571bd735e17e16955777091849-320-0.webp',    
      link:'https://www.morashop.ar/ofertas/accesorios-para-bebes-y-ninos/', nombre:'Accesorios bebé' },
    { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/2-d8f13691a1c7ac45b317182920879740-1024-1024.webp',    
      link:'https://www.morashop.ar/ofertas/juguetes', nombre:'Juguetes' },
  ] -%}
  {% snipplet 'kg-carruselcategorias.tpl' %}





	{# === NECESARIO PARA FILTROS EN MOBILE === #}

	{% include 'snipplets/grid/filters-modals.tpl' %}
	<section class="js-category-controls-prev category-controls-sticky-detector"></section>


	{# FILTRO FALSO SOLO MOBILE (debajo de Ordenar/Filtrar) #}
	<div class="d-md-none border-top bg-white">
	<a href="#"
		id="toggle-suplemento-mobile"
		class="d-block py-3 text-center text-uppercase font-small font-weight-bold w-100"
		style="color:#000e35; border-bottom:1px solid #e5e5e5; background:#fff;">
		<span>☆ Tipo de suplemento</span>
		<span class="ml-2 icon-right">
		{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline svg-icon-text"} %}
		</span>
		<span class="ml-2 icon-down" style="display:none;">
		{% include "snipplets/svg/chevron-down.tpl" with {svg_custom_class: "icon-inline svg-icon-text"} %}
		</span>
	</a>

	<div id="content-suplemento-mobile" class="px-3 py-2 bg-white" style="display:none; border-bottom:1px solid #e5e5e5;">
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/combos" class="checkbox-text">Combos de Suplementos</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/proteina" class="checkbox-text">Proteína</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/creatina" class="checkbox-text">Creatina</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/omega3/" class="checkbox-text">Omega 3</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/geles-y-barras" class="checkbox-text">Geles y Barras</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/pre-entreno/" class="checkbox-text">Pre Entreno</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/ganadores-de-masa/" class="checkbox-text">Ganadores de Masa</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/aminoacidos/" class="checkbox-text">Aminoácidos</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/arginina/" class="checkbox-text">Arginina</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/glutamina/" class="checkbox-text">Glutamina</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/quemadores/" class="checkbox-text">Quemadores</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/carnitina/" class="checkbox-text">Carnitina</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/vitaminas-y-minerales" class="checkbox-text">Vitaminas y minerales</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/colageno/" class="checkbox-text">Colageno</a></label>
		<label class="d-block mb-2"><a href="https://www.morashop.ar/ofertas/magnesio/" class="checkbox-text">Magnesio</a></label>
		<label class="d-block mb-0"><a href="https://www.morashop.ar/ofertas/potasio/" class="checkbox-text">Potasio</a></label>
	</div>
	</div>

	<script>
	document.addEventListener("DOMContentLoaded", function(){
	const toggle = document.getElementById("toggle-suplemento-mobile");
	const content = document.getElementById("content-suplemento-mobile");
	const iconRight = toggle.querySelector(".icon-right");
	const iconDown = toggle.querySelector(".icon-down");

	toggle.addEventListener("click", function(e){
		e.preventDefault();
		const isVisible = content.style.display === "block";
		content.style.display = isVisible ? "none" : "block";
		iconRight.style.display = isVisible ? "inline" : "none";
		iconDown.style.display = isVisible ? "none" : "inline";
	});
	});
	</script>



	<section class="category-body" data-store="category-grid-{{ category.id }}">
	<div class="container mt-3 mb-5">
		<div class="row">
		<div class="col-md-3 filters-sidebar d-none d-md-block visible-when-content-ready">
			{% if has_filters_available %}
			{% include 'snipplets/grid/filters-sidebar.tpl' %}
			{% endif %}

			{# === FILTRO FALSO: TIPO DE SUPLEMENTO === #}
			<div class="js-accordion-container js-filter-container card px-3 ml-3 mr-4"
				data-store="filters-group"
				data-component="list.filter-custom"
				data-component-value="tipo-de-suplemento">

			<div class="h6 font-big mb-0">
				<a href="#"
				class="js-accordion-toggle font-md-small text-uppercase row no-gutters align-items-center py-md-2"
				data-accordion-target="tipo-suplemento">
				<div class="col my-1 pr-3 d-flex align-items-center">
					TIPO DE SUPLEMENTO
				</div>
				<div class="col-auto my-1">
					<span class="js-accordion-toggle-inactive">
					{% include "snipplets/svg/chevron-right.tpl" with {svg_custom_class: "icon-inline svg-icon-text icon-lg font-big font-md-body mr-1"} %}
					</span>
					<span class="js-accordion-toggle-active" style="display: none;">
					{% include "snipplets/svg/chevron-down.tpl" with {svg_custom_class: "icon-inline svg-icon-text icon-lg font-big font-md-body"} %}
					</span>
				</div>
				</a>
			</div>

			<div class="js-accordion-content mt-md-1 my-3" style="display: none;">
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/combos" class="checkbox-text">Combos de Suplementos</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/proteina" class="checkbox-text">Proteína</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/creatina" class="checkbox-text">Creatina</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/omega3/" class="checkbox-text">Omega 3</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/geles-y-barras" class="checkbox-text">Geles y Barras</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/pre-entreno/" class="checkbox-text">Pre Entreno</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/ganadores-de-masa/" class="checkbox-text">Ganadores de Masa</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/aminoacidos/" class="checkbox-text">Aminoácidos</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/arginina/" class="checkbox-text">Arginina</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/glutamina/" class="checkbox-text">Glutamina</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/quemadores/" class="checkbox-text">Quemadores</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/carnitina/" class="checkbox-text">Carnitina</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/vitaminas-y-minerales" class="checkbox-text">Vitaminas y minerales</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/colageno/" class="checkbox-text">Colageno</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/magnesio/" class="checkbox-text">Magnesio</a>
				</label>
				<label class="checkbox-container d-block mb-2">
				<a href="https://www.morashop.ar/ofertas/potasio/" class="checkbox-text">Potasio</a>
				</label>
			</div>
			</div>


			{# BANNER FIJO SOLO ESCRITORIO - ENTRE FILTRO FALSO Y ROTATIVO #}
			<div class="mt-4 d-none d-md-block text-center">
			<a href="https://www.morashop.ar/productos/cerveza-japi-chala-lager-473ml-el-bananero/" target="_self">
				<img src="https://i.ibb.co/WdmVmTJ/banner-chala-vertical.webp"
					alt="Creatina Monohidratada Star Nutrition"
					style="width:90%; height:auto; display:block; margin:0 auto; border-radius:6px;" />
			</a>
			</div>

			{# BANNER EXTRA SOLO ESCRITORIO (debajo de filtros) #}
			<div class="mt-4 d-none d-md-block text-center">
			<a id="sidebar-banner-link" href="https://www.morashop.ar/suplementos2/" target="_self">
				<img id="sidebar-banner-img"
					src="https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752250817659-4701675402-a26a25352ff8ad844ab9eccace52814f1752250817-480-0.webp?3677234863"
					alt="Banner rotativo lateral"
					style="width:90%; height:auto; display:block; margin:0 auto; border-radius:6px;" />
			</a>
			</div>

			<script>
			(function(){
				const banners = [
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752250817659-4701675402-a26a25352ff8ad844ab9eccace52814f1752250817-480-0.webp?3677234863", link: "https://www.morashop.ar/suplementos2/" },
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752246790104-527607910-dc58b8e5d0ab61b833179a5e889c30aa1752246789-480-0.webp?3677234863", link: "https://www.morashop.ar/supermercado2/" },
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752250165550-3622339743-35ec9be02704f90c301e51a90e8e7eb21752250164-480-0.webp?3677234863", link: "https://www.morashop.ar/electro-hogar" },
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1756926607163-4410520794-04c60bb8cdedf446dc3451c790375fdf1756926603-480-0.webp?3677234863", link: "https://www.morashop.ar/bananero" },
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1757335674902-8442953568-b0a61801b8a78b2b1d95ae245de236831757335669-480-0.webp?3677234863", link: "https://www.morashop.ar/comiqueria2/" },
				{ img: "https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1757344241776-2646276814-956673f35639155f154040058c7360641757344236-480-0.webp?3677234863", link: "https://www.morashop.ar/mundo-del-bebe" }
				];
				let i = 0;
				const imgEl = document.getElementById("sidebar-banner-img");
				const linkEl = document.getElementById("sidebar-banner-link");
				setInterval(()=>{
				i = (i + 1) % banners.length;
				imgEl.src = banners[i].img;
				linkEl.href = banners[i].link;
				}, 3000);
			})();
			</script>
		</div>

		<div class="col">
			{# BOTÓN ORDENAR SOLO DESKTOP #}
			<div class="d-none d-md-flex justify-content-end mb-3 pr-3">
			<a href="#" class="js-modal-open btn-link" data-toggle="#sort-by">
				<div class="d-flex justify-content-center align-items-center">
				{% include "snipplets/svg/sort.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
				{{ 'Ordenar' | t }}
				</div>
			</a>
			</div>

			{% include 'snipplets/grid/products-list.tpl' %}

			{# BANNER JUEVES AL FINAL DE LOS PRODUCTOS #}
			<div class="mt-4">
			{%- set banner_url = 'https://i.ibb.co/BKZd8PQ1/Exclusivo-Jueves-1.webp' -%}
			{%- set banner_url_mobile = 'https://i.ibb.co/BKchdPQ0/banner-jueves-suplementos-celular.webp' -%}
			{%- set banner_link = 'https://www.morashop.ar/suplementos/' -%}
			{% snipplet 'kg-bannerprincipal.tpl' %}
			</div>
		</div>
		</div>
	</div>
	</section>

	{# ============================================================
	   MORAHOT — EVENTO DESACTIVADO (terminó el 17/05/2026)
	   ------------------------------------------------------------
	   Para REACTIVAR el año que viene:
	   1. Cambiar  `false and ...`  por  `category.handle == "morahot"`
	      en la línea del elseif de abajo.
	   2. Actualizar fechas en:
	      - snipplets/home/home-morahot-teaser.tpl (Twig + JS endTs/startTs)
	      - snipplets/category-morahot-banner.tpl  (JS target)
	   3. Subir descuentos en el admin de Tiendanube.
	   Mientras `false and` esté ahí, /morahot se renderiza como una
	   categoría NORMAL (cae en el {% else %} de abajo).
	   ============================================================ #}
	{% elseif false and category.handle == "morahot" %}

	{# === CATEGORÍA MORAHOT — Banner del evento + estilos premium === #}

	{# 1. Estilos premium scopeados con .morahot-cat-page (se inyectan al body) #}
	{% include 'snipplets/category-morahot-styles.tpl' %}

	{# 2. Banner MORAHOT (eyebrow EN VIVO + título + countdown + reglas) #}
	{% include 'snipplets/category-morahot-banner.tpl' %}

	{# 3. Filtros + grilla nativa (igual que el resto de categorías) #}
	{% include 'snipplets/grid/filters-modals.tpl' %}
	<section class="js-category-controls-prev category-controls-sticky-detector"></section>

	<div class="container py-3 py-md-4" id="productos-morahot">
	  <div class="row">

	    {# Sidebar de filtros (Marca, Precio, etc.) — desktop only #}
	    <aside class="col-md-3 d-none d-md-block">
	      {% include 'snipplets/grid/filters-sidebar.tpl' %}
	    </aside>

	    {# Listado de productos — usa el snippet nativo del tema #}
	    <div class="col-md-9">
	      <div class="d-flex justify-content-between align-items-center mb-3">
	        <span style="color:#fff;font-family:'Sora',sans-serif;font-weight:700;">
	          {% if products %}
	            {{ products | length }} {{ products | length == 1 ? 'producto' : 'productos' }} en MORAHOT
	          {% endif %}
	        </span>
	        {% if products | length > 1 %}
	          <a href="#" class="js-modal-open btn-link" data-toggle="#sort-by">
	            <div class="d-flex justify-content-center align-items-center">
	              {% include "snipplets/svg/sort.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
	              {{ 'Ordenar' | t }}
	            </div>
	          </a>
	        {% endif %}
	      </div>

	      {% include 'snipplets/grid/products-list.tpl' %}
	    </div>

	  </div>
	</div>

	{# 4. Aclaración del 10% al final #}
	{% include 'snipplets/category-morahot-footer.tpl' %}

	{% else %}






	{# === RESTO DE CATEGORÍAS SIN CAMBIOS === #}
	{% set category_banner = (category.images is not empty) or ("banner-products.jpg" | has_custom_image) %}
	{% set has_category_description_without_banner = not category_banner and category.description %}
	{% set page_header_classes = has_category_description_without_banner ? 'pt-3 pt-md-4' : '' %}
	{% set page_header_padding = has_category_description_without_banner ? false : true %}

	{% if category_banner %}
	    {% include 'snipplets/category-banner.tpl' %}
	{% endif %}

	<div class="background-secondary mb-md-3">
		<div class="container">
			<div class="row align-items{% if category_banner %}-center{% else %}-end{% endif %}">
				<div class="col">
					{% if category_banner %}
						{% include 'snipplets/breadcrumbs.tpl' with {breadcrumbs_custom_class: 'mb-0' } %}
					{% else %}
						{% embed "snipplets/page-header.tpl" with {container: false, padding: page_header_padding, page_header_class: page_header_classes} %}
						    {% block page_header_text %}{{ category.name }}{% endblock page_header_text %}
						{% endembed %}
						{% if category.description %}
							<p class="mt-2 mb-md-4 mb-3">{{ category.description }}</p>
						{% endif %}
					{% endif %}
				</div>
				{% if products %}
					<div class="col-auto py-3 py-md-4">
						<a href="#" class="js-modal-open btn-link d-none d-md-block" data-toggle="#sort-by">
							<div class="d-flex justify-content-center align-items-center">
								{% include "snipplets/svg/sort.tpl" with { svg_custom_class: "icon-inline mr-2"} %}
								{{ 'Ordenar' | t }}
							</div>
						</a>
						{% if products | length > 1 %}
							<div class="d-md-none text-right font-small mb-1">
								{{ products_count }} {{ 'productos' | translate }}
							</div>
						{% endif %}
					</div>
				{% endif %}
			</div>
		</div>
	</div>

	{% include 'snipplets/grid/filters-modals.tpl' %}
	<section class="js-category-controls-prev category-controls-sticky-detector"></section>




	<section class="category-body" data-store="category-grid-{{ category.id }}">
		<div class="container {% if has_applied_filters %}mt-md-0{% endif %} mt-3 mb-5">
			<div class="row">
				{% if has_applied_filters %}
					<div class="col-12 mb-3 mb-md-4 d-flex justify-content-md-end align-items-center visible-when-content-ready">
						{% include "snipplets/grid/filters.tpl" with {applied_filters: true} %}
					</div>
				{% endif %}
				{% if has_filters_available %} 
					{% include 'snipplets/grid/filters-sidebar.tpl' %}
				{% endif %}
				{% include 'snipplets/grid/products-list.tpl' %}
			</div>
		</div>
	</section>

{% endif %}

{% elseif show_help %}
	{# Category Placeholder #}
	{% include 'snipplets/defaults/show_help_category.tpl' %}
{% endif %}
