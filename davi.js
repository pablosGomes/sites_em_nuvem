/* ==========================================================================
   SUBNAUTICA — PÁGINA INFORMATIVA
   ========================================================================== */

document.getElementById('ano').textContent = new Date().getFullYear();

const SHOT = (app, hash) =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${app}/ss_${hash}.1920x1080.jpg`;
const SHOT2 = (app, hash) =>
  `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${app}/${hash}/ss_${hash}.1920x1080.jpg`;

/* ==========================================================================
   1. PERFIL DE PROFUNDIDADE
   Faixas aproximadas: os biomas se sobrepõem no mapa real do jogo.
   ========================================================================== */
const faixas = [
  {
    prof: '0 – 80 m', nome: 'Recifes rasos', risco: 'seguro', cor: 'var(--teal)',
    texto: 'Água clara, cardumes inofensivos e boa parte dos recursos básicos. É onde a cápsula de escape cai e onde quase todo mundo constrói a primeira base.'
  },
  {
    prof: '0 – 160 m', nome: 'Floresta de algas', risco: 'atenção', cor: 'var(--amber)',
    texto: 'Talos gigantes que bloqueiam a visão e escondem predadores de porte médio. Fonte importante de sementes e de um dos primeiros materiais de construção.'
  },
  {
    prof: '80 – 250 m', nome: 'Floresta de cogumelos', risco: 'atenção', cor: 'var(--amber)',
    texto: 'Estruturas enormes em forma de cogumelo, com destroços espalhados entre elas. A luz já começa a ficar escassa.'
  },
  {
    prof: '200 – 300 m', nome: 'Grande recife', risco: 'perigo', cor: 'var(--danger)',
    texto: 'Penhascos que descem para o azul-escuro. Aqui aparecem criaturas grandes o suficiente para danificar um veículo.'
  },
  {
    prof: '250 – 500 m', nome: 'Algas sanguíneas', risco: 'perigo', cor: 'var(--danger)',
    texto: 'Zona quase sem luz natural, dominada por algas vermelho-escuras. Guarda recursos raros e um dos caminhos para o subsolo.'
  },
  {
    prof: '600 – 1000 m', nome: 'Rio Perdido', risco: 'perigo', cor: 'var(--danger)',
    texto: 'Um rio de água salgada mais densa correndo dentro de cavernas, com ossadas gigantes nas margens. É a porta de entrada para o fundo do planeta.'
  },
  {
    prof: '1200 – 1700 m', nome: 'Zona de lava', risco: 'extremo', cor: 'var(--danger)',
    texto: 'Calor, rocha derretida e as maiores instalações alienígenas do jogo. Chegar até aqui exige o equipamento mais avançado disponível.'
  }
];

document.getElementById('depthChart').innerHTML = faixas.map((f, i) => `
  <div class="depth-row">
    <div class="depth-mark">${f.prof}</div>
    <div class="depth-body" role="button" tabindex="0" aria-expanded="false"
         aria-label="${f.nome}, ${f.prof}">
      <h3>
        ${f.nome}
        <span class="depth-danger" style="color:${f.cor}">${f.risco}</span>
      </h3>
      <div class="depth-detail"><p style="margin:0; font-size:0.94rem; color:var(--muted)">${f.texto}</p></div>
    </div>
  </div>
