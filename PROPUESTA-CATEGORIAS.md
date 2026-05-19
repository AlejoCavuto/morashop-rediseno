# Propuesta de reorganización de categorías — Morashop

> Objetivo: que el cliente encuentre **todos** los productos fácilmente.
> Base: 3.236 productos analizados del CSV de Tiendanube.

---

## Decisiones tomadas

1. **Sitio rediseñado** → se queda con sus 4 categorías actuales (Suplementos, Supermercado, Electro-Hogar, El Bananero).
2. **Tiendanube** → recibe la taxonomía COMPLETA (vende todo el catálogo).
3. **Se saca de la columna Categorías** (es ruido, no navegación):
   - `Ofertas` (2.704) → pasa a ser un flag de promo, no categoría
   - `Marcas > ...` (2.117) → ya existe la columna **Marca** (180 marcas), se elimina de Categorías
   - `SuperV2` (581), `Precios de Funkos` (445), `Liquidación`, `MORAHOT` → tags internos/campaña, fuera
4. **Consolidaciones e-commerce** aplicadas (ver árbol).

---

## 🌳 Árbol propuesto para TIENDANUBE (catálogo completo)

### 1. Suplementos  (~1.350 prod — fusiona "Energía y Potenciadores")
- Proteínas y Construcción Muscular
  - Proteínas · Aminoácidos/BCAA · Ganadores de masa · Glutamina
- Creatinas
- Pre-entreno y Energía  *(fusiona Energía y Potenciadores: Pre entreno, Cafeína, Beta Alanine, Carnitina)*
- Quemadores y Definición  *(Quemadores, Pro hormonales)*
- Vitaminas y Minerales  *(Omega 3, Magnesio, Vitaminas y minerales, Salud y Bienestar)*
- Belleza y Cuidado Articular  *(Colágeno)*
- Geles y Barras  *(Barras proteicas)*
- Combos de Suplementos

### 2. Supermercado  (~810 prod — fusiona Bodega, Dulces y Miel, Legumbres y Semillas)
- Almacén
  - Aceites y Vinagres · Harinas y Repostería · Salsas y Condimentos
  - Infusiones · Pasta de Maní · Mermeladas · Barras y Cereales
  - Frutos Secos · Legumbres y Semillas · Dulces y Miel
- Bebidas
  - Vinos y Espumantes · Cervezas *(= "Bodega")*
- Cuidado Personal
  - Higiene Personal · Cuidado del Cabello · Cuidado de la Piel

### 3. Hogar y Electro  (~280 prod — fusiona Pequeños/Grandes Electro + Inodoros Inteligentes)
- Electrodomésticos
  - Cafeteras · Licuadoras · Aspiradoras · Otros
- Cocina  *(Bachas de cocina, Heladeras y Freezer)*
- Baño  *(Bachas, Espejos inteligentes, Inodoros inteligentes, Mingitorios)*
- Herramientas  *(Amoladoras, Cargadores y baterías)*

### 4. Comiquería  (~751 prod)
- Funko Pop  *(Funkos, 4-Pack)*
- Películas  *(Star Wars, Harry Potter, Disney)*
- Anime  *(Dragon Ball, Naruto, Demon Slayer)*
- Marvel  *(Spider-Man)*
- Música  *(BTS, Músicos)*
- Figuras Coleccionables  *(Banpresto)*

### 5. Juguetes  (~268 prod)
- Muñecos y Figuras  *(Muñecas, Robots, Dinosaurios, Peluches, Astronauta)*
- Juegos y Creatividad  *(Bloques, Magnetic, Creativos, Pistolas, Juegos de mesa)*
- Vehículos  *(Autos, Camiones)*

### 6. Mundo Bebé  (~341 prod — fusiona "Accesorios para Bebes y Niños")
- Bebé en general
- Movilidad y Paseo  *(Mochilas, Luncheras, Andadores)*
- Espacio y Comodidad  *(Cuna, Colchón, Alfombra)*

### 7. Bicicletas  (~19 prod)

### 8. El Bananero  *(categoría del rediseño — productos a definir: cerveza Japi, snacks picantes)*

---

## 🌐 Mapeo al SITIO REDISEÑADO (4 categorías)

| Nav del sitio   | Qué incluye del árbol Tiendanube |
|-----------------|----------------------------------|
| **Suplementos** | Categoría 1 completa |
| **Supermercado**| Categoría 2 completa |
| **Electro-Hogar**| Categoría 3 (Hogar y Electro) |
| **El Bananero** | Categoría 8 |

> Comiquería, Juguetes, Mundo Bebé y Bicicletas **no** se muestran en el sitio rediseñado
> (decisión tomada) — viven solo en Tiendanube.

---

## ⚠️ Puntos que necesitan tu validación

1. **"Energía y Potenciadores"** (164 prod): ¿lo fusiono dentro de Suplementos (como propongo) o lo dejás como categoría madre separada?
2. **Films/series sueltos en Comiquería** ("Películas" sin subnivel, 95 prod): ¿van a una sub genérica "Películas > Otros"?
3. **32 productos sin categoría**: hay que clasificarlos uno por uno usando nombre/descripción. ¿Lo hago automático (con revisión) o querés verlos?
4. **"Suplementos sin subnivel"** (411 prod) y otros "(sin subnivel)": tienen categoría madre pero no sub. Hay que inferir la sub por nombre/descripción del producto (ej: "Whey Protein" → Proteínas).

---

## Próximos pasos (una vez aprobado el árbol)

1. Construir tabla de reglas: `valor viejo → categoría nueva`
2. Inferir subcategoría por nombre/descripción para los "(sin subnivel)"
3. Generar **CSV corregido** para reimportar a Tiendanube
4. Actualizar **filtros/páginas de categoría** en el sitio rediseñado con la nueva estructura
