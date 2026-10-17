// ============================================================
// IDIOMA (PT / EN)
// O português fica no próprio HTML; aqui só existe o inglês.
// Elementos marcados com data-i18n (texto), data-i18n-html (HTML)
// ou data-i18n-attr="atributo:chave; ..." são trocados ao mudar
// o idioma. A escolha fica salva no navegador.
// ============================================================

(function () {
  const EN = {
    "meta.title": "Portfolio | Gabriel Mendes",
    "meta.description":
      "Portfolio of Gabriel Mendes, Data Scientist: Python and Apache Airflow pipelines, SQL on Google BigQuery and KPI dashboards in Power BI.",

    "skip": "Skip to content",
    "close": "Close",
    "logo": "Go to overview",
    "nav.aria": "Portfolio sections",
    "nav.home": "Overview",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    "cv.download": "Download CV",
    "cv.href": "curriculo/GabrielMendes_CV_EN.pdf",
    "cv.file": "GabrielMendes_CV_EN",
    "lang.aria": "Mudar para português",

    "home.status": "Open to new opportunities",
    "home.role": "Data Scientist",
    "home.city": "Goiânia, Brazil",
    "home.lede": "Pipelines, SQL and dashboards that turn data into decisions.",
    "home.cta": "View experience",
    "home.social": "Social links",
    "kpi.units": "units in the database",
    "kpi.networks": "client networks",
    "kpi.students": "active students",
    "unit.thousand": "K",
    "unit.thousandPlus": "K+",
    "unit.million": "M",
    "ticker": "Tools I use",

    "i2.title": "Raw data becomes metrics.",
    "i2.sub": "Thousands of records aggregated into indicators.",
    "i3.title": "Metrics become models.",
    "i3.sub": "Clustering and forecasting with machine learning.",
    "i4.title": "Models reveal trends.",
    "i4.sub": "What the data says about what comes next.",
    "i5.title": "And trends become decisions.",
    "i5.sub": "That's where working with data makes a difference.",

    "exp.title": "Experience",
    "exp.role": "Data Scientist, <span>Pacto Soluções</span>",
    "exp.period": "May 2026 – Oct 2026",
    "exp.summary":
      "End-to-end data work on a management platform for gyms: from pipeline ingestion and orchestration to modeling and the KPI dashboards the business relies on.",
    "case1.unit": "clients on the same pipeline",
    "case1.title": "Multi-client data pipelines",
    "case1.text":
      "Python ETL orchestrated in Apache Airflow, moving data from the Zendesk and Jira APIs into BigQuery. A centralized configuration lets the same code serve 18 clients.",
    "case2.unit": "KPI dashboards migrated",
    "case2.title": "Looker Studio to Power BI migration",
    "case2.text":
      "Active members, churn, cancellations, revenue and delinquency, with every number reconciled against the source, per unit and consolidated.",
    "case3.unit": "rows of modeled daily history",
    "case3.title": "Data modeling and quality",
    "case3.text":
      "A 444-day daily history of each student's status. I found and fixed a bug that inflated ticket counts by tens of thousands, then reprocessed the history and validated it against the source.",
    "case3.tag": "Root cause",
    "case4.unit": "automated tests",
    "case4.title": "NPS module prototype",
    "case4.text":
      "I designed, directed and validated a full-stack prototype, from requirements gathering to Google sign-in: a Java/Spring back end with PostgreSQL and a React front end.",

    "arch.title": "Data flow",
    "arch.pause": "Pause animation",
    "arch.default": "Hover over or tap a step.",
    "arch.zendesk": "Python ETL from the Zendesk API into BigQuery, including a fix for a bug that inflated ticket counts.",
    "arch.jira": "Python ETL from the Jira API into BigQuery, following the same DAG pattern.",
    "arch.airflow": "Apache Airflow DAGs with centralized configuration, scaled to 18 clients.",
    "arch.bigquery": "SQL modeling and optimization in BigQuery, with incremental loads and views for the dashboards.",
    "arch.heatwave": "Worked on migrating data from BigQuery to MySQL HeatWave on Oracle Cloud.",
    "arch.powerbi": "Migrated 20+ KPI dashboards from Looker Studio to Power BI, reconciling every number with the source.",
    "arch.mcp": "Read-only MCP server for querying BigQuery with AI, with no risk of changing data.",
    "arch.mcpLabel": "AI via MCP",


    "proj.title": "Projects",
    "proj.filterAria": "Filter by category",
    "proj.all": "All",
    "proj.ml": "Machine Learning",
    "proj.analysis": "Data Analysis",
    "proj.eng": "Data Engineering",
    "proj.web": "Web Development",
    "proj.one": "1 project",
    "proj.many": "{n} projects",
    "proj.empty": "No projects in this category yet.",
    "proj.details": "Details",
    "proj.detailsOf": "See details of {t}",
    "proj.tech": "Technologies",
    "proj.onGithub": "{t} on GitHub",
    "proj.liveOf": "Open {t} live",
    "proj.shot": "Show screenshot {n}",
    "proj.problem": "Problem",
    "proj.approach": "Approach",
    "proj.result": "Result",
    "proj.viewGithub": "View on GitHub",
    "proj.viewLive": "View live",
    "proj.capture": "Screenshot of {t}",

    "about.title": "About me",
    "about.text":
      "I started at Pacto Soluções in customer relationship roles, analyzing technical requests and error patterns. That experience made it easy for me to understand the business rules behind every number.",
    "about.text2":
      "Today I work end to end across the data lifecycle, from ingestion to dashboards, and I'm pursuing a postgraduate degree in Data Science to go deeper into statistics and machine learning.",
    "about.education": "Education",
    "about.educationVal": "Systems Analysis and Development, IPOG",
    "about.current": "Currently",
    "about.currentVal": "Postgraduate degree in Data Science, IPOG",
    "about.seeking": "Looking for",
    "about.seekingVal": "Data Science, Data Engineering or BI roles",
    "about.location": "Location",
    "about.locationVal": "Goiânia, Brazil",

    "journey.title": "Journey",
    "tl1.title": "Customer Relationship Consultant",
    "tl1.period": "Aug 2022 – Nov 2024",
    "tl1.text": "Client support, error-pattern analysis and requirements for the development team.",
    "tl2.title": "Degree in Systems Analysis",
    "tl2.period": "Aug 2023 – Dec 2025",
    "tl2.text": "Systems Analysis and Development: the programming foundation I bring to data.",
    "tl3.title": "Data at Escolar Manager",
    "tl3.period": "Feb 2025 – May 2026",
    "tl3.text": "Intern, then full-time: SQL queries, management reports and data quality.",
    "tl4.title": "Postgraduate in Data Science",
    "tl4.period": "since Jan 2026",
    "tl4.text": "Statistics, machine learning and applied projects.",
    "tl5.title": "Data Scientist",
    "tl5.period": "May 2026 – Oct 2026",
    "tl5.text": "Airflow pipelines, BigQuery and KPI dashboards in Power BI.",

    "how.title": "How I work",
    "how1.title": "I start with the business rule",
    "how1.text": "Before any query, I understand what the number needs to answer and for whom.",
    "how2.title": "Every number is reconciled",
    "how2.text": "I check each metric against the source, per unit and consolidated, before it reaches a dashboard.",
    "how3.title": "I document what I build",
    "how3.text": "Pipelines and dashboards come with technical documentation so others can maintain and evolve them.",

    "certs.title": "Certifications",
    "cert2": "Power BI for Business Intelligence and Data Science",

    "contact.title": "Let's talk",
    "contact.name": "Name",
    "contact.namePh": "Your name",
    "contact.email": "Email",
    "contact.emailPh": "you@company.com",
    "contact.message": "Message",
    "contact.messagePh": "Write your message",
    "contact.send": "Send message",
    "contact.copy": "Copy",
    "contact.copied": "Copied",
    "form.blocked": "Submission blocked.",
    "form.check": "Please check: {list}.",
    "form.name": "a name with at least 2 letters",
    "form.email": "a valid email",
    "form.msg": "a message between 10 and 300 characters",
    "form.sending": "Sending...",
    "form.sent": "Message sent. Thanks for reaching out!",
    "form.error": "The message couldn't be sent right now. Try again in a few minutes or use the contact links.",

    "motion.pause": "Pause animations",
    "motion.resume": "Resume animations",
  };

  // textos em português usados só pelo JavaScript (o resto vem do HTML)
  const PT_JS = {
    "lang.aria": "Switch to English",
    "cv.href": "curriculo/GabrielMendes_mainCV.pdf",
    "cv.file": "CurriculoGabrielMendes",
    "unit.thousand": "mil",
    "unit.thousandPlus": "mil+",
    "unit.million": "mi",
    "proj.all": "Todos",
    "proj.ml": "Machine Learning",
    "proj.analysis": "Análise de Dados",
    "proj.eng": "Engenharia de Dados",
    "proj.web": "Web/Desenvolvimento",
    "proj.one": "1 projeto",
    "proj.many": "{n} projetos",
    "proj.empty": "Nenhum projeto nesta categoria por enquanto.",
    "proj.details": "Detalhes",
    "proj.detailsOf": "Ver detalhes de {t}",
    "proj.tech": "Tecnologias",
    "proj.onGithub": "{t} no GitHub",
    "proj.liveOf": "Abrir {t} online",
    "proj.shot": "Mostrar captura {n}",
    "proj.problem": "Problema",
    "proj.approach": "Abordagem",
    "proj.result": "Resultado",
    "proj.viewGithub": "Ver no GitHub",
    "proj.viewLive": "Ver online",
    "proj.capture": "Captura do projeto {t}",
    "contact.copied": "Copiado",
    "form.blocked": "Envio bloqueado.",
    "form.check": "Confira: {list}.",
    "form.name": "nome com pelo menos 2 letras",
    "form.email": "um e-mail válido",
    "form.msg": "mensagem entre 10 e 300 caracteres",
    "form.sending": "Enviando...",
    "form.sent": "Mensagem enviada. Obrigado pelo contato!",
    "form.error":
      "Não foi possível enviar a mensagem agora. Tente novamente em alguns minutos ou use os links de contato.",
    "motion.pause": "Pausar animações",
    "motion.resume": "Retomar animações",
  };

  const store = {
    get() {
      try {
        return localStorage.getItem("lang");
      } catch (e) {
        return null;
      }
    },
    set(v) {
      try {
        localStorage.setItem("lang", v);
      } catch (e) {}
    },
  };

  const detected = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
  let lang = store.get() || detected;
  if (lang !== "pt" && lang !== "en") lang = "pt";

  // guarda o português original de cada elemento antes de trocar
  const PT_DOM = new Map();
  const ptOf = (el, kind, key) => {
    const id = `${kind}|${key}`;
    let bag = PT_DOM.get(el);
    if (!bag) PT_DOM.set(el, (bag = {}));
    if (!(id in bag)) {
      bag[id] = kind === "text" ? el.textContent : kind === "html" ? el.innerHTML : el.getAttribute(kind);
    }
    return bag[id];
  };

  function t(key, vars) {
    let s = (lang === "en" ? EN[key] : PT_JS[key]) ?? EN[key] ?? key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
    return s;
  }

  const ptMeta = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content || "",
  };

  function apply() {
    const en = lang === "en";
    document.documentElement.lang = en ? "en" : "pt-BR";
    document.title = en ? EN["meta.title"] : ptMeta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = en ? EN["meta.description"] : ptMeta.description;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const pt = ptOf(el, "text", key);
      el.textContent = en ? EN[key] ?? pt : pt;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      const pt = ptOf(el, "html", key);
      el.innerHTML = en ? EN[key] ?? pt : pt;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (!attr || !key) return;
        const pt = ptOf(el, attr, key);
        el.setAttribute(attr, en ? EN[key] ?? pt : pt ?? "");
      });
    });

    // links do currículo apontam para a versão do idioma
    document.querySelectorAll("[data-cv]").forEach((a) => {
      a.setAttribute("href", t("cv.href"));
      a.setAttribute("download", t("cv.file"));
    });

    // números já animados são reescritos no formato do idioma
    document.querySelectorAll("[data-count]").forEach((el) => {
      if (el.dataset.counting) return;
      const v = parseFloat(el.dataset.count);
      const d = parseInt(el.dataset.decimals || "0", 10);
      el.textContent = v.toLocaleString(en ? "en-US" : "pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
    });

    const btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.dataset.lang = lang;
      btn.setAttribute("aria-label", t("lang.aria"));
      btn.title = t("lang.aria");
    }
  }

  function setLang(next) {
    if (next === lang) return;
    lang = next;
    store.set(lang);
    apply();
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  window.I18N = {
    t,
    get lang() {
      return lang;
    },
    locale: () => (lang === "en" ? "en-US" : "pt-BR"),
    set: setLang,
  };

  // aplica o idioma salvo assim que o HTML existe (antes das animações)
  const init = () => {
    apply();
    document.getElementById("lang-toggle")?.addEventListener("click", () => setLang(lang === "pt" ? "en" : "pt"));
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
