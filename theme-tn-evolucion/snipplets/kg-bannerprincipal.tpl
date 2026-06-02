<section class="container my-4 kg-bannerprincipal">
  {% if banner_url %}
    <a href="{{ banner_link }}" target="_blank" class="bannerprincipal-desktop">
      <img src="{{ banner_url }}" alt="Banner Principal Desktop" />
    </a>
  {% endif %}

  {% if banner_url_mobile and banner_url_mobile != 'null' %}
    <a href="{{ banner_link }}" target="_blank" class="bannerprincipal-mobile bannerprincipal-mobile-img">
      <img src="{{ banner_url_mobile }}" alt="Banner Principal Mobile" />
    </a>
  {% else %}
    <div class="bannerprincipal-mobile">
      <div class="beneficios-wrapper">
        <button class="carrusel-btn left" type="button" aria-label="Anterior" onclick="moverBeneficios(this,-1)">‹</button>
        <div class="beneficios-carrusel" id="beneficiosCarrusel">
          <div class="beneficio-item">
            <div class="beneficio-icon">🚚</div>
            <h3 class="beneficio-titulo">ENTREGAS EN EL DÍA</h3>
            <ul class="beneficio-desc">
              <li>Comprando antes de las 10hs.</li>
              <li>Devolución sin cargo.</li>
            </ul>
          </div>
          <div class="beneficio-item">
            <div class="beneficio-icon">💰</div>
            <h3 class="beneficio-titulo">DESCUENTOS</h3>
            <ul class="beneficio-desc">
              <li>15% OFF en Efectivo.</li>
              <li>5% OFF con Transferencia.</li>
            </ul>
          </div>
          <div class="beneficio-item">
            <div class="beneficio-icon">📦</div>
            <h3 class="beneficio-titulo">ENVÍO GRATIS</h3>
            <ul class="beneficio-desc">
              <li>CABA/GBA superando los $30.000.</li>
              <li>INTERIOR superando los $50.000.</li>
            </ul>
          </div>
          <div class="beneficio-item">
            <div class="beneficio-icon">💳</div>
            <h3 class="beneficio-titulo">CUOTAS SIN INTERÉS</h3>
            <ul class="beneficio-desc">
              <li>3 Cuotas en TODA la tienda.</li>
            </ul>
          </div>
        </div>
        <button class="carrusel-btn right" type="button" aria-label="Siguiente" onclick="moverBeneficios(this,1)">›</button>
      </div>
    </div>
  {% endif %}
</section>

<style>
.bannerprincipal-desktop { display:block; }
.bannerprincipal-desktop img { width:100%; border-radius:12px; display:block; }
.bannerprincipal-mobile { display:none; }

@media (max-width:768px) {
  .bannerprincipal-desktop { display:none; }
  .bannerprincipal-mobile { display:block; }

  /* === SOLO imagen mobile === */
  .bannerprincipal-mobile-img img {
    width:100%;
    border-radius:12px;
    display:block;
  }

  /* === SOLO carrusel de beneficios === */
  .beneficios-wrapper { position:relative; }
  .beneficios-carrusel {
    background:#001c4b; color:#fff; display:flex;
    overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch;
    gap:3px; padding:3px; border-radius:12px; scroll-behavior:smooth;
    position:relative; z-index:1;
  }
  .beneficio-item {
    flex:0 0 75%; scroll-snap-align:center; background:#001c4b;
    border:2px solid #ff0e0d; border-radius:12px; padding:5px; text-align:center;
  }

  .beneficio-icon{font-size:32px; margin-bottom:10px;}
  .beneficio-titulo{font-size:18px; font-weight:bold; margin:5px 0 10px 0;}
  .beneficio-desc{font-size:14px; line-height:1.4; list-style:none; padding-left:0; text-align:center; margin:0;}
  .beneficio-desc li{margin-bottom:6px; position:relative; padding-left:14px; display:inline-block;}
  .beneficio-desc li::before{content:"●"; color:#ff0e0d; position:absolute; left:0;}

  .carrusel-btn{
    position:absolute; top:50%; transform:translateY(-50%); z-index:2;
    background:rgba(0,0,0,.35); border:0; color:#fff; width:36px; height:36px;
    font-size:28px; line-height:1; border-radius:50%; display:flex; align-items:center; justify-content:center;
    cursor:pointer; pointer-events:auto;
  }
  .carrusel-btn.left{ left:8px; }
  .carrusel-btn.right{ right:8px; }
}
</style>


<script>
function moverBeneficios(btn, dir){
  const wrapper = btn.closest('.beneficios-wrapper');
  if(!wrapper) return;
  const carrusel = wrapper.querySelector('.beneficios-carrusel');
  const items = carrusel ? carrusel.querySelectorAll('.beneficio-item') : [];
  if(!carrusel || !items.length) return;

  // gap real desde CSS (fallback 16)
  const cs = getComputedStyle(carrusel);
  const gap = parseFloat(cs.gap || '16') || 16;

  const step = items[0].getBoundingClientRect().width + gap;

  carrusel.scrollBy({
    left: dir * step,
    behavior: 'smooth'   // animación suave
  });
}
</script>
