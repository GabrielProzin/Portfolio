// ============================================================
// CONFIGURAÇÕES
// ============================================================

const EMAIL_JS_CONFIG = {
  publicKey: "s7eWkxR-sAUpWSHJh",
  serviceId: "service_ghp9z7o",
  templateId: "service_ghp9z7o",
};

const POPUP_TIMEOUT = 2000;

// ============================================================
// PROJETOS — adicione/remova projetos aqui para atualizar
//
// category: "ml" | "analise" | "web"
// ============================================================

const projects = [

  {
    title: "Dashboard Analítico do Mercado de Ações com Narrativa Inteligente",
    description: "Projeto analisando o mercado de ações direto da NASDAQ em um período específico de uma das maiores empresas do mundo, como IBM, Microsoft e Tesla.",
    image: "ImgProjeto/DashboardAnaliticoMercadoAcoes.png",
    tags: ["Power BI, Time Intelligence"],
    category: "analise",
    github: "https://github.com/GabrielProzin/Projetos-Power-BI",
    live: "",
  },

  // {
  //   title: "Clone TabNews",
  //   description: `Projeto que recria as funcionalidades do <a href="https://tabnews.com.br" target="_blank" rel="noopener noreferrer" class="tabnews-link">TabNews</a>, com publicação de conteúdo, autenticação e gerenciamento de permissões. Foi um marco na minha trajetória em desenvolvimento.`,
  //   image: "ImgProjeto/CloneTabNews.png",
  //   tags: ["React", "JavaScript", "API Rest"],
  //   category: "web",
  //   github: "https://github.com/GabrielProzin/clone-tabnews",
  //   live: "https://prowulf.com.br",
  // },
  {
    title: "Imersão Back-End",
    description: "Servidores robustos com Node.js, Express e MongoDB, com rotas, middleware e integração com IA para análise de imagens, além de autenticação JWT. Projeto que fortaleceu minha base em back-end para sistemas de dados.",
    image: "ImgProjeto/imagem_2024-12-03_110024271.png",
    tags: ["Node.js", "Express", "MongoDB"],
    category: "web",
    github: "https://github.com/GabrielProzin/ImersaoBackEnd",
    live: "",
  },
  // ======================================================
  // Adicione novos projetos de Ciência de Dados abaixo.
  // Exemplo:
  // {
  //   title: "Previsão de Churn",
  //   description: "Modelo de ML para prever churn de clientes usando Random Forest.",
  //   image: "ImgProjeto/churn.png",
  //   tags: ["Python", "Scikit-learn", "Random Forest"],
  //   category: "ml",
  //   github: "https://github.com/...",
  //   live: "",
  // },
  // ======================================================
];

// ============================================================
// SCROLL SNAP ANIMADO (Desktop) — transição suave entre seções
// ============================================================

const sections = document.querySelectorAll("section");
let isDesktop = window.innerWidth > 992;
let isScrolling = false;
let currentSection = 0;
let scrollTimeout;

// Inicializa o índice da seção visível
function updateCurrentSection() {
  const scrollY = window.scrollY + window.innerHeight / 2;
  sections.forEach((section, i) => {
    if (
      scrollY >= section.offsetTop &&
      scrollY < section.offsetTop + section.offsetHeight
    ) {
      currentSection = i;
    }
  });
}

window.addEventListener("scroll", updateCurrentSection);
window.addEventListener("load", updateCurrentSection);

// Easing ease-out
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
  smoothScrollTo(sections[nextIndex].offsetTop, 700);
}

// Responsivo: recria o listener ou remove conforme o tamanho
window.addEventListener("resize", () => {
  const wasDesktop = isDesktop;
  isDesktop = window.innerWidth > 992;
  updateCurrentSection();

  // Se mudou de mobile para desktop, recarrega para aplicar o wheel
  if (wasDesktop !== isDesktop) {
    location.reload();
  }
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

emailjs.init(EMAIL_JS_CONFIG.publicKey);

// Menu mobile
const menuIcon = document.getElementById("menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

// Rolagem suave
document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
    navbar.classList.remove("active");
    menuIcon.classList.remove("active");
  });
});

// ============================================================
// RENDERIZAÇÃO DE PROJETOS
// ============================================================

const projectList = document.getElementById("project-list");

const filterLabels = {
  ml: "Machine Learning",
  analise: "Análise de Dados"
//  web: "Web/Desenvolvimento",
};

function renderProjects(filter = "all") {
  const filtered = filter === "all"
    ? projects
    : projects.filter((p) => p.category === filter);

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

    const categoryLabel = filterLabels[project.category] || project.category;

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-thumbnail" loading="lazy" />
      <div class="project-details">
        <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
          <h3>${project.title}</h3>
          <span style="font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 6px; background: rgba(100,255,218,0.08); color: var(--text-muted); border: 1px solid rgba(100,255,218,0.1);">${categoryLabel}</span>
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

// Filtros
document.querySelectorAll(".project-filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".project-filters button.active").classList.remove("active");
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  });
});

// ============================================================
// MODAL DE IMAGEM
// ============================================================

const imageModal = document.getElementById("image-modal");

document.addEventListener("click", (e) => {
  if (e.target.matches(".project-thumbnail")) {
    imageModal.querySelector("img").src = e.target.src;
    imageModal.classList.add("show");
  }
  if (e.target === imageModal) {
    imageModal.classList.remove("show");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") imageModal.classList.remove("show");
});

// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageEl = document.getElementById("form-message");
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const msg = messageField.value.trim();

    [nameField, emailField, messageField].forEach((f) => f.classList.remove("error"));

    let hasError = false;
    if (!name || name.length < 2 || name.length > 50) { nameField.classList.add("error"); hasError = true; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailField.classList.add("error"); hasError = true; }
    if (!msg || msg.length < 10 || msg.length > 300) { messageField.classList.add("error"); hasError = true; }

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
  messageEl.textContent = `Erro ao enviar: ${error?.text || error?.message || "Tente novamente."}`;
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
    navigator.clipboard.writeText(emailText.textContent)
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
