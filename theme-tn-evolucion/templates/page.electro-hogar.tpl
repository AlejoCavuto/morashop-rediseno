{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/RksDnfxB/banner-categoria-horizontal-8d23dc47c53328c40917525008196194-1920-1920.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/DP311dBN/Banner-Electro-Hogar-celular-1.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/hogar/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}

{# CARRUSEL DE MARCAS #}
{%- set marcas = [
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzyGAnXLkyhY6dSI0Ld5gQUtW3LIjol22qLQ&s', link: 'https://www.morashop.ar/lusqtoff' },
  { img: 'https://i.pinimg.com/736x/7b/e6/65/7be665fbb71153515bcb3aeff439b783.jpg', link: 'https://www.morashop.ar/einhell' },
  { img: 'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1742004082618-4266137957-b058f19144e94c409b169714597f66fa1742004087-480-0.webp?2979075868', link: 'https://www.morashop.ar/triton' },
  { img: 'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752437440851-2859742400-dcf33ca109df3311fca7f899a07ce35b1752437442-480-0.webp?2979075868', link: 'https://www.morashop.ar/yelmo' },
  { img: 'https://i.ibb.co/CgcTG3p/rv-logo.jpg', link: 'https://www.morashop.ar/rv-home' },
  { img: 'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752437440851-4184949471-58071108d464b27e2da3cb7572393e221752437443-480-0.webp?2979075868', link: 'https://www.morashop.ar/ultracomb' }
] -%}
{% snipplet 'kg-carruselmarcas.tpl' %}


{# PEQUEÑOS ELECTRODOMESTICOS #}
{%- set seccion = 'electropeques' -%}
{%- set titulo = 'Pequeños Electrodomésticos ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/39mgv5t1/Yelmo-vertical.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/yelmo' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# GRANDES ELECTRODOMESTICOS #}
{%- set seccion = 'electrograndes' -%}
{%- set titulo = 'Grandes Electrodomésticos ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/8nQyZWvK/lusq-verti.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/Gv9zL35j/lusq-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/lusqtoff' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# BANNER BENEFICIOS #}
{%- set banner_url = 'https://i.ibb.co/MD6sP26D/banner-beneficios.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/ofertas/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}



{# BACHAS DE COCINA #}
{%- set seccion = 'bachascocina' -%}
{%- set titulo = 'Bachas de cocina 🫧' -%}
{%- set banner_url = 'https://i.ibb.co/JwRZRwRw/Ultracomb-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/Xx8rkQGB/Ultracomb-horizontalx2.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/ultracomb' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# HERRAMIENTAS #}
{%- set seccion = 'herramientas' -%}
{%- set titulo = 'Nuestras mejores herramientas 🛠️' -%}
{%- set banner_url = 'https://i.ibb.co/Gv9YCX7h/einhell-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/WNfx1krq/einhell-horizontal.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/einhell' -%}
{% snipplet 'kg-carrusel.tpl' %}





{# BANNER TRITON #}
{%- set banner_url = 'https://i.ibb.co/sd6XGY1N/sin-titulo-2-fde2d6f25eb70ebcb317395489806632-1920-1920.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/ZzFqnhkV/triton-celular.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/triton/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}

{# LAVATORIO #}
{%- set seccion = 'lavatorio' -%}
{%- set titulo = 'Todo para tu baño 🛁' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}

{# INODOROS INTELIGENTES #}
{%- set seccion = 'inodoros' -%}
{%- set titulo = 'Inodoros Inteligentes 🚽' -%}
{%- set banner_url = 'https://i.ibb.co/LhRwHJMG/rv-home-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/MyNZ7ftL/rv-home-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/rv-home/' -%}
{% snipplet 'kg-carrusel.tpl' %}

{# BANNER JUEVES #}
{%- set banner_url = 'https://i.ibb.co/ccL59Prf/1.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCgmTs2/2.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos2/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}

{# ASPIRADORAS #}
{%- set seccion = 'aspiradoras' -%}
{%- set titulo = 'Nuestras Aspiradoras ✨' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}

