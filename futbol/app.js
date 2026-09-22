/* ==========================================================================
   Fútbol del grupo — equipos, ranking (puntos, goles, asistencias,
   calificación) y control de pagos de la cancha.

   Datos:
   - Modo compartido: /api/futbol (Vercel KV). Todos ven lo mismo; solo el
     encargado (con PIN) edita partidos, equipos, resultados y certifica pagos.
     Cualquiera puede avisar que pagó (comprobante o efectivo).
   - Modo local: si la API no está disponible, todo queda en este navegador.
   ========================================================================== */

(function () {
  'use strict';

  const API = '/api/futbol';
  const LS_STATE = 'futbol:state';
  const LS_RECEIPTS = 'futbol:receipts';
  const LS_FILE = 'futbol:file:';
  const SS_PIN = 'futbol:pin';

  const MAX_FILE_CHARS = 900000;

  const store = {
    mode: 'loading',          // 'remote' | 'local'
    state: null,
    version: 0,
    receipts: {},             // "matchId:playerId" → meta del aviso de pago
    pin: null,
    adminPinSet: true,
  };

  const ui = { rankingTab: 'tabla', afterNav: null };

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const money = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('es-AR');

  function fmtDate(iso, opts) {
    if (!iso) return 'Sin fecha';
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-AR', opts || { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function fmtDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) { /* sin storage */ } }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { toast('No hay más espacio en este dispositivo', true); return false; }
  }

  let toastTimer;
  function toast(msg, isError) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.toggle('is-error', Boolean(isError));
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
  }

  /* ---------------------------------------------------------------------
     Estado
     --------------------------------------------------------------------- */
  function defaultState() {
    return {
      settings: {
        groupName: 'Fútbol del grupo',
        playersPerTeam: 7,
        pointsWin: 3,
        pointsDraw: 1,
        pointsLoss: 0,
        defaultCost: 0,
        defaultPlace: '',
        defaultTime: '21:00',
      },
      players: [],
      matches: [],
    };
  }

  function normalize(s) {
    const base = defaultState();
    if (!s || typeof s !== 'object') return base;
    return {
      settings: Object.assign(base.settings, s.settings || {}),
      players: Array.isArray(s.players) ? s.players : [],
      matches: Array.isArray(s.matches) ? s.matches.map(normalizeMatch) : [],
    };
  }

  function normalizeMatch(m) {
    return Object.assign({
      id: uid(), date: '', time: '', place: '', courtCost: 0, playersPerTeam: 7,
      teams: [{ name: 'Equipo A', playerIds: [] }, { name: 'Equipo B', playerIds: [] }],
      score: null, stats: {}, payments: {}, notes: '',
    }, m);
  }

  const S = () => store.state;
  const isAdmin = () => store.mode === 'local' || Boolean(store.pin);
  const playerById = (id) => S().players.find((p) => p.id === id);
  const matchById = (id) => S().matches.find((m) => m.id === id);
  const playerName = (id) => (playerById(id) || { name: 'Jugador borrado' }).name;
  const participants = (m) => m.teams[0].playerIds.concat(m.teams[1].playerIds);
  const isPlayed = (m) => m.score && Number.isFinite(m.score[0]) && Number.isFinite(m.score[1]);

  function share(m) {
    const n = participants(m).length;
    return n ? Math.ceil((Number(m.courtCost) || 0) / n) : 0;
  }

  function teamOf(m, pid) {
    if (m.teams[0].playerIds.includes(pid)) return 0;
    if (m.teams[1].playerIds.includes(pid)) return 1;
    return -1;
  }

  function sortedMatches() {
    return S().matches.slice().sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || '')));
  }

  /* Estado de pago de un jugador en un partido */
  function payStatus(m, pid) {
    const p = m.payments[pid];
    if (p && p.status === 'pagado') return { kind: 'paid', method: p.method, at: p.confirmedAt, pay: p, receipt: store.receipts[m.id + ':' + pid] };
    const r = store.receipts[m.id + ':' + pid];
    if (r) return { kind: 'review', method: r.method, at: r.uploadedAt, receipt: r };
    return { kind: 'pending' };
  }

  function matchMoney(m) {
    const each = share(m);
    const ids = participants(m);
    let paid = 0; let review = 0;
    ids.forEach((pid) => {
      const st = payStatus(m, pid).kind;
      if (st === 'paid') paid++;
      else if (st === 'review') review++;
    });
    return { each, total: Number(m.courtCost) || 0, count: ids.length, paid, review, collected: paid * each, pending: ids.length - paid };
  }

  /* ---------------------------------------------------------------------
     Carga y guardado
     --------------------------------------------------------------------- */
  async function load() {
    if (location.protocol === 'file:') return loadLocal();
    let res;
    try {
      res = await fetch(API, { cache: 'no-store' });
    } catch (e) {
      return loadLocal();
    }
    // 404: no hay API (servidor estático) · 503: falta configurar Vercel KV
    if (res.status === 404 || res.status === 503) return loadLocal();
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || !json.ok) {
      store.mode = 'error';
      return;
    }
    store.mode = 'remote';
    store.state = normalize(json.state);
    store.version = json.version || 0;
    store.receipts = json.receipts || {};
    store.adminPinSet = json.adminPinSet !== false;
    store.pin = ssGet(SS_PIN);
  }

  function loadLocal() {
    store.mode = 'local';
    store.state = normalize(lsGet(LS_STATE));
    store.receipts = lsGet(LS_RECEIPTS) || {};
  }

  async function reloadRemote() {
    const pin = store.pin;
    await load();
    store.pin = pin;
    render();
  }

  /* Aplica un cambio al estado y lo guarda. Devuelve true si se guardó. */
  async function commit(mutator, okMsg) {
    if (!isAdmin()) { toast('Solo el encargado puede hacer esto', true); return false; }
    const next = normalize(JSON.parse(JSON.stringify(S())));
    mutator(next);

    if (store.mode === 'local') {
      if (!lsSet(LS_STATE, next)) return false;
      store.state = next;
      if (okMsg) toast(okMsg);
      render();
      return true;
    }

    const res = await postJSON({ action: 'save', pin: store.pin, state: next, baseVersion: store.version });
    if (res.status === 401) {
      logout();
      toast('El PIN no es válido. Volvé a entrar como encargado.', true);
      return false;
    }
    if (res.status === 409) {
      toast('Alguien guardó cambios recién. Recargué los datos: repetí la acción.', true);
      await reloadRemote();
      return false;
    }
    if (!res.ok) { toast('No se pudo guardar. Probá de nuevo.', true); return false; }
    store.state = next;
    store.version = res.json.version;
    if (okMsg) toast(okMsg);
    render();
    return true;
  }

  async function postJSON(body) {
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await r.json().catch(() => ({}));
      return { ok: r.ok, status: r.status, json };
    } catch (e) {
      return { ok: false, status: 0, json: {} };
    }
  }

  /* Aviso de pago de un jugador (comprobante o efectivo). No requiere PIN. */
  async function declarePayment(matchId, playerId, method, file, fileName, note) {
    const key = matchId + ':' + playerId;
    if (store.mode === 'local') {
      const meta = { matchId, playerId, method, hasFile: Boolean(file), fileName: fileName || '', note: note || '', uploadedAt: new Date().toISOString() };
      if (file) { if (!lsSet(LS_FILE + key, file)) return false; }
      else { try { localStorage.removeItem(LS_FILE + key); } catch (e) { /* nada */ } }
      store.receipts[key] = meta;
      lsSet(LS_RECEIPTS, store.receipts);
      return true;
    }
    const res = await postJSON({ action: 'upload-receipt', matchId, playerId, method, file, fileName, note });
    if (!res.ok) {
      const msg = res.json.error === 'archivo_muy_grande' ? 'El archivo es muy pesado' : 'No se pudo enviar. Probá de nuevo.';
      toast(msg, true);
      return false;
    }
    store.receipts[key] = res.json.receipt;
    return true;
  }

  async function deleteReceipt(matchId, playerId) {
    const key = matchId + ':' + playerId;
    if (store.mode === 'local') {
      delete store.receipts[key];
      lsSet(LS_RECEIPTS, store.receipts);
      try { localStorage.removeItem(LS_FILE + key); } catch (e) { /* nada */ }
      return true;
    }
    const res = await postJSON({ action: 'delete-receipt', pin: store.pin, matchId, playerId });
    if (!res.ok) { toast('No se pudo borrar el aviso', true); return false; }
    delete store.receipts[key];
    return true;
  }

  async function fetchReceiptFile(key) {
    if (store.mode === 'local') return lsGet(LS_FILE + key);
    try {
      const r = await fetch(API + '?receipt=' + encodeURIComponent(key), { cache: 'no-store' });
      const j = await r.json();
      return j.ok ? j.receipt.file : null;
    } catch (e) { return null; }
  }

  /* Comprime fotos para que entren en el almacenamiento */
  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async function fileToDataUrl(file) {
    if (file.type === 'application/pdf') {
      const url = await readAsDataURL(file);
      if (url.length > MAX_FILE_CHARS) throw new Error('El PDF es muy pesado (máx. ~600 KB). Mandá una captura de pantalla.');
      return url;
    }
    const src = await readAsDataURL(file);
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('No se pudo leer la imagen. Probá con una captura (JPG o PNG).'));
      i.src = src;
    });
    const attempts = [[1400, 0.75], [1100, 0.6], [900, 0.5]];
    for (const [max, q] of attempts) {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const out = c.toDataURL('image/jpeg', q);
      if (out.length <= MAX_FILE_CHARS) return out;
    }
    throw new Error('La imagen es muy pesada.');
  }

  /* ---------------------------------------------------------------------
     Estadísticas y ranking
     --------------------------------------------------------------------- */
  function resultFor(m, pid) {
    const t = teamOf(m, pid);
    if (t < 0 || !isPlayed(m)) return null;
    const mine = m.score[t]; const theirs = m.score[1 - t];
    return mine > theirs ? 'G' : mine < theirs ? 'P' : 'E';
  }

  function pointsFor(res) {
    const st = S().settings;
    if (res === 'G') return Number(st.pointsWin) || 0;
    if (res === 'E') return Number(st.pointsDraw) || 0;
    if (res === 'P') return Number(st.pointsLoss) || 0;
    return 0;
  }

  function mvpOf(m) {
    let best = null; let bestVal = -1;
    participants(m).forEach((pid) => {
      const r = Number((m.stats[pid] || {}).rating);
      if (r > bestVal) { bestVal = r; best = pid; } else if (r === bestVal) best = null; // empate → sin figura
    });
    return bestVal > 0 ? best : null;
  }

  /* Historial de un jugador partido por partido (más reciente primero) */
  function playerHistory(pid) {
    return sortedMatches().filter((m) => teamOf(m, pid) >= 0).map((m) => {
      const st = m.stats[pid] || {};
      const res = resultFor(m, pid);
      return {
        match: m,
        team: teamOf(m, pid),
        res,
        points: res ? pointsFor(res) : 0,
        goals: Number(st.goals) || 0,
        assists: Number(st.assists) || 0,
        rating: Number(st.rating) || null,
        mvp: isPlayed(m) && mvpOf(m) === pid,
        pay: payStatus(m, pid),
        share: share(m),
      };
    });
  }

  function playerTotals(pid) {
    const h = playerHistory(pid);
    const played = h.filter((x) => x.res);
    const rated = played.filter((x) => x.rating);
    return {
      pj: played.length,
      g: played.filter((x) => x.res === 'G').length,
      e: played.filter((x) => x.res === 'E').length,
      p: played.filter((x) => x.res === 'P').length,
      pts: played.reduce((a, x) => a + x.points, 0),
      goals: h.reduce((a, x) => a + x.goals, 0),
      assists: h.reduce((a, x) => a + x.assists, 0),
      avg: rated.length ? rated.reduce((a, x) => a + x.rating, 0) / rated.length : null,
      mvps: h.filter((x) => x.mvp).length,
      debt: h.filter((x) => x.pay.kind !== 'paid').reduce((a, x) => a + x.share, 0),
      form: played.slice(0, 5).map((x) => x.res),
    };
  }

  function rankingRows() {
    return S().players.map((p) => Object.assign({ player: p }, playerTotals(p.id))).filter((r) => r.pj > 0 || r.goals > 0);
  }

  /* ---------------------------------------------------------------------
     Íconos (trazos estilo Lucide, 24×24, stroke 2)
     --------------------------------------------------------------------- */
  const ICONS = {
    ball: '<circle cx="12" cy="12" r="10"/><path d="m12 7 4.2 3-1.6 5H9.4L7.8 10z"/><path d="M12 7V2.5M16.2 10l4.3-1.4M14.6 15l2.7 3.7M9.4 15l-2.7 3.7M7.8 10 3.5 8.6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    shuffle: '<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22M18 2l4 4-4 4M2 6h1.9c1.5 0 2.9.9 3.6 2.2M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8M18 14l4 4-4 4"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    pass: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    transfer: '<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    party: '<path d="M5.8 11.3 2 22l10.7-3.79M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17M11 2l.33.82c.34.86-.2 1.82-1.11 1.98-.7.1-1.22.72-1.22 1.43V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/>',
  };

  function icon(name, cls) {
    return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  }

  function bib(name, team, size) {
    const t = team === 0 ? ' bib--a' : team === 1 ? ' bib--b' : team === 'volt' ? ' bib--volt' : '';
    return `<span class="bib${t}${size ? ' bib--' + size : ''}" aria-hidden="true">${esc(initials(name))}</span>`;
  }

  const shortDate = (iso) => fmtDate(iso, { day: 'numeric', month: 'short' });

  function dateParts(iso) {
    if (!iso) return { dow: '—', day: '?', mon: '' };
    const d = new Date(iso + 'T12:00:00');
    return {
      dow: d.toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', ''),
      day: d.getDate(),
      mon: d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
    };
  }

  const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  /* Medidor: un segmento por jugador, pagados primero */
  function meter(m, lg) {
    const kinds = participants(m).map((pid) => payStatus(m, pid).kind);
    const order = { paid: 0, review: 1, pending: 2 };
    kinds.sort((a, b) => order[a] - order[b]);
    const mm = matchMoney(m);
    const label = `${mm.paid} de ${mm.count} pagaron`;
    return `<div class="meter${lg ? ' meter--lg' : ''}" role="img" aria-label="${label}">` +
      kinds.map((k) => `<i class="${k === 'paid' ? 'is-paid' : k === 'review' ? 'is-review' : ''}"></i>`).join('') + '</div>';
  }

  function meterLegend(m) {
    const mm = matchMoney(m);
    return `<div class="meter-legend">
      <span class="l-paid">${mm.paid} pagaron</span>
      ${mm.review ? `<span class="l-review">${mm.review} a confirmar</span>` : ''}
      <span>${mm.count - mm.paid - mm.review} faltan</span>
    </div>`;
  }

  /* ---------------------------------------------------------------------
     Router
     --------------------------------------------------------------------- */
  function route() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'partidos').split('/');
    return { name: parts[0], id: parts[1] };
  }

  function render() {
    const view = $('#view');
    if (store.mode === 'error') {
      view.innerHTML = `<div class="empty-state">${icon('alert')}<h2>No se pudo cargar</h2><p>Revisá la conexión y recargá la página.</p></div>`;
      return;
    }
    const s = S();
    document.title = s.settings.groupName;
    $('#groupName').textContent = s.settings.groupName;

    const badge = $('#modeBadge');
    badge.hidden = false;
    badge.textContent = store.mode === 'remote' ? 'Compartido' : 'Solo este dispositivo';
    badge.classList.toggle('is-shared', store.mode === 'remote');
    badge.title = store.mode === 'remote' ? 'Todos ven los mismos datos' : 'Los datos quedan guardados solo en este navegador';

    const adminBtn = $('#adminBtn');
    adminBtn.hidden = store.mode === 'local';
    adminBtn.innerHTML = icon(isAdmin() ? 'unlock' : 'lock') + '<span>Encargado</span>';
    adminBtn.setAttribute('aria-pressed', String(isAdmin()));
    adminBtn.classList.toggle('is-admin', isAdmin());

    const r = route();
    const tab = { partido: 'partidos', jugador: 'jugadores' }[r.name] || r.name;
    document.querySelectorAll('.tabs a').forEach((a) => {
      const on = a.dataset.tab === tab;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });

    const views = {
      partidos: viewMatches,
      partido: () => viewMatch(r.id),
      pagos: viewPayments,
      ranking: viewRanking,
      jugadores: viewPlayers,
      jugador: () => viewPlayer(r.id),
      ajustes: viewSettings,
    };
    view.innerHTML = (views[r.name] || viewMatches)();
  }

  /* ---------------------------------------------------------------------
     Vistas
     --------------------------------------------------------------------- */
  /* Partido destacado: el próximo a jugar o, si no hay, el último que falta cobrar */
  function featuredMatch() {
    const today = todayISO();
    const upcoming = S().matches.filter((m) => !isPlayed(m) && m.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (upcoming[0]) return { m: upcoming[0], label: 'Próximo partido' };
    const owed = sortedMatches().find((m) => { const mm = matchMoney(m); return mm.count && mm.paid < mm.count; });
    return owed ? { m: owed, label: 'Falta cobrar' } : null;
  }

  function viewMatches() {
    const admin = isAdmin();
    if (!S().players.length) {
      return `<div class="empty-state">${icon('shirt')}<h2>Armemos el grupo</h2>
        <p>Primero cargá a los jugadores. Después creás los partidos con el monto de la cancha.</p>
        <a class="btn btn--primary" href="#/jugadores">${icon('users')}Cargar jugadores</a></div>`;
    }

    const feat = featuredMatch();
    const next = feat && feat.m;
    const rest = sortedMatches().filter((m) => !next || m.id !== next.id);
    const today = todayISO();

    let html = `<div class="view-head">
      <div><h1>Partidos</h1><p>${S().matches.length ? S().matches.length + ' en la temporada' : 'Todavía no hay partidos'}</p></div>
      ${admin ? `<button class="btn btn--primary" data-action="new-match">${icon('plus')}Nuevo partido</button>` : ''}
    </div>`;

    if (next) {
      const mm = matchMoney(next);
      html += `<a class="pitch next" href="#/partido/${esc(next.id)}">
        <span class="eyebrow">${icon(feat.label === 'Falta cobrar' ? 'wallet' : 'ball')}${feat.label}</span>
        <div class="next__date">${esc(fmtDate(next.date, { weekday: 'long', day: 'numeric' }))}</div>
        ${isPlayed(next) ? `<div class="next__meta"><span class="chip chip--dark">${esc(next.teams[0].name)} ${next.score[0]} - ${next.score[1]} ${esc(next.teams[1].name)}</span></div>` : ''}
        <div class="next__meta">
          ${next.time ? `<span>${icon('clock')}${esc(next.time)}</span>` : ''}
          ${next.place ? `<span>${icon('pin')}${esc(next.place)}</span>` : ''}
          <span>${icon('users')}${mm.count} jugadores</span>
        </div>
        <div class="next__money">
          <div class="next__each"><small>Cada uno paga</small>${money(mm.each)}</div>
          <div class="next__total">Cobrado<strong>${money(mm.collected)} / ${money(mm.total)}</strong></div>
        </div>
        ${mm.count ? meter(next, true) + meterLegend(next) : '<p class="muted">Todavía no se armaron los equipos.</p>'}
        <span class="btn btn--primary btn--block next__cta">${icon('wallet')}Ver equipos y pagar</span>
      </a>`;
    }

    if (!S().matches.length) {
      html += `<div class="empty-state">${icon('calendar')}<h2>Sin partidos</h2>
        <p>${admin ? 'Creá el primero: fecha, cancha y cuánto sale el alquiler.' : 'Cuando el encargado cree un partido va a aparecer acá.'}</p></div>`;
      return html;
    }

    if (rest.length) {
      html += `<div class="section__head"><h2>${next ? 'Todos los partidos' : 'Partidos'}</h2></div><div class="tickets">`;
      html += rest.map((m) => {
        const mm = matchMoney(m);
        const d = dateParts(m.date);
        const status = !mm.count ? `<span class="chip">Sin equipos</span>`
          : mm.paid === mm.count ? `<span class="chip chip--paid">${icon('check')}Todo pago</span>`
            : `<span class="chip chip--due">${icon('x')}${mm.count - mm.paid} deben</span>`;
        return `<a class="ticket${m.date < today ? ' is-past' : ''}" href="#/partido/${esc(m.id)}">
          <div class="ticket__stub"><span class="ticket__dow">${esc(d.dow)}</span><span class="ticket__day">${d.day}</span><span class="ticket__mon">${esc(d.mon)}</span></div>
          <div class="ticket__body">
            <div class="ticket__row">
              <div style="min-width:0">
                <div class="ticket__place">${esc(m.place || 'Cancha')}</div>
                <div class="ticket__sub">${esc(m.time || '')}${m.time ? ' · ' : ''}${money(mm.each)} c/u</div>
              </div>
              ${isPlayed(m) ? `<div class="ticket__score" aria-label="Resultado ${m.score[0]} a ${m.score[1]}"><span class="a">${m.score[0]}</span><span class="sep">-</span><span class="b">${m.score[1]}</span></div>` : '<span class="chip">Por jugar</span>'}
            </div>
            ${mm.count ? meter(m) : ''}
            <div class="ticket__row"><span class="ticket__sub">${money(mm.collected)} de ${money(mm.total)}</span>${status}</div>
          </div>
        </a>`;
      }).join('');
      html += '</div>';
    }
    return html;
  }

  function viewMatch(id) {
    const m = matchById(id);
    if (!m) return `<a class="back" href="#/partidos">${icon('back')}Partidos</a><div class="empty-state">${icon('alert')}<h2>No existe</h2><p>Ese partido fue borrado.</p></div>`;
    const admin = isAdmin();
    const mm = matchMoney(m);
    const mvp = isPlayed(m) ? mvpOf(m) : null;
    const played = isPlayed(m);

    const teamCol = (t) => {
      const team = m.teams[t];
      const items = team.playerIds.map((pid) => {
        const st = m.stats[pid] || {};
        const bits = [];
        if (st.goals) bits.push(`<span title="Goles">${icon('ball')}${st.goals}<span class="sr-only"> goles</span></span>`);
        if (st.assists) bits.push(`<span title="Asistencias">${icon('pass')}${st.assists}<span class="sr-only"> asistencias</span></span>`);
        if (st.rating) bits.push(`<span class="star" title="Calificación">${icon('star')}${st.rating}</span>`);
        return `<li>${bib(playerName(pid), t)}<a class="player-link" href="#/jugador/${esc(pid)}">${esc(playerName(pid))}</a><span class="statline">${bits.join('')}</span></li>`;
      }).join('');
      return `<div class="team-col team-col--${t ? 'b' : 'a'}">
        <div class="team-col__head"><h3>${esc(team.name)}</h3><span class="team-col__count">${team.playerIds.length}/${m.playersPerTeam}</span></div>
        <ul class="roster">${items || '<li class="is-empty">Sin jugadores todavía</li>'}</ul>
      </div>`;
    };

    return `
      <a class="back" href="#/partidos">${icon('back')}Partidos</a>

      <section class="pitch board" aria-label="Marcador">
        <div class="board__date">${esc(fmtDate(m.date))}</div>
        <div class="board__meta">
          ${m.time ? `<span>${icon('clock')}${esc(m.time)}</span>` : ''}
          ${m.place ? `<span>${icon('pin')}${esc(m.place)}</span>` : ''}
        </div>
        <div class="board__row">
          <div class="board__team board__team--a">${bib('A', 0)}${esc(m.teams[0].name)}</div>
          <div class="board__score${played ? '' : ' is-vs'}">${played ? m.score[0] + '-' + m.score[1] : 'VS'}</div>
          <div class="board__team board__team--b">${bib('B', 1)}${esc(m.teams[1].name)}</div>
        </div>
        ${mvp ? `<div class="board__mvp">${icon('star')}Figura: <strong>${esc(playerName(mvp))}</strong> · ${m.stats[mvp].rating}</div>` : ''}
        ${admin ? `<div class="board__actions">
          ${participants(m).length ? `<button class="btn" data-action="edit-result" data-id="${esc(m.id)}">${icon('ball')}${played ? 'Editar resultado' : 'Cargar resultado'}</button>` : ''}
          <button class="btn" data-action="edit-match" data-id="${esc(m.id)}">${icon('edit')}Datos</button>
          <button class="btn btn--danger" data-action="delete-match" data-id="${esc(m.id)}" aria-label="Borrar partido">${icon('trash')}</button>
        </div>` : ''}
      </section>

      <section class="section" id="pagos">
        <div class="section__head">
          <div><h2>Pagos de la cancha</h2><p>El alquiler se divide entre los ${mm.count} que juegan</p></div>
          <button class="btn" data-action="copy-summary" data-id="${esc(m.id)}">${icon('copy')}Copiar para WhatsApp</button>
        </div>
        <div class="card collect">
          <div class="collect__top">
            <div><div class="collect__label">Cobrado</div><div class="collect__big">${money(mm.collected)} <small>/ ${money(mm.total)}</small></div></div>
            <div class="collect__each"><div class="collect__label">Cada uno</div><strong>${money(mm.each)}</strong></div>
          </div>
          ${mm.count ? `<div>${meter(m, true)}${meterLegend(m)}</div>` : ''}
        </div>
        ${paymentRows(m)}
      </section>

      <section class="section">
        <div class="section__head">
          <div><h2>Equipos</h2><p>${m.playersPerTeam} por equipo</p></div>
          ${admin ? `<button class="btn" data-action="edit-teams" data-id="${esc(m.id)}">${icon('shirt')}Armar equipos</button>` : ''}
        </div>
        <div class="grid-2">${teamCol(0)}${teamCol(1)}</div>
      </section>

      ${played ? `<section class="section">
        <div class="section__head"><div><h2>Estadísticas</h2><p>Goles, asistencias, calificación y puntos</p></div></div>
        <div class="card">${statsTable(m)}</div>
      </section>` : ''}

      ${m.notes ? `<section class="section"><div class="section__head"><h2>Notas</h2></div><div class="card"><p class="muted" style="white-space:pre-wrap;margin:0">${esc(m.notes)}</p></div></section>` : ''}
    `;
  }

  function statsTable(m) {
    const rows = [0, 1].map((t) => m.teams[t].playerIds.map((pid) => {
      const st = m.stats[pid] || {};
      const res = resultFor(m, pid);
      return `<tr>
        <td><a class="player-link" href="#/jugador/${esc(pid)}">${bib(playerName(pid), t, 'sm')}${esc(playerName(pid))}</a></td>
        <td><span class="res res--${res}">${res}</span></td>
        <td class="num">${Number(st.goals) || 0}</td>
        <td class="num">${Number(st.assists) || 0}</td>
        <td class="num">${st.rating ? st.rating : '—'}</td>
        <td class="num big">${pointsFor(res)}</td>
      </tr>`;
    }).join('')).join('');
    return `<div class="table-wrap"><table>
      <thead><tr><th>Jugador</th><th>Res.</th><th class="num">Goles</th><th class="num">Asist.</th><th class="num">Calif.</th><th class="num">Pts</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function payLabel(ps) {
    const method = ps.method === 'efectivo' ? 'Efectivo' : 'Transferencia';
    if (ps.kind === 'paid') {
      return { cls: 'is-paid', status: `<span class="pay-status pay-status--paid">${icon('check')}Pagó · ${method}</span>`, chip: `<span class="chip chip--paid">${icon('check')}Pagó</span>`,
        detail: 'Certificado por el encargado' + (ps.at ? ' · ' + fmtDateTime(ps.at) : '') + (ps.pay && ps.pay.note ? ' · ' + ps.pay.note : '') };
    }
    if (ps.kind === 'review') {
      return { cls: 'is-review', status: `<span class="pay-status pay-status--review">${icon('clock')}A confirmar · ${method}</span>`, chip: `<span class="chip chip--review">${icon('clock')}A confirmar</span>`,
        detail: (ps.method === 'efectivo' ? 'Dice que pagó en efectivo' : 'Subió el comprobante') + ' · ' + fmtDateTime(ps.at) + (ps.receipt && ps.receipt.note ? ' · "' + ps.receipt.note + '"' : '') };
    }
    return { cls: '', status: `<span class="pay-status pay-status--due">${icon('x')}Debe</span>`, chip: `<span class="chip chip--due">${icon('x')}Debe</span>`, detail: '' };
  }

  function paymentRows(m) {
    const ids = participants(m);
    if (!ids.length) return '<p class="muted">Armá los equipos para dividir el monto.</p>';
    const admin = isAdmin();
    const order = { pending: 0, review: 1, paid: 2 };
    const sorted = ids.slice().sort((a, b) => order[payStatus(m, a).kind] - order[payStatus(m, b).kind] || playerName(a).localeCompare(playerName(b)));

    return '<div class="pay-list">' + sorted.map((pid) => {
      const ps = payStatus(m, pid);
      const lab = payLabel(ps);
      const d = `data-match="${esc(m.id)}" data-player="${esc(pid)}"`;
      const viewBtn = ps.receipt && ps.receipt.hasFile ? `<button class="btn btn--sm" data-action="view-receipt" ${d}>${icon('eye')}Comprobante</button>` : '';
      let side = '';
      const actions = [];
      if (admin) {
        if (viewBtn) actions.push(viewBtn);
        if (ps.kind !== 'paid') {
          actions.push(`<button class="btn btn--paid" data-action="confirm-pay" data-method="efectivo" ${d}>${icon('cash')}Pagó efectivo</button>`);
          actions.push(`<button class="btn btn--paid" data-action="confirm-pay" data-method="transferencia" ${d}>${icon('transfer')}Pagó transf.</button>`);
          if (ps.kind === 'review') actions.push(`<button class="btn btn--danger" data-action="reject-pay" ${d}>${icon('x')}Rechazar</button>`);
        } else {
          side = `<button class="btn btn--ghost btn--sm" data-action="undo-pay" ${d} aria-label="Anular pago de ${esc(playerName(pid))}">${icon('undo')}Anular</button>`;
        }
      } else if (ps.kind === 'pending') {
        side = `<button class="btn btn--primary btn--sm" data-action="declare" ${d}>${icon('upload')}Avisar pago</button>`;
      } else if (ps.kind === 'review') {
        side = `<button class="btn btn--sm" data-action="declare" ${d}>Cambiar</button>`;
      } else if (viewBtn) {
        actions.push(viewBtn);
      }
      return `<div class="pay-row ${lab.cls}">
        ${bib(playerName(pid), teamOf(m, pid))}
        <div class="pay-row__main">
          <div class="pay-row__name"><a href="#/jugador/${esc(pid)}">${esc(playerName(pid))}</a><span class="pay-row__amount">${money(share(m))}</span></div>
          ${lab.status}
          ${lab.detail && ps.kind !== 'pending' ? `<div class="pay-row__detail">${esc(lab.detail)}</div>` : ''}
        </div>
        ${side}
        ${actions.length ? `<div class="pay-row__actions">${actions.join('')}</div>` : ''}
      </div>`;
    }).join('') + '</div>';
  }

  function viewPayments() {
    const matches = sortedMatches();
    const admin = isAdmin();

    const reviews = [];
    matches.forEach((m) => participants(m).forEach((pid) => {
      const ps = payStatus(m, pid);
      if (ps.kind === 'review') reviews.push({ m, pid, ps });
    }));

    const debts = {};
    matches.forEach((m) => participants(m).forEach((pid) => {
      if (payStatus(m, pid).kind === 'paid') return;
      (debts[pid] = debts[pid] || { total: 0, items: [] });
      debts[pid].total += share(m);
      debts[pid].items.push(m);
    }));
    const debtList = Object.keys(debts).map((pid) => ({ pid, ...debts[pid] })).sort((a, b) => b.total - a.total);
    const totalDebt = debtList.reduce((a, d) => a + d.total, 0);
    const totalCollected = matches.reduce((a, m) => a + matchMoney(m).collected, 0);

    const reviewHtml = reviews.length ? '<div class="pay-list">' + reviews.map(({ m, pid, ps }) => {
      const d = `data-match="${esc(m.id)}" data-player="${esc(pid)}"`;
      return `<div class="pay-row is-review">
        ${bib(playerName(pid), teamOf(m, pid))}
        <div class="pay-row__main">
          <div class="pay-row__name">${esc(playerName(pid))}<span class="pay-row__amount">${money(share(m))}</span></div>
          <div class="pay-row__detail">Partido del ${esc(shortDate(m.date))} · ${ps.method === 'efectivo' ? 'Efectivo' : 'Transferencia'} · ${esc(fmtDateTime(ps.at))}</div>
        </div>
        <span class="chip chip--review">${icon(ps.method === 'efectivo' ? 'cash' : 'transfer')}${ps.method === 'efectivo' ? 'Efectivo' : 'Transf.'}</span>
        <div class="pay-row__actions">
          ${ps.receipt.hasFile ? `<button class="btn" data-action="view-receipt" ${d}>${icon('eye')}Ver comprobante</button>` : ''}
          ${admin ? `<button class="btn btn--paid" data-action="confirm-pay" data-method="${esc(ps.method)}" ${d}>${icon('check')}Confirmar</button>
          <button class="btn btn--danger" data-action="reject-pay" ${d}>${icon('x')}Rechazar</button>` : ''}
        </div>
      </div>`;
    }).join('') + '</div>' : `<div class="card"><p class="muted" style="margin:0">No hay avisos pendientes.</p></div>`;

    const debtHtml = debtList.length ? '<div class="card" style="padding-top:4px;padding-bottom:4px">' + debtList.map((d) => `
      <div class="debt-row">
        ${bib(playerName(d.pid))}
        <div class="debt-row__main">
          <a class="player-link" href="#/jugador/${esc(d.pid)}">${esc(playerName(d.pid))}</a>
          <div class="debt-row__dates">${d.items.map((m) => `<a href="#/partido/${esc(m.id)}">${esc(shortDate(m.date))}</a>`).join('')}</div>
        </div>
        <strong>${money(d.total)}</strong>
      </div>`).join('') + '</div>'
      : `<div class="empty-state">${icon('party')}<h2>Nadie debe nada</h2><p>Todas las canchas están pagas.</p></div>`;

    return `
      <div class="view-head"><div><h1>Pagos</h1><p>Quién pagó y quién no, en todos los partidos</p></div></div>
      <div class="stats-strip">
        <div class="stat-block is-paid"><span>Cobrado</span><strong>${money(totalCollected)}</strong></div>
        <div class="stat-block is-due"><span>Falta cobrar</span><strong>${money(totalDebt)}</strong></div>
        <div class="stat-block"><span>Deben</span><strong>${debtList.length}</strong></div>
      </div>
      <section class="section">
        <div class="section__head"><div><h2>Para confirmar${reviews.length ? ` · ${reviews.length}` : ''}</h2><p>Comprobantes y pagos en efectivo que falta certificar</p></div></div>
        ${reviewHtml}
      </section>
      <section class="section">
        <div class="section__head"><div><h2>Deudas</h2><p>Total que debe cada uno (incluye avisos sin confirmar)</p></div></div>
        ${debtHtml}
      </section>`;
  }

  function viewRanking() {
    const rows = rankingRows();
    const tabs = [['tabla', 'Tabla', 'trophy'], ['goles', 'Goleadores', 'ball'], ['asist', 'Asistencias', 'pass'], ['calif', 'Calificación', 'star']];
    const tabHtml = '<div class="subtabs" role="tablist">' + tabs.map(([k, l, ic]) =>
      `<button role="tab" aria-selected="${ui.rankingTab === k}" data-action="rank-tab" data-tab="${k}" class="${ui.rankingTab === k ? 'is-active' : ''}">${icon(ic)}${l}</button>`).join('') + '</div>';

    const st = S().settings;
    const head = `<div class="view-head"><div><h1>Ranking</h1>
      <p>Ganado ${st.pointsWin} pts · Empatado ${st.pointsDraw} · Perdido ${st.pointsLoss}</p></div></div>`;

    if (!rows.length) return head + tabHtml + `<div class="empty-state">${icon('trophy')}<h2>Sin datos todavía</h2><p>Cuando se carguen resultados aparece la tabla.</p></div>`;

    let list; let valueOf; let unit; let table;
    const name = (r) => `<a class="player-link" href="#/jugador/${esc(r.player.id)}">${bib(r.player.name, null, 'sm')}${esc(r.player.name)}</a>`;
    const pos = (i) => `<td class="pos">${i + 1}</td>`;

    if (ui.rankingTab === 'goles' || ui.rankingTab === 'asist') {
      const key = ui.rankingTab === 'goles' ? 'goals' : 'assists';
      list = rows.filter((r) => r[key] > 0).sort((a, b) => b[key] - a[key] || a.pj - b.pj);
      valueOf = (r) => r[key]; unit = key === 'goals' ? 'goles' : 'asist.';
      table = `<table><thead><tr><th></th><th>Jugador</th><th class="num">${key === 'goals' ? 'Goles' : 'Asist.'}</th><th class="num">PJ</th><th class="num">x partido</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r[key]}</td><td class="num">${r.pj}</td><td class="num">${r.pj ? (r[key] / r.pj).toFixed(2) : '—'}</td></tr>`).join('')}
        </tbody></table>`;
    } else if (ui.rankingTab === 'calif') {
      list = rows.filter((r) => r.avg != null).sort((a, b) => b.avg - a.avg || b.pj - a.pj);
      valueOf = (r) => r.avg.toFixed(1); unit = 'prom.';
      table = `<table><thead><tr><th></th><th>Jugador</th><th class="num">Promedio</th><th class="num">Figura</th><th class="num">PJ</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r.avg.toFixed(2)}</td><td class="num">${r.mvps}</td><td class="num">${r.pj}</td></tr>`).join('')}
        </tbody></table>`;
    } else {
      list = rows.slice().sort((a, b) => b.pts - a.pts || b.g - a.g || b.goals - a.goals || a.player.name.localeCompare(b.player.name));
      valueOf = (r) => r.pts; unit = 'pts';
      table = `<table><thead><tr><th></th><th>Jugador</th><th class="num">Pts</th><th class="num">PJ</th><th class="num">G</th><th class="num">E</th><th class="num">P</th><th class="num">Gol</th><th class="num">Asi</th><th class="num">Cal</th><th>Últimos</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r.pts}</td><td class="num">${r.pj}</td><td class="num">${r.g}</td><td class="num">${r.e}</td><td class="num">${r.p}</td><td class="num">${r.goals}</td><td class="num">${r.assists}</td><td class="num">${r.avg != null ? r.avg.toFixed(1) : '—'}</td>
        <td><span class="form">${r.form.map((x) => `<span class="res res--${x}">${x}</span>`).join('')}</span></td></tr>`).join('')}
        </tbody></table>`;
    }

    if (!list.length) return head + tabHtml + `<div class="empty-state">${icon('trophy')}<h2>Sin datos todavía</h2><p>Todavía no hay registros para esta tabla.</p></div>`;

    // Podio: 2º · 1º · 3º
    const top = list.slice(0, 3);
    const podium = top.length >= 2 ? `<div class="podium">${[1, 0, 2].filter((i) => top[i]).map((i) => `
      <a class="podium__spot podium__spot--${i + 1}" href="#/jugador/${esc(top[i].player.id)}">
        ${bib(top[i].player.name, i === 0 ? 'volt' : null, i === 0 ? 'lg' : null)}
        <span class="podium__name">${esc(top[i].player.name)}</span>
        <span class="podium__value">${valueOf(top[i])} <small>${unit}</small></span>
        <span class="podium__step" aria-hidden="true">${i + 1}</span>
      </a>`).join('')}</div>` : '';

    return head + tabHtml + podium + `<div class="card"><div class="table-wrap">${table}</div></div>`;
  }

  function viewPlayers() {
    const admin = isAdmin();
    const players = S().players.slice().sort((a, b) => (b.active !== false) - (a.active !== false) || a.name.localeCompare(b.name));
    const list = players.map((p) => {
      const t = playerTotals(p.id);
      return `<div class="player-card ${p.active === false ? 'is-inactive' : ''}">
        ${bib(p.name)}
        <div class="player-card__main">
          <a class="player-link" href="#/jugador/${esc(p.id)}">${esc(p.name)}</a>
          <div class="player-card__meta">
            <span>${t.pts} pts</span><span>${t.pj} PJ</span><span>${icon('ball')}${t.goals}</span>
            ${t.debt ? `<span class="due">Debe ${money(t.debt)}</span>` : ''}
            ${p.active === false ? '<span>Inactivo</span>' : ''}
          </div>
        </div>
        ${admin ? `<button class="icon-btn" data-action="edit-player" data-id="${esc(p.id)}" aria-label="Editar a ${esc(p.name)}">${icon('edit')}</button>` : ''}
      </div>`;
    }).join('');

    return `
      <div class="view-head">
        <div><h1>Jugadores</h1><p>${S().players.filter((p) => p.active !== false).length} activos en el grupo</p></div>
        ${admin ? `<button class="btn btn--primary" data-action="new-player">${icon('plus')}Agregar</button>` : ''}
      </div>
      ${list ? `<div class="player-grid">${list}</div>` : `<div class="empty-state">${icon('users')}<h2>Sin jugadores</h2><p>${admin ? 'Agregá a los del grupo. Podés pegar todos los nombres juntos.' : 'El encargado todavía no cargó a nadie.'}</p></div>`}`;
  }

  function viewPlayer(id) {
    const p = playerById(id);
    if (!p) return `<a class="back" href="#/jugadores">${icon('back')}Jugadores</a><div class="empty-state">${icon('alert')}<h2>No existe</h2><p>Ese jugador fue borrado.</p></div>`;
    const t = playerTotals(id);
    const h = playerHistory(id);

    const rows = h.map((x) => {
      const m = x.match;
      const d = dateParts(m.date);
      const lab = payLabel(x.pay);
      const bits = [];
      if (x.goals) bits.push(`<span>${icon('ball')}${x.goals}</span>`);
      if (x.assists) bits.push(`<span>${icon('pass')}${x.assists}</span>`);
      if (x.rating) bits.push(`<span class="star">${icon('star')}${x.rating}${x.mvp ? ' · figura' : ''}</span>`);
      return `<a class="history-row" href="#/partido/${esc(m.id)}">
        <div class="history-row__date"><strong>${d.day}</strong><span>${esc(d.mon)}</span></div>
        <div class="history-row__mid">
          <div class="history-row__score">
            ${x.res ? `<span class="res res--${x.res}">${x.res}</span>` : ''}
            <span class="chip chip--${x.team ? 'b' : 'a'}">${esc(m.teams[x.team].name)}</span>
            ${isPlayed(m) ? `<span class="num">${m.score[x.team]}-${m.score[1 - x.team]}</span>` : '<span class="muted small">Por jugar</span>'}
          </div>
          ${bits.length ? `<span class="statline">${bits.join('')}</span>` : ''}
        </div>
        <div class="history-row__right">
          ${x.res ? `<span class="history-row__pts">+${x.points} <small>pts</small></span>` : ''}
          ${lab.chip}
        </div>
      </a>`;
    }).join('');

    return `
      <a class="back" href="#/jugadores">${icon('back')}Jugadores</a>
      <div class="profile">
        ${bib(p.name, 'volt', 'lg')}
        <div><h1>${esc(p.name)}</h1><p>${p.nickname ? esc(p.nickname) + ' · ' : ''}${p.active === false ? 'Inactivo' : 'Activo'}</p></div>
      </div>
      <div class="stat-grid">
        <div class="stat stat--hero"><strong>${t.pts}</strong><span>Puntos</span></div>
        <div class="stat"><strong>${t.pj}</strong><span>Partidos · ${t.g}G ${t.e}E ${t.p}P</span></div>
        <div class="stat"><strong>${t.goals}</strong><span>Goles</span></div>
        <div class="stat"><strong>${t.assists}</strong><span>Asistencias</span></div>
        <div class="stat"><strong>${t.avg != null ? t.avg.toFixed(1) : '—'}</strong><span>Calificación prom.</span></div>
        <div class="stat"><strong>${t.mvps}</strong><span>Veces figura</span></div>
        <div class="stat ${t.debt ? 'is-due' : 'is-paid'}"><strong>${money(t.debt)}</strong><span>${t.debt ? 'Debe' : 'Al día'}</span></div>
        <div class="stat"><strong>${t.form.length ? `<span class="form">${t.form.map((x) => `<span class="res res--${x}">${x}</span>`).join('')}</span>` : '—'}</strong><span>Últimos 5</span></div>
      </div>
      <section class="section">
        <div class="section__head"><h2>Partido por partido</h2></div>
        ${h.length ? `<div class="history">${rows}</div>` : '<p class="muted">Todavía no jugó ningún partido.</p>'}
      </section>`;
  }

  function viewSettings() {
    const st = S().settings;
    const admin = isAdmin();
    const dis = admin ? '' : 'disabled';
    const modeNote = store.mode === 'remote'
      ? `<p class="notice notice--ok">${icon('check')}<span>Modo compartido: todos los del grupo ven los mismos datos. Solo el encargado (con PIN) edita y certifica pagos.</span></p>`
      : `<p class="notice">${icon('alert')}<span>Modo local: los datos quedan solo en este navegador. Para compartirlos con el grupo hay que activar Vercel KV y el PIN del encargado (ver README). Usá Exportar para tener un respaldo.</span></p>`;

    return `
      <div class="view-head"><div><h1>Ajustes</h1></div></div>
      ${modeNote}
      <form class="card" data-form="settings">
        <h2 style="margin-bottom:var(--s-4)">Grupo</h2>
        <div class="field"><label for="s-name">Nombre del grupo</label><input class="input" id="s-name" name="groupName" value="${esc(st.groupName)}" ${dis} required></div>
        <div class="fields-2">
          <div class="field"><label for="s-ppt">Jugadores por equipo</label><input class="input" id="s-ppt" name="playersPerTeam" type="number" inputmode="numeric" min="1" max="15" value="${esc(st.playersPerTeam)}" ${dis}></div>
          <div class="field"><label for="s-cost">Alquiler habitual ($)</label><input class="input" id="s-cost" name="defaultCost" type="number" inputmode="numeric" min="0" step="100" value="${esc(st.defaultCost)}" ${dis}></div>
        </div>
        <div class="fields-2">
          <div class="field"><label for="s-place">Cancha habitual</label><input class="input" id="s-place" name="defaultPlace" value="${esc(st.defaultPlace)}" ${dis}></div>
          <div class="field"><label for="s-time">Horario habitual</label><input class="input" id="s-time" name="defaultTime" type="time" value="${esc(st.defaultTime)}" ${dis}></div>
        </div>
        <h3 style="margin:var(--s-2) 0 var(--s-3)">Puntos del ranking</h3>
        <div class="fields-3">
          <div class="field"><label for="s-w">Ganado</label><input class="input" id="s-w" name="pointsWin" type="number" inputmode="numeric" step="1" value="${esc(st.pointsWin)}" ${dis}></div>
          <div class="field"><label for="s-d">Empatado</label><input class="input" id="s-d" name="pointsDraw" type="number" inputmode="numeric" step="1" value="${esc(st.pointsDraw)}" ${dis}></div>
          <div class="field"><label for="s-l">Perdido</label><input class="input" id="s-l" name="pointsLoss" type="number" inputmode="numeric" step="1" value="${esc(st.pointsLoss)}" ${dis}></div>
        </div>
        ${admin ? '<button class="btn btn--primary" type="submit">Guardar ajustes</button>' : '<p class="muted small" style="margin:0">Entrá como encargado para cambiar los ajustes.</p>'}
      </form>
      <section class="card">
        <h2 style="margin-bottom:var(--s-2)">Respaldo</h2>
        <p class="muted" style="margin-top:0">Bajá un archivo con jugadores, partidos y pagos.${admin ? ' También podés importar uno.' : ''}</p>
        <div class="btn-row">
          <button class="btn" data-action="export">${icon('download')}Exportar</button>
          ${admin ? `<label class="btn">${icon('upload')}Importar<input type="file" accept="application/json" data-action="import" hidden></label>` : ''}
        </div>
      </section>`;
  }

  /* ---------------------------------------------------------------------
     Diálogos
     --------------------------------------------------------------------- */
  const dlg = () => $('#dialog');
  function openDialog(html, label) {
    $('#dialogBody').innerHTML = html;
    const h = $('#dialogBody h2');
    if (h) { h.id = 'dialogTitle'; dlg().setAttribute('aria-labelledby', 'dialogTitle'); }
    if (!dlg().open) dlg().showModal();
    const first = $('#dialogBody').querySelector('input:not([type=hidden]):not([type=file]):not([type=radio]), select, textarea');
    if (first && window.matchMedia('(pointer: fine)').matches) first.focus();
  }
  function closeDialog() { if (dlg().open) dlg().close(); }

  function matchForm(m) {
    const st = S().settings;
    const isNew = !m;
    m = m || { date: todayISO(), time: st.defaultTime, place: st.defaultPlace, courtCost: st.defaultCost, playersPerTeam: st.playersPerTeam, teams: [{ name: 'Equipo A' }, { name: 'Equipo B' }], notes: '' };
    openDialog(`
      <form data-form="match" data-id="${isNew ? '' : esc(m.id)}">
        <h2>${isNew ? 'Nuevo partido' : 'Editar partido'}</h2>
        <p class="dialog__lead">El alquiler se divide en partes iguales entre los que juegan.</p>
        <div class="fields-2">
          <div class="field"><label for="m-date">Fecha</label><input class="input" id="m-date" name="date" type="date" value="${esc(m.date)}" required></div>
          <div class="field"><label for="m-time">Hora</label><input class="input" id="m-time" name="time" type="time" value="${esc(m.time)}"></div>
        </div>
        <div class="field"><label for="m-place">Cancha</label><input class="input" id="m-place" name="place" value="${esc(m.place)}" placeholder="Ej: La Canchita, cancha 3"></div>
        <div class="fields-2">
          <div class="field"><label for="m-cost">Alquiler total ($)</label><input class="input" id="m-cost" name="courtCost" type="number" inputmode="numeric" min="0" step="100" value="${esc(m.courtCost)}" required></div>
          <div class="field"><label for="m-ppt">Por equipo</label><input class="input" id="m-ppt" name="playersPerTeam" type="number" inputmode="numeric" min="1" max="15" value="${esc(m.playersPerTeam)}" required></div>
        </div>
        <div class="fields-2">
          <div class="field"><label for="m-ta">Equipo A</label><input class="input" id="m-ta" name="teamA" value="${esc(m.teams[0].name)}"></div>
          <div class="field"><label for="m-tb">Equipo B</label><input class="input" id="m-tb" name="teamB" value="${esc(m.teams[1].name)}"></div>
        </div>
        <div class="field"><label for="m-notes">Notas</label><textarea class="input" id="m-notes" name="notes" rows="2">${esc(m.notes)}</textarea></div>
        <div class="dialog__foot">
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">${isNew ? 'Crear y armar equipos' : 'Guardar'}</button>
        </div>
      </form>`);
  }

  /* Selector de equipos: cada jugador va al A, al B o no juega */
  let teamDraft = null;

  function teamsDialog(m) {
    teamDraft = { matchId: m.id, max: Number(m.playersPerTeam) || 7, pick: {} };
    m.teams[0].playerIds.forEach((id) => { teamDraft.pick[id] = 0; });
    m.teams[1].playerIds.forEach((id) => { teamDraft.pick[id] = 1; });
    renderTeamsDialog();
  }

  function renderTeamsDialog() {
    const m = matchById(teamDraft.matchId);
    const scroll = $('.pick-list') ? $('.pick-list').scrollTop : 0;
    const pool = S().players.filter((p) => p.active !== false || teamDraft.pick[p.id] != null)
      .sort((a, b) => a.name.localeCompare(b.name));
    const count = (t) => Object.values(teamDraft.pick).filter((v) => v === t).length;
    const ca = count(0); const cb = count(1);
    const rows = pool.map((p) => {
      const v = teamDraft.pick[p.id];
      return `<div class="pick-row"><span>${esc(p.name)}</span>
        <span class="seg" role="group" aria-label="Equipo de ${esc(p.name)}">
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="0" aria-pressed="${v === 0}" aria-label="${esc(m.teams[0].name)}" class="${v === 0 ? 'on-a' : ''}" ${v !== 0 && ca >= teamDraft.max ? 'disabled' : ''}>A</button>
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="1" aria-pressed="${v === 1}" aria-label="${esc(m.teams[1].name)}" class="${v === 1 ? 'on-b' : ''}" ${v !== 1 && cb >= teamDraft.max ? 'disabled' : ''}>B</button>
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="" aria-pressed="${v == null}" aria-label="No juega" class="${v == null ? 'on-x' : ''}">–</button>
        </span></div>`;
    }).join('');

    openDialog(`
      <h2>Armar equipos</h2>
      <div class="pick-counts">
        <div class="pick-count pick-count--a"><span>${esc(m.teams[0].name)}</span><strong>${ca}/${teamDraft.max}</strong></div>
        <div class="pick-count pick-count--b"><span>${esc(m.teams[1].name)}</span><strong>${cb}/${teamDraft.max}</strong></div>
      </div>
      <p class="pick-share">Juegan ${ca + cb} · cada uno paga <strong>${money(ca + cb ? Math.ceil(m.courtCost / (ca + cb)) : 0)}</strong></p>
      <div class="pick-list">${rows || '<p class="muted">No hay jugadores cargados.</p>'}</div>
      <p class="hint" style="margin:0">"Sortear parejo" mezcla a los elegidos según su calificación promedio.</p>
      <div class="dialog__foot">
        <button class="btn" type="button" data-action="shuffle-teams" ${ca + cb < 2 ? 'disabled' : ''}>${icon('shuffle')}Sortear parejo</button>
        <button class="btn btn--primary" type="button" data-action="save-teams">Guardar equipos</button>
      </div>`);
    $('.pick-list').scrollTop = scroll;
  }

  function shuffleTeams() {
    const ids = Object.keys(teamDraft.pick);
    // Fuerza = calificación promedio histórica (6 si no tiene) + pequeño azar
    const strength = (id) => {
      const avg = playerTotals(id).avg;
      return (avg != null ? avg : 6) + Math.random() * 0.8;
    };
    const sorted = ids.map((id) => ({ id, s: strength(id) })).sort((a, b) => b.s - a.s);
    const sums = [0, 0]; const counts = [0, 0];
    teamDraft.pick = {};
    sorted.forEach(({ id, s }) => {
      let t = sums[0] <= sums[1] ? 0 : 1;
      if (counts[t] >= teamDraft.max || counts[t] > counts[1 - t]) t = 1 - t;
      teamDraft.pick[id] = t; sums[t] += s; counts[t]++;
    });
    renderTeamsDialog();
  }

  function resultDialog(m) {
    const row = (pid, t) => {
      const st = m.stats[pid] || {};
      const n = esc(playerName(pid));
      return `<tr>
        <td>${bib(playerName(pid), t, 'sm')}<span>${n}</span></td>
        <td><input class="input input--num" type="number" inputmode="numeric" min="0" name="g_${esc(pid)}" value="${Number(st.goals) || 0}" aria-label="Goles de ${n}"></td>
        <td><input class="input input--num" type="number" inputmode="numeric" min="0" name="a_${esc(pid)}" value="${Number(st.assists) || 0}" aria-label="Asistencias de ${n}"></td>
        <td><input class="input input--num" type="number" inputmode="decimal" min="1" max="10" step="0.5" name="r_${esc(pid)}" value="${st.rating || ''}" placeholder="–" aria-label="Calificación de ${n}"></td>
      </tr>`;
    };
    const sc = m.score || ['', ''];
    openDialog(`
      <form data-form="result" data-id="${esc(m.id)}">
        <h2>Resultado</h2>
        <div class="fields-2">
          <div class="field"><label for="r-a" style="color:var(--team-a)">${esc(m.teams[0].name)}</label><input class="input" id="r-a" name="scoreA" type="number" inputmode="numeric" min="0" value="${esc(sc[0])}"></div>
          <div class="field"><label for="r-b" style="color:var(--team-b)">${esc(m.teams[1].name)}</label><input class="input" id="r-b" name="scoreB" type="number" inputmode="numeric" min="0" value="${esc(sc[1])}"></div>
        </div>
        <p class="hint">Si dejás el marcador vacío se suma lo que cargues de goles por equipo. Calificación de 1 a 10.</p>
        <div class="table-wrap"><table class="stats-edit">
          <thead><tr><th>Jugador</th><th>Gol</th><th>Asi</th><th>Cal</th></tr></thead>
          <tbody>${m.teams[0].playerIds.map((p) => row(p, 0)).join('')}${m.teams[1].playerIds.map((p) => row(p, 1)).join('')}</tbody>
        </table></div>
        <div class="dialog__foot">
          ${isPlayed(m) ? `<button class="btn btn--danger" type="button" data-action="clear-result" data-id="${esc(m.id)}">${icon('trash')}Borrar</button>` : ''}
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">Guardar resultado</button>
        </div>
      </form>`);
  }

  function declareDialog(m, pid) {
    const r = store.receipts[m.id + ':' + pid];
    const cash = r && r.method === 'efectivo';
    openDialog(`
      <form data-form="declare" data-match="${esc(m.id)}" data-player="${esc(pid)}">
        <h2>Avisar pago</h2>
        <p class="dialog__lead">${esc(playerName(pid))} · partido del ${esc(shortDate(m.date))} · <strong>${money(share(m))}</strong></p>
        <fieldset class="field" style="border:0;padding:0;margin:0 0 var(--s-4)">
          <legend class="sr-only">¿Cómo pagaste?</legend>
          <div class="choice">
            <div><input type="radio" id="d-tr" name="method" value="transferencia" ${!cash ? 'checked' : ''}><label for="d-tr">${icon('transfer')}Transferencia<small>Subís el comprobante</small></label></div>
            <div><input type="radio" id="d-ca" name="method" value="efectivo" ${cash ? 'checked' : ''}><label for="d-ca">${icon('cash')}Efectivo<small>Lo certifica el encargado</small></label></div>
          </div>
        </fieldset>
        <div class="field" data-file-field>
          <span id="d-file-label">Comprobante</span>
          <label class="dropzone" for="d-file">
            ${icon('upload')}
            <span><strong data-file-name>Elegí la foto o captura</strong>JPG, PNG o PDF</span>
            <input id="d-file" name="file" type="file" accept="image/*,application/pdf" aria-labelledby="d-file-label">
          </label>
        </div>
        <p class="hint" data-cash-hint hidden>Queda como "a confirmar" hasta que el encargado de la cancha certifique que le pagaste.</p>
        <div class="field"><label for="d-note">Comentario (opcional)</label><input class="input" id="d-note" name="note" maxlength="300" placeholder="Ej: le di la plata a Juan"></div>
        <div class="dialog__foot">
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">Enviar aviso</button>
        </div>
      </form>`);
    syncDeclareForm();
  }

  function syncDeclareForm() {
    const form = $('form[data-form="declare"]');
    if (!form) return;
    const cash = form.elements.method.value === 'efectivo';
    form.querySelector('[data-file-field]').hidden = cash;
    form.querySelector('[data-cash-hint]').hidden = !cash;
  }

  function playerForm(p) {
    const isNew = !p;
    p = p || { name: '', nickname: '', active: true };
    const played = !isNew && S().matches.some((m) => teamOf(m, p.id) >= 0);
    openDialog(`
      <form data-form="player" data-id="${isNew ? '' : esc(p.id)}">
        <h2>${isNew ? 'Agregar jugadores' : 'Editar jugador'}</h2>
        ${isNew
          ? `<div class="field"><label for="p-name">Nombres</label><textarea class="input" id="p-name" name="name" rows="4" required placeholder="Juan Pérez&#10;Martín Gómez&#10;…"></textarea></div>
             <p class="hint">Uno por línea o separados por coma. Podés pegar la lista del grupo de WhatsApp.</p>`
          : `<div class="field"><label for="p-name">Nombre</label><input class="input" id="p-name" name="name" value="${esc(p.name)}" required maxlength="40"></div>`}
        <div class="field"><label for="p-nick">Apodo o posición (opcional)</label><input class="input" id="p-nick" name="nickname" value="${esc(p.nickname || '')}" maxlength="40"></div>
        ${isNew ? '' : `<label class="check"><input type="checkbox" name="active" ${p.active !== false ? 'checked' : ''}> Activo (aparece al armar equipos)</label>`}
        <div class="dialog__foot">
          ${!isNew && !played ? `<button class="btn btn--danger" type="button" data-action="delete-player" data-id="${esc(p.id)}">${icon('trash')}Borrar</button>` : ''}
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">${isNew ? 'Agregar' : 'Guardar'}</button>
        </div>
      </form>`);
  }

  function loginDialog() {
    openDialog(`
      <form data-form="login">
        <h2>Encargado</h2>
        <p class="dialog__lead">Con el PIN podés crear partidos, armar equipos, cargar resultados y certificar pagos.</p>
        ${store.adminPinSet ? '' : `<p class="notice">${icon('alert')}<span>Todavía no está configurado el PIN (variable FUTBOL_ADMIN_PIN en Vercel).</span></p>`}
        <div class="field"><label for="l-pin">PIN</label><input class="input" id="l-pin" name="pin" type="password" inputmode="numeric" autocomplete="current-password" required></div>
        <div class="dialog__foot">
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">${icon('unlock')}Entrar</button>
        </div>
      </form>`);
  }

  async function viewReceipt(matchId, playerId) {
    const key = matchId + ':' + playerId;
    const meta = store.receipts[key];
    openDialog('<h2>Comprobante</h2><p class="empty">Cargando…</p>');
    const file = await fetchReceiptFile(key);
    if (!dlg().open) return;
    if (!file) { openDialog(`<h2>Comprobante</h2><p class="empty">No se encontró el archivo.</p><div class="dialog__foot"><button class="btn" data-action="close-dialog">Cerrar</button></div>`); return; }
    const isPdf = file.startsWith('data:application/pdf');
    const m = matchById(matchId);
    openDialog(`
      <h2>Comprobante</h2>
      <p class="dialog__lead"><strong>${esc(playerName(playerId))}</strong> · ${m ? esc(shortDate(m.date)) + ' · ' + money(share(m)) : ''}<br>Subido ${esc(fmtDateTime(meta && meta.uploadedAt))}${meta && meta.note ? ' · "' + esc(meta.note) + '"' : ''}</p>
      ${isPdf ? `<iframe class="receipt-pdf" src="${file}" title="Comprobante"></iframe>` : `<img class="receipt-img" src="${file}" alt="Comprobante de ${esc(playerName(playerId))}">`}
      <div class="dialog__foot">
        <a class="btn" href="${file}" download="comprobante-${esc(playerName(playerId))}.${isPdf ? 'pdf' : 'jpg'}">${icon('download')}Descargar</a>
        ${m && isAdmin() && payStatus(m, playerId).kind !== 'paid' ? `<button class="btn btn--paid" data-action="confirm-pay" data-method="transferencia" data-match="${esc(matchId)}" data-player="${esc(playerId)}">${icon('check')}Confirmar pago</button>` : ''}
        <button class="btn btn--ghost" data-action="close-dialog">Cerrar</button>
      </div>`);
  }

  /* ---------------------------------------------------------------------
     Acciones
     --------------------------------------------------------------------- */
  function logout() { store.pin = null; ssSet(SS_PIN, null); render(); }

  function summaryText(m) {
    const mm = matchMoney(m);
    const lines = [`⚽ ${fmtDate(m.date)}${m.place ? ' · ' + m.place : ''}`, `Cancha ${money(mm.total)} ÷ ${mm.count} = ${money(mm.each)} c/u`, ''];
    const byKind = { paid: [], review: [], pending: [] };
    participants(m).forEach((pid) => byKind[payStatus(m, pid).kind].push(playerName(pid)));
    if (byKind.paid.length) lines.push('✅ Pagaron: ' + byKind.paid.join(', '));
    if (byKind.review.length) lines.push('⏳ A confirmar: ' + byKind.review.join(', '));
    if (byKind.pending.length) lines.push('❌ Faltan: ' + byKind.pending.join(', '));
    lines.push('', `Cobrado ${money(mm.collected)} de ${money(mm.total)}`);
    return lines.join('\n');
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast('Copiado. Pegalo en el grupo'); }
    catch (e) { openDialog(`<h2>Copiá el resumen</h2><textarea class="input" rows="10" readonly>${esc(text)}</textarea><div class="dialog__foot"><button class="btn" data-action="close-dialog">Cerrar</button></div>`); }
  }

  function exportData() {
    const data = { exportedAt: new Date().toISOString(), state: S(), receipts: store.receipts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'futbol-' + todayISO() + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async function importData(file) {
    try {
      const data = JSON.parse(await file.text());
      const state = normalize(data.state || data);
      if (!confirm(`Esto reemplaza los datos actuales por ${state.players.length} jugadores y ${state.matches.length} partidos. ¿Seguir?`)) return;
      await commit((s) => { Object.assign(s, state); }, 'Datos importados');
    } catch (e) {
      toast('El archivo no es válido', true);
    }
  }

  /* Deshabilita el botón mientras corre una acción async (feedback de carga) */
  async function busy(el, fn) {
    if (el.disabled) return;
    el.disabled = true;
    try { await fn(); } finally { if (el.isConnected) el.disabled = false; }
  }

  const clickActions = {
    'close-dialog': closeDialog,
    'new-match': () => matchForm(null),
    'edit-match': (el) => matchForm(matchById(el.dataset.id)),
    'delete-match': async (el) => {
      const m = matchById(el.dataset.id);
      if (!confirm(`¿Borrar el partido del ${fmtDate(m.date)}? Se pierden resultados y pagos.`)) return;
      if (await commit((s) => { s.matches = s.matches.filter((x) => x.id !== m.id); }, 'Partido borrado')) location.hash = '#/partidos';
    },
    'edit-teams': (el) => teamsDialog(matchById(el.dataset.id)),
    'pick': (el) => {
      const t = el.dataset.team;
      if (t === '') delete teamDraft.pick[el.dataset.id];
      else teamDraft.pick[el.dataset.id] = Number(t);
      renderTeamsDialog();
    },
    'shuffle-teams': shuffleTeams,
    'save-teams': (el) => busy(el, async () => {
      const { matchId, pick } = teamDraft;
      const ids = (t) => Object.keys(pick).filter((id) => pick[id] === t);
      const ok = await commit((s) => {
        const m = s.matches.find((x) => x.id === matchId);
        m.teams[0].playerIds = ids(0);
        m.teams[1].playerIds = ids(1);
      }, 'Equipos guardados');
      if (ok) closeDialog();
    }),
    'edit-result': (el) => resultDialog(matchById(el.dataset.id)),
    'clear-result': async (el) => {
      if (!confirm('¿Borrar el resultado y las estadísticas de este partido?')) return;
      if (await commit((s) => { const m = s.matches.find((x) => x.id === el.dataset.id); m.score = null; m.stats = {}; }, 'Resultado borrado')) closeDialog();
    },
    'declare': (el) => declareDialog(matchById(el.dataset.match), el.dataset.player),
    'view-receipt': (el) => viewReceipt(el.dataset.match, el.dataset.player),
    'confirm-pay': (el) => busy(el, async () => {
      const { match, player, method } = el.dataset;
      const ok = await commit((s) => {
        const m = s.matches.find((x) => x.id === match);
        const r = store.receipts[match + ':' + player];
        m.payments[player] = { status: 'pagado', method, confirmedAt: new Date().toISOString(), note: r && r.note ? r.note : '' };
      }, `${playerName(player)}: pago confirmado`);
      if (ok) closeDialog();
    }),
    'undo-pay': async (el) => {
      const { match, player } = el.dataset;
      if (!confirm(`¿Anular el pago de ${playerName(player)}?`)) return;
      await commit((s) => { delete s.matches.find((x) => x.id === match).payments[player]; }, 'Pago anulado');
    },
    'reject-pay': async (el) => {
      const { match, player } = el.dataset;
      if (!confirm(`¿Rechazar el aviso de pago de ${playerName(player)}? Vuelve a figurar como que debe.`)) return;
      if (await deleteReceipt(match, player)) { toast('Aviso rechazado'); render(); }
    },
    'copy-summary': (el) => copyText(summaryText(matchById(el.dataset.id))),
    'rank-tab': (el) => { ui.rankingTab = el.dataset.tab; render(); },
    'new-player': () => playerForm(null),
    'edit-player': (el) => playerForm(playerById(el.dataset.id)),
    'delete-player': async (el) => {
      if (!confirm('¿Borrar este jugador?')) return;
      if (await commit((s) => { s.players = s.players.filter((p) => p.id !== el.dataset.id); }, 'Jugador borrado')) closeDialog();
    },
    'export': exportData,
  };

  const formHandlers = {
    async match(form) {
      const f = form.elements;
      const id = form.dataset.id;
      const newId = id || uid();
      const data = {
        date: f.date.value, time: f.time.value, place: f.place.value.trim(),
        courtCost: Math.max(0, Number(f.courtCost.value) || 0),
        playersPerTeam: Math.max(1, Number(f.playersPerTeam.value) || 7),
        notes: f.notes.value.trim(),
      };
      const ok = await commit((s) => {
        let m = s.matches.find((x) => x.id === id);
        if (!m) { m = normalizeMatch({ id: newId }); s.matches.push(m); }
        Object.assign(m, data);
        m.teams[0].name = f.teamA.value.trim() || 'Equipo A';
        m.teams[1].name = f.teamB.value.trim() || 'Equipo B';
      }, id ? 'Partido actualizado' : 'Partido creado');
      if (!ok) return;
      if (id) { closeDialog(); return; }
      // El selector de equipos se abre después de navegar (hashchange cierra diálogos)
      ui.afterNav = () => teamsDialog(matchById(newId));
      location.hash = '#/partido/' + newId;
    },

    async result(form) {
      const id = form.dataset.id;
      const m = matchById(id);
      const f = form.elements;
      const stats = {};
      const goalSums = [0, 0];
      participants(m).forEach((pid) => {
        const goals = Math.max(0, Number(f['g_' + pid].value) || 0);
        const assists = Math.max(0, Number(f['a_' + pid].value) || 0);
        const rv = f['r_' + pid].value;
        const rating = rv === '' ? null : Math.min(10, Math.max(1, Number(rv)));
        stats[pid] = { goals, assists, rating };
        goalSums[teamOf(m, pid)] += goals;
      });
      const a = f.scoreA.value === '' ? goalSums[0] : Number(f.scoreA.value);
      const b = f.scoreB.value === '' ? goalSums[1] : Number(f.scoreB.value);
      if (await commit((s) => { const x = s.matches.find((y) => y.id === id); x.stats = stats; x.score = [a, b]; }, 'Resultado guardado')) closeDialog();
    },

    async declare(form) {
      const method = form.elements.method.value;
      const fileInput = form.elements.file;
      const btn = form.querySelector('[type=submit]');
      let file = null; let fileName = '';
      if (method === 'transferencia' && !fileInput.files.length) {
        toast('Subí el comprobante de la transferencia', true);
        fileInput.focus();
        return;
      }
      btn.disabled = true; btn.textContent = method === 'transferencia' ? 'Subiendo…' : 'Enviando…';
      const reset = () => { btn.disabled = false; btn.textContent = 'Enviar aviso'; };
      if (method === 'transferencia') {
        try { file = await fileToDataUrl(fileInput.files[0]); fileName = fileInput.files[0].name; }
        catch (e) { toast(e.message, true); reset(); return; }
      }
      const ok = await declarePayment(form.dataset.match, form.dataset.player, method, file, fileName, form.elements.note.value.trim());
      if (ok) { closeDialog(); toast('Listo. El encargado lo va a confirmar'); render(); }
      else reset();
    },

    async player(form) {
      const id = form.dataset.id;
      const f = form.elements;
      if (id) {
        const ok = await commit((s) => {
          const p = s.players.find((x) => x.id === id);
          p.name = f.name.value.trim() || p.name;
          p.nickname = f.nickname.value.trim();
          p.active = f.active.checked;
        }, 'Jugador actualizado');
        if (ok) closeDialog();
        return;
      }
      const names = f.name.value.split(/[\n,]+/).map((n) => n.trim()).filter(Boolean);
      if (!names.length) return;
      const nick = f.nickname.value.trim();
      const ok = await commit((s) => {
        names.forEach((name) => s.players.push({ id: uid(), name: name.slice(0, 40), nickname: names.length === 1 ? nick : '', active: true }));
      }, names.length === 1 ? 'Jugador agregado' : names.length + ' jugadores agregados');
      if (ok) closeDialog();
    },

    async settings(form) {
      const f = form.elements;
      await commit((s) => {
        Object.assign(s.settings, {
          groupName: f.groupName.value.trim() || 'Fútbol del grupo',
          playersPerTeam: Math.max(1, Number(f.playersPerTeam.value) || 7),
          defaultCost: Math.max(0, Number(f.defaultCost.value) || 0),
          defaultPlace: f.defaultPlace.value.trim(),
          defaultTime: f.defaultTime.value,
          pointsWin: Number(f.pointsWin.value) || 0,
          pointsDraw: Number(f.pointsDraw.value) || 0,
          pointsLoss: Number(f.pointsLoss.value) || 0,
        });
      }, 'Ajustes guardados');
    },

    async login(form) {
      const pin = form.elements.pin.value.trim();
      const res = await postJSON({ action: 'check-pin', pin });
      if (!res.ok) { toast(res.status === 401 ? 'PIN incorrecto' : 'No se pudo verificar el PIN', true); return; }
      store.pin = pin; ssSet(SS_PIN, pin);
      closeDialog(); toast('Entraste como encargado'); render();
    },
  };

  /* ---------------------------------------------------------------------
     Eventos
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-icon]').forEach((el) => {
    if (el.classList.length) el.innerHTML = icon(el.dataset.icon);
    else el.outerHTML = icon(el.dataset.icon);
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.tagName === 'INPUT') return;
    const fn = clickActions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el); }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('input[data-action="import"]') && t.files[0]) importData(t.files[0]);
    if (t.name === 'method') syncDeclareForm();
    if (t.id === 'd-file') {
      const zone = t.closest('.dropzone');
      const has = Boolean(t.files[0]);
      zone.classList.toggle('has-file', has);
      zone.querySelector('[data-file-name]').textContent = has ? t.files[0].name : 'Elegí la foto o captura';
      zone.querySelector('svg').outerHTML = icon(has ? 'check' : 'upload');
    }
  });

  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const fn = formHandlers[form.dataset.form];
    if (!fn) return;
    const btn = form.querySelector('[type=submit]');
    if (btn && btn.disabled) return;
    if (btn && form.dataset.form !== 'declare') btn.disabled = true;
    try { await fn(form); } finally { if (btn && btn.isConnected && form.dataset.form !== 'declare') btn.disabled = false; }
  });

  // Cerrar el diálogo tocando afuera
  dlg().addEventListener('click', (e) => { if (e.target === dlg()) closeDialog(); });

  $('#adminBtn').addEventListener('click', () => {
    if (isAdmin()) { if (confirm('¿Salir del modo encargado?')) { logout(); toast('Saliste del modo encargado'); } }
    else loginDialog();
  });

  window.addEventListener('hashchange', () => {
    closeDialog(); render(); window.scrollTo(0, 0);
    const next = ui.afterNav; ui.afterNav = null;
    if (next) next();
  });

  // Al volver a la pestaña, traer lo último que cargaron otros
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && store.mode === 'remote' && !dlg().open) reloadRemote();
  });

  load().then(render);
})();
