/* ==========================================================================
   ELDEN RING — Terras Intermédias
   Bibliotecas: GSAP + ScrollTrigger (cinemática de rolagem) e Lenis (inércia).
   ========================================================================== */

const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('ano').textContent = new Date().getFullYear();

/* ==========================================================================
   1. ROLAGEM COM INÉRCIA
   O peso da rolagem é metade da sensação: no jogo nada se move seco.
   ========================================================================== */
gsap.registerPlugin(ScrollTrigger);

let lenis = null;
if (!reduzirMovimento) {
  lenis = new Lenis({
    duration: 1.35,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  // Lenis e ScrollTrigger precisam compartilhar o mesmo relógio, senão as
  // animações de rolagem ficam meio quadro atrasadas em relação à página.
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Âncoras do menu passam a usar a rolagem suave da Lenis
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const alvo = document.querySelector(link.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(alvo, { offset: -70 });
    else alvo.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ==========================================================================
   2. TELA DE CARREGAMENTO
   Dicas no estilo das que o jogo mostra entre as áreas.
   ========================================================================== */
const dicas = [
  'Nem todo inimigo precisa ser enfrentado. Fugir também é uma tática.',
  'A orientação da graça aponta um caminho — nunca o único.',
  'Descansar em um Sítio de Graça restaura os frascos, mas revive os inimigos.',
  'Se um caminho parece difícil demais, talvez seja mesmo. Volte depois.',
  'Torrent pode alcançar lugares altos usando as correntes de vento.',
  'Ataques carregados quebram a postura de inimigos maiores.'
];

const loader = document.getElementById('loader');
const loaderTip = document.getElementById('loaderTip');
loaderTip.textContent = dicas[Math.floor(Math.random() * dicas.length)];

function encerrarCarregamento() {
  loader.classList.add('done');
  document.getElementById('hud').classList.add('on');
  document.getElementById('runes').classList.add('on');
  animarAbertura();
}

// Espera as imagens de abertura ou um teto de tempo — o que vier primeiro,
// para a página nunca ficar presa numa imagem lenta.
const heroImg = document.getElementById('heroImg');
const heroLogo = document.getElementById('heroLogo');
let prontos = 0;
const precisa = 2;

function contar() {
  if (++prontos >= precisa) setTimeout(encerrarCarregamento, 500);
}
[heroImg, heroLogo].forEach(img => {
  if (img.complete) contar();
  else { img.addEventListener('load', contar); img.addEventListener('error', contar); }
});
setTimeout(encerrarCarregamento, 4000);

/* ==========================================================================
   3. ABERTURA — entrada encadeada, como a tela de título do jogo
   ========================================================================== */
let aberturaFeita = false;
function animarAbertura() {
  if (aberturaFeita) return;
  aberturaFeita = true;

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#heroEyebrow', { opacity: 0, y: 14, duration: 1.2 })
    .from('#heroLogo', { opacity: 0, scale: 1.06, duration: 2.2 }, '-=0.7')
    .from('#heroLine', { opacity: 0, y: 18, duration: 1.4 }, '-=1.3')
    .from('#heroCta', { opacity: 0, y: 14, duration: 1.1 }, '-=0.9')
    .from('#scrollCue', { opacity: 0, duration: 1 }, '-=0.6');

  if (!reduzirMovimento) {
    gsap.to('#scrollCue', { y: 10, repeat: -1, yoyo: true, duration: 1.5, ease: 'sine.inOut' });
  }
}

/* ==========================================================================
   4. REVELAÇÃO AO ROLAR E PARALAXE
   ========================================================================== */
/* Precisa ser função, e não uma varredura única: as fichas de classe e de
   semideus só existem depois que o script as monta. Se registrasse uma vez
   só aqui, elas nasceriam já escondidas e nunca seriam reveladas. */
function registrarRevelacoes(raiz = document) {
  raiz.querySelectorAll('.rise').forEach(el => {
    if (el.dataset.revelado) return;
    el.dataset.revelado = '1';
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}
registrarRevelacoes();

if (!reduzirMovimento) {
  // A imagem de abertura desce mais devagar que a página. O deslocamento é
  // simétrico (-7% a +7%) para consumir a sobra dos dois lados por igual.
  gsap.fromTo('#heroImg',
    { yPercent: -7 },
    {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '#topo', start: 'top top', end: 'bottom top', scrub: true }
    });
}

/* ==========================================================================
   5. PARTÍCULAS DOURADAS
   As faíscas da Árvore Áurea que sobem por toda parte no jogo.
   ========================================================================== */
const canvas = document.getElementById('motes');
if (canvas && !reduzirMovimento) {
  const ctx = canvas.getContext('2d');
  let motes = [];
  let raf = null;

  function dimensionar() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const qtd = Math.min(70, Math.floor(window.innerWidth / 22));
    motes = Array.from({ length: qtd }, () => criarMote(true));
  }

  function criarMote(inicial) {
    return {
      x: Math.random() * canvas.width,
      y: inicial ? Math.random() * canvas.height : canvas.height + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.15 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      brilho: 0.25 + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2
    };
  }

  function desenhar(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    motes.forEach((m, i) => {
      // A oscilação faz a faísca "respirar" em vez de subir reta
      const pulso = 0.55 + 0.45 * Math.sin(t / 900 + m.fase);
      const a = m.brilho * pulso;

      const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      g.addColorStop(0, `rgba(255, 226, 150, ${a})`);
      g.addColorStop(0.4, `rgba(201, 162, 39, ${a * 0.45})`);
      g.addColorStop(1, 'rgba(201, 162, 39, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
      ctx.fill();

      m.y -= m.vy;
      m.x += m.vx + Math.sin(t / 1400 + m.fase) * 0.14;
      if (m.y < -12) motes[i] = criarMote(false);
    });
    raf = requestAnimationFrame(desenhar);
  }

  dimensionar();
  raf = requestAnimationFrame(desenhar);
  window.addEventListener('resize', dimensionar);

  // Aba oculta não precisa desenhar
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) raf = requestAnimationFrame(desenhar);
  });
}

/* ==========================================================================
   6. AVISOS DE ITEM E FAIXAS
   ========================================================================== */
const pickups = document.getElementById('pickups');
function avisarItem(texto) {
  const el = document.createElement('div');
  el.className = 'pickup';
  el.textContent = texto;
  pickups.appendChild(el);
  setTimeout(() => el.remove(), 4300);
}

const banner = document.getElementById('banner');
const bannerText = document.getElementById('bannerText');
let bannerOcupado = false;

function mostrarFaixa(texto, morte = false) {
  if (bannerOcupado) return;
  bannerOcupado = true;
  bannerText.textContent = texto;
  banner.classList.toggle('death', morte);
  banner.classList.remove('show');
  void banner.offsetWidth;          // reinicia a animação
  banner.classList.add('show');
  // Precisa acompanhar a duração da animação em pablo.css (3.8s)
  setTimeout(() => { banner.classList.remove('show'); bannerOcupado = false; }, 3900);
}

/* Cada seção entrega um item, como avançar de área no jogo */
const itensPorSecao = {
  prologo: 'Mapa de Limgrave obtido',
  terras: 'Semente Dourada obtida',
  graca: 'Frasco de Lágrimas Carmesins +1',
  classes: 'Memória de Pedra obtida',
  semideuses: 'Grande Runa obtida',
  sombra: 'Ramo de Scadutree +1'
};

Object.entries(itensPorSecao).forEach(([id, item]) => {
  const secao = document.getElementById(id);
  if (!secao) return;
  ScrollTrigger.create({
    trigger: secao, start: 'top 60%', once: true,
    onEnter: () => avisarItem(item)
  });
});

/* ==========================================================================
   7. CONTADOR DE RUNAS — sobe conforme a página avança
   ========================================================================== */
const runeCount = document.getElementById('runeCount');
const TOTAL_RUNAS = 152340;
let runasMostradas = 0;

ScrollTrigger.create({
  start: 0, end: 'max',
  onUpdate: (self) => {
    const alvo = Math.floor(self.progress * TOTAL_RUNAS);
    // Sobe suave em vez de saltar junto com a rolagem
    runasMostradas += (alvo - runasMostradas) * 0.12;
    runeCount.textContent = Math.floor(runasMostradas).toLocaleString('pt-BR');
  }
});

/* ==========================================================================
   8. CLASSES INICIAIS
   Níveis e armas conferidos: são os valores reais do jogo.
   ========================================================================== */
const classes = [
  { nome: 'Vagabundo', nivel: 9, arma: 'Espada Longa', nota: 'Cavaleiro decaído. Resistente e direto.' },
  { nome: 'Guerreiro', nivel: 8, arma: 'Cimitarra', nota: 'Duas lâminas, foco em destreza.' },
  { nome: 'Herói', nivel: 7, arma: 'Machado de Batalha', nota: 'Descendente de campeões. Força bruta.' },
  { nome: 'Bandido', nivel: 5, arma: 'Faca Grande', nota: 'Golpes pelas costas e arco curto.' },
  { nome: 'Astrólogo', nivel: 6, arma: 'Espada Curta', nota: 'Feitiçaria de vidro estelar.' },
  { nome: 'Profeta', nivel: 7, arma: 'Lança Curta', nota: 'Encantamentos de fé e chama.' },
  { nome: 'Confessor', nivel: 10, arma: 'Espada Larga', nota: 'Fé e furtividade em partes iguais.' },
  { nome: 'Samurai', nivel: 9, arma: 'Uchigatana', nota: 'Sangramento e arco longo.' },
  { nome: 'Prisioneiro', nivel: 9, arma: 'Estoque', nota: 'Metade espadachim, metade feiticeiro.' },
  { nome: 'Desgraçado', nivel: 1, arma: 'Clava', nota: 'Nível 1, nada além de uma clava. O verdadeiro teste.' }
];

document.getElementById('classGrid').innerHTML = classes.map(c => `
  <article class="bg-night p-6 rise transition-colors duration-500 hover:bg-bark">
    <div class="flex items-baseline justify-between gap-3 mb-2">
      <h3 class="font-er text-parch text-base tracking-[0.1em]">${c.nome}</h3>
      <span class="font-er text-goldlit text-lg">${c.nivel}</span>
    </div>
    <p class="t-label text-gold/70 mb-3">${c.arma}</p>
    <p class="text-sm text-dust leading-relaxed">${c.nota}</p>
  </article>
`).join('');
registrarRevelacoes(document.getElementById('classGrid'));

/* ==========================================================================
   9. SEMIDEUSES
   Sem retrato de propósito: no jogo, o que se vê ao encarar um chefe é o
   nome e a barra de vida. A ficha reproduz exatamente isso.
   ========================================================================== */
const semideuses = [
  { nome: 'Godrick, o Enxertado', runa: 'Grande Runa de Godrick', local: 'Castelo Stormveil · Limgrave', destaque: false },
  { nome: 'Rennala, Rainha da Lua Cheia', runa: 'Grande Runa de Rennala', local: 'Academia Raya Lucaria · Liurnia', destaque: false },
  { nome: 'Radahn, Flagelo das Estrelas', runa: 'Grande Runa de Radahn', local: 'Castelo Redmane · Caelid', destaque: false },
  { nome: 'Rykard, Senhor da Blasfêmia', runa: 'Grande Runa de Rykard', local: 'Mansão do Vulcão · Monte Gelmir', destaque: false },
  { nome: 'Morgott, o Rei Ogro', runa: 'Grande Runa de Morgott', local: 'Leyndell, Capital Real', destaque: false },
  { nome: 'Mohg, Senhor do Sangue', runa: 'Grande Runa de Mohg', local: 'Palácio Mohgwyn', destaque: false },
  { nome: 'Malenia, Lâmina de Miquella', runa: 'Grande Runa de Malenia', local: 'Elphael · Refúgio da Haligtree', destaque: true }
];

document.getElementById('bossGrid').innerHTML = semideuses.map(b => `
  <article class="boss-card card p-7 rise ${b.destaque ? 'md:col-span-2 lg:col-span-3' : ''}"
           role="button" tabindex="0" aria-label="Enfrentar ${b.nome}">
    <p class="t-label text-gold/70 mb-2">${b.local}</p>
    <h3 class="font-er ${b.destaque ? 'text-2xl md:text-3xl' : 'text-lg'} text-parch mb-1 tracking-[0.06em]">
      ${b.nome}
    </h3>
    <p class="text-sm text-dim italic mb-5">${b.runa}</p>
    <div class="boss-bar"><i></i></div>
    <p class="t-label text-dim mt-3 estado">intacto</p>
  </article>
`).join('');
registrarRevelacoes(document.getElementById('bossGrid'));

/* Derrotar um semideus: a barra esvazia e a faixa do jogo aparece */
function derrotar(card) {
  if (card.classList.contains('felled')) return;
  card.classList.add('felled');
  card.querySelector('.estado').textContent = 'abatido';
  card.setAttribute('aria-pressed', 'true');

  // A faixa entra depois da barra terminar de esvaziar, como no jogo.
  // Portador de Grande Runa mostra DEMIGOD FELLED — GREAT ENEMY FELLED é a
  // faixa de um degrau abaixo, usada em chefes que não são semideuses.
  setTimeout(() => {
    mostrarFaixa('DEMIGOD FELLED');
    avisarItem('Grande Runa obtida');
  }, 900);

  atualizarPlacar();
}

const bossCards = [...document.querySelectorAll('.boss-card')];
bossCards.forEach(card => {
  card.addEventListener('click', () => derrotar(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); derrotar(card); }
  });
});

