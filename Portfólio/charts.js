// ============================================================
// GRÁFICO DO HERO — "Do ruído ao sinal"
// Série sintética (semente fixa) + tendência LOESS + previsão
// linear com intervalo de 95%, tudo calculado no navegador.
// ============================================================

(function () {
  const root = document.getElementById("hero-chart");
  if (!root) return;

  const tooltip = document.getElementById("hero-tooltip");
  const tableWrap = document.getElementById("hero-table-wrap");
  const table = document.getElementById("hero-table");
  const tableToggle = document.getElementById("hero-table-toggle");
  const replayBtn = document.getElementById("hero-replay");

  const NS = "http://www.w3.org/2000/svg";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------------- Dados ----------------
  const N = 42; // meses observados (jan/23 a jun/26)
  const H = 8; // meses de previsão
  const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const monthLabel = (i) => `${MESES[i % 12]}/${23 + Math.floor(i / 12)}`;

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

  const obs = Array.from({ length: N }, (_, t) =>
    52 + 0.62 * t + 6.5 * Math.sin((2 * Math.PI * (t - 2)) / 12) + 4.2 * gauss()
  );

  // LOESS (regressão local linear com pesos tricúbicos)
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

  const trend = loess(obs, 0.4);

  // Regressão linear (MQO) para inclinação e erro da previsão
  const tBar = (N - 1) / 2;
  const yBar = obs.reduce((a, b) => a + b, 0) / N;
  let sxx = 0, sxy = 0;
  obs.forEach((y, t) => {
    sxx += (t - tBar) ** 2;
    sxy += (t - tBar) * (y - yBar);
  });
  const slope = sxy / sxx;
  const resid = obs.map((y, t) => y - trend[t]);
  const sigma = Math.sqrt(resid.reduce((a, r) => a + r * r, 0) / (N - 2));

  const fcst = [];
  for (let t = N - 1; t < N + H; t++) {
    const mean = trend[N - 1] + slope * (t - (N - 1));
    const se = t === N - 1 ? 0 : sigma * Math.sqrt(1 + 1 / N + (t - tBar) ** 2 / sxx);
    fcst.push({ t, mean, lo: mean - 1.96 * se, hi: mean + 1.96 * se });
  }
  const fcstAt = (t) => fcst.find((f) => f.t === t);

  const fmt = (v) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // ---------------- Desenho ----------------
  let state = null; // geometria do último render
  let hoverIdx = null;

  function el(name, attrs = {}, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function niceTicks(min, max, count) {
    const raw = (max - min) / count;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw);
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = lo; v <= hi + 1e-9; v += step) ticks.push(v);
    return ticks;
  }

  function render(animate) {
    const W = root.clientWidth;
    const Ht = root.clientHeight;
    if (!W || !Ht) return;

    root.querySelector("svg")?.remove();

    const narrow = W < 460;
    const m = { t: 18, r: narrow ? 56 : 84, b: 28, l: 34 };
    const iw = W - m.l - m.r;
    const ih = Ht - m.t - m.b;

    const allY = [...obs, ...fcst.map((f) => f.lo), ...fcst.map((f) => f.hi)];
    const ticks = niceTicks(Math.min(...allY), Math.max(...allY), Ht < 300 ? 3 : 4);
    const y0 = ticks[0];
    const y1 = ticks[ticks.length - 1];

    const x = (t) => m.l + (t / (N + H - 1)) * iw;
    const y = (v) => m.t + (1 - (v - y0) / (y1 - y0)) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${Ht}`, "aria-hidden": "true", focusable: "false" });

    // Grade e eixo Y
    const gGrid = el("g", {}, svg);
    ticks.forEach((v, i) => {
      el("line", {
        class: i === 0 ? "baseline" : "gridline",
        x1: m.l, x2: W - m.r + 8, y1: Math.round(y(v)) + 0.5, y2: Math.round(y(v)) + 0.5,
      }, gGrid);
      const label = el("text", { class: "tick", x: m.l - 8, y: y(v) + 4, "text-anchor": "end" }, gGrid);
      label.textContent = v.toLocaleString("pt-BR");
    });

    // Eixo X
    const every = narrow ? 12 : 6;
    for (let t = 0; t < N + H; t += every) {
      const label = el("text", { class: "tick", x: x(t), y: Ht - 8, "text-anchor": "middle" }, gGrid);
      label.textContent = monthLabel(t);
    }

    // Divisória observado | previsão
    const xNow = (x(N - 1) + x(N)) / 2;
    el("line", { class: "now-line", x1: xNow, x2: xNow, y1: m.t, y2: m.t + ih }, svg);
    const nowLabel = el("text", { class: "now-label", x: xNow + 6, y: m.t + 10 }, svg);
    nowLabel.textContent = "previsão";

    // Faixa + linha de previsão (recortadas para a animação)
    const clipId = "fcst-clip";
    const defs = el("defs", {}, svg);
    const clip = el("clipPath", { id: clipId }, defs);
    const clipRect = el("rect", {
      x: x(N - 1) - 2, y: 0, height: Ht, width: animate ? 0 : x(N + H - 1) - x(N - 1) + 40,
    }, clip);

    const gF = el("g", { "clip-path": `url(#${clipId})` }, svg);
    const bandD =
      fcst.map((f, i) => `${i ? "L" : "M"}${x(f.t)},${y(f.hi)}`).join("") +
      [...fcst].reverse().map((f) => `L${x(f.t)},${y(f.lo)}`).join("") + "Z";
    el("path", { class: "band", d: bandD }, gF);
    el("path", {
      class: "fcst",
      d: fcst.map((f, i) => `${i ? "L" : "M"}${x(f.t)},${y(f.mean)}`).join(""),
    }, gF);

    // Pontos observados
    const gObs = el("g", {}, svg);
    const dots = obs.map((v, t) => el("circle", { class: "obs", cx: x(t), cy: y(v), r: 4.5 }, gObs));

    // Tendência
    const trendPath = el("path", {
      class: "trend",
      d: trend.map((v, t) => `${t ? "L" : "M"}${x(t)},${y(v)}`).join(""),
    }, svg);

    // Rótulo final (só o valor que importa)
    const last = fcst[fcst.length - 1];
    const gEnd = el("g", {}, svg);
    el("circle", { class: "end-dot", cx: x(last.t), cy: y(last.mean), r: 5 }, gEnd);
    const endText = el("text", { class: "end-label", x: x(last.t) + 10, y: y(last.mean) - 2 }, gEnd);
    endText.textContent = fmt(last.mean);
    const endSub = el("tspan", { class: "sub", x: x(last.t) + 10, dy: 15 }, endText);
    endSub.textContent = monthLabel(last.t);

    // Camada de hover
    const gHover = el("g", {}, svg);
    gHover.style.display = "none";
    const cross = el("line", { class: "crosshair", y1: m.t, y2: m.t + ih }, gHover);
    const hTrend = el("circle", { class: "hover-dot", r: 5 }, gHover);
    const hObs = el("circle", { class: "hover-dot", r: 6 }, gHover);
    const hFcst = el("circle", { class: "hover-dot", r: 6 }, gHover);
    hTrend.style.fill = "var(--s-trend)";
    hObs.style.fill = "var(--s-obs)";
    hFcst.style.fill = "var(--s-fcst)";

    const overlay = el("rect", {
      x: m.l - 8, y: 0, width: W - m.l + 8, height: Ht, fill: "transparent",
    }, svg);
    overlay.style.cursor = "crosshair";

    root.insertBefore(svg, tooltip);

    state = { x, y, m, W, Ht, ih, gHover, cross, hTrend, hObs, hFcst, overlay };

    overlay.addEventListener("pointermove", (e) => {
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * W;
      const t = Math.round(((px - m.l) / iw) * (N + H - 1));
      showAt(Math.max(0, Math.min(N + H - 1, t)));
    });
    overlay.addEventListener("pointerleave", hide);

    if (hoverIdx !== null) showAt(hoverIdx);

    if (!animate) {
      gObs.setAttribute("opacity", "0.7");
      return;
    }

    // ---------- Sequência de entrada (um único momento orquestrado) ----------
    const ease = "cubic-bezier(0.22, 0.61, 0.36, 1)";
    const stagger = 26;

    gGrid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "linear" });

    dots.forEach((dot, i) => {
      dot.style.transformBox = "fill-box";
      dot.style.transformOrigin = "center";
      dot.animate(
        [
          { opacity: 0, transform: "translateY(-14px) scale(0.4)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 420, delay: 200 + i * stagger, easing: ease, fill: "backwards" }
      );
    });

    const tStart = 200 + N * stagger;
    const len = trendPath.getTotalLength();
    trendPath.style.strokeDasharray = `${len}`;
    trendPath.animate(
      [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration: 1100, delay: tStart, easing: ease, fill: "backwards" }
    ).finished.then(() => {
      trendPath.style.strokeDasharray = "";
    }).catch(() => {});

    // Dados observados ficam mais discretos quando a tendência aparece
    gObs.animate([{ opacity: 1 }, { opacity: 0.7 }], {
      duration: 700, delay: tStart + 300, easing: ease, fill: "forwards",
    });

    const fStart = tStart + 1000;
    const fullW = x(N + H - 1) - x(N - 1) + 40;
    const t0 = performance.now() + fStart;
    const tween = (now) => {
      if (!clipRect.isConnected) return;
      const p = Math.min(1, Math.max(0, (now - t0) / 900));
      const e = 1 - Math.pow(1 - p, 3);
      clipRect.setAttribute("width", fullW * e);
      if (p < 1) requestAnimationFrame(tween);
    };
    requestAnimationFrame(tween);

    gEnd.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 400, delay: fStart + 850, easing: "linear", fill: "backwards",
    });
  }

  function showAt(t) {
    if (!state) return;
    hoverIdx = t;
    const { x, y, W, gHover, cross, hTrend, hObs, hFcst } = state;
    const xp = x(t);

    gHover.style.display = "";
    cross.setAttribute("x1", xp);
    cross.setAttribute("x2", xp);

    const isObs = t < N;
    const f = fcstAt(t);
    toggleDot(hObs, isObs, xp, isObs ? y(obs[t]) : 0);
    toggleDot(hTrend, isObs, xp, isObs ? y(trend[t]) : 0);
    toggleDot(hFcst, !isObs, xp, f ? y(f.mean) : 0);

    const row = (cls, label, value) =>
      `<span class="row"><span class="key ${cls}"></span>${label}<b>${value}</b></span>`;

    tooltip.innerHTML = isObs
      ? `<strong>${monthLabel(t)}</strong>` +
        row("key--dot", "Observado", fmt(obs[t])) +
        row("key--line", "Tendência", fmt(trend[t])) +
        row("", "Resíduo", (obs[t] - trend[t] > 0 ? "+" : "") + fmt(obs[t] - trend[t]))
      : `<strong>${monthLabel(t)} · previsão</strong>` +
        row("key--dash", "Esperado", fmt(f.mean)) +
        row("", "IC 95%", `${fmt(f.lo)} a ${fmt(f.hi)}`);

    const tipW = tooltip.offsetWidth;
    const tipH = tooltip.offsetHeight;
    const anchorY = isObs ? y(obs[t]) : y(f.mean);
    let left = xp + 16;
    if (left + tipW > W) left = xp - tipW - 16;
    let top = anchorY - tipH / 2;
    top = Math.max(0, Math.min(state.Ht - tipH, top));
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

  // Teclado: setas percorrem os meses
  root.addEventListener("keydown", (e) => {
    const cur = hoverIdx ?? N - 1;
    const map = { ArrowLeft: cur - 1, ArrowRight: cur + 1, Home: 0, End: N + H - 1 };
    if (e.key in map) {
      e.preventDefault();
      showAt(Math.max(0, Math.min(N + H - 1, map[e.key])));
    } else if (e.key === "Escape") {
      hide();
    }
  });
  root.addEventListener("focus", () => showAt(hoverIdx ?? N - 1));
  root.addEventListener("blur", hide);

  // ---------------- Tabela (modo "mostrar como tabela") ----------------
  function buildTable() {
    const head = `<thead><tr><th scope="col">Mês</th><th scope="col">Observado</th><th scope="col">Tendência</th><th scope="col">Previsão</th><th scope="col">IC 95%</th></tr></thead>`;
    const rows = [];
    for (let t = 0; t < N + H; t++) {
      const f = t >= N ? fcstAt(t) : null;
      rows.push(
        `<tr class="${f ? "is-forecast" : ""}"><td>${monthLabel(t)}</td>` +
          `<td>${f ? "—" : fmt(obs[t])}</td>` +
          `<td>${f ? "—" : fmt(trend[t])}</td>` +
          `<td>${f ? fmt(f.mean) : "—"}</td>` +
          `<td>${f ? `${fmt(f.lo)} a ${fmt(f.hi)}` : "—"}</td></tr>`
      );
    }
    table.insertAdjacentHTML("beforeend", head + `<tbody>${rows.join("")}</tbody>`);
  }
  buildTable();

  tableToggle?.addEventListener("click", () => {
    const showTable = tableToggle.getAttribute("aria-pressed") !== "true";
    tableToggle.setAttribute("aria-pressed", String(showTable));
    tableToggle.setAttribute("aria-label", showTable ? "Mostrar como gráfico" : "Mostrar como tabela");
    tableToggle.title = showTable ? "Mostrar como gráfico" : "Mostrar como tabela";
    tableToggle.querySelector("i").className = showTable ? "bx bx-line-chart" : "bx bx-table";
    tableWrap.hidden = !showTable;
    root.hidden = showTable;
    if (!showTable) render(false);
  });

  replayBtn?.addEventListener("click", () => {
    hide();
    if (root.hidden) tableToggle.click();
    render(!motionQuery.matches);
  });

  // ---------------- Inicialização ----------------
  // A animação só começa quando o gráfico aparece na tela (no celular ele
  // fica abaixo da dobra); depois disso, redimensionar só redesenha.
  let started = false;
  let raf = 0;
  let lastSize = "";

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (!started || root.hidden) return;
      const size = `${root.clientWidth}x${root.clientHeight}`;
      if (size === lastSize) return;
      lastSize = size;
      render(false);
    });
  });

  const begin = () => {
    if (started) return;
    started = true;
    lastSize = `${root.clientWidth}x${root.clientHeight}`;
    render(!motionQuery.matches);
    ro.observe(root);
  };

  const watch = () => {
    if (!("IntersectionObserver" in window)) return begin();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          begin();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(root);
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(watch);
  } else {
    watch();
  }
})();
