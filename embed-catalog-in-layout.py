"""Embed catalog-compact.json into layout.tpl inside a {% if template == 'search' %} guard."""
import re
import json
import os

LAYOUT = r"C:\Users\alejo\Downloads\Morashop\Backup_tienda\_\layouts\layout.tpl"
COMPACT_JSON = r"c:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno\catalog-compact.json"

with open(COMPACT_JSON, "r", encoding="utf-8") as f:
    compact = f.read().strip()

with open(LAYOUT, "r", encoding="utf-8") as f:
    layout = f.read()

# 1) Remove any previous catalog block
layout = re.sub(
    r"\{# === MR CATALOG CATEGORIES.*?#\}\s*\{% if template ==.*?endif %\}\s*",
    "",
    layout,
    flags=re.DOTALL,
)

# 2) Build the new block
MARKER = "{# Morashop — Hybrid Search Ranking"
catalog_block = (
    "{# === MR CATALOG CATEGORIES — embed solo en /search/ (template=='search') === #}\n"
    "{% if template == 'search' %}\n"
    f"        <script>window.MR_CATALOG_CATEGORIES={compact};</script>\n"
    "{% endif %}\n        "
)

# 3) Insert ANTES del search ranking IIFE
if MARKER not in layout:
    raise RuntimeError(f"Marker not found: {MARKER}")
new_layout = layout.replace(MARKER, catalog_block + MARKER, 1)

with open(LAYOUT, "w", encoding="utf-8") as f:
    f.write(new_layout)

print(f"OK. layout.tpl updated. Catalog size: {len(compact):,} bytes")
print(f"Layout size: {len(new_layout):,} bytes")
