// ============================================================
// CONFIGURACOES
// ============================================================


const EMAIL_JS_CONFIG = {
  publicKey: "s7eWkxR-sAUpWSHJh",
  serviceId: "service_ghp9z7o",
  templateId: "service_ghp9z7o",
};

const POPUP_TIMEOUT = 2000;

// traduções (i18n.js); sem ele, mostra a própria chave
const T = (key, vars) => (window.I18N ? window.I18N.t(key, vars) : key);
const LANG = () => (window.I18N ? window.I18N.lang : "pt");

const prefersReducedMotion = () => document.documentElement.classList.contains("motion-off");

// Botão para pausar/retomar todas as animações (fica salvo no navegador)
const motionToggle = document.getElementById("motion-toggle");
function labelMotionToggle() {
  if (!motionToggle) return;
  const off = prefersReducedMotion();
  const label = T(off ? "motion.resume" : "motion.pause");
  motionToggle.setAttribute("aria-pressed", String(off));
  motionToggle.setAttribute("aria-label", label);
  motionToggle.title = label;
  motionToggle.querySelector("i").className = off ? "bx bx-play-circle" : "bx bx-pause-circle";
}
if (motionToggle) {
  labelMotionToggle();
  motionToggle.addEventListener("click", () => {
    try {
      localStorage.setItem("motion", prefersReducedMotion() ? "on" : "off");
    } catch (e) {}
    location.reload();
  });
}

// ============================================================
// PROJETOS (textos em PT e EN)
// ============================================================

