"""Extract all PGN products from parsed catalog."""
import json, os
ROOT = r"c:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno"
PARSED = os.path.join(ROOT, "catalog-parsed.json")
with open(PARSED, encoding="utf-8") as f:
    products = json.load(f)
pgn = [p for p in products if (p.get("brand") or "").lower() == "pgn"]
print(f"Total PGN products: {len(pgn)}")
# Sort by name length (shorter likely top sellers)
pgn_sorted = sorted(pgn, key=lambda p: (-len(p.get("tags",[])), p.get("name","")))
# Output as JSON for embedding
out = [{"handle": p["handle"], "name": p["name"]} for p in pgn_sorted]
with open(os.path.join(ROOT, "pgn-products.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("Saved pgn-products.json")
for p in out[:5]:
    print(f"  - {p['name'][:70]}")
