/* Make-your-box builder: 3D kraft box that spins while gifts drop in */
{
  const U = window.U, S = U.S;
  const $ = id => document.getElementById(id);
  const stage = $('boxStage'), box = $('box3d'), inside = $('boxInside');
  const state = { cal: S.defaultBox.cal, tier: S.defaultBox.tier, extras: new Set() };
  const sprites = new Map();
  let angle = -28, vel = 0, dragging = false, lastX = 0, idleUntil = 0, bump = 0;
  let started = false, running = false, rafId = 0;

  /* ---- Controls ---- */
  $('pickCal').innerHTML = S.calendars.map(c => `
    <div class="opt">
      <input type="radio" name="bcal" id="bc-${c.id}" value="${c.id}">
      <label for="bc-${c.id}" style="--c:${c.color}"><span class="swatch"></span><span><b>${U.esc(c.short)}</b><small>${U.inr(U.off(c.mrp))}</small></span></label>
    </div>`).join('');
  $('pickTier').innerHTML = S.tiers.map(t => `
    <div class="opt tier">
      ${t.badge ? `<span class="badge">${U.esc(t.badge)}</span>` : ''}
      <input type="radio" name="btier" id="bt-${t.id}" value="${t.id}">
      <label for="bt-${t.id}"><b>${U.esc(t.name)}</b><span class="tp">${t.mrp ? `+${U.inr(U.off(t.mrp))}<s>${U.inr(t.mrp)}</s>` : 'Free'}</span><small>${U.esc(t.blurb)}</small></label>
    </div>`).join('');
  $('pickExtras').innerHTML = S.extras.map(e => `
    <div class="opt chip-x">
      <input type="checkbox" id="bx-${e.id}" value="${e.id}">
      <label for="bx-${e.id}">${U.icon(S.items[e.item].icon)}${U.esc(S.items[e.item].label)} <em>+${U.inr(U.off(e.mrp))}</em></label>
    </div>`).join('');
  $('pickExtras').classList.add('extras');

  function syncInputs() {
    const c = $('bc-' + state.cal); if (c) c.checked = true;
    const t = $('bt-' + state.tier); if (t) t.checked = true;
    S.extras.forEach(e => { $('bx-' + e.id).checked = state.extras.has(e.id); });
  }
  $('boxPanel').addEventListener('change', e => {
    const el = e.target;
    if (el.name === 'bcal') state.cal = el.value;
    else if (el.name === 'btier') state.tier = el.value;
    else if (el.type === 'checkbox') el.checked ? state.extras.add(el.value) : state.extras.delete(el.value);
    update(true);
  });

  /* ---- Prices + message ---- */
  function totals() {
    const c = U.calById(state.cal), t = U.tierById(state.tier);
    const ex = [...state.extras].map(id => S.extras.find(e => e.id === id));
    const mrp = c.mrp + t.mrp + ex.reduce((s, e) => s + e.mrp, 0);
    const now = U.off(c.mrp) + U.off(t.mrp) + ex.reduce((s, e) => s + U.off(e.mrp), 0);
    return { c, t, ex, mrp, now };
  }
  function message() {
    const { c, t, ex, now } = totals();
    return [
      `Hi ${S.brand}! I'd like to order this gift box:`,
      `Calendar: ${c.name}`,
      `Box: ${t.name}`,
      ex.length ? `Extras: ${ex.map(e => S.items[e.item].label).join(', ')}` : '',
      `Total on your site: ${U.inr(now)} (${U.pct}% launch offer)`,
      'Please help me with my dates and delivery.'
    ].filter(Boolean).join('\n');
  }

  /* ---- Update list, price, sprites ---- */
  function update(animate) {
    const items = U.boxItems(state.cal, state.tier, [...state.extras]);
    const list = $('boxList');
    const prev = new Set([...list.children].map(li => li.dataset.k));
    list.innerHTML = items.map(k => `<li data-k="${k}" class="${prev.size && !prev.has(k) ? 'new' : ''}">${U.icon(S.items[k].icon)}<span>${U.esc(U.itemLabel(k, state.cal))}</span></li>`).join('');
    const { mrp, now } = totals();
    $('boxMrp').textContent = U.inr(mrp);
    $('boxTotal').textContent = U.inr(now);
    $('boxSave').textContent = `You save ${U.inr(mrp - now)}`;
    $('boxCount').textContent = `${items.length} items in the box`;
    $('boxCta').href = U.waLink(message());
    if (started) syncSprites(items, animate && !U.reduce);
  }

  function slot(i, n, W) {
    const cols = 3, rows = Math.ceil(n / cols);
    const r = Math.floor(i / cols), c = i % cols;
    const inRow = Math.min(cols, n - r * cols);
    return { x: (c - (inRow - 1) / 2) * W * 0.27, z: (r - (rows - 1) / 2) * W * 0.22 };
  }

  function syncSprites(items, animate) {
    const W = box.offsetWidth;
    const now = performance.now();
    sprites.forEach((s, k) => {
      if (!items.includes(k)) {
        s.el.classList.add('out');
        setTimeout(() => s.el.remove(), 320);
        sprites.delete(k);
      }
    });
    let delay = 0;
    items.forEach((k, i) => {
      const p = slot(i, items.length, W);
      const size = Math.round(W * (k === 'calendar' ? 0.42 : 0.3));
      let s = sprites.get(k);
      if (!s) {
        const el = document.createElement('div');
        el.className = 'sprite';
        el.innerHTML = U.icon(S.items[k].icon);
        inside.appendChild(el);
        s = { el, x: p.x, z: p.z, y: animate ? -W * 1.7 : size * 0.5, vy: 0, start: now + delay, landed: !animate, bumped: false };
        if (animate) delay += 170;
        sprites.set(k, s);
      }
      s.tx = p.x; s.tz = p.z; s.rest = size * 0.5;
      s.el.style.width = s.el.style.height = size + 'px';
      s.el.style.left = -size / 2 + 'px';
      s.el.style.top = -size + 'px';
    });
    if (!running) render(performance.now());
  }

  /* ---- Render loop ---- */
  function render(now) {
    if (!dragging) {
      if (now > idleUntil && !U.reduce) angle += 0.16;
      else { angle += vel; vel *= 0.93; }
    }
    bump *= 0.82;
    box.style.transform = `translateY(${bump.toFixed(2)}px) rotateX(-22deg) rotateY(${angle.toFixed(2)}deg)`;
    sprites.forEach(s => {
      s.x += (s.tx - s.x) * 0.15;
      s.z += (s.tz - s.z) * 0.15;
      const waiting = !s.landed && now < s.start;
      if (!s.landed && !waiting) {
        s.vy += 1.15;
        s.y += s.vy;
        if (s.y >= s.rest && s.vy > 0) {
          s.y = s.rest;
          if (s.vy > 4) {
            s.vy *= -0.32;
            if (!s.bumped) { bump = 7; s.bumped = true; }
          } else { s.vy = 0; s.landed = true; }
        }
      } else if (s.landed) {
        s.y += (s.rest - s.y) * 0.2;
      }
      s.el.style.opacity = waiting ? '0' : '';
      s.el.style.transform = `translate3d(${s.x.toFixed(1)}px,${s.y.toFixed(1)}px,${s.z.toFixed(1)}px) rotateY(${(-angle).toFixed(2)}deg)`;
    });
  }
  function loop(now) {
    render(now);
    if (running) rafId = requestAnimationFrame(loop);
  }
  const boxIO = new IntersectionObserver(([en]) => {
    running = en.isIntersecting;
    if (running) {
      if (!started) {
        started = true;
        syncSprites(U.boxItems(state.cal, state.tier, [...state.extras]), !U.reduce);
      }
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }
  }, { threshold: 0.25 });
  boxIO.observe(stage);

  /* ---- Drag + keys to turn ---- */
  stage.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; vel = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('grabbing');
  });
  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    angle += dx * 0.5; vel = dx * 0.5; lastX = e.clientX;
    if (!running) render(performance.now());
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    idleUntil = performance.now() + 2500;
    stage.classList.remove('grabbing');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    angle += e.key === 'ArrowRight' ? 20 : -20;
    idleUntil = performance.now() + 2500;
    render(performance.now());
  });

  let resizeT = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { if (started) syncSprites(U.boxItems(state.cal, state.tier, [...state.extras]), false); }, 150);
  });

  window.Box = {
    setCalendar(id) { state.cal = id; syncInputs(); update(true); },
    message
  };
  syncInputs();
  update(false);
}