function atualizarPlacar() {
  const abatidos = bossCards.filter(c => c.classList.contains('felled')).length;
  if (abatidos === bossCards.length) {
    // Topo da hierarquia de faixas do jogo, reservada ao confronto final
    setTimeout(() => mostrarFaixa('GOD SLAIN'), 4200);
  }
}

/* ==========================================================================
   10. MENSAGENS DE JOGADOR
   "tente pular" é a pegadinha clássica deixada à beira de penhascos.
   Quem cai nela recebe exatamente o que recebe no jogo.
   ========================================================================== */
document.querySelectorAll('.msg').forEach(msg => {
  msg.addEventListener('click', () => {
    if (msg.dataset.msg === 'trap') {
      mostrarFaixa('YOU DIED', true);
    } else {
      avisarItem('Elogio enviado');
    }
  });
});

/* ==========================================================================
   11. NAVEGAÇÃO
   ========================================================================== */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 40,
  onToggle: (self) => {
    nav.classList.toggle('bg-night/92', self.isActive);
    nav.classList.toggle('backdrop-blur-md', self.isActive);
    nav.classList.toggle('border-stone/60', self.isActive);
    nav.classList.toggle('border-transparent', !self.isActive);
  }
});

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const abrindo = navMenu.classList.contains('hidden');
  navMenu.classList.toggle('hidden', !abrindo);
  navMenu.classList.toggle('flex', abrindo);
  navToggle.setAttribute('aria-expanded', String(abrindo));
  navToggle.textContent = abrindo ? 'FECHAR' : 'MENU';
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (window.innerWidth < 768) {
    navMenu.classList.add('hidden');
    navMenu.classList.remove('flex');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = 'MENU';
  }
}));

/* Marca no menu a seção que está sendo lida */
document.querySelectorAll('main section[id]').forEach(secao => {
  ScrollTrigger.create({
    trigger: secao, start: 'top 50%', end: 'bottom 50%',
    onToggle: (self) => {
      const link = document.querySelector(`.nav-link[href="#${secao.id}"]`);
      if (link) link.classList.toggle('active', self.isActive);
    }
  });
});

/* ==========================================================================
   12. CONTADORES
   ========================================================================== */
document.querySelectorAll('.counter').forEach(el => {
  const alvo = Number(el.dataset.target);
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter: () => {
      gsap.to({ v: 0 }, {
        v: alvo, duration: 2, ease: 'power2.out',
        onUpdate: function () {
          // 2022 é um ano: não leva separador de milhar
          const v = Math.floor(this.targets()[0].v);
          el.textContent = alvo === 2022 ? v : v.toLocaleString('pt-BR');
        }
      });
    }
  });
});

/* Recalcula posições depois que as imagens mudam a altura da página */
window.addEventListener('load', () => ScrollTrigger.refresh());
