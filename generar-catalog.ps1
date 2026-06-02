# =============================================================
# GENERAR-CATALOG.PS1
# Lee tiendanube-2268228-*.csv y emite assets/catalog-data.js
# con la clasificación final decidida con el cliente.
# Re-ejecutable: bajás un CSV nuevo → corrés el script → se actualiza el JS.
# =============================================================

param(
  [string]$CsvPath = 'tiendanube-2268228-17792207886162381057257057011.csv',
  [string]$Out = 'assets/catalog-data.js'
)

$ErrorActionPreference = 'Stop'

# --- 1. MAPEO MARCA -> VERTICAL ------------------------------
$marcasSacar = @('Elite','Estrella','Red Bull','Corona','Quilmes','Higienol','Comodin','Huggies','Plenitud','Indas','Neix')
$marcasSup = @('Star Nutrition','Ena','Ena Sport','Pgn','Natural Whey','Gold Nutrition','Innovanaturals','Body Advance','Labs Nutrition','Leguilab','Vitamin Way','Hoch Sport','Framingham Pharma','Nutrilab','Breaking Lab','Eth Nutrition','Universal Nutrition','Nutrex Research','Optimum','Bsn','Woman Supplements','Protein Project','Gentech','My Protein','Atlhetica Nutrition','Ultimate Nutrition','Cellucor','Muscletech','Optimum Nutrition','Nucleo Fit','Isopure','Insane Labz','Legend Nutrition','Granger','Mervick','Garden House','Athomx','Full Power','Qmax','Serrapep','Legend','Vits','Bigual','Vitalgy','Natuliv','Natural Nutrition','Quelat','Every Day Nature')
$marcasSuperMercado = @('Entrenuts','Main Fusion','Crudda','Zuelo','Nonisec','Zuccardi','Ambos','ambos','Babysec','Ladysoft','Baldo')
$marcasElectro = @('Ultracomb','Yelmo','Triton','Lusqtoff','Kanji','Einhell','Qualika','San-Up')
$marcasBananero = @('Japi','Perro Callejero')
$marcasBodega = @('Fuego Blanco','Malcriado','Mosquita Muerta','Flintstone','La Celia','Gin Terrier','Ken Brown','Fond de Cave','Cordero Piel de Lobo','Cicchitti','Federico Alvear','Elementos','Margarita')

# Whitelist: marcas que se muestran AÚN sin stock (editar acá si querés excepciones)
$marcasSiempre = @()

