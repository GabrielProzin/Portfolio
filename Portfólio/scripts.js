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

// ============================================================
// PROJETOS
// ============================================================

const projects = [
  {
    title: "Dashboard de Mercado de Ações",
    description:
      "Problema: organizar dados do mercado acionário para facilitar comparações e leitura de tendências. Abordagem: tratei e estruturei bases reais da NASDAQ e construí dashboards no Power BI com foco em análise temporal e comparação entre ativos. Resultado: uma visualização clara para apoiar a exploração dos dados e a tomada de decisão.",
    image: "ImgProjeto/DashboardAnaliticoMercadoAcoes.png",
    tags: ["Power BI", "Time Intelligence", "Data Analysis"],
    category: "analise",
    github: "https://github.com/GabrielProzin/Projetos-Power-BI",
    live: "",
  },
  {
    title: "Detecção de Fraudes",
    description:
      "Problema: identificar transações com maior risco de fraude em cartões de crédito. Abordagem: realizei análise exploratória, preparação dos dados e comparação entre modelos como Logistic Regression e Random Forest, com apoio visual em Power BI. Resultado: uma base analítica que ajuda a interpretar padrões de fraude e avaliar o desempenho dos modelos.",
    image: "ImgProjeto/ML-BI.png",
    tags: ["Machine Learning", "Scikit-Learn", "Python", "Power BI"],
    category: ["ml", "analise"],
    github: "https://github.com/GabrielProzin/credit-card-fraud-detection-ml-bi",
    live: "",
  },
  /* {
    title: "Imersao Back-End",
    description:
      "Servidores robustos com Node.js, Express e MongoDB, com rotas, middleware e integracao com IA para analise de imagens, alem de autenticacao JWT.",
    image: "ImgProjeto/imagem_2024-12-03_110024271.png",
    tags: ["Node.js", "Express", "MongoDB"],
    category: "web",
    github: "https://github.com/GabrielProzin/ImersaoBackEnd",
    live: "",
  }, */
];

// ============================================================
// SCROLL SNAP ANIMADO (Desktop)
// ============================================================

const sections = document.querySelectorAll("section");
let isDesktop = window.innerWidth > 992;
let isScrolling = false;
let currentSection = 0;

function getHeaderOffset() {
  const header = document.querySelector(".header");
  return header ? header.offsetHeight + 16 : 80;
}

function getDocumentTop(element) {
  return element.getBoundingClientRect().top + window.scrollY;
}

function getSectionTargetY(section) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const targetY = getDocumentTop(section) - getHeaderOffset();
  return Math.max(0, Math.min(targetY, maxScroll));
}

function getAnchorTargetY(targetSection) {
  if (targetSection?.id === "projects" && projectList) {
    const sectionTopY = getSectionTargetY(targetSection);
    const titleBlock = targetSection.querySelector(".section-title");
    const cards = Array.from(projectList.querySelectorAll(".project-item"));

    if (!titleBlock || cards.length === 0) {
      return sectionTopY;
    }

    const firstRowTop = getDocumentTop(cards[0]);
    const firstRowCards = cards.filter(
      (card) => Math.abs(getDocumentTop(card) - firstRowTop) < 8
    );

    const firstRowBottom = Math.max(
      ...firstRowCards.map((card) => getDocumentTop(card) + card.offsetHeight)
    );
    const viewportBottomTarget =
      firstRowBottom - window.innerHeight + 24;
    const extraOffset = window.innerHeight * -0.02;

    return Math.max(sectionTopY, viewportBottomTarget) + extraOffset;
  }

  if (targetSection?.id === "contact") {
    return getSectionTargetY(targetSection) + window.innerHeight * 0.08;
  }

  return getSectionTargetY(targetSection);
}

function getWheelTargetY(section) {
  return getAnchorTargetY(section);
}

function updateCurrentSection() {
  const scrollY = window.scrollY + getHeaderOffset() + window.innerHeight / 3;
  sections.forEach((section, i) => {
    const sectionTop = getDocumentTop(section);
    const sectionBottom = sectionTop + section.offsetHeight;

    if (
      scrollY >= sectionTop &&
      scrollY < sectionBottom
    ) {
      currentSection = i;
    }
  });
}

window.addEventListener("scroll", updateCurrentSection);
window.addEventListener("load", updateCurrentSection);

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function smoothScrollTo(targetY, duration = 700, callback) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      isScrolling = false;
      if (callback) callback();
    }
  }

  requestAnimationFrame(step);
}

if (isDesktop) {
  window.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (isScrolling) return;
      doScroll(e.deltaY > 0);
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    const tag = e.target.tagName.toLowerCase();

    if (tag === "input" || tag === "textarea") return;

    const keys = ["ArrowDown", "PageDown", "Space", " "];
    const keysUp = ["ArrowUp", "PageUp"];

    if (keys.includes(e.key)) {
      e.preventDefault();
      if (isScrolling) return;
      doScroll(true);
    } else if (keysUp.includes(e.key)) {
      e.preventDefault();
      if (isScrolling) return;
      doScroll(false);
    }
  });
}

