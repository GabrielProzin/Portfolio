// ============================================================
// MOVIMENTO — entrada do hero, revelação por scroll, contadores
// e barra de progresso. Só anima transform/opacity, usa
// IntersectionObserver e um único rAF por quadro.
// ============================================================

(function () {
  const root = document.documentElement;
  const reduceMotion = document.documentElement.classList.contains("motion-off");

  // ---------------- Nome letra a letra ----------------
  if (!reduceMotion) {
    let i = 0;
    document.querySelectorAll("[data-split]").forEach((line) => {
      const text = line.textContent.trim();
      line.textContent = "";
      line.setAttribute("aria-hidden", "true");
      for (const ch of text) {
        const span = document.createElement("span");
        span.className = "char";
        span.style.setProperty("--i", i++);
        span.textContent = ch;
        line.appendChild(span);
      }
    });
  }

  // ---------------- Entrada do hero ----------------
  // Espera as fontes para a animação não "pular" quando elas trocam.
  let ready = false;
  const start = () => {
    if (ready) return;
    ready = true;
    requestAnimationFrame(() => root.classList.add("is-ready"));
    // números do topo contam junto com a entrada
    setTimeout(() => document.querySelectorAll(".home [data-count]").forEach(countUp), reduceMotion ? 0 : 1100);
  };
  if (reduceMotion) {
    start();
  } else {
    document.fonts?.ready.then(start);
    setTimeout(start, 1200); // garantia caso as fontes demorem
  }

  // ---------------- Contadores ----------------
  const fmtNumber = (v, decimals) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = fmtNumber(target, decimals);
      return;
    }
    const duration = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      el.textContent = fmtNumber(target * eased, decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmtNumber(0, decimals);
    requestAnimationFrame(tick);
  }

  // ---------------- Revelação por scroll ----------------
  document.querySelectorAll(".chips").forEach((list) => {
    list.querySelectorAll("li").forEach((li, i) => li.style.setProperty("--ci", i));
  });

  const revealTargets = document.querySelectorAll("[data-reveal]");

  function reveal(el) {
    el.classList.add("is-in");
    el.querySelectorAll("[data-count]").forEach(countUp);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          reveal(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  // ---------------- Barra de progresso da página ----------------
  const bar = document.querySelector(".scroll-progress");
  let ticking = false;
  const updateBar = () => {
    ticking = false;
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateBar);
    },
    { passive: true }
  );
  window.addEventListener("resize", updateBar);
  updateBar();
  // ---------------- Faixa de ferramentas (ticker) ----------------
  const ticker = document.querySelector(".ticker");
  const track = ticker?.querySelector(".ticker__track");
  if (ticker && track && !reduceMotion) {
    // duplica os itens para o loop não ter emenda
    Array.from(track.children).forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
    const setSpeed = () => {
      const half = track.scrollWidth / 2;
      ticker.style.setProperty("--ticker-dur", `${Math.round(half / 45)}s`); // ~45 px/s
    };
    setSpeed();
    document.fonts?.ready.then(setSpeed);
    // só anima quando está na tela
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        ticker.classList.toggle("is-running", entries.some((e) => e.isIntersecting));
      }).observe(ticker);
    } else {
      ticker.classList.add("is-running");
    }
  }
})();
