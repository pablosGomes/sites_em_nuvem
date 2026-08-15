// ============================================================
//  Ano corrente no rodapé
// ============================================================
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// ============================================================
//  Header: fica sólido assim que sai do topo
// ============================================================
const siteHeader = document.getElementById('siteHeader');
const backToTop = document.getElementById('backToTop');

function onScroll() {
  const y = window.scrollY;

  siteHeader.classList.toggle('bg-void/92', y > 40);
  siteHeader.classList.toggle('backdrop-blur-md', y > 40);
  siteHeader.classList.toggle('border-edge', y > 40);
  siteHeader.classList.toggle('border-transparent', y <= 40);

  const showTop = y > 700;
  backToTop.classList.toggle('opacity-0', !showTop);
  backToTop.classList.toggle('pointer-events-none', !showTop);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================================
//  Menu mobile
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.contains('hidden');
  mainNav.classList.toggle('hidden', !isOpen);
  mainNav.classList.toggle('flex', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'FECHAR' : 'MENU';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      mainNav.classList.add('hidden');
      mainNav.classList.remove('flex');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = 'MENU';
    }
  });
});

// ============================================================
//  Revelar elementos conforme entram na tela
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
//  Marca no menu a seção que está sendo lida
// ============================================================
const navLinks = [...document.querySelectorAll('.nav-link')];

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
      link.classList.toggle('text-sporebright', isCurrent);
      link.classList.toggle('text-ash', !isCurrent);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));

// ============================================================
//  Esporos subindo no hero
// ============================================================
const sporeField = document.getElementById('sporeField');

if (sporeField && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 32; i++) {
    const spore = document.createElement('span');
    const size = 2 + Math.random() * 4.5;

    spore.className = 'spore';
    spore.style.width = `${size}px`;
    spore.style.height = `${size}px`;
    spore.style.left = `${Math.random() * 100}%`;
    // Esporos menores ficam mais apagados: dá sensação de profundidade
    spore.style.setProperty('--peak', (0.25 + (size / 6.5) * 0.6).toFixed(2));
    spore.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
    spore.style.animationDuration = `${11 + Math.random() * 12}s`;
    spore.style.animationDelay = `${Math.random() * 16}s`;

    fragment.appendChild(spore);
  }

  sporeField.appendChild(fragment);
}

// ============================================================
//  Modo Escuta
// ============================================================
const listenToggle = document.getElementById('listenToggle');
const listenStage = document.getElementById('listenStage');
const listenLabel = document.getElementById('listenLabel');

listenToggle.addEventListener('click', () => {
  const isActive = listenStage.classList.toggle('is-listening');
  listenToggle.setAttribute('aria-pressed', String(isActive));
  listenLabel.textContent = isActive ? 'Modo Escuta ativo' : 'Ativar Modo Escuta';
});

// ============================================================
//  Clicker: ecolocalização a partir do ponto clicado
// ============================================================
document.querySelectorAll('.clicker-card').forEach(card => {
  function ping(x, y) {
    const ring = document.createElement('span');
    ring.className = 'sonar-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    card.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove());
  }

  card.addEventListener('click', (event) => {
    const rect = card.getBoundingClientRect();
    ping(event.clientX - rect.left, event.clientY - rect.top);
  });

  // Mesma reação para quem navega pelo teclado
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    ping(card.offsetWidth / 2, card.offsetHeight / 2);
  });
});

// ============================================================
//  Contadores dos prêmios
// ============================================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);

    const el = entry.target;
    const target = Number(el.dataset.target);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const linear = Math.min((now - start) / duration, 1);
      // Desaceleração no fim: o número "assenta" em vez de parar seco
      const eased = 1 - Math.pow(1 - linear, 3);
      el.textContent = Math.round(eased * target).toLocaleString('pt-BR');
      if (linear < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));