`).join('');

document.querySelectorAll('.depth-body').forEach(faixa => {
  const alternar = () => {
    const aberta = faixa.classList.toggle('open');
    faixa.setAttribute('aria-expanded', String(aberta));
  };
  faixa.addEventListener('click', alternar);
  faixa.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); }
  });
});

/* ==========================================================================
   2. CRIATURAS
   Só identifico pelo nome o que dá para reconhecer com segurança na imagem;
   o resto fica com descrição da cena.
   ========================================================================== */
const criaturas = [
  {
    nome: 'Reaper Leviathan', tipo: 'Leviatã · hostil',
    img: SHOT('264710', '883a98ad56021ce409219e1b749818866b6115cd'),
    alt: 'Reaper Leviathan, criatura gigante de mandíbulas abertas, diante de um traje Prawn',
    texto: 'O predador mais conhecido da série. Anuncia-se por um rugido que se ouve muito antes de aparecer — e é justamente o som que torna o encontro assustador.'
  },
  {
    nome: 'Fauna bioluminescente', tipo: 'Passiva',
    img: SHOT('264710', '5f2f2ea498cdc632cbffd6cf37c1a09670eb3272'),
    alt: 'Criatura de grande porte coberta de pontos bioluminescentes nadando sobre o recife',
    texto: 'Boa parte da vida de 4546B brilha no escuro. Nem tudo que é enorme é perigoso: existem gigantes completamente pacíficos.'
  },
  {
    nome: 'Predadores das algas', tipo: 'Hostil · médio porte',
    img: SHOT('264710', 'b28404f3d108cc15aebbb2c3d7cb17e587225662'),
    alt: 'Criatura predadora entre algas gigantes na floresta de kelp',
    texto: 'Na floresta de algas a visibilidade é curta e o ataque quase sempre vem de fora do campo de visão. É o primeiro susto de verdade da maioria dos jogadores.'
  }
];

document.getElementById('creatureGrid').innerHTML = criaturas.map((c, i) => `
  <article class="card reveal" style="--i:${i}; overflow:hidden">
    <div class="media scrim" style="aspect-ratio:16/10">
      <img src="${c.img}" alt="${c.alt}" loading="lazy">
    </div>
    <div style="padding:1.6rem">
      <span class="t-label" style="color:var(--cyan-dim); display:block; margin-bottom:0.4rem">${c.tipo}</span>
      <h3 class="t-h3 font-ui" style="margin-bottom:0.6rem">${c.nome}</h3>
      <p style="font-size:0.94rem; color:var(--muted); margin:0">${c.texto}</p>
    </div>
  </article>
`).join('');

/* ==========================================================================
   3. VEÍCULOS
   ========================================================================== */
const veiculos = [
  {
    nome: 'Seamoth', prof: 'até ~900 m com atualizações',
    img: SHOT('264710', 'e182b6b20bb797500f9f63c561586d920d44e37c'),
    alt: 'Seamoth, submarino pequeno de um ocupante, sobre um recife colorido',
    texto: 'Submarino pequeno e rápido, para um ocupante. É o primeiro passo para sair da zona rasa com alguma segurança.'
  },
  {
    nome: 'Prawn Suit', prof: 'até ~1700 m com atualizações',
    img: SHOT('264710', '970a13f246e33e0df26d93baf9f8e975732adb4b'),
    alt: 'Traje Prawn, exoesqueleto de mineração, dentro de uma caverna de lava',
    texto: 'Um exoesqueleto que anda no fundo em vez de nadar. Perfura rocha, resiste à pressão extrema e é o que leva o jogador à zona de lava.'
  },
  {
    nome: 'Cyclops', prof: 'até ~1700 m com atualizações',
    img: SHOT('264710', '9fdfcc7572ae22b4afa21e6de3b23c962ca5bb55'),
    alt: 'Cyclops, submarino grande, navegando sobre o fundo do oceano',
    texto: 'Submarino grande o bastante para servir de base móvel: guarda veículos menores, tem fabricador dentro e faz barulho suficiente para atrair leviatãs.'
  }
];

document.getElementById('vehicleGrid').innerHTML = veiculos.map((v, i) => `
  <article class="card reveal" style="--i:${i}; overflow:hidden">
    <div class="media scrim" style="aspect-ratio:16/10">
      <img src="${v.img}" alt="${v.alt}" loading="lazy">
    </div>
    <div style="padding:1.6rem">
      <h3 class="t-h3 font-ui" style="margin-bottom:0.3rem">${v.nome}</h3>
      <span class="t-label" style="color:var(--cyan-dim); display:block; margin-bottom:0.7rem">${v.prof}</span>
      <p style="font-size:0.94rem; color:var(--muted); margin:0">${v.texto}</p>
    </div>
  </article>
