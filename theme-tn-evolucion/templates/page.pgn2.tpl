{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/20jXV4fm/banner.jpg' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/XxG8hPKs/Banner-celular.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/pgn/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}



{# PRODUCTOS INDIVIDUALES #}
{%- set seccion = 'pgn' -%}
{%- set titulo = 'Los mas vendidos de PGN 🌿' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}



{# COMBOS PGN #}
{%- set seccion = 'pgn-combos' -%}
{%- set titulo = 'Nuestras mejores combos 🍃' -%}
{%- set banner_url = 'https://i.ibb.co/Wv8HDpY0/pgn-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/VY8B7qw5/pgn-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/pgn' -%}
{% snipplet 'kg-carrusel.tpl' %}




