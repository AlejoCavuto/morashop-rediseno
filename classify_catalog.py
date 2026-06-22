# -*- coding: utf-8 -*-
"""Classify every product in catalog-parsed.json into one category."""
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(r"c:\Users\alejo\OneDrive\Escritorio\catalogo_star\morashop-rediseno")
SRC = ROOT / "catalog-parsed.json"
DST = ROOT / "catalog-categories.json"


def strip_accents(s: str) -> str:
    if not s:
        return ""
    nfkd = unicodedata.normalize("NFKD", s)
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def norm(s: str) -> str:
    """Lowercase, strip accents, drop weird question-mark replacements from earlier parse."""
    if not s:
        return ""
    s = strip_accents(str(s)).lower()
    # earlier parse left literal '?' where accented chars used to be -> treat as nothing
    s = s.replace("?", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


# --------------------------------------------------------------------------- #
# Category definitions
# --------------------------------------------------------------------------- #
CATEGORY_DEFS = {
    "supplement": [
        "omega", "creatina", "whey", "proteina", "magnesio", "vitamina",
        "colageno", "bcaa", "glutamina", "multivitamin", "zma", "melaton",
        "mass gainer", "pre-workout", "pre workout", "preworkout",
        "aminoacido", "isolate", "hialuronico", "suplemento", "casein",
        "taurina", "l-carnitina", "carnitina", "electrolitos", "gainer",
        "ganador", "fish oil", "k2", "d3", "melatonin", "brain", "immunity",
        "proteico", "proteica", "barra proteica", "barras proteicas",
        "termogen", "quemador", "weight gainer", "100% whey", "wpc", "wpi",
        "caseina", "albumina", "albumin", "iso whey", "isowhey",
        "pre entreno", "pre-entreno", "post entreno", "post-entreno",
        "ashwagandha", "biotina", "zinc", "calcio", "hierro", "potasio",
        "spirulina", "espirulina", "maca", "guarana", "carb", "ribosa",
        "arginina", "citrulina", "beta alanina", "beta-alanina",
        "hmb", "tribulus", "ginkgo", "ginseng", "probiotic", "probiotico",
        "lactoferrina", "nac", "n-acetil", "coenzima", "coq10", "luteina",
        "resveratrol", "omega-3", "omega 3", "epa", "dha", "msm",
        "glucosamina", "condroitina", "ena sport", "star nutrition",
        "astaxantina", "betacaroteno", "power bronz", "pre-work",
        "pre work", "psychotic", "insane labz", "natulabs", "natuliv",
        "garden house", "innovanaturals",
        "antioxidante", "inmune", "inmunidad", "lipo 6", "lipo-6",
        "lipo6", "niox", "oxido nitrico", "testosterona", "testo high",
        "testo boost", "boost natural", "curcuma", "curcuminoides",
        "nicotinamida", "nad+", "nad ", "longevidad", "antiinflamatorio",
        "caida del cabello", "innerx", "quema grasa", "fat burner",
        "adelgazar", "termogenico", "metasitol", "serrapeptasa",
        "telomerina", "cados total", "nutricion osea", "isoflavonas",
        "bronceado", "clorofila", "complejo vitaminico",
        "para cabello piel y unas", "para cabello, piel y unas",
        "andino digestivo", "andino ansiolitico", "andino migrana",
        "andino hepatico", "valeriana", "pasiflora", "melisa",
        "alcachofa", "boldo", "ulmaria", "tilo", "bardana",
        "pharmahepat", "metionina", "vitamin way", "vitaminway",
        "garden house", "framingham", "eth nutrition", "hoch sport",
        "nutrex", "leguilab", "mct oil",
        "pastilla", "pastillas", "capsula", "capsulas", "comprimido",
        "comprimidos", "suplemento", "suplementos", "nutricion deportiva",
        "animal cuts", "animal stak", "potenciador hormonal",
        "universal nutrition", "advanced cuts",
        "pre-entrenamiento", "pre entreno", "pharmatos",
    ],
    "electro": [
        "electro", "electrica", "electrico", "depiladora", "plancha",
        "hervidor", "licuadora", "batidora", "robot de cocina", "freidora",
        "microondas", "multiprocesadora", "ventilador", "calefactor",
        "cafetera", "tostadora", "sandwichera", "aspiradora",
        "secador de pelo", "secadora", "afeitadora", "balanza",
        "horno electrico", "anafe", "lavadora", "pava electrica",
        "juguera", "extractor de jugo", "exprimidor", "caloventor",
        "termoventilador", "estufa electrica", "termo electrico",
        "tensiometro", "oximetro", "termometro digital",
        "nebulizador", "humidificador", "purificador", "vaporizador",
        "lavarropa", "lavarropas", "heladera", "lavasecarropas",
        "freezer", "telefunken", "split", "aire acondicionado",
        "smart tv", "televisor", "monitor", "proyector",
        "sellador por vacio", "cortadora de cabello",
        "fabricadora de hielo", "fabrica horno de pan",
        "horno de pan", "picadora de alimentos", "picadora",
        "estereo para auto", "auto estereo", "bluetooth y lector",
        "taladro", "motosierra", "amoladora", "atornillador",
        "kit cargador", "cargador y bateria",
    ],
    "juguete": [
        "juguete", "juguetes", "pistola", "nerf", "dardos", "peluche",
        "muneco", "munecos", "muneca de juguete", "dinosaurio",
        "camion de juguete", "auto de juguete", "set tools",
        "action figure", "figura de accion", "bloques", "lego",
        "playmobil", "rasti",
        "patineta", "monopatin", "triciclo", "biciclet",
        "tamagotchi", "goo-jit-zu", "paw patrol", "mickey mouse",
        "minnie", "frozen", "barbie", "hot wheels", "marvel", "disney",
        "squishy", "slime", "burbujas", "pelota", "pelotas",
        "rompecabezas", "puzzle", "didactic", "didactico",
        "playset", "play doh", "play-doh", "trompo", "yo-yo", "yoyo",
        "stitch", "minions", "spider", "batman", "superman",
        "funko", "funko pop", "bandai", "anime heroes", "wabro",
        "dragon ball", "naruto", "demon slayer", "yu-gi-oh", "yu gi oh",
        "chainsaw man", "captain tsubasa", "one piece", "harry potter",
        "star wars", "the simpsons", "attack on titan", "wednesday",
        "lol surprise", "cochecito", "practicuna", "cuna muneca",
        "muneca mini", "varita magica", "varita harry", "geomag",
        "ichibansho", "stretcherz", "cry babies", "yu-gi-oh!",
        "playking", "indiana jones", "obi wan", "raiders",
        "loving care", "muneca articulada", "auto monstruo",
        "wizarding world", "starlin", "magic", "patrulla canina",
        "ben 10", "transformers", "pokemon", "sonic",
        "juego de pesca", "bebote", "monopoly", "rollers", "patines",
        "juego de mesa", "caracol con sonido", "silla de comer bebe",
        "andador bebe", "andador", "cuna bebe", "babero",
        "avengers", "iron man", "captain america", "titan hero",
        "fisher price", "hasbro", "play-doh", "playdoh",
        "rasti", "magna tiles", "mecano", "remera bananero",
        "gorra el bananero", "gorra bananero", "japi beer",
        "medias madmia", "par de medias",
        "league of legends", "toy story",
        "banpresto", "spin master", "match makers",
        "inflable", "flotador", "salvavidas bebe", "unicornio flamenco",
        "aro de bano", "reductor de banera", "adaptador reductor",
        "silla de comer",
        "camion radio control", "auto a control remoto",
        "auto a bateria", "moto a bateria", "control remoto",
        "robot transformer", "optimus prime", "burbujero",
        "antiparras", "natacion infantil", "pisos de goma eva",
        "goma eva", "mountain bike", "bmx", "bicicleta", "biciclet",
        "pelela", "mochila prescolar", "mochila escolar",
        "mochila bolso", "bolso maternal", "valija infantil",
        "doctora herramientas", "mamadera",
        "butaca para auto", "butaca infantil", "butaca elevador",
        "booster ", "tapa enchufe",
        "cuna colecho", "cuna plegable", "colchon cuna",
        "funda cubre colchon", "colchon de espuma para cuna",
        "pata pata", "andarin", "camicleta", "twist car",
        "auto musical", "moto policial", "mercedes benz love",
        "audi r8", "audi r8 spyder",
        "silla gamer", "colchon para cuna", "colchon mediano",
        "colchon cuna", "espuma para cuna",
    ],
    "vino": [
        "vino", "malbec", "cabernet", "syrah", "espumante", "bonarda",
        "blend", "chardonnay", "sauvignon", "merlot", "vinos", "torrontes",
        "pinot", "rose", "tannat", "rutini", "trapiche", "luigi bosca",
    ],
    "yerba_mate": [
        "yerba", "baldo", "taragui", "rosamonte", "cbse",
        "amanda", "playadito", "romance", "cruz de malta", "la merced",
        "canarias", "pajarito", "pipore", "yerba mate", "mate cocido",
        "bombilla", "matera",
    ],
    "alimento": [
        "salsa", "pasta", "miel", "aceite", "cacao", "harina", "snack",
        "galleta", "semilla", "almendra", "cereal", "granola", "mermelada",
        "panko", "ramen", "arroz", "fideos", "polenta", "azucar",
        "endulzante", "stevia", "edulcorante", "manteca", "queso",
        "dulce de leche", "chocolate", "barra de cereal", "barrita",
        "mani", "nuez", "nueces", "pistacho", "pasas", "datil", "datiles",
        "frutos secos", "avena", "quinoa", "lentejas", "garbanzo",
        "porotos", "atun", "sardina", "cafe", "infusion",
        "cremas para untar", "pure", "sopa", "caldo", "vinagre",
        "salsa de soja", "leche", "yogur", "yoghurt", "queso untable",
        "fecula", "risotto", "rebozador", "coco rallado", "masala",
        "especias", "garam masala", "curry", "comino", "cebolla en polvo",
        "ajo en polvo", "oregano", "pimienta", "pimentón", "pimenton",
        "sal ", "salvado", "germen de trigo", "tahini", "hummus",
        "bizcochos", "bizcocho", "tarta", "alfajor",
        "sesamo", "banana deshidratada", "aji molido", "arandanos",
        "premezcla", "chips de", "pochoclo", "nachos",
        "aceto balsamico", "mayonesa", "mostaza", "ketchup",
        "salsa golf", "salsa criolla", "polvo de hornear",
        "polvo para hornear", "levadura",
        "frutas deshidratadas", "fritos", "deshidratado",
        "panqueque", "mix de frutos", "pasas de uva", "ciruela",
        "lino", "lino clasificado", "castanas", "castañas",
        "mix energetico", "mix energ", "perejil", "albahaca",
        "te rojo", "te verde", "te matcha", "saquitos",
        "bombon", "felfort", "gomitas", "membrillo",
        "psyllium husk", "arveja amarilla", "soja texturizada",
        "crema de avellanas", "golden spice", "spice latte",
        "chile rojo en polvo", "extracto de", "polvo organikal",
        "matcha en polvo",
        "propoleo", "superfoods",
    ],
    "bebida": [
        "cerveza", "gaseosa", "jugo de", "energizante", "isotonica",
        "vodka", "fernet", "ginebra", "whisky", "ron ", "tequila",
        "aperitivo", "amargo", "energy drink", "powerade", "gatorade",
        "coca cola", "pepsi", "sprite", "fanta", "vermouth", "vermut",
        "aperol", "campari", "branca", "cynar", "champagne",
        "agua mineral", "agua saborizada", "agua tonica",
        "gin terrier", "gin london", "london dry", "spicy gin",
    ],
    "higiene": [
        "panal", "paniales", "panales", "pasta dental", "jabon", "shampoo",
        "desodorante", "papel higienico", "toallitas", "prestobarba",
        "gillette", "crema dental", "enjuague bucal", "cepillo de dientes",
        "hilo dental", "afeitar", "talco", "colonia", "perfume",
        "acondicionador", "crema de manos", "protector solar",
        "agua micelar", "agua termal", "tonico facial", "serum facial",
        "limpiador facial", "exfoliante", "mascarilla facial",
        "crema facial", "crema corporal", "panos sanitarios",
        "femcare", "intimo", "tampon", "toallita femenina",
        "rollo de cocina", "rollo cocina", "servilletas", "servilleta",
        "incienso", "sahumerio", "sahumerios", "varilla sri",
        "aposito", "comodin", "incontinencia",
        "ropa interior plenitud", "plenitud protect",
        "polo wellington", "wellington polo", "polo club",
        "fragancia masculina", "fragancia femenina", "edp ",
        "hisopo", "hisopos", "algodon estrella", "oleo calcareo",
        "babysec", "protector diario", "femme ", "femme,",
        "rolcocina", "rollos de cocina",
        "crema anti age", "anti age", "anti-acne", "antiacne",
        "balsamo labial", "labial", "gel de limpieza", "bruma facial",
        "lecitina", "vaselina", "glicerina", "repelente",
        "ropa interior descartable", "zalea", "zaleas",
        "espejo inteligente", "bidet", "inodoro", "mingitorio",
        "ducha inteligente", "secador de manos", "banera",
        "amonio cuaternario", "desinfectante", "gel neutro",
        "protectores diarios", "pantene", "enjuague capilar",
        "gel fijador", "limpiador cremoso", "desengrasante",
        "lavandina", "raid tabletas", "raid ", "cif ",
        "crema para pies", "crema corporal", "spay ", "agua de jazmin",
        "agua de sandalo", "cepillo dental", "gel limpieza facial",
        "plenitud pants", "pants plus", "femenino", "femenina",
        "griferia", "bacha lavatorio", "bacha",
        "pileta cocina", "pileta bacha", "lavatorio",
    ],
    "hogar": [
        "vaso", "shaker", "taza", "plato", "olla", "sarten", "recipiente",
        "organizador", "almohada", "sabana", "manta", "toalla", "cubierto",
        "bowl", "tupper", "tapper", "termo ",
        "cuchillo", "tabla picar", "rallador", "colador", "fuente",
        "cacerola", "jarra", "ensaladera", "vajilla", "cafe french press",
        "porta",
    ],
    "accesorio_fitness": [
        "gym", "gimnasio", "mancuerna", "pesas rusas", "banda elastica",
        "colchoneta", "cinturon levantamiento", "cinta de correr",
        "guantes gym", "guantes gimnasio", "munequera",
        "rodillera", "soga de saltar", "tobillera", "barra dominadas",
        "kettlebell", "disco olimpico", "remera deportiva", "calza",
        "short deportivo", "fitness", "yoga mat", "esterilla yoga",
    ],
}

# Brands that are essentially always supplements (used for tiebreaker).
SUPPLEMENT_BRANDS = {
    norm(b) for b in [
        "Star Nutrition", "Innovanaturals", "ENA Sport", "Body Advance",
        "Gold Nutrition", "BSN", "Optimum Nutrition", "Universal", "Animal",
        "Granger", "Labs Nutrition", "Natural Whey", "Healthy Mind",
        "Sci-Mx", "Mutant", "FullLife", "GAT", "Whey Bull",
        "Ena Sport", "Star Nutrition", "Nutrabolics", "Muscletech",
        "Dymatize", "Now", "Now Foods", "Solgar", "ON",
    ]
}

# Order of evaluation when multiple match — first wins.
CATEGORY_ORDER = [
    "supplement",
    "electro",       # pava electrica matera → electro, not yerba_mate/hogar
    "higiene",       # panos sanitarios mickey → higiene, not juguete
    "vino",
    "yerba_mate",    # before bebida so yerba mate with tag energizante stays yerba
    "bebida",        # vermouth → bebida
    "hogar",         # taza mickey → hogar (mug), not juguete
    "juguete",
    "accesorio_fitness",
    "alimento",
]


def keyword_hit(haystack: str, keywords) -> bool:
    """Return True if any keyword appears as a substring of haystack (already normalized)."""
    for kw in keywords:
        k = norm(kw)
        if not k:
            continue
        # word-boundary-ish: allow substring but avoid trivial 2-char clashes
        if len(k) <= 3:
            # require word boundary for very short kws
            if re.search(rf"(?<![a-z0-9]){re.escape(k)}(?![a-z0-9])", haystack):
                return True
        else:
            if k in haystack:
                return True
    return False


def classify(entry: dict) -> str:
    name = norm(entry.get("name", ""))
    brand = norm(entry.get("brand", ""))
    tags_list = entry.get("tags") or []
    tags = norm(" ".join(tags_list))

    haystack_all = f" {name} {brand} {tags} "

    # 1) Supplement brand short-circuit: if brand is a known supplement brand
    #    and the product is not clearly something else (vino/yerba/electro/etc),
    #    classify as supplement immediately.
    if brand in SUPPLEMENT_BRANDS:
        # quick veto if it's obviously another category
        for veto_cat in ("vino", "yerba_mate", "electro", "juguete", "higiene"):
            if keyword_hit(haystack_all, CATEGORY_DEFS[veto_cat]):
                break
        else:
            return "supplement"

    # 2) Evaluate categories in priority order
    for cat in CATEGORY_ORDER:
        if keyword_hit(haystack_all, CATEGORY_DEFS[cat]):
            return cat

    # 3) Brand-only supplement fallback (if brand is supplement brand but no kw matched)
    if brand in SUPPLEMENT_BRANDS:
        return "supplement"

    return "otros"


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    by_handle: dict[str, str] = {}
    samples: dict[str, list[str]] = defaultdict(list)
    counts: Counter = Counter()

    for entry in data:
        handle = entry.get("handle") or ""
        if not handle:
            continue
        cat = classify(entry)
        by_handle[handle] = cat
        counts[cat] += 1
        if len(samples[cat]) < 5:
            samples[cat].append(handle)

    categories = sorted(set(by_handle.values()))
    classified = sum(v for k, v in counts.items() if k != "otros")
    unclassified = counts.get("otros", 0)

    out = {
        "categories": categories,
        "byHandle": by_handle,
    }
    DST.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    print("=== Counts ===")
    for cat, n in counts.most_common():
        print(f"{cat:22s} {n}")
    print()
    print(f"classified   = {classified}")
    print(f"unclassified = {unclassified}")
    print(f"total        = {sum(counts.values())}")
    print()
    print("=== Samples per category ===")
    for cat in categories:
        print(f"-- {cat} --")
        for h in samples[cat]:
            print(f"  {h}")

    # also dump small JSON sidecar with samples for the agent's structured output
    (ROOT / "catalog-categories.samples.json").write_text(
        json.dumps({
            "counts": dict(counts),
            "samples": dict(samples),
            "classified": classified,
            "unclassified": unclassified,
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