# --- 2. CLASIFICADORES POR SUB-TIPO --------------------------
function ClasificarSuplementos($nombre, $marca) {
  $n = $nombre.ToLower()
  if ($marca -eq 'Breaking Lab' -and $n -match 'lecitina|ácido|acido|amonio cuaternario|vaselina') { return $null }
  if ($n -match 'orihens|agua micelar|bruma facial|emulsion facial|serum facial|crema facial|tonico facial|limpiador facial|exfoliante facial') { return $null }
  if ($n -match '\bshaker\b|vaso shaker|coctelera|pastillero|cinturon de pesa|cinturón de pesa|guantes para entrenar|tobillera') { return $null }
  if ($n -match '\bcafeina\b|\bcaffeine\b|\bcafeína\b|\bcafeine\b') { return 'cafeina-energia' }
  if ($n -match 'carbo energy|hydroplus|just carbs|carbo complex|vitalgen|isotónic|isotonic|electrolit|hidratación|hidratacion|foursport') { return 'carbo-isotonicos' }
  if ($n -match '\bcombo\b|\bpack x\d|\bkit\b') { return 'combos' }
  if ($n -match 'pre\s*entren|pre\s*workout|preworkout|c4 original|\bpump\b|ripped|hyde|jack3d|wrecker|\bstim|nitric\b|nitrix|explosive|óxido nítrico|oxido nitrico|akg\b|alpha-ketoglutarate|psychotic|pre work\b|pre-entrenamiento') { return 'pre-entrenos' }
  if ($n -match 'creatina|creatine|creapure|monohidrato|crea shock|crea \d|crea\s|crea-') { return 'creatinas' }
  if ($n -match 'mass gainer|weight gainer|ganador|gainer|hipercalor|hypercalor|mutant mass|ultra mass|hyper mass|super ultra mass|mass builder|serious mass|true mass') { return 'ganadores' }
  if ($n -match 'whey|isolate|\bprotein\b|proteina|proteína|casein|caseina|nitro tech|iso 100|gold standard|combat |syntha|matrix protein|hidrolizada|hidrolizado|isoprot|prot 100|proteína vegetal|proteina vegetal|albumin|albúmin') { return 'proteinas' }
  if ($n -match '\bbcaa\b|amino \d|amino2|amino3|amino5|amino9|amino x|amino3000|aminoacid|glutamina|leucina|arginina|citrulina|\beaa\b|carnitin|hmb\b|beta alanina|beta-alanina|beta alanine|beta-alanine|taurina|reload|recovery|recuperacion|recuperación|aminoácidos|aminos\b|amino energy|amin\.o\.|amino beef') { return 'bcaa-aminos' }
  if ($n -match 'quemador|thermo|fat burner|\blipo\b|lipo6|lipo 6|\bcla\b|hydroxycut|hydroxy max|hydroxy|burner|garcinia|cetonas|keto|detox|cuts\b|bloqueador|adelgazante|black cuts|metabolic|carb block|reductor|reductora|cetona|forskolin|sinetrol|orlistat|psyllium|chitosan|piperina|obesidad|buti smart|cetogen|termogénico|termogenico|satial|inferno|carb controller|faseolamina|quema grasa|adelgazar') { return 'quemadores' }
  if ($n -match '\bbarra|barras |\bbar\s*$|iron bar|snack bar|alfajor|gomitas|\bgel\b|chocolinas|cookies proteic|pancakes proteic|omelette proteic|cupcakes proteic|panqueque proteic|donas proteic|brownie proteic|muffin proteic|wafer proteic|granola proteic|harina proteic|cookies prote|pancakes prote') { return 'snacks-proteicos' }
  if ($n -match 'vitamina|vitamin\b|multivit|magnesio|magnesium|calcio|zinc|hierro|biotin|complejo b|colágeno|colageno|collagen|melatonina|ginkgo|ginko|ginseng|omega|aceite de pescado|nad\b|nmn\b|nac\b|resveratrol|coq10|coenzima|ashwagand|propóleo|propoleo|sod\b|superóxido|dismutasa|hialur|bisglicinato|testo|colina|adaptógeno|hígado|higado|glutathion|triptofano|passiflora|probiotic|enzimas|digestiv|triphala|cobre|antiox|antioxidante|inmun|inmuni|prostat|menopaus|próstata|valeriana|salvia|jengibre|cúrcuma|curcuma|maca\b|guarana|cardo mariano|reishi|moringa|chia|spirulina|espirulina|alfalfa|cardo|silimarin|selenio|astaxantina|q10\b|citrato|melaton|potasio|cromo|silica|silice|piridoxina|carbonato|levadura|colostro|coloidal|esencias|fibra|fitoterapia|alcachofa|aloe|piña vera|salud|bienestar|cabello|andino|varices|migraña|colesterol|insomnio|estrés|estres|uña de gato|uncaria|melena de leon|melena de león|menstrual|venostil|hammamelis|tilo|bardana|niacina|colmillot|aceite esencial|aceite de orégano|aceite de oregano|aceite de romero|msm\b|menorest|menopausia|tribulus|sterol|anabol|hormona|hormone|stak\b|alfa lipoico|alfa-lipoico|stress|ansiedad|cognitivo|memoria|focus|fertilid|articulaciones|articular|condro|fucus|zma\b|glicerina|innerx|grow\b|nervocalm|nutrilvision|centella|power bronz|animal pak|clorofila|cleanse|metasitol|live fem|pharmahepat|novo pharmatos|vigorizante|energía sexual|complex quelat|cados total|quelat minerales|ampk|óseo|oseo|nucleo|serrapep|sport muscle|sulfato|epsom|cloruro|sales de epsom|bicarbonato|betacaroteno|aceite de coco|coco neutro|coco virgen') { return 'vitaminas-salud' }
  return 'otros'
}

function ClasificarSuper($nombre, $marca) {
  $n = $nombre.ToLower()
  if ($marca -in @('Nonisec','Ambos','ambos','Babysec','Ladysoft') -or $n -match 'pañal|panal|incontinencia|zalea|apósito|aposito|toallita húmeda|toallita humeda|protector diario|toalla femenina|toallita higienic') { return 'panales-absorbentes' }
  if ($marca -eq 'Baldo' -or $n -match 'yerba mate|yerba\b') { return 'yerba-mate' }
  if ($marca -eq 'Main Fusion') { return 'salsas-jarabes' }
  if ($marca -eq 'Crudda') { return 'barritas-fit' }
  if ($marca -in @('Laur','Zuelo','Zuccardi')) { return 'aceites-vinagres' }
  if ($marca -eq 'Entrenuts') {
    if ($n -match 'pasta de mani|pasta mani|pasta maní|manteca') { return 'pasta-mani' }
    if ($n -match 'aceite de coco|coco neutro|coco virgen') { return 'aceites-vinagres' }
    if ($n -match 'miel|ghee') { return 'miel-endulzantes' }
    if ($n -match 'maní|mani tostado') { return 'frutos-secos' }
    return 'almacen-fit'
  }
  return 'otros'
}

