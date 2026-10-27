// Comportamento do portfólio. Tudo funciona sem animação; com prefers-reduced-motion as entradas somem e o conteúdo fica.
(function () {
  const T = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  const lang = () => (window.I18N ? window.I18N.lang : "pt");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- entradas ao rolar (uma vez só; nada fica escondido se o observador falhar) ----------
  document.querySelectorAll(".run").forEach((run) => run.querySelectorAll("img").forEach((img, k) => img.style.setProperty("--k", k)));
  document.querySelectorAll(".board .tile").forEach((t, k) => t.style.setProperty("--k", k));
  document.querySelectorAll(".ledger__row").forEach((r, k) => r.style.setProperty("--d", `${(k % 2) * 80}ms`));
  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
    window.addEventListener("load", () => setTimeout(() => {
      reveals.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("is-in"); });
    }, 2500));
  } else reveals.forEach((el) => el.classList.add("is-in"));

  // ---------- faixa da primeira tela: a tela do meio acende e dá o título ----------
  const strip = document.getElementById("strip");
  const caption = document.getElementById("strip-caption");
  if (strip) {
    const frames = [...strip.querySelectorAll(".strip__frame")];
    let atual = null;
    const marcar = () => {
      const meio = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      let melhor = frames[0], dist = Infinity;
      for (const f of frames) {
        const r = f.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - meio);
        if (d < dist) { dist = d; melhor = f; }
      }
      if (melhor !== atual) {
        atual?.classList.remove("is-center");
        melhor.classList.add("is-center");
        atual = melhor;
        caption.textContent = melhor.dataset.title || "";
      }
      const x = Math.max(0, melhor.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.offsetLeft);
      caption.style.setProperty("--cap-x", `${Math.min(x, document.documentElement.clientWidth * 0.6)}px`);
    };
    const lit = strip.querySelector(".strip__frame--lit");
    const centrar = () => {
      if (!lit) return;
      strip.scrollLeft = lit.offsetLeft - (strip.clientWidth - lit.offsetWidth) / 2;
      marcar();
    };
    let pedido = 0;
    strip.addEventListener("scroll", () => { cancelAnimationFrame(pedido); pedido = requestAnimationFrame(marcar); }, { passive: true });
    window.addEventListener("resize", () => { cancelAnimationFrame(pedido); pedido = requestAnimationFrame(marcar); });
    strip.querySelectorAll("img, video").forEach((m) => m.addEventListener("load", marcar, { once: true }));
    window.addEventListener("load", centrar);
    centrar();
    document.addEventListener("langchange", () => { atual = null; marcar(); });
    arrastar(strip);
    const video = strip.querySelector("video");
    if (video && reduce) { video.removeAttribute("autoplay"); video.pause(); }
  }

  // ---------- arrastar as faixas com o mouse (no toque e no teclado já rolam sozinhas) ----------
  function arrastar(el) {
    let x0 = 0, s0 = 0, ativo = false, moveu = false;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      ativo = true; moveu = false; x0 = e.clientX; s0 = el.scrollLeft;
    });
    el.addEventListener("pointermove", (e) => {
      if (!ativo) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4 && !moveu) { moveu = true; el.classList.add("is-dragging"); el.setPointerCapture(e.pointerId); }
      if (moveu) el.scrollLeft = s0 - dx;
    });
    const fim = () => { ativo = false; el.classList.remove("is-dragging"); };
    el.addEventListener("pointerup", fim);
    el.addEventListener("pointercancel", fim);
    el.addEventListener("click", (e) => { if (moveu) { e.preventDefault(); e.stopPropagation(); moveu = false; } }, true);
  }
  document.querySelectorAll(".run__frames").forEach(arrastar);

  // ---------- filtros dos projetos ----------
  const botoes = document.querySelectorAll(".work__filters button");
  botoes.forEach((b) => b.addEventListener("click", () => {
    botoes.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.filter;
    document.querySelectorAll(".run").forEach((run) => { run.hidden = f !== "todos" && !run.dataset.kind.split(" ").includes(f); });
    const funil = document.getElementById("funil");
    if (funil) funil.hidden = f === "web";
  }));

  // ---------- o funil: desligar um filtro devolve as vagas que ele cortou ----------
  const funil = document.getElementById("funil");
  if (funil) {
    const num = document.getElementById("funnel-num");
    const label = document.getElementById("funnel-label");
    const caixas = funil.querySelectorAll("input[type=checkbox]");
    const fmt = (n) => n.toLocaleString(lang() === "en" ? "en-US" : "pt-BR");
    let mostrado = 5;
    const contar = (alvo) => {
      if (reduce) { num.textContent = fmt(alvo); mostrado = alvo; return; }
      const de = mostrado, t0 = performance.now(), dur = 520;
      const passo = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        num.textContent = fmt(Math.round(de + (alvo - de) * e));
        if (p < 1) requestAnimationFrame(passo); else mostrado = alvo;
      };
      requestAnimationFrame(passo);
    };
    const atualizar = () => {
      let n = 5, desligados = 0;
      caixas.forEach((c) => { c.closest("tr").classList.toggle("is-off", !c.checked); if (!c.checked) { n += +c.dataset.cut; desligados++; } });
      label.textContent = desligados ? T("f.maybe") : T("f.left");
      contar(n);
    };
    caixas.forEach((c) => c.addEventListener("change", atualizar));
    document.addEventListener("langchange", () => { num.textContent = fmt(mostrado); const d = [...caixas].some((c) => !c.checked); label.textContent = d ? T("f.maybe") : T("f.left"); });
  }

  // ---------- ficha de cada projeto ----------
  const sheet = document.getElementById("sheet");
  let origem = null;
  function abrir(id, de) {
    const p = window.PROJETOS?.[id];
    if (!p || !sheet) return;
    const tx = p[lang()] || p.pt;
    document.getElementById("sheet-title").textContent = tx.title;
    const quadros = document.getElementById("sheet-frames");
    quadros.innerHTML = "";
    document.querySelector(`.run[data-project="${id}"] .run__frames`)?.querySelectorAll("img").forEach((img) => {
      const c = img.cloneNode(); c.removeAttribute("loading"); c.style.removeProperty("--k"); quadros.appendChild(c);
    });
    const dl = document.getElementById("sheet-text");
    dl.innerHTML = "";
    [["sheet.summary", tx.summary], ["sheet.problem", tx.problem], ["sheet.approach", tx.approach], ["sheet.result", tx.result]].forEach(([k, v]) => {
      if (!v) return;
      const dt = document.createElement("dt"); dt.textContent = T(k);
      const dd = document.createElement("dd"); dd.textContent = v;
      dl.append(dt, dd);
    });
    const tags = document.getElementById("sheet-tags");
    tags.textContent = p.tags.join(", ") + ". ";
    if (p.github) {
      const a = document.createElement("a");
      a.href = p.github; a.target = "_blank"; a.rel = "noopener noreferrer"; a.className = "link-plain";
      a.textContent = T("sheet.github");
      tags.appendChild(a);
    }
    origem = de;
    sheet.showModal();
    sheet.scrollTop = 0;
  }
  document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => abrir(b.dataset.open, b)));
  document.getElementById("sheet-close")?.addEventListener("click", () => sheet.close());
  sheet?.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
  sheet?.addEventListener("close", () => origem?.focus());

  // ---------- faixa do contato: duas cópias para o desfile não ter emenda ----------
  const trilho = document.querySelector(".marquee__track");
  if (trilho && !reduce) trilho.append(...[...trilho.children].map((n) => n.cloneNode(true)));

  // ---------- formulário (EmailJS) ----------
  const EMAILJS = { publicKey: "s7eWkxR-sAUpWSHJh", serviceId: "service_ghp9z7o", templateId: "service_ghp9z7o" };
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-message");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (document.getElementById("honeypot").value.trim()) { status.textContent = T("form.blocked"); return; }
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("message").value.trim();
    const erros = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) erros.push(T("form.email"));
    if (msg.length < 10 || msg.length > 300) erros.push(T("form.msg"));
    if (erros.length) { status.textContent = T("form.check", { list: erros.join(" e ") }); return; }
    if (!window.emailjs) { status.textContent = T("form.error"); return; }
    const botao = form.querySelector(".cell--send");
    botao.disabled = true; status.textContent = T("form.sending");
    try {
      emailjs.init(EMAILJS.publicKey);
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { user_name: email, user_email: email, message: msg });
      status.textContent = T("form.sent");
      form.reset();
    } catch (err) {
      status.textContent = T("form.error");
    } finally {
      botao.disabled = false;
    }
  });

  // ---------- copiar email, hora de Goiânia e ano ----------
  const copiar = document.getElementById("copy-email");
  copiar?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("gabrielalexandrino2004@gmail.com"); copiar.textContent = T("contact.copied"); }
    catch (e) { copiar.textContent = "gabrielalexandrino2004@gmail.com"; }
    setTimeout(() => { copiar.textContent = T("contact.copy"); }, 2200);
  });
  const relogio = document.getElementById("clock");
  const hora = () => {
    if (!relogio) return;
    relogio.textContent = new Intl.DateTimeFormat(lang() === "en" ? "en-GB" : "pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date());
  };
  hora(); setInterval(hora, 20000);
  const ano = document.getElementById("year");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
