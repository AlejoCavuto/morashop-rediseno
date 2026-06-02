{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/S4VqNYj7/banner-horizontal.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/x8dLxg4v/banner-celu.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/supermercado/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}


{# CARRUSEL DE CATEGORIAS #}
{%- set categorias = [
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/17519-bc10440787cd278e4d17442001762352-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/bebidas/',        nombre:'Bebidas' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/vino-mosquita-muerta-black-malbec-750-ml-69751de74e919312b417552824070230-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/vinos/',        nombre:'Vinos' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/17757-d839f0260381aad20517496469118766-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/rollos-y-papel-higienico/',        nombre:'Rollos y Papel' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/panales-bebe-babysec-ultrasoft-genero-sin-genero-tamano-mediano-m-3d90ebfeeef7dd483717534634753040-640-0.webp',    
  link:'https://www.morashop.ar/supermercado/panales',        nombre:'Pañales' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/ladysoft-1-92cb426d3ff05730d817575161281370-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/toallitas',        nombre:'Toallitas' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/1186-889944445dcc7bfec517389324830111-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/limpieza/',        nombre:'Limpieza' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/1584-143a4cdc135925298417400696734779-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/barras-y-cereales/',        nombre:'Barras y cereales' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/18-f8d86362236a8df8d017283262224559-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/infusiones/',        nombre:'Infusiones' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/jberries-mermelada-frutilla-454g-3328151281547ae62017473251109938-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/mermeladas-dulces-y-miel/',        nombre:'Mermeladas' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/14-7d9627d9584203984017301276326290-1024-1024.webp',    
  link:'https://www.morashop.ar/aceites-y-vinagres',        nombre:'Aceites y vinagres' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/83-7e3e9fc2f8a78707f617328085029785-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/arroz-legumbres-y-semillas/',        nombre:'Arroz y legumbres' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/92-b38ddf536a760b4d6e17328091017906-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/harinas-y-reposteria/',        nombre:'Harina y reposteria' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/42-65f7c84dcd5e17825d17301298801380-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/salsas-y-condimentos/',        nombre:'Salsas y condimentos' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/mix-vitalidad-1kg-kos-4266a2f3056d2b36f617512906940501-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/frutos-secos/',        nombre:'Frutos secos' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/yerba-cachamate-amarilla-con-hierbas-500g-14ed06af5a81700a0417479276454671-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/yerbas-mate/',        nombre:'Yerba mate' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/51-aa6bcd11eefa0baf5f17399850419725-1024-1024.webp',    
  link:'https://www.morashop.ar/supermercado/almacen/pasta-de-mani/',        nombre:'Pasta de mani' },
] -%}
{% snipplet 'kg-carruselcategorias.tpl' %}


{# OFERTA CERVEZAS #}
{%- set seccion = 'ofertacerveza' -%}
{%- set titulo = 'Ofertas hasta agotar Stock 🍺' -%}
{%- set banner_url = 'https://i.ibb.co/TBNM7Sfn/cervezas-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/bMxHwvjz/cervezas-horizontal-1.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/oferta-cervezas' -%}
{% snipplet 'kg-carrusel.tpl' %}

{# DICOMERE #}
{%- set seccion = 'dicomere' -%}
{%- set titulo = 'Los mas vendidos de Dicomere ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/8nJH2083/dicomere-vertical.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/dicomere' -%}
{% snipplet 'kg-carrusel.tpl' %}

{# DIETETICA #}
{%- set seccion = 'dietetica' -%}
{%- set titulo = 'Cuidado y bienestar 🌿' -%}
{%- set banner_url = 'https://i.ibb.co/Q3Cg6R67/Integra-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCWY9m1/integra-horizontal.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/integra' -%}
{% snipplet 'kg-carrusel.tpl' %}



{# BANNER BENEFICIOS #}
{%- set banner_url = 'https://i.ibb.co/MD6sP26D/banner-beneficios.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/ofertas/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}



{# PAÑALES #}
{%- set seccion = 'panales' -%}
{%- set titulo = 'Pañales para bebés 🍼' -%}
{%- set banner_url = 'https://i.ibb.co/6RFZN19N/higienol-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/MDD702Vc/higienol-horizontal.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/higienol' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# ACEITES #}
{%- set seccion = 'aceites' -%}
{%- set titulo = 'Nuestros mejores aceites ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/HDbSd03x/ladysoft-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/211dhfSj/ladysoft-horizontal.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/ladysoft' -%}
{% snipplet 'kg-carrusel.tpl' %}





{# BANNER JUEVES #}
{%- set banner_url = 'https://i.ibb.co/ccL59Prf/1.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCgmTs2/2.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos2/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}

{# IMPORTADOS #}
{%- set seccion = 'entrenuts' -%}
{%- set titulo = 'Lo mejor de Entrenuts 🍯' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}

{# SRI SRI #}
{%- set seccion = 'srisri' -%}
{%- set titulo = 'Lo mejor de Sri Sri 🍵' -%}
{%- set banner_url = 'https://i.ibb.co/MyPQc09F/saint-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/Q3PgHbFc/saint-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/saint-gottard' -%}
{% snipplet 'kg-carrusel.tpl' %}