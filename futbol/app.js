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
     Router
     --------------------------------------------------------------------- */
  function route() {
    const parts = (location.hash.replace(/^#\/?/, '') || 'partidos').split('/');
    return { name: parts[0], id: parts[1] };
  }

  function render() {
    const view = $('#view');
    if (store.mode === 'error') {
      view.innerHTML = '<p class="empty">No se pudieron cargar los datos. Revisá la conexión y recargá la página.</p>';
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
    adminBtn.textContent = isAdmin() ? '🔓 Encargado' : '🔒 Encargado';
    adminBtn.classList.toggle('is-admin', isAdmin());

    const r = route();
    const tab = { partido: 'partidos', jugador: 'jugadores' }[r.name] || r.name;
    document.querySelectorAll('.tabs a').forEach((a) => a.classList.toggle('is-active', a.dataset.tab === tab));

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
  function viewMatches() {
    const list = sortedMatches();
    const head = `
      <div class="view-head">
        <div><h1>Partidos</h1><p>${list.length ? list.length + ' partidos cargados' : 'Todavía no hay partidos'}</p></div>
        ${isAdmin() ? '<button class="btn btn--primary" data-action="new-match">+ Nuevo partido</button>' : ''}
      </div>`;

    if (!S().players.length) {
      return head + `<div class="card"><p class="empty">Primero cargá los jugadores del grupo.<br><br>
        <a class="btn btn--primary" href="#/jugadores">Ir a Jugadores</a></p></div>`;
    }
    if (!list.length) return head + '<div class="card"><p class="empty">Creá el primer partido con el monto de la cancha y armá los equipos.</p></div>';

    return head + '<div class="match-list">' + list.map((m) => {
      const mm = matchMoney(m);
      const pct = mm.count ? Math.round((mm.paid / mm.count) * 100) : 0;
      const payPill = !mm.count ? '<span class="pill">Sin jugadores</span>'
        : mm.paid === mm.count ? '<span class="pill pill--ok">✓ Todos pagaron</span>'
          : `<span class="pill pill--bad">${mm.pending} sin pagar</span>`;
      return `
        <a class="match-card" href="#/partido/${esc(m.id)}">
          <div class="match-card__top">
            <div>
              <div class="match-card__date">${esc(fmtDate(m.date))}</div>
              <div class="match-card__meta">${esc([m.time, m.place].filter(Boolean).join(' · ') || '—')}</div>
            </div>
            <div class="match-card__score">${isPlayed(m) ? m.score[0] + ' - ' + m.score[1] : '<span class="pill">Por jugar</span>'}</div>
          </div>
          <div class="match-card__foot">
            <span class="small muted">Cancha ${money(mm.total)} · ${mm.count} jugadores · ${money(mm.each)} c/u</span>
            ${payPill}
          </div>
          <div class="match-card__foot">
            <div class="progress" title="${pct}% cobrado"><i style="width:${pct}%"></i></div>
            <span class="small muted">${money(mm.collected)} de ${money(mm.total)}</span>
          </div>
        </a>`;
    }).join('') + '</div>';
  }

  function viewMatch(id) {
    const m = matchById(id);
    if (!m) return '<a class="back" href="#/partidos">← Partidos</a><p class="empty">Ese partido no existe.</p>';
    const admin = isAdmin();
    const mm = matchMoney(m);

    const teamCol = (t) => {
      const team = m.teams[t];
      const items = team.playerIds.map((pid) => {
        const st = m.stats[pid] || {};
        const bits = [];
        if (st.goals) bits.push('⚽ ' + st.goals);
        if (st.assists) bits.push('👟 ' + st.assists);
        if (st.rating) bits.push('⭐ ' + st.rating);
        return `<li><a class="player-link" href="#/jugador/${esc(pid)}">${esc(playerName(pid))}</a><span class="stats-mini">${bits.join(' · ')}</span></li>`;
      }).join('');
      return `
        <div class="team-col team-col--${t ? 'b' : 'a'}">
          <h3>${esc(team.name)} <span class="pill pill--${t ? 'b' : 'a'}">${team.playerIds.length}/${m.playersPerTeam}</span></h3>
          <ul class="roster">${items || '<li class="muted">Sin jugadores</li>'}</ul>
        </div>`;
    };

    const mvp = isPlayed(m) ? mvpOf(m) : null;

    return `
      <a class="back" href="#/partidos">← Partidos</a>
      <div class="view-head">
        <div>
          <h1 style="text-transform:capitalize">${esc(fmtDate(m.date))}</h1>
          <p>${esc([m.time, m.place].filter(Boolean).join(' · ') || 'Sin horario ni lugar')}</p>
        </div>
        ${admin ? `<div class="btn-row">
          <button class="btn btn--sm" data-action="edit-match" data-id="${esc(m.id)}">Editar datos</button>
          <button class="btn btn--sm btn--bad" data-action="delete-match" data-id="${esc(m.id)}">Borrar</button>
        </div>` : ''}
      </div>

      <div class="scoreboard">
        <div class="scoreboard__team scoreboard__team--a">${esc(m.teams[0].name)}</div>
        <div class="scoreboard__score">${isPlayed(m) ? m.score[0] + ' - ' + m.score[1] : 'vs'}</div>
        <div class="scoreboard__team scoreboard__team--b">${esc(m.teams[1].name)}</div>
      </div>
      ${mvp ? `<p class="notice notice--ok">⭐ Figura del partido: <strong>${esc(playerName(mvp))}</strong> (${m.stats[mvp].rating})</p>` : ''}

      <section class="card">
        <div class="card__head">
          <div><h2>Equipos</h2><p>${m.playersPerTeam} por equipo</p></div>
          ${admin ? `<button class="btn btn--sm" data-action="edit-teams" data-id="${esc(m.id)}">Armar equipos</button>` : ''}
        </div>
        <div class="grid-2">${teamCol(0)}${teamCol(1)}</div>
      </section>

      <section class="card">
        <div class="card__head">
          <div><h2>Resultado y estadísticas</h2><p>Goles, asistencias y calificación (1 a 10) de cada jugador</p></div>
          ${admin && participants(m).length ? `<button class="btn btn--sm" data-action="edit-result" data-id="${esc(m.id)}">${isPlayed(m) ? 'Editar resultado' : 'Cargar resultado'}</button>` : ''}
        </div>
        ${isPlayed(m) ? statsTable(m) : '<p class="muted small" style="margin:0">Todavía no se cargó el resultado.</p>'}
      </section>

      <section class="card" id="pagos">
        <div class="card__head">
          <div><h2>Pagos de la cancha</h2><p>El total se divide entre los ${mm.count} que juegan</p></div>
          <button class="btn btn--sm" data-action="copy-summary" data-id="${esc(m.id)}">📋 Copiar para WhatsApp</button>
        </div>
        <div class="money-row">
          <div class="money"><span>Cancha</span><strong>${money(mm.total)}</strong></div>
          <div class="money"><span>Cada uno</span><strong>${money(mm.each)}</strong></div>
          <div class="money"><span>Cobrado</span><strong>${money(mm.collected)}</strong></div>
        </div>
        ${paymentRows(m)}
      </section>

      ${m.notes ? `<section class="card"><h3>Notas</h3><p class="muted" style="white-space:pre-wrap;margin:8px 0 0">${esc(m.notes)}</p></section>` : ''}
    `;
  }

  function statsTable(m) {
    const rows = [0, 1].map((t) => m.teams[t].playerIds.map((pid) => {
      const st = m.stats[pid] || {};
      return `<tr>
        <td><span class="pill pill--${t ? 'b' : 'a'}">${t ? 'B' : 'A'}</span> <a class="player-link" href="#/jugador/${esc(pid)}">${esc(playerName(pid))}</a></td>
        <td><span class="res res--${resultFor(m, pid)}">${resultFor(m, pid)}</span></td>
        <td class="num">${Number(st.goals) || 0}</td>
        <td class="num">${Number(st.assists) || 0}</td>
        <td class="num">${st.rating ? st.rating : '—'}</td>
        <td class="num">${pointsFor(resultFor(m, pid))}</td>
      </tr>`;
    }).join('')).join('');
    return `<div class="table-wrap"><table>
      <thead><tr><th>Jugador</th><th>Res.</th><th class="num">Goles</th><th class="num">Asist.</th><th class="num">Calif.</th><th class="num">Pts</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function payLabel(ps) {
    const method = ps.method === 'efectivo' ? 'Efectivo' : 'Transferencia';
    if (ps.kind === 'paid') {
      return { cls: 'is-paid', pill: `<span class="pill pill--ok">✓ Pagó · ${method}</span>`,
        detail: 'Certificado por el encargado' + (ps.at ? ' · ' + fmtDateTime(ps.at) : '') + (ps.pay && ps.pay.note ? ' · ' + ps.pay.note : '') };
    }
    if (ps.kind === 'review') {
      return { cls: 'is-review',
        pill: `<span class="pill pill--warn">⏳ ${ps.method === 'efectivo' ? 'Dice que pagó en efectivo' : 'Comprobante subido'}</span>`,
        detail: 'Falta que lo confirme el encargado · ' + fmtDateTime(ps.at) + (ps.receipt && ps.receipt.note ? ' · "' + ps.receipt.note + '"' : '') };
    }
    return { cls: '', pill: '<span class="pill pill--bad">✗ No pagó</span>', detail: '' };
  }

  function paymentRows(m) {
    const ids = participants(m);
    if (!ids.length) return '<p class="muted small" style="margin:0">Armá los equipos para dividir el monto.</p>';
    const admin = isAdmin();
    const order = { pending: 0, review: 1, paid: 2 };
    const sorted = ids.slice().sort((a, b) => order[payStatus(m, a).kind] - order[payStatus(m, b).kind] || playerName(a).localeCompare(playerName(b)));

    return '<div class="pay-list">' + sorted.map((pid) => {
      const ps = payStatus(m, pid);
      const lab = payLabel(ps);
      const d = `data-match="${esc(m.id)}" data-player="${esc(pid)}"`;
      const actions = [];
      if (ps.receipt && ps.receipt.hasFile) actions.push(`<button class="btn btn--sm" data-action="view-receipt" ${d}>👁 Ver comprobante</button>`);
      if (ps.kind !== 'paid') {
        actions.push(`<button class="btn btn--sm" data-action="declare" ${d}>${ps.kind === 'review' ? 'Cambiar aviso' : 'Avisar que pagué'}</button>`);
        if (admin) {
          actions.push(`<button class="btn btn--sm btn--ok" data-action="confirm-pay" data-method="efectivo" ${d}>✓ Pagó efectivo</button>`);
          actions.push(`<button class="btn btn--sm btn--ok" data-action="confirm-pay" data-method="transferencia" ${d}>✓ Pagó transferencia</button>`);
          if (ps.kind === 'review') actions.push(`<button class="btn btn--sm btn--bad" data-action="reject-pay" ${d}>Rechazar aviso</button>`);
        }
      } else if (admin) {
        actions.push(`<button class="btn btn--sm btn--ghost" data-action="undo-pay" ${d}>Anular pago</button>`);
      }
      return `
        <div class="pay-row ${lab.cls}">
          <div>
            <div class="pay-row__name"><a class="player-link" href="#/jugador/${esc(pid)}">${esc(playerName(pid))}</a> <span class="muted small">· ${money(share(m))}</span></div>
            ${lab.detail ? `<div class="pay-row__detail">${esc(lab.detail)}</div>` : ''}
          </div>
          ${lab.pill}
          ${actions.length ? `<div class="pay-row__actions">${actions.join('')}</div>` : ''}
        </div>`;
    }).join('') + '</div>';
  }

  function viewPayments() {
    const matches = sortedMatches();
    const admin = isAdmin();

    // Avisos a confirmar
    const reviews = [];
    matches.forEach((m) => participants(m).forEach((pid) => {
      const ps = payStatus(m, pid);
      if (ps.kind === 'review') reviews.push({ m, pid, ps });
    }));

    // Deudas por jugador
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

    const reviewHtml = reviews.length ? reviews.map(({ m, pid, ps }) => {
      const d = `data-match="${esc(m.id)}" data-player="${esc(pid)}"`;
      return `<div class="pay-row is-review">
        <div>
          <div class="pay-row__name">${esc(playerName(pid))} <span class="muted small">· ${money(share(m))}</span></div>
          <div class="pay-row__detail">${esc(fmtDate(m.date, { day: 'numeric', month: 'short' }))} · ${ps.method === 'efectivo' ? 'Efectivo' : 'Transferencia'} · avisó ${esc(fmtDateTime(ps.at))}</div>
        </div>
        <span class="pill pill--warn">⏳ A confirmar</span>
        <div class="pay-row__actions">
          ${ps.receipt.hasFile ? `<button class="btn btn--sm" data-action="view-receipt" ${d}>👁 Ver comprobante</button>` : ''}
          ${admin ? `<button class="btn btn--sm btn--ok" data-action="confirm-pay" data-method="${esc(ps.method)}" ${d}>✓ Confirmar</button>
          <button class="btn btn--sm btn--bad" data-action="reject-pay" ${d}>Rechazar</button>` : ''}
        </div>
      </div>`;
    }).join('') : '<p class="muted small" style="margin:0">No hay avisos pendientes.</p>';

    const debtHtml = debtList.length ? debtList.map((d) => `
      <div class="debt-row">
        <div>
          <a class="player-link" href="#/jugador/${esc(d.pid)}">${esc(playerName(d.pid))}</a>
          <div class="small muted">${d.items.map((m) => `<a href="#/partido/${esc(m.id)}">${esc(fmtDate(m.date, { day: 'numeric', month: 'short' }))}</a>`).join(' · ')}</div>
        </div>
        <strong>${money(d.total)}</strong>
      </div>`).join('') : '<p class="empty">🎉 Nadie debe nada.</p>';

    return `
      <div class="view-head"><div><h1>Pagos</h1><p>Quién pagó y quién no, en todos los partidos</p></div></div>
      <div class="money-row">
        <div class="money"><span>Cobrado</span><strong>${money(totalCollected)}</strong></div>
        <div class="money"><span>Falta cobrar</span><strong style="color:var(--bad)">${money(totalDebt)}</strong></div>
        <div class="money"><span>Deben</span><strong>${debtList.length}</strong></div>
      </div>
      <section class="card">
        <div class="card__head"><div><h2>Avisos para confirmar</h2><p>Comprobantes subidos y pagos en efectivo que falta certificar</p></div></div>
        <div class="pay-list">${reviewHtml}</div>
      </section>
      <section class="card">
        <div class="card__head"><div><h2>Deudas</h2><p>Lo que falta pagar por jugador (incluye avisos sin confirmar)</p></div></div>
        ${debtHtml}
      </section>`;
  }

  function viewRanking() {
    const rows = rankingRows();
    const tabs = [['tabla', 'Tabla'], ['goles', 'Goleadores'], ['asist', 'Asistencias'], ['calif', 'Calificación']];
    const tabHtml = '<div class="subtabs">' + tabs.map(([k, l]) =>
      `<button data-action="rank-tab" data-tab="${k}" class="${ui.rankingTab === k ? 'is-active' : ''}">${l}</button>`).join('') + '</div>';

    const st = S().settings;
    const head = `<div class="view-head"><div><h1>Ranking</h1>
      <p>Ganado ${st.pointsWin} pts · Empatado ${st.pointsDraw} · Perdido ${st.pointsLoss}</p></div></div>`;

    if (!rows.length) return head + tabHtml + '<div class="card"><p class="empty">Cuando cargues resultados aparece el ranking.</p></div>';

    const name = (r) => `<a class="player-link" href="#/jugador/${esc(r.player.id)}">${esc(r.player.name)}</a>`;
    const pos = (i) => `<td class="pos pos--${i + 1}">${i + 1}</td>`;
    let table;

    if (ui.rankingTab === 'goles' || ui.rankingTab === 'asist') {
      const key = ui.rankingTab === 'goles' ? 'goals' : 'assists';
      const list = rows.filter((r) => r[key] > 0).sort((a, b) => b[key] - a[key] || a.pj - b.pj);
      table = list.length ? `<table><thead><tr><th></th><th>Jugador</th><th class="num">${key === 'goals' ? 'Goles' : 'Asist.'}</th><th class="num">PJ</th><th class="num">Promedio</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r[key]}</td><td class="num">${r.pj}</td><td class="num">${r.pj ? (r[key] / r.pj).toFixed(2) : '—'}</td></tr>`).join('')}
        </tbody></table>` : '<p class="empty">Todavía no hay datos.</p>';
    } else if (ui.rankingTab === 'calif') {
      const list = rows.filter((r) => r.avg != null).sort((a, b) => b.avg - a.avg || b.pj - a.pj);
      table = list.length ? `<table><thead><tr><th></th><th>Jugador</th><th class="num">Promedio</th><th class="num">⭐ Figura</th><th class="num">PJ</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r.avg.toFixed(2)}</td><td class="num">${r.mvps}</td><td class="num">${r.pj}</td></tr>`).join('')}
        </tbody></table>` : '<p class="empty">Todavía no hay calificaciones.</p>';
    } else {
      const list = rows.slice().sort((a, b) => b.pts - a.pts || b.g - a.g || b.goals - a.goals || a.player.name.localeCompare(b.player.name));
      table = `<table><thead><tr><th></th><th>Jugador</th><th class="num">Pts</th><th class="num">PJ</th><th class="num">G</th><th class="num">E</th><th class="num">P</th><th class="num">⚽</th><th class="num">👟</th><th class="num">⭐</th><th>Últimos</th></tr></thead><tbody>
        ${list.map((r, i) => `<tr>${pos(i)}<td>${name(r)}</td><td class="num big">${r.pts}</td><td class="num">${r.pj}</td><td class="num">${r.g}</td><td class="num">${r.e}</td><td class="num">${r.p}</td><td class="num">${r.goals}</td><td class="num">${r.assists}</td><td class="num">${r.avg != null ? r.avg.toFixed(1) : '—'}</td>
        <td>${r.form.map((x) => `<span class="res res--${x}">${x}</span>`).join(' ')}</td></tr>`).join('')}
        </tbody></table>`;
    }
    return head + tabHtml + `<div class="card"><div class="table-wrap">${table}</div></div>`;
  }

  function viewPlayers() {
    const admin = isAdmin();
    const players = S().players.slice().sort((a, b) => (b.active !== false) - (a.active !== false) || a.name.localeCompare(b.name));
    const list = players.map((p) => {
      const t = playerTotals(p.id);
      return `<div class="player-row ${p.active === false ? 'is-inactive' : ''}">
        <div class="player-row__main">
          <span class="avatar">${esc(initials(p.name))}</span>
          <div style="min-width:0">
            <a class="player-link" href="#/jugador/${esc(p.id)}">${esc(p.name)}</a>
            <div class="small muted">${t.pj} PJ · ${t.pts} pts · ⚽ ${t.goals}${t.debt ? ` · <span style="color:var(--bad)">debe ${money(t.debt)}</span>` : ''}</div>
          </div>
        </div>
        ${admin ? `<div class="btn-row">
          <button class="btn btn--sm" data-action="edit-player" data-id="${esc(p.id)}">Editar</button>
        </div>` : ''}
      </div>`;
    }).join('');

    return `
      <div class="view-head">
        <div><h1>Jugadores</h1><p>${S().players.filter((p) => p.active !== false).length} activos en el grupo</p></div>
        ${admin ? '<button class="btn btn--primary" data-action="new-player">+ Agregar jugador</button>' : ''}
      </div>
      <div class="player-list">${list || '<div class="card"><p class="empty">Todavía no hay jugadores.</p></div>'}</div>`;
  }

  function viewPlayer(id) {
    const p = playerById(id);
    if (!p) return '<a class="back" href="#/jugadores">← Jugadores</a><p class="empty">Ese jugador no existe.</p>';
    const t = playerTotals(id);
    const h = playerHistory(id);

    const rows = h.map((x) => {
      const m = x.match;
      const lab = payLabel(x.pay);
      return `<tr>
        <td><a href="#/partido/${esc(m.id)}">${esc(fmtDate(m.date, { day: 'numeric', month: 'short', year: '2-digit' }))}</a></td>
        <td><span class="pill pill--${x.team ? 'b' : 'a'}">${esc(m.teams[x.team].name)}</span></td>
        <td>${isPlayed(m) ? m.score[x.team] + ' - ' + m.score[1 - x.team] : '—'}</td>
        <td>${x.res ? `<span class="res res--${x.res}">${x.res}</span>` : '—'}</td>
        <td class="num">${x.res ? x.points : '—'}</td>
        <td class="num">${x.goals}</td>
        <td class="num">${x.assists}</td>
        <td class="num">${x.rating || '—'}${x.mvp ? ' ⭐' : ''}</td>
        <td>${lab.pill}</td>
      </tr>`;
    }).join('');

    return `
      <a class="back" href="#/jugadores">← Jugadores</a>
      <div class="view-head">
        <div style="display:flex;align-items:center;gap:12px">
          <span class="avatar" style="width:52px;height:52px;font-size:22px">${esc(initials(p.name))}</span>
          <div><h1>${esc(p.name)}</h1><p>${p.nickname ? esc(p.nickname) + ' · ' : ''}${p.active === false ? 'Inactivo' : 'Activo'}</p></div>
        </div>
      </div>
      <div class="card">
        <div class="stat-grid">
          <div class="stat"><strong>${t.pts}</strong><span>Puntos</span></div>
          <div class="stat"><strong>${t.pj}</strong><span>Partidos</span></div>
          <div class="stat"><strong>${t.g}-${t.e}-${t.p}</strong><span>G-E-P</span></div>
          <div class="stat"><strong>${t.goals}</strong><span>Goles</span></div>
          <div class="stat"><strong>${t.assists}</strong><span>Asistencias</span></div>
          <div class="stat"><strong>${t.avg != null ? t.avg.toFixed(1) : '—'}</strong><span>Calif. prom.</span></div>
          <div class="stat"><strong>${t.mvps}</strong><span>Veces figura</span></div>
          <div class="stat"><strong style="color:${t.debt ? 'var(--bad)' : 'var(--ok)'}">${money(t.debt)}</strong><span>Debe</span></div>
        </div>
      </div>
      <section class="card">
        <div class="card__head"><div><h2>Partido por partido</h2></div></div>
        ${h.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Fecha</th><th>Equipo</th><th>Res.</th><th></th><th class="num">Pts</th><th class="num">⚽</th><th class="num">👟</th><th class="num">Calif.</th><th>Pago</th></tr></thead>
          <tbody>${rows}</tbody></table></div>` : '<p class="muted small" style="margin:0">Todavía no jugó ningún partido.</p>'}
      </section>`;
  }

  function viewSettings() {
    const st = S().settings;
    const admin = isAdmin();
    const dis = admin ? '' : 'disabled';
    const modeNote = store.mode === 'remote'
      ? '<p class="notice notice--ok">Modo compartido: todos los del grupo ven los mismos datos. Solo el encargado (con PIN) puede editar y certificar pagos.</p>'
      : '<p class="notice">Modo local: los datos se guardan solo en este navegador. Para que todo el grupo vea lo mismo hay que activar Vercel KV y el PIN del encargado (ver README). Usá "Exportar" para tener un respaldo.</p>';

    return `
      <div class="view-head"><div><h1>Ajustes</h1></div></div>
      ${modeNote}
      <form class="card" data-form="settings">
        <h2 style="margin-bottom:14px">Grupo</h2>
        <div class="field"><label for="s-name">Nombre del grupo</label><input class="input" id="s-name" name="groupName" value="${esc(st.groupName)}" ${dis} required></div>
        <div class="fields-2">
          <div class="field"><label for="s-ppt">Jugadores por equipo</label><input class="input" id="s-ppt" name="playersPerTeam" type="number" min="1" max="15" value="${esc(st.playersPerTeam)}" ${dis}></div>
          <div class="field"><label for="s-cost">Costo habitual de la cancha</label><input class="input" id="s-cost" name="defaultCost" type="number" min="0" step="100" value="${esc(st.defaultCost)}" ${dis}></div>
        </div>
        <div class="fields-2">
          <div class="field"><label for="s-place">Cancha habitual</label><input class="input" id="s-place" name="defaultPlace" value="${esc(st.defaultPlace)}" ${dis}></div>
          <div class="field"><label for="s-time">Horario habitual</label><input class="input" id="s-time" name="defaultTime" type="time" value="${esc(st.defaultTime)}" ${dis}></div>
        </div>
        <h3 style="margin:6px 0 10px">Puntos del ranking</h3>
        <div class="fields-3">
          <div class="field"><label for="s-w">Ganado</label><input class="input" id="s-w" name="pointsWin" type="number" step="1" value="${esc(st.pointsWin)}" ${dis}></div>
          <div class="field"><label for="s-d">Empatado</label><input class="input" id="s-d" name="pointsDraw" type="number" step="1" value="${esc(st.pointsDraw)}" ${dis}></div>
          <div class="field"><label for="s-l">Perdido</label><input class="input" id="s-l" name="pointsLoss" type="number" step="1" value="${esc(st.pointsLoss)}" ${dis}></div>
        </div>
        ${admin ? '<button class="btn btn--primary" type="submit">Guardar ajustes</button>' : '<p class="muted small">Entrá como encargado para cambiar los ajustes.</p>'}
      </form>
      <section class="card">
        <h2 style="margin-bottom:8px">Respaldo</h2>
        <p class="muted small">Bajá un archivo con todos los jugadores, partidos y pagos.${admin ? ' También podés importar uno.' : ''}</p>
        <div class="btn-row">
          <button class="btn" data-action="export">⬇ Exportar datos</button>
          ${admin ? '<label class="btn">⬆ Importar datos<input type="file" accept="application/json" data-action="import" hidden></label>' : ''}
        </div>
      </section>`;
  }

  /* ---------------------------------------------------------------------
     Diálogos
     --------------------------------------------------------------------- */
  const dlg = () => $('#dialog');
  function openDialog(html) {
    $('#dialogBody').innerHTML = html;
    if (!dlg().open) dlg().showModal();
    const first = $('#dialogBody').querySelector('input:not([type=hidden]):not([type=file]), select, textarea');
    if (first) first.focus();
  }
  function closeDialog() { if (dlg().open) dlg().close(); }

  function matchForm(m) {
    const st = S().settings;
    const isNew = !m;
    m = m || { date: new Date().toISOString().slice(0, 10), time: st.defaultTime, place: st.defaultPlace, courtCost: st.defaultCost, playersPerTeam: st.playersPerTeam, teams: [{ name: 'Equipo A' }, { name: 'Equipo B' }], notes: '' };
    openDialog(`
      <form data-form="match" data-id="${isNew ? '' : esc(m.id)}">
        <h2>${isNew ? 'Nuevo partido' : 'Editar partido'}</h2>
        <div class="fields-2">
          <div class="field"><label for="m-date">Fecha</label><input class="input" id="m-date" name="date" type="date" value="${esc(m.date)}" required></div>
          <div class="field"><label for="m-time">Hora</label><input class="input" id="m-time" name="time" type="time" value="${esc(m.time)}"></div>
        </div>
        <div class="field"><label for="m-place">Cancha / lugar</label><input class="input" id="m-place" name="place" value="${esc(m.place)}"></div>
        <div class="fields-2">
          <div class="field"><label for="m-cost">Alquiler de la cancha ($)</label><input class="input" id="m-cost" name="courtCost" type="number" min="0" step="100" value="${esc(m.courtCost)}" required></div>
          <div class="field"><label for="m-ppt">Jugadores por equipo</label><input class="input" id="m-ppt" name="playersPerTeam" type="number" min="1" max="15" value="${esc(m.playersPerTeam)}" required></div>
        </div>
        <p class="hint">El alquiler se divide en partes iguales entre todos los que juegan.</p>
        <div class="fields-2">
          <div class="field"><label for="m-ta">Nombre equipo A</label><input class="input" id="m-ta" name="teamA" value="${esc(m.teams[0].name)}"></div>
          <div class="field"><label for="m-tb">Nombre equipo B</label><input class="input" id="m-tb" name="teamB" value="${esc(m.teams[1].name)}"></div>
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
    const pool = S().players.filter((p) => p.active !== false || teamDraft.pick[p.id] != null)
      .sort((a, b) => a.name.localeCompare(b.name));
    const count = (t) => Object.values(teamDraft.pick).filter((v) => v === t).length;
    const ca = count(0); const cb = count(1);
    const rows = pool.map((p) => {
      const v = teamDraft.pick[p.id];
      return `<div class="pick-row"><span>${esc(p.name)}</span>
        <span class="seg">
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="0" class="${v === 0 ? 'on-a' : ''}" ${v !== 0 && ca >= teamDraft.max ? 'disabled' : ''}>A</button>
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="1" class="${v === 1 ? 'on-b' : ''}" ${v !== 1 && cb >= teamDraft.max ? 'disabled' : ''}>B</button>
          <button type="button" data-action="pick" data-id="${esc(p.id)}" data-team="" class="${v == null ? 'on-x' : ''}">—</button>
        </span></div>`;
    }).join('');

    openDialog(`
      <h2>Armar equipos</h2>
      <div class="pick-counts">
        <span class="pill pill--a">${esc(m.teams[0].name)}: ${ca}/${teamDraft.max}</span>
        <span class="pill pill--b">${esc(m.teams[1].name)}: ${cb}/${teamDraft.max}</span>
        <span class="pill">Juegan ${ca + cb} · ${money(ca + cb ? Math.ceil(m.courtCost / (ca + cb)) : 0)} c/u</span>
      </div>
      <div class="pick-list">${rows || '<p class="muted">No hay jugadores cargados.</p>'}</div>
      <p class="hint" style="margin-top:0">"Sortear parejo" mezcla a los que ya elegiste según su calificación promedio.</p>
      <div class="dialog__foot">
        <button class="btn" type="button" data-action="shuffle-teams" ${ca + cb < 2 ? 'disabled' : ''}>🎲 Sortear parejo</button>
        <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
        <button class="btn btn--primary" type="button" data-action="save-teams">Guardar equipos</button>
      </div>`);
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
      return `<tr>
        <td><span class="pill pill--${t ? 'b' : 'a'}">${t ? 'B' : 'A'}</span> ${esc(playerName(pid))}</td>
        <td><input class="input input--num" type="number" min="0" name="g_${esc(pid)}" value="${Number(st.goals) || 0}" data-team="${t}" data-goal></td>
        <td><input class="input input--num" type="number" min="0" name="a_${esc(pid)}" value="${Number(st.assists) || 0}"></td>
        <td><input class="input input--num" type="number" min="1" max="10" step="0.5" name="r_${esc(pid)}" value="${st.rating || ''}" placeholder="—"></td>
      </tr>`;
    };
    const sc = m.score || ['', ''];
    openDialog(`
      <form data-form="result" data-id="${esc(m.id)}">
        <h2>Resultado</h2>
        <div class="fields-2">
          <div class="field"><label for="r-a" style="color:var(--team-a)">${esc(m.teams[0].name)}</label><input class="input" id="r-a" name="scoreA" type="number" min="0" value="${esc(sc[0])}"></div>
          <div class="field"><label for="r-b" style="color:var(--team-b)">${esc(m.teams[1].name)}</label><input class="input" id="r-b" name="scoreB" type="number" min="0" value="${esc(sc[1])}"></div>
        </div>
        <p class="hint">Si dejás el marcador vacío se usa la suma de goles de cada equipo.</p>
        <div class="table-wrap"><table>
          <thead><tr><th>Jugador</th><th>Goles</th><th>Asist.</th><th>Calif.</th></tr></thead>
          <tbody>${m.teams[0].playerIds.map((p) => row(p, 0)).join('')}${m.teams[1].playerIds.map((p) => row(p, 1)).join('')}</tbody>
        </table></div>
        <div class="dialog__foot">
          ${isPlayed(m) ? '<button class="btn btn--bad" type="button" data-action="clear-result" data-id="' + esc(m.id) + '">Borrar resultado</button>' : ''}
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">Guardar resultado</button>
        </div>
      </form>`);
  }

  function declareDialog(m, pid) {
    const r = store.receipts[m.id + ':' + pid];
    openDialog(`
      <form data-form="declare" data-match="${esc(m.id)}" data-player="${esc(pid)}">
        <h2>Avisar pago</h2>
        <p class="muted" style="margin-top:-6px">${esc(playerName(pid))} · ${esc(fmtDate(m.date))} · <strong style="color:var(--text)">${money(share(m))}</strong></p>
        <div class="field">
          <span>¿Cómo pagaste?</span>
          <div class="btn-row">
            <label class="btn"><input type="radio" name="method" value="transferencia" ${!r || r.method !== 'efectivo' ? 'checked' : ''}> Transferencia</label>
            <label class="btn"><input type="radio" name="method" value="efectivo" ${r && r.method === 'efectivo' ? 'checked' : ''}> Efectivo</label>
          </div>
        </div>
        <div class="field" data-file-field>
          <label for="d-file">Comprobante (foto, captura o PDF)</label>
          <input class="input" id="d-file" name="file" type="file" accept="image/*,application/pdf">
        </div>
        <p class="hint" data-cash-hint hidden>El encargado de la cancha va a certificar que le pagaste en efectivo.</p>
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
        <h2>${isNew ? 'Agregar jugador' : 'Editar jugador'}</h2>
        <div class="field"><label for="p-name">Nombre</label><input class="input" id="p-name" name="name" value="${esc(p.name)}" required maxlength="40"></div>
        <div class="field"><label for="p-nick">Apodo / posición (opcional)</label><input class="input" id="p-nick" name="nickname" value="${esc(p.nickname || '')}" maxlength="40"></div>
        ${isNew ? '' : `<label class="field" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="active" ${p.active !== false ? 'checked' : ''}> <span>Activo (aparece al armar equipos)</span></label>`}
        <div class="dialog__foot">
          ${!isNew && !played ? `<button class="btn btn--bad" type="button" data-action="delete-player" data-id="${esc(p.id)}">Borrar</button>` : ''}
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">${isNew ? 'Agregar' : 'Guardar'}</button>
        </div>
        ${isNew ? '<p class="hint" style="margin-top:10px">Tip: podés pegar varios nombres separados por coma o uno por línea.</p>' : ''}
      </form>`);
    if (isNew) {
      // Permite cargar varios de una
      const input = $('#p-name');
      const ta = document.createElement('textarea');
      ta.className = 'input'; ta.id = 'p-name'; ta.name = 'name'; ta.rows = 3; ta.required = true;
      ta.placeholder = 'Juan Pérez\nMartín Gómez';
      input.replaceWith(ta);
      ta.focus();
    }
  }

  function loginDialog() {
    openDialog(`
      <form data-form="login">
        <h2>Encargado de la cancha</h2>
        <p class="muted" style="margin-top:-6px">Con el PIN podés crear partidos, armar equipos, cargar resultados y certificar pagos.</p>
        ${store.adminPinSet ? '' : '<p class="notice">Todavía no está configurado el PIN (variable FUTBOL_ADMIN_PIN en Vercel).</p>'}
        <div class="field"><label for="l-pin">PIN</label><input class="input" id="l-pin" name="pin" type="password" inputmode="numeric" autocomplete="current-password" required></div>
        <div class="dialog__foot">
          <button class="btn btn--ghost" type="button" data-action="close-dialog">Cancelar</button>
          <button class="btn btn--primary" type="submit">Entrar</button>
        </div>
      </form>`);
  }

  async function viewReceipt(matchId, playerId) {
    const key = matchId + ':' + playerId;
    const meta = store.receipts[key];
    openDialog('<h2>Comprobante</h2><p class="empty">Cargando…</p>');
    const file = await fetchReceiptFile(key);
    if (!dlg().open) return;
    if (!file) { openDialog('<h2>Comprobante</h2><p class="empty">No se encontró el archivo.</p><div class="dialog__foot"><button class="btn" data-action="close-dialog">Cerrar</button></div>'); return; }
    const isPdf = file.startsWith('data:application/pdf');
    const m = matchById(matchId);
    openDialog(`
      <h2>Comprobante</h2>
      <p class="muted" style="margin-top:-6px">${esc(playerName(playerId))} · ${m ? esc(fmtDate(m.date)) + ' · ' + money(share(m)) : ''}<br>Subido ${esc(fmtDateTime(meta && meta.uploadedAt))}${meta && meta.note ? ' · "' + esc(meta.note) + '"' : ''}</p>
      ${isPdf ? `<iframe class="receipt-pdf" src="${file}" title="Comprobante"></iframe>` : `<img class="receipt-img" src="${file}" alt="Comprobante de ${esc(playerName(playerId))}">`}
      <div class="dialog__foot">
        <a class="btn" href="${file}" download="comprobante-${esc(playerName(playerId))}.${isPdf ? 'pdf' : 'jpg'}">⬇ Descargar</a>
        ${isAdmin() && payStatus(m, playerId).kind !== 'paid' ? `<button class="btn btn--ok" data-action="confirm-pay" data-method="transferencia" data-match="${esc(matchId)}" data-player="${esc(playerId)}">✓ Confirmar pago</button>` : ''}
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
    try { await navigator.clipboard.writeText(text); toast('Copiado. Pegalo en el grupo 👍'); }
    catch (e) { openDialog(`<h2>Copiá el resumen</h2><textarea class="input" rows="10" readonly>${esc(text)}</textarea><div class="dialog__foot"><button class="btn" data-action="close-dialog">Cerrar</button></div>`); }
  }

  function exportData() {
    const data = { exportedAt: new Date().toISOString(), state: S(), receipts: store.receipts };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'futbol-' + new Date().toISOString().slice(0, 10) + '.json';
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
    'save-teams': async () => {
      const { matchId, pick } = teamDraft;
      const ids = (t) => Object.keys(pick).filter((id) => pick[id] === t);
      const ok = await commit((s) => {
        const m = s.matches.find((x) => x.id === matchId);
        m.teams[0].playerIds = ids(0);
        m.teams[1].playerIds = ids(1);
      }, 'Equipos guardados');
      if (ok) closeDialog();
    },
    'edit-result': (el) => resultDialog(matchById(el.dataset.id)),
    'clear-result': async (el) => {
      if (!confirm('¿Borrar el resultado y las estadísticas de este partido?')) return;
      if (await commit((s) => { const m = s.matches.find((x) => x.id === el.dataset.id); m.score = null; m.stats = {}; }, 'Resultado borrado')) closeDialog();
    },
    'declare': (el) => declareDialog(matchById(el.dataset.match), el.dataset.player),
    'view-receipt': (el) => viewReceipt(el.dataset.match, el.dataset.player),
    'confirm-pay': async (el) => {
      const { match, player, method } = el.dataset;
      const ok = await commit((s) => {
        const m = s.matches.find((x) => x.id === match);
        const r = store.receipts[match + ':' + player];
        m.payments[player] = { status: 'pagado', method, confirmedAt: new Date().toISOString(), note: r && r.note ? r.note : '' };
      }, `${playerName(player)}: pago confirmado`);
      if (ok) closeDialog();
    },
    'undo-pay': async (el) => {
      const { match, player } = el.dataset;
      if (!confirm(`¿Anular el pago de ${playerName(player)}?`)) return;
      await commit((s) => { delete s.matches.find((x) => x.id === match).payments[player]; }, 'Pago anulado');
    },
    'reject-pay': async (el) => {
      const { match, player } = el.dataset;
      if (!confirm(`¿Rechazar el aviso de pago de ${playerName(player)}? Vuelve a figurar como que no pagó.`)) return;
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
      let file = null; let fileName = '';
      if (method === 'transferencia') {
        if (!fileInput.files.length) { toast('Subí el comprobante de la transferencia', true); return; }
        const btn = form.querySelector('[type=submit]');
        btn.disabled = true; btn.textContent = 'Subiendo…';
        try { file = await fileToDataUrl(fileInput.files[0]); fileName = fileInput.files[0].name; }
        catch (e) { toast(e.message, true); btn.disabled = false; btn.textContent = 'Enviar aviso'; return; }
      }
      const ok = await declarePayment(form.dataset.match, form.dataset.player, method, file, fileName, form.elements.note.value.trim());
      if (ok) { closeDialog(); toast('¡Listo! El encargado lo va a confirmar.'); render(); }
      else { const btn = form.querySelector('[type=submit]'); btn.disabled = false; btn.textContent = 'Enviar aviso'; }
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
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.tagName === 'INPUT') return;
    const fn = clickActions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el); }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('input[data-action="import"]') && e.target.files[0]) importData(e.target.files[0]);
    if (e.target.name === 'method') syncDeclareForm();
  });

  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-form]');
    if (!form) return;
    e.preventDefault();
    const fn = formHandlers[form.dataset.form];
    if (fn) fn(form);
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
