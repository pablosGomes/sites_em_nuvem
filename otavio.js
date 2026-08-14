/* =========================================================================
   CRAFTVERSE — script.js
   Funcionalidades:
   1. Menu mobile (abrir/fechar)
   2. Rolagem suave + destaque do link ativo no menu
   3. Animação de entrada dos elementos (.reveal) ao rolar a página
   4. Efeito de partículas pixeladas no Hero
   5. Botão "voltar ao topo"
   6. Ano automático no rodapé
   7. Extra: contador interativo de blocos "minerados"
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. MENU MOBILE ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu mobile automaticamente ao clicar em um link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. ROLAGEM SUAVE + LINK ATIVO ---------- */
  // A rolagem suave já é garantida por "scroll-behavior: smooth" no CSS,
  // mas aqui também controlamos qual item do menu fica marcado como ativo.
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function highlightActiveLink() {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + 120; // compensa a altura do header fixo

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
  highlightActiveLink();

  /* ---------- 3. ANIMAÇÃO DE ENTRADA (.reveal) ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target); // anima uma única vez
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 4. PARTÍCULAS PIXELADAS NO HERO ---------- */
  const particlesContainer = document.getElementById('heroParticles');
  const TOTAL_PARTICLES = 26;
  const particleColors = ['#e8b84b', '#7fbf4d', '#6fd8d8', '#e7ddc0'];

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const particle = document.createElement('span');
    const size = Math.random() * 5 + 3; // entre 3px e 8px, para lembrar pixels
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8; // 8s a 18s
    const delay = Math.random() * 10;

    particle.style.position = 'absolute';
    particle.style.left = `${left}%`;
    particle.style.bottom = '-10px';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.opacity = '0.7';
    particle.style.animation = `subir ${duration}s linear ${delay}s infinite`;
    particlesContainer.appendChild(particle);
  }

  // Cria a keyframe da animação das partículas dinamicamente
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes subir {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.8; }
      90%  { opacity: 0.6; }
      100% { transform: translateY(-100vh) rotate(180deg); opacity: 0; }
    }
  `;
  document.head.appendChild(styleTag);

  /* ---------- 5. BOTÃO VOLTAR AO TOPO ---------- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 6. ANO AUTOMÁTICO NO RODAPÉ ---------- */
  const anoAtual = document.getElementById('anoAtual');
  if (anoAtual) anoAtual.textContent = new Date().getFullYear();

  /* ---------- 7. EXTRA: CONTADOR INTERATIVO DE BLOCOS "MINERADOS" ---------- */
  // Cada clique em um card de item/recurso soma "blocos minerados" e mostra
  // um pequeno aviso temporário — um toque interativo ligado ao tema do jogo.
  const itemCards = document.querySelectorAll('.itens-grid .slot-card');
  let blocosMinerados = 0;

  itemCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    const minerar = () => {
      blocosMinerados++;
      card.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.94)' },
          { transform: 'scale(1)' }
        ],
        { duration: 220, easing: 'ease-out' }
      );
      mostrarAviso(`+1 bloco minerado (total: ${blocosMinerados})`);
    };

    card.addEventListener('click', minerar);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        minerar();
      }
    });
  });

  function mostrarAviso(texto) {
    let aviso = document.getElementById('avisoMinerar');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.id = 'avisoMinerar';
      aviso.style.position = 'fixed';
      aviso.style.left = '50%';
      aviso.style.bottom = '90px';
      aviso.style.transform = 'translateX(-50%)';
      aviso.style.background = '#2b2a26';
      aviso.style.color = '#e8b84b';
      aviso.style.fontFamily = "'VT323', monospace";
      aviso.style.fontSize = '1.15rem';
      aviso.style.padding = '10px 18px';
      aviso.style.boxShadow = 'inset 2px 2px 0 rgba(255,255,255,0.15), inset -2px -2px 0 rgba(0,0,0,0.4)';
      aviso.style.zIndex = '1200';
      aviso.style.transition = 'opacity 0.25s ease';
      document.body.appendChild(aviso);
    }
    aviso.textContent = texto;
    aviso.style.opacity = '1';
    clearTimeout(aviso._timeoutId);
    aviso._timeoutId = setTimeout(() => { aviso.style.opacity = '0'; }, 1400);
  }

});