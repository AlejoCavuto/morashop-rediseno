{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/5XKkh8GQ/328-e6196fd568ab3611fb17344574448699-1920-1920.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/5HZvxG8/2-slide-1734457170826-6641119787-39e9662753387b909a99130bc3b0c5191734457173-1920-1920-1.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/el-bananero/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}

{# CARRUSEL DE PRODUCTOS GRANGER #}
{%- set seccion = 'productos-granger' -%}
{%- set titulo = 'PRODUCTOS DE GRANDER' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}