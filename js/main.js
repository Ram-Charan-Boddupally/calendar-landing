{
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = Math.round(S.discount * 100);
  const off = p => Math.round(p * (1 - S.discount));
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const calById = id => S.calendars.find(c => c.id === id);
  const tierById = id => S.tiers.find(t => t.id === id);
  const waLink = msg => `https://wa.me/${S.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  const isDesktop = () => matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
  const MONTHS = S.months;
  const Y = S.calendarYear;

  function boxItems(calId, tierId, extras = []) {
    const c = calById(calId);
    const list = ['calendar', 'bookmarks', 'datestickers'];
    if (c.stickerItem) list.push(c.stickerItem);
    list.push('card');
    if (tierId === 'thoughtful' || tierId === 'grand') list.push('chocolates', c.themedItem);
    if (tierId === 'grand') list.push('perfume', 'candle', 'keepsake');
    extras.forEach(id => {
      const e = S.extras.find(x => x.id === id);
      if (e && !list.includes(e.item)) list.push(e.item);
    });
    return list;
  }
  const itemLabel = (key, calId) => key === 'calendar' ? calById(calId).name : S.items[key].label;

  window.U = { S, off, inr, esc, icon, calById, tierById, waLink, boxItems, itemLabel, pct, reduce, isDesktop };

  /* ---------- WhatsApp ---------- */
  const WA = {
    general: `Hi ${S.brand}! I'd like to know more about your calendars and gift boxes.`,
    hero: `Hi ${S.brand}! I want to gift a calendar. Can you share the catalog and prices?`,
    corporate: `Hi ${S.brand}! I'm looking for calendars for my team or clients. Can we talk about a bulk order?`
  };
  let enquiryMsg = WA.general;
  const calMsg = id => {
    const c = calById(id);
    return `Hi ${S.brand}! I'd like to order the ${c.name} (${inr(off(c.mrp))} with the ${pct}% launch offer). Can you help me with my dates and the gift box?`;
  };
  function resolveMsg(el) {
    const k = el.dataset.wa;
    if (k === 'cal') return calMsg(el.dataset.cal);
    if (k === 'box') return window.Box ? window.Box.message() : WA.hero;
    if (k === 'enquiry') return enquiryMsg;
    return WA[k] || WA.general;
  }

  const waDlg = $('#waDialog');
  const calDlg = $('#calDialog');
  function showWa(msg) {
    $('#waMsg').textContent = msg;
    $('#waOpen').href = waLink(msg);
    if (calDlg.open) calDlg.close();
    waDlg.showModal();
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-wa]');
    if (!a) return;
    const msg = resolveMsg(a);
    a.href = waLink(msg);
    a.target = '_blank';
    a.rel = 'noopener';
    if (isDesktop()) { e.preventDefault(); showWa(msg); }
  });
  $$('[data-wa]').forEach(a => { a.href = waLink(resolveMsg(a)); a.target = '_blank'; a.rel = 'noopener'; });

  $('#waCopy').addEventListener('click', async () => {
    const b = $('#waCopy');
    try { await navigator.clipboard.writeText($('#waMsg').textContent); b.textContent = 'Copied'; }
    catch (err) { b.textContent = 'Select the text above to copy'; }
    setTimeout(() => { b.textContent = 'Copy message'; }, 2200);
  });
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

  /* ---------- Brand + shared text ---------- */
  $$('[data-brand]').forEach(e => { e.textContent = S.brand; });
  document.title = `${S.brand} | ${S.tagline}`;
  $$('[data-cutoff]').forEach(e => { e.textContent = S.cutoffLabel; });
  $$('[data-pct]').forEach(e => { e.textContent = pct + '%'; });
  $$('[data-ig]').forEach(e => { e.textContent = S.instagram; });
  $$('[data-wa-num]').forEach(e => { e.textContent = S.whatsappDisplay; e.href = waLink(WA.general); e.target = '_blank'; e.rel = 'noopener'; });
  $$('[data-qr]').forEach(img => { img.src = S.qrImage; });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Nav ---------- */
  const nav = $('.nav'), menuBtn = $('#menuBtn'), links = $('#navLinks'), waFloat = $('#waFloat');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', e => {
    if (e.target.closest('a')) { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 8);
    waFloat.classList.toggle('show', scrollY > innerHeight * 0.8);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Calendar month renderer ---------- */
  function textOn(hex) {
    const n = parseInt(hex.slice(1), 16);
    const L = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
    return L > 0.62 ? '#2B1028' : '#FFFFFF';
  }
  const ord = d => d + (d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th');
  const MARK_ICON = { heart: 'i-heart', star: 'i-sticker', rest: 'i-rest' };
  function renderMonth(page, y, m, marks) {
    const [name, season, color] = MONTHS[m];
    page.style.setProperty('--mc', color);
    page.style.setProperty('--mt', textOn(color));
    $('.cal-month', page).textContent = name;
    $('.cal-season', page).textContent = `${season} ${y}`;
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const byDay = new Map(marks.map(k => [k.d, k]));
    let h = 'SMTWTFS'.split('').map(d => `<b aria-hidden="true">${d}</b>`).join('') + '<i></i>'.repeat(first);
    for (let d = 1; d <= days; d++) {
      const k = byDay.get(d);
      h += k ? `<span class="mk" title="${esc(k.l)}">${d}${icon(MARK_ICON[k.t] || 'i-sticker', 'mk-ico')}</span>` : `<span>${d}</span>`;
    }
    $('.cal-grid', page).innerHTML = h;
    $('.cal-note', page).textContent = marks.length
      ? marks.map(k => `${ord(k.d)}: ${k.l}`).join('\n')
      : 'Your dates show up here';
  }
  function flipTo(page, draw) {
    if (reduce) { draw(); return; }
    page.classList.remove('flip');
    void page.offsetWidth;
    page.classList.add('flip');
    setTimeout(draw, 330);
    setTimeout(() => page.classList.remove('flip'), 720);
  }

  /* ---------- Hero calendar ---------- */
  const heroCal = $('#heroCal'), heroPage = $('#heroPage');
  let hm = 0, heroVisible = true, heroTimer = 0;
  renderMonth(heroPage, Y, hm, S.heroMarks[hm] || []);
  const nextHero = () => { hm = (hm + 1) % 12; flipTo(heroPage, () => renderMonth(heroPage, Y, hm, S.heroMarks[hm] || [])); };
  const restartHero = () => {
    clearInterval(heroTimer);
    if (!reduce) heroTimer = setInterval(() => { if (heroVisible && !document.hidden) nextHero(); }, 2800);
  };
  heroCal.addEventListener('click', () => { nextHero(); restartHero(); });
  heroCal.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextHero(); restartHero(); } });
  const heroIO = new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; });
  heroIO.observe(heroCal);
  setTimeout(restartHero, 1600);

  /* ---------- Catalog ---------- */
  const SEASON_STRIP = MONTHS.map(m => `<i style="background:${m[2]}"></i>`).join('');
  const VIS = {
    planner: `<div class="v-sheet v-planner"><b>Monday, 12 April</b><ul><li class="done">Submit report</li><li class="done">Gym, 30 min</li><li>Call Dadi</li><li class="rest">take a rest</li></ul></div>`,
    unscroll: `<div class="v-sheet v-unscroll"><b>Day 47, Thursday</b><div class="v-grid">${[1, '', 3, 4, 3, 4, '', 2, '', 1, 2, '', 2, '', 4, 1].map((n, i) => `<i class="${i === 6 ? 'hl' : ''}">${n}</i>`).join('')}</div><span class="v-q">Fill 1 to 4 so no row or column repeats.</span></div>`,
    lovable: `<div class="v-sheet v-lovable"><b>February</b><div class="v-mini">${Array.from({ length: 28 }, (_, i) => `<i class="${i === 13 || i === 22 ? 'h' : ''}"></i>`).join('')}</div><span class="v-hand">Tell them one thing you love about them today</span></div>`,
    photo: `<div class="v-sheet v-photo"><div class="v-pic">your photo</div><div class="v-months">${SEASON_STRIP}</div></div>`
  };
  $('#calCards').innerHTML = S.calendars.map(c => `
    <article class="cal-card" style="--c:${c.color}">
      <button class="card-visual" type="button" data-open="${c.id}" aria-label="See details of the ${esc(c.name)}">${VIS[c.id] || ''}</button>
      <div class="card-body">
        <p class="card-tag">${esc(c.tag)}</p>
        <h3>${esc(c.name)}</h3>
        <p class="promise">${esc(c.promise)}</p>
        <div class="price"><strong>${inr(off(c.mrp))}</strong><s>${inr(c.mrp)}</s><span class="save">${pct}% off</span></div>
        <div class="card-actions">
          <button class="btn btn-small btn-outline" type="button" data-open="${c.id}">See details</button>
          <a class="btn btn-small btn-wa" data-wa="cal" data-cal="${c.id}" href="${waLink(calMsg(c.id))}" target="_blank" rel="noopener">Order</a>
        </div>
      </div>
    </article>`).join('');

  const cards = $('#calCards');
  const scrollCards = dir => {
    const card = $('.cal-card', cards);
    cards.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' });
  };
  $('#calPrev').addEventListener('click', () => scrollCards(-1));
  $('#calNext').addEventListener('click', () => scrollCards(1));
  cards.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollCards(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollCards(-1); }
  });

  function openCal(id) {
    const c = calById(id);
    const inBox = boxItems(id, 'essential');
    $('#calDlgBody').innerHTML = `
      <div class="dlg-grid" style="--c:${c.color}">
        <div class="dlg-visual">${VIS[id] || ''}</div>
        <div class="dlg-body">
          <p class="card-tag">${esc(c.tag)}</p>
          <h2 id="dlgTitle">${esc(c.name)}</h2>
          <p class="sub">${esc(c.promise)}</p>
          <h3>What it does for you</h3>
          <ul class="ticks">${c.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
          <h3>Made for</h3>
          <p>${esc(c.forWho)}</p>
          <h3>Comes in a free gift box with</h3>
          <ul class="inbox">${inBox.map(k => `<li>${icon(S.items[k].icon)}${esc(k === 'calendar' ? 'The calendar' : S.items[k].label)}</li>`).join('')}</ul>
          <div class="price"><strong>${inr(off(c.mrp))}</strong><s>${inr(c.mrp)}</s><span class="save">${pct}% off</span></div>
          <div class="dlg-actions">
            <a class="btn btn-wa" data-wa="cal" data-cal="${id}" href="${waLink(calMsg(id))}" target="_blank" rel="noopener">${icon('i-wa')}Order on WhatsApp</a>
            <button class="btn btn-outline" type="button" data-build="${id}">Build a bigger box</button>
          </div>
          <button class="btn-text" type="button" data-enquire="${id}">Or send an enquiry first</button>
        </div>
      </div>`;
    calDlg.showModal();
  }
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { openCal(o.dataset.open); return; }
    const b = e.target.closest('[data-build]');
    if (b) {
      calDlg.close();
      if (window.Box) window.Box.setCalendar(b.dataset.build);
      $('#box').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    const q = e.target.closest('[data-enquire]');
    if (q) {
      calDlg.close();
      $('#fCal').value = q.dataset.enquire;
      $('#enquire').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => $('#fName').focus({ preventScroll: true }), 600);
    }
  });

  /* ---------- Personalise ---------- */
  const PH = ['Our anniversary', 'A birthday', 'The day we met', 'First day at work', 'A trip to plan'];
  const TYPES = ['heart', 'star', 'heart', 'star', 'rest'];
  $('#dateList').innerHTML = PH.map((p, i) => `
    <li class="date-row">
      <label class="sr" for="dl${i}">Name of date ${i + 1}</label>
      <input id="dl${i}" type="text" maxlength="24" placeholder="${esc(p)}" value="${esc(S.sampleDates[i]?.l || '')}">
      <label class="sr" for="dd${i}">Date ${i + 1}</label>
      <input id="dd${i}" type="date" min="${Y}-01-01" max="${Y}-12-31" value="${esc(S.sampleDates[i]?.d || '')}">
    </li>`).join('');
  $('#monthChips').innerHTML = MONTHS.map((m, i) => `<button type="button" data-m="${i}" style="--mc:${m[2]};--mt:${textOn(m[2])}" aria-label="${m[0]}">${m[0].slice(0, 3)}</button>`).join('');

  const previewPage = $('#previewPage');
  const parseD = v => { const [yy, mm, dd] = v.split('-').map(Number); return { y: yy, m: mm - 1, d: dd }; };
  const readDates = () => PH.map((_, i) => ({ l: $('#dl' + i).value.trim() || 'Special day', v: $('#dd' + i).value, t: TYPES[i] })).filter(x => x.v);
  let pm = S.sampleDates[0] ? parseD(S.sampleDates[0].d).m : 0;

  function renderPreview(animate) {
    const all = readDates();
    const marks = all.map(x => ({ ...parseD(x.v), l: x.l, t: x.t })).filter(x => x.m === pm);
    const draw = () => renderMonth(previewPage, Y, pm, marks);
    animate ? flipTo(previewPage, draw) : draw();
    $$('#monthChips button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === pm)));
    $('#dateCount').textContent = `${all.length} of 5 dates added`;
    $('#markLegend').innerHTML = all.length
      ? all.map(x => { const p = parseD(x.v); return `<li style="--mc:${MONTHS[p.m][2]}"><button type="button" data-m="${p.m}">${p.d} ${MONTHS[p.m][0].slice(0, 3)}</button>${esc(x.l)}</li>`; }).join('')
      : '<li class="empty">Add a date to see it on the calendar.</li>';
  }
  renderPreview(false);
  $('#dateList').addEventListener('input', e => {
    let jump = false;
    if (e.target.type === 'date' && e.target.value) {
      const m = parseD(e.target.value).m;
      jump = m !== pm;
      pm = m;
    }
    renderPreview(jump);
  });
  const pickMonth = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const m = Number(b.dataset.m);
    if (m !== pm) { pm = m; renderPreview(true); }
  };
  $('#monthChips').addEventListener('click', pickMonth);
  $('#markLegend').addEventListener('click', pickMonth);

  /* ---------- WhatsApp chat demo ---------- */
  const chat = $('#chat');
  const lov = calById('lovable') || S.calendars[0];
  const th = tierById('thoughtful') || S.tiers[0];
  const chatTotal = off(lov.mrp) + off(th.mrp);
  const ATT = {
    catalog: `<div class="att">${S.calendars.map(c => `<i style="background:${c.color}">${esc(c.short)}</i>`).join('')}</div>`,
    preview: `<div class="att prev"><i>February ${Y}<br>14th: Our anniversary</i></div>`
  };
  const CHAT = [
    { me: 1, t: `Hi! I want the ${lov.name} for our anniversary.` },
    { t: `Lovely choice! Here's our catalog. Would you like a gift box with it?`, att: 'catalog' },
    { me: 1, t: `${th.name} box please. Dates: 14 Feb, 23 Feb and 7 July.` },
    { t: `Noted. That's ${inr(chatTotal)} after ${pct}% off. Please share the delivery address, and you can pay by UPI or bank transfer.` },
    { me: 1, t: 'Paid, and address sent!' },
    { t: `Here's your preview. Your dates are marked in their season colours.`, att: 'preview' },
    { me: 1, t: 'Perfect. Please print it!' },
    { t: 'Packed by hand and shipped. Your tracking link is on its way.' }
  ];
  const msgHTML = (m, i) => `<div class="msg${m.me ? ' me' : ''}">${m.att ? ATT[m.att] : ''}<p>${esc(m.t)}</p><time>10:${String(12 + i * 3).padStart(2, '0')}${m.me ? ' ✓✓' : ''}</time></div>`;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let chatRunning = false;
  async function playChat() {
    if (chatRunning) return;
    chatRunning = true;
    $('#chatReplay').hidden = true;
    if (reduce) { chat.innerHTML = CHAT.slice(-5).map(msgHTML).join(''); chatRunning = false; return; }
    chat.innerHTML = '';
    for (let i = 0; i < CHAT.length; i++) {
      const m = CHAT[i];
      if (!m.me) {
        chat.insertAdjacentHTML('beforeend', '<div class="typing"><span></span><span></span><span></span></div>');
        await sleep(900);
        chat.lastElementChild.remove();
      }
      chat.insertAdjacentHTML('beforeend', msgHTML(m, i));
      while (chat.children.length > 6) chat.firstElementChild.remove();
      await sleep(m.me ? 1100 : 1400);
    }
    chatRunning = false;
    $('#chatReplay').hidden = false;
  }
  $('#chatReplay').addEventListener('click', playChat);
  const chatIO = new IntersectionObserver(([en]) => { if (en.isIntersecting) { chatIO.disconnect(); playChat(); } }, { threshold: 0.4 });
  chatIO.observe(chat);

  /* ---------- Reviews ---------- */
  const RATIOS = ['4 / 3', '1 / 1', '5 / 4', '3 / 2', '1 / 1', '4 / 3'];
  $('#proofWall').innerHTML = S.reviews.map((r, i) => `
    <article class="review">
      <div class="photo-slot" style="--pc:${esc(r.tint || '#eee')};--ar:${RATIOS[i % RATIOS.length]}">
        ${r.photo ? `<img src="${esc(r.photo)}" alt="${esc(r.alt || 'Customer photo of their gift')}" loading="lazy">` : `${icon(r.icon || 'i-ribbon', 'ph-ico')}<span>customer photo</span>`}
      </div>
      <div class="stars" aria-label="${r.rating || 5} out of 5">${icon('i-star').repeat(r.rating || 5)}</div>
      <blockquote>${esc(r.text)}</blockquote>
      <footer><b>${esc(r.name)}</b><span>${esc(r.product)}</span></footer>
    </article>`).join('');
  $('#sampleNote').hidden = !S.reviews.some(r => r.sample);

  /* ---------- Countdown ---------- */
  const end = new Date(S.orderCutoff).getTime();
  const pad = n => String(n).padStart(2, '0');
  let cdTimer = 0;
  function tick() {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    if (!s) {
      $('#countdown').hidden = true;
      $('#offerNote').textContent = 'Prices on this page already include the discount. Calendars can start in any month.';
      clearInterval(cdTimer);
      return;
    }
    $('#cdD').textContent = pad(Math.floor(s / 86400)); s %= 86400;
    $('#cdH').textContent = pad(Math.floor(s / 3600)); s %= 3600;
    $('#cdM').textContent = pad(Math.floor(s / 60));
    $('#cdS').textContent = pad(s % 60);
  }
  tick();
  cdTimer = setInterval(tick, 1000);

  /* ---------- Enquiry form ---------- */
  const form = $('#enqForm');
  $('#fCal').innerHTML = S.calendars.map(c => `<option value="${c.id}">${esc(c.name)} (${inr(off(c.mrp))})</option>`).join('') + '<option value="">Not sure yet, help me choose</option>';
  $('#fTier').innerHTML = S.tiers.map(t => `<option value="${t.id}">${esc(t.name)}${t.mrp ? ` (+${inr(off(t.mrp))})` : ' (free)'}</option>`).join('') + '<option value="">Decide later</option>';
  $('#fTier').value = 'thoughtful';
  const OCC = ['Birthday', 'Anniversary', 'New Year', 'Festival', 'Just because', 'For myself', 'Corporate'];
  $('#occasions').innerHTML = OCC.map((o, i) => `<span class="chip"><input type="radio" name="occasion" id="oc${i}" value="${o}"><label for="oc${i}">${o}</label></span>`).join('');

  const fieldOf = name => form.querySelector(`[name="${name}"]`).closest('.field');
  form.addEventListener('input', e => {
    const f = e.target.closest('.field');
    if (f && f.classList.contains('invalid')) { f.classList.remove('invalid'); $('.err', f).textContent = ''; }
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const phone = String(data.phone || '').replace(/\D/g, '').replace(/^0+/, '');
    const errors = {
      name: String(data.name || '').trim() ? '' : 'Enter your name so we know who to reply to.',
      phone: /^(91)?[6-9]\d{9}$/.test(phone) ? '' : 'Enter a 10-digit WhatsApp number.'
    };
    let first = null;
    Object.entries(errors).forEach(([k, msg]) => {
      const f = fieldOf(k);
      f.classList.toggle('invalid', !!msg);
      $('.err', f).textContent = msg;
      if (msg && !first) first = form.querySelector(`[name="${k}"]`);
    });
    if (first) { first.focus(); return; }

    const cal = calById(data.calendar), tier = tierById(data.tier);
    enquiryMsg = [
      `Hi ${S.brand}! I just sent an enquiry from your website.`,
      `Name: ${data.name.trim()}`,
      `Calendar: ${cal ? cal.name : 'Not sure yet'}`,
      `Gift box: ${tier ? tier.name : 'Decide later'}`,
      data.occasion ? `Occasion: ${data.occasion}` : '',
      data.needby ? `Needed by: ${data.needby}` : '',
      data.city ? `City: ${data.city}` : '',
      data.notes ? `Notes: ${data.notes}` : ''
    ].filter(Boolean).join('\n');

    const btn = $('#enqSubmit');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    if (S.sheetWebhook) {
      try {
        await fetch(S.sheetWebhook, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ...data, phone, calendar: cal ? cal.name : 'Not sure', tier: tier ? tier.name : 'Later', source: 'website', at: new Date().toISOString() })
        });
      } catch (err) { /* the WhatsApp step below still reaches us */ }
    }
    btn.disabled = false;
    btn.textContent = 'Send enquiry';
    form.hidden = true;
    const done = $('#enqDone');
    done.hidden = false;
    $('#doneName').textContent = data.name.trim().split(' ')[0];
    $('#doneSummary').textContent = enquiryMsg;
    $('#doneWa').href = waLink(enquiryMsg);
    done.focus();
  });
  $('#enqAgain').addEventListener('click', () => {
    form.reset();
    $('#fTier').value = 'thoughtful';
    form.hidden = false;
    $('#enqDone').hidden = true;
    $('#fName').focus();
  });
}
