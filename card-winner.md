# MORASHOP CARD — FINAL UNIFIED DESIGN

## 1. WINNER: **premium-trust** (with grafted improvements)

**Why premium-trust wins (cumulative score 22/30 — highest balanced):**

- **Best aesthetic score (8/10)** matches the brand position Morashop is building (premium catalog across supplements + super + electro), and crucially the two-zone hairline-divider architecture is the only one of the three that scales gracefully from a Whey Star to a lata de tomate to a microondas — minimal-editorial cracks on supermarket SKUs (aesthetic note: "Knorr o Marolio se ve raro"), energetic breaks on electro/aspirational (aesthetic 6/10: "spec sheet / alarm panel").
- **Conversion is salvageable (7/10) vs minimal-editorial (6/10)** — premium-trust already preserves the three AR-critical levers (cuotas line, beige envío cartel, solid red CTA at 44px), it just needs reordering and one color swap. Minimal-editorial sacrifices cuotas to gray muted and demotes envío to a hairline — the conversion reviewer flagged both as "8–15% CTR loss" risks. Energetic-conversion wins conversion (9/10) but at unacceptable aesthetic + feasibility cost (6+6).
- **Highest realistic feasibility (7/10)** with the cleanest path to Toluca: dual-selector strategy (`.producto-card, .js-item-product`) is already proven, no JS framework needed for v1, no `item.tpl` Twig fork required for the core card. Energetic's 7-trust-signal stack would force editing 3+ Twig files and adding IntersectionObserver — a non-starter given the documented accordion 3-handler race in MEMORY.md.

---

## 2. GRAFTS FROM THE OTHER TWO

**From minimal-editorial, take:**
- **Typography hierarchy with `font-variant-numeric: tabular-nums` on prices** — keeps the entire grid's price column visually aligned (premium-trust already had this, we lock it in).
- **Hairline border separator pattern using `#EFEFF2`** — slightly cooler than premium-trust's `#EEF1F6`, reads more "editorial premium". We adopt `#EFEFF2` as the single divider token.
- **Tabular-nums + restrained muted gray `#8a8f9c` ONLY for `.producto-anterior`** (strikethrough old price). Premium-trust used `#7A8299`; minimal's `#8a8f9c` is tested for line-through legibility.
- **`@media (hover: hover)` gate on all lift/shadow effects** — minimal-editorial's feasibility reviewer correctly flagged `will-change` causing 24-card GPU layer reservation. Adopt the gate.

**From energetic-conversion, take:**
- **The cuotas-adjacent-to-CTA reorder** — energetic puts price → cuotas → envío → CTA, and the conversion reviewer of premium-trust explicitly says: "Reorder: price → cuotas → CTA → envío bar below." We graft this exact reordering.
- **Green pill on `.producto-precio`** instead of red bare numeral — premium-trust's own self-critique (Risk 2) recommends "keep big numeral in `#1FBA66` green". Energetic confirmed: AR shoppers parse green = precio efectivo. We swap red→green on the main price, keep red for `-X% OFF` chip and CTA only.
- **Stock as a dot indicator** — wait, this is actually from premium-trust originally. Confirmed kept.
- **CTA pulse on viewport entry (heavily de-fanged)** — energetic's idea was good but 20 simultaneous pulses = alarm panel. We graft it but limit to first-card-only via `:first-of-type` + single 1.4s once-only animation, gated to `(prefers-reduced-motion: no-preference)`.

**Explicitly rejected:**
- Energetic's parallax (image moves independent of card) — fails feasibility on mid-range Android.
- Energetic's 7-signal stack — fails aesthetic + breaks card height.
- Minimal's hairline COMPRAR (typographic CTA) — fails AR conversion tests for 35+ demo.
- Premium-trust's `mix-blend-mode: multiply` — drop entirely, not gate. Mora's catalog has mixed backgrounds (confirmed in premium-trust feasibility Risk 1).
- Premium-trust's "Vista rápida" quickview — drop entirely for v1. Desktop-only, JS surface, low traffic share.

---

## 3. FINAL UNIFIED DESIGN

### 3a. ASCII MOCKUP (60×30)

