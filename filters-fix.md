## ROOT CAUSE (1 paragraph max)

The diagnosis as written is wrong on its two load-bearing claims (skeptics confirmed: `store.js.tpl` L350-351 unconditionally adds `.modal-show` to `#nav-filters` and reparents it to `<body>`, AND no `body.move-right { transform }` rule exists in Toluca base — so neither "modal-show missing on mobile" nor "fixed-positioning hijacked by body transform" can produce the small box). The **only mechanically verifiable cause** in the current SCSS is that **A4/A6 dump sizing/flex/background/shadow/border-radius onto `.modal-dialog` and `.modal-content`, which Toluca's flat `modal.tpl` never emits** — so `#nav-filters` itself receives no flex layout, no white background, no shadow, and no border-radius from those rules; combined with the fact that `.modal-body.h-100` resolves against `#nav-filters` whose mobile override IS firing (height:100vh), the body DOES render full-height but with no flex parent the sticky header + 100vh body stack causes the modal `overflow-y:auto` to expose internal scroll glitches. The reported 356×600 box cannot be derived from any rule actually in the codebase and must be confirmed via DevTools — **do not ship a fix that pretends to "explain" it**; ship a fix that (a) moves all dead-code declarations onto the real element `#nav-filters`, (b) makes the root a true flex column so header+body lay out correctly, (c) keeps the existing freeze-guard at L3914 intact, and (d) hardens against the `transform`-containing-block edge case defensively without breaking other modals.

---

## FIX (production SCSS)

### 1. REMOVED rules

| Selector | Reason removed |
|---|---|
| `#nav-filters .modal-dialog, #nav-filters .modal-content { ... }` (A4, L4630-4642) | Targets DOM elements that Toluca's `modal.tpl` never emits — dead code. All declarations migrate to `#nav-filters` itself. |
| `#nav-filters .modal-dialog, #nav-filters .modal-content { ... }` inside `@media (max-width: 991.98px)` (A6, L4690-4702) | Same — dead selectors. Mobile sizing migrates to `#nav-filters.modal-show`. |

### 2. MODIFIED rules

**A2 (translucent backdrop) — UNCHANGED but documented for clarity:**
```scss
/* KEEP AS-IS at L4615-4620 (or wherever A2 lives) */
#nav-filters.modal-show {
  background: rgba(0, 14, 53, 0.42) !important;
}
```
Note: this is the **backdrop dimmer** behind the modal. Do NOT overwrite it with `background:#fff` on `#nav-filters`. The white surface goes on the modal's `inner wrapper` we synthesize via `::before`-free approach below — i.e., on `.modal-header` + `.modal-body` directly (they already have white default backgrounds via Bootstrap/Toluca; we just make sure they fill the modal column).

Actually — important correction: in Toluca, when `.modal-show` fires, the modal IS the visible surface (not a backdrop). The `.modal-overlay` sibling (data-modal-id="#nav-filters") is the backdrop dimmer. So `#nav-filters` itself needs `background:#fff`. The A2 rule that sets `rgba(0,14,53,0.42)` on `#nav-filters.modal-show` is WRONG and is part of the bug surface — it paints the modal itself translucent navy. **Remove A2 entirely** and let `.modal-overlay` handle dimming (it already has `background: rgba(0,0,0,0.5)` in Toluca base at L572-578).

**REVISED A2 — REMOVE entirely:**
```scss
/* DELETE A2 (L4615-4620) — it incorrectly paints the modal navy.
   The .modal-overlay sibling already handles backdrop dimming. */
```

**A6 mobile block — REPLACE the full block (L4663-4703) with:**
```scss
@media (max-width: 991.98px) {

  /* === ROOT: full-viewport flex column === */
  #nav-filters.modal-show,
  #nav-filters.modal-filters.modal-show {
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    inset: 0 !important;

    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;          /* iOS Safari URL-bar correctness */
    max-height: 100vh !important;
    max-height: 100dvh !important;

    margin: 0 !important;
    padding: 0 !important;

    /* Real flex column on the root — replaces dead .modal-dialog flex */
    display: flex !important;
    flex-direction: column !important;

    /* Surface */
    background: #fff !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: -20px 0 60px -20px rgba(0, 14, 53, 0.18) !important;

    /* Defensive: kill any inherited transform from JS-applied transitions
       that could create a containing block for descendants. */
    transform: none !important;

    /* Above overlay (TN overlay z-index ~10000) */
    z-index: 20000 !important;

    /* No internal scroll on root — the body handles scrolling */
    overflow: hidden !important;
  }

  /* === BODY-SIBLING GUARD: keep existing freeze-guard intact, add complement === */
  /* The existing rule at L3914 handles `.move-right:not(.modal-open)`.
     This complement handles the case where .modal-open IS set (filter modal path)
     by neutralizing any rogue body transform ONLY when #nav-filters is open.
     Scoped to .move-right so cart/other right-modals are untouched if they
     happen to use legitimate transforms. */
  body.move-right.modal-open:has(#nav-filters.modal-show) {
    transform: none !important;
    margin-left: 0 !important;
    left: 0 !important;
    right: 0 !important;
  }
}
```

