// ============================================================
// CONFIGURACOES
// ============================================================


const EMAIL_JS_CONFIG = {
  publicKey: "s7eWkxR-sAUpWSHJh",
  serviceId: "service_ghp9z7o",
  templateId: "service_ghp9z7o",
};

const POPUP_TIMEOUT = 2000;
const GENERIC_FORM_ERROR =
  "Não foi possível enviar a mensagem agora. Tente novamente em alguns minutos ou use os links de contato.";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================================
// PROJETOS
// ============================================================

const projects = [
  {
    title: "Detecção de Fraudes",
    summary: "Modelos que apontam transações de cartão com maior risco de fraude.",
    problem: "Identificar transações com maior risco de fraude em cartões de crédito.",
    approach:
      "Análise exploratória, preparação dos dados e comparação entre Logistic Regression e Random Forest, com apoio visual em Power BI.",
    result:
      "Uma base analítica que ajuda a interpretar padrões de fraude e avaliar o desempenho dos modelos.",
    image: "ImgProjeto/ML-BI.png",
    tags: ["Python", "Scikit-Learn", "Power BI"],
    category: ["ml", "analise"],
    github: "https://github.com/GabrielProzin/credit-card-fraud-detection-ml-bi",
    live: "",
  },
  {
    title: "Mercado de Ações",
    summary: "Dashboard de tendências e comparação entre ativos da NASDAQ.",
    problem: "Organizar dados do mercado acionário para facilitar comparações e leitura de tendências.",
    approach:
      "Tratamento e estruturação de bases reais da NASDAQ e dashboards no Power BI com foco em análise temporal e comparação entre ativos.",
    result: "Uma visualização clara para apoiar a exploração dos dados e a tomada de decisão.",
    image: "ImgProjeto/DashboardAnaliticoMercadoAcoes.png",
    tags: ["Power BI", "DAX", "Time Intelligence"],
    category: "analise",
    github: "https://github.com/GabrielProzin/Projetos-Power-BI",
    live: "",
  },
  /* {
    title: "Imersão Back-End",
    summary: "API em Node.js com autenticação e análise de imagens por IA.",
    problem: "Construir uma API completa do zero.",
    approach: "Node.js, Express e MongoDB, com rotas, middlewares, autenticação JWT e integração com IA para análise de imagens.",
    result: "Um servidor robusto pronto para receber um front-end.",
    image: "ImgProjeto/imagem_2024-12-03_110024271.png",
    tags: ["Node.js", "Express", "MongoDB"],
    category: "web",
    github: "https://github.com/GabrielProzin/ImersaoBackEnd",
    live: "",
  }, */
];

const filterLabels = {
  ml: "Machine Learning",
  analise: "Análise de Dados",
  web: "Web/Desenvolvimento",
};

// cor fixa por categoria (a cor segue a entidade, não a posição)
const filterColors = {
  ml: "var(--s-trend)",
  analise: "var(--s-obs)",
  web: "var(--s-fcst)",
};

const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");

const asArray = (v) => (Array.isArray(v) ? v : [v]);

function renderProjects(filter = "all") {
  const filtered =
    filter === "all" ? projects : projects.filter((p) => asArray(p.category).includes(filter));

  projectList.innerHTML = "";
  projectCount.textContent =
    filtered.length === 1 ? "1 projeto" : `${filtered.length} projetos`;

  if (filtered.length === 0) {
    projectList.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-bar-chart-alt-2" aria-hidden="true"></i>
        <p>Nenhum projeto nesta categoria por enquanto.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((project, i) => {
    const card = document.createElement("article");
    card.className = "tile project-item spot";
    card.dataset.index = String(projects.indexOf(project));

    const badges = asArray(project.category)
      .map(
        (c) =>
          `<span class="category-badge" style="--badge: ${filterColors[c] || "var(--muted)"}">${filterLabels[c] || c}</span>`
      )
      .join("");

    card.innerHTML = `
      <button type="button" class="project-media" aria-label="Ver detalhes de ${project.title}">
        <img src="${project.image}" alt="" class="project-thumbnail" loading="lazy" />
        <span class="project-media__hint"><i class="bx bx-expand-alt" aria-hidden="true"></i> Detalhes</span>
      </button>
      <div class="project-body">
        <div class="project-badges">${badges}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <div class="project-foot">
          <ul class="tech-list" aria-label="Tecnologias">${project.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
          ${project.github ? `<a class="icon-btn" href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="${project.title} no GitHub"><i class="bx bxl-github"></i></a>` : ""}
        </div>
      </div>
    `;

    projectList.appendChild(card);

    if (!prefersReducedMotion() && card.animate) {
      card.animate(
        [
          { opacity: 0, transform: "translateY(16px) scale(0.98)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 500, delay: i * 90, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
      );
    }
  });
}

renderProjects();

document.querySelectorAll(".project-filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const current = document.querySelector(".project-filters button.active");
    if (current === btn) return;
    current.classList.remove("active");
    current.setAttribute("aria-pressed", "false");
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    renderProjects(btn.dataset.filter);
  });
});

