
(function(){
  // Render grid de marcas desde catalog-data.js
  const grid = document.getElementById('brandsGrid');
  const data = (window.CATALOG_BY_CAT && window.CATALOG_BY_CAT.suplementos) || [];
  if (!grid) return;

  // Contar productos por marca
  const counts = {};
  data.forEach(p => {
    const brand = (p.brand || '').trim();
    if (!brand) return;
    counts[brand] = (counts[brand] || 0) + 1;
  });

  // Ordenar por cantidad descendente
  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);

  // Slug para link de filtro
  function slug(s){
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  grid.innerHTML = sorted.map(([brand, count]) => `
    <a class="brand-card" href="suplementos.html?marca=${encodeURIComponent(brand)}">
      <span class="brand-card-name">${brand}</span>
      <span class="brand-card-count">${count} ${count === 1 ? 'producto' : 'productos'}</span>
      <span class="brand-card-cta">Ver productos <span class="arr">→</span></span>
    </a>
  `).join('');

  if (!sorted.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1;padding:40px 0">No hay marcas cargadas.</p>';
  }
})();
