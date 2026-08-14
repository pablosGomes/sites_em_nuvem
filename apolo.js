
    const nav = document.getElementById('siteNav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }));

    window.addEventListener('load', () => {
      document.querySelectorAll('.reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), 120 * i + 80);
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: .18 });
    document.querySelectorAll('.sr').forEach(el => io.observe(el));

    const canvas = document.getElementById('rain');
    const ctx = canvas.getContext('2d');
    let drops = [];
    function sizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 12 + Math.random() * 18,
        speed: 6 + Math.random() * 8,
        op: .08 + Math.random() * .18
      }));
    }
    function drawRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(180,200,220,0.5)';
      ctx.lineWidth = 1;
      drops.forEach(d => {
        ctx.globalAlpha = d.op;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();
        d.y += d.speed; d.x -= .6;
        if (d.y > canvas.height) { d.y = -d.len; d.x = Math.random() * canvas.width; }
      });
      requestAnimationFrame(drawRain);
    }
    sizeCanvas();
    drawRain();
    window.addEventListener('resize', sizeCanvas);

    const tkCrime = document.getElementById('tk-crime');
    const tkWeather = document.getElementById('tk-weather');
    const weathers = ['TEMPESTADE', 'NÉVOA DENSA', 'CHUVA FORTE', 'VENTO FORTE'];
    setInterval(() => {
      tkCrime.textContent = (70 + Math.floor(Math.random() * 28)) + '%';
      tkWeather.textContent = weathers[Math.floor(Math.random() * weathers.length)];
    }, 2600);

    const lightning = document.getElementById('lightning');
    function flash() {
      lightning.style.transition = 'none';
      lightning.style.opacity = .8;
      setTimeout(() => {
        lightning.style.transition = 'opacity .6s ease-out';
        lightning.style.opacity = 0;
      }, 70);
      setTimeout(flash, 4000 + Math.random() * 6000);
    }
    setTimeout(flash, 2500);

    const characters = [
      { name: 'Batman', role: 'Protagonista', desc: 'O Cavaleiro das Trevas, decidido a enfrentar sua ameaça mais pessoal.', c1: '#1c2733', c2: '#0a0b0d' },
      { name: 'Jim Gordon', role: 'Comissário GPD', desc: 'O único policial em quem Batman confia plenamente em Gotham.', c1: '#232b36', c2: '#101319' },
      { name: 'Oracle', role: 'Suporte tático', desc: 'Barbara Gordon coordena a rede de inteligência de Batman à distância.', c1: '#161b23', c2: '#2e3846' },
      { name: 'Nightwing', role: 'Aliado', desc: 'Ex-parceiro de Batman, ágil e independente, sempre pronto para lutar.', c1: '#1a2430', c2: '#0d1116' },
      { name: 'Catwoman', role: 'Aliada / Ameaça', desc: 'Selina Kyle joga em seu próprio jogo — nem sempre do lado do Batman.', c1: '#2a2430', c2: '#0e0c11' },
      { name: 'Robin', role: 'Aliado', desc: 'Tim Drake, o parceiro mais recente, ágil no combate com bastão.', c1: '#1c2b26', c2: '#0a1210' },
      { name: 'Harley Quinn', role: 'Vilã', desc: 'Imprevisível e perigosa, busca vingança pela morte do Coringa.', c1: '#301b28', c2: '#120a10' },
      { name: 'Scarecrow', role: 'Vilão principal', desc: 'O Mestre do Medo retorna para espalhar o caos por toda Gotham.', c1: '#2b2417', c2: '#0f0c07' },
      { name: 'Arkham Knight', role: 'Antagonista', desc: 'Um inimigo mascarado que comanda um exército só para destruir Batman.', c1: '#2c1418', c2: '#0e0708' },
      { name: 'Poison Ivy', role: 'Vilã', desc: 'Controla a natureza de Gotham para seus próprios e obscuros fins.', c1: '#16281c', c2: '#08110b' },
    ];

    const charGrid = document.getElementById('charGrid');
    charGrid.innerHTML = characters.map(c => `
  <article class="char-card sr" style="--c1:${c.c1};--c2:${c.c2}">
    <div class="char-portrait"></div>
    <div class="char-mono">${c.name.charAt(0)}</div>
    <div class="char-info">
      <div class="role">${c.role}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    </div>
  </article>
`).join('');
    charGrid.querySelectorAll('.sr').forEach(el => io.observe(el));


    const galleryIconBat = `<svg viewBox="0 0 100 60" fill="#fff"><path d="M50 0 C46 8 40 6 35 2 C38 10 30 12 22 8 C28 16 18 20 8 16 C18 26 8 30 0 26 C14 34 10 44 4 50 C20 46 24 54 22 60 C30 52 38 56 40 60 C42 54 46 52 50 52 C54 52 58 54 60 60 C62 56 70 52 78 60 C76 54 80 46 96 50 C90 44 86 34 100 26 C92 30 82 26 92 16 C82 20 72 16 78 8 C70 12 62 10 65 2 C60 6 54 8 50 0 Z"/></svg>`;

    const gallery = [
      { tag: 'Batman', c1: '#1c2733', c2: '#080a0c' },
      { tag: 'Batmóvel', c1: '#232b36', c2: '#0c1016' },
      { tag: 'Gotham City', c1: '#161c25', c2: '#05060a' },
      { tag: 'Vilões', c1: '#2b1720', c2: '#0d0709' },
      { tag: 'Combate', c1: '#2a1c14', c2: '#0d0805' },
      { tag: 'Bat-sinal', c1: '#1e2430', c2: '#08090c' },
    ];

    const galGrid = document.getElementById('galGrid');
    galGrid.innerHTML = gallery.map(g => `
  <div class="gal-item" style="--c1:${g.c1};--c2:${g.c2}" data-tag="${g.tag}" data-c1="${g.c1}" data-c2="${g.c2}">
    <div class="gi-icon">${galleryIconBat}</div>
    <span class="gi-tag">${g.tag}</span>
  </div>
`).join('');

    const modal = document.getElementById('modal');
    const modalPanel = document.getElementById('modalPanel');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');

    galGrid.querySelectorAll('.gal-item').forEach(item => {
      item.addEventListener('click', () => {
        modalPanel.style.background = `linear-gradient(160deg, ${item.dataset.c1}, ${item.dataset.c2})`;
        modalCaption.textContent = item.dataset.tag;
        modal.classList.add('open');
      });
    });
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('open'); });

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const bat = document.querySelector('.hero-bat');
      if (bat) bat.style.transform = `translateY(${y * 0.08}px)`;
      const sky = document.querySelector('.hero-skyline');
      if (sky) sky.style.transform = `translateY(${y * 0.03}px)`;
    }, { passive: true });