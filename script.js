/* ==============================================================
   BLOOM SITES — comportamiento de la página
   Sin librerías. Todo se apoya en IntersectionObserver,
   requestAnimationFrame y transiciones CSS.
   ============================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     1. WhatsApp — un solo lugar para el número y el mensaje
     ------------------------------------------------------------ */
  var WA_NUMERO  = '541160192994';
  var WA_MENSAJE = '¡Hola! Quiero información sobre una página web para mi negocio.';
  var WA_LINK    = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(WA_MENSAJE);

  $$('[data-wa]').forEach(function (a) {
    a.href = WA_LINK;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ------------------------------------------------------------
     2. Año del footer
     ------------------------------------------------------------ */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     3. Revelado al hacer scroll
     ------------------------------------------------------------ */
  var revealables = $$('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------
     4. Contadores animados (arrancan al entrar en pantalla)
     ------------------------------------------------------------ */
  function contar(el) {
    var destino = parseInt(el.dataset.to, 10) || 0;
    if (reduced || destino === 0) { el.textContent = destino; return; }
    var dur = 1500, ini = performance.now();
    (function paso(t) {
      var p = Math.min((t - ini) / dur, 1);
      var suave = 1 - Math.pow(1 - p, 3);           // desaceleración natural
      el.textContent = Math.round(destino * suave);
      if (p < 1) requestAnimationFrame(paso);
    })(ini);
  }
  var nums = $$('.num');
  if ('IntersectionObserver' in window) {
    var ioNum = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { contar(e.target); ioNum.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { ioNum.observe(n); });
  } else {
    nums.forEach(contar);
  }

  /* ------------------------------------------------------------
     5. Preguntas frecuentes — acordeón accesible
     ------------------------------------------------------------ */
  $$('.fitem').forEach(function (item) {
    var btn  = $('.fitem__q', item);
    var pane = $('.fitem__a', item);

    btn.addEventListener('click', function () {
      var abierto = item.classList.contains('open');

      // se cierra el resto para mantener la lectura ordenada
      $$('.fitem.open').forEach(function (otro) {
        otro.classList.remove('open');
        $('.fitem__q', otro).setAttribute('aria-expanded', 'false');
        $('.fitem__a', otro).style.maxHeight = '';
      });

      if (!abierto) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        pane.style.maxHeight = pane.scrollHeight + 'px';
      }
    });
  });
  // si cambia el ancho, se recalcula la altura del panel abierto
  window.addEventListener('resize', function () {
    var abierto = $('.fitem.open .fitem__a');
    if (abierto) abierto.style.maxHeight = abierto.scrollHeight + 'px';
  });

  /* ------------------------------------------------------------
     6. Menú de celular
     ------------------------------------------------------------ */
  var burger = $('#burger'), menu = $('#menu');
  function cerrarMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', function () {
    var abierto = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(abierto));
    burger.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = abierto ? 'hidden' : '';
  });
  $$('#menu a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { cerrarMenu(); burger.focus(); }
  });

  /* ------------------------------------------------------------
     7. Scroll: header, botones flotantes y tallo que crece
     ------------------------------------------------------------ */
  var nav = $('#nav');
  var floaters = $('#floaters');
  var stem = $('#stem');
  var stemPath = $('#stemPath');
  var hojas = $$('.stem__leaf');
  var umbrales = [0.16, 0.40, 0.66, 0.90];
  var largo = 0;

  if (stemPath && stemPath.getTotalLength) {
    largo = stemPath.getTotalLength();
    stemPath.style.strokeDasharray = largo;
    stemPath.style.strokeDashoffset = largo;
  }

  var ticking = false;
  function alScrollear() {
    var y = window.pageYOffset;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    var progreso = alto > 0 ? Math.min(y / alto, 1) : 0;

    nav.classList.toggle('is-stuck', y > 24);
    floaters.classList.toggle('on', y > 420);
    if (stem) stem.classList.toggle('on', y > window.innerHeight * 0.6);

    if (largo) stemPath.style.strokeDashoffset = largo * (1 - Math.min(progreso * 1.15, 1));
    hojas.forEach(function (h, i) { h.classList.toggle('open', progreso > umbrales[i]); });

    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(alScrollear); ticking = true; }
  }, { passive: true });
  alScrollear();

  /* ------------------------------------------------------------
     8. Parallax suave del hero + inclinación del mockup
     ------------------------------------------------------------ */
  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    var stage = $('#stage'), mock = $('#mock');
    var chips = $$('.chip');
    var objetivo = { x: 0, y: 0 }, actual = { x: 0, y: 0 }, animando = false;

    function loop() {
      actual.x += (objetivo.x - actual.x) * 0.06;   // seguimiento lento, nunca brusco
      actual.y += (objetivo.y - actual.y) * 0.06;

      if (mock) {
        mock.style.transform = 'rotateY(' + (actual.x * 4.5) + 'deg) rotateX(' + (-actual.y * 3.2) + 'deg)';
      }
      chips.forEach(function (c) {
        var d = parseFloat(c.dataset.depth) || 12;
        c.style.marginLeft = (actual.x * d) + 'px';
        c.style.marginTop  = (actual.y * d * 0.6) + 'px';
      });

      if (Math.abs(objetivo.x - actual.x) > 0.001 || Math.abs(objetivo.y - actual.y) > 0.001) {
        requestAnimationFrame(loop);
      } else { animando = false; }
    }

    if (stage) {
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        objetivo.x = (e.clientX - r.left) / r.width - 0.5;
        objetivo.y = (e.clientY - r.top) / r.height - 0.5;
        if (!animando) { animando = true; requestAnimationFrame(loop); }
      });
      stage.addEventListener('mouseleave', function () {
        objetivo.x = 0; objetivo.y = 0;
        if (!animando) { animando = true; requestAnimationFrame(loop); }
      });
    }

    // Parallax vertical muy leve de las hojas del hero
    var hojasHero = $$('.leafy');
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (y > window.innerHeight * 1.2) return;
      hojasHero.forEach(function (h, i) {
        h.style.marginTop = (y * (0.06 + i * 0.03)) + 'px';
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------
     9. Tarjetas de problema: en pantallas táctiles la solución
        se muestra al tocar, no al pasar el cursor
     ------------------------------------------------------------ */
  if (window.matchMedia('(hover:none)').matches) {
    $$('.pcard').forEach(function (card) {
      card.addEventListener('click', function () { card.focus(); });
    });
  }
})();
