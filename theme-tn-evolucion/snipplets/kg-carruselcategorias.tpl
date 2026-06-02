<section class="container py-4">
  <h2 class="titulo-cats">Nuestras categorías</h2>
  <div class="cats-carrusel-container">
    <button class="cats-btn izq" style="display:none;">‹</button>
    <div class="cats-track-wrapper">
        <div class="cats-track cols-4">
        {% for c in categorias %}
            <a href="{{ c.link }}" class="cat-item" title="{{ c.nombre }}">
            <img src="{{ c.img }}" alt="{{ c.nombre }}" class="cat-img" />
            <span class="cat-nombre">{{ c.nombre }}</span>
            </a>
        {% endfor %}
        </div>
    </div>
    <button class="cats-btn der" style="display:none;">›</button>
  </div>
</section>


<style>
.cats-wrapper{display:flex;align-items:center;gap:16px}
.titulo-cats{font-size:18px;font-weight:700;color:#000e35;text-align:center;margin-bottom:16px;min-width:auto}
.cats-carrusel-container{position:relative;flex:1;display:flex;align-items:center;overflow:hidden}
.cats-track-wrapper{overflow-x:auto;width:100%;max-width:100%;scrollbar-width:none;-ms-overflow-style:none}
.cats-track-wrapper::-webkit-scrollbar{display:none}
.cats-track{display:flex;align-items:flex-start;gap:20px;padding:0 40px;box-sizing:border-box}

.cat-item{flex:0 0 auto;width:110px;text-align:center;text-decoration:none;color:#0b1320}
.cat-img{width:88px;height:88px;border-radius:50%;border:1px solid #e2e2e2;object-fit:cover;display:block;margin:0 auto 8px;background:#fff}
.cat-nombre {
  display:block;
  font-size:13px;
  line-height:1.2;
  max-width:100%;
  white-space:normal;   /* permite saltos */
  overflow:hidden;
  text-overflow:unset;  /* quita los puntos suspensivos */
  display:-webkit-box;  
  -webkit-line-clamp:2; /* máximo 2 líneas */
  -webkit-box-orient:vertical;
}


.cats-btn{background:#fff;border:1px solid #000e35;font-size:28px;font-weight:700;color:#000e35;
  cursor:pointer;position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:36px;height:36px;
  display:flex;align-items:center;justify-content:center;border-radius:50%}
.cats-btn.izq{left:0}
.cats-btn.der{right:0}

/* móvil */
@media (max-width:768px){
  .cats-track{gap:12px;padding:0 12px}
  .cats-track.cols-4 .cat-item{
    flex:0 0 calc((100% - 3*12px)/4);
    max-width:calc((100% - 3*12px)/4);
  }
  .cat-img{width:72px;height:72px}
}




.cats-btn{ z-index: 10; }


/* Centrar los ítems en desktop */
@media (min-width:769px){
  .cats-track {
    justify-content: left;
  }
}


</style>

<script>
(function(s){
  // Buscar el <section> anterior, saltando <style> u otros nodos
  let root = s.previousElementSibling;
  while (root && root.tagName && root.tagName.toLowerCase() === 'style') {
    root = root.previousElementSibling;
  }
  if(!root) return;

  const wrap = root.querySelector(".cats-track-wrapper");
  const left = root.querySelector(".cats-btn.izq");
  const right= root.querySelector(".cats-btn.der");
  if(!wrap||!left||!right) return;

  const STEP = 160;

  function check(){
    const hasOverflow = wrap.scrollWidth > wrap.clientWidth + 1;
    left.style.display = right.style.display = hasOverflow ? "flex" : "none";
  }

  left.addEventListener("click", ()=> wrap.scrollBy({left:-STEP, behavior:"smooth"}));
  right.addEventListener("click",()=> wrap.scrollBy({left: STEP, behavior:"smooth"}));

  // medir al redimensionar y tras cargar imágenes
  window.addEventListener("resize", check);
  window.addEventListener("load", check);
  check();

  // drag / swipe
  let down=false, startX=0, startScroll=0;
  const start = x => { down=true; startX=x; startScroll=wrap.scrollLeft; };
  const move  = x => { if(!down) return; wrap.scrollLeft = startScroll - (x - startX); };
  const end   = ()=> down=false;

  wrap.addEventListener("mousedown", e=> start(e.clientX));
  window.addEventListener("mousemove", e=> move(e.clientX));
  window.addEventListener("mouseup", end);

  wrap.addEventListener("touchstart", e=> start(e.touches[0].clientX), {passive:true});
  wrap.addEventListener("touchmove",  e=> move(e.touches[0].clientX),  {passive:true});
  wrap.addEventListener("touchend", end);
})(document.currentScript);
</script>