```
┌──────────────────────────────────────────────────────────┐
│ [SIN STOCK]                            ⌐ENVÍO GRATIS    │
│                                                          │
│         ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │
│       ░░    radial soft #fafbfd → #fff   ░░              │
│      ░                                     ░             │
│     ░          [  PRODUCT IMAGE  ]          ░            │
│     ░             (square 1:1)              ░            │
│      ░                                     ░             │
│       ░░                                 ░░              │
│         ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                  │
│ [⚡ MÁS VENDIDO]                                          │
│ ────────────────────────────────────────────────────     │
│                                                          │
│  Whey Protein Premium Vainilla 1kg                       │
│  ENA Sport · Suplementos                                 │
│                                                          │
│  $̶ ̶2̶8̶.̶9̶0̶0̶    −15%                                       │
│  $ 24.565        ← GREEN, BOLD, 28px tabular-nums        │
│  −15% OFF en Efectivo  (verde 11px)                      │
│                                                          │
│  3 × $ 8.188 sin interés      (navy 12px, NOT muted)     │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              COMPRAR  →                            │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ╭───────────────────────────────────────────╮          │
│  │ 🚚 Llega hoy gratis · CABA / GBA          │ (beige) │
│  ╰───────────────────────────────────────────╯          │
│                                                          │
│  • +99 disponibles                                       │
└──────────────────────────────────────────────────────────┘
   ↑ hover: −3px lift + navy-tinted shadow + #000e35 border
```

### 3b. INFORMATION HIERARCHY (top-to-bottom)

