<script>
/* ===== CANDADO PRE-LANZAMIENTO =====
   La página NO es pública todavía. Solo se ve con la clave:
     morashop.ar/gero-arias?preview=gero366    (o  .../gero-arias#gero366)
   Sin la clave, redirige a la home. Para hacerla PÚBLICA en el lanzamiento: borrar este bloque <script>. */
(function () {
  try {
    var KEY = "gero366";
    var ok = (location.search.indexOf("preview=" + KEY) !== -1) || (location.hash === "#" + KEY);
    if (!ok) { location.replace("https://www.morashop.ar/"); }
  } catch (e) {}
})();
</script>

{# ============================================================
   LANDING OCULTA · GERO ARIAS × MORASHOP (366 Discipline)
   Se renderiza por el switch de handles en layouts/layout.tpl (~línea 115).
   CSS: static/css/cavutia-gero.scss (cargado por condicional en el <head> del layout).
   Imágenes de Gero: subir a static/images/gero/ y se referencian con static_url.
   Imágenes de producto: van por CDN de Tiendanube (URLs absolutas en el JS).
   Topbar propio omitido: el theme ya trae su header.
   ============================================================ #}

<div class="gero-page">

  {# ============ HERO ============ #}
  <section class="hero" aria-label="Gero Arias en el Obelisco">
    <img class="hero__bg" src="{{ 'images/gero/hero-obelisco.jpg' | static_url }}"
         alt="Gero Arias con los brazos abiertos en el Obelisco frente a una multitud, tras cerrar su reto de 366 dominadas"
         fetchpriority="high" />
    <div class="hero__scrim" aria-hidden="true"></div>

    <div class="hero__content">
      <p class="eyebrow">Colaboración oficial <span class="eyebrow__dot">·</span> 366 Discipline</p>
      <h1 class="hero__title">
        <span>La gloria</span>
        <span>será eterna</span>
      </h1>
      <p class="hero__sub">
        Los suplementos que <strong>Gero Arias</strong> usa todos los días para bancar su nivel.
        Elegidos por él. Al precio de siempre, con la confianza de siempre.
      </p>
      <div class="hero__actions">
        <a class="btn btn--red" href="#suplementos">Ver los suplementos de Gero</a>
        <a class="btn btn--ghost" href="#quien">¿Quién es Gero?</a>
      </div>
    </div>
  </section>

  {# ============ RIEL 366 ============ #}
  <div class="rail" role="separator" aria-label="366 · La gloria será eterna">
    <div class="rail__track" id="rail-track" aria-hidden="true"></div>
  </div>

  {# ============ ¿QUIÉN ES GERO? ============ #}
  <section class="quien reveal" id="quien" aria-labelledby="quien-title">
    <div class="quien__media">
      <img src="{{ 'images/gero/dominada-obelisco.jpg' | static_url }}"
           alt="Gero Arias haciendo una dominada en el Obelisco, junto a los carteles 366/366 — La gloria será eterna"
           loading="lazy" />
      <span class="quien__stamp"><span data-count="366">366</span><small>/366</small></span>
    </div>

    <div class="quien__text">
      <p class="kicker">La historia</p>
      <h2 id="quien-title">¿Quién es Gero Arias?</h2>

      <p>Gero Arias es de esos que no entienden de atajos. Puntano, derecho y obsesionado con superarse, se ganó al país a pura disciplina: arrancó con la calistenia y se hizo leyenda el día que cerró su reto de 366 dominadas arriba del Obelisco —una por cada día del año, frente a una multitud—. Esa misma cabeza, la de no aflojar nunca, es la que hoy lo tiene peleando arriba del ring.</p>

      <p>Porque Gero dio el salto al boxeo y lo hizo en serio: le ganó a Tomás Mazza en Párense de Manos 3, se prepara para enfrentar a Viruzz en La Velada del Año 6 y no esconde su sueño más grande, los Juegos Olímpicos 2028. Pero atrás de cada pelea hay algo que la cámara no muestra: entrenamiento todos los días, descanso, cabeza y una nutrición tomada en serio. Y ahí es donde entra Morashop.</p>

      <p>Esta colaboración nace de algo simple. Gero entrena como pocos, y para bancar ese nivel necesita suplementos de verdad, sin vueltas ni promesas mágicas. Por eso armamos juntos su selección: los productos que usa en su día a día, los mismos que conseguís acá, al precio de siempre y con la confianza de siempre. <strong>Gero le mete la disciplina. Los suplementos los pone Morashop.</strong></p>

      <ol class="palmares" aria-label="Palmarés de Gero Arias">
        <li class="palmares__item is-done reveal reveal--left" style="--d:0ms">
          <span class="palmares__label">366 / 366 dominadas</span>
          <span class="palmares__badge">Cumplido</span>
        </li>
        <li class="palmares__item is-done reveal reveal--left" style="--d:90ms">
          <span class="palmares__label">Párense de Manos 3</span>
          <span class="palmares__badge">Ganó</span>
        </li>
        <li class="palmares__item is-next reveal reveal--left" style="--d:180ms">
          <span class="palmares__label">La Velada del Año 6</span>
          <span class="palmares__badge">Próxima</span>
        </li>
        <li class="palmares__item is-goal reveal reveal--left" style="--d:270ms">
          <span class="palmares__label">Juegos Olímpicos 2028</span>
          <span class="palmares__badge">Objetivo</span>
        </li>
      </ol>
    </div>
  </section>

  {# ============ BOXEO ============ #}
  <section class="boxeo" aria-labelledby="boxeo-title">
    <div class="boxeo__head reveal">
      <span class="boxeo__num" data-count="366" aria-hidden="true">366</span>
      <p class="boxeo__kicker">Del Obelisco al ring</p>
      <h2 id="boxeo-title">De las dominadas<br>a los <em>puños</em></h2>
    </div>

    <div class="boxeo__grid">
      <figure class="boxeo__card boxeo__card--campeon reveal">
        <img src="{{ 'images/gero/campeon.jpg' | static_url }}"
             alt="Gero Arias levantando el cinturón de campeón tras ganar en Párense de Manos 3" loading="lazy" />
      </figure>

      <figure class="boxeo__card boxeo__card--mercado reveal">
        <img src="{{ 'images/gero/boxeo-mercado.jpg' | static_url }}"
             alt="Gero Arias en guardia con cabezal y guantes Venum, primer plano" loading="lazy" />
      </figure>

      <figure class="boxeo__card boxeo__card--golpe reveal">
        <img src="{{ 'images/gero/boxeo-golpe.jpg' | static_url }}"
             alt="Gero Arias conectando un golpe frente al público" loading="lazy" />
      </figure>

      <figure class="boxeo__card boxeo__card--globo reveal">
        <img src="{{ 'images/gero/globo.jpg' | static_url }}"
             alt="Gero Arias colgado de un globo aerostático al amanecer, en silueta" loading="lazy" />
      </figure>
    </div>

    <div class="boxeo__foot reveal">
      <span><strong>Párense de Manos 3</strong> le ganó a Tomás Mazza</span>
      <span><strong>La Velada del Año 6</strong> vs Viruzz</span>
      <span>Objetivo <strong>JJOO 2028</strong></span>
    </div>
  </section>

  {# ============ SUPLEMENTOS ============ #}
  <section class="store" id="suplementos" aria-labelledby="store-title">
    <div class="store__head reveal">
      <p class="kicker">Selección de Gero</p>
      <h2 id="store-title">Suplementos elegidos por Gero</h2>
      <p class="store__lede">Los productos que usa en su día a día. Mismos precios, misma confianza de Morashop.</p>

      <ul class="promo-strip" aria-label="Promociones vigentes">
        <li>15% OFF efectivo</li>
        <li>Hasta 3 cuotas sin interés</li>
        <li>Envío gratis CABA/GBA +$70.000</li>
      </ul>
    </div>

    <div class="store__grid" id="product-grid">
      {# cards inyectadas por el JS de abajo #}
    </div>
  </section>

  {# ============ SHAKER 366 ============ #}
  <section class="shaker" aria-labelledby="shaker-title">
    <div class="shaker__viz reveal">
      {# AHORA: foto del shaker. CUANDO LLEGUE EL 3D: cargar model-viewer por CDN
         (script type=module en el head vía condicional de handle), subir
         static/images/gero/shaker.glb y reemplazar este <img> por el <model-viewer>. #}
      <div class="shaker__glow" aria-hidden="true"></div>
      <img class="shaker__photo" src="{{ 'images/gero/shaker.jpg' | static_url }}"
           alt="Shaker 366 Discipline negro con el sello GA de Gero Arias × Morashop" width="900" height="900" loading="lazy" />
    </div>

    <div class="shaker__text reveal">
      <p class="kicker kicker--light">Edición 366 Discipline</p>
      <h2 id="shaker-title">El shaker de la disciplina</h2>
      <p>Diseño cerrado, con el sello <strong>366 Discipline</strong>. El mismo que banca cada entrenamiento de Gero. Lo estamos terminando para que lo tengas en tus manos.</p>
      <span class="badge-soon">Próximamente</span>
    </div>
  </section>

  {# ============ VIDEOS ============ #}
  <section class="videos" aria-labelledby="videos-title">
    <div class="videos__head reveal">
      <p class="kicker">En cancha</p>
      <h2 id="videos-title">Mirá a Gero en acción</h2>
    </div>
    <div class="videos__grid" id="video-grid">
      {# cards inyectadas por el JS de abajo #}
    </div>
  </section>

  {# ============ MERCH (teaser) ============ #}
  <section class="merch reveal" aria-labelledby="merch-title">
    <img class="merch__bg" src="{{ 'images/gero/gero-torso.jpg' | static_url }}"
         alt="Gero Arias de torso, parado en las gradas" loading="lazy" />
    <div class="merch__scrim" aria-hidden="true"></div>
    <div class="merch__content">
      <p class="eyebrow">366 Discipline</p>
      <h2 id="merch-title">La ropa está en camino</h2>
      <p>La línea de indumentaria 366 Discipline se viene. Disciplina para llevar puesta.</p>
      <span class="badge-soon">Próximamente</span>
    </div>
  </section>

  {# ============ SEGUÍ A GERO ============ #}
  <section class="follow reveal" aria-labelledby="follow-title">
    <h2 id="follow-title">Seguí a Gero</h2>
    <div class="follow__links">
      <a href="https://www.youtube.com/@geroariass" target="_blank" rel="noopener noreferrer">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
        <span>YouTube</span>
      </a>
      <a href="https://www.instagram.com/geroooo_arias" target="_blank" rel="noopener noreferrer">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 1.6c-3.1 0-3.5 0-4.8.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 4.1a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2zm0 6.8a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4zm5.2-7a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0z"/></svg>
        <span>Instagram</span>
      </a>
      <a href="https://www.tiktok.com/@geroooo_ariass366" target="_blank" rel="noopener noreferrer">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 5.8a4.8 4.8 0 0 1-1-1.4 4.7 4.7 0 0 1-.4-1.9h-3.1v12.9a2.6 2.6 0 0 1-2.6 2.5 2.6 2.6 0 1 1 .7-5.1V9.6a5.8 5.8 0 0 0-.7-.1 5.7 5.7 0 1 0 5.7 5.7V8.6a7.8 7.8 0 0 0 4.6 1.5V7a4.7 4.7 0 0 1-3.1-1.2z"/></svg>
        <span>TikTok</span>
      </a>
    </div>
  </section>

  {# ============ FOOTER LANDING ============ #}
  <footer class="footer">
    <p class="footer__tagline">Comprar suplementos<br/><span>es Morashop.</span></p>

    <div class="footer__cols">
      <nav class="footer__col" aria-label="Tienda">
        <h3>Tienda</h3>
        <a href="https://www.morashop.ar">Inicio</a>
        <a href="https://www.morashop.ar/suplementos/">Suplementos</a>
        <a href="https://www.morashop.ar/supermercado/">Supermercado</a>
        <a href="https://www.morashop.ar/electro-hogar/">Electro-Hogar</a>
        <a href="https://www.morashop.ar/bananero1/">El Bananero</a>
        <a href="https://www.morashop.ar/bodega/">Bodega</a>
      </nav>

      <nav class="footer__col" aria-label="Seguinos">
        <h3>Seguinos</h3>
        <a href="https://instagram.com/morashop.ar" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/morashop.ar" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.youtube.com/channel/UCWZTjnmVgJw-cmCSmyE5v4Q" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="https://www.tiktok.com/@morashop.ar" target="_blank" rel="noopener noreferrer">TikTok</a>
      </nav>

      <nav class="footer__col" aria-label="Contacto">
        <h3>Hablemos</h3>
        <a href="https://wa.me/541131373961" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="https://www.morashop.ar">morashop.ar</a>
      </nav>
    </div>

    <div class="footer__bottom">
      <img class="footer__logo" src="{{ 'images/gero/logo-morashop.png' | static_url }}" alt="Morashop" width="44" height="44" loading="lazy" />
      <p>Gero Arias × Morashop · 366 Discipline · Distribuidor oficial.</p>
    </div>
  </footer>

</div>{# /.gero-page #}

<script>
(function () {
  /* ---------- PRODUCTOS (editables) ---------- */
  var PRODUCTOS = [
    { nombre:"L-Citrulline 300g Star Nutrition", tag:"Pre-entreno · Óxido nítrico", precio:59448, efectivo:50531, cuota3:19816, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico-750ae7be0a0bbcf56a17049828706844-640-0.webp", link:"https://www.morashop.ar/productos/l-citrulline-300-gr-star-nutrition-citrulina-malato-pre-entreno-oxido-nitrico/" },
    { nombre:"Omega 3 Max 1000 EPA + 500 DHA Innovanaturals 60caps", tag:"Salud · Omega-3", precio:82294, efectivo:69950, cuota3:27431, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed-454c3b5ca9a3b85c6d17659080390301-640-0.webp", link:"https://www.morashop.ar/productos/omega-3-max-1000-epa-500-dha-innovanaturals-60caps-ifos-goed/" },
    { nombre:"C4 Ultimate Preworkout Cellucor", tag:"Pre-entreno", precio:111851, efectivo:95073, cuota3:37284, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/c4-ultimate-pre-workout-powder-icy-blue-razz-c56cb8982f7453eda017518961568769-640-0.webp", link:"https://www.morashop.ar/productos/c4-ultimate-preworkout-cellucor-6s4ut/" },
    { nombre:"Granger Pancake Proteico Dulce de Leche 300g", tag:"Desayuno proteico", precio:13349, efectivo:11347, cuota3:4450, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_758169-mla112406319643_052026-o-95a74d76d478ab1d7317803328911087-640-0.webp", link:"https://www.morashop.ar/productos/granger-pancake-proteico-300g-dulce-de-leche-c7qzf/" },
    { nombre:"Granger Pancakes Proteicos Vainilla 400g", tag:"Desayuno proteico", precio:13349, efectivo:11347, cuota3:4450, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/d_831301-mla106122704302_022026-o-1b6de99bd2bdbc956517733355623324-640-0.webp", link:"https://www.morashop.ar/productos/pancakes-proteicos-sabor-vainilla-granger-400-g-yuams/" },
    { nombre:"Star Nutrition Platinum Whey Protein 907g", tag:"Proteína", precio:71211, efectivo:60529, cuota3:23737, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/31-eb5d41310c156ecde816686054084737-1024-1024.webp", link:"https://www.morashop.ar/productos/suplemento-en-polvo-star-nutrition-platinum-whey-protein-907g/" },
    { nombre:"ZMA Star Nutrition x90 caps", tag:"Descanso · Recuperación", precio:16433, efectivo:13968, cuota3:5478, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/sdd-4fc77a55da63bc4e5716972234143459-640-0.webp", link:"https://www.morashop.ar/productos/zma-star-nutrition-zinc-magnesio-y-vitamina-b6-x-90-capsulas-sabor-sin-sabor/" },
    { nombre:"Animal Pak en Polvo 44 scoops 383g Universal", tag:"Multivitamínico", precio:103455, efectivo:87937, cuota3:34485, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/animal-pak-383g-berries-5030a08388980ae12217597713533198-640-0.webp", link:"https://www.morashop.ar/productos/animal-pak-en-polvo-44-scoops-383-g-universal/" },
    { nombre:"ENA Sport Creatina Micronizada 300g", tag:"Creatina", precio:24694, efectivo:20990, cuota3:8231, img:"https://acdn-us.mitiendanube.com/stores/002/268/228/products/suplemento-en-polvo-ena-sport-creatina-micronizada-300g-sabor-1d2513142816483a1c16965538195786-640-0.webp", link:"https://www.morashop.ar/productos/suplemento-en-polvo-ena-sport-creatina-micronizada-sabor-neutro-en-sachet-de-300g1/" }
  ];

  var VIDEOS = [
    { titulo:"Acepté una PELEA ILEGAL antes de LA VELADA", id:"HzZ5j6Lm8aU" },
    { titulo:"Boxee en la Favela Más Peligrosa de Brasil",  id:"QN4PPPCFX1s" },
    { titulo:"Mi Pelea Más Importante (Párense de Manos)",   id:"3uDP4u8-_hI" },
    { titulo:"Peleé Contra un Campeón Mundial de Boxeo",     id:"fvIVHMDXvgs" }
  ];

  var ARS = function (n) { return "$" + Math.round(n).toLocaleString("es-AR"); };
  var off = function (precio, efectivo) { return Math.round((1 - efectivo / precio) * 100); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" })[c]; }); };

  function renderProductos() {
    var grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = PRODUCTOS.map(function (p, i) {
      var pct = (p.efectivo && p.precio) ? off(p.precio, p.efectivo) : 0;
      var offBadge = pct >= 5 ? '<span class="card__off">' + pct + '% OFF</span>' : "";
      var efectivo = isFinite(p.efectivo) ? p.efectivo : p.precio;
      var ahorro = (isFinite(p.precio) && isFinite(efectivo) && p.precio > efectivo)
        ? '<p class="card__save">Ahorrás ' + ARS(p.precio - efectivo) + '</p>' : "";
      var cuotas = isFinite(p.cuota3)
        ? '<p class="card__inst">o <b>3 cuotas sin interés</b> de ' + ARS(p.cuota3) + '</p>' : "";
      return '' +
        '<article class="card reveal reveal--scale" style="--d:' + (Math.min(i, 8) * 55) + 'ms">' +
          '<a class="card__media" href="' + p.link + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">' +
            '<img src="' + p.img + '" alt="' + esc(p.nombre) + '" loading="lazy" width="640" height="640" />' +
            offBadge +
          '</a>' +
          '<div class="card__body">' +
            '<p class="card__pick"><b>366</b> Elegido por Gero</p>' +
            '<p class="card__tag">' + esc(p.tag) + '</p>' +
            '<h3 class="card__name">' + esc(p.nombre) + '</h3>' +
            '<div class="card__pricing">' +
              '<p class="card__was">' + ARS(p.precio) + '</p>' +
              '<p class="card__price"><b>' + ARS(efectivo) + '</b><em>con efectivo</em></p>' +
              ahorro + cuotas +
            '</div>' +
            '<a class="card__btn" href="' + p.link + '" target="_blank" rel="noopener noreferrer">Comprar' +
              '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</a>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function renderVideos() {
    var grid = document.getElementById("video-grid");
    if (!grid) return;
    var playSVG = '<svg viewBox="0 0 68 48" aria-hidden="true"><path fill="#E8341A" d="M66.5 7.7c-.8-3-2.5-5.3-5.5-6.1C55.5.2 34 .2 34 .2S12.5.2 7 1.6C4 2.4 2.3 4.7 1.5 7.7.1 13.2.1 24 .1 24s0 10.8 1.4 16.3c.8 3 2.5 5.3 5.5 6.1C12.5 47.8 34 47.8 34 47.8s21.5 0 27-1.4c3-.8 4.7-3.1 5.5-6.1C67.9 34.8 67.9 24 67.9 24s0-10.8-1.4-16.3z"/><path fill="#fff" d="M27 34.5 45 24 27 13.5z"/></svg>';
    grid.innerHTML = VIDEOS.map(function (v, i) {
      return '' +
        '<a class="video-card reveal" style="--d:' + (i * 80) + 'ms" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener noreferrer">' +
          '<div class="video-card__thumb">' +
            '<img src="https://img.youtube.com/vi/' + v.id + '/hqdefault.jpg" alt="Video: ' + esc(v.titulo) + '" loading="lazy" width="480" height="360" />' +
            '<span class="video-card__play">' + playSVG + '</span>' +
          '</div>' +
          '<p class="video-card__title">' + esc(v.titulo) + '</p>' +
        '</a>';
    }).join("");
  }

  function fillRail() {
    var track = document.getElementById("rail-track");
    if (!track) return;
    var unit = '<span>366 · La gloria será eterna ·</span>';
    var out = ""; for (var i = 0; i < 16; i++) { out += unit; }
    track.innerHTML = out;
  }

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      if (!("requestAnimationFrame" in window) || !("performance" in window)) { el.textContent = target; return; }
      var dur = 1300, t0 = performance.now();
      var tick = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { Array.prototype.forEach.call(els, run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  function initReveal() {
    var els = document.querySelectorAll(".gero-page .reveal");
    if (!("IntersectionObserver" in window)) { Array.prototype.forEach.call(els, function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  function gInit() { renderProductos(); renderVideos(); fillRail(); initReveal(); initCounters(); }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", gInit); } else { gInit(); }
})();
</script>
