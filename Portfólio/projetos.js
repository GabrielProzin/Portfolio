// Textos completos de cada projeto (PT e EN), abertos na ficha de detalhes.
window.PROJETOS = {
  "bv": {
    "pt": {
      "title": "busca_vagas: radar de vagas com ETL e NLP",
      "summary": "Projeto pessoal que automatiza a busca de vagas júnior de dados: coleta de 5 fontes, dá uma nota contra o currículo e envia candidaturas pelo Gmail, com o pipeline rodando no GitHub Actions.",
      "problem": "Procurar vaga júnior de dados exige olhar várias plataformas por dia, descartar o que não serve e mandar currículo um a um. E as vagas com o email direto do recrutador quase só aparecem em posts do LinkedIn.",
      "approach": "Pipeline ETL em Python orquestrado no GitHub Actions, com 5 coletas por dia: extrai vagas da Gupy, Remotar, Sólides, GitHub e posts do LinkedIn, remove duplicadas entre fontes, filtra por área, nível e local e carrega no PostgreSQL (Supabase), com backup cifrado conferido contra o banco. A nota de compatibilidade combina similaridade semântica com embeddings multilíngues (45%), habilidades (40%) e tipo de cargo (15%), e se ajusta com as vagas que aplico ou descarto. K-means sobre os embeddings agrupa as vagas em tipos (número de grupos escolhido pela silhueta) e uma análise de lacunas mostra quais habilidades pedidas faltam no currículo. Site em Next.js com login, envio de emails em lote por uma fila com limite diário, leitura de respostas no Gmail via IMAP, monitor de uso dos planos gratuitos e testes automatizados (pytest e Playwright) no CI.",
      "result": "Roda sozinho 5 vezes por dia: cerca de 1.200 vagas lidas por coleta viram uma lista curta, com a nota explicada, o email ao recrutador pronto para revisar e cada candidatura acompanhada até a resposta. Tudo em planos gratuitos, com código aberto."
    },
    "en": {
      "title": "busca_vagas: job radar with ETL and NLP",
      "summary": "A personal project that automates the search for junior data jobs: it collects from 5 sources, scores each job against a resume and sends applications through Gmail, with the pipeline running on GitHub Actions.",
      "problem": "Looking for a junior data job means checking several platforms every day, discarding what doesn't fit and sending resumes one by one. And postings with the recruiter's direct email show up almost only in LinkedIn posts.",
      "approach": "A Python ETL pipeline orchestrated on GitHub Actions, running 5 times a day: it extracts jobs from Gupy, Remotar, Sólides, GitHub and LinkedIn posts, removes cross-source duplicates, filters by field, level and location and loads them into PostgreSQL (Supabase), with an encrypted backup checked against the database. The fit score combines semantic similarity from multilingual embeddings (45%), skills (40%) and job track (15%), and adjusts to the jobs I apply to or discard. K-means on the embeddings groups jobs into types (number of groups picked by silhouette) and a skill-gap analysis shows which requested skills are missing from my resume. A Next.js site with login, batch emailing through a queue with a daily limit, Gmail reply detection over IMAP, a usage monitor for the free tiers and automated tests (pytest and Playwright) in CI.",
      "result": "Runs on its own 5 times a day: about 1,200 jobs read per run become a short list, with the score explained, the recruiter email ready to review and each application tracked until a reply. All on free tiers, open source."
    },
    "tags": [
      "Python",
      "GitHub Actions",
      "Embeddings (NLP)",
      "PostgreSQL",
      "Next.js"
    ],
    "github": "https://github.com/GabrielProzin/busca_vagas"
  },
  "wda": {
    "pt": {
      "title": "Sistema de Locação de Mesas e Cadeiras",
      "summary": "App web mobile-first que tirou do papel a gestão de aluguéis e despesas de um negócio de locação.",
      "problem": "O controle de aluguéis de mesas, cadeiras e forros era feito em anotações de papel, sem visão de agenda, valores do mês ou itens em uso.",
      "approach": "Aplicação em Next.js 15 com React 19 e TypeScript, dados no Firestore e login no Firebase Auth restrito a contas autorizadas. Cadastro em três etapas (cliente e itens, entrega, revisão) com cobrança automática por preço unitário ou valor combinado e frete por km; lista com busca e filtros por status e mês; controle de despesas em centavos, com litros para combustível. Regras do Firestore validam os campos, e a suíte de testes no Vitest roda a cada commit via Husky.",
      "result": "Em uso pelo cliente: um dashboard mensal com valor contratado comparado ao mês anterior, ticket médio, clientes únicos, itens em uso, histórico de 6 meses e agenda de entregas e devoluções, pensado para uso no celular."
    },
    "en": {
      "title": "Table & Chair Rental System",
      "summary": "Mobile-first web app that moved a rental business's bookings and expenses off paper.",
      "problem": "Table, chair and tablecloth rentals were tracked in paper notes, with no view of the schedule, the month's totals or the items currently out.",
      "approach": "A Next.js 15 app with React 19 and TypeScript, data in Firestore and Firebase Auth login limited to authorized accounts. Three-step booking form (customer and items, delivery, review) with automatic unit pricing or a flat agreed price plus per-km delivery fee; a list with search and status/month filters; expense tracking stored in cents, with liters for fuel. Firestore rules validate the fields, and the Vitest suite runs on every commit through Husky.",
      "result": "In use by the client: a monthly dashboard with contracted value against the previous month, average ticket, unique customers, items in use, a 6-month history and a delivery/return schedule, designed for phone use."
    },
    "tags": [
      "Next.js",
      "TypeScript",
      "Firebase",
      "Vitest"
    ],
    "github": "https://github.com/GabrielProzin/wdalocacao"
  },
  "af": {
    "pt": {
      "title": "Pipeline de Dados com Apache Airflow",
      "summary": "Coleta semanal automatizada de dados de uma API, orquestrada no Airflow.",
      "problem": "Automatizar a coleta recorrente de dados de uma API externa sem execução manual.",
      "approach": "DAG no Apache Airflow agendada para toda segunda-feira, com uma tarefa que cria a partição da semana e outra que extrai a previsão de 7 dias da API Visual Crossing. Ambiente em Docker Compose com CeleryExecutor, Redis e PostgreSQL.",
      "result": "A cada semana, os dados brutos e duas tabelas tratadas (temperaturas e condições) ficam salvos em uma pasta da semana, prontos para análise."
    },
    "en": {
      "title": "Data Pipeline with Apache Airflow",
      "summary": "Automated weekly data collection from an API, orchestrated in Airflow.",
      "problem": "Automate recurring data collection from an external API with no manual runs.",
      "approach": "An Apache Airflow DAG scheduled every Monday, with one task that creates the week's partition and another that pulls a 7-day forecast from the Visual Crossing API. Runs on Docker Compose with CeleryExecutor, Redis and PostgreSQL.",
      "result": "Every week, the raw data and two curated tables (temperatures and conditions) are saved to that week's folder, ready for analysis."
    },
    "tags": [
      "Python",
      "Apache Airflow",
      "Docker",
      "Pandas"
    ],
    "github": "https://github.com/GabrielProzin/MiniProjectAirflow"
  },
  "fr": {
    "pt": {
      "title": "Detecção de Fraudes",
      "summary": "Modelos que apontam transações de cartão com maior risco de fraude.",
      "problem": "Identificar transações com maior risco de fraude em cartões de crédito.",
      "approach": "Análise exploratória, preparação dos dados e comparação entre Logistic Regression e Random Forest, com apoio visual em Power BI.",
      "result": "Uma base analítica que ajuda a interpretar padrões de fraude e avaliar o desempenho dos modelos."
    },
    "en": {
      "title": "Fraud Detection",
      "summary": "Models that flag card transactions with the highest fraud risk.",
      "problem": "Identify credit card transactions with the highest risk of fraud.",
      "approach": "Exploratory analysis, data preparation and a comparison between Logistic Regression and Random Forest, with visual support in Power BI.",
      "result": "An analytical base that helps interpret fraud patterns and evaluate model performance."
    },
    "tags": [
      "Python",
      "Scikit-Learn",
      "Power BI"
    ],
    "github": "https://github.com/GabrielProzin/credit-card-fraud-detection-ml-bi"
  },
  "ac": {
    "pt": {
      "title": "Mercado de Ações",
      "summary": "Dashboard de tendências e comparação entre ativos da NASDAQ.",
      "problem": "Organizar dados do mercado acionário para facilitar comparações e leitura de tendências.",
      "approach": "Tratamento e estruturação de bases reais da NASDAQ e dashboards no Power BI com foco em análise temporal e comparação entre ativos.",
      "result": "Uma visualização clara para apoiar a exploração dos dados e a tomada de decisão."
    },
    "en": {
      "title": "Stock Market",
      "summary": "Dashboard of trends and comparisons across NASDAQ stocks.",
      "problem": "Organize stock market data to make comparisons and trends easy to read.",
      "approach": "Cleaning and structuring real NASDAQ data, with Power BI dashboards focused on time analysis and comparisons between stocks.",
      "result": "A clear visualization to support data exploration and decision-making."
    },
    "tags": [
      "Power BI",
      "DAX",
      "Time Intelligence"
    ],
    "github": "https://github.com/GabrielProzin/Projeto-Dashboard-Mercado-Acoes"
  },
  "gh": {
    "pt": {
      "title": "Perfil do GitHub animado",
      "summary": "Um README de perfil que se monta sozinho, com um retrato em ASCII, um cartão no estilo neofetch e o calendário de contribuições animados.",
      "problem": "O perfil do GitHub estava desatualizado, e os geradores de estatísticas hospedados por terceiros caem com frequência.",
      "approach": "Scripts em Python geram SVGs animados (SMIL e CSS), já que o GitHub não roda JavaScript no README: a foto vira ASCII com remoção de fundo (rembg), contraste local (CLAHE) e contornos (Sobel); o calendário lê a página pública de contribuições com requests e BeautifulSoup. Um GitHub Actions refaz o calendário todo dia e faz o commit.",
      "result": "Um perfil que se atualiza sozinho, sem token e sem serviço de terceiros, inspirado no post do Avi Vashishta."
    },
    "en": {
      "title": "Animated GitHub profile",
      "summary": "A profile README that builds itself, with an ASCII portrait, a neofetch-style card and an animated contribution calendar.",
      "problem": "The GitHub profile was out of date, and third-party hosted stats widgets often go down.",
      "approach": "Python scripts generate animated SVGs (SMIL and CSS), since GitHub runs no JavaScript in a README: the photo becomes ASCII with background removal (rembg), local contrast (CLAHE) and edges (Sobel); the calendar reads the public contributions page with requests and BeautifulSoup. A GitHub Actions job rebuilds the calendar every day and commits it.",
      "result": "A profile that updates itself, with no token and no third-party service, inspired by Avi Vashishta's post."
    },
    "tags": [
      "Python",
      "SVG",
      "OpenCV",
      "GitHub Actions"
    ],
    "github": "https://github.com/GabrielProzin/GabrielProzin"
  }
};
