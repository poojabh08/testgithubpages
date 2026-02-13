// /app.js
/**
 * Cute Valentine mini-site (no frameworks).
 * Edit CONFIG to personalize names, messages, photo, and the target date.
 */

const CONFIG = {
    boyfriendName: "Bujji",
    fromName: "Your girl <3",
    titlePrefix: "Hey",
    subtitle: "I made this tiny website just for you.",
    message: "You’re my favorite person. Will you be my Valentine?",
    acceptedMessage:
      "Okay now you’re officially my Valentine. Screenshot this and send it to me 😚",
    targetDateLocal: "2026-02-14T00:00:00", // local time; set to your timezone device
    photoUrl: "./img/panda.webp", // e.g. "./img/us.jpg" (put file in img folder)
    music: {
      enabled: true,
      // A tiny built-in tone loop (no external files). Toggle via button.
      // If you want a real song, set enabled=false and add your own <audio>.
    },
  };
  
  const $ = (sel) => document.querySelector(sel);
  
  const els = {
    bfName: $("#bfName"),
    fromName: $("#fromName"),
    title: $("#title"),
    subtitle: $("#subtitle"),
    message: $("#message"),
    countdownText: $("#countdownText"),
    photo: $("#photo"),
    photoFallback: $("#photoFallback"),
    yesBtn: $("#yesBtn"),
    noBtn: $("#noBtn"),
    actions: $("#actions"),
    tinyHint: $("#tinyHint"),
    copyBtn: $("#copyBtn"),
    resetBtn: $("#resetBtn"),
    modal: $("#modal"),
    modalBackdrop: $("#modalBackdrop"),
    modalClose: $("#modalClose"),
    modalText: $("#modalText"),
    musicBtn: $("#musicBtn"),
    confetti: $("#confetti"),
  };
  
  const STORAGE_KEY = "valentine_site_v1";
  
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { accepted: false, noClicks: 0, musicOn: false };
    } catch {
      return { accepted: false, noClicks: 0, musicOn: false };
    }
  }
  
  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  
  function setText(el, text) {
    if (el) el.textContent = text;
  }
  
  function initCopyLink() {
    els.copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        els.copyBtn.textContent = "Copied! ✅";
        setTimeout(() => (els.copyBtn.textContent = "Copy link"), 1200);
      } catch {
        els.copyBtn.textContent = "Copy failed 😅";
        setTimeout(() => (els.copyBtn.textContent = "Copy link"), 1200);
      }
    });
  }
  
  function initReset(state) {
    els.resetBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.accepted = false;
      state.noClicks = 0;
      state.musicOn = false;
      saveState(state);
      window.location.reload();
    });
  }
  
  function applyConfig() {
    setText(els.bfName, CONFIG.boyfriendName);
    setText(els.fromName, CONFIG.fromName);
    setText(els.subtitle, CONFIG.subtitle);
    setText(els.message, CONFIG.message);
    els.modalText.textContent = CONFIG.acceptedMessage;
  
    const fullTitle = `${CONFIG.titlePrefix} ${CONFIG.boyfriendName}…`;
    els.title.childNodes[0].textContent = `${CONFIG.titlePrefix} `;
  
    if (CONFIG.photoUrl) {
      els.photo.src = CONFIG.photoUrl;
      els.photo.addEventListener(
        "load",
        () => {
          els.photo.classList.add("ready");
          els.photoFallback.style.display = "none";
        },
        { once: true }
      );
      els.photo.addEventListener(
        "error",
        () => {
          els.photoFallback.style.display = "grid";
        },
        { once: true }
      );
    } else {
      els.photoFallback.style.display = "grid";
    }
  }
  
  function formatCountdown(ms) {
    const total = Math.max(0, ms);
    const sec = Math.floor(total / 1000);
    const days = Math.floor(sec / (3600 * 24));
    const hours = Math.floor((sec % (3600 * 24)) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
  
    if (ms <= 0) return "It’s Valentine’s Day 💘";
    if (days > 0) return `${days} day${days === 1 ? "" : "s"} • ${hours}h ${mins}m to Feb 14`;
    if (hours > 0) return `${hours}h ${mins}m to Feb 14`;
    return `${mins} minute${mins === 1 ? "" : "s"} to Feb 14`;
  }
  
  function startCountdown() {
    const target = new Date(CONFIG.targetDateLocal).getTime();
    const tick = () => {
      const now = Date.now();
      setText(els.countdownText, formatCountdown(target - now));
    };
    tick();
    setInterval(tick, 30_000);
  }
  
  function showModal() {
    els.modal.classList.add("show");
    els.modal.setAttribute("aria-hidden", "false");
  }
  
  function hideModal() {
    els.modal.classList.remove("show");
    els.modal.setAttribute("aria-hidden", "true");
  }
  
  function initModal() {
    els.modalClose.addEventListener("click", hideModal);
    els.modalBackdrop.addEventListener("click", hideModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideModal();
    });
  }
  
  /** Simple confetti (no libs) */
  function confettiBurst() {
    const canvas = els.confetti;
    const ctx = canvas.getContext("2d");
  
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
  
    const pieces = [];
    const count = 140;
  
    for (let i = 0; i < count; i += 1) {
      pieces.push({
        x: window.innerWidth / 2 + (Math.random() * 120 - 60),
        y: window.innerHeight / 2 + (Math.random() * 60 - 30),
        vx: Math.random() * 8 - 4,
        vy: Math.random() * -10 - 3,
        g: 0.25 + Math.random() * 0.2,
        w: 6 + Math.random() * 6,
        h: 6 + Math.random() * 10,
        r: Math.random() * Math.PI,
        vr: Math.random() * 0.2 - 0.1,
        life: 140 + Math.random() * 40,
        kind: Math.random() < 0.35 ? "heart" : "rect",
      });
    }
  
    let frame = 0;
    function drawHeart(x, y, size, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.moveTo(0, 0.3);
      ctx.bezierCurveTo(-0.6, -0.1, -0.5, -0.8, 0, -0.5);
      ctx.bezierCurveTo(0.5, -0.8, 0.6, -0.1, 0, 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  
    function step() {
      frame += 1;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        p.r += p.vr;
        p.life -= 1;
  
        const alpha = Math.max(0, Math.min(1, p.life / 140));
        ctx.globalAlpha = alpha;
  
        // no hardcoded colors? we'll use gradients to keep it cute without specifying many colors
        const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
        grad.addColorStop(0, "rgba(255,59,138,0.95)");
        grad.addColorStop(1, "rgba(255,123,183,0.95)");
        ctx.fillStyle = grad;
  
        if (p.kind === "heart") {
          drawHeart(p.x, p.y, 10 / 18, p.r);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
  
      ctx.globalAlpha = 1;
  
      if (frame < 180) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  
    window.addEventListener("resize", resize, { once: true });
    requestAnimationFrame(step);
  }
  
  /** Tiny tone loop using WebAudio (no external file) */
  function createTonePlayer() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
  
    const ctx = new AudioContext();
    let gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
  
    let osc = null;
    let timer = null;
  
    const melody = [
      [523.25, 180],
      [659.25, 180],
      [783.99, 240],
      [659.25, 180],
      [587.33, 180],
      [659.25, 240],
    ];
  
    function start() {
      if (timer) return;
      if (ctx.state === "suspended") ctx.resume();
  
      gain.gain.setTargetAtTime(0.06, ctx.currentTime, 0.02);
  
      let i = 0;
      timer = setInterval(() => {
        const [freq, dur] = melody[i % melody.length];
        i += 1;
  
        if (osc) {
          try {
            osc.stop();
          } catch {}
        }
        osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        osc.start();
        setTimeout(() => {
          if (osc) {
            try {
              osc.stop();
            } catch {}
          }
        }, Math.max(60, dur));
      }, 220);
    }
  
    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      gain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.03);
      if (osc) {
        try {
          osc.stop();
        } catch {}
        osc = null;
      }
    }
  
    return { start, stop };
  }
  
  function initMusic(state) {
    if (!CONFIG.music.enabled) {
      els.musicBtn.style.display = "none";
      return () => {};
    }
  
    const player = createTonePlayer();
    if (!player) {
      els.musicBtn.style.display = "none";
      return () => {};
    }
  
    const setIcon = () => {
      els.musicBtn.textContent = state.musicOn ? "🔊" : "🔈";
      els.musicBtn.title = state.musicOn ? "Mute" : "Play";
    };
  
    const apply = () => {
      if (state.musicOn) player.start();
      else player.stop();
      setIcon();
    };
  
    els.musicBtn.addEventListener("click", () => {
      state.musicOn = !state.musicOn;
      saveState(state);
      apply();
    });
  
    setIcon();
    return apply;
  }
  
  function initButtons(state) {
    els.yesBtn.addEventListener("click", () => {
      state.accepted = true;
      saveState(state);
      confettiBurst();
      showModal();
      els.yesBtn.textContent = "Yesss 💞";
      els.noBtn.style.display = "none";
      els.tinyHint.textContent = "Best answer ever 😌";
    });
  
    const noPhrases = [
      "Not yet 🙈",
      "Stoppp 😳",
      "You can’t catch me 😇",
      "Try again 😚",
      "Hehe nope 🤭",
      "Okay okay… maybe? 😏",
    ];
  
    const dodge = () => {
      const btn = els.noBtn;
      const parent = els.actions.getBoundingClientRect();
      const rect = btn.getBoundingClientRect();
  
      const maxX = Math.max(0, parent.width - rect.width);
      const maxY = Math.max(0, parent.height - rect.height);
  
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
  
      btn.style.position = "relative";
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
    };
  
    els.noBtn.addEventListener("mouseenter", () => {
      if (state.accepted) return;
      state.noClicks += 1;
      saveState(state);
  
      dodge();
  
      const idx = Math.min(noPhrases.length - 1, state.noClicks % noPhrases.length);
      els.noBtn.textContent = noPhrases[idx];
  
      if (state.noClicks >= 5) {
        els.tinyHint.textContent = "Babe… just press YES already 😭💘";
      }
    });
  
    els.noBtn.addEventListener("click", () => {
      if (state.accepted) return;
      dodge();
    });
  }
  
  function restoreAcceptedUI(state) {
    if (!state.accepted) return;
    els.yesBtn.textContent = "Yesss 💞";
    els.noBtn.style.display = "none";
    els.tinyHint.textContent = "Best answer ever 😌";
  }
  
  (function main() {
    const state = loadState();
    applyConfig();
    startCountdown();
    initModal();
    initCopyLink();
    initReset(state);
    initButtons(state);
    restoreAcceptedUI(state);
  
    const applyMusic = initMusic(state);
    // Don't autoplay; browsers block it. User toggles it.
    applyMusic();
  })();
  