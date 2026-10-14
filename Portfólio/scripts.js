// ============================================================
// CONFIGURACOES
// ============================================================

document.documentElement.classList.add("js");

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
    problem: "Identificar transações com maior risco de fraude em cartões de crédito.",
    approach:
      "Análise exploratória, preparação dos dados e comparação entre Logistic Regression e Random Forest, com apoio visual em Power BI.",
    result:
      "Uma base analítica que ajuda a interpretar padrões de fraude e avaliar o desempenho dos modelos.",
    image: "ImgProjeto/ML-BI.png",
    tags: ["Machine Learning", "Scikit-Learn", "Python", "Power BI"],
    category: ["ml", "analise"],
    github: "https://github.com/GabrielProzin/credit-card-fraud-detection-ml-bi",
    live: "",
  },
  {
    title: "Dashboard de Mercado de Ações",
    problem: "Organizar dados do mercado acionário para facilitar comparações e leitura de tendências.",
    approach:
      "Tratamento e estruturação de bases reais da NASDAQ e dashboards no Power BI com foco em análise temporal e comparação entre ativos.",
    result: "Uma visualização clara para apoiar a exploração dos dados e a tomada de decisão.",
    image: "ImgProjeto/DashboardAnaliticoMercadoAcoes.png",
    tags: ["Power BI", "Time Intelligence", "Data Analysis"],
    category: "analise",
    github: "https://github.com/GabrielProzin/Projetos-Power-BI",
    live: "",
  },
  /* {
    title: "Imersão Back-End",
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
        <p>Selecione "Todos" para ver os projetos publicados.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((project, i) => {
    const card = document.createElement("article");
    card.className = "tile project-item";

    const techTags = project.tags.map((t) => `<li>${t}</li>`).join("");

    const badges = asArray(project.category)
      .map(
        (c) =>
          `<span class="category-badge" style="--badge: ${filterColors[c] || "var(--muted)"}">${filterLabels[c] || c}</span>`
      )
      .join("");

    let linksHtml = "";
    if (project.github) {
      linksHtml += `<a class="btn btn--ghost btn--sm" href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="bx bxl-github"></i> Ver no GitHub</a>`;
    }
    if (project.live) {
      linksHtml += `<a class="btn btn--ghost btn--sm" href="${project.live}" target="_blank" rel="noopener noreferrer"><i class="bx bx-link-external"></i> Ver online</a>`;
    }

    card.innerHTML = `
      <div class="tile__head">
        <div>
          <h3 class="tile__title">${project.title}</h3>
          <div class="project-badges">${badges}</div>
        </div>
        <div class="tile__actions">
          <button type="button" class="icon-btn focus-btn" title="Modo foco" aria-label="Ampliar imagem de ${project.title}">
            <i class="bx bx-expand-alt"></i>
          </button>
        </div>
      </div>
      <div class="project-media">
        <img src="${project.image}" alt="Captura do projeto ${project.title}" class="project-thumbnail" loading="lazy" />
      </div>
      <div class="project-body">
        <dl class="psr">
          <div><dt>Problema</dt><dd>${project.problem}</dd></div>
          <div><dt>Abordagem</dt><dd>${project.approach}</dd></div>
          <div><dt>Resultado</dt><dd>${project.result}</dd></div>
        </dl>
        <ul class="tech-list" aria-label="Tecnologias">${techTags}</ul>
        <div class="project-links">${linksHtml}</div>
      </div>
    `;

    projectList.appendChild(card);

    // transição que mostra o que mudou ao filtrar
    if (!prefersReducedMotion() && card.animate) {
      card.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 320, delay: i * 70, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "backwards" }
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
  if (pagePos) pagePos.textContent = `Página ${index + 1} de ${tabs.length}`;
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
// PIPELINE (revela uma vez ao entrar na tela)
// ============================================================

const pipeline = document.getElementById("pipeline");
if (pipeline && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pipeline.classList.add("is-visible");
          io.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  io.observe(pipeline);
} else {
  pipeline?.classList.add("is-visible");
}

// ============================================================
// MODAL DE IMAGEM (modo foco)
// ============================================================

const imageModal = document.getElementById("image-modal");
const modalImage = imageModal?.querySelector("img");
const modalTitle = document.getElementById("image-modal-title");
const modalClose = document.getElementById("image-modal-close");
let lastFocusedElement = null;

function openImageModal(src, alt, title) {
  if (!imageModal || !modalImage) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = src;
  modalImage.alt = alt || "Imagem ampliada do projeto";
  if (modalTitle) modalTitle.textContent = title || "Projeto";
  imageModal.classList.add("show");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose?.focus();
}

function closeImageModal() {
  if (!imageModal || !modalImage || !imageModal.classList.contains("show")) {
    return;
  }

  imageModal.classList.remove("show");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  setTimeout(() => {
    modalImage.src = "";
  }, 200);
  lastFocusedElement?.focus?.();
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".project-item");
  if (card && (e.target.matches(".project-thumbnail") || e.target.closest(".focus-btn"))) {
    const img = card.querySelector(".project-thumbnail");
    openImageModal(img.src, img.alt, card.querySelector(".tile__title")?.textContent);
  }

  if (e.target === imageModal || e.target.closest("#image-modal-close")) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeImageModal();
  }
  // mantém o foco dentro do modal
  if (e.key === "Tab" && imageModal?.classList.contains("show")) {
    e.preventDefault();
    modalClose?.focus();
  }
});

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
