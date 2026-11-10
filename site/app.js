/* Seen in the Crowd: charts (dependency-free SVG) and language/theme switching */
(() => {
  const D = window.STEAM_DATA;
  const I18N = window.I18N;
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  let LANG = 'en';
  try { if (localStorage.getItem('lang') === 'tr') LANG = 'tr'; } catch (e) {}
  const qp = new URLSearchParams(location.search).get('lang');
  if (qp === 'tr' || qp === 'en') LANG = qp;
  const T = () => I18N.ui[LANG];
  const locale = () => I18N.meta[LANG].locale;
  const num = v => Number(v).toLocaleString(locale());
  const dec = v => Number(v).toLocaleString(locale(), { maximumFractionDigits: 1 });
  const pct = v => (LANG === 'tr' ? '%' + dec(v) : dec(v) + '%');

  /* ---------- Small helpers ---------- */
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  }
  function svgIn(container, w, h, label) {
    container.innerHTML = '';
    return el('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}`, role: 'group', 'aria-label': label }, container);
  }
  function text(parent, x, y, str, attrs = {}) {
    const t = el('text', { x, y, ...attrs }, parent);
    t.textContent = str;
    return t;
  }
  // 4px rounded data end, square baseline
  function hbarPath(x0, x1, y, h, r = 4) {
    const w = x1 - x0; r = Math.min(r, w, h / 2);
    if (w <= 0) return '';
    return `M${x0},${y}H${x1 - r}Q${x1},${y} ${x1},${y + r}V${y + h - r}Q${x1},${y + h} ${x1 - r},${y + h}H${x0}Z`;
  }
  function colPath(x, w, yTop, yBase, r = 4) {
    const h = yBase - yTop; r = Math.min(r, h, w / 2);
    if (h <= 0) return '';
    return `M${x},${yBase}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yBase}Z`;
  }
  const fill = v => `fill:var(${v})`;

  /* ---------- Tooltip ---------- */
  const tip = document.querySelector('.tooltip');
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14, top = y - r.height - 12;
    if (left + r.width > innerWidth - 8) left = x - r.width - 14;
    if (top < 8) top = y + 18;
    tip.style.left = Math.max(8, left) + 'px'; tip.style.top = top + 'px';
  }
  const hideTip = () => { tip.hidden = true; };
  const row = (color, label) => `<span class="tt-row"><i style="background:var(${color})"></i>${label}</span>`;
  const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Attach a tooltip to a hit area (pointer + keyboard)
  function bind(hit, group, html) {
    hit.setAttribute('tabindex', '0');
    hit.setAttribute('aria-label', plain(html));
    const on = e => {
      group && group.classList.add('on');
      if (e.type === 'focus') { const b = hit.getBoundingClientRect(); showTip(html, b.left + b.width / 2, b.top); }
      else showTip(html, e.clientX, e.clientY);
    };
    const off = () => { group && group.classList.remove('on'); hideTip(); };
    hit.addEventListener('pointerenter', on);
    hit.addEventListener('pointermove', on);
    hit.addEventListener('pointerleave', off);
    hit.addEventListener('focus', on);
    hit.addEventListener('blur', off);
  }

  /* ---------- Hero: the shelf of games ---------- */
  let litSet = null;
  function mulberry32(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function renderShelf(animate) {
    const svg = document.getElementById('shelf');
    const W = svg.parentElement.clientWidth;
    if (W < 120) return;
    const total = Math.round(D.meta.cohort_games / 100);
    const lit = Math.round(total * D.concentration.visible_pct / 100);
    const cols = W >= 820 ? 42 : W >= 300 ? 28 : 21;
    const rows = Math.ceil(total / cols);
    const s = W / cols, r = Math.max(2.4, s * 0.3);
    svg.setAttribute('viewBox', `0 0 ${W} ${rows * s}`);
    svg.setAttribute('width', W); svg.setAttribute('height', rows * s);
    svg.setAttribute('aria-label', T().shelfAria(num(total), lit, pct(D.concentration.visible_pct)));
    if (!litSet) {
      const rnd = mulberry32(2026); litSet = new Set();
      while (litSet.size < lit) litSet.add(Math.floor(rnd() * total));
    }
    svg.innerHTML = '';
    const order = [...litSet];
    for (let i = 0; i < total; i++) {
      const c = el('circle', { cx: (i % cols) * s + s / 2, cy: Math.floor(i / cols) * s + s / 2, r }, svg);
      if (litSet.has(i)) {
        if (animate && !reduceMotion) {
          c.style.transitionDelay = (300 + order.indexOf(i) * 28) + 'ms';
          requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('lit')));
        } else c.classList.add('lit');
      }
    }
  }

  /* ---------- Column chart: yearly releases ---------- */
  function renderReleases() {
    const box = document.getElementById('c-releases');
    const data = D.releases_per_year;
    const W = box.clientWidth, H = W < 560 ? 240 : 300;
    const m = { l: 52, r: 4, t: 28, b: 30 };
    const svg = svgIn(box, W, H, T().aria.releases);
    const max = Math.ceil(Math.max(...data.map(d => d.games)) / 5000) * 5000;
    const y = v => m.t + (H - m.t - m.b) * (1 - v / max);
    const step = W < 560 ? 10000 : 5000;
    for (let v = 0; v <= max; v += step) {
      el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), style: 'stroke:var(--grid)' }, svg);
      text(svg, m.l - 8, y(v) + 4, num(v), { 'text-anchor': 'end' });
    }
    const band = (W - m.l - m.r) / data.length, cw = Math.min(24, band * 0.64);
    const labelled = band < 40 ? new Set([2010, 2014, 2018, 2022, 2025]) : null;
    const first = data.find(d => d.year === 2014), last = data[data.length - 1];
    data.forEach((d, i) => {
      const x = m.l + band * i + (band - cw) / 2;
      const g = el('g', {}, svg);
      el('rect', { class: 'row-hl', x: m.l + band * i, y: m.t, width: band, height: H - m.t - m.b }, g);
      el('path', { d: colPath(x, cw, y(d.games), y(0)), style: fill(d === last ? '--b' : '--a') }, g);
      if (!labelled || labelled.has(d.year)) text(svg, x + cw / 2, H - 8, d.year, { 'text-anchor': 'middle' });
      if (d === first || d === last) text(svg, x + cw / 2, y(d.games) - 8, num(d.games), { 'text-anchor': 'middle', class: 'val' });
      const hit = el('rect', { class: 'hit', x: m.l + band * i, y: m.t, width: band, height: H - m.t - m.b }, g);
      bind(hit, g, `<b>${d.year}</b>${T().games(num(d.games))}`);
    });
  }

  /* ---------- Horizontal bars (one or two series) ---------- */
  function renderHBars(box, { rows, max, tickStep, labelW, fmt, ariaLabel }) {
    const W = box.clientWidth;
    const narrow = W < 520; // on narrow screens the label moves above the row
    const series = rows[0].values.length;
    const barH = series > 1 ? 12 : 18, gap = 2, rowGap = series > 1 ? 18 : 16;
    const labH = narrow ? 22 : 0;
    const rowH = labH + series * barH + (series - 1) * gap;
    const m = { l: narrow ? 0 : Math.min(labelW, W * 0.34), r: 52, t: 6, b: 26 };
    const H = m.t + rows.length * (rowH + rowGap) - rowGap + m.b + 6;
    const svg = svgIn(box, W, H, ariaLabel);
    const x = v => m.l + (W - m.l - m.r) * v / max;
    for (let v = 0; v <= max; v += tickStep) {
      el('line', { x1: x(v), x2: x(v), y1: m.t - 4, y2: H - m.b, style: 'stroke:var(--grid)' }, svg);
      text(svg, x(v), H - 8, fmt(v), { 'text-anchor': v === 0 && narrow ? 'start' : 'middle' });
    }
    rows.forEach((rw, i) => {
      const yRow = m.t + i * (rowH + rowGap);
      const y0 = yRow + labH;
      const g = el('g', {}, svg);
      el('rect', { class: 'row-hl', x: 0, y: yRow - rowGap / 2 + 2, width: W, height: rowH + rowGap - 4, rx: 6 }, g);
      if (narrow) text(g, 0, yRow + 14, rw.label, { class: 'lab' });
      else text(g, 0, y0 + rowH / 2 + 5, rw.label, { class: 'lab' });
      rw.values.forEach((s, j) => {
        const yy = y0 + j * (barH + gap);
        el('path', { d: hbarPath(x(0), x(s.v), yy, barH), style: fill(s.color) }, g);
        text(g, x(s.v) + 6, yy + barH / 2 + 4, fmt(s.v), { class: 'val' });
      });
      const hit = el('rect', { class: 'hit', x: 0, y: yRow - rowGap / 2, width: W, height: rowH + rowGap }, g);
      bind(hit, g, `<b>${rw.label}</b>` + rw.values.map(s => row(s.color, `${s.name}: ${fmt(s.v)}`)).join('') + (rw.extra || ''));
    });
  }

  function renderBuckets() {
    const t = T();
    renderHBars(document.getElementById('c-buckets'), {
      rows: D.review_buckets.map(d => ({
        label: t.bucket(d.bucket),
        values: [
          { v: d.pct_games, color: '--a', name: t.shareGames },
          { v: d.pct_reviews, color: '--b', name: t.shareReviews }
        ],
        extra: `<span class="tt-row">${t.games(num(d.games))}</span>`
      })),
      max: 100, tickStep: 25, labelW: 130, fmt: pct, ariaLabel: t.aria.buckets
    });
  }

  function renderPrice() {
    const t = T();
    const best = D.price_bands.reduce((a, b) => (b.visible_pct > a.visible_pct ? b : a));
    renderHBars(document.getElementById('c-price'), {
      rows: D.price_bands.map(d => ({
        label: t.band(d.band),
        values: [{ v: d.visible_pct, color: d === best ? '--b' : '--a', name: t.seenRate }],
        extra: `<span class="tt-row">${t.games(num(d.games))} · ${t.medianReviews(num(d.median_reviews))}</span>`
      })),
      max: 40, tickStep: 10, labelW: 96, fmt: pct, ariaLabel: t.aria.price
    });
  }

  /* ---------- Small multiples: language effect within a price band ---------- */
  function renderLangs() {
    const t = T();
    const box = document.getElementById('c-langs');
    box.innerHTML = '';
    const bandOrder = ['$0–5', '$5–10', '$10–20'], langOrder = ['1', '2–6', '7+'];
    const colors = { '1': '--a2', '2–6': '--a', '7+': '--b' };
    const max = 50;
    bandOrder.forEach(band => {
      const cell = document.createElement('div'); box.appendChild(cell);
      const W = cell.clientWidth, H = 230;
      const m = { l: 38, r: 4, t: 34, b: 28 };
      const svg = svgIn(cell, W, H, t.aria.langs(band));
      text(svg, m.l, 14, t.bandGames(band), { class: 'ptitle' });
      const y = v => m.t + (H - m.t - m.b) * (1 - v / max);
      for (let v = 0; v <= max; v += 25) {
        el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), style: 'stroke:var(--grid)' }, svg);
        text(svg, m.l - 6, y(v) + 4, pct(v), { 'text-anchor': 'end' });
      }
      const band3 = (W - m.l - m.r) / 3, cw = Math.min(24, band3 * 0.5);
      langOrder.forEach((lg, i) => {
        const d = D.languages_controlled.find(r => r.band === band && r.langs === lg);
        const x = m.l + band3 * i + (band3 - cw) / 2;
        const g = el('g', {}, svg);
        el('rect', { class: 'row-hl', x: m.l + band3 * i, y: m.t, width: band3, height: H - m.t - m.b }, g);
        el('path', { d: colPath(x, cw, y(d.visible_pct), y(0)), style: fill(colors[lg]) }, g);
        text(g, x + cw / 2, y(d.visible_pct) - 7, pct(d.visible_pct), { 'text-anchor': 'middle', class: 'val' });
        text(g, x + cw / 2, H - 9, t.langs(lg), { 'text-anchor': 'middle' });
        const hit = el('rect', { class: 'hit', x: m.l + band3 * i, y: m.t, width: band3, height: H - m.t - m.b }, g);
        bind(hit, g, `<b>${band} · ${t.langsLong(lg)}</b>${row(colors[lg], t.seen + ': ' + pct(d.visible_pct))}<span class="tt-row">${t.games(num(d.games))}</span>`);
      });
    });
  }

  /* ---------- Dumbbell: the gap between two values ---------- */
  function renderDumbbell(box, { rows, max, tickStep, labelW, headA, headB, nameA, nameB, ariaLabel }) {
    const W = box.clientWidth;
    const narrow = W < 520; // on narrow screens the label moves above the row
    const colW = 58;
    const m = { l: narrow ? 0 : Math.min(labelW, W * 0.3), r: colW * 2 + 12, t: 26, b: 26 };
    const rowH = narrow ? 46 : 34, labH = narrow ? 16 : 0;
    const H = m.t + rows.length * rowH + m.b;
    const svg = svgIn(box, W, H, ariaLabel);
    const x = v => m.l + 8 + (W - m.l - m.r - 16) * v / max;
    const tStep = narrow ? tickStep * 2 : tickStep;
    for (let v = 0; v <= max; v += tStep) {
      el('line', { x1: x(v), x2: x(v), y1: m.t - 6, y2: H - m.b, style: 'stroke:var(--grid)' }, svg);
      text(svg, x(v), H - 8, pct(v), { 'text-anchor': 'middle' });
    }
    const cA = W - colW * 2 + 4, cB = W - colW + 4;
    text(svg, cA + colW - 12, 12, headA, { 'text-anchor': 'end' });
    text(svg, cB + colW - 12, 12, headB, { 'text-anchor': 'end' });
    rows.forEach((rw, i) => {
      const top = m.t + i * rowH;
      const cy = top + labH + (rowH - labH) / 2;
      const g = el('g', {}, svg);
      el('rect', { class: 'row-hl', x: 0, y: top + 2, width: W, height: rowH - 4, rx: 6 }, g);
      if (narrow) text(g, 0, top + 15, rw.label, { class: 'lab' });
      else text(g, 0, cy + 5, rw.label, { class: 'lab' });
      el('line', { x1: x(rw.a), x2: x(rw.b), y1: cy, y2: cy, style: 'stroke:var(--ink-2);stroke-width:2;stroke-linecap:round;opacity:.35' }, g);
      el('circle', { cx: x(rw.a), cy, r: 6, style: 'fill:var(--a);stroke:var(--panel);stroke-width:2' }, g);
      el('circle', { cx: x(rw.b), cy, r: 6, style: 'fill:var(--b);stroke:var(--panel);stroke-width:2' }, g);
      text(g, cA + colW - 12, cy + 4, pct(rw.a), { 'text-anchor': 'end' });
      text(g, cB + colW - 12, cy + 4, pct(rw.b), { 'text-anchor': 'end', class: 'val' });
      const hit = el('rect', { class: 'hit', x: 0, y: top, width: W, height: rowH }, g);
      bind(hit, g, `<b>${rw.label}</b>${row('--a', nameA + ': ' + pct(rw.a))}${row('--b', nameB + ': ' + pct(rw.b))}${rw.extra || ''}`);
    });
  }

  function renderGenres() {
    const t = T();
    const rows = D.genres
      .map(d => ({ label: t.genre(d.genre === 'Massively Multiplayer' ? 'MMO' : d.genre), a: d.pct_of_releases, b: d.pct_of_reviews,
                   extra: `<span class="tt-row">${t.games(num(d.games))}</span>` }))
      .sort((p, q) => (q.b - q.a) - (p.b - p.a));
    renderDumbbell(document.getElementById('c-genres'), {
      rows, max: 80, tickStep: 20, labelW: 130, headA: t.supply, headB: t.demand,
      nameA: t.supplyLong, nameB: t.demandLong, ariaLabel: t.aria.genres
    });
  }

  function renderFeatures() {
    const t = T();
    const rows = D.features.map(d => ({
      label: t.feature[d.feature] || d.feature, a: d.without_pct, b: d.with_pct,
      extra: `<span class="tt-row">${t.adoption(pct(d.adoption_pct))}</span>`
    }));
    renderDumbbell(document.getElementById('c-features'), {
      rows, max: 25, tickStep: 5, labelW: 210, headA: t.without, headB: t.with,
      nameA: t.withoutLong, nameB: t.withLong, ariaLabel: t.aria.features
    });
  }

  /* ---------- Line chart: Turkish support ---------- */
  function renderTurkish() {
    const t = T();
    const box = document.getElementById('c-turkish');
    const data = D.turkish_support;
    const W = box.clientWidth, H = W < 560 ? 240 : 290;
    const m = { l: 44, r: 58, t: 16, b: 30 };
    const svg = svgIn(box, W, H, t.lineHint);
    const max = 30;
    const x = i => m.l + (W - m.l - m.r) * i / (data.length - 1);
    const y = v => m.t + (H - m.t - m.b) * (1 - v / max);
    for (let v = 0; v <= max; v += 10) {
      el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), style: 'stroke:var(--grid)' }, svg);
      text(svg, m.l - 8, y(v) + 4, pct(v), { 'text-anchor': 'end' });
    }
    const every = W < 560 ? 3 : 1;
    data.forEach((d, i) => {
      if (i % every === 0 || i === data.length - 1) text(svg, x(i), H - 8, W < 560 ? "'" + String(d.year).slice(2) : d.year, { 'text-anchor': 'middle' });
    });
    const series = [
      { key: 'pct_turkish', color: '--a', name: t.allGames },
      { key: 'pct_turkish_visible', color: '--b', name: t.seenGames }
    ];
    const cross = el('line', { y1: m.t, y2: H - m.b, style: 'stroke:var(--muted);stroke-width:1;opacity:0' }, svg);
    const hovers = [];
    series.forEach(s => {
      const d = data.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p[s.key])}`).join('');
      el('path', { d, style: `fill:none;stroke:var(${s.color});stroke-width:2;stroke-linejoin:round;stroke-linecap:round` }, svg);
      const lastV = data[data.length - 1][s.key];
      el('circle', { cx: x(data.length - 1), cy: y(lastV), r: 4.5, style: `fill:var(${s.color});stroke:var(--panel);stroke-width:2` }, svg);
      text(svg, x(data.length - 1) + 10, y(lastV) + 4, pct(lastV), { class: 'val' });
      hovers.push(el('circle', { r: 5, style: `fill:var(${s.color});stroke:var(--panel);stroke-width:2;opacity:0` }, svg));
    });
    const hit = el('rect', { class: 'hit', x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b }, svg);
    hit.setAttribute('tabindex', '0');
    hit.setAttribute('aria-label', t.lineHint);
    let idx = data.length - 1;
    const show = (i, cx, cy) => {
      idx = i; const d = data[i];
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.style.opacity = 1;
      series.forEach((s, k) => { hovers[k].setAttribute('cx', x(i)); hovers[k].setAttribute('cy', y(d[s.key])); hovers[k].style.opacity = 1; });
      const html = `<b>${d.year}</b>` + series.map(s => row(s.color, `${s.name}: ${pct(d[s.key])}`)).join('');
      if (cx == null) { const b = svg.getBoundingClientRect(); cx = b.left + x(i); cy = b.top + y(d.pct_turkish_visible); }
      showTip(html, cx, cy);
    };
    const hide = () => { cross.style.opacity = 0; hovers.forEach(h => (h.style.opacity = 0)); hideTip(); };
    hit.addEventListener('pointermove', e => {
      const b = svg.getBoundingClientRect();
      const i = Math.round((e.clientX - b.left - m.l) / (W - m.l - m.r) * (data.length - 1));
      show(Math.max(0, Math.min(data.length - 1, i)), e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', hide);
    hit.addEventListener('focus', () => show(idx));
    hit.addEventListener('blur', hide);
    hit.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        show(Math.max(0, Math.min(data.length - 1, idx + (e.key === 'ArrowRight' ? 1 : -1))));
      }
    });
  }

  /* ---------- Table and SQL toggles ---------- */
  function tableSpec(key) {
    const t = T(), c = t.cols;
    return {
      releases_per_year: [[c.year, 'year'], [c.games, 'games', num]],
      review_buckets: [[c.bucket, 'bucket', t.bucket], [c.games, 'games', num], [c.shareGames, 'pct_games', pct], [c.shareReviews, 'pct_reviews', pct]],
      price_bands: [[c.band, 'band', t.band], [c.games, 'games', num], [c.seen, 'visible_pct', pct], [c.medianReviews, 'median_reviews', num], [c.medianPositive, 'median_positive', pct]],
      languages_controlled: [[c.band, 'band'], [c.langs, 'langs'], [c.games, 'games', num], [c.seen, 'visible_pct', pct]],
      genres: [[c.genre, 'genre', g => t.genre(g)], [c.games, 'games', num], [c.supply, 'pct_of_releases', pct], [c.demand, 'pct_of_reviews', pct], [c.seen, 'visible_pct', pct]],
      features: [[c.feature, 'feature', f => t.feature[f] || f], [c.with, 'with_pct', pct], [c.without, 'without_pct', pct], [c.adoption, 'adoption_pct', pct]],
      turkish_support: [[c.year, 'year'], [c.allGames, 'pct_turkish', pct], [c.seenGames, 'pct_turkish_visible', pct]]
    }[key];
  }
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const KW = /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|CASE|WHEN|THEN|ELSE|END|AS|AND|OR|NOT|WITH|OVER|FILTER|BETWEEN|UNION ALL|JOIN|ON|IN|CREATE|VIEW|TABLE)\b/g;
  function highlightSQL(sql) {
    return sql.split('\n').map(line => {
      const i = line.indexOf('--');
      const code = i >= 0 ? line.slice(0, i) : line, cm = i >= 0 ? line.slice(i) : '';
      return esc(code).replace(KW, '<span class="k">$1</span>') + (cm ? `<span class="c">${esc(cm)}</span>` : '');
    }).join('\n');
  }
  let uid = 0;
  function buildExtras(node) {
    node.innerHTML = '';
    const t = T();
    const key = node.dataset.table, cols = tableSpec(key);
    let rows = D[key];
    if (key === 'languages_controlled') {
      const o = { '$0–5': 0, '$5–10': 1, '$10–20': 2 };
      rows = [...rows].sort((a, b) => o[a.band] - o[b.band]);
    }
    const tableHTML = `<div class="table-wrap"><table class="data"><thead><tr>${cols.map(c => `<th scope="col">${c[0]}</th>`).join('')}</tr></thead><tbody>${
      rows.map(r => `<tr>${cols.map(c => `<td>${esc(c[2] ? c[2](r[c[1]]) : r[c[1]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const sqlHTML = `<pre class="sql"><code>${highlightSQL(D.sql[node.dataset.sql])}</code></pre>`;
    const parts = [[t.showTable, t.hideTable, tableHTML], [t.showSQL, t.hideSQL, sqlHTML]];
    const tray = document.createElement('div'); tray.className = 'tray';
    node.appendChild(tray);
    const panels = parts.map(([openLabel, closeLabel, html]) => {
      const id = 'x' + (++uid);
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'tgl'; btn.textContent = openLabel;
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
      const panel = document.createElement('div');
      panel.className = 'panel'; panel.id = id; panel.hidden = true; panel.innerHTML = html;
      tray.appendChild(btn);
      return { btn, panel, openLabel, closeLabel };
    });
    panels.forEach(p => {
      node.appendChild(p.panel);
      p.btn.addEventListener('click', () => {
        const open = p.panel.hidden;
        panels.forEach(q => { q.panel.hidden = true; q.btn.setAttribute('aria-expanded', 'false'); q.btn.textContent = q.openLabel; });
        if (open) { p.panel.hidden = false; p.btn.setAttribute('aria-expanded', 'true'); p.btn.textContent = p.closeLabel; }
      });
    });
  }

  /* ---------- Fill numbers in the copy from the data ---------- */
  function bindNumbers() {
    const yr = y => D.releases_per_year.find(d => d.year === y).games;
    const last = D.releases_per_year[D.releases_per_year.length - 1];
    const months = D.release_month.map(d => d.visible_pct);
    const vals = {
      perDay: num(Math.round(last.games / 365)),
      cohort: num(D.meta.cohort_games),
      visiblePct: pct(D.concentration.visible_pct),
      y2014: num(yr(2014)), y2025: num(last.games),
      total: num(D.meta.total_games),
      until: new Date(D.meta.data_until + 'T00:00:00').toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' }),
      monthGap: dec(Math.max(...months) - Math.min(...months))
    };
    document.querySelectorAll('[data-k]').forEach(n => { if (vals[n.dataset.k] != null) n.textContent = vals[n.dataset.k]; });
  }

  /* ---------- Theme ---------- */
  const themeBtn = document.querySelector('.theme-btn');
  const themeOrder = ['system', 'light', 'dark'];
  const curTheme = () => document.documentElement.dataset.theme || 'system';
  function paintTheme() {
    const name = T().theme[curTheme()];
    themeBtn.querySelector('.theme-label').textContent = name;
    themeBtn.setAttribute('aria-label', T().themeAria(name));
  }
  themeBtn.addEventListener('click', () => {
    const next = themeOrder[(themeOrder.indexOf(curTheme()) + 1) % themeOrder.length];
    if (next === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    try { next === 'system' ? localStorage.removeItem('theme') : localStorage.setItem('theme', next); } catch (e) {}
    paintTheme();
  });

  /* ---------- Rendering ---------- */
  function renderCharts() {
    // Skip while the layout has no width yet; the ResizeObserver renders again
    if (document.getElementById('c-releases').clientWidth < 120) return;
    renderReleases(); renderBuckets(); renderPrice(); renderLangs();
    renderGenres(); renderFeatures(); renderTurkish();
  }

  const EN_HTML = {};
  document.querySelectorAll('[data-i18n]').forEach(n => { EN_HTML[n.dataset.i18n] = n.innerHTML; });
  function applyLanguage(lang, save) {
    LANG = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(n => {
      const k = n.dataset.i18n;
      n.innerHTML = lang === 'tr' && I18N.tr[k] != null ? I18N.tr[k] : EN_HTML[k];
    });
    document.title = I18N.meta[lang].title;
    document.querySelector('meta[name="description"]').setAttribute('content', I18N.meta[lang].description);
    document.querySelectorAll('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (save) { try { localStorage.setItem('lang', lang); } catch (e) {} }
    hideTip();
    bindNumbers();
    paintTheme();
    document.querySelectorAll('.extras').forEach(buildExtras);
    renderCharts();
  }
  document.querySelectorAll('.lang-switch button').forEach(b =>
    b.addEventListener('click', () => { if (b.dataset.lang !== LANG) { applyLanguage(b.dataset.lang, true); renderShelf(false); } }));

  applyLanguage(LANG, false);
  renderShelf(true);

  let lastW = document.querySelector('main').clientWidth, raf = 0;
  new ResizeObserver(() => {
    const w = document.querySelector('main').clientWidth;
    if (w === lastW) return; lastW = w;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { hideTip(); renderShelf(false); renderCharts(); });
  }).observe(document.querySelector('main'));
  addEventListener('scroll', hideTip, { passive: true });
})();