`).join('');

/* ==========================================================================
   4. GALERIA
   ========================================================================== */
const galeria = [
  { img: SHOT('264710', '623579a6693f6fc48033e619cacc4306f10eef15'), cap: 'Recifes rasos e a primeira base' },
  { img: SHOT('264710', 'cebc378d2f7bc78978c21db4e3c5e12ccd067349'), cap: 'Habitat submarino de vários módulos' },
  { img: SHOT('264710', '0ace7f8b4350b8fbdd16345a76bc30545256e918'), cap: 'Caverna profunda com vida bioluminescente' },
  { img: SHOT('264710', 'f0eeabe108c2bc2b3e370b9828fb280035b50db2'), cap: 'Interior de um submarino em imersão' },
  { img: SHOT('848450', '5011daad83f8494eda0826e4bbc91181239ad5d7'), cap: 'Below Zero · vida sob o gelo' },
  { img: SHOT('848450', '9e3d6ab0db5442f7bcbeb923da47d3a80023f50f'), cap: 'Below Zero · superfície congelada' }
];

document.getElementById('galleryGrid').innerHTML = galeria.map(g => `
  <figure class="gallery-item" data-full="${g.img}" data-cap="${g.cap}" role="button" tabindex="0"
          aria-label="Ampliar: ${g.cap}" style="margin:0">
    <img src="${g.img}" alt="${g.cap}" loading="lazy">
    <figcaption>${g.cap}</figcaption>
  </figure>
`).join('');

/* Ampliação */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');

function abrirAmpliacao(item) {
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.dataset.cap;
  lightboxCap.textContent = item.dataset.cap;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function fecharAmpliacao() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => abrirAmpliacao(item));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirAmpliacao(item); }
  });
});
document.getElementById('lightboxClose').addEventListener('click', fecharAmpliacao);
lightbox.addEventListener('click', e => { if (e.target === lightbox) fecharAmpliacao(); });
window.addEventListener('keydown', e => { if (e.key === 'Escape') fecharAmpliacao(); });

/* ==========================================================================
   5. OS TRÊS JOGOS
   ========================================================================== */
const jogos = [
  {
    nome: 'Subnautica', ano: '2018',
    img: SHOT('264710', '623579a6693f6fc48033e619cacc4306f10eef15'),
    alt: 'Recife raso de Subnautica',
    texto: 'O original. Um sobrevivente, o oceano de 4546B e a descoberta de por que ninguém pode sair do planeta.'
  },
  {
    nome: 'Below Zero', ano: '2021',
    img: SHOT('848450', '9e3d6ab0db5442f7bcbeb923da47d3a80023f50f'),
    alt: 'Paisagem congelada de Subnautica Below Zero',
    texto: 'Passado dois anos depois, na região ártica do mesmo planeta. Traz seções na superfície, no gelo, além do mergulho.'
  },
  {
    nome: 'Subnautica 2', ano: '2026 · acesso antecipado',
    img: SHOT2('1962700', '823b102b09530bbf588f5e9752cb52f1681dc992'),
    alt: 'Base submarina em Subnautica 2',
    texto: 'Um mundo alienígena inteiramente novo, e a maior mudança da série: dá para jogar sozinho ou em cooperativo de até quatro pessoas.'
  }
];

document.getElementById('gamesGrid').innerHTML = jogos.map((j, i) => `
  <article class="card reveal" style="--i:${i}; overflow:hidden">
    <div class="media scrim" style="aspect-ratio:16/9">
      <img src="${j.img}" alt="${j.alt}" loading="lazy">
    </div>
    <div style="padding:1.6rem">
      <span class="t-label" style="color:var(--cyan-dim); display:block; margin-bottom:0.4rem">${j.ano}</span>
      <h3 class="t-h3 font-ui" style="margin-bottom:0.6rem">${j.nome}</h3>
      <p style="font-size:0.94rem; color:var(--muted); margin:0">${j.texto}</p>
    </div>
  </article>
