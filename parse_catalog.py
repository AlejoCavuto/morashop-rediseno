import csv
import json
import random
from collections import Counter, OrderedDict

CSV_PATH = r"C:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno\tiendanube-2268228-17806086346828902545106886958.csv"
OUT_PATH = r"C:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno\catalog-parsed.json"

products = OrderedDict()
total_rows = 0

with open(CSV_PATH, "r", encoding="latin-1", newline="") as f:
    reader = csv.reader(f, delimiter=";", quotechar='"')
    header = next(reader, None)
    for row in reader:
        if not row:
            continue
        total_rows += 1
        # Pad row if shorter than expected
        if len(row) < 26:
            row = row + [""] * (26 - len(row))
        handle = (row[0] or "").strip()
        if not handle:
            continue
        if handle in products:
            continue  # Keep only the FIRST row per handle
        name = (row[1] or "").strip()
        # Real header indices: 21=Tags, 24=Marca (task description was off-by-one)
        tags_raw = (row[21] or "").strip()
        brand = (row[24] or "").strip()
        tags = [t.strip() for t in tags_raw.split(",") if t.strip()]
        products[handle] = {
            "handle": handle,
            "name": name,
            "brand": brand,
            "tags": tags,
        }

unique_handles = len(products)
products_list = list(products.values())

# Brand counts
brand_counter = Counter()
for p in products_list:
    b = p["brand"] if p["brand"] else "(sin marca)"
    brand_counter[b] += 1

# Tag counts
tag_counter = Counter()
for p in products_list:
    for t in p["tags"]:
        tag_counter[t] += 1

top_tags = tag_counter.most_common(50)
top_brands_30 = brand_counter.most_common(30)

# Save the parsed list
with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(products_list, f, ensure_ascii=False, indent=2)

# Sample 20 random
random.seed(42)
sample = random.sample(products_list, min(20, len(products_list)))

print("=== TOTALS ===")
print(f"Total data rows scanned: {total_rows}")
print(f"Unique handles (products): {unique_handles}")
print(f"Output file: {OUT_PATH}")

print("\n=== TOP 30 BRANDS ===")
for b, c in top_brands_30:
    print(f"  {b}: {c}")

print("\n=== TOP 50 TAGS ===")
for t, c in top_tags:
    print(f"  {t}: {c}")

print("\n=== SAMPLE OF 20 ===")
for p in sample:
    print(f"- [{p['brand']}] {p['name']} (handle={p['handle']}) tags={p['tags'][:6]}")

# Also dump structured JSON to stdout for harness extraction
summary = {
    "totalRows": total_rows,
    "uniqueHandles": unique_handles,
    "outputFile": OUT_PATH,
    "brandCounts": {b: c for b, c in top_brands_30},
    "topTags": [{"tag": t, "count": c} for t, c in top_tags],
    "extractedSample": [
        {"handle": p["handle"], "name": p["name"], "brand": p["brand"], "tags": p["tags"]}
        for p in sample
    ],
}
print("\n=== SUMMARY_JSON_START ===")
print(json.dumps(summary, ensure_ascii=False))
print("=== SUMMARY_JSON_END ===")