**A7 (modal-body) — REPLACE (L4705-4714) with:**
```scss
@media (max-width: 991.98px) {
  #nav-filters .modal-body,
  #nav-filters .modal-body.h-100,
  #nav-filters .modal-body.h-100.p-0 {
    /* Override Bootstrap .h-100 — flex item handles sizing now */
    height: auto !important;
    max-height: none !important;

    /* Real flex item inside the root flex column */
    flex: 1 1 auto !important;
    min-height: 0 !important;          /* allows shrink for inner scroll */

    /* Internal scroll lives here, not on root */
    overflow-y: auto !important;
    overflow-x: hidden !important;
    -webkit-overflow-scrolling: touch !important;

    /* Reinstate Bootstrap padding the .p-0 utility killed */
    padding: 0 24px 24px !important;
    background: #fff !important;
  }
}
```

**A8 (modal-header) — REPLACE (around L4720-4730) with:**
```scss
@media (max-width: 991.98px) {
  #nav-filters .modal-header,
  #nav-filters .js-modal-close.modal-header,
  #nav-filters .modal-header-no-title {
    /* No longer sticky — flex layout pins it naturally */
    position: relative !important;
    top: auto !important;

    flex: 0 0 auto !important;         /* fixed-height flex item */

    background: #fff !important;
    border-bottom: 1px solid rgba(0, 14, 53, 0.08) !important;
    padding: 16px 24px !important;
    min-height: 60px !important;

    z-index: 1 !important;             /* stay above body content during scroll */
  }
}
```

### 3. NEW rules added

**Mobile base (no media query) — element shape regardless of open state:**
```scss
/* Belt-and-suspenders: ensure #nav-filters has identity even before .modal-show
   fires (transition frame). Prevents the 356×600 "intrinsic sizing" hypothesis
   if it ever materializes during the slide-in animation. */
#nav-filters {
  background: #fff;
  box-shadow: -20px 0 60px -20px rgba(0, 14, 53, 0.18);
}

/* On mobile, force the modal to live directly on body — JS already does this
   (store.js.tpl L350 detach().appendTo("body")), but this protects against
   any wrapper-transform escape if a future child gets `contain: layout`. */
@media (max-width: 991.98px) {
  #nav-filters {
    contain: none !important;
  }
}
```

**Safe-area inset for iOS notch / home-indicator:**
```scss
@media (max-width: 991.98px) {
  #nav-filters.modal-show {
    padding-top: env(safe-area-inset-top, 0) !important;
    padding-bottom: env(safe-area-inset-bottom, 0) !important;
  }
  #nav-filters .modal-body {
    padding-bottom: calc(24px + env(safe-area-inset-bottom, 0)) !important;
  }
}
```

### 4. Specificity notes

| New rule | Specificity | Beats TN because |
|---|---|---|
| `#nav-filters.modal-show` | (0,1,1,0) `!important` | TN base `.modal-right.modal-show` is (0,0,2,0) with NO `!important`. `!important` is the decider. |
| `#nav-filters .modal-body.h-100.p-0` | (0,1,3,0) `!important` | Bootstrap `.h-100 { height:100% !important }` is (0,0,1,0) `!important` — equal `!important` flag, higher specificity wins. |
| `#nav-filters .modal-header` | (0,1,1,0) `!important` | TN `.modal-header` is (0,0,1,0) no `!important`. Wins on `!important`. |
| `body.move-right.modal-open:has(#nav-filters.modal-show)` | (0,1,3,1) `!important` | No TN rule of comparable specificity targets this state — wins trivially. Scoped to `.move-right.modal-open` so cart sidebar (which uses `.move-left` or has `.modal-open` without `.move-right` set on filter close) is untouched. |
| `#nav-filters` base | (0,1,0,0) no `!important` | Used as background fallback only — any `.modal-show`-scoped rule overrides if needed. |

---

## WHAT TO TEST AFTER UPLOAD

**Hard refresh first:** Ctrl+Shift+R on the test device, or in Chrome DevTools right-click reload → "Empty cache and hard reload".

**Mobile viewport tests** (DevTools device emulation: iPhone 12 Pro 390×844, then real device):

