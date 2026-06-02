{# BANNER PRINCIPAL #}
{%- set banner_url = 'https://i.ibb.co/ccL59Prf/1.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCgmTs2/2.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}


{# CARRUSEL DE CATEGORIAS #}
{%- set categorias = [
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752436574947-76873699-e4d9bbda70a822f0690bba1002f55b631752436579-240-0.webp?4158832994',   
  link:'https://www.morashop.ar/proteina/',        nombre:'Proteína' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752436574947-6942710589-acd24609bef605ef2da2a49d33781abc1752436579-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/creatina/',        nombre:'Creatina' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707773779122-3898927954-7903edb919aab9e2641332697fd1a45a1707773783-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/combos/',        nombre:'Combos' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/4-d20c847c1380ed761417315104192950-1024-1024.webp',    
  link:'https://www.morashop.ar/barras-proteicas/',        nombre:'Barras Proteicas' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707774434193-2980249802-1573c96001de5ff14e6bc4e9e78702fe1707774435-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/ganadores-de-masa/',        nombre:'Ganadores de masa' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707919140012-6243740340-a3d485fe26e939ccf2dd0560e89ec6021707919142-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/pre-entreno/',        nombre:'Pre entreno' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/1-176a82b2efc711999817170865746193-1024-1024.webp',    
  link:'https://www.morashop.ar/aminoacidos/',        nombre:'Aminoacidos' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707773922288-1496562095-27c4d902bbf8bf8b4e09b0b7f5be88d01707773925-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/geles/',        nombre:'Geles' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/thermo-fuel-x-120-caps-star-nutrition-quemador-termogenico-913e23295695387e7517049827228010-1024-1024.webp',    
  link:'https://www.morashop.ar/quemadores/',        nombre:'Quemadores' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/6-2985f2aaf52c8fb53516964641547957-1024-1024.webp',    
  link:'https://www.morashop.ar/magnesio/',        nombre:'Magnesio' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1752436350314-8159323777-4f23aa8cbf0cec4848c23d2361d9623f1752436351-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/colageno/',        nombre:'Colágeno' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707773922288-3282112217-023000058fd59a02258a67a8a8d420891707773926-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/glutamina/',        nombre:'Glutamina' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/themes/toluca/2-slide-1707773922288-6677957418-160411a6f2cc1a681c10b312c84679c01707773929-240-0.webp?4158832994',    
  link:'https://www.morashop.ar/pro-hormonales/',        nombre:'Pro Hormonales' },
  { img:'https://acdn-us.mitiendanube.com/stores/002/268/228/products/17674-c0e40ebb8ceb50bbad17465392923093-1024-1024.webp',    
  link:'https://www.morashop.ar/vitaminas-y-minerales/',        nombre:'Vitaminas y Minerales' },
] -%}
{% snipplet 'kg-carruselcategorias.tpl' %}



{# STAR NUTRITION #}
{%- set seccion = 'starnutrition' -%}
{%- set titulo = 'Los mas vendidos de Star Nutrition ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/fztx0Jsy/Combos-vertical.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos/combos' -%}
{%- set promocion = '10%OFF TODOS los Jueves!' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# ENA #}
{%- set seccion = 'ena' -%}
{%- set titulo = 'Lo mejor de ENA ⚡' -%}
{%- set banner_url = 'https://i.ibb.co/xRnPrMT/ena-vertical.webp' -%}          {# versión desktop #}
{%- set banner_url_mobile = 'https://i.ibb.co/PZC7RDSG/ena-horizontal-1.webp' -%} {# versión celular #}
{%- set banner_link = 'https://www.morashop.ar/ena' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# BANNER BENEFICIOS #}
{%- set banner_url = 'https://i.ibb.co/MD6sP26D/banner-beneficios.webp' -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = 'https://www.morashop.ar/ofertas/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}



{# SALUD Y BIENESTAR + INNOVA #}
{%- set seccion = 'saludybienestar' -%}
{%- set titulo = 'Salud y bienestar 🧘🏻‍♀️' -%}
{%- set banner_url = 'https://i.ibb.co/LDkR1xqk/innova-vertical.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/vNtdgvj/innova-horizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/innovanaturals' -%}
{% snipplet 'kg-carrusel.tpl' %}


{# COMBOS #}
{%- set seccion = 'combos' -%}
{%- set titulo = 'Nuestras mejores combos 💪🏼' -%}
{%- set banner_url = null -%}
{%- set banner_url_mobile = null -%}
{%- set banner_link = null -%}
{% snipplet 'kg-carrusel.tpl' %}





{# BANNER JUEVES #}
{%- set banner_url = 'https://i.ibb.co/ccL59Prf/1.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7dCgmTs2/2.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/suplementos2/' -%}
{% snipplet 'kg-bannerprincipal.tpl' %}





{# IMPORTADOS #}
{%- set seccion = 'importados' -%}
{%- set titulo = 'Nuestros suplementos importados 🚛' -%}
{%- set banner_url = 'https://i.ibb.co/VWbD5MXy/banner-natural-whey.webp' -%}
{%- set banner_url_mobile = 'https://i.ibb.co/7JYDWSyF/natural-whey-hroizontal.webp' -%}
{%- set banner_link = 'https://www.morashop.ar/natural-whey' -%}
{% snipplet 'kg-carrusel.tpl' %}



{# CARRUSEL DE MARCAS #}
{%- set marcas = [
  { img: 'data:image/png;base64,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', link: 'https://www.morashop.ar/star-nutrition' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAW-ooXK1fnWW-cXKvbhQpbi42PDwoXMVmpA&s', link: 'https://www.morashop.ar/ena' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXcn-LgupVGhomly6lZa94Momcjb1ofvTpGQ&s', link: 'https://www.morashop.ar/innovanaturals' },
  { img: 'https://i.ibb.co/sdw0n6gD/natural-whey.jpg', link: 'https://www.morashop.ar/natural-whey' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCmg4NuAXaIi2KxFMqq0rOV_XIwcawbEYfOQ&s', link: 'https://www.morashop.ar/integra' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6UQTxND_Vhb2v5B0RZKLn6x6lxrcr3PGQrw&s', link: 'https://www.morashop.ar/mervick' },
  { img: 'https://images.seeklogo.com/logo-png/19/1/optimum-nutrition-logo-png_seeklogo-195136.png', link: 'https://www.morashop.ar/optimum' },
  { img: 'https://goodfitness.com.ar/wp-content/uploads/2022/06/GOLD-LOGO-1.jpg', link: 'https://www.morashop.ar/gold' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvOD1XKMUyvjlQmzPHkU5uFQIFa0D6WyuD9g&s', link: 'https://www.morashop.ar/nutrilab' },
  { img: 'https://i.ibb.co/QvMFJmTw/logo.jpg', link: 'https://www.morashop.ar/edn' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB8rczz1dVZQTbJhLmqSnArKGjtfG77gYFHA&s', link: 'https://www.morashop.ar/leguilab' },
  { img: 'https://images.seeklogo.com/logo-png/55/2/myprotein-logo-png_seeklogo-551283.png', link: 'https://www.morashop.ar/my-protein' },
  { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPIOFXYdWytWrT3N1-EfIYa0flNPGsyAYANA&s', link: 'https://www.morashop.ar/body-advance' },
  { img: 'https://i.ibb.co/KxSFTtfQ/hoch.jpg', link: 'https://www.morashop.ar/hoch-sport' }
] -%}
{% snipplet 'kg-carruselmarcas.tpl' %}