// ============================================================
// ABAS DE PÁGINA (acompanham a rolagem)
// ============================================================

const tabs = Array.from(document.querySelectorAll(".page-tab"));
const tabIndicator = document.querySelector(".page-tabs__indicator");
const pagePos = document.getElementById("page-pos");
const pages = tabs.map((t) => document.querySelector(t.getAttribute("href")));

function setActiveTab(index) {
  tabs.forEach((tab, i) => {
    if (i === index) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  const tab = tabs[index];
  if (tab && tabIndicator) {
    tabIndicator.style.setProperty("--x", `${tab.offsetLeft}px`);
    tabIndicator.style.setProperty("--w", `${tab.offsetWidth}px`);
  }
  if (pagePos) pagePos.textContent = `Página ${index + 1} de ${tabs.length}`; // opcional
}

function updateActiveFromScroll() {
  // a página ativa é a que cruza a linha a 40% da altura da tela
  const line = window.innerHeight * 0.4;
  let active = 0;
  pages.forEach((page, i) => {
    if (page && page.getBoundingClientRect().top <= line) active = i;
  });
  // no fim da página, a última aba fica ativa
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    active = pages.length - 1;
  }
  setActiveTab(active);
}

let scrollTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateActiveFromScroll();
      scrollTicking = false;
    });
  },
  { passive: true }
);
window.addEventListener("resize", updateActiveFromScroll);
window.addEventListener("load", updateActiveFromScroll);
document.fonts?.ready.then(updateActiveFromScroll);
updateActiveFromScroll();

// ============================================================
// MODAL DE PROJETO (abre a partir do card)
// ============================================================

const imageModal = document.getElementById("image-modal");
const modalFrame = imageModal?.querySelector(".image-modal__frame");
const modalImage = imageModal?.querySelector("img");
const modalTitle = document.getElementById("image-modal-title");
const modalInfo = document.getElementById("image-modal-info");
const modalClose = document.getElementById("image-modal-close");
let lastFocusedElement = null;
let originRect = null;

function openProjectModal(project, fromEl) {
  if (!imageModal) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = project.image;
  modalImage.alt = `Captura do projeto ${project.title}`;
  modalTitle.textContent = project.title;
  modalInfo.innerHTML = `
    <dl class="psr">
      <div><dt>Problema</dt><dd>${project.problem}</dd></div>
      <div><dt>Abordagem</dt><dd>${project.approach}</dd></div>
      <div><dt>Resultado</dt><dd>${project.result}</dd></div>
    </dl>
    <div class="project-links">
      ${project.github ? `<a class="btn btn--primary btn--sm" href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="bx bxl-github"></i> Ver no GitHub</a>` : ""}
      ${project.live ? `<a class="btn btn--ghost btn--sm" href="${project.live}" target="_blank" rel="noopener noreferrer"><i class="bx bx-link-external"></i> Ver online</a>` : ""}
    </div>
  `;

  imageModal.classList.add("show");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  // o modal "cresce" a partir da imagem do card (técnica FLIP)
  originRect = fromEl?.getBoundingClientRect() || null;
  if (originRect && !prefersReducedMotion() && modalFrame.animate) {
    const to = modalFrame.getBoundingClientRect();
    const sx = originRect.width / to.width;
    const sy = originRect.height / to.height;
    const dx = originRect.left - to.left;
    const dy = originRect.top - to.top;
    modalFrame.animate(
      [
        { transformOrigin: "top left", transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6 },
        { transformOrigin: "top left", transform: "none", opacity: 1 },
      ],
      { duration: 480, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    modalInfo.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], {
      duration: 400, delay: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards",
    });
  }
  modalClose?.focus();
}

