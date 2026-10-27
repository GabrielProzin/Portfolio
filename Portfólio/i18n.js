// Idioma (PT / EN). O português fica no próprio HTML; aqui está o inglês e os textos que o script escreve.
// Elementos com data-i18n (texto), data-i18n-html (HTML) ou data-i18n-attr="atributo:chave; ..." mudam com o idioma.
(function () {
  const EN = {
    "meta.title": "Gabriel Mendes | Data scientist",
    "meta.description": "Portfolio of Gabriel Mendes, data scientist in Goiânia, Brazil: Python and Apache Airflow pipelines, SQL on Google BigQuery, Power BI dashboards and personal projects such as busca_vagas.",
    "skip": "Skip to projects",
    "close": "Close",
    "lang.aria": "Mudar para português",
    "cv.download": "Download résumé",
    "cv.href": "curriculo/GabrielMendes_CV_EN.pdf",
    "cv.file": "GabrielMendes_CV_EN",

    "nav.aria": "Sections",
    "nav.work": "Projects",
    "nav.exp": "Experience",
    "nav.path": "Path",
    "nav.contact": "Contact",
    "hero.city": "Goiânia, Goiás",
    "hero.country": "Brazil",
    "hero.title": "Gabriel Mendes, data scientist",
    "hero.role": "data scientist",
    "hero.lede": "I take data from the API to the dashboard and check every number against the source.",
    "hero.work": "See projects",
    "strip.aria": "Screens from the projects; scroll sideways",

    "t.ac1": "Stock market, a Power BI dashboard",
    "t.ac2": "Stock market, volume over time",
    "t.af1": "Airflow pipeline, the weekly DAG",
    "t.wda1": "Rental system, the overview",
    "t.wda3": "Rental system, the month's charts",
    "t.gh1": "GitHub profile, the ASCII portrait",
    "t.gh3": "GitHub profile, the contribution calendar",
    "t.bv0": "busca_vagas, the demo with sample data",
    "t.bv1": "busca_vagas, the Today screen",
    "t.bv4": "busca_vagas, job types",
    "t.bv5": "busca_vagas, what to study",
    "t.fr1": "Fraud detection, confusion matrices",

    "a.ac1": "NASDAQ stock dashboard in Power BI",
    "a.ac2": "Volume over time chart",
    "a.ac3": "Month-over-month change in closing price",
    "a.ac4": "Table of monthly average values",
    "a.af1": "Apache Airflow DAG with the weekly collection tasks",
    "a.af2": "The DAG's tasks in sequence",
    "a.af3": "The files the DAG writes each week",
    "a.bv0": "Short video of busca_vagas in use",
    "a.bv1": "busca_vagas Today screen",
    "a.bv1b": "Today screen, with new jobs and today's emails",
    "a.bv2": "A job page with its fit score explained",
    "a.bv3": "Batch sending with the recruiter email open",
    "a.bv4": "Job types grouped with K-means",
    "a.bv5": "busca_vagas What to study screen",
    "a.bv6": "Job types on a phone",
    "a.bv7": "Free-tier usage in gauges",
    "a.fr1": "Confusion matrices of the two fraud models",
    "a.fr2": "Logistic Regression matrix",
    "a.fr3": "Random Forest matrix",
    "a.gh0": "GitHub profile with the calendar and the portrait",
    "a.gh1": "Portrait of Gabriel made of ASCII characters",
    "a.gh2": "Neofetch-style card",
    "a.gh3": "Animated contribution calendar",
    "a.wda0": "The month's dashboard in the rental system",
    "a.wda1": "Rental system overview screen",
    "a.wda2": "Detail of the revenue chart",
    "a.wda3": "Charts for recent months",

    "work.title": "Projects",
    "work.filter": "Filter projects",
    "work.all": "All",
    "work.data": "Data",
    "work.web": "Web",
    "r.bv": "busca_vagas screens",
    "r.gh": "GitHub profile screens",
    "r.wda": "Rental system screens",
    "r.af": "Airflow pipeline screens",
    "r.fr": "Fraud detection screens",
    "r.ac": "Stock dashboard screens",
    "r.bv.what": "ETL, embeddings and Next.js",
    "r.gh.what": "Python generating SVG",
    "r.wda.what": "Next.js and Firebase",
    "r.af.what": "Airflow, Docker and Celery",
    "r.fr.what": "Scikit-learn and Power BI",
    "r.ac.what": "Power BI and DAX",
    "p.gh.title": "Animated GitHub profile",
    "p.wda.title": "Rental system",
    "p.af.title": "Airflow pipeline",
    "p.fr.title": "Fraud detection",
    "p.ac.title": "Stock market",

    "f.title": "One run, 1,249 jobs",
    "f.text": "On October 23, busca_vagas read 1,249 unique postings on Gupy, Remotar, Sólides and GitHub. Each filter below cut the ones that did not fit. Turn one off and see how many could have stayed.",
    "f.caption": "Postings cut by each filter in the 10/23/2026 run",
    "f.col1": "Filter",
    "f.col2": "Cut",
    "f.col3": "On",
    "f.r1": "Above junior level",
    "f.r2": "Role outside data",
    "f.r3": "Posted over 14 days ago",
    "f.r4": "Blocked term",
    "f.r5": "On-site or hybrid outside Goiânia",
    "f.r6": "In English, mid-level in the text, or no location",
    "f.left": "jobs approved, the day's list",
    "f.maybe": "jobs at most would get through",

    "exp.title": "Data in production",
    "exp.f1": "clients on the same Airflow pipeline",
    "exp.f2": "KPI dashboards moved to Power BI",
    "exp.f3": "rows of modeled daily history",
    "exp.act": "See the path",
    "exp.role": "Data scientist at Pacto Soluções, May to October 2026.",
    "exp.scale": "A management platform for gyms with 3,500 locations, 400 chains and 2.1 million active members in the database. The work went from ingesting the data to the dashboards the business uses.",
    "c1.title": "Pipelines for 18 clients",
    "c1.text": "Python ETL orchestrated in Apache Airflow, moving data from the Zendesk and Jira APIs into BigQuery. A centralized configuration lets the same code serve 18 clients.",
    "c2.title": "From Looker Studio to Power BI",
    "c2.text": "More than 20 KPI dashboards migrated: active members, churn, cancellations, revenue and delinquency, with every number reconciled against the source, per location and consolidated.",
    "c3.title": "A bug worth tens of thousands",
    "c3.text": "I modeled a 444-day daily history of every member's status. Along the way I found the cause of a bug that inflated ticket counts by tens of thousands, and reprocessed the history checking it against the origin.",
    "c4.title": "A prototype with 300 tests",
    "c4.text": "I designed, directed and validated an NPS module prototype, from gathering requirements to Google sign-in: Java and Spring with PostgreSQL on the back end and React on the front end, with more than 300 automated tests.",
    "c5.title": "BigQuery, HeatWave and AI",
    "c5.text": "I worked on migrating data from BigQuery to MySQL HeatWave on Oracle Cloud, and set up a read-only MCP server to query BigQuery with AI with no risk of changing data.",

    "path.t1": "Where I worked",
    "path.t2": "and studied",
    "path.caption": "Work, education and certificates, newest first",
    "path.c1": "Year",
    "path.c2": "What",
    "path.c3": "Where",
    "path.c4": "When",
    "path.r1": "Data scientist",
    "path.p1": "May to Oct",
    "path.r2": "Postgraduate in Data Science",
    "path.p2": "since Jan",
    "path.cert": "certificate",
    "path.r4": "Power BI for Business Intelligence",
    "path.r5": "Data, from intern to full time",
    "path.p5": "Feb 2025 to May 2026",
    "path.r6": "Systems Analysis and Development",
    "path.p6": "Aug 2023 to Dec 2025",
    "path.r7": "Customer relationship consultant",
    "path.p7": "Aug 2022 to Nov 2024",

    "about.title": "About",
    "about.f1": "Goiânia, Brazil",
    "about.f2": "in data since 2025",
    "about.f3": "send an email",
    "about.alt": "Photo of Gabriel Mendes",
    "about.p1": "<strong>Gabriel Mendes</strong>, nice to meet you. I started in support, reading customers' tickets. Later I built the pipelines that count them.",
    "about.p2": "Today I work with Python and Airflow moving data from APIs into BigQuery, and with Power BI dashboards checked number by number against the source. I like work where analysis and engineering go together. I'm doing a postgraduate degree in Data Science at IPOG and use my own projects, like <a href=\"https://github.com/GabrielProzin/busca_vagas\" target=\"_blank\" rel=\"noopener noreferrer\">busca_vagas</a>, to put what I learn into practice.",

    "contact.title": "Let's talk",
    "contact.email": "Your email",
    "contact.msg": "Your message",
    "contact.send": "Send",
    "contact.hint": "A message of 10 to 300 characters. I'll reply to the email you leave.",
    "contact.or": "Or",
    "contact.copy": "Copy address",
    "contact.copied": "Copied",

    "foot.say": "Data from the API to the dashboard, checked at the source.",
    "foot.aria": "Footer",
    "foot.now": "now,",
    "foot.cv": "Get the résumé",

    "sheet.summary": "What it is",
    "sheet.problem": "Problem",
    "sheet.approach": "How",
    "sheet.result": "Result",
    "sheet.github": "See it on GitHub",
    "form.blocked": "Sending blocked.",
    "form.check": "Please check: {list}.",
    "form.email": "a valid email",
    "form.msg": "a message of 10 to 300 characters",
    "form.sending": "Sending...",
    "form.sent": "Message sent. Thank you!",
    "form.error": "The message could not be sent right now. Try again in a few minutes or use LinkedIn or WhatsApp.",
  };

  const PT_JS = {
    "lang.aria": "Switch to English",
    "cv.href": "curriculo/GabrielMendes_mainCV.pdf",
    "cv.file": "CurriculoGabrielMendes",
    "f.left": "vagas aprovadas, a lista do dia",
    "f.maybe": "vagas passariam, no máximo",
    "contact.copy": "Copiar endereço",
    "contact.copied": "Copiado",
    "sheet.summary": "O que é",
    "sheet.problem": "Problema",
    "sheet.approach": "Como",
    "sheet.result": "Resultado",
    "sheet.github": "Ver no GitHub",
    "form.blocked": "Envio bloqueado.",
    "form.check": "Confira: {list}.",
    "form.email": "um email válido",
    "form.msg": "mensagem entre 10 e 300 caracteres",
    "form.sending": "Enviando...",
    "form.sent": "Mensagem enviada. Obrigado pelo contato!",
    "form.error": "Não foi possível enviar agora. Tente de novo em alguns minutos ou use o LinkedIn ou o WhatsApp.",
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
