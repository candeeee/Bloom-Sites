/* ==========================================================================
   BLOOM SITES — script único para todas las páginas (JavaScript sin librerías)
   Cada bloque verifica si su HTML existe en la página antes de ejecutarse.

   1.  Configuración y utilidades
   2.  Encabezado y menú mobile
   3.  Entrada de los heroes y apariciones al hacer scroll
   5.  Index: acordeón de servicios
   7.  Index: armador de mensaje de contacto
   8.  Demos: aviso (toast), botones y formularios de demostración
   9.  Demos: recorrido "qué podría tener tu web"
   10. Demos: nombre del negocio
   11. Demos: filtros, pestañas y selecciones
   12. Demo inmobiliaria: ficha y galería
   13. Demo médicos: solicitud de turno
   14. Demos: pedido con carrito (gastronomía y emprendimientos)
   15. Demo emprendimientos: tipos de emprendimiento
   ========================================================================== */
(() => {
  'use strict';

  /* 1. CONFIGURACIÓN Y UTILIDADES -------------------------------------- */
  const WA_NUMBER = '5491160192994';
  const DEFAULT_MSG = '¡Hola! Quiero información sobre una página web para mi negocio.';
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const money = (n) => `$ ${Math.round(n).toLocaleString('es-AR')}`;
  const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 28);
  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Todos los enlaces con data-wa abren WhatsApp (con mensaje propio si tienen data-wa-msg)
  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.waMsg || DEFAULT_MSG); });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* 2. ENCABEZADO Y MENÚ MOBILE ---------------------------------------- */
  const header = $('.site-header');
  const toggle = $('.nav-toggle');
  const nav = $('#nav');

  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    const desktop = window.matchMedia('(min-width: 960px)');
    const setMenu = (open) => {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      // En mobile, el menú cerrado no debe recibir foco
      nav.inert = !open && !desktop.matches;
      if (open) { const first = $('a', nav); if (first) first.focus({ preventScroll: true }); }
    };
    setMenu(false);
    toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('nav-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setMenu(false); toggle.focus(); }
    });
    desktop.addEventListener('change', () => setMenu(false));
  }

  /* 3. ENTRADAS Y APARICIONES ------------------------------------------ */
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('is-loaded')));

  const revealables = $$('[data-reveal], .steps');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach((el) => io.observe(el));
  }

  /* 5. INDEX: ACORDEÓN DE SERVICIOS ------------------------------------ */
  const triggers = $$('.svc-trigger');
  const setPanel = (btn, open) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.inert = !open;
  };
  triggers.forEach((btn) => {
    setPanel(btn, btn.getAttribute('aria-expanded') === 'true');
    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      triggers.forEach((b) => { if (b !== btn) setPanel(b, false); });
      setPanel(btn, willOpen);
    });
  });

  /* 7. INDEX: ARMADOR DE MENSAJE --------------------------------------- */
  const composer = $('#composer');
  if (composer) {
    const out = $('#composer-text');
    const send = $('#composer-send');
    const bizName = $('#composer-name');
    const joinList = (arr) => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`);

    const compose = () => {
      const rubro = $('input[name="rubro"]:checked', composer)?.value;
      const needsAll = $$('input[name="need"]:checked', composer).map((i) => i.value);
      const unsure = needsAll.includes('unsure');
      const needs = needsAll.filter((n) => n !== 'unsure');
      const name = bizName.value.trim();
      let msg;
      if (!rubro && !needsAll.length && !name) {
        msg = DEFAULT_MSG;
      } else {
        msg = '¡Hola!';
        if (rubro) msg += ` Tengo ${rubro}${name ? ` que se llama ${name}` : ''}.`;
        else if (name) msg += ` Mi negocio se llama ${name}.`;
        msg += needs.length ? ` Me gustaría una página web para ${joinList(needs)}.` : ' Quiero información sobre una página web.';
        if (unsure) msg += ' Todavía no sé bien qué necesito, ¿lo charlamos?';
      }
      out.textContent = msg;
      send.href = waLink(msg);
    };

    composer.addEventListener('submit', (e) => e.preventDefault());
    composer.addEventListener('change', (e) => {
      if (e.target.name === 'need') {
        const boxes = $$('input[name="need"]', composer);
        if (e.target.value === 'unsure' && e.target.checked) boxes.forEach((b) => { if (b.value !== 'unsure') b.checked = false; });
        else if (e.target.checked) boxes.forEach((b) => { if (b.value === 'unsure') b.checked = false; });
      }
      compose();
    });
    bizName.addEventListener('input', compose);

    // Si se llega desde una página de rubro (index.html?rubro=...#contacto), se preselecciona
    const fromRubro = new URLSearchParams(location.search).get('rubro');
    if (fromRubro) {
      const radio = $(`input[name="rubro"][data-key="${CSS.escape(fromRubro)}"]`, composer);
      if (radio) radio.checked = true;
    }
    compose();
  }

  /* 8. DEMOS: AVISO, BOTONES Y FORMULARIOS ----------------------------- */
  // Los botones de las demostraciones no contactan a nadie: explican qué harían en una web real.
  const toastEl = $('#toast');
  let toastTimer;
  const toast = (msg) => {
    if (!toastEl) return;
    $('p', toastEl).textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 6500);
  };
  if (toastEl) $('button', toastEl).addEventListener('click', () => toastEl.classList.remove('is-on'));

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-demo-msg]');
    if (!el) return;
    e.preventDefault();
    toast(el.dataset.demoMsg);
  });
  $$('form[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      toast(form.dataset.demoForm);
      form.reset();
    });
  });

  /* 9. DEMOS: RECORRIDO "QUÉ PODRÍA TENER TU WEB" ---------------------- */
  const demo = $('.dm');
  const feats = $$('.feat');
  if (demo && feats.length) {
    const caption = $('.feat-caption');
    const wide = window.matchMedia('(min-width: 1000px)');
    let pinned = null;

    const light = (key) => {
      demo.classList.toggle('is-focusing', Boolean(key));
      $$('[data-part]', demo).forEach((p) => p.classList.toggle('is-lit', p.dataset.part === key));
      feats.forEach((f) => {
        const on = f.dataset.key === key;
        f.classList.toggle('is-lit', on);
        f.setAttribute('aria-pressed', String(on && pinned === key));
      });
      if (caption) {
        const f = feats.find((x) => x.dataset.key === key);
        caption.innerHTML = f
          ? `<b>${escapeHTML($('.feat-name', f).textContent)}.</b> ${escapeHTML($('.feat-text', f).textContent)}`
          : 'Tocá cada punto para ver dónde aparece en la demostración.';
      }
    };

    const reveal = (key) => {
      const part = $(`[data-part="${key}"]`, demo);
      if (!part) return;
      const r = part.getBoundingClientRect();
      const visible = r.top > 120 && r.bottom < window.innerHeight - 40;
      if (!wide.matches || !visible) part.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    };

    feats.forEach((f) => {
      f.addEventListener('mouseenter', () => { if (wide.matches) light(f.dataset.key); });
      f.addEventListener('mouseleave', () => { if (wide.matches) light(pinned); });
      f.addEventListener('click', () => {
        pinned = pinned === f.dataset.key ? null : f.dataset.key;
        light(pinned);
        if (pinned) { reveal(pinned); f.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'auto' }); }
      });
    });
    light(null);
  }

  /* 10. DEMOS: NOMBRE DEL NEGOCIO -------------------------------------- */
  const nameInput = $('#biz-name');
  const applyName = () => {
    const v = nameInput ? nameInput.value.trim() : '';
    $$('[data-brand]').forEach((el) => { el.textContent = v || el.dataset.default; });
    $$('[data-url]').forEach((el) => { el.textContent = slug(v) || slug(el.dataset.default); });
    $$('[data-url-preview]').forEach((el) => { el.textContent = slug(v) || 'tunegocio'; });
  };
  if (nameInput) nameInput.addEventListener('input', applyName);

  /* 11. DEMOS: FILTROS, PESTAÑAS Y SELECCIONES ------------------------- */
  // Filtros: <div data-filters="#id-de-la-lista"> con botones data-f="clave:valor"
  const initFilters = (bar) => {
    const list = $(bar.dataset.filters);
    if (!list) return;
    bar._state = {};
    $$('[data-f]', bar).forEach((b) => {
      const [k, v] = b.dataset.f.split(':');
      if (b.getAttribute('aria-pressed') === 'true') bar._state[k] = v;
    });
    bar._apply = () => {
      let shown = 0;
      $$('[data-item]', list).forEach((item) => {
        const ok = Object.entries(bar._state).every(([k, v]) => v === 'todo' || (item.dataset[k] || '').split(' ').includes(v));
        item.hidden = !ok;
        if (ok) shown++;
      });
      const empty = $('[data-empty]', list.parentElement);
      if (empty) empty.hidden = shown > 0;
    };
    if (!bar._bound) {
      bar._bound = true;
      bar.addEventListener('click', (e) => {
        const b = e.target.closest('[data-f]');
        if (!b) return;
        const [k, v] = b.dataset.f.split(':');
        bar._state[k] = v;
        $$(`[data-f^="${k}:"]`, bar).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        bar._apply();
      });
    }
    bar._apply();
  };
  $$('[data-filters]').forEach(initFilters);

  // Pestañas accesibles: <div role="tablist"> con botones role="tab" aria-controls
  $$('[role="tablist"].dm-tabs').forEach((tl) => {
    const tabs = $$('[role="tab"]', tl);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
    tl.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
    });
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  });

  // Selección única: <div data-pick> con botones aria-pressed
  $$('[data-pick]').forEach((group) => {
    group.addEventListener('click', (e) => {
      const b = e.target.closest('button[aria-pressed]');
      if (!b || b.disabled) return;
      $$('button[aria-pressed]', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      group.dispatchEvent(new CustomEvent('pick', { detail: b }));
    });
  });

  /* 12. DEMO INMOBILIARIA: FICHA Y GALERÍA ----------------------------- */
  const ficha = $('#dm-ficha');
  if (ficha) {
    const cards = $$('[data-prop]');
    const main = $('[data-f-main]', ficha);
    const consult = $('[data-f-consult]', ficha);
    const fill = (btn) => {
      const d = btn.dataset;
      $$('[data-fv]', ficha).forEach((el) => { el.textContent = d[el.dataset.fv] || ''; });
      main.style.setProperty('--ph', d.tint);
      main.dataset.label = `foto principal: ${d.title.toLowerCase()}`;
      $$('.dm-thumb', ficha).forEach((t, i) => {
        t.setAttribute('aria-pressed', String(i === 0));
        t.style.setProperty('--ph', i === 0 ? d.tint : t.dataset.base);
      });
      consult.dataset.demoMsg = `En tu web, este botón abre WhatsApp con un mensaje listo: "Hola, quiero consultar por ${d.title} (${d.barrio})."`;
      cards.forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
    };
    cards.forEach((c) => c.addEventListener('click', () => {
      fill(c);
      if (!window.matchMedia('(min-width: 1000px)').matches) ficha.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }));
    $('.dm-thumbs', ficha).addEventListener('click', (e) => {
      const t = e.target.closest('.dm-thumb');
      if (!t) return;
      $$('.dm-thumb', ficha).forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
      main.style.setProperty('--ph', getComputedStyle(t).getPropertyValue('--ph'));
      main.dataset.label = t.getAttribute('aria-label').replace('Ver ', 'foto: ');
    });
    if (cards[0]) fill(cards[0]);
  }

  /* 13. DEMO MÉDICOS: SOLICITUD DE TURNO ------------------------------- */
  const turnoBtn = $('[data-turno]');
  if (turnoBtn) {
    const update = () => {
      const day = $('#dm-days button[aria-pressed="true"]');
      const slot = $('#dm-slots button[aria-pressed="true"]');
      const when = [day ? day.getAttribute('aria-label') : '', slot ? `a las ${slot.textContent.trim()}` : ''].filter(Boolean).join(' ');
      $('[data-turno-summary]').textContent = when ? `Elegiste el ${when}.` : 'Elegí un día y un horario.';
      turnoBtn.dataset.demoMsg = when
        ? `En tu web, esto enviaría la solicitud de turno para el ${when}, y vos la confirmás por WhatsApp.`
        : 'Primero elegí un día y un horario.';
    };
    $$('#dm-days, #dm-slots').forEach((g) => g.addEventListener('pick', update));
    update();
  }

  /* 14. DEMOS: PEDIDO CON CARRITO -------------------------------------- */
  const cartRoot = $('[data-cart]');
  let renderCart = () => {};
  if (cartRoot) {
    const cart = new Map(); // clave: nombre + variante
    const itemsEl = $('[data-cart-items]', cartRoot);
    const totalEl = $('[data-cart-total]', cartRoot);
    const waEl = $('[data-cart-wa]', cartRoot);
    const sendEl = $('[data-cart-send]', cartRoot);
    const intro = cartRoot.dataset.cartIntro || '¡Hola! Quiero hacer este pedido:';

    renderCart = () => {
      let total = 0; let count = 0;
      itemsEl.innerHTML = '';
      cart.forEach((it, key) => {
        total += it.price * it.qty; count += it.qty;
        const li = document.createElement('li');
        li.innerHTML = `<span>${escapeHTML(it.name)}${it.variant ? `<br><small class="dm-small">${escapeHTML(it.variant)}</small>` : ''}</span>
          <span class="dm-qty"><button type="button" aria-label="Quitar uno de ${escapeHTML(it.name)}" data-q="-1">−</button><span>${it.qty}</span><button type="button" aria-label="Sumar uno de ${escapeHTML(it.name)}" data-q="1">+</button></span>
          <b>${money(it.price * it.qty)}</b>`;
        li.dataset.key = key;
        itemsEl.appendChild(li);
      });
      if (!cart.size) itemsEl.innerHTML = `<li class="dm-empty">${escapeHTML(cartRoot.dataset.cartEmpty || 'Todavía no agregaste nada.')}</li>`;
      totalEl.textContent = money(total);
      $$('[data-cart-count]').forEach((el) => { el.textContent = count; });
      const lines = [...cart.values()].map((it) => `${it.qty} × ${it.name}${it.variant ? `, ${it.variant}` : ''}`);
      waEl.textContent = cart.size ? `${intro}\n${lines.join('\n')}\nTotal: ${money(total)}` : 'Acá vas a ver el mensaje que te llegaría.';
      sendEl.dataset.demoMsg = cart.size
        ? 'En tu web, este botón abre WhatsApp con el pedido ya escrito. Vos respondés y coordinás el pago y la entrega.'
        : 'Agregá algún producto para ver cómo se arma el pedido.';
    };

    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) {
        const key = `${add.dataset.name}|${add.dataset.variant || ''}`;
        const prev = cart.get(key);
        cart.set(key, { name: add.dataset.name, variant: add.dataset.variant || '', price: Number(add.dataset.price), qty: prev ? prev.qty + 1 : 1 });
        renderCart();
        const old = add.textContent;
        add.textContent = 'Agregado';
        setTimeout(() => { add.textContent = old; }, 1100);
        return;
      }
      const q = e.target.closest('[data-q]');
      if (q && itemsEl.contains(q)) {
        const key = q.closest('li').dataset.key;
        const it = cart.get(key);
        it.qty += Number(q.dataset.q);
        if (it.qty <= 0) cart.delete(key);
        renderCart();
      }
    });
    document.addEventListener('cart:clear', () => { cart.clear(); renderCart(); });
    renderCart();
  }

  // Muestras de color: cambian la foto del producto y la variante que se agrega
  document.addEventListener('click', (e) => {
    const sw = e.target.closest('.dm-swatch');
    if (!sw) return;
    const card = sw.closest('.dm-card');
    $$('.dm-swatch', card).forEach((x) => x.setAttribute('aria-pressed', String(x === sw)));
    $('.ph', card).style.setProperty('--ph', sw.dataset.tint);
    const add = $('[data-add]', card);
    if (add) add.dataset.variant = sw.dataset.name;
  });

  /* 15. DEMO EMPRENDIMIENTOS: TIPOS DE EMPRENDIMIENTO ------------------ */
  const VARIANTS = {
    blanqueria: {
      brand: 'Casa Arena', tint: '#EFE3D6',
      announce: 'Esta semana: 15% off en juegos de sábanas de percal',
      title: 'Algodón que se pone mejor con cada lavado.',
      lead: 'Sábanas, toallas y textiles para la casa, elegidos uno por uno.',
      heroLabel: 'foto: cama tendida con luz de tarde',
      cats: [['sabanas', 'Sábanas'], ['toallas', 'Toallas'], ['deco', 'Deco']],
      story: 'Empezamos vendiendo por Instagram desde casa. Hoy elegimos cada tela pensando en cómo se va a sentir después de muchos lavados.',
      products: [
        ['Juego percal 2 plazas', 58000, 'sabanas', [['Arena', '#E6DCCB'], ['Salvia', '#D9DECB'], ['Blanco', '#F1EFEA']]],
        ['Juego lino lavado', 96000, 'sabanas', [['Crudo', '#E9E1D2'], ['Oliva', '#C9CCB0']]],
        ['Toallón algodón peinado', 21500, 'toallas', [['Piedra', '#DCD6CB'], ['Rosa seco', '#EAD9CF']]],
        ['Toalla de mano', 9800, 'toallas', null],
        ['Funda de almohadón lino', 12900, 'deco', [['Crudo', '#E9E1D2'], ['Terracota suave', '#E2CDBE']]],
        ['Manta de algodón tejida', 44000, 'deco', null]
      ]
    },
    indumentaria: {
      brand: 'Lienzo', tint: '#E4E6D8',
      announce: 'Nueva colección de otoño. Envíos a todo el país.',
      title: 'Básicos de lino para todo el año.',
      lead: 'Prendas simples, cómodas y hechas en tandas chicas.',
      heroLabel: 'foto: prenda en modelo, luz natural',
      cats: [['camisas', 'Camisas'], ['pantalones', 'Pantalones'], ['accesorios', 'Accesorios']],
      story: 'Diseñamos pocas prendas por temporada y las producimos en talleres chicos. Queremos que te duren años.',
      products: [
        ['Camisa Tilo', 42000, 'camisas', [['Crudo', '#E9E1D2'], ['Oliva', '#C9CCB0'], ['Negro lavado', '#8E8C86']]],
        ['Camisa Ceibo manga corta', 38500, 'camisas', [['Blanco', '#F1EFEA'], ['Arena', '#E6DCCB']]],
        ['Pantalón Pampa', 48500, 'pantalones', [['Arena', '#E6DCCB'], ['Oliva', '#C9CCB0']]],
        ['Short de lino', 29900, 'pantalones', null],
        ['Bolso de lienzo', 24500, 'accesorios', null],
        ['Pañuelo estampado', 14000, 'accesorios', [['Rosa seco', '#EAD9CF'], ['Salvia', '#D9DECB']]]
      ]
    },
    cosmetica: {
      brand: 'Brote', tint: '#E9E3EC',
      announce: 'Comprando dos productos, el tercero va con 20% off',
      title: 'Cosmética natural, hecha en pequeñas tandas.',
      lead: 'Cremas, aceites y jabones con ingredientes que podés leer.',
      heroLabel: 'foto: frascos sobre mármol claro',
      cats: [['rostro', 'Rostro'], ['cuerpo', 'Cuerpo'], ['kits', 'Kits']],
      story: 'Hacemos cada producto a mano y en tandas chicas, así siempre está fresco. En cada ficha contamos qué lleva y para qué sirve.',
      products: [
        ['Crema facial de caléndula', 18500, 'rostro', null],
        ['Sérum de rosa mosqueta', 22000, 'rostro', null],
        ['Aceite corporal', 16900, 'cuerpo', [['Lavanda', '#E2DDEA'], ['Naranja', '#F0E1CF']]],
        ['Jabón de avena', 6500, 'cuerpo', [['Avena', '#EDE5D6'], ['Carbón', '#CFCCC6']]],
        ['Kit rutina diaria', 49000, 'kits', null],
        ['Kit de regalo', 36000, 'kits', null]
      ]
    },
    velas: {
      brand: 'Cera Norte', tint: '#EFE7D8',
      announce: 'Talleres de velas los sábados. Cupos limitados.',
      title: 'Velas de soja y objetos para la casa.',
      lead: 'Aromas suaves, frascos reutilizables y piezas hechas a mano.',
      heroLabel: 'foto: vela encendida sobre mesa de madera',
      cats: [['velas', 'Velas'], ['difusores', 'Difusores'], ['objetos', 'Objetos']],
      story: 'Todo empezó con una vela para regalar. Hoy cada pieza se hace a mano, con cera de soja y frascos que podés volver a usar.',
      products: [
        ['Vela de soja 200 g', 9800, 'velas', [['Higo', '#E7DCCD'], ['Lavanda', '#E2DDEA'], ['Cítricos', '#F0E6CC']]],
        ['Vela en frasco ámbar', 13500, 'velas', null],
        ['Difusor 250 ml', 16900, 'difusores', [['Higo', '#E7DCCD'], ['Té blanco', '#EDEBE3']]],
        ['Repuesto de difusor', 9900, 'difusores', null],
        ['Bandeja de cerámica', 18000, 'objetos', null],
        ['Portavelas de barro', 11500, 'objetos', null]
      ]
    }
  };

  const productsEl = $('#dm-products');
  if (productsEl) {
    const catsEl = $('#dm-cats');
    const dmRoot = productsEl.closest('.dm');

    const renderVariant = (key) => {
      const v = VARIANTS[key];
      dmRoot.style.setProperty('--tint', v.tint);
      $$('[data-brand]').forEach((el) => { el.dataset.default = v.brand; });
      $$('[data-url]').forEach((el) => { el.dataset.default = v.brand; });
      $('[data-v="announce"]').textContent = v.announce;
      $('[data-v="title"]').textContent = v.title;
      $('[data-v="lead"]').textContent = v.lead;
      $('[data-v="story"]').textContent = v.story;
      $('[data-v="hero"]').dataset.label = v.heroLabel;

      catsEl.innerHTML = `<button type="button" class="dm-chip" data-f="cat:todo" aria-pressed="true">Todo</button>` +
        v.cats.map(([id, label]) => `<button type="button" class="dm-chip" data-f="cat:${id}" aria-pressed="false">${label}</button>`).join('');

      productsEl.innerHTML = v.products.map(([name, price, cat, colors], i) => {
        const tint = colors ? colors[0][1] : ['#E8E1D4', '#E2E4D6', '#EBDFD6'][i % 3];
        const sw = colors ? `<div class="dm-swatches" aria-label="Colores">${colors.map(([cn, c], j) =>
          `<button type="button" class="dm-swatch" style="--c:${c}" data-tint="${c}" data-name="${cn}" aria-label="${cn}" aria-pressed="${j === 0}"></button>`).join('')}</div>` : '';
        return `<article class="dm-card" data-item data-cat="${cat}" ${i === 0 ? 'data-part="producto"' : ''}>
          <div class="ph r-45" style="--ph:${tint}" role="img" aria-label="Foto de ${name}" data-label="foto de producto"></div>
          <h4 class="dm-card-title">${name}</h4>
          <span class="dm-price">${money(price)}</span>
          ${sw}
          <button type="button" class="dm-btn is-ghost is-small" data-add data-name="${name}" data-price="${price}" data-variant="${colors ? colors[0][0] : ''}">Agregar al pedido</button>
        </article>`;
      }).join('');

      initFilters(catsEl);
      applyName();
      document.dispatchEvent(new CustomEvent('cart:clear'));
    };

    const picker = $('#variant-picker');
    if (picker) picker.addEventListener('pick', (e) => renderVariant(e.detail.dataset.variant));
    renderVariant('blanqueria');
  }

  applyName();
})();
