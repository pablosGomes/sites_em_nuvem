/* ==========================================================================
   HUB DO PROJETO
   ========================================================================== */

document.getElementById('ano').textContent = new Date().getFullYear();

const REPO = 'https://github.com/pablosGomes/sites_em_nuvem';

/* ==========================================================================
   1. AS CINCO PÁGINAS
   Cada card leva à página e também mostra a branch em que ela foi feita,
   deixando visível a estrutura de trabalho do grupo.
   ========================================================================== */
const paginas = [
  {
    autor: 'Laura', jogo: 'The Last of Us', arquivo: 'laura.html', branch: 'site_laura',
    cor: '#8a9a5b',
    resumo: 'O surto do Cordyceps, a travessia de Joel e Ellie e os estágios da infecção.',
    capa: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1888930/library_hero_2x.jpg',
    alt: 'Arte oficial de The Last of Us Part I'
  },
  {
    autor: 'Otávio', jogo: 'Minecraft', arquivo: 'otavio.html', branch: 'site_otavio',
    cor: '#5db85d',
    resumo: 'Biomas, mobs, itens e a liberdade de um mundo inteiro feito de blocos.',
    capa: 'img_otavio/inicio.png',
    alt: 'Paisagem de blocos do Minecraft'
  },
  {
    autor: 'Apolo', jogo: 'Batman: Arkham Knight', arquivo: 'apolo.html', branch: 'site_apolo',
    cor: '#c81e2c',
    resumo: 'A noite final de Gotham, o Batmóvel e o dossiê de aliados e vilões.',
    capa: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/208650/library_hero.jpg',
    alt: 'Arte oficial de Batman: Arkham Knight'
  },
  {
    autor: 'Davi', jogo: 'Subnautica 2', arquivo: 'davi.html', branch: 'site_davi',
    cor: '#34d0d8',
    resumo: 'Mergulho, biomas do planeta 4546B e a tensão de explorar o fundo do oceano.',
    capa: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_hero.jpg',
    alt: 'Arte oficial de Subnautica 2'
  },
  {
    autor: 'Pablo', jogo: 'Elden Ring', arquivo: 'pablo.html', branch: 'site_pablo',
    cor: '#c9a227',
    resumo: 'As Terras Intermédias, os semideuses portadores de Grandes Runas e os Sítios de Graça.',
    capa: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero_2x.jpg',
    alt: 'Arte oficial de Elden Ring'
  }
];

document.getElementById('paginasGrid').innerHTML = paginas.map((p, i) => `
  <article class="card overflow-hidden reveal relative" style="--i:${i}">
    <span class="tint" style="background:linear-gradient(to right, ${p.cor}, transparent)"></span>

    <a href="${p.arquivo}" class="block media aspect-[16/10] scrim"
       aria-label="Abrir a página ${p.jogo}, de ${p.autor}">
      <img src="${p.capa}" alt="${p.alt}" loading="lazy">
      <span class="absolute bottom-0 left-0 p-6 z-10">
        <span class="t-label block mb-1" style="color:${p.cor}">${p.autor}</span>
        <span class="font-d t-h3 text-ink block">${p.jogo}</span>
      </span>
    </a>

    <div class="p-6 border-t border-linesoft">
      <p class="text-sm text-muted mb-5">${p.resumo}</p>
      <div class="flex flex-wrap items-center gap-2">
        <a href="${p.arquivo}" class="pill" style="border-color:${p.cor}55; color:#eceaf5">
          Abrir página <span aria-hidden="true">→</span>
        </a>
        <a href="${REPO}/tree/${p.branch}" class="pill" target="_blank" rel="noopener noreferrer"
           title="Ver a branch ${p.branch} no GitHub">
          <span aria-hidden="true">⑂</span> ${p.branch}
        </a>
      </div>
    </div>
  </article>
`).join('');

/* ==========================================================================
   2. REVELAÇÃO AO ROLAR
   Registrada por função: os cards das páginas são criados acima, depois do
   carregamento do script, e precisam entrar na mesma observação.
   ========================================================================== */
const revelador = new IntersectionObserver((entradas) => {
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
   3. NAVEGAÇÃO
   ========================================================================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  const desceu = window.scrollY > 40;
  nav.classList.toggle('bg-void/90', desceu);
  nav.classList.toggle('backdrop-blur-md', desceu);
  nav.classList.toggle('border-line', desceu);
  nav.classList.toggle('border-transparent', !desceu);
}, { passive: true });

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const abrindo = navMenu.classList.contains('hidden');
  navMenu.classList.toggle('hidden', !abrindo);
  navMenu.classList.toggle('flex', abrindo);
  navToggle.setAttribute('aria-expanded', String(abrindo));
  navToggle.textContent = abrindo ? 'Fechar' : 'Menu';
});

navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  if (window.innerWidth < 768) {
    navMenu.classList.add('hidden');
    navMenu.classList.remove('flex');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = 'Menu';
  }
}));

/* Marca no menu a seção que está sendo lida */
const links = [...document.querySelectorAll('.nav-link')];
const observadorSecao = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(s => observadorSecao.observe(s));

/* ==========================================================================
   4. CONTADORES
   ========================================================================== */
const contadores = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    contadores.unobserve(e.target);

    const el = e.target;
    const alvo = Number(el.dataset.target);
    const inicio = performance.now();
    const duracao = 1200;

    function passo(agora) {
      const linear = Math.min((agora - inicio) / duracao, 1);
      const suave = 1 - Math.pow(1 - linear, 3);
      el.textContent = Math.round(suave * alvo);
      if (linear < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => contadores.observe(el));
