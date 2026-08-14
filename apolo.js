
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

    // Retratos oficiais dos personagens, todos na versão de Arkham Knight.
    // O parâmetro final reduz a largura no próprio CDN, evitando baixar
    // arquivos de 2000px para cards que aparecem com pouco mais de 300px.
    const wiki = (path) =>
      `https://static.wikia.nocookie.net/arkhamcity/images/${path}/revision/latest/scale-to-width-down/520`;

    const characters = [
      { name: 'Batman', role: 'Protagonista', desc: 'O Cavaleiro das Trevas, decidido a enfrentar sua ameaça mais pessoal.', c1: '#1c2733', c2: '#0a0b0d', img: wiki('c/ce/BAKBatmanProfilePic.jpg') },
      { name: 'Jim Gordon', role: 'Comissário GPD', desc: 'O único policial em quem Batman confia plenamente em Gotham.', c1: '#232b36', c2: '#101319', img: wiki('c/c2/Gordon_knight.png') },
      { name: 'Oracle', role: 'Suporte tático', desc: 'Barbara Gordon coordena a rede de inteligência de Batman à distância.', c1: '#161b23', c2: '#2e3846', img: wiki('5/53/Oracle_%28Arkham_Knight%29.jpg') },
      { name: 'Nightwing', role: 'Aliado', desc: 'Ex-parceiro de Batman, ágil e independente, sempre pronto para lutar.', c1: '#1a2430', c2: '#0d1116', img: wiki('4/46/Nightwing_profile.jpg') },
      { name: 'Catwoman', role: 'Aliada / Ameaça', desc: 'Selina Kyle joga em seu próprio jogo — nem sempre do lado do Batman.', c1: '#2a2430', c2: '#0e0c11', img: wiki('d/d1/Arkham_Knight_Catwoman_profile.jpg') },
      { name: 'Robin', role: 'Aliado', desc: 'Tim Drake, o parceiro mais recente, ágil no combate com bastão.', c1: '#1c2b26', c2: '#0a1210', img: wiki('3/37/Robin_AK.webp') },
      { name: 'Harley Quinn', role: 'Vilã', desc: 'Imprevisível e perigosa, busca vingança pela morte do Coringa.', c1: '#301b28', c2: '#120a10', img: wiki('0/03/HarleyQuinn_Arkham_Knight.jpg') },
      { name: 'Scarecrow', role: 'Vilão principal', desc: 'O Mestre do Medo retorna para espalhar o caos por toda Gotham.', c1: '#2b2417', c2: '#0f0c07', img: wiki('f/fd/BAKScarecrow.jpg') },
      { name: 'Arkham Knight', role: 'Antagonista', desc: 'Um inimigo mascarado que comanda um exército só para destruir Batman.', c1: '#2c1418', c2: '#0e0708', img: wiki('a/aa/ArkhamKnight.jpg') },
      { name: 'Poison Ivy', role: 'Vilã', desc: 'Controla a natureza de Gotham para seus próprios e obscuros fins.', c1: '#16281c', c2: '#08110b', img: wiki('9/97/Poison_Ivy_showcase.jpg') },
    ];

    const charGrid = document.getElementById('charGrid');
    charGrid.innerHTML = characters.map(c => `
  <article class="char-card sr" style="--c1:${c.c1};--c2:${c.c2}">
    <div class="char-portrait">
      <img src="${c.img}" alt="${c.name} em Batman: Arkham Knight" loading="lazy">
    </div>
    <div class="char-info">
      <div class="role">${c.role}</div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    </div>
  </article>
`).join('');
    charGrid.querySelectorAll('.sr').forEach(el => io.observe(el));


    // Capturas oficiais do jogo, servidas pelo CDN da Steam
    const shot = (hash) =>
      `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/208650/ss_${hash}.1920x1080.jpg`;

    const gallery = [
      { tag: 'Batman', desc: 'O Cavaleiro das Trevas nas ruas destruídas de Gotham', c1: '#1c2733', c2: '#080a0c', img: shot('5da3185e4f7da999300555747be6b84b8f16164f') },
      { tag: 'Batmóvel', desc: 'O Batmóvel em modo de espera', c1: '#232b36', c2: '#0c1016', img: shot('ccff12cebf58bc7d1d3e0a5783eba65c4aecf345') },
      { tag: 'Gotham City', desc: 'Becos de Gotham sob a chuva e o neon', c1: '#161c25', c2: '#05060a', img: shot('4c9d5fb849b1a7169184a37db000919b276056fe') },
      { tag: 'Vilões', desc: 'Duas-Caras, Pinguim e Arlequina', c1: '#2b1720', c2: '#0d0709', img: shot('315ff2cdd5f50d28614ae9cfa45283bb2b9f969e') },
      { tag: 'Combate', desc: 'Batman enfrentando a milícia ao lado do Batmóvel', c1: '#2a1c14', c2: '#0d0805', img: shot('90026e46a995760d53bfa2dc1612b73960c84c94') },
      { tag: 'Arkham Knight', desc: 'O antagonista mascarado à frente de seu exército', c1: '#2c1418', c2: '#0e0708', img: shot('9ccb4ec0388cd868c0f49580f98da94e8bd0e213') },
    ];

    const galGrid = document.getElementById('galGrid');
    galGrid.innerHTML = gallery.map(g => `
  <div class="gal-item" style="--c1:${g.c1};--c2:${g.c2}" data-tag="${g.tag}" data-img="${g.img}" data-desc="${g.desc}">
    <img src="${g.img}" alt="${g.desc} — Batman: Arkham Knight" loading="lazy">
    <span class="gi-tag">${g.tag}</span>
  </div>
`).join('');

    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');

    galGrid.querySelectorAll('.gal-item').forEach(item => {
      item.addEventListener('click', () => {
        modalImage.src = item.dataset.img;
        modalImage.alt = `${item.dataset.desc} — Batman: Arkham Knight`;
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