function doScroll(goingDown) {
  const nextIndex = goingDown
    ? Math.min(currentSection + 1, sections.length - 1)
    : Math.max(currentSection - 1, 0);

  if (nextIndex === currentSection) return;

  isScrolling = true;
  currentSection = nextIndex;
  smoothScrollTo(getWheelTargetY(sections[nextIndex]), 700);
}

window.addEventListener("resize", () => {
  const wasDesktop = isDesktop;
  isDesktop = window.innerWidth > 992;
  updateCurrentSection();

  if (wasDesktop !== isDesktop) {
    location.reload();
  }
});

// ============================================================
// INICIALIZACAO
// ============================================================

emailjs.init(EMAIL_JS_CONFIG.publicKey);

const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");
const imageModal = document.getElementById("image-modal");
const modalImage = imageModal?.querySelector("img");
let lastFocusedElement = null;

function setMenuState(isOpen) {
  navbar.classList.toggle("active", isOpen);
  menuIcon.setAttribute("aria-expanded", String(isOpen));
}

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    const isOpen = !navbar.classList.contains("active");
    setMenuState(isOpen);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(link.getAttribute("href"));
    if (!targetSection) return;

    if (isScrolling) {
      isScrolling = false;
    }

    smoothScrollTo(getAnchorTargetY(targetSection), 700);

    if (link.closest(".navbar")) {
      setMenuState(false);
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navbar.classList.contains("active")) {
    setMenuState(false);
    menuIcon.focus();
  }
});

// ============================================================
// RENDERIZACAO DE PROJETOS
// ============================================================

const projectList = document.getElementById("project-list");

const filterLabels = {
  ml: "Machine Learning",
  analise: "Análise de Dados",
  web: "Web/Desenvolvimento",
};

function renderProjects(filter = "all") {
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(filter)
            : p.category === filter
        );

  projectList.innerHTML = "";

  if (filtered.length === 0) {
    projectList.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <i class="bx bx-bar-chart-alt-2" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <p style="font-size: 1.1rem;">Nenhum projeto nesta categoria ainda!</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Novos projetos serão adicionados em breve.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-item";
    card.dataset.category = project.category;

    const techTags = project.tags.map((t) => `<li>${t}</li>`).join("");

    let linksHtml = "";
    if (project.github) {
      linksHtml += `<a href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="bx bxl-github"></i> Ver no GitHub</a>`;
    }
    if (project.live) {
      linksHtml += `<a href="${project.live}" target="_blank" rel="noopener noreferrer"><i class="bx bx-link"></i> Ver Online</a>`;
    }

    const categoryBadges = Array.isArray(project.category)
      ? project.category
          .map((c) => `<span class="category-badge">${filterLabels[c] || c}</span>`)
          .join("")
      : `<span class="category-badge">${filterLabels[project.category] || project.category}</span>`;

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-thumbnail" loading="lazy" />
      <div class="project-details">
        <div class="project-header">
          <h3>${project.title}</h3>
          <div class="project-badges">
            ${categoryBadges}
          </div>
        </div>
        <p>${project.description}</p>
        <ul class="tech-list">${techTags}</ul>
        <div class="project-links">${linksHtml}</div>
      </div>
    `;

    projectList.appendChild(card);
  });
}

renderProjects();

document.querySelectorAll(".project-filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelector(".project-filters button.active")
      .classList.remove("active");
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

// ============================================================
// MODAL DE IMAGEM
// ============================================================

function openImageModal(src, alt) {
  if (!imageModal || !modalImage) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = src;
  modalImage.alt = alt || "Imagem ampliada do projeto";
  imageModal.classList.add("show");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeImageModal() {
  if (!imageModal || !modalImage || !imageModal.classList.contains("show")) {
    return;
  }

  imageModal.classList.remove("show");
  imageModal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".project-thumbnail")) {
    openImageModal(e.target.src, e.target.alt);
  }

  if (e.target === imageModal) {
    closeImageModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeImageModal();
  }
});

// ============================================================
// FORMULARIO DE CONTATO
// ============================================================

const contactForm = document.getElementById("contact-form");

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

    [nameField, emailField, messageField].forEach((f) =>
      f.classList.remove("error")
    );

    if (honeypot) {
      messageEl.textContent = "Envio bloqueado.";
      messageEl.className = "form-message error";
      return;
    }

    let hasError = false;

    if (!name || name.length < 2 || name.length > 50) {
      nameField.classList.add("error");
      hasError = true;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailField.classList.add("error");
      hasError = true;
    }

    if (!msg || msg.length < 10 || msg.length > 300) {
      messageField.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      messageEl.textContent = "Preencha os campos corretamente.";
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

      messageEl.textContent = "Mensagem enviada com sucesso!";
      messageEl.className = "form-message success";
      contactForm.reset();
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
      .then(() => showCopiedPopup("Copiado!"))
      .catch(console.error);
  });
}

function showCopiedPopup(text) {
  const popup = document.createElement("div");
  popup.textContent = text;
  popup.className = "copied-popup";
  copyEmailBtn.parentElement.appendChild(popup);

  requestAnimationFrame(() => popup.classList.add("show"));

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, POPUP_TIMEOUT);
}
