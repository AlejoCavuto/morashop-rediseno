# PLAN MIGRACIÓN MORASHOP REDISEÑO → TOLUCA

## Política de seguridad (no negociable)

| Regla | Razón |
|---|---|
| Cada paso = 1 sección CSS o 1 archivo | Rollback chico, fácil |
| Backup local antes de Edit en admin (copiá lo que tenés) | Si rompe vos restaurás |
| Cada paso valida vos visualmente antes del siguiente | Cero romper a ciegas |
| CSS nuevo prefix `mr-*` / `morashop-*` | Sin colisión con Toluca |
| Cero `!important` sobre selectores existentes Toluca | Si ya hay otro CSS jugando, perdemos |
| FTP no se usa hasta paso 5+ (templates) | Riesgo solo cuando ya viste el visual |

## Orden de 8 pasos

| # | Paso | Riesgo | Tipo cambio | Tiempo |
|---|---|---|---|---|
| 1 | Tokens base `:root` mr-* + @import Google Fonts | bajo | CSS admin | 2 min |
| 2 | Footer rediseñado | bajo | CSS admin | 5 min |
| 3 | Header sticky + buscador + carrito | medio | CSS admin | 5 min |
| 4 | Catbar fija con chips | medio | CSS admin | 5 min |
| 5 | Hero banner (no carrusel) | medio | CSS admin + Trend carrusel config | 5 min |
| 6 | Product cards (grilla home + categoría) | alto | CSS admin | 10 min |
| 7 | Listado (filtros + grilla categoría) | medio | CSS admin | 10 min |
| 8 | PDP (galería + variantes + add to cart) | alto | CSS admin | 15 min |

Después de paso 8, si hay edits estructurales (template TPL) → FTP push, uno por uno con preview.

## Validación entre pasos

Cada paso tiene su pregunta:

| # | Qué validar |
|---|---|
| 1 | Tienda se ve IGUAL que ahora (tokens son no-op hasta que alguien los use) |
| 2 | Footer dark navy con cols alineadas, redes visibles, legales legibles mobile |
| 3 | Header sticky no tapa contenido al scrollear, buscador OK, carrito visible |
| 4 | Catbar scroll horizontal mobile, chips no se cortan, categoría activa se distingue |
| 5 | Hero 1 imagen (no carrusel), responsive, copy legible |
| 6 | Cards: precio visible, imagen no se corta, badge OFF visible, hover OK |
| 7 | Categoría: filtros usables, sort visible, paginación OK |
| 8 | PDP: agregar al carrito FUNCIONA, variantes OK, galería OK, precio destacado |

## Rollback per paso

Cada bloque CSS empieza con `/* === SECCIÓN === */`. Borrás el bloque completo + Guardar + Publicar → vuelve al estado anterior. 30 segundos.

## Riesgos identificados

1. **Cache CDN Tiendanube agresivo** → Ctrl+F5 después de publicar
2. **PDP es conversión directa** → último paso, validá flujo completo de agregar al carrito antes de continuar
3. **Mobile sticky header** → testear scroll real, no solo devtools
4. **Backup CSS actual** → guardá una copia del CSS que está ahora antes de paso 1

Archivos generados:
- `morashop-step-1-tokens.css`
- `morashop-step-2-footer.css`
- `morashop-step-3-header.css`
- `morashop-step-4-catbar.css`
- `morashop-step-5-hero.css`
- `morashop-step-6-cards.css`
- `morashop-step-7-listado.css`
- `morashop-step-8-pdp.css`
- `morashop-FULL-final.css` — todos juntos, append al CSS rollback existente