function closeImageModal() {
  if (!imageModal || !imageModal.classList.contains("show")) return;

  imageModal.classList.remove("show");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  setTimeout(() => {
    if (!imageModal.classList.contains("show")) modalImage.src = "";
  }, 250);
  lastFocusedElement?.focus?.();
}

document.addEventListener("click", (e) => {
  const media = e.target.closest(".project-media");
  if (media) {
    const card = media.closest(".project-item");
    openProjectModal(projects[Number(card.dataset.index)], media);
  }

  if (e.target === imageModal || e.target.closest("#image-modal-close")) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (!imageModal?.classList.contains("show")) return;
  if (e.key === "Escape") closeImageModal();
  // mantém o foco dentro do modal
  if (e.key === "Tab") {
    const focusables = Array.from(imageModal.querySelectorAll("button, a[href]"));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ============================================================
// SPOTLIGHT NOS TILES (segue o ponteiro, só em mouse)
// ============================================================

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion()) {
  let spotRaf = 0;
  let spotEvent = null;
  document.addEventListener(
    "pointermove",
    (e) => {
      spotEvent = e;
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(() => {
        spotRaf = 0;
        const tile = spotEvent.target.closest?.(".spot");
        if (!tile) return;
        const r = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", `${spotEvent.clientX - r.left}px`);
        tile.style.setProperty("--my", `${spotEvent.clientY - r.top}px`);
      });
    },
    { passive: true }
  );
}

// ============================================================
// FORMULARIO DE CONTATO
// ============================================================

if (window.emailjs) {
  emailjs.init(EMAIL_JS_CONFIG.publicKey);
}

const contactForm = document.getElementById("contact-form");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");

if (messageInput && charCount) {
  messageInput.addEventListener("input", () => {
    charCount.textContent = `${messageInput.value.length}/300`;
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageEl = document.getElementById("form-message");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const honeypotField = document.getElementById("honeypot");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const msg = messageField.value.trim();
    const honeypot = honeypotField.value.trim();

    [nameField, emailField, messageField].forEach((f) => {
      f.classList.remove("error");
      f.removeAttribute("aria-invalid");
    });

    if (honeypot) {
      messageEl.textContent = "Envio bloqueado.";
      messageEl.className = "form-message error";
      return;
    }

    const problems = [];

    if (!name || name.length < 2 || name.length > 50) {
      nameField.classList.add("error");
      nameField.setAttribute("aria-invalid", "true");
      problems.push("nome com pelo menos 2 letras");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailField.classList.add("error");
      emailField.setAttribute("aria-invalid", "true");
      problems.push("um e-mail válido");
    }

    if (!msg || msg.length < 10 || msg.length > 300) {
      messageField.classList.add("error");
      messageField.setAttribute("aria-invalid", "true");
      problems.push("mensagem entre 10 e 300 caracteres");
    }

    if (problems.length) {
      messageEl.textContent = `Confira: ${problems.join(", ")}.`;
      messageEl.className = "form-message error";
      contactForm.querySelector(".error")?.focus();
      return;
    }

    if (!window.emailjs) {
      messageEl.textContent = GENERIC_FORM_ERROR;
      messageEl.className = "form-message error";
      return;
    }

    messageEl.textContent = "Enviando...";
    messageEl.className = "form-message info";

    try {
      await emailjs.send(EMAIL_JS_CONFIG.serviceId, EMAIL_JS_CONFIG.templateId, {
        from_name: name,
        reply_to: email,
        message: msg,
      });

      messageEl.textContent = "Mensagem enviada. Obrigado pelo contato!";
      messageEl.className = "form-message success";
      contactForm.reset();
      if (charCount) charCount.textContent = "0/300";
    } catch (error) {
      console.error("Erro EmailJS:", error);
      messageEl.textContent = GENERIC_FORM_ERROR;
      messageEl.className = "form-message error";
    }
  });
}

// ============================================================
// COPIAR EMAIL
// ============================================================

const copyEmailBtn = document.getElementById("copy-email");
const emailText = document.getElementById("user-email");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(emailText.textContent)
      .then(() => showCopiedPopup("Copiado"))
      .catch(console.error);
  });
}

function showCopiedPopup(text) {
  const popup = document.createElement("div");
  popup.textContent = text;
  popup.className = "copied-popup";
  popup.setAttribute("role", "status");
  copyEmailBtn.parentElement.appendChild(popup);

  requestAnimationFrame(() => popup.classList.add("show"));

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, POPUP_TIMEOUT);
}

// ============================================================
// RODAPÉ
// ============================================================

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
