"""Build compact catalog categories JSON for embedding in layout.tpl.
- Apply manual fixes for known misclassifications (Funko, Wabro, vaso shaker, etc.)
- Use 1-letter codes: s/a/b/e/h/o/j/x/v/y
- Output minified single-line JSON.
"""
import json
import os

ROOT = r"c:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno"
CATEGORIES_JSON = os.path.join(ROOT, "catalog-categories.json")
PARSED_JSON = os.path.join(ROOT, "catalog-parsed.json")
OUT_COMPACT = os.path.join(ROOT, "catalog-compact.json")
OUT_SCRIPT = os.path.join(ROOT, "catalog-script-block.html")

CODE_BY_NAME = {
    "supplement": "s", "alimento": "a", "bebida": "b", "electro": "e",
    "higiene": "h", "hogar": "o", "juguete": "j", "otros": "x",
    "vino": "v", "yerba_mate": "y",
}

with open(CATEGORIES_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)
by_handle = data["byHandle"]

with open(PARSED_JSON, "r", encoding="utf-8") as f:
    parsed = json.load(f)

parsed_by_handle = {p["handle"]: p for p in parsed}

# Manual override rules to fix misclassifications found by verifier
def reclassify(handle, current_cat):
    p = parsed_by_handle.get(handle)
    if not p:
        return current_cat
    name = (p.get("name") or "").lower()
    brand = (p.get("brand") or "").lower()
    tags = " ".join(p.get("tags", [])).lower()
    hay = f"{name} {brand} {tags}"

    # Funko / Wabro / Bandai / Hasbro brands → SIEMPRE juguete
    if any(b in brand for b in ["funko", "wabro", "bandai", "hasbro", "spin master",
                                 "fisher price", "banpresto", "hot wheels", "lego", "mattel",
                                 "playmobil", "barbie"]):
        return "juguete"

    # Standalone vaso/shaker → hogar (not supplement)
    if any(k in name for k in ["vaso shaker", "shaker gold", "shaker bsn",
                                 "vaso de pl", "vaso plast"]) and "proteina" not in name and "whey" not in name and "creatina" not in name:
        return "hogar"

    # Bananero remera/gorra/buzo → otros (merch)
    if "bananero" in brand or "bananero" in name:
        if any(k in name for k in ["remera", "gorra", "buzo", "sweater", "polera", "campera"]):
            return "otros"

    # Aceite Laur → alimento (not vino)
    if "aceite" in name and current_cat == "vino":
        return "alimento"

    # Cry Babies → juguete
    if "cry babies" in name or "cry babies" in tags:
        return "juguete"

    # Goku / Dragon Ball / Saiyan → juguete
    if any(k in name for k in ["dragon ball", "saiyan", "goku black", "goku rose"]):
        return "juguete"

    return current_cat

# Build compact map with overrides + 1-letter codes
compact = {}
overrides = 0
for handle, cat_name in by_handle.items():
    new_cat = reclassify(handle, cat_name)
    if new_cat != cat_name:
        overrides += 1
    code = CODE_BY_NAME.get(new_cat, "x")
    compact[handle] = code

# Stats per category
from collections import Counter
cnt = Counter(compact.values())
NAME_BY_CODE = {v: k for k, v in CODE_BY_NAME.items()}
stats = {NAME_BY_CODE.get(k, k): v for k, v in cnt.items()}

with open(OUT_COMPACT, "w", encoding="utf-8") as f:
    json.dump(compact, f, separators=(",", ":"), ensure_ascii=False)

# Build script block to embed
compact_json = json.dumps(compact, separators=(",", ":"), ensure_ascii=False)
size = len(compact_json.encode("utf-8"))

script_block = f"""<script>window.MR_CATALOG_CATEGORIES={compact_json};</script>"""

with open(OUT_SCRIPT, "w", encoding="utf-8") as f:
    f.write(script_block)

print(f"Total handles: {len(compact)}")
print(f"Overrides applied: {overrides}")
print(f"Compact JSON size: {size:,} bytes")
print(f"Stats: {stats}")
print(f"Saved compact: {OUT_COMPACT}")
print(f"Saved script: {OUT_SCRIPT}")