function ClasificarElectro($nombre, $marca) {
  $n = $nombre.ToLower()
  if ($marca -eq 'San-Up') { return 'salud-medicion' }
  if ($marca -in @('Qualika','Triton')) { return 'bano-espejos' }
  if ($marca -eq 'Einhell' -or $n -match 'taladr|amolad|sierra|cortacerc|motosierra|atornill|cargador y batería|cargador y bateria') { return 'herramientas' }
  if ($n -match 'plancha\b|alisador|planchita|secador de pelo|secador |depiladora|cortadora de cabello|cepillo secador|secador sc-') { return 'cuidado-personal' }
  if ($n -match 'lavarropa|lavasecarropas|heladera|freezer|secadora por|proyector|estéreo|estereo|parlante|bluetooth|frigobar') { return 'grandes-electro' }
  if ($n -match 'caloventor|ventilador|aire acondicionado|estufa|calefactor|panel calefactor|climatiz|turbo \d') { return 'climatizacion' }
  if ($n -match 'aspirador|aspiradora|escoba eléctrica|escoba electrica|robot') { return 'limpieza' }
  if ($n -match 'cafetera|tostadora|sandwicher|waflera|pava\b|jarra eléctrica|jarra electrica|hervidor|tetera|espresso|cafe espresso|molinillo de cafe|licuadora|batidora|picadora|procesadora|juguera|extractor|exprimidor|rallador|sopera|yogurter|panqueque|panequeque|fabrica de pan|panificadora|horno de pan|horno para pan|panquequera|sellador|vacío|vacio|espumador|horno de mesa|horno eléctrico|horno electrico|olla eléctrica|olla electrica|olla a presión|olla a presion|olla multifuncion|olla multifunción|anafe|freidora|freidor|air fryer|airfryer|fabricadora de hielo|cava de vino|pochoclera|microondas|balanza de cocina') { return 'cocina-electrica' }
  if ($n -match 'balanza\b') { return 'salud-medicion' }
  return 'otros'
}

function ClasificarBodega($nombre) {
  $n = $nombre.ToLower()
  if ($n -match '\bgin\b|terrier|vodka|whisky|whiskey|\bron\b|fernet|aperitivo|jagermeister|campari|cynar|jameson|chivas|vermut|vermouth|tapaus') { return 'destilados' }
  if ($n -match 'espumante|champagne|champa|extra brut|brut nature|prosecco|cava') { return 'espumantes' }
  if ($n -match 'chardonnay|sauvignon blanc|torrontés|torrontes|moscato|riesling|vino blanco|\bblanco\b') { return 'vinos-blancos' }
  if ($n -match '\brosé\b|\brose\b|rosado') { return 'vinos-rosados' }
  return 'vinos-tintos'
}

function ClasLaur($n) {
  if ($n -match '^Vino|Pispi|Mosquita Muerta|Cordero') { return 'bodega' }
  return 'super'
}

# --- 3. PARSE CSV --------------------------------------------
$csvData = Import-Csv -Path $CsvPath -Delimiter ';' -Encoding Default
$prods = $csvData | Where-Object { $_.Nombre -and $_.Nombre -ne '' }

# Imagen placeholder por sub-tipo
$imgPlaceholders = @{
  'proteinas'='assets/products/whey-star-choc.png';
  'creatinas'='assets/products/creatina-monohidrato.png';
  'pre-entrenos'='assets/products/pre-entreno-generic.png';
  'bcaa-aminos'='assets/products/bcaa-generic.png';
  'quemadores'='assets/products/quemador-generic.png';
  'vitaminas-salud'='assets/products/vitaminas-generic.png';
  'combos'='assets/products/combo-generic.png';
  'cafeina-energia'='assets/products/cafeina-generic.png';
  'ganadores'='assets/products/gainer-generic.png';
  'snacks-proteicos'='assets/products/barra-generic.png';
  'carbo-isotonicos'='assets/products/isotonico-generic.png';
}
$imgDefault = 'assets/products/whey-star-choc.png'

# --- 4. CLASIFICAR Y FILTRAR ---------------------------------
$byCat = @{ suplementos=@(); supermercado=@(); electro=@(); bananero=@(); bodega=@() }