`).join('');

/* ==========================================================================
   6. REVELAÇÃO AO ROLAR
   Registrada por função: as fichas acima são criadas por script e precisam
   entrar na mesma observação, senão nasceriam invisíveis.
   ========================================================================== */
const revelador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    revelador.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

function observarRevelacoes(raiz = document) {
  raiz.querySelectorAll('.reveal').forEach(el => revelador.observe(el));
}
observarRevelacoes();

/* ==========================================================================
   7. RÉGUA DE PROFUNDIDADE (NAVEGAÇÃO)
   Em vez de uma barra no topo, a navegação é a própria escala de mergulho:
   cada seção ocupa uma profundidade e o cursor desce junto com a leitura.
   ========================================================================== */
const PROFUNDIDADE_MAX = 1700;

const paradas = [
  { id: 'topo',          nome: 'Superfície',    m: 0 },
  { id: 'historia',      nome: 'A Aurora',      m: 120 },
  { id: 'profundidade',  nome: 'Profundidade',  m: 340 },
  { id: 'criaturas',     nome: 'Criaturas',     m: 600 },
  { id: 'sobrevivencia', nome: 'Sobrevivência', m: 900 },
  { id: 'veiculos',      nome: 'Veículos',      m: 1200 },
  { id: 'galeria',       nome: 'Galeria',       m: 1450 },
  { id: 'jogos',         nome: 'Os jogos',      m: 1700 }
];

const railScale = document.getElementById('railScale');
const railCursor = document.getElementById('railCursor');
const depthVal = document.getElementById('depthVal');

railScale.insertAdjacentHTML('beforeend', paradas.map(p => `
  <a class="rail-stop" href="#${p.id}" data-sec="${p.id}">
    ${p.nome}<span class="m">${p.m} m</span>
  </a>
`).join(''));

const stops = [...railScale.querySelectorAll('.rail-stop')];

/* Leitura de profundidade e escurecimento do fundo acompanham a rolagem */
const toTop = document.getElementById('toTop');
let ticking = false;

function atualizarProfundidade() {
  const percorrivel = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = percorrivel > 0 ? Math.min(window.scrollY / percorrivel, 1) : 0;

  depthVal.textContent = Math.round(progresso * PROFUNDIDADE_MAX);
  // Alimenta o degradê do fundo: 0 na superfície, 1 no abismo
  document.documentElement.style.setProperty('--depth', progresso.toFixed(3));

  // O cursor percorre a mesma fração da altura da régua
  const trilho = railScale.getBoundingClientRect().height;
  if (trilho > 0) railCursor.style.top = `${progresso * trilho}px`;

  toTop.classList.toggle('show', window.scrollY > 700);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(atualizarProfundidade);
}, { passive: true });

window.addEventListener('resize', atualizarProfundidade);
atualizarProfundidade();

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Marca a parada correspondente à seção que está sendo lida */
const observadorSecao = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    stops.forEach(s => s.classList.toggle('active', s.dataset.sec === e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(s => observadorSecao.observe(s));

/* Nas telas estreitas a escala vira um painel que abre */
const railToggle = document.getElementById('railToggle');

railToggle.addEventListener('click', () => {
  const abrindo = !railScale.classList.contains('open');
  railScale.classList.toggle('open', abrindo);
  railToggle.setAttribute('aria-expanded', String(abrindo));
  railToggle.textContent = abrindo ? 'FECHAR' : 'ESCALA';
});

stops.forEach(s => s.addEventListener('click', () => {
  railScale.classList.remove('open');
  railToggle.setAttribute('aria-expanded', 'false');
  railToggle.textContent = 'ESCALA';
}));

/* ==========================================================================
   8. PARTÍCULAS SUSPENSAS NA ÁGUA
   ========================================================================== */
const canvas = document.getElementById('motes');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  let particulas = [];
  let raf = null;

  function dimensionar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const qtd = Math.min(60, Math.floor(window.innerWidth / 26));
    particulas = Array.from({ length: qtd }, () => criar(true));
  }

  function criar(inicial) {
    return {
      x: Math.random() * canvas.width,
      y: inicial ? Math.random() * canvas.height : canvas.height + 8,
      r: 0.5 + Math.random() * 1.6,
      vy: 0.1 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.18,
      a: 0.15 + Math.random() * 0.35,
      fase: Math.random() * Math.PI * 2
    };
  }

  function desenhar(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach((p, i) => {
      const pulso = 0.6 + 0.4 * Math.sin(t / 1100 + p.fase);
      ctx.fillStyle = `rgba(150, 230, 255, ${p.a * pulso})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.vy;
      p.x += p.vx + Math.sin(t / 1800 + p.fase) * 0.1;
      if (p.y < -8) particulas[i] = criar(false);
    });
    raf = requestAnimationFrame(desenhar);
  }

  dimensionar();
  raf = requestAnimationFrame(desenhar);
  window.addEventListener('resize', dimensionar);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(desenhar);
  });
}