1. **Open filter modal from PLP** (`/productos/` → tap "Filtrar"). EXPECT: modal slides in from right, covers entire viewport, white background, X close icon top-right, filter accordion list visible top-to-bottom, scrollable.
2. **Inspect `#nav-filters` in DevTools** while open. EXPECT in Computed pane:
   - `position: fixed`
   - `width: 390px` (= 100vw)
   - `height: 844px` (= 100vh)
   - `top/right/bottom/left: 0px`
   - `display: flex`
   - `flex-direction: column`
   - `transform: none`
   - `background-color: rgb(255, 255, 255)`
3. **Inspect `body`** while modal open. EXPECT `transform: none` AND verify the classes present (`move-right modal-open overflow-none` typical) — confirm freeze-guard or new `:has()` rule is winning.
4. **Scroll inside the modal body.** EXPECT body scrolls internally, header stays at top, body content does NOT escape under the header.
5. **Tap a filter** (e.g., Marca → check a brand). EXPECT chip applies, accordion stays expanded, product count updates in footer if present.
6. **Tap X close.** EXPECT modal slides out right, `body` regains scroll (no `overflow-none` stuck), PLP scroll position preserved.
7. **Tap overlay (outside modal).** EXPECT same close behavior.
8. **Browser back button while modal open.** EXPECT modal closes, URL hash cleared, no orphan `.modal-show` left on element.
9. **iOS Safari real device** (test on iPhone if available): URL bar collapse during scroll should NOT cause modal to clip — `100dvh` handles this. Notch area should have safe padding.
10. **Resize 991→992px** with modal open (DevTools): at 992px the desktop `display:none` (A5) should hide it cleanly. Below 992px it should re-appear at full viewport.
11. **Open cart sidebar (if exists) AFTER closing filter.** EXPECT cart sidebar unaffected — the `body.move-right.modal-open:has(#nav-filters...)` scoping should NOT touch cart-only state.

---

## RISKS

### Risk 1 — The 356×600 reproduction still happens because the actual cause is NOT in CSS

**What:** The skeptics conclusively proved the diagnosis cannot mechanically derive 356×600 from any rule in the codebase. If the real cause is JS-driven (e.g., a stale MutationObserver in `layout.tpl` L1218-1280 manipulating `#nav-filters`, or `data-modal-url` triggering an AJAX content swap that re-renders into a different node), CSS won't fix it.

**How to detect:** After upload, if symptom persists, in DevTools Elements panel **search for all instances of `id="nav-filters"`** (Ctrl+F). If there are TWO, JS is cloning/AJAX-loading into a phantom container and the user's CSS targets the wrong one. Console-log `document.querySelectorAll('#nav-filters').length` while modal is open — must be exactly `1`.

### Risk 2 — `:has()` not supported on user's browser

**What:** `body.move-right.modal-open:has(#nav-filters.modal-show)` requires `:has()` — Safari 15.4+, Chrome 105+, Firefox 121+ (Dec 2023). If the user is testing on Android WebView <105 or stock Samsung Internet older than 21, the rule silently does nothing.

**How to detect:** In DevTools console run `CSS.supports('selector(:has(*))')` — must return `true`. If `false`, replace the `:has()` rule with a `body.modal-open` blanket rule scoped to the same media query, accepting that other right-modals also get `transform:none` while open.

### Risk 3 — `.modal-overlay` sibling gets reparented or restyled, leaving no backdrop

**What:** We removed A2 which painted `#nav-filters` translucent navy. Backdrop dimming now relies SOLELY on `.modal-overlay[data-modal-id="#nav-filters"]` which Toluca base styles at `rgba(0,0,0,0.5)`. If a previous custom rule in `morashop-rediseno.scss` overrode `.modal-overlay { display: none }` or `background: transparent`, the modal will appear full-screen white with no backdrop behind it — which on full-viewport mobile is actually correct (no backdrop visible because modal covers everything), but on tablet 768–991px range the backdrop should still show on the side.

**How to detect:** At 800px viewport width with modal open, the area outside the modal (if any) should be dimmed dark. If it's not, `Grep` morashop-rediseno.scss for `.modal-overlay` and verify no rule hides it. Also: on full-mobile 390px width, you won't visually notice — the modal covers 100%. The test for backdrop integrity is the tablet range.

---

**Files to edit:**
- `C:\Users\alejo\Downloads\Morashop\Backup_tienda\_\static\css\morashop-rediseno.scss` — lines 4615-4730 (A2 through A8 of the filter modal block). Apply all four operations above (REMOVED + MODIFIED + NEW) in that range. Do NOT touch L3911-3920 freeze-guard.

**Files to NOT edit:**
- `style-async.scss` (Toluca base — overrides only via morashop-rediseno.scss)
- `store.js.tpl` (JS behavior is correct per skeptic analysis; modal-show IS applied uniformly)

**Verification command before upload:** `Grep` your modified block for `\.modal-dialog\|\.modal-content` — must return 0 matches. Those selectors must be fully purged.