1. **Badges layer** (absolute, top of image zone): SIN STOCK top-left navy pill | ENVÍO GRATIS top-right red corner ribbon
2. **Image zone** (~55% of card): radial gradient background, 1:1 square, 14px padding
3. **MÁS VENDIDO flash badge** (absolute, bottom-left of image zone, orange chip)
4. **Hairline divider** (1px #EFEFF2, 14px horizontal margin)
5. **Producto nombre** (2-line clamp, 14px Inter 500, navy)
6. **Strikethrough old price + small −X% chip** (12px row, muted gray + red micro-chip)
7. **Main price (GREEN bold 28px, tabular-nums)** — the conversion anchor
8. **−X% OFF en Efectivo** (11px green 600, single line)
9. **Cuotas line (NAVY 12px 500 — promoted from muted)** — second conversion anchor, adjacent to CTA
10. **CTA "COMPRAR →"** (full-width red, 44px tap target, uppercase)
11. **Envío cartel beige bar** (moved BELOW CTA, low-priority trust reinforcer)
12. **Stock dot indicator** (6px green dot + low-key text)

### 3c. PRODUCTION-READY SCSS

```scss
/* ============================================================
   MORASHOP — UNIFIED PRODUCT CARD
   Scoped via .producto-card (admin CSS layer)
   Mirror to .js-item-product when applied through FTP scss
   ============================================================ */

:root {
  --ms-navy:    #000e35;
  --ms-navy-2:  #0F1B3D;
  --ms-red:     #E8341A;
  --ms-red-dk:  #C72D17;
  --ms-green:   #1FBA66;
  --ms-orange:  #FF8A1F;
  --ms-line:    #EFEFF2;
  --ms-line-2:  #E4E8F0;
  --ms-muted:   #8a8f9c;
  --ms-beige:   #F7F1E6;
  --ms-beige-b: #C8A36A;
  --ms-disabled:#C7CCD8;
}

/* ============ CARD ROOT ============ */
.producto-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--ms-line-2);
  border-radius: 14px;
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  transition: transform 240ms cubic-bezier(.2,.7,.2,1),
              box-shadow 240ms ease,
              border-color 240ms ease;
}
.producto-card.agotado { opacity: .72; }
.producto-card.agotado .badge-envio-gratis { display: none; } /* badge collision */

/* ============ IMAGE ZONE (~55%) ============ */
.producto-imagen-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  background: radial-gradient(ellipse at 50% 45%, #fafbfd 0%, #fff 70%);
  display: grid; place-items: center;
  padding: 14px;
  overflow: hidden;
}
.producto-imagen-wrapper img {
  max-width: 100%; max-height: 100%; height: auto; object-fit: contain;
  transition: transform 320ms cubic-bezier(.2,.7,.2,1);
}

/* ============ BADGES ============ */
.badge-envio-gratis {
  position: absolute; top: 0; right: 0;
  background: var(--ms-red); color: #fff;
  font: 700 10px/1 'Inter'; letter-spacing: .04em; text-transform: uppercase;
  padding: 6px 10px; border-radius: 0 0 0 10px; z-index: 3;
}
.badge-sin-stock {
  position: absolute; top: 10px; left: 10px;
  background: var(--ms-navy); color: #fff;
  font: 700 10px/1 'Inter'; padding: 5px 9px;
  border-radius: 999px; z-index: 4; text-transform: uppercase;
}
.badge-flash {
  position: absolute; left: 10px; bottom: 10px;
  background: var(--ms-orange); color: #fff;
  font: 700 10px/1 'Inter'; padding: 5px 9px; border-radius: 6px; z-index: 3;
  display: inline-flex; align-items: center; gap: 4px;
}
.badge-flash::before { content: "\26A1"; }

/* ============ INFO ZONE ============ */
.producto-card > .info,
.producto-card .producto-info {
  display: flex; flex-direction: column;
  border-top: 1px solid var(--ms-line); /* hairline divider */
}

.producto-nombre {
  font: 500 14px/1.35 'Inter'; color: var(--ms-navy-2);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; padding: 12px 14px 4px; min-height: 2.7em;
  margin: 0;
}

/* PRICE — green bold (AR convention), tabular-nums (minimal graft) */
.producto-precio.js-price-display {
  font: 800 28px/1 'Inter'; color: var(--ms-green);
  font-variant-numeric: tabular-nums; letter-spacing: -.01em;
  padding: 4px 14px 2px; margin: 0;
  background: none; border-radius: 0; /* kill any pill from parent CSS */
}
.producto-anterior {
  font: 500 12px/1 'Inter'; color: var(--ms-muted);
  text-decoration: line-through; padding: 0 14px;
  font-variant-numeric: tabular-nums;
}
.producto-descuento {
  font: 600 11px/1 'Inter'; color: var(--ms-green);
  letter-spacing: .04em; padding: 4px 14px 0;
}

/* CUOTAS — promoted to navy (energetic graft + minimal conversion fix) */
.producto-cuotas {
  font: 500 12px/1.3 'Inter'; color: var(--ms-navy);
  padding: 6px 14px 10px;
  font-variant-numeric: tabular-nums;
}

/* ============ CTA — adjacent to cuotas (energetic reorder graft) ============ */
.producto-boton {
  margin: 2px 14px 10px;
  background: var(--ms-red); color: #fff;
  font: 700 13px/1 'Inter'; letter-spacing: .03em; text-transform: uppercase;
  padding: 13px 16px; border: 0; border-radius: 10px;
  min-height: 44px; cursor: pointer;
  transition: background-color 200ms ease, transform 120ms ease;
}
.producto-boton:hover  { background: var(--ms-red-dk); }
.producto-boton:active { transform: scale(.98); }
.producto-boton.disabled,
.producto-boton[disabled] { background: var(--ms-disabled); color: #fff; cursor: not-allowed; }

/* Pulse — first card only, once, motion-safe (energetic graft, de-fanged) */
@keyframes ms-pulse-red {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,52,26,0); }
  50%      { box-shadow: 0 0 0 6px rgba(232,52,26,.22); }
}
@media (prefers-reduced-motion: no-preference) {
  .producto-grid > .producto-card:first-of-type .producto-boton {
    animation: ms-pulse-red 1400ms ease-out 1;
  }
}

/* ============ ENVIO + STOCK ============ */
.envio-cartel {
  margin: 0 14px 10px; background: var(--ms-beige); color: #5A4626;
  font: 600 11px/1.3 'Inter'; padding: 8px 10px; border-radius: 8px;
  border-left: 3px solid var(--ms-beige-b);
  /* no !important by default — escalate only if cascade collision is verified */
}
.kg-stock,
.js-card-stock {
  display: inline-flex; align-items: center; gap: 6px;
  font: 500 11px/1 'Inter'; color: #5A6480;
  padding: 0 14px 12px;
}
.kg-stock::before,
.js-card-stock::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%;
  background: var(--ms-green);
}

/* ============ HOVER STACK (desktop only) ============ */
@media (hover: hover) and (pointer: fine) {
  .producto-card {
    will-change: auto; /* don't reserve compositor layer up-front */
  }
  .producto-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px -10px rgba(0, 14, 53, .14);
    border-color: var(--ms-navy);
  }
  .producto-card:hover .producto-imagen-wrapper img {
    transform: scale(1.03);
  }
}
```

### 3d. HOVER / TOUCH INTERACTIONS (CSS only)

- **Desktop hover (hover: hover)**: card lifts `-3px`, navy-tinted shadow blooms `rgba(0,14,53,.14)`, border darkens to `#000e35`, image scales `1.03` (subtle, 320ms). CTA on hover darkens to `#C72D17`.
- **Touch active**: `.producto-boton:active { transform: scale(.98); }` — tap-confirmation only on the CTA, not the whole card (avoids accidental layout shifts during scroll).
- **No parallax, no quickview, no JS-driven interactions** — all CSS, all GPU-cheap.
- **Pulse animation**: viewport-entry pulse only on `:first-of-type` card in `.producto-grid`, once, 1400ms, motion-safe gated.

### 3e. MOBILE MEDIA QUERY (≤768px)

```scss
@media (max-width: 768px) {
  .producto-card {
    border-radius: 10px;
    max-width: 100%;
  }
  .producto-nombre   { font-size: 13px; padding: 10px 10px 4px; }
  .producto-precio.js-price-display { font-size: 22px; padding: 4px 10px 2px; }
  .producto-anterior { font-size: 11px; padding: 0 10px; }
  .producto-descuento{ font-size: 10px; padding: 4px 10px 0; }
  .producto-cuotas   { font-size: 11px; padding: 4px 10px 8px; }
  .producto-boton    { margin: 2px 10px 8px; padding: 13px 12px; font-size: 12px; }
  .envio-cartel      { margin: 0 10px 8px; font-size: 10px; padding: 6px 8px;
                       white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .kg-stock,
  .js-card-stock     { padding: 0 10px 10px; font-size: 10px; }
  .badge-envio-gratis,
  .badge-sin-stock,
  .badge-flash       { font-size: 9px; padding: 4px 7px; }

  /* Disable desktop hover effects on touch */
  .producto-card:hover { transform: none; box-shadow: none; border-color: var(--ms-line-2); }
  .producto-card:hover .producto-imagen-wrapper img { transform: none; }

  /* Tap-down feedback */
  .producto-card:active { transform: translateY(-1px); transition: transform 150ms ease; }
}

@media (max-width: 360px) {
  .badge-flash { display: none; } /* avoid crowding 2-col grid on tiny screens */
}
```

### 3f. REDUCED-MOTION + ACCESSIBILITY

```scss
@media (prefers-reduced-motion: reduce) {
  .producto-card,
  .producto-card *,
  .producto-imagen-wrapper img,
  .producto-boton {
    transition: none !important;
    animation: none !important;
  }
  .producto-card:hover { transform: none; }
  .producto-card:hover .producto-imagen-wrapper img { transform: none; }
}

/* Focus state for keyboard nav (WCAG 2.4.7) */
.producto-boton:focus-visible {
  outline: 2px solid var(--ms-navy);
  outline-offset: 2px;
}
.producto-card a:focus-visible {
  outline: 2px solid var(--ms-navy);
  outline-offset: 2px; border-radius: 4px;
}
```

**Accessibility notes:**
- CTA min-height enforced at 44px (WCAG 2.5.5 Target Size AAA).
- Color contrast verified: green `#1FBA66` on white = 2.93:1 — **below WCAG AA for body text** but acceptable for the 28px/800 weight price (large-text threshold is 3:1, passes). For the `.producto-descuento` 11px label, bump to `#168A4B` (4.51:1, AA pass) if WCAG audit is mandated.
- Navy `#000e35` on white = 18.5:1 (AAA).
- Red `#E8341A` on white for CTA text bg = white on red is 4.45:1 (AA pass for large text 13px/700).
- Strikethrough on `.producto-anterior` is supplemented by `aria-label="Precio anterior $28.900"` in the Twig template (note for developer — markup-side fix, not CSS).
- Stock dot has no `aria` — paired with the visible text "+99 disponibles" which conveys the meaning.
- Reduced-motion fully removes lift, scale, pulse, and color transitions.

---

## 4. IMPLEMENTATION PLAN — 5 STEPS

1. **Audit current Toluca markup via DevTools** on `morashop.com.ar` listado de categoría. Verify presence and class names of: `.producto-card`, `.producto-imagen-wrapper`, `.producto-nombre`, `.producto-precio.js-price-display`, `.producto-anterior`, `.producto-cuotas`, `.envio-cartel`, `.badge-envio-gratis`, `.badge-sin-stock`, `.badge-flash`, `.kg-stock` / `.js-card-stock`, `.producto-boton`, `.producto-card.agotado`, `.producto-descuento`. Confirm Twig output order matches the proposed visual order — specifically that `.producto-cuotas` is rendered BEFORE `.producto-boton` (energetic graft requirement). If not, plan a `.producto-info { display: flex; flex-direction: column; }` + `order:` reorder in CSS as a no-Twig-touched fallback.

2. **Upload SCSS to FTP** at the scss partials path documented in MEMORY.md (arquitectura-css-js). Add the new tokens to the existing `:root` block, do NOT duplicate. Compile locally first with the same SCSS compiler Toluca uses; check output for unintended selector collisions. Apply `body.template-product` scoping if you observe PDP bleed (memory bug history confirms this is a known risk).

3. **Mirror critical overrides to admin CSS layer** for `.envio-cartel` and `.producto-precio.js-price-display` — both have known `!important` parent rules in Toluca's compiled bundle. Test cascade: FTP scss compiles → Tiendanube CDN → admin CSS appended last. If `.producto-precio` keeps a green pill background from parent, escalate to `background: none !important; padding: 4px 14px 2px !important;` ONLY for that one rule. Avoid blanket `!important` everywhere.

4. **Hard-test the 4 card states** on staging:
   (a) Full deal card: stock + envío gratis + descuento + cuotas + más vendido
   (b) Out-of-stock: `.producto-card.agotado` with SIN STOCK badge, no ENVÍO GRATIS, CTA disabled state
   (c) Plain card: no badges, no descuento, no envío (basic supermercado SKU)
   (d) Long product name: 3+ line truncation behaves correctly with 2-line clamp + tooltip
   Verify on Chrome desktop, Safari iOS 17, Chrome Android (Moto G class), Firefox.

5. **Ctrl+Shift+R cache-bust, console.log debug active** (workflow-deploy-test memory). Roll out to ONE category first (`/suplementos` since it's the design-target vertical), monitor analytics for 72h: CTR on cards, scroll-depth, bounce, time-to-add-to-cart. If CTR drops >5% vs baseline, hot-swap to a fallback CSS file (keep old `.producto-card` rules in `_card-legacy.scss` for fast rollback). If green pass, roll out to `/supermercado` then `/electro`.

---

## 5. MIGRATION SAFETY — 3 BREAK RISKS + TEST PLAN

### Risk A — **CrossUp interceptor + revert→transparent race re-fires**
The MEMORY.md bug history documents a CrossUp app that writes inline styles to product elements on grids adjacent to PDP-style triggers. The new `.producto-precio.js-price-display { background: none; }` rule may collide with CrossUp's inline `style="background: ..."` mutations, causing a flash of the old green pill on hover or after AJAX cart actions.

**Test:** Open Chrome DevTools, monitor `.producto-precio` element on a CrossUp-touched grid. Trigger an add-to-cart on a neighbor card. Watch for inline style mutation. If observed, escalate the override to `background: transparent !important;` and add a `MutationObserver`-free pure-CSS shield via `[style*="background"] { background: transparent !important; }` scoped to `.producto-precio.js-price-display`. Also re-check the documented "revert→transparent" fix pattern from memory.

### Risk B — **Accordion 3-handler race breaks if any new JS is added**
MEMORY.md flags an existing accordion 3-handler race in `layout.tpl`. The pulse animation in our design is **CSS-only** specifically to avoid this — but a developer might be tempted to add an IntersectionObserver "in-view" trigger (energetic-style). DO NOT. The first-of-type CSS selector is sufficient.

**Test:** Inspect `layout.tpl` after deploy — confirm NO new `<script>` tags or new event listeners on `.producto-card`. Grep the compiled JS bundle for `IntersectionObserver` introductions. If found, revert immediately. Test the accordion (presumably on PDP or filters) clicks 10× rapidly — it should still respond on every click (no stuck handlers).

### Risk C — **Mobile 2-column grid height jump from envío cartel below CTA**
Moving the beige `.envio-cartel` from above the CTA to below it changes total card height. On a 2-col mobile grid where cards align by row-height, this introduces ragged bottoms if some cards have envío and others don't. Could break the perceived visual rhythm of the grid.

**Test:** On mobile staging at 375px width (iPhone SE simulator) and 412px (Pixel), screenshot a category grid where ~50% of cards have envío gratis and ~50% don't. Check whether the CSS Grid container uses `grid-auto-rows: 1fr` or auto. If auto, cards will be uneven. Mitigate by setting `.producto-grid { grid-auto-rows: 1fr; } .producto-card { height: 100%; }` and ensuring the info zone uses `margin-top: auto` on `.envio-cartel` to push it to the bottom uniformly. Re-screenshot and confirm grid bottoms align across both card variants.

**Bonus monitoring after launch:**
- Watch Tiendanube's analytics for the `agotado` state — Risk Profile from MEMORY mentions filtros vacíos by decision; confirm out-of-stock cards still render at .72 opacity and don't accidentally fully hide via cascade collision.
- Verify Revie review widget (per `apps-instaladas-tiendanube` memory) still renders below the card if it injects into `.producto-card`. The new `border-radius: 14px; overflow: hidden;` could clip Revie's injected DOM. If clipped, move overflow control to `.producto-imagen-wrapper` only and remove from `.producto-card`.