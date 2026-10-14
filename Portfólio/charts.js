// ============================================================
// GRÁFICO DO HERO — série "ao vivo"
// Série sintética com semente fixa. A cada poucos segundos chega
// um novo mês: a janela desliza, a tendência (LOESS) e a previsão
// são recalculadas no navegador. Só a camada do gráfico se move
// (transform), então a animação roda na GPU.
// ============================================================

(function () {
  const root = document.getElementById("hero-chart");
  if (!root) return;

  const tooltip = document.getElementById("hero-tooltip");
  const tableWrap = document.getElementById("hero-table-wrap");
  const table = document.getElementById("hero-table");
  const tableToggle = document.getElementById("hero-table-toggle");
  const liveBtn = document.getElementById("hero-live");
  const liveLabel = document.getElementById("hero-live-label");

  const NS = "http://www.w3.org/2000/svg";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------- Dados ----------------
  const WIN = 36; // meses visíveis
  const H = 6; // meses de previsão
  const TICK_MS = 2200; // intervalo entre novos meses
  const Y0 = 20;
  const Y1 = 100;
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const monthLabel = (k) => `${MESES[k % 12]}/${23 + Math.floor(k / 12)}`;

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(20261014);
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (!u) u = rand();
    while (!v) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  // ciclo longo + sazonalidade anual + ruído (fica sempre na mesma faixa)
  const gen = (k) =>
    60 + 11 * Math.sin((2 * Math.PI * k) / 40) + 6 * Math.sin((2 * Math.PI * (k - 2)) / 12) + 3.6 * gauss();

  const series = [];
  for (let k = 0; k < WIN; k++) series.push(gen(k));

  function loess(ys, span) {
    const n = ys.length;
    const k = Math.max(3, Math.round(span * n));
    return ys.map((_, i) => {
      const dists = ys.map((__, j) => Math.abs(j - i));
      const h = [...dists].sort((a, b) => a - b)[k - 1] + 1e-9;
      let sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
      for (let j = 0; j < n; j++) {
        const d = dists[j] / h;
        if (d >= 1) continue;
        const w = Math.pow(1 - d * d * d, 3);
        sw += w; sx += w * j; sy += w * ys[j];
        sxx += w * j * j; sxy += w * j * ys[j];
      }
      const mx = sx / sw;
      const my = sy / sw;
      const slope = (sxy / sw - mx * my) / (sxx / sw - mx * mx);
      return my + slope * (i - mx);
    });
  }

  let kStart = 0;
  let obs = [];
  let trend = [];
  let fcst = [];

  function compute() {
    kStart = series.length - WIN;
    obs = series.slice(-WIN);
    trend = loess(obs, 0.35);

    // inclinação recente da tendência (MQO nos últimos 8 pontos)
    const m = 8;
    const xs = Array.from({ length: m }, (_, i) => i);
    const ys = trend.slice(-m);
    const xb = (m - 1) / 2;
    const yb = ys.reduce((a, b) => a + b, 0) / m;
    let sxx = 0, sxy = 0;
    xs.forEach((x, i) => {
      sxx += (x - xb) ** 2;
      sxy += (x - xb) * (ys[i] - yb);
    });
    const slope = sxy / sxx;

    const resid = obs.map((y, i) => y - trend[i]);
    const sigma = Math.sqrt(resid.reduce((a, r) => a + r * r, 0) / (WIN - 2));
    const last = trend[WIN - 1];

    fcst = [];
    for (let h = 0; h <= H; h++) {
      const mean = last + slope * h;
      const se = h === 0 ? 0 : sigma * Math.sqrt(1 + 0.35 * h);
      fcst.push({ i: WIN - 1 + h, mean, lo: mean - 1.96 * se, hi: mean + 1.96 * se });
    }
  }
  compute();

  const fcstAt = (i) => fcst.find((f) => f.i === i);
  const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // ---------------- Desenho ----------------
  let state = null;
  let hoverIdx = null;

  function el(name, attrs = {}, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  const pathOf = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");

  /**
   * mode: "intro" (sequência de entrada), "shift" (novo mês chegando) ou "static"
   */
  function render(mode) {
    const W = root.clientWidth;
    const Ht = root.clientHeight;
    if (!W || !Ht) return;

    root.querySelector("svg")?.remove();

    const narrow = W < 460;
    const m = { t: 14, r: narrow ? 50 : 70, b: 26, l: 32 };
    const iw = W - m.l - m.r;
    const ih = Ht - m.t - m.b;
    const step = iw / (WIN + H - 1);

    const x = (i) => m.l + i * step;
    const y = (v) => m.t + (1 - (v - Y0) / (Y1 - Y0)) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${Ht}`, "aria-hidden": "true", focusable: "false" });
    const defs = el("defs", {}, svg);

    // área de plotagem recortada (o que sai pela esquerda some)
    const clipPlot = el("clipPath", { id: "plot-clip" }, defs);
    el("rect", { x: m.l - 6, y: 0, width: iw + 6 + m.r, height: Ht }, clipPlot);

    // gradiente sob a tendência
    const grad = el("linearGradient", { id: "trend-fill", x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    el("stop", { offset: "0%", "stop-color": "var(--s-trend)", "stop-opacity": "0.22" }, grad);
    el("stop", { offset: "100%", "stop-color": "var(--s-trend)", "stop-opacity": "0" }, grad);

    // grade fixa
    const gGrid = el("g", {}, svg);
    for (let v = Y0; v <= Y1; v += 20) {
      el("line", {
        class: v === Y0 ? "baseline" : "gridline",
        x1: m.l, x2: W - m.r + 6, y1: Math.round(y(v)) + 0.5, y2: Math.round(y(v)) + 0.5,
      }, gGrid);
      const label = el("text", { class: "tick", x: m.l - 8, y: y(v) + 4, "text-anchor": "end" }, gGrid);
      label.textContent = v;
    }

    // linha do "agora" (fixa)
    const xNow = (x(WIN - 1) + x(WIN)) / 2;
    el("line", { class: "now-line", x1: xNow, x2: xNow, y1: m.t, y2: m.t + ih }, svg);

    // camada móvel
    const clipWrap = el("g", { "clip-path": "url(#plot-clip)" }, svg);
    const gMove = el("g", {}, clipWrap);

    // rótulos do eixo X (andam junto com os dados)
    const every = narrow ? 12 : 6;
    for (let i = 0; i < WIN + H; i++) {
      const k = kStart + i;
      if (k % every !== 0 || x(i) < m.l + 14) continue;
      const label = el("text", { class: "tick", x: x(i), y: Ht - 7, "text-anchor": "middle" }, gMove);
      label.textContent = monthLabel(k);
    }

    // área + tendência
    const trendPts = trend.map((v, i) => [x(i), y(v)]);
    const area = el("path", {
      class: "trend-area",
      d: pathOf(trendPts) + `L${x(WIN - 1)},${y(Y0)}L${x(0)},${y(Y0)}Z`,
      fill: "url(#trend-fill)",
    }, gMove);

    // faixa e linha de previsão
    const gF = el("g", {}, gMove);
    const band = el("path", {
      class: "band",
      d: pathOf(fcst.map((f) => [x(f.i), y(f.hi)])) +
        [...fcst].reverse().map((f) => `L${x(f.i).toFixed(1)},${y(f.lo).toFixed(1)}`).join("") + "Z",
    }, gF);
    el("path", { class: "fcst", d: pathOf(fcst.map((f) => [x(f.i), y(f.mean)])) }, gF);

    // pontos
    const gObs = el("g", { class: "obs-group" }, gMove);
    const dots = obs.map((v, i) => el("circle", { class: "obs", cx: x(i), cy: y(v), r: 4 }, gObs));

    const trendPath = el("path", { class: "trend", d: pathOf(trendPts) }, gMove);

    // valor final da previsão (fixo à direita)
    const last = fcst[fcst.length - 1];
    const gEnd = el("g", {}, svg);
    el("circle", { class: "end-dot", cx: x(last.i), cy: y(last.mean), r: 5 }, gEnd);
    const endText = el("text", { class: "end-label", x: x(last.i) + 10, y: y(last.mean) + 4 }, gEnd);
    endText.textContent = fmt(last.mean);

    // hover
    const gHover = el("g", {}, svg);
    gHover.style.display = "none";
    const cross = el("line", { class: "crosshair", y1: m.t, y2: m.t + ih }, gHover);
    const hTrend = el("circle", { class: "hover-dot", r: 5 }, gHover);
    const hObs = el("circle", { class: "hover-dot", r: 6 }, gHover);
    const hFcst = el("circle", { class: "hover-dot", r: 6 }, gHover);
    hTrend.style.fill = "var(--s-trend)";
    hObs.style.fill = "var(--s-obs)";
    hFcst.style.fill = "var(--s-fcst)";

    const overlay = el("rect", { x: m.l - 8, y: 0, width: W - m.l + 8, height: Ht, fill: "transparent" }, svg);
    overlay.style.cursor = "crosshair";

    root.insertBefore(svg, tooltip);
    state = { x, y, W, Ht, gHover, cross, hTrend, hObs, hFcst };

    overlay.addEventListener("pointermove", (e) => {
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * W;
      showAt(Math.max(0, Math.min(WIN + H - 1, Math.round((px - m.l) / step))));
    });
    overlay.addEventListener("pointerenter", () => setHover(true));
    overlay.addEventListener("pointerleave", () => {
      hide();
      setHover(false);
    });

    if (hoverIdx !== null) showAt(hoverIdx);

    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

    if (mode === "shift") {
      // tudo desliza um mês para a esquerda
      gMove.animate([{ transform: `translateX(${step}px)` }, { transform: "none" }], {
        duration: 900, easing: ease,
      });
      const nd = dots[dots.length - 1];
      nd.style.transformBox = "fill-box";
      nd.style.transformOrigin = "center";
      nd.animate([{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1.6)", opacity: 1, offset: 0.6 }, { transform: "scale(1)" }], {
        duration: 700, delay: 250, easing: ease, fill: "backwards",
      });
      gEnd.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 600, delay: 300, fill: "backwards" });
      return;
    }

    if (mode !== "intro") return;

    // ---------- Sequência de entrada ----------
    const stagger = 24;
    gGrid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 450, fill: "backwards" });
    dots.forEach((dot, i) => {
      dot.style.transformBox = "fill-box";
      dot.style.transformOrigin = "center";
      dot.animate(
        [{ opacity: 0, transform: "translateY(-14px) scale(0.4)" }, { opacity: 1, transform: "none" }],
        { duration: 420, delay: 650 + i * stagger, easing: ease, fill: "backwards" }
      );
    });
    const tStart = 650 + WIN * stagger;
    const len = trendPath.getTotalLength();
    trendPath.style.strokeDasharray = `${len}`;
    trendPath.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: 1100, delay: tStart, easing: ease, fill: "backwards",
    }).finished.then(() => (trendPath.style.strokeDasharray = "")).catch(() => {});
    area.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: tStart + 500, fill: "backwards" });
    gF.animate([{ opacity: 0, transform: "translateX(-12px)" }, { opacity: 1, transform: "none" }], {
      duration: 700, delay: tStart + 1000, easing: ease, fill: "backwards",
    });
    gEnd.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: tStart + 1500, fill: "backwards" });
    return tStart + 1900; // fim da entrada
  }

  function showAt(i) {
    if (!state) return;
    hoverIdx = i;
    const { x, y, W, gHover, cross, hTrend, hObs, hFcst } = state;
    const xp = x(i);
    gHover.style.display = "";
    cross.setAttribute("x1", xp);
    cross.setAttribute("x2", xp);

    const isObs = i < WIN;
    const f = fcstAt(i);
    const k = kStart + i;
    toggleDot(hObs, isObs, xp, isObs ? y(obs[i]) : 0);
    toggleDot(hTrend, isObs, xp, isObs ? y(trend[i]) : 0);
    toggleDot(hFcst, !isObs, xp, f ? y(f.mean) : 0);

    const row = (cls, label, value) =>
      `<span class="row"><span class="key ${cls}"></span>${label}<b>${value}</b></span>`;
    tooltip.innerHTML = isObs
      ? `<strong>${monthLabel(k)}</strong>` +
        row("key--dot", "Observado", fmt(obs[i])) +
        row("key--line", "Tendência", fmt(trend[i]))
      : `<strong>${monthLabel(k)}, previsão</strong>` +
        row("key--dash", "Esperado", fmt(f.mean)) +
        row("", "IC 95%", `${fmt(f.lo)} a ${fmt(f.hi)}`);

    const tipW = tooltip.offsetWidth;
    const tipH = tooltip.offsetHeight;
    const anchorY = isObs ? y(obs[i]) : y(f.mean);
    let left = xp + 16;
    if (left + tipW > W) left = xp - tipW - 16;
    const top = Math.max(0, Math.min(state.Ht - tipH, anchorY - tipH / 2));
    tooltip.style.transform = `translate(${left}px, ${top}px)`;
    tooltip.classList.add("is-visible");
  }

  function toggleDot(dot, on, cx, cy) {
    dot.setAttribute("visibility", on ? "visible" : "hidden");
    if (on) {
      dot.setAttribute("cx", cx);
      dot.setAttribute("cy", cy);
    }
  }

  function hide() {
    hoverIdx = null;
    tooltip.classList.remove("is-visible");
    if (state) state.gHover.style.display = "none";
  }

  // ---------------- Loop "ao vivo" ----------------
  let started = false;
  let introDone = false;
  let visible = false;
  let hovering = false;
  let userPaused = reduceMotion;
  let timer = 0;

  const canRun = () =>
    started && introDone && visible && !hovering && !userPaused && !document.hidden && !root.hidden;

  function updateLiveUi() {
    if (!liveBtn) return;
    const live = !userPaused;
    liveBtn.setAttribute("aria-pressed", String(!live));
    liveBtn.classList.toggle("is-paused", !live);
    liveLabel.textContent = live ? "Ao vivo" : "Pausado";
    liveBtn.setAttribute("aria-label", live ? "Pausar atualização ao vivo" : "Retomar atualização ao vivo");
  }

  function schedule() {
    clearTimeout(timer);
    if (!canRun()) return;
    timer = setTimeout(() => {
      if (!canRun()) return;
      series.push(gen(series.length));
      compute();
      render("shift");
      if (!tableWrap.hidden) buildTable();
      schedule();
    }, TICK_MS);
  }

  function setHover(on) {
    hovering = on;
    schedule();
  }

  root.addEventListener("keydown", (e) => {
    const cur = hoverIdx ?? WIN - 1;
    const map = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: WIN + H - 1 };
    if (e.key in map) {
      e.preventDefault();
      showAt(Math.max(0, Math.min(WIN + H - 1, map[e.key])));
    } else if (e.key === "Escape") {
      hide();
    }
  });
  root.addEventListener("focus", () => {
    setHover(true);
    showAt(hoverIdx ?? WIN - 1);
  });
  root.addEventListener("blur", () => {
    hide();
    setHover(false);
  });

  liveBtn?.addEventListener("click", () => {
    userPaused = !userPaused;
    updateLiveUi();
    schedule();
  });
  if (reduceMotion && liveBtn) liveBtn.hidden = true;
  updateLiveUi();

  // ---------------- Tabela ----------------
  function buildTable() {
    const rows = [];
    for (let i = 0; i < WIN + H; i++) {
      const f = i >= WIN ? fcstAt(i) : null;
      rows.push(
        `<tr class="${f ? "is-forecast" : ""}"><td>${monthLabel(kStart + i)}</td>` +
          `<td>${f ? "—" : fmt(obs[i])}</td>` +
          `<td>${f ? "—" : fmt(trend[i])}</td>` +
          `<td>${f ? fmt(f.mean) : "—"}</td>` +
          `<td>${f ? `${fmt(f.lo)} a ${fmt(f.hi)}` : "—"}</td></tr>`
      );
    }
    table.innerHTML =
      `<caption class="sr-only">Dados do gráfico</caption>` +
      `<thead><tr><th scope="col">Mês</th><th scope="col">Observado</th><th scope="col">Tendência</th><th scope="col">Previsão</th><th scope="col">IC 95%</th></tr></thead>` +
      `<tbody>${rows.join("")}</tbody>`;
  }

  tableToggle?.addEventListener("click", () => {
    const showTable = tableToggle.getAttribute("aria-pressed") !== "true";
    tableToggle.setAttribute("aria-pressed", String(showTable));
    const label = showTable ? "Mostrar como gráfico" : "Mostrar como tabela";
    tableToggle.setAttribute("aria-label", label);
    tableToggle.title = label;
    tableToggle.querySelector("i").className = showTable ? "bx bx-line-chart" : "bx bx-table";
    if (showTable) buildTable();
    tableWrap.hidden = !showTable;
    root.hidden = showTable;
    if (!showTable) render("static");
    schedule();
  });

  // ---------------- Inicialização ----------------
  let raf = 0;
  let lastSize = "";
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (!started || root.hidden) return;
      const size = `${root.clientWidth}x${root.clientHeight}`;
      if (size === lastSize) return;
      lastSize = size;
      render("static");
    });
  });

  function begin() {
    if (started) return;
    started = true;
    lastSize = `${root.clientWidth}x${root.clientHeight}`;
    if (reduceMotion) {
      render("static");
      introDone = true;
    } else {
      const end = render("intro") || 0;
      setTimeout(() => {
        introDone = true;
        schedule();
      }, end);
    }
    ro.observe(root);
  }

  const watch = () => {
    if (!("IntersectionObserver" in window)) {
      visible = true;
      return begin();
    }
    new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) begin();
        schedule();
      },
      { threshold: 0.3 }
    ).observe(root);
  };
  document.addEventListener("visibilitychange", schedule);

  if (document.fonts?.ready) document.fonts.ready.then(watch);
  else watch();
})();