const projects = [
  {
    pt: {
      title: "busca_vagas: radar de vagas com ETL e NLP",
      summary:
        "Projeto pessoal que automatiza a busca de vagas júnior de dados: coleta de 5 fontes, dá uma nota contra o currículo e envia candidaturas pelo Gmail, com o pipeline rodando no GitHub Actions.",
      problem:
        "Procurar vaga júnior de dados exige olhar várias plataformas por dia, descartar o que não serve e mandar currículo um a um. E as vagas com o email direto do recrutador quase só aparecem em posts do LinkedIn.",
      approach:
        "Pipeline ETL em Python orquestrado no GitHub Actions, com 5 coletas por dia: extrai vagas da Gupy, Remotar, Sólides, GitHub e posts do LinkedIn, remove duplicadas entre fontes, filtra por área, nível e local e carrega no PostgreSQL (Supabase), com backup cifrado conferido contra o banco. A nota de compatibilidade combina similaridade semântica com embeddings multilíngues (45%), habilidades (40%) e tipo de cargo (15%), e se ajusta com as vagas que aplico ou descarto. K-means sobre os embeddings agrupa as vagas em tipos (número de grupos escolhido pela silhueta) e uma análise de lacunas mostra quais habilidades pedidas faltam no currículo. Site em Next.js com login, envio de emails em lote por uma fila com limite diário, leitura de respostas no Gmail via IMAP, monitor de uso dos planos gratuitos e testes automatizados (pytest e Playwright) no CI.",
      result:
        "Roda sozinho 5 vezes por dia: cerca de 1.200 vagas lidas por coleta viram uma lista curta, com a nota explicada, o email ao recrutador pronto para revisar e cada candidatura acompanhada até a resposta. Tudo em planos gratuitos, com código aberto.",
    },
    en: {
      title: "busca_vagas: job radar with ETL and NLP",
      summary:
        "A personal project that automates the search for junior data jobs: it collects from 5 sources, scores each job against a resume and sends applications through Gmail, with the pipeline running on GitHub Actions.",
      problem:
        "Looking for a junior data job means checking several platforms every day, discarding what doesn't fit and sending resumes one by one. And postings with the recruiter's direct email show up almost only in LinkedIn posts.",
      approach:
        "A Python ETL pipeline orchestrated on GitHub Actions, running 5 times a day: it extracts jobs from Gupy, Remotar, Sólides, GitHub and LinkedIn posts, removes cross-source duplicates, filters by field, level and location and loads them into PostgreSQL (Supabase), with an encrypted backup checked against the database. The fit score combines semantic similarity from multilingual embeddings (45%), skills (40%) and job track (15%), and adjusts to the jobs I apply to or discard. K-means on the embeddings groups jobs into types (number of groups picked by silhouette) and a skill-gap analysis shows which requested skills are missing from my resume. A Next.js site with login, batch emailing through a queue with a daily limit, Gmail reply detection over IMAP, a usage monitor for the free tiers and automated tests (pytest and Playwright) in CI.",
      result:
        "Runs on its own 5 times a day: about 1,200 jobs read per run become a short list, with the score explained, the recruiter email ready to review and each application tracked until a reply. All on free tiers, open source.",
    },
    image: "ImgProjeto/BuscaVagas-Capa.webp",
    // Vídeo completo da demonstração: aparece primeiro na ficha do projeto, antes das capturas.
    video: "ImgProjeto/BuscaVagas-Video.mp4",
    poster: "ImgProjeto/BuscaVagas-Demo.jpg",
    featured: true,
    gallery: [
      "ImgProjeto/BuscaVagas-Capa.webp",
      "ImgProjeto/BuscaVagas-Vaga.webp",
      "ImgProjeto/BuscaVagas-Lote.webp",
      "ImgProjeto/BuscaVagas-Tipos.webp",
      "ImgProjeto/BuscaVagas-Estudar.webp",
      "ImgProjeto/BuscaVagas-Uso.webp",
    ],
    tags: ["Python", "GitHub Actions", "Embeddings (NLP)", "PostgreSQL", "Next.js"],
    category: ["eng", "ml", "web"],
    github: "https://github.com/GabrielProzin/busca_vagas",
    live: "",
  },
  {
    pt: {
      title: "Sistema de Locação de Mesas e Cadeiras",
      summary: "App web mobile-first que tirou do papel a gestão de aluguéis e despesas de um negócio de locação.",
      problem:
        "O controle de aluguéis de mesas, cadeiras e forros era feito em anotações de papel, sem visão de agenda, valores do mês ou itens em uso.",
      approach:
        "Aplicação em Next.js 15 com React 19 e TypeScript, dados no Firestore e login no Firebase Auth restrito a contas autorizadas. Cadastro em três etapas (cliente e itens, entrega, revisão) com cobrança automática por preço unitário ou valor combinado e frete por km; lista com busca e filtros por status e mês; controle de despesas em centavos, com litros para combustível. Regras do Firestore validam os campos, e a suíte de testes no Vitest roda a cada commit via Husky.",
      result:
        "Em uso pelo cliente: um dashboard mensal com valor contratado comparado ao mês anterior, ticket médio, clientes únicos, itens em uso, histórico de 6 meses e agenda de entregas e devoluções, pensado para uso no celular.",
    },
    en: {
      title: "Table & Chair Rental System",
      summary: "Mobile-first web app that moved a rental business's bookings and expenses off paper.",
      problem:
        "Table, chair and tablecloth rentals were tracked in paper notes, with no view of the schedule, the month's totals or the items currently out.",
      approach:
        "A Next.js 15 app with React 19 and TypeScript, data in Firestore and Firebase Auth login limited to authorized accounts. Three-step booking form (customer and items, delivery, review) with automatic unit pricing or a flat agreed price plus per-km delivery fee; a list with search and status/month filters; expense tracking stored in cents, with liters for fuel. Firestore rules validate the fields, and the Vitest suite runs on every commit through Husky.",
      result:
        "In use by the client: a monthly dashboard with contracted value against the previous month, average ticket, unique customers, items in use, a 6-month history and a delivery/return schedule, designed for phone use.",
    },
    image: "ImgProjeto/WDA-Demo.jpg",
    // No card, um trecho curto em loop; na ficha, o vídeo completo e depois as capturas (dados fictícios).
    cardVideo: "ImgProjeto/WDA-Demo.mp4",
    video: "ImgProjeto/WDA-Video.mp4",
    poster: "ImgProjeto/WDA-Demo.jpg",
    gallery: [
      "ImgProjeto/WDA-VisaoGeral.webp",
      "ImgProjeto/WDA-Graficos.webp",
      "ImgProjeto/WDA-Alugueis.webp",
      "ImgProjeto/WDA-Novo.webp",
      "ImgProjeto/WDA-Despesas.webp",
      "ImgProjeto/WDA-Celular.webp",
    ],
    tags: ["Next.js", "TypeScript", "Firebase", "Vitest"],
    category: "web",
    github: "https://github.com/GabrielProzin/wdalocacao",
    live: "",
  },
  {
    pt: {
      title: "Pipeline de Dados com Apache Airflow",
      summary: "Coleta semanal automatizada de dados de uma API, orquestrada no Airflow.",
      problem: "Automatizar a coleta recorrente de dados de uma API externa sem execução manual.",
      approach:
        "DAG no Apache Airflow agendada para toda segunda-feira, com uma tarefa que cria a partição da semana e outra que extrai a previsão de 7 dias da API Visual Crossing. Ambiente em Docker Compose com CeleryExecutor, Redis e PostgreSQL.",
      result:
        "A cada semana, os dados brutos e duas tabelas tratadas (temperaturas e condições) ficam salvos em uma pasta da semana, prontos para análise.",
    },
    en: {
      title: "Data Pipeline with Apache Airflow",
      summary: "Automated weekly data collection from an API, orchestrated in Airflow.",
      problem: "Automate recurring data collection from an external API with no manual runs.",
      approach:
        "An Apache Airflow DAG scheduled every Monday, with one task that creates the week's partition and another that pulls a 7-day forecast from the Visual Crossing API. Runs on Docker Compose with CeleryExecutor, Redis and PostgreSQL.",
      result:
        "Every week, the raw data and two curated tables (temperatures and conditions) are saved to that week's folder, ready for analysis.",
    },
    image: "ImgProjeto/PipelineAirflow.webp",
    darkCover: true,
    tags: ["Python", "Apache Airflow", "Docker", "Pandas"],
    category: "eng",
    github: "https://github.com/GabrielProzin/MiniProjectAirflow",
    live: "",
  },
  {
    pt: {
      title: "Detecção de Fraudes",
      summary: "Modelos que apontam transações de cartão com maior risco de fraude.",
      problem: "Identificar transações com maior risco de fraude em cartões de crédito.",
      approach:
        "Análise exploratória, preparação dos dados e comparação entre Logistic Regression e Random Forest, com apoio visual em Power BI.",
      result:
        "Uma base analítica que ajuda a interpretar padrões de fraude e avaliar o desempenho dos modelos.",
    },
    en: {
      title: "Fraud Detection",
      summary: "Models that flag card transactions with the highest fraud risk.",
      problem: "Identify credit card transactions with the highest risk of fraud.",
      approach:
        "Exploratory analysis, data preparation and a comparison between Logistic Regression and Random Forest, with visual support in Power BI.",
      result: "An analytical base that helps interpret fraud patterns and evaluate model performance.",
    },
    image: "ImgProjeto/ML-BI.webp",
    tags: ["Python", "Scikit-Learn", "Power BI"],
    category: ["ml", "analise"],
    github: "https://github.com/GabrielProzin/credit-card-fraud-detection-ml-bi",
    live: "",
  },
  {
    pt: {
      title: "Mercado de Ações",
      summary: "Dashboard de tendências e comparação entre ativos da NASDAQ.",
      problem: "Organizar dados do mercado acionário para facilitar comparações e leitura de tendências.",
      approach:
        "Tratamento e estruturação de bases reais da NASDAQ e dashboards no Power BI com foco em análise temporal e comparação entre ativos.",
      result: "Uma visualização clara para apoiar a exploração dos dados e a tomada de decisão.",
    },
    en: {
      title: "Stock Market",
      summary: "Dashboard of trends and comparisons across NASDAQ stocks.",
      problem: "Organize stock market data to make comparisons and trends easy to read.",
      approach:
        "Cleaning and structuring real NASDAQ data, with Power BI dashboards focused on time analysis and comparisons between stocks.",
      result: "A clear visualization to support data exploration and decision-making.",
    },
    image: "ImgProjeto/DashboardAnaliticoMercadoAcoes.webp",
    tags: ["Power BI", "DAX", "Time Intelligence"],
    category: "analise",
    github: "https://github.com/GabrielProzin/Projeto-Dashboard-Mercado-Acoes",
    live: "",
  },
];

