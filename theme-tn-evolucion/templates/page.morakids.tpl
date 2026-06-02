{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/8gWCBL4y/banner-web.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/21668P0m/morakids-celular.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/morakids/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}


{# CARRUSEL DE CATEGORIAS #}
{%- set categorias = [
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/panales-bebe-babysec-ultrasoft-genero-sin-genero-tamano-mediano-m-3d90ebfeeef7dd483717534634753040-640-0.webp',    
  link:'https://www.morashop.ar/supermercado/panales',        nombre:'Pañales' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/2-42b870ddc45c98b28c16965192283924-1024-1024.webp',    
  link:'https://www.morashop.ar/accesorios-para-bebes-y-ninos/',        nombre:'Accesorios' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/mini-cry-babies-bebes-llorones-magic-tears-sorpresa-original-d6470881262c99118017012661079635-1024-1024.webp',    
  link:'https://www.morashop.ar/juguetes/',        nombre:'Juguetes' },
] -%}
{% snipplet 'kg-carruselcategorias.tpl' %}


{# ACCESORIOS #}
{%- set seccion = 'accesorios' -%}
{%- set titulo = 'Accesorios para bebés y niños 👶🏻' -%}
{%- set banner_url = null -%}          {# versión desktop #}
{%- set banner_url_mobile = null -%} {# versión celular #}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}


{# PAÑALES #}
{%- set seccion = 'panales' -%}
{%- set titulo = 'Nuestros mejores pañales 🧸' -%}
{%- set banner_url = 'https://i.ibb.co/5hrBYfmG/banner-love-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/FqjjCVrQ/banner-love-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/love' -%}
{% snipplet 'kg-carrusel.tpl' %}






{# BANNER BENEFICIOS #}
{%- set banner_url = 'https://i.ibb.co/MD6sP26D/banner-beneficios.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/ofertas/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}



{# JUGUETES NIÑOS #}
{%- set seccion = 'robots' -%}
{%- set titulo = 'Juguetes para ellos 🤖' -%}
{%- set banner_url = 'https://i.ibb.co/5WkGg2FD/nerf-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/m5ytMyzk/nerf-horizontal.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/nerf' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# JUGUETES NIÑAS #}
{%- set seccion = 'munecas' -%}
{%- set titulo = 'Juguetes para ellas 🪆' -%}
{%- set banner_url = null -%}          {# versión desktop #}
{%- set banner_url_mobile = null -%} {# versión celular #}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}



{# BANNER JUEVES #}
{%- set banner_url = 'https://i.ibb.co/ccL59Prf/1.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCgmTs2/2.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos2/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}