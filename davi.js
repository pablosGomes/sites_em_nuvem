/* ==========================================================================
   SUBNAUTICA 2 - OFFICIAL PORTAL ENGINE & VOICE SYNTHESIS (game.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. VOZ DA IA DO PDA (Web Speech API) & ÁUDIO DO SONAR
  // ------------------------------------------------------------------------
  let isMuted = false;
  let audioContext = null;

  function speakAlterraAI(text) {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Evita sobreposição

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Voz padrão Sci-Fi do jogo
    utterance.rate = 1.05;
    utterance.pitch = 1.2;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha')));
    if (femaleVoice) utterance.voice = femaleVoice;

    window.speechSynthesis.speak(utterance);
  }

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function playSonar() {
    if (isMuted) return;
    const ctx = initAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }

  function playCollectSound() {
    if (isMuted) return;
    const ctx = initAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  function playCraftSound() {
    if (isMuted) return;
    const ctx = initAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // Toggle Som
  const btnSound = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-indicator');

  if (btnSound) {
    btnSound.addEventListener('click', () => {
      isMuted = !isMuted;
      soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (!isMuted) {
        playSonar();
        speakAlterraAI("Audio systems online.");
      }
    });
  }

  // Boas-vindas da Alterra no primeiro clique na página
  let welcomeSpoken = false;
  window.addEventListener('click', () => {
    if (!welcomeSpoken && !isMuted) {
      welcomeSpoken = true;
      speakAlterraAI("Welcome aboard, Captain. All systems online.");
    }
  }, { once: true });

  // ------------------------------------------------------------------------
  // 2. SISTEMA DE SALVAMENTO AUTOMÁTICO (LocalStorage)
  // ------------------------------------------------------------------------
  const defaultState = {
    titanium: 0,
    quartz: 0,
    peeper: 0,
    tanks: 0,
    hasKnife: false,
    hasSeaglide: false
  };

  let inventory = JSON.parse(localStorage.getItem('subnautica_save')) || { ...defaultState };

  function saveGameProgress() {
    localStorage.setItem('subnautica_save', JSON.stringify(inventory));
  }

  function updateHUD() {
    document.getElementById('inv-tit').textContent = inventory.titanium;
    document.getElementById('inv-qua').textContent = inventory.quartz;
    document.getElementById('inv-peep').textContent = inventory.peeper;

    document.getElementById('pda-val-tit').textContent = inventory.titanium;
    document.getElementById('pda-val-qua').textContent = inventory.quartz;
    document.getElementById('pda-val-peep').textContent = inventory.peeper;
    document.getElementById('pda-val-tank').textContent = inventory.tanks;
    document.getElementById('pda-val-knife').textContent = inventory.hasKnife ? 'Instalada' : 'Não';
    document.getElementById('pda-val-seaglide').textContent = inventory.hasSeaglide ? 'Ativo (+55% Vel)' : 'Não';
    saveGameProgress();
  }

  updateHUD();

  // Reset Save
  const btnReset = document.getElementById('btn-reset-save');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Deseja apagar todos os recursos e progresso salvos?")) {
        inventory = { ...defaultState };
        updateHUD();
        alert("Save reiniciado com sucesso.");
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. CANVAS 2D: SIMULADOR DE MERGULHO COM CICLO DIA/NOITE & MARINE SNOW
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('oceanCanvas');
  const ctx = canvas.getContext('2d');

  let maxO2 = 100 + (inventory.tanks * 50);
  let o2 = maxO2;
  let hp = 100;
  let baseSpeed = 3.6;

  let dayNightTimer = 0;
  let o2WarningSpoken = false;

  const player = {
    x: canvas.width / 2,
    y: 60,
    vx: 0,
    vy: 0,
    size: 16,
    facing: 1
  };

  const keys = {};

  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Tab') {
      e.preventDefault();
      togglePDA();
    }
    if (e.key.toLowerCase() === 'j') {
      btnSound.click();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  // Entidades do Oceano
  const minerals = [];
  const peepers = [];
  const marineSnow = [];

  const reaper = {
    x: 100,
    y: 360,
    vx: 1.8,
    size: 45
  };

  function spawnWorld() {
    for (let i = 0; i < 12; i++) {
      minerals.push({
        x: Math.random() * (canvas.width - 80) + 40,
        y: Math.random() * 150 + 290,
        type: Math.random() > 0.4 ? 'titanium' : 'quartz',
        size: 13,
        collected: false
      });
    }

    for (let i = 0; i < 7; i++) {
      peepers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * 250 + 80,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 1,
        size: 9
      });
    }

    // Partículas de Marine Snow (Sedimentos flutuantes)
    for (let i = 0; i < 40; i++) {
      marineSnow.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: Math.random() * 0.6 + 0.2
      });
    }
  }

  spawnWorld();

  function updateGame() {
    const speed = inventory.hasSeaglide ? baseSpeed * 1.55 : baseSpeed;

    // Movimentação
    player.vx = 0;
    player.vy = 0;

    if (keys['w'] || keys['arrowup']) player.vy = -speed;
    if (keys['s'] || keys['arrowdown']) player.vy = speed;
    if (keys['a'] || keys['arrowleft']) { player.vx = -speed; player.facing = -1; }
    if (keys['d'] || keys['arrowright']) { player.vx = speed; player.facing = 1; }

    player.x += player.vx;
    player.y += player.vy;

    player.x = Math.max(25, Math.min(canvas.width - 25, player.x));
    player.y = Math.max(35, Math.min(canvas.height - 35, player.y));

    // Profundidade & Biomas
    const depth = Math.max(0, Math.round((player.y - 40) * 0.9));
    document.getElementById('hud-depth-val').textContent = `${depth} m`;

    const biomeElem = document.getElementById('hud-biome-val');
    if (depth < 60) {
      biomeElem.textContent = 'SAFE SHALLOWS';
      biomeElem.className = 'neon-cyan';
    } else if (depth < 180) {
      biomeElem.textContent = 'KELP FOREST';
      biomeElem.className = 'neon-green';
    } else {
      biomeElem.textContent = 'LOST RIVER (PERIGO)';
      biomeElem.className = 'neon-red';
    }

    // Oxigênio
    if (player.y <= 55) {
      o2 = Math.min(maxO2, o2 + 1.5);
      o2WarningSpoken = false;
    } else {
      o2 = Math.max(0, o2 - 0.09);
      if (o2 <= 30 && !o2WarningSpoken) {
        o2WarningSpoken = true;
        speakAlterraAI("Oxygen: 30 seconds.");
      }
      if (o2 <= 0) hp = Math.max(0, hp - 0.25);
    }

    const o2Ratio = (o2 / maxO2) * 100;
    document.getElementById('hud-o2').textContent = `${Math.round(o2Ratio)}%`;
    document.getElementById('hud-o2-val').textContent = `${Math.round(o2Ratio)}%`;
    document.getElementById('hud-o2-bar').style.width = `${o2Ratio}%`;
    document.getElementById('hud-hp').textContent = `${Math.round(hp)}%`;
    document.getElementById('hud-hp-fill').style.width = `${hp}%`;

    // Ciclo Dia / Noite (Timer)
    dayNightTimer += 0.002;
    const isDay = Math.sin(dayNightTimer) > 0;
    document.getElementById('hud-time-val').textContent = isDay ? 'DIA (12:00)' : 'NOITE (00:00)';
    document.getElementById('hud-time-val').className = isDay ? 'neon-gold' : 'neon-cyan';

    // Coleta
    minerals.forEach((min) => {
      if (!min.collected) {
        const d = Math.hypot(player.x - min.x, player.y - min.y);
        if (d < 30 && (keys['e'] || d < 20)) {
          min.collected = true;
          if (min.type === 'titanium') inventory.titanium++;
          if (min.type === 'quartz') inventory.quartz++;
          playCollectSound();
          updateHUD();
        }
      }
    });

    peepers.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 60 || p.y > 380) p.vy *= -1;

      const d = Math.hypot(player.x - p.x, player.y - p.y);
      if (d < 22 && keys['e']) {
        p.x = -200;
        inventory.peeper++;
        playCollectSound();
        updateHUD();
      }
    });

    // Reaper Leviathan
    reaper.x += reaper.vx;
    if (reaper.x > canvas.width - 70 || reaper.x < 50) reaper.vx *= -1;

    const dReaper = Math.hypot(player.x - reaper.x, player.y - reaper.y);
    if (dReaper < 50) {
      hp = Math.max(0, hp - 0.7);
    }
  }

  function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDay = Math.sin(dayNightTimer) > 0;

    // Fundo da Água com Iluminação Dinâmica
    const waterGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isDay) {
      waterGrad.addColorStop(0, '#006699');
      waterGrad.addColorStop(0.4, '#02244a');
      waterGrad.addColorStop(1, '#010c1c');
    } else {
      waterGrad.addColorStop(0, '#001a33');
      waterGrad.addColorStop(0.4, '#010e21');
      waterGrad.addColorStop(1, '#00050d');
    }
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Superfície
    ctx.fillStyle = isDay ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 180, 216, 0.2)';
    ctx.fillRect(0, 0, canvas.width, 36);

    // Fundo Arenoso
    ctx.fillStyle = '#051424';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 45);
    ctx.bezierCurveTo(300, canvas.height - 75, 700, canvas.height - 20, canvas.width, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.fill();

    // Marine Snow (Plâncton Flutuante)
    ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    marineSnow.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.x += s.speedX;
      s.y += s.speedY;
      if (s.y > canvas.height) { s.y = 35; s.x = Math.random() * canvas.width; }
    });

    // Minerais
    minerals.forEach((min) => {
      if (!min.collected) {
        ctx.fillStyle = min.type === 'titanium' ? '#9ec4e6' : '#00f0ff';
        ctx.shadowColor = min.type === 'titanium' ? '#9ec4e6' : '#00f0ff';
        ctx.shadowBlur = isDay ? 6 : 14;
        ctx.beginPath();
        ctx.arc(min.x, min.y, min.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Peepers
    peepers.forEach((p) => {
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size / 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(p.x + 3 * (p.vx > 0 ? 1 : -1), p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reaper Leviathan
    ctx.fillStyle = '#ff2a4d';
    ctx.shadowColor = '#ff2a4d';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(reaper.x, reaper.y, reaper.size, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mergulhador & Lanterna Volumétrica
    ctx.save();
    ctx.translate(player.x, player.y);

    const lightCone = ctx.createRadialGradient(
      player.facing * 15, 0, 5,
      player.facing * 140, 0, 160
    );
    lightCone.addColorStop(0, isDay ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.7)');
    lightCone.addColorStop(1, 'transparent');
    ctx.fillStyle = lightCone;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 175, player.facing > 0 ? -0.35 : Math.PI - 0.35, player.facing > 0 ? 0.35 : Math.PI + 0.35);
    ctx.closePath();
    ctx.fill();

    // Capacete
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, player.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(player.facing * 4, -1, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function frameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(frameLoop);
  }
  frameLoop();

  // ------------------------------------------------------------------------
  // 4. PDA ALTERRA MODAL & FABRICADOR
  // ------------------------------------------------------------------------
  const pdaModal = document.getElementById('pda-modal');
  const btnClosePda = document.getElementById('btn-close-pda');
  const triggerPdaBtns = document.querySelectorAll('.trigger-pda');

  function togglePDA() {
    const isOpen = pdaModal.classList.contains('open');
    if (isOpen) {
      pdaModal.classList.remove('open');
      pdaModal.setAttribute('aria-hidden', 'true');
    } else {
      pdaModal.classList.add('open');
      pdaModal.setAttribute('aria-hidden', 'false');
      playSonar();
      speakAlterraAI("PDA interface accessed.");
      updateHUD();
    }
  }

  if (btnClosePda) btnClosePda.addEventListener('click', togglePDA);
  triggerPdaBtns.forEach((btn) => btn.addEventListener('click', togglePDA));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdaModal.classList.contains('open')) togglePDA();
  });

  const tabBtns = document.querySelectorAll('.pda-tab-btn');
  const tabPanes = document.querySelectorAll('.pda-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Ações do Fabricador
  const craftBtns = document.querySelectorAll('.btn-craft');
  const craftStatus = document.getElementById('craft-status');

  craftBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.dataset.item;
      let success = false;

      if (item === 'tank') {
        if (inventory.titanium >= 2) {
          inventory.titanium -= 2;
          inventory.tanks++;
          maxO2 += 50;
          o2 = maxO2;
          success = true;
          craftStatus.textContent = '✓ Tanque O₂ Fabricado! (+50 Oxigênio Máximo)';
          speakAlterraAI("Oxygen tank fabricated.");
        } else {
          craftStatus.textContent = '✕ Titânio insuficiente (Precisa de 2x).';
        }
      } else if (item === 'knife') {
        if (inventory.titanium >= 1 && inventory.quartz >= 1 && !inventory.hasKnife) {
          inventory.titanium -= 1;
          inventory.quartz -= 1;
          inventory.hasKnife = true;
          success = true;
          craftStatus.textContent = '✓ Faca de Sobrevivência Pronta!';
          speakAlterraAI("Survival knife equipped.");
        } else {
          craftStatus.textContent = inventory.hasKnife ? '✕ Faca já fabricada.' : '✕ Recursos insuficientes.';
        }
      } else if (item === 'seaglide') {
        if (inventory.titanium >= 3 && inventory.quartz >= 2 && !inventory.hasSeaglide) {
          inventory.titanium -= 3;
          inventory.quartz -= 2;
          inventory.hasSeaglide = true;
          success = true;
          craftStatus.textContent = '✓ Seaglide Ativado (+55% Velocidade)!';
          speakAlterraAI("Seaglide propulsion online.");
        } else {
          craftStatus.textContent = inventory.hasSeaglide ? '✕ Seaglide já instalado.' : '✕ Recursos insuficientes.';
        }
      } else if (item === 'food') {
        if (inventory.peeper >= 1) {
          inventory.peeper -= 1;
          hp = Math.min(100, hp + 40);
          success = true;
          craftStatus.textContent = '✓ Peeper Cozido com Sucesso!';
          speakAlterraAI("Caloric intake optimal.");
        } else {
          craftStatus.textContent = '✕ Nenhum Peeper no inventário.';
        }
      }

      if (success) {
        craftStatus.style.color = '#00ffa2';
        playCraftSound();
      } else {
        craftStatus.style.color = '#ff7800';
      }

      updateHUD();
    });
  });

  // ------------------------------------------------------------------------
  // 5. MODAL DE TRAILER & LIGHTBOX DE GALERIA
  // ------------------------------------------------------------------------
  const trailerModal = document.getElementById('trailer-modal');
  const btnWatchTrailer = document.getElementById('btn-watch-trailer');
  const btnCloseTrailer = document.getElementById('btn-close-trailer');
  const trailerIframe = document.getElementById('trailer-iframe');

  if (btnWatchTrailer) {
    btnWatchTrailer.addEventListener('click', () => {
      trailerIframe.src = "https://www.youtube.com/embed/rP3fn6Q-Yq0?autoplay=1";
      trailerModal.classList.add('open');
      trailerModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (btnCloseTrailer) {
    btnCloseTrailer.addEventListener('click', () => {
      trailerIframe.src = "";
      trailerModal.classList.remove('open');
      trailerModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Lightbox
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.full;
      lightboxCaption.textContent = item.dataset.title;
      lightboxModal.classList.add('open');
    });
  });

  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', () => lightboxModal.classList.remove('open'));
  }

  // Scroll to top
  const btnScroll = document.getElementById('btn-scroll-top');
  if (btnScroll) {
    btnScroll.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Botão Jogue Agora
  const btnHeroPlay = document.getElementById('btn-hero-play');
  if (btnHeroPlay) {
    btnHeroPlay.addEventListener('click', () => {
      document.getElementById('simulador-section').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// --------------------------------------------------------------------------
// 6. ARQUITETO DE BASE
// --------------------------------------------------------------------------
const baseState = { room: 1, window: 2, reinforce: 1, power: 2 };

window.alterModule = function(type, delta) {
  baseState[type] = Math.max(0, baseState[type] + delta);
  document.getElementById(`count-${type}`).textContent = baseState[type];

  const integrity = (10 + (baseState.reinforce * 7.0) - (baseState.room * 1.2) - (baseState.window * 1.0)).toFixed(1);
  const totalEnergy = baseState.power * 50;

  const intElem = document.getElementById('base-integrity');
  const msgElem = document.getElementById('base-status-msg');

  intElem.textContent = integrity;
  document.getElementById('base-energy').textContent = `${totalEnergy} / ${totalEnergy}`;

  if (parseFloat(integrity) <= 0) {
    intElem.className = 'neon-red';
    msgElem.textContent = '⚠ ALERTA CRÍTICO: RUPTURA DE CASCO IMINENTE!';
  } else {
    intElem.className = 'neon-green';
    msgElem.textContent = 'Casco Estável // Sem Risco de Inundação';
  }
};