const txt = (project) => project[LANG()] || project.pt;

const filterKeys = {
  ml: "proj.ml",
  analise: "proj.analysis",
  eng: "proj.eng",
  web: "proj.web",
};

// cor fixa por categoria (a cor segue a entidade, não a posição)
const filterColors = {
  ml: "var(--s-trend)",
  analise: "var(--s-obs)",
  eng: "var(--s-violet)",
  web: "var(--s-fcst)",
};

const projectList = document.getElementById("project-list");
const projectCount = document.getElementById("project-count");
let currentFilter = "all";

const asArray = (v) => (Array.isArray(v) ? v : [v]);

function renderProjects(filter = "all", animate = true) {
  currentFilter = filter;
  const lista = projects.filter((p) => !p.featured);
  const filtered =
    filter === "all" ? lista : lista.filter((p) => asArray(p.category).includes(filter));
  const destaque = document.getElementById("feature-bv");
  if (destaque) destaque.hidden = filter !== "all" && !destaque.dataset.cats.split(" ").includes(filter);

  projectList.innerHTML = "";
  projectCount.textContent =
    filtered.length === 1 ? T("proj.one") : T("proj.many", { n: filtered.length });

  if (filtered.length === 0) {
    projectList.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-bar-chart-alt-2" aria-hidden="true"></i>
        <p>${T("proj.empty")}</p>
      </div>
    `;
    return;
  }

  filtered.forEach((project, i) => {
    const p = txt(project);
    const card = document.createElement("article");
    card.className = "tile project-item";
    card.dataset.index = String(projects.indexOf(project));

    const badges = asArray(project.category)
      .map(
        (c) =>
          `<span class="category-badge" style="--badge: ${filterColors[c] || "var(--muted)"}">${T(filterKeys[c] || c)}</span>`
      )
      .join("");

    card.innerHTML = `
      <button type="button" class="project-media" aria-label="${T("proj.detailsOf", { t: p.title })}">
        ${project.cardVideo
          ? `<video src="${project.cardVideo}" poster="${project.poster || project.image}" class="project-thumbnail" muted loop playsinline preload="none" data-autoplay aria-hidden="true"></video>`
          : `<img src="${project.image}" alt="" class="project-thumbnail" loading="lazy" />`}
        <span class="project-media__hint"><i class="bx bx-expand-alt" aria-hidden="true"></i> ${T("proj.details")}</span>
      </button>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-summary">${p.summary}</p>
        <div class="project-badges">${badges}</div>
        <div class="project-foot">
          <ul class="tech-list" aria-label="${T("proj.tech")}">${project.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
          <span class="project-links">
            ${project.live ? `<a class="icon-btn" href="${project.live}" target="_blank" rel="noopener noreferrer" aria-label="${T("proj.liveOf", { t: p.title })}"><i class="bx bx-link-external"></i></a>` : ""}
            ${project.github ? `<a class="icon-btn" href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="${T("proj.onGithub", { t: p.title })}"><i class="bx bxl-github"></i></a>` : ""}
          </span>
        </div>
      </div>
    `;

    projectList.appendChild(card);

    if (animate && !prefersReducedMotion() && card.animate) {
      card.animate(
        [
          { opacity: 0, transform: "translateY(16px) scale(0.98)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 500, delay: i * 90, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
      );
    }
  });  observarVideos(projectList);
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

// ao trocar o idioma, refaz o que é gerado pelo JavaScript
document.addEventListener("langchange", () => {
  renderProjects(currentFilter, false);
  labelMotionToggle();
  if (imageModal?.classList.contains("show") && openProject) fillModal(openProject);
});

// ============================================================
// ABAS DE PÁGINA (acompanham a rolagem)
// ============================================================

const tabs = Array.from(document.querySelectorAll(".page-tab"));
const tabIndicator = document.querySelector(".page-tabs__indicator");
const pagePos = document.getElementById("page-pos");
const pages = tabs.map((t) => document.querySelector(t.getAttribute("href")));

let lastTabIndex = -1;
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
  // no celular a navegação rola de lado: mantém a aba ativa visível
  const navEl = tab?.closest(".nav");
  if (navEl && index !== lastTabIndex && navEl.scrollWidth > navEl.clientWidth) {
    navEl.scrollTo({ left: tab.offsetLeft - navEl.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }
  lastTabIndex = index;
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
const modalImage = imageModal?.querySelector(".image-modal__media > img");
const modalVideo = imageModal?.querySelector(".image-modal__media > video");
const modalThumbs = document.getElementById("image-modal-thumbs");
const modalTitle = document.getElementById("image-modal-title");
const modalInfo = document.getElementById("image-modal-info");
const modalClose = document.getElementById("image-modal-close");
let lastFocusedElement = null;
let originRect = null;
let openProject = null;

/** Para o vídeo da ficha (ao trocar de captura ou fechar). */
function pararVideoModal() {
  if (!modalVideo) return;
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}

// A ficha mostra primeiro o vídeo (se o projeto tiver) e depois as capturas.
// "inicio" escolhe o que abre: um número, "video" ou o caminho de uma captura.
function fillModal(project, inicio = 0) {
  const p = txt(project);
  const shots = [
    ...(project.video && modalVideo ? [{ video: project.video, poster: project.poster || project.image }] : []),
    ...(project.gallery || [project.image]).map((src) => ({ src })),
  ];
  const show = (i) => {
    const s = shots[i];
    if (s.video) {
      modalImage.hidden = true;
      modalVideo.hidden = false;
      modalVideo.poster = s.poster;
      if (modalVideo.getAttribute("src") !== s.video) modalVideo.src = s.video;
      modalVideo.setAttribute("aria-label", T("proj.videoOf", { t: p.title }));
      if (!prefersReducedMotion()) modalVideo.play().catch(() => {});
    } else {
      pararVideoModal();
      if (modalVideo) modalVideo.hidden = true;
      modalImage.hidden = false;
      modalImage.src = s.src;
      modalImage.alt = T("proj.capture", { t: p.title }) + (shots.length > 1 ? ` (${i + 1}/${shots.length})` : "");
    }
    modalThumbs.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
  };
  // capas geradas no tema escuro não ganham faixas brancas
  modalImage.style.background = project.darkCover ? "var(--canvas)" : "";
  modalThumbs.hidden = shots.length < 2;
  modalThumbs.innerHTML = shots.length < 2 ? "" : shots
    .map((s, i) => s.video
      ? `<button type="button" class="thumb-video" aria-label="${T("proj.playVideo")}"><img src="${s.poster}" alt="" loading="lazy" /><i class="bx bx-play" aria-hidden="true"></i></button>`
      : `<button type="button" aria-label="${T("proj.shot", { n: i + 1 })}"><img src="${s.src}" alt="" loading="lazy" /></button>`)
    .join("");
  modalThumbs.querySelectorAll("button").forEach((b, i) => b.addEventListener("click", () => show(i)));
  const alvo = typeof inicio === "number" ? inicio
    : inicio === "video" ? Math.max(0, shots.findIndex((s) => s.video))
    : Math.max(0, shots.findIndex((s) => s.src === inicio));
  show(Math.min(alvo, shots.length - 1));
  modalTitle.textContent = p.title;
  modalInfo.innerHTML = `
    <dl class="psr">
      <div><dt>${T("proj.problem")}</dt><dd>${p.problem}</dd></div>
      <div><dt>${T("proj.approach")}</dt><dd>${p.approach}</dd></div>
      <div><dt>${T("proj.result")}</dt><dd>${p.result}</dd></div>
    </dl>
    <div class="project-links">
      ${project.github ? `<a class="btn btn--primary btn--sm" href="${project.github}" target="_blank" rel="noopener noreferrer"><i class="bx bxl-github"></i> ${T("proj.viewGithub")}</a>` : ""}
      ${project.live ? `<a class="btn btn--ghost btn--sm" href="${project.live}" target="_blank" rel="noopener noreferrer"><i class="bx bx-link-external"></i> ${T("proj.viewLive")}</a>` : ""}
    </div>
  `;
}

function openProjectModal(project, fromEl, inicio = 0) {
  if (!imageModal) return;

  lastFocusedElement = document.activeElement;
  openProject = project;
  fillModal(project, inicio);

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
  pararVideoModal();
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
      messageEl.textContent = T("form.blocked");
      messageEl.className = "form-message error";
      return;
    }

    const problems = [];

    if (!name || name.length < 2 || name.length > 50) {
      nameField.classList.add("error");
      nameField.setAttribute("aria-invalid", "true");
      problems.push(T("form.name"));
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailField.classList.add("error");
      emailField.setAttribute("aria-invalid", "true");
      problems.push(T("form.email"));
    }

    if (!msg || msg.length < 10 || msg.length > 300) {
      messageField.classList.add("error");
      messageField.setAttribute("aria-invalid", "true");
      problems.push(T("form.msg"));
    }

    if (problems.length) {
      messageEl.textContent = T("form.check", { list: problems.join(", ") });
      messageEl.className = "form-message error";
      contactForm.querySelector(".error")?.focus();
      return;
    }

    if (!window.emailjs) {
      messageEl.textContent = T("form.error");
      messageEl.className = "form-message error";
      return;
    }

    messageEl.textContent = T("form.sending");
    messageEl.className = "form-message info";

    try {
      await emailjs.send(EMAIL_JS_CONFIG.serviceId, EMAIL_JS_CONFIG.templateId, {
        from_name: name,
        reply_to: email,
        message: msg,
      });

      messageEl.textContent = T("form.sent");
      messageEl.className = "form-message success";
      contactForm.reset();
      if (charCount) charCount.textContent = "0/300";
    } catch (error) {
      console.error("Erro EmailJS:", error);
      messageEl.textContent = T("form.error");
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
      .then(() => showCopiedPopup(T("contact.copied")))
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


// ============================================================
// DESTAQUE, FUNIL, VÍDEOS E MENU DO CELULAR
// ============================================================

// "Detalhes" do projeto em destaque abre a mesma ficha dos outros
document.querySelectorAll("[data-open-project]").forEach((btn) => {
  btn.addEventListener("click", () => openProjectModal(projects[+btn.dataset.openProject], btn));
});

// vídeos tocam só quando aparecem na tela (e nunca com as animações pausadas).
// Os cards de projeto são desenhados de novo a cada filtro, então os vídeos novos entram no observador.
// (declaração de função: pode ser chamada pelos cards antes desta linha rodar)
function observarVideos(raiz = document) {
  if (observarVideos.obs === undefined) {
    observarVideos.obs = !prefersReducedMotion() && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            const v = e.target;
            if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); } else v.pause();
          });
        }, { threshold: 0.25 })
      : null;
  }
  if (!observarVideos.obs) return;
  raiz.querySelectorAll("video[data-autoplay]:not([data-observado])").forEach((v) => {
    v.dataset.observado = "1";
    observarVideos.obs.observe(v);
  });
}
observarVideos();

// No destaque, o vídeo e as capturas também abrem a ficha, já no que foi clicado.
document.querySelectorAll("[data-abrir-midia]").forEach((el) => {
  el.addEventListener("click", () => openProjectModal(projects[+el.dataset.abrirMidia], el, el.dataset.inicio || 0));
});

// o funil de uma coleta real: desligar um filtro devolve as vagas que ele cortou
(function () {
  const funil = document.getElementById("funil");
  if (!funil) return;
  const num = document.getElementById("funnel-num");
  const label = document.getElementById("funnel-label");
  const caixas = funil.querySelectorAll("input[type=checkbox]");
  const fmt = (n) => n.toLocaleString(LANG() === "en" ? "en-US" : "pt-BR");
  let mostrado = 5;
  const contar = (alvo) => {
    if (prefersReducedMotion()) { num.textContent = fmt(alvo); mostrado = alvo; return; }
    const de = mostrado, t0 = performance.now(), dur = 520;
    const passo = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      num.textContent = fmt(Math.round(de + (alvo - de) * e));
      if (p < 1) requestAnimationFrame(passo); else mostrado = alvo;
    };
    requestAnimationFrame(passo);
  };
  const rotulo = () => ([...caixas].some((c) => !c.checked) ? T("f.maybe") : T("f.left"));
  caixas.forEach((c) => c.addEventListener("change", () => {
    let n = 5;
    caixas.forEach((x) => { x.closest("tr").classList.toggle("is-off", !x.checked); if (!x.checked) n += +x.dataset.cut; });
    label.textContent = rotulo();
    contar(n);
  }));
  document.addEventListener("langchange", () => { num.textContent = fmt(mostrado); label.textContent = rotulo(); });
})();

// menu do celular: as mesmas seções das abas, num painel que abre abaixo do topo
(function () {
  const btn = document.getElementById("menu-btn");
  const header = document.querySelector(".header");
  if (!btn || !header) return;
  const fechar = () => { header.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", T("menu.open")); btn.querySelector("i").className = "bx bx-menu"; };
  btn.addEventListener("click", () => {
    const aberto = header.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(aberto));
    btn.setAttribute("aria-label", T(aberto ? "menu.close" : "menu.open"));
    btn.querySelector("i").className = aberto ? "bx bx-x" : "bx bx-menu";
  });
  header.querySelectorAll(".page-tab").forEach((a) => a.addEventListener("click", fechar));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && header.classList.contains("is-open")) { fechar(); btn.focus(); } });
})();
