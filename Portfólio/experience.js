// ============================================================
// EXPERIÊNCIA — fluxo de dados animado (canvas) e abas das
// frentes de trabalho.
//
// Desempenho: um único loop rAF que só roda com o diagrama na
// tela e a aba do navegador visível; geometria das curvas
// pré-amostrada (tabela de consulta) e recalculada só no resize;
// DPR limitado a 2; nada de shadowBlur.
// ============================================================

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // FLUXO DE DADOS
  // ============================================================
  const arch = document.getElementById("arch");
  if (arch) initArch(arch);

  function initArch(arch) {
    const stage = arch.querySelector(".arch__stage");
    const grid = arch.querySelector(".arch__grid");
    const canvas = arch.querySelector(".arch__canvas");
    const ctx = canvas.getContext("2d");
    const detail = document.getElementById("arch-detail");
    const pauseBtn = document.getElementById("arch-pause");
    const defaultDetail = detail.textContent.trim();

    const nodeEls = {};
    arch.querySelectorAll(".arch__node").forEach((el) => {
      nodeEls[el.dataset.node] = el;
    });

    // Arestas do diagrama
    const EDGES = {
      za: ["zendesk", "airflow"],
      ja: ["jira", "airflow"],
      ab: ["airflow", "bigquery"],
      bh: ["bigquery", "heatwave"],
      bp: ["bigquery", "powerbi"],
      hp: ["heatwave", "powerbi"],
      bm: ["bigquery", "mcp"],
    };

    // Caminhos que um "registro" percorre, com peso de sorteio
    const ROUTES = [
      { src: "za", path: ["za", "ab", "bp"], w: 0.24 },
      { src: "za", path: ["za", "ab", "bh", "hp"], w: 0.15 },
      { src: "za", path: ["za", "ab", "bm"], w: 0.11 },
      { src: "ja", path: ["ja", "ab", "bp"], w: 0.24 },
      { src: "ja", path: ["ja", "ab", "bh", "hp"], w: 0.15 },
      { src: "ja", path: ["ja", "ab", "bm"], w: 0.11 },
    ];

    // A cor segue a fonte do dado do começo ao fim
    const css = getComputedStyle(document.documentElement);
    const COLORS = {
      zendesk: css.getPropertyValue("--s-obs").trim() || "#3987e5",
      jira: css.getPropertyValue("--s-violet").trim() || "#9085e9",
    };
    const LINE = css.getPropertyValue("--edge").trim() || "#34496b";
    const LINE_HI = css.getPropertyValue("--accent").trim() || "#5598e7";

    const SAMPLES = 40;
    let geo = {}; // id -> { pts: [{x,y}], cum: [len], len, path2d }
    let width = 0;
    let height = 0;
    let dpr = 1;

    // ---------------- Geometria ----------------
    function anchor(r, side) {
      switch (side) {
        case "right": return { x: r.right, y: r.cy };
        case "left": return { x: r.left, y: r.cy };
        case "top": return { x: r.cx, y: r.top };
        default: return { x: r.cx, y: r.bottom };
      }
    }

    function measure() {
      const base = stage.getBoundingClientRect();
      width = base.width;
      height = base.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const rects = {};
      for (const id in nodeEls) {
        const r = nodeEls[id].getBoundingClientRect();
        rects[id] = {
          left: r.left - base.left,
          right: r.right - base.left,
          top: r.top - base.top,
          bottom: r.bottom - base.top,
          cx: r.left - base.left + r.width / 2,
          cy: r.top - base.top + r.height / 2,
        };
      }

      geo = {};
      for (const id in EDGES) {
        const [a, b] = EDGES[id];
        const ra = rects[a];
        const rb = rects[b];
        const dx = rb.cx - ra.cx;
        const dy = rb.cy - ra.cy;
        let p0, p3, c1, c2;
        if (Math.abs(dx) >= Math.abs(dy)) {
          p0 = anchor(ra, dx > 0 ? "right" : "left");
          p3 = anchor(rb, dx > 0 ? "left" : "right");
          const k = (p3.x - p0.x) * 0.5;
          c1 = { x: p0.x + k, y: p0.y };
          c2 = { x: p3.x - k, y: p3.y };
        } else {
          p0 = anchor(ra, dy > 0 ? "bottom" : "top");
          p3 = anchor(rb, dy > 0 ? "top" : "bottom");
          const k = (p3.y - p0.y) * 0.5;
          c1 = { x: p0.x, y: p0.y + k };
          c2 = { x: p3.x, y: p3.y - k };
        }

        const pts = [];
        const cum = [0];
        for (let i = 0; i <= SAMPLES; i++) {
          const t = i / SAMPLES;
          const mt = 1 - t;
          const x = mt * mt * mt * p0.x + 3 * mt * mt * t * c1.x + 3 * mt * t * t * c2.x + t * t * t * p3.x;
          const y = mt * mt * mt * p0.y + 3 * mt * mt * t * c1.y + 3 * mt * t * t * c2.y + t * t * t * p3.y;
          if (i > 0) {
            const prev = pts[i - 1];
            cum.push(cum[i - 1] + Math.hypot(x - prev.x, y - prev.y));
          }
          pts.push({ x, y });
        }
        const path2d = new Path2D();
        path2d.moveTo(p0.x, p0.y);
        path2d.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p3.x, p3.y);
        geo[id] = { pts, cum, len: cum[SAMPLES], path2d, end: p3 };
      }

      ROUTES.forEach((r) => {
        r.len = r.path.reduce((s, id) => s + geo[id].len, 0);
      });
    }

    function pointOnRoute(route, dist) {
      for (const id of route.path) {
        const g = geo[id];
        if (dist <= g.len) {
          // busca binária na tabela de comprimento acumulado
          let lo = 0;
          let hi = SAMPLES;
          while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (g.cum[mid] < dist) lo = mid;
            else hi = mid;
          }
          const seg = g.cum[hi] - g.cum[lo] || 1;
          const f = (dist - g.cum[lo]) / seg;
          const a = g.pts[lo];
          const b = g.pts[hi];
          return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
        }
        dist -= g.len;
      }
      const last = geo[route.path[route.path.length - 1]];
      return last.pts[SAMPLES];
    }

    // ---------------- Estado de destaque ----------------
    let active = null; // nó em destaque
    let pinned = null; // nó fixado por clique/toque
    let hiEdges = null; // Set de arestas destacadas

    function edgesThrough(node) {
      const set = new Set();
      ROUTES.forEach((r) => {
        const nodes = new Set();
        r.path.forEach((id) => {
          nodes.add(EDGES[id][0]);
          nodes.add(EDGES[id][1]);
        });
        if (nodes.has(node)) r.path.forEach((id) => set.add(id));
      });
      return set;
    }

    function setActive(node) {
      if (node === active) return;
      active = node;
      hiEdges = node ? edgesThrough(node) : null;

      const related = new Set();
      if (hiEdges) hiEdges.forEach((id) => EDGES[id].forEach((n) => related.add(n)));
      for (const id in nodeEls) {
        nodeEls[id].classList.toggle("is-active", id === node);
        nodeEls[id].classList.toggle("is-dim", !!node && !related.has(id));
      }
      grid.classList.toggle("has-active", !!node);

      const text = node ? nodeEls[node].dataset.detail : defaultDetail;
      if (detail.textContent !== text) {
        detail.textContent = text;
        if (!reduceMotion) {
          detail.animate(
            [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
            { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      }
      if (!running) draw(); // atualiza o quadro estático
    }

    for (const id in nodeEls) {
      const el = nodeEls[id];
      el.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") setActive(id);
      });
      el.addEventListener("focus", () => setActive(id));
      el.addEventListener("click", () => {
        pinned = pinned === id ? null : id;
        el.setAttribute("aria-pressed", String(pinned === id));
        for (const other in nodeEls) {
          if (other !== id) nodeEls[other].setAttribute("aria-pressed", "false");
        }
        setActive(pinned);
      });
      el.setAttribute("aria-pressed", "false");
    }
    grid.addEventListener("pointerleave", () => setActive(pinned));
    grid.addEventListener("focusout", (e) => {
      if (!grid.contains(e.relatedTarget)) setActive(pinned);
    });

    // ---------------- Partículas ----------------
    const MAX = 64;
    const particles = [];
    const ripples = [];
    let spawnAcc = 0;

    function pickRoute() {
      let r = Math.random();
      for (const route of ROUTES) {
        r -= route.w;
        if (r <= 0) return route;
      }
      return ROUTES[0];
    }

    function spawn(atDist) {
      if (particles.length >= MAX) return;
      const route = pickRoute();
      particles.push({
        route,
        dist: atDist ?? 0,
        speed: 70 + Math.random() * 45, // px/s
        color: COLORS[EDGES[route.src][0]],
        r: 2.6 + Math.random() * 0.9,
      });
    }

    function update(dt) {
      // taxa de criação proporcional ao tamanho do diagrama
      const rate = Math.max(3, Math.min(7, width / 160)); // partículas/s
      spawnAcc += dt * rate;
      while (spawnAcc >= 1) {
        spawn();
        spawnAcc -= 1;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.dist += p.speed * dt;
        if (p.dist >= p.route.len) {
          const end = geo[p.route.path[p.route.path.length - 1]].end;
          if (ripples.length < 12) ripples.push({ x: end.x, y: end.y, t: 0, color: p.color });
          particles.splice(i, 1);
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].t += dt;
        if (ripples[i].t > 0.7) ripples.splice(i, 1);
      }
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // arestas
      ctx.lineWidth = 1.5;
      for (const id in geo) {
        const on = hiEdges?.has(id);
        ctx.strokeStyle = on ? LINE_HI : LINE;
        ctx.globalAlpha = hiEdges && !on ? 0.35 : 1;
        ctx.stroke(geo[id].path2d);
      }

      // partículas
      for (const p of particles) {
        const onPath = !hiEdges || p.route.path.every((id) => hiEdges.has(id));
        const pos = pointOnRoute(p.route, p.dist);
        const fadeIn = Math.min(1, p.dist / 24);
        const fadeOut = Math.min(1, (p.route.len - p.dist) / 24);
        ctx.globalAlpha = Math.min(fadeIn, fadeOut) * (onPath ? 1 : 0.18);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ondas na chegada
      ctx.lineWidth = 1.5;
      for (const r of ripples) {
        const k = r.t / 0.7;
        ctx.globalAlpha = (1 - k) * 0.6;
        ctx.strokeStyle = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4 + k * 14, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // ---------------- Loop ----------------
    let running = false;
    let raf = 0;
    let last = 0;
    let visible = false;
    let userPaused = false;

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); // limita saltos após travadas
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function sync() {
      const shouldRun = visible && !document.hidden && !userPaused && !reduceMotion;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    // Preenche o fluxo para o primeiro quadro já parecer "em operação"
    function prefill() {
      particles.length = 0;
      ROUTES.forEach((route) => {
        const n = reduceMotion ? 3 : 2;
        for (let i = 0; i < n; i++) {
          particles.push({
            route,
            dist: ((i + 0.5) / n) * route.len * (0.9 + Math.random() * 0.1),
            speed: 70 + Math.random() * 45,
            color: COLORS[EDGES[route.src][0]],
            r: 3,
          });
        }
      });
    }

    let lastSize = "";
    const ro = new ResizeObserver(() => {
      const size = `${stage.clientWidth}x${stage.clientHeight}`;
      if (size === lastSize) return;
      const first = !lastSize;
      lastSize = size;
      measure();
      if (first) prefill();
      // distâncias continuam válidas proporcionalmente
      particles.forEach((p) => (p.dist = Math.min(p.dist, p.route.len)));
      if (!running) draw();
    });
    ro.observe(stage);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
          sync();
        },
        { threshold: 0.05 }
      ).observe(stage);
    } else {
      visible = true;
    }
    document.addEventListener("visibilitychange", sync);

    if (reduceMotion && pauseBtn) {
      pauseBtn.hidden = true;
    }

    pauseBtn?.addEventListener("click", () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      const label = userPaused ? "Retomar animação" : "Pausar animação";
      pauseBtn.setAttribute("aria-label", label);
      pauseBtn.title = label;
      pauseBtn.querySelector("i").className = userPaused ? "bx bx-play" : "bx bx-pause";
      sync();
    });

    sync();
  }

  // ============================================================
  // ABAS DAS FRENTES DE TRABALHO
  // ============================================================
  const tablist = document.querySelector(".streams__tabs");
  if (tablist) initTabs(tablist);

  function initTabs(tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const ink = tablist.querySelector(".streams__ink");
    const panelsWrap = document.querySelector(".streams__panels");

    function placeInk(tab) {
      ink.style.setProperty("--x", `${tab.offsetLeft}px`);
      ink.style.setProperty("--w", `${tab.offsetWidth}px`);
    }

    function select(tab, focus) {
      const current = tabs.find((t) => t.getAttribute("aria-selected") === "true");
      if (current === tab) return;

      const oldPanel = document.getElementById(current.getAttribute("aria-controls"));
      const newPanel = document.getElementById(tab.getAttribute("aria-controls"));

      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      placeInk(tab);
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });

      if (reduceMotion || !panelsWrap.animate) {
        oldPanel.hidden = true;
        newPanel.hidden = false;
        return;
      }

      // anima a altura do contêiner e faz crossfade dos painéis
      const dir = tabs.indexOf(tab) > tabs.indexOf(current) ? 1 : -1;
      const fromH = panelsWrap.offsetHeight;
      oldPanel.hidden = true;
      newPanel.hidden = false;
      const toH = panelsWrap.offsetHeight;

      panelsWrap.animate([{ height: `${fromH}px` }, { height: `${toH}px` }], {
        duration: 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      newPanel.animate(
        [
          { opacity: 0, transform: `translateX(${16 * dir}px)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 360, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
      newPanel.querySelectorAll(".bullets li").forEach((li, i) => {
        li.animate(
          [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
          { duration: 320, delay: 60 + i * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
        );
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(tab);
        const map = {
          ArrowRight: tabs[(i + 1) % tabs.length],
          ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
          Home: tabs[0],
          End: tabs[tabs.length - 1],
        };
        if (map[e.key]) {
          e.preventDefault();
          select(map[e.key], true);
        }
      });
    });

    const place = () => placeInk(tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
  }
})();