foreach ($p in $prods) {
  $m = $p.Marca; if (-not $m) { continue }
  if ($marcasSacar -contains $m) { continue }

  # Vertical
  $cat = $null
  if ($m -eq 'Laur') { $cat = (ClasLaur $p.Nombre).Replace('super','supermercado') }
  elseif ($m -eq 'Crown Mustang') { $cat = 'electro' }
  elseif ($marcasSup -contains $m) { $cat = 'suplementos' }
  elseif ($marcasSuperMercado -contains $m) { $cat = 'supermercado' }
  elseif ($marcasElectro -contains $m) { $cat = 'electro' }
  elseif ($marcasBananero -contains $m) { $cat = 'bananero' }
  elseif ($marcasBodega -contains $m) { $cat = 'bodega' }
  if (-not $cat) { continue }

  # Filtros user: Mostrar=SI + Stock>0 (excepto whitelist)
  if ($p.'Mostrar en tienda' -ne 'SI') { continue }
  $stock = [int]$p.Stock
  if ($stock -le 0 -and -not ($marcasSiempre -contains $m)) { continue }

  # Sub-tipo
  $tipo = $null
  switch ($cat) {
    'suplementos' { $tipo = ClasificarSuplementos $p.Nombre $m }
    'supermercado' { $tipo = ClasificarSuper $p.Nombre $m }
    'electro' { $tipo = ClasificarElectro $p.Nombre $m }
    'bananero' { $tipo = 'bananero' }
    'bodega' { $tipo = ClasificarBodega $p.Nombre }
  }
  if (-not $tipo) { continue }

  # Precio (formato CSV "27,550.00" — coma miles, punto decimal)
  $cu = [cultureinfo]::GetCultureInfo('en-US')
  $precio = 0; $promo = 0
  if ($p.Precio) { $precio = [int][decimal]::Parse($p.Precio, $cu) }
  if ($p.'Precio promocional') { $promo = [int][decimal]::Parse($p.'Precio promocional', $cu) }
  if ($precio -eq 0) { continue }

  $now = if ($promo -gt 0 -and $promo -lt $precio) { $promo } else { $precio }
  $was = if ($promo -gt 0 -and $promo -lt $precio) { $precio } else { 0 }

  # Imagen placeholder
  $img = if ($imgPlaceholders.ContainsKey($tipo)) { $imgPlaceholders[$tipo] } else { $imgDefault }

  $byCat[$cat] += [PSCustomObject]@{
    brand = $m
    name = $p.Nombre
    price = "$ " + $now.ToString('N0', [cultureinfo]'es-AR')
    was = if ($was -gt 0) { "$ " + $was.ToString('N0', [cultureinfo]'es-AR') } else { '' }
    img = $img
    handle = $p.'Identificador de URL'
    sku = $p.SKU
    stock = $stock
    types = @($tipo)
  }
}

# --- 5. EMIT JS ----------------------------------------------
function Esc($s) {
  if ($null -eq $s) { return '' }
  return ($s -replace '\\', '\\' -replace "'", "\'" -replace '`', '\`' -replace "`r`n", ' ' -replace "`n", ' ')
}

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine('/* AUTO-GENERADO POR generar-catalog.ps1 — NO EDITAR A MANO */')
[void]$sb.AppendLine('/* Re-generar: powershell ./generar-catalog.ps1 */')
[void]$sb.AppendLine('window.CATALOG_BY_CAT = {')

$cats = @('suplementos','supermercado','electro','bananero','bodega')
foreach ($c in $cats) {
  [void]$sb.AppendLine("  $c`: [")
  foreach ($p in $byCat[$c]) {
    $types = "['" + ($p.types -join "','") + "']"
    $was = if ($p.was) { ", was: '$(Esc $p.was)'" } else { '' }
    [void]$sb.AppendLine("    { brand:'$(Esc $p.brand)', name:'$(Esc $p.name)', price:'$(Esc $p.price)'$was, img:'$($p.img)', handle:'$(Esc $p.handle)', sku:'$(Esc $p.sku)', stock:$($p.stock), types:$types },")
  }
  [void]$sb.AppendLine('  ],')
}
[void]$sb.AppendLine('};')

# Escribir UTF-8 sin BOM para compatibilidad con browsers
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText((Resolve-Path -LiteralPath '.').Path + [System.IO.Path]::DirectorySeparatorChar + $Out, $sb.ToString(), $utf8NoBom)

"=== catalog-data.js generado ==="
"Archivo: $Out"
foreach ($c in $cats) { "  ${c}: $($byCat[$c].Count) productos" }
"Total visible: $(($byCat.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum)"
