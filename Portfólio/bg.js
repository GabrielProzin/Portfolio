// ============================================================
// FUNDO ANIMADO — milhares de "registros" em WebGL que viram
// gráficos diferentes conforme a página rola:
//   1. dados brutos (nuvem 3D)   2. agregação (barras)
//   3. machine learning (clusters)   4. tendência (série)
//   5. conexão (esfera de rede)
//
// Desempenho: todas as formas ficam pré-calculadas na GPU; a
// cada quadro só mudam alguns uniforms. O loop para quando a aba
// não está visível. Sem WebGL, o site segue normal sem o fundo.
// ============================================================

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = Array.from(document.querySelectorAll("[data-scene]"));
  if (!sections.length) return;

  const canvas = document.createElement("canvas");
  canvas.className = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false });
  if (!gl) {
    canvas.remove();
    return;
  }

  const small = window.innerWidth < 760;
  const N = small ? 2600 : 5200;

  // ---------------- Utilidades ----------------
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const gauss = () => {
    let u = 0;
    let v = 0;
    while (!u) u = rand();
    while (!v) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

  const C = {
    blue: hex("#3987e5"),
    violet: hex("#9085e9"),
    orange: hex("#d95926"),
    aqua: hex("#199e70"),
    ice: hex("#9ec5f4"),
    dim: hex("#3a64a0"),
  };

  // ---------------- Cenas (posições em [-1, 1]) ----------------
  function makeScene(fill) {
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const [x, y, z, c] = fill(i);
      pos.set([x, y, z], i * 3);
      col.set(c, i * 3);
    }
    return { pos, col };
  }

  // 1. Dados brutos: nuvem 3D irregular
  const cloud = makeScene(() => {
    const r = 0.55 + 0.15 * rand();
    const x = gauss() * 0.42 * r;
    const y = gauss() * 0.36 * r;
    const z = gauss() * 0.42 * r;
    const c = rand() < 0.75 ? C.blue : rand() < 0.5 ? C.violet : C.ice;
    return [x * 1.6, y * 1.6, z * 1.6, c];
  });

  // 2. Agregação: gráfico de barras (12 meses)
  const heights = [0.42, 0.55, 0.5, 0.68, 0.62, 0.8, 0.74, 0.95, 0.88, 1.12, 1.05, 1.36];
  const total = heights.reduce((a, b) => a + b, 0);
  const cumul = [];
  heights.reduce((acc, h, i) => ((cumul[i] = acc + h / total), acc + h / total), 0);
  const bars = makeScene((i) => {
    const u = i / N;
    if (u > 0.97) {
      // linha de base
      return [-1 + rand() * 2, -0.8, 0, C.dim];
    }
    const uu = u / 0.97;
    let b = cumul.findIndex((c) => uu <= c);
    if (b < 0) b = heights.length - 1;
    const bw = 0.11;
    const x = -0.95 + b * 0.172 + rand() * bw;
    const y = -0.8 + rand() * heights[b] * 1.12;
    const col = b === heights.length - 1 ? C.orange : b % 2 ? C.blue : C.ice;
    return [x, y, (rand() - 0.5) * 0.04, col];
  });

  // 3. Machine learning: três clusters (k-means, k = 3)
  const clusterCenters = [
    [-0.5, 0.35, C.orange],
    [0.45, 0.45, C.violet],
    [0.05, -0.45, C.aqua],
  ];
  const clusters = makeScene((i) => {
    const k = i % 3;
    const [cx, cy, col] = clusterCenters[k];
    const spread = 0.17 + 0.05 * k;
    // 3% dos pontos desenham o círculo de cada centroide
    if (rand() < 0.03) {
      const a = rand() * Math.PI * 2;
      return [cx + Math.cos(a) * 0.08, cy + Math.sin(a) * 0.08, 0, C.ice];
    }
    return [cx + gauss() * spread, cy + gauss() * spread * 0.85, gauss() * 0.05, col];
  });

  // 4. Tendência: série temporal com área e previsão
  const f = (x) => -0.12 + 0.42 * Math.sin(x * 2.1 + 0.6) * 0.6 + 0.38 * x + 0.08 * Math.sin(x * 9);
  const series = makeScene(() => {
    const r = rand();
    if (r < 0.5) {
      // a linha
      const x = -1 + rand() * 1.6;
      return [x, f(x) + gauss() * 0.012, 0, C.aqua];
    }
    if (r < 0.62) {
      // previsão com faixa que se abre
      const x = 0.6 + rand() * 0.4;
      const w = (x - 0.6) * 0.45;
      return [x, f(x) + gauss() * w * 0.5, 0, C.orange];
    }
    // área sob a curva, mais densa perto da linha
    const x = -1 + rand() * 1.6;
    const top = f(x);
    const depth = Math.pow(rand(), 2.2);
    return [x, top - depth * (top + 0.85), 0, C.dim];
  });

  // 5. Conexão: esfera (distribuição de Fibonacci)
  const golden = Math.PI * (3 - Math.sqrt(5));
  const sphere = makeScene((i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const r = 0.82;
    const col = y > 0.35 ? C.violet : y < -0.35 ? C.aqua : C.blue;
    return [Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r, col];
  });

  const SCENES = [
    { data: cloud, rot: 1, jitter: 1.4, label: "dados brutos", metric: () => `n = ${N.toLocaleString("pt-BR")} registros` },
    { data: bars, rot: 0, jitter: 0.5, label: "agregação", metric: () => "12 meses agregados" },
    { data: clusters, rot: 0, jitter: 0.8, label: "machine learning", metric: () => "k-means, k = 3" },
    { data: series, rot: 0, jitter: 0.4, label: "tendência", metric: () => "série + previsão" },
    { data: sphere, rot: 1, jitter: 0.3, label: "conexão", metric: () => "vamos conversar" },
  ].slice(0, sections.length);

  // ---------------- Shaders ----------------
  const vs = `
    attribute vec3 aA; attribute vec3 aB;
    attribute vec3 aCA; attribute vec3 aCB;
    attribute vec2 aSeed;
    uniform float uMix, uTime, uAspect, uScale, uSize, uRotA, uRotB, uJitA, uJitB;
    uniform vec2 uOffset, uMouse;
    varying vec3 vColor; varying float vAlpha;

    vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
    vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }

    void main() {
      // cada ponto começa a transição num instante diferente (efeito orgânico)
      float d = aSeed.x * 0.45;
      float t = clamp((uMix - d) / (1.0 - 0.45), 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);

      float ang = uTime * 0.18;
      vec3 a = mix(aA, rotX(rotY(aA, ang), 0.35), uRotA);
      vec3 b = mix(aB, rotX(rotY(aB, ang), 0.35), uRotB);
      vec3 p = mix(a, b, t);

      // no meio da transição os pontos fazem um arco
      float arc = sin(3.14159 * t);
      float th = aSeed.y * 6.2831;
      p.xy += vec2(cos(th), sin(th)) * arc * 0.22;

      // respiração leve
      float jit = mix(uJitA, uJitB, t);
      p.x += sin(uTime * 0.7 + aSeed.y * 40.0) * 0.006 * jit;
      p.y += cos(uTime * 0.6 + aSeed.y * 31.0) * 0.006 * jit;

      float persp = 1.0 / (1.0 + p.z * 0.45);
      vec2 xy = p.xy * uScale * persp + uOffset + uMouse * (0.02 + 0.03 * (p.z + 1.0));
      gl_Position = vec4(xy.x / uAspect, xy.y, 0.0, 1.0);
      gl_PointSize = uSize * persp * (0.75 + aSeed.y * 0.5);

      vColor = mix(aCA, aCB, t);
      vAlpha = clamp(0.55 + (0.5 - p.z * 0.6), 0.25, 1.0);
    }
  `;
  const fs = `
    precision mediump float;
    uniform float uAlpha;
    varying vec3 vColor; varying float vAlpha;
    void main() {
      float r = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.05, r);
      gl_FragColor = vec4(vColor * 1.25, a * vAlpha * uAlpha);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (err) {
    console.warn("Fundo animado desativado:", err);
    canvas.remove();
    return;
  }
  gl.useProgram(prog);

  const attr = (name) => gl.getAttribLocation(prog, name);
  const uni = (name) => gl.getUniformLocation(prog, name);
  const loc = {
    aA: attr("aA"), aB: attr("aB"), aCA: attr("aCA"), aCB: attr("aCB"), aSeed: attr("aSeed"),
    uMix: uni("uMix"), uTime: uni("uTime"), uAspect: uni("uAspect"), uScale: uni("uScale"),
    uSize: uni("uSize"), uRotA: uni("uRotA"), uRotB: uni("uRotB"), uJitA: uni("uJitA"),
    uJitB: uni("uJitB"), uOffset: uni("uOffset"), uMouse: uni("uMouse"), uAlpha: uni("uAlpha"),
  };

  const buffer = (data) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };

  // tudo na GPU de uma vez; trocar de cena é só apontar para outro buffer
  SCENES.forEach((s) => {
    s.posBuf = buffer(s.data.pos);
    s.colBuf = buffer(s.data.col);
  });
  const seeds = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    seeds[i * 2] = rand();
    seeds[i * 2 + 1] = rand();
  }
  const seedBuf = buffer(seeds);

  function bindAttr(location, buf, size) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  }
  bindAttr(loc.aSeed, seedBuf, 2);

  let boundPair = "";
  function bindPair(i, j) {
    const key = `${i}-${j}`;
    if (key === boundPair) return;
    boundPair = key;
    bindAttr(loc.aA, SCENES[i].posBuf, 3);
    bindAttr(loc.aB, SCENES[j].posBuf, 3);
    bindAttr(loc.aCA, SCENES[i].colBuf, 3);
    bindAttr(loc.aCB, SCENES[j].colBuf, 3);
    gl.uniform1f(loc.uRotA, SCENES[i].rot);
    gl.uniform1f(loc.uRotB, SCENES[j].rot);
    gl.uniform1f(loc.uJitA, SCENES[i].jitter);
    gl.uniform1f(loc.uJitB, SCENES[j].jitter);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // aditivo: áreas densas brilham
  gl.clearColor(0, 0, 0, 0);

  // ---------------- Tamanho e layout ----------------
  let W = 0;
  let H = 0;
  let baseAlpha = 1;
  let focus = 1; // 1 quando uma cena está no centro da tela
  let dpr = 1;
  let aspect = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = W / H;

    const wide = W >= 1000;
    // no desktop o gráfico fica à direita; no celular, centralizado e mais discreto
    const scale = wide ? 0.62 : Math.min(0.7, aspect * 0.85);
    const offsetX = wide ? aspect * 0.42 : 0;
    gl.uniform1f(loc.uAspect, aspect);
    gl.uniform1f(loc.uScale, scale);
    // no celular o gráfico fica na metade de baixo, abaixo dos títulos
    gl.uniform2f(loc.uOffset, offsetX, wide ? -0.02 : -0.38);
    gl.uniform1f(loc.uSize, (wide ? 4.2 : 3.4) * dpr);
    baseAlpha = wide ? 1 : 0.7;
    measure();
  }

  // ---------------- Scroll → cena ----------------
  let centers = [];
  function measure() {
    centers = sections.map((s) => {
      const r = s.getBoundingClientRect();
      return r.top + window.scrollY + Math.min(r.height, H) / 2;
    });
  }

  function targetProgress() {
    const mid = window.scrollY + H / 2;
    if (mid <= centers[0]) return 0;
    for (let i = 0; i < centers.length - 1; i++) {
      if (mid < centers[i + 1]) return i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
    }
    // fim da página: garante a última cena
    return centers.length - 1;
  }

  // ---------------- HUD ----------------
  const hud = document.querySelector(".hud");
  const hudIndex = hud?.querySelector(".hud__index");
  const hudLabel = hud?.querySelector(".hud__label");
  const hudMetric = hud?.querySelector(".hud__metric");
  const hudBar = hud?.querySelector(".hud__bar i");
  let hudScene = -1;

  // texto que "embaralha" números antes de assentar
  function scramble(el, text) {
    if (!el) return;
    if (reduceMotion) {
      el.textContent = text;
      return;
    }
    const digits = "0123456789";
    const start = performance.now();
    const dur = 420;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const fixed = Math.floor(text.length * p);
      let out = text.slice(0, fixed);
      for (let i = fixed; i < text.length; i++) {
        out += text[i] === " " ? " " : digits[(Math.random() * 10) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function updateHud(p) {
    if (!hud) return;
    const s = Math.round(p);
    if (hudBar) hudBar.style.transform = `scaleX(${(p / (SCENES.length - 1)).toFixed(3)})`;
    if (s === hudScene) return;
    hudScene = s;
    if (hudIndex) hudIndex.textContent = `0${s + 1}`;
    scramble(hudLabel, SCENES[s].label);
    scramble(hudMetric, SCENES[s].metric());
  }

  // ---------------- Mouse (parallax) ----------------
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    window.addEventListener(
      "pointermove",
      (e) => {
        mouse.tx = (e.clientX / W) * 2 - 1;
        mouse.ty = -((e.clientY / H) * 2 - 1);
      },
      { passive: true }
    );
  }

  // ---------------- Loop ----------------
  let progress = 0;
  let raf = 0;
  let last = performance.now();
  let time = 0;

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    // o progresso segue o scroll com inércia
    const target = targetProgress();
    progress += (target - progress) * Math.min(1, dt * 5);
    if (Math.abs(target - progress) < 0.0005) progress = target;

    // fundo mais forte nas "pausas", mais discreto sob o conteúdo
    const mid = window.scrollY + H / 2;
    const dist = Math.min(...centers.map((c) => Math.abs(c - mid)));
    const targetFocus = 1 - Math.min(1, dist / (H * 0.75));
    focus += (targetFocus - focus) * Math.min(1, dt * 4);

    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);

    draw();
    raf = requestAnimationFrame(frame);
  }

  function draw() {
    const i = Math.min(SCENES.length - 1, Math.floor(progress));
    const j = Math.min(SCENES.length - 1, i + 1);
    const frac = progress - i;
    // a forma fica "pronta" enquanto a seção está no centro
    // a forma se mantém durante o conteúdo e se transforma quando a próxima "pausa" chega
    const k = Math.min(1, Math.max(0, (frac - 0.4) / 0.5));
    const e = k * k * (3 - 2 * k);
    bindPair(i, j);
    gl.uniform1f(loc.uMix, i === j ? 0 : e);
    gl.uniform1f(loc.uTime, time);
    gl.uniform2f(loc.uMouse, mouse.x, mouse.y);
    gl.uniform1f(loc.uAlpha, baseAlpha * (0.35 + 0.65 * focus));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    updateHud(progress);
  }

  function start() {
    if (raf || reduceMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  resize();
  progress = targetProgress();
  window.addEventListener("resize", resize);
  // a altura das seções muda quando fontes e imagens carregam
  window.addEventListener("load", measure);
  document.fonts?.ready.then(measure);
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(document.body);

  if (reduceMotion) {
    // sem animação contínua: redesenha só quando rola
    const still = () => {
      progress = targetProgress();
      focus = 1;
      draw();
    };
    window.addEventListener("scroll", still, { passive: true });
    still();
  } else {
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    start();
    // entrada: a nuvem "acende"
    canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, easing: "ease-out" });
  }

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    stop();
  });
})();
