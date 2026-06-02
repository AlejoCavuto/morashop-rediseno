{# ============================================================
   MORASHOP — Límite de cantidad por producto (v3 simple)
   ----------------------------------------------------------------
   Defensa contra órdenes masivas falsas.
   Política: máximo 10 unidades por SKU.

   Esta versión usa SOLO event listeners nativos + reescribe
   directamente las funciones globales LS.plusQuantity y la captura
   click en .js-quantity-up con CAPTURE PHASE (que dispara antes
   que cualquier listener delegado de jQuery).
   ============================================================ #}

<style>
  .mh-qty-toast{
    position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);
    background:#000a28;color:#fff;
    border:1px solid #ff2e10;border-radius:10px;
    padding:14px 20px;
    font-family:"Sora",sans-serif;font-size:14px;font-weight:600;
    box-shadow:0 12px 32px rgba(0,0,0,.45);
    z-index:99999;opacity:0;
    transition:opacity .3s ease, transform .3s ease;
    max-width:90vw;text-align:center;
    pointer-events:none;
  }
  .mh-qty-toast.mh-qty-toast-visible{
    opacity:1;transform:translateX(-50%) translateY(0);
  }
  .mh-qty-toast strong{color:#ff2e10}
</style>

<script>
/* MORASHOP-QTY-LIMIT-V3 */
(function(){
  if (window.__mhQtyV3) return;
  window.__mhQtyV3 = true;

  console.log('%c[Morashop] qty-limit v3 INICIANDO', 'background:#ff2e10;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold');

  var MAX = 10;

  // ----- Toast -----
  var toastEl = null, toastTimer = null;
  function toast(msg){
    if (!toastEl){
      toastEl = document.createElement('div');
      toastEl.className = 'mh-qty-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = msg;
    toastEl.classList.add('mh-qty-toast-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      toastEl.classList.remove('mh-qty-toast-visible');
    }, 3500);
  }

  function clamp(input){
    if (!input) return false;
    var v = parseInt(input.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    if (v > MAX){
      input.value = MAX;
      // Notificar a Tiendanube por si tiene listener
      try{
        input.dispatchEvent(new Event('input', {bubbles:true}));
        input.dispatchEvent(new Event('change', {bubbles:true}));
      }catch(e){}
      return true;
    }
    return false;
  }

  // ============================================================
  // 1) Listener GLOBAL en document, fase CAPTURE
  //    Captura todos los clicks ANTES que jQuery delegado.
  //    Si el target es .js-quantity-up o .js-cart-quantity-btn (el +),
  //    chequeamos si superaría 10 y bloqueamos.
  // ============================================================
  document.addEventListener('click', function(e){
    var t = e.target;
    if (!t) return;

    // Buscar ancestor más cercano que sea botón "+"
    var btn = t.closest && (
      t.closest('.js-quantity-up') ||
      t.closest('.js-cart-quantity-btn[onclick*="plusQuantity"]') ||
      t.closest('[data-component="product.quantity.plus"]') ||
      t.closest('[data-component="quantity.plus"]')
    );
    if (!btn) return;

    // Detectar input asociado:
    // - PDP: .js-quantity ancestral → buscar .js-quantity-input
    // - Carrito: .js-cart-quantity-input cercano (sibling/parent)
    var input = null;
    var qtyContainer = btn.closest('.js-quantity');
    if (qtyContainer){
      input = qtyContainer.querySelector('.js-quantity-input');
    }
    if (!input){
      // Carrito: buscar el input más cercano hacia arriba/lados
      var row = btn.closest('.js-cart-item, [data-item-id], .cart-item, .item-cart, .js-cart-quantity-container');
      if (row) input = row.querySelector('.js-cart-quantity-input, .js-quantity-input, input[type="number"]');
      if (!input){
        // Último intento: input.js-cart-quantity-input que sea hermano del botón
        var sibling = btn.parentElement && btn.parentElement.parentElement;
        if (sibling) input = sibling.querySelector('.js-cart-quantity-input, .js-quantity-input, input[type="number"]');
      }
    }

    if (!input) return;
    var v = parseInt(input.value, 10) || 0;
    if (v >= MAX){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      input.value = MAX;
      toast('Máximo <strong>' + MAX + ' unidades</strong> por producto.');
      return false;
    }
  }, true); // ← CAPTURE PHASE

  // ============================================================
  // 2) Listener en INPUT change/blur — capear si el cliente escribe número
  //    También en fase capture para correr antes que Tiendanube envíe AJAX.
  // ============================================================
  ['change','blur','input'].forEach(function(ev){
    document.addEventListener(ev, function(e){
      var t = e.target;
      if (!t || !t.classList) return;
      if (t.classList.contains('js-quantity-input') || t.classList.contains('js-cart-quantity-input')){
        if (clamp(t)){
          toast('Máximo <strong>' + MAX + ' unidades</strong> por producto.');
        }
      }
    }, true);
  });

  // ============================================================
  // 3) Botón AGREGAR AL CARRITO — capear el input justo antes
  //    de que Tiendanube lea .val() para mandar el AJAX.
  // ============================================================
  document.addEventListener('click', function(e){
    var t = e.target;
    if (!t) return;
    var addBtn = t.closest && (
      t.closest('.js-addtocart:not(.js-addtocart-placeholder)') ||
      t.closest('button[data-component="addtocart"]') ||
      t.closest('input[type="submit"].js-addtocart')
    );
    if (!addBtn) return;
    var container = addBtn.closest('.js-product-container') || document;
    var input = container.querySelector('.js-quantity-input');
    if (input){
      var v = parseInt(input.value, 10) || 1;
      if (v > MAX){
        input.value = MAX;
        try{
          input.dispatchEvent(new Event('change', {bubbles:true}));
        }catch(err){}
        toast('Por seguridad, ajustamos la cantidad a <strong>' + MAX + ' unidades</strong>.');
      }
    }
  }, true);

  // ============================================================
  // 4) Pisar LS.plusQuantity (botón "+" del carrito tiene onclick inline)
  //    Probamos cada 200ms hasta que LS exista (puede tardar en cargar).
  // ============================================================
  var lsAttempts = 0;
  var lsInterval = setInterval(function(){
    lsAttempts++;
    if (window.LS && typeof window.LS.plusQuantity === 'function' && !window.LS.__mhV3Patched){
      window.LS.__mhV3Patched = true;
      var orig = window.LS.plusQuantity;
      window.LS.plusQuantity = function(itemId, fromMini){
        // Buscar el input de esa línea
        var input = document.querySelector('input[name="quantity-' + itemId + '"]')
                 || document.querySelector('.js-cart-quantity-input[data-item-id="' + itemId + '"]');
        if (!input){
          // Fallback: cualquier input del carrito asociado a ese item
          var row = document.querySelector('[data-item-id="' + itemId + '"]');
          if (row) input = row.querySelector('.js-cart-quantity-input, input[type="number"]');
        }
        if (input){
          var v = parseInt(input.value, 10) || 0;
          if (v >= MAX){
            toast('Máximo <strong>' + MAX + ' unidades</strong> por producto.');
            return;
          }
        }
        return orig.apply(this, arguments);
      };
      console.log('%c[Morashop] LS.plusQuantity patcheado', 'color:#ff2e10;font-weight:bold');
      clearInterval(lsInterval);
    } else if (lsAttempts > 100){
      // Después de 20s damos up
      clearInterval(lsInterval);
      console.warn('[Morashop] LS.plusQuantity no apareció. El botón + del carrito puede no estar protegido por capa 4.');
    }
  }, 200);

  // ============================================================
  // 5) Botón "Iniciar compra" — bloqueo final si algo se escapó.
  //    NOTA: las capas 1-4 ya impiden que el carrito tenga >10.
  //    Esta capa es solo un "last resort". La movemos al evento
  //    SUBMIT del form padre (no al click del input) para no
  //    interferir con el flujo nativo de Tiendanube en mobile.
  // ============================================================
  document.addEventListener('submit', function(e){
    var form = e.target;
    if (!form || !form.querySelector) return;
    // Solo nos interesan forms que tengan el botón go_to_checkout
    var goBtn = form.querySelector('input[name="go_to_checkout"], button[name="go_to_checkout"]');
    if (!goBtn) return;
    var inputs = document.querySelectorAll('.js-cart-quantity-input, input[name^="quantity-"]');
    var bad = 0;
    inputs.forEach(function(inp){
      var v = parseInt(inp.value, 10) || 0;
      if (v > MAX) bad = v;
    });
    if (bad > 0){
      e.preventDefault();
      e.stopPropagation();
      toast('Tenés un producto con <strong>' + bad + ' unidades</strong>. Reducilo a <strong>' + MAX + '</strong> para continuar.');
      return false;
    }
    // Si todas las cantidades son ≤10, dejamos pasar el submit normalmente
  }, false); // ← NO capture, deja al form correr su flujo nativo primero

  console.log('%c[Morashop] qty-limit v3 LISTO max=' + MAX, 'background:#047857;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold');
})();
</script>

{# ============================================================
   MORASHOP — Aclaración "Envío en el día"
   ----------------------------------------------------------------
   Agrega "⚡ Llega en el día comprando antes de las 10hs"
   debajo del nombre de la opción de envío "En el día" (Caba y Gba).
   Para el resto de los métodos (Correo, Andreani, etc.) no toca.
   ============================================================ #}
<style>
  .mh-ship-sameday-note{
    display:flex;align-items:center;gap:6px;
    margin-top:4px;
    font-family:"Sora",sans-serif;
    font-size:11.5px;font-weight:700;
    color:#047857;
    line-height:1.3;
    letter-spacing:.01em;
  }
  .mh-ship-sameday-note svg{
    width:13px;height:13px;flex-shrink:0;
    color:#047857;
  }
</style>
<script>
(function(){
  if (window.__mhSameDayInit) return;
  window.__mhSameDayInit = true;

  // No mostrar la nota los sábados (6) y domingos (0) — no hay envío en el día
  // los fines de semana en Argentina.
  function esFinDeSemana(){
    var d = new Date().getDay();
    return d === 0 || d === 6;
  }

  // Detecta el CP actual mostrado en el carrito (varios fallbacks porque
  // Toluca lo expone en distintos lugares según el flow).
  function getCurrentCP(){
    var sources = [
      document.querySelector('.js-shipping-calculator-zipcode'),
      document.querySelector('input[name="zipcode"]'),
      document.querySelector('input#zipcode'),
      document.querySelector('[data-zipcode]')
    ];
    for (var i = 0; i < sources.length; i++){
      var el = sources[i];
      if (!el) continue;
      var v = el.value || el.getAttribute('data-zipcode') || el.textContent || '';
      v = v.replace(/\D/g, ''); // dejar solo dígitos
      if (v.length >= 4) return v;
    }
    // Buscar texto tipo "Entregas para el CP: 1884"
    var txt = document.body.innerText || '';
    var m = txt.match(/CP:?\s*(\d{4,5})/i);
    if (m) return m[1];
    return null;
  }

  // CABA/GBA: rangos 1000-1899 (Argentina). CP del interior arrancan con
  // otros dígitos (2xxx Córdoba/Norte, 5xxx Mendoza/Centro, etc.) o
  // tienen letras (B17xx). Para el caso "Caba y Gba" alcanza con CP
  // numérico iniciando en 1xxx.
  function esCabaOGba(cp){
    if (!cp) return true; // si no podemos determinar, asumimos sí (no romper)
    var n = parseInt(cp, 10);
    if (isNaN(n)) return true;
    // 1000-1899 son CABA y GBA. Bxxxx es BA provincia (incluye GBA extendido).
    return n >= 1000 && n <= 1899;
  }

  // Texto que aparecerá debajo de la opción "Envío en el día"
  var NOTE_HTML =
    '<div class="mh-ship-sameday-note">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>' +
      '</svg>' +
      '<span>Llega en el día comprando antes de las 10hs</span>' +
    '</div>';

  // Matchea variaciones del nombre: "en el día", "envio en el dia", etc.
  function isSameDay(text){
    if (!text) return false;
    var t = text.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, ''); // saca tildes
    return t.indexOf('en el dia') !== -1;
  }

  function injectNotes(){
    var cp = getCurrentCP();
    // Casos en los que NO mostramos la nota:
    // 1) Es sábado o domingo
    // 2) El CP no es de CABA/GBA (1000-1899)
    if (esFinDeSemana() || !esCabaOGba(cp)){
      document.querySelectorAll('.mh-ship-sameday-note').forEach(function(el){ el.remove(); });
      return;
    }
    var optionNames = document.querySelectorAll('[data-component="option.name"]');
    optionNames.forEach(function(nameEl){
      if (!isSameDay(nameEl.textContent)) return;
      // El subtítulo va dentro del mismo .col font-small, después de
      // option.name (y después de option.date si existe).
      var parent = nameEl.parentElement;
      if (!parent) return;
      // Evitar duplicar
      if (parent.querySelector('.mh-ship-sameday-note')) return;
      // Insertar después del último child relevante (option.date si está)
      var dateEl = parent.querySelector('[data-component="option.date"]');
      var anchor = dateEl || nameEl;
      var temp = document.createElement('div');
      temp.innerHTML = NOTE_HTML;
      anchor.parentNode.insertBefore(temp.firstChild, anchor.nextSibling);
    });
  }

  // Primera pasada
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectNotes);
  } else {
    injectNotes();
  }

  // Tiendanube re-renderiza el listado cuando cambia el CP, hay que re-inyectar
  if (window.MutationObserver){
    var t = null;
    new MutationObserver(function(){
      clearTimeout(t);
      t = setTimeout(injectNotes, 250);
    }).observe(document.body, { childList:true, subtree:true });
  }

  console.log('%c[Morashop] same-day note injection LISTO', 'background:#047857;color:#fff;padding:4px 8px;border-radius:4px;font-weight:bold');
})();
</script>
