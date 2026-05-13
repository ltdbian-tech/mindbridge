/* ===== MIND BRIDGE — Shared Interactions ===== */

// ===== Scroll Reveal =====
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ===== Particle Background =====
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      const hues = [50, 170, 190, 340]; // warm, teal, cyan, rose
      this.hue = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(window.innerWidth / 8, 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,200,220, ${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

// ===== Breathing Sync =====
function initBreathing() {
  const circle = document.getElementById('breathCircle');
  const text = document.getElementById('breathText');
  const btn = document.getElementById('breathBtn');
  const audioBtn = document.getElementById('breathAudioBtn');
  if (!circle || !text || !btn) return;

  let running = true;
  let phase = 0;
  let timer = null;
  let audioEnabled = false;
  let audioCtx = null;

  function playChime(freq, duration, volume) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function update() {
    phase = (phase + 1) % 8;
    if (phase < 4) {
      text.textContent = 'Breathe in slowly through your nose...';
      circle.textContent = 'Inhale';
      if (audioEnabled && phase === 0) playChime(528, 1.2, 0.08); // gentle inhale chime
    } else {
      text.textContent = 'Breathe out slowly through your mouth...';
      circle.textContent = 'Exhale';
      if (audioEnabled && phase === 4) playChime(396, 1.2, 0.06); // softer exhale chime
    }
  }

  timer = setInterval(update, 1000);

  btn.addEventListener('click', () => {
    running = !running;
    circle.style.animationPlayState = running ? 'running' : 'paused';
    const orbit = document.querySelector('.breathing-orbit');
    if (orbit) orbit.style.animationPlayState = running ? 'running' : 'paused';
    btn.textContent = running ? 'Pause' : 'Resume';
    if (running && !timer) timer = setInterval(update, 1000);
    if (!running && timer) { clearInterval(timer); timer = null; }
  });

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioBtn.textContent = audioEnabled ? '🔊 Sound On' : '🔇 Sound';
      audioBtn.style.opacity = audioEnabled ? '1' : '0.6';
      if (audioEnabled && !audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioEnabled && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    });
  }
}

// ===== Mood Check-in =====
function initMoodCheck() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const moodResponse = document.getElementById('moodResponse');
  if (!moodBtns.length) return;

  const responses = {
    '😢': "It's okay to feel this way. You're not alone. Try the breathing exercise or reach out to someone you trust.",
    '😟': "Hard days pass. You've made it through every single one so far. Try the grounding tool or a distraction activity.",
    '😐': "Neutral is a valid place to be. Maybe a small act of self-care could shift things gently.",
    '🙂': "That's wonderful. Hold onto this feeling. Consider writing a 'future me' letter while you're here.",
    '😊': "This is beautiful to hear. Your joy matters. Maybe share this warmth with someone else today."
  };

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const emoji = btn.dataset.mood;
      if (moodResponse && responses[emoji]) {
        moodResponse.textContent = responses[emoji];
        moodResponse.style.display = 'block';
        moodResponse.classList.remove('reveal', 'visible');
        void moodResponse.offsetWidth; // reflow
        moodResponse.classList.add('reveal', 'visible');
      }
    });
  });
}

// ===== Distraction Spinner =====
function initSpinner() {
  const wheel = document.getElementById('spinnerWheel');
  const btn = document.getElementById('spinBtn');
  const result = document.getElementById('spinnerResult');
  if (!wheel || !btn) return;

  const activities = [
    'Take a 5-minute walk outside',
    'Listen to your favorite song',
    'Drink a glass of cold water',
    'Text someone you care about',
    'Do 10 jumping jacks or stretches',
    'Write 3 things you can see right now',
    'Hold an ice cube for 30 seconds',
    'Watch a funny video',
    'Take a warm shower',
    'Make yourself a small snack',
    'Look at photos that make you smile',
    'Name 5 things you are grateful for'
  ];

  let angle = 0;
  let spinning = false;

  btn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    result.textContent = '';
    const extra = 720 + Math.random() * 720;
    angle += extra;
    wheel.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
      spinning = false;
      const idx = Math.floor(Math.random() * activities.length);
      result.textContent = activities[idx];
    }, 3000);
  });
}

// ===== Hope Wall: Add Message =====
function initHopeWall() {
  const form = document.getElementById('hopeForm');
  const container = document.getElementById('hopeMessages');
  if (!form || !container) return;

  // Pre-populated messages
  const defaultMessages = [
    { text: "You have survived every single bad day so far. That is proof you are stronger than you think.", author: "Someone who made it through" },
    { text: "The pain you feel today is not permanent. It will soften, and you will smile again.", author: "A friend who cares" },
    { text: "Your existence matters. The world is better with you in it, even if you can't feel that right now.", author: "A stranger sending love" },
    { text: "One breath at a time. One hour at a time. One day at a time. You don't have to figure it all out now.", author: "Someone who understands" },
    { text: "Healing is not linear. There will be setbacks, but each one teaches you something new about yourself.", author: "A fellow traveler" },
    { text: "You are not a burden. The people who love you would rather hear your struggles than attend your funeral.", author: "Someone who almost didn't make it" },
    { text: "Tomorrow might not be perfect, but it might be a little easier. And that little bit counts.", author: "A survivor" },
    { text: "Your story isn't over. The best chapters might still be waiting to be written.", author: "Someone who found hope again" }
  ];

  // Load from localStorage + defaults
  let messages = JSON.parse(localStorage.getItem('mindbridge_hope') || '[]');
  defaultMessages.forEach(m => {
    if (!messages.some(existing => existing.text === m.text)) {
      messages.push({ ...m, date: new Date().toISOString() });
    }
  });

  function render() {
    container.innerHTML = '';
    messages.slice().reverse().forEach(m => {
      const div = document.createElement('div');
      div.className = 'hope-message reveal visible';
      div.innerHTML = `<p>${escapeHtml(m.text)}</p><span class="hope-author">— ${escapeHtml(m.author)}</span>`;
      container.appendChild(div);
    });
  }

  render();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('hopeText').value.trim();
    const author = document.getElementById('hopeAuthor').value.trim() || 'Anonymous';
    if (!text) return;
    messages.push({ text, author, date: new Date().toISOString() });
    localStorage.setItem('mindbridge_hope', JSON.stringify(messages));
    document.getElementById('hopeText').value = '';
    document.getElementById('hopeAuthor').value = '';
    render();
  });
}

// ===== Future Me Letters =====
function initFutureMe() {
  const form = document.getElementById('letterForm');
  const container = document.getElementById('savedLetters');
  if (!form || !container) return;

  let letters = JSON.parse(localStorage.getItem('mindbridge_letters') || '[]');

  function render() {
    container.innerHTML = '';
    if (letters.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">No letters yet. Write something kind to your future self.</p>';
      return;
    }
    letters.slice().reverse().forEach(l => {
      const div = document.createElement('div');
      div.className = 'saved-letter';
      const date = new Date(l.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      div.innerHTML = `<div class="date">${date}</div><p>${escapeHtml(l.text).replace(/\n/g, '<br>')}</p>`;
      container.appendChild(div);
    });
  }

  render();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = document.getElementById('letterText').value.trim();
    if (!text) return;
    letters.push({ text, date: new Date().toISOString() });
    localStorage.setItem('mindbridge_letters', JSON.stringify(letters));
    document.getElementById('letterText').value = '';
    render();
  });
}

// ===== Reasons to Live Jar =====
function initReasonsJar() {
  const reasons = [
    { emoji: '🌅', text: "Sunrises you haven't seen yet", category: "Nature" },
    { emoji: '🎵', text: "Music that gives you chills", category: "Joy" },
    { emoji: '🍕', text: "Your favorite food — there's more to taste", category: "Experience" },
    { emoji: '🐕', text: "Animals who would miss you", category: "Love" },
    { emoji: '📚', text: "Books you haven't read yet", category: "Discovery" },
    { emoji: '✈️', text: "Places you haven't traveled to", category: "Adventure" },
    { emoji: '😂', text: "Laughter that makes your stomach hurt", category: "Joy" },
    { emoji: '👤', text: "Someone who would be devastated to lose you", category: "Connection" },
    { emoji: '🎬', text: "Movies and shows you haven't watched", category: "Entertainment" },
    { emoji: '🌸', text: "Seasons changing — autumn leaves, spring blooms", category: "Nature" },
    { emoji: '🏆', text: "Goals you haven't achieved yet", category: "Growth" },
    { emoji: '🫂', text: "Hugs you haven't received yet", category: "Connection" },
    { emoji: '🌙', text: "Starry nights that make everything feel small in a good way", category: "Nature" },
    { emoji: '🎂', text: "Birthdays and celebrations to come", category: "Life" },
    { emoji: '🌱', text: "The person you are becoming", category: "Growth" }
  ];

  const container = document.getElementById('reasonsContainer');
  const btn = document.getElementById('reasonBtn');
  if (!container || !btn) return;

  let shown = [];
  let current = null;

  function showRandom() {
    const available = reasons.filter((_, i) => !shown.includes(i));
    if (available.length === 0) shown = [];
    const pool = available.length > 0 ? available : reasons;
    const idx = Math.floor(Math.random() * pool.length);
    const reason = reasons[idx];
    shown.push(idx);

    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'reason-jar reveal';
    div.innerHTML = `<div style="display:flex; align-items:center; gap:16px;"><span class="emoji">${reason.emoji}</span><div><div class="reason-text">${reason.text}</div><div class="reason-category">${reason.category}</div></div></div>`;
    container.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));
  }

  showRandom();
  btn.addEventListener('click', showRandom);
}

// ===== Safety Plan Generator =====
function initSafetyPlan() {
  const form = document.getElementById('safetyForm');
  const preview = document.getElementById('planPreview');
  const content = document.getElementById('planContent');
  if (!form) return;

  const questions = [
    { id: 'q1', title: 'Warning Signs' },
    { id: 'q2', title: 'Internal Coping Strategies' },
    { id: 'q3', title: 'Comforting People & Places' },
    { id: 'q4', title: 'People I Can Ask for Help' },
    { id: 'q5', title: 'Professionals & Crisis Services' },
    { id: 'q6', title: 'Making My Environment Safer' },
    { id: 'q7', title: 'Reasons I Want to Live' }
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!content || !preview) return;
    content.innerHTML = '';
    let hasContent = false;

    questions.forEach((q, index) => {
      const val = document.getElementById(q.id)?.value.trim();
      if (val) {
        hasContent = true;
        const div = document.createElement('div');
        div.className = 'plan-section';
        div.innerHTML = `<h4>${index + 1}. ${q.title}</h4><p>${val.replace(/\n/g, '<br>')}</p>`;
        content.appendChild(div);
      }
    });

    if (!hasContent) {
      content.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Fill in at least one field above to generate your plan.</p>';
    }
    preview.classList.add('visible');
    preview.scrollIntoView({ behavior: 'smooth' });
  });

  const downloadBtn = document.getElementById('downloadPlanBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      let text = 'MY SAFETY PLAN\nGenerated on MindBridge\n===================\n\n';
      questions.forEach((q, index) => {
        const val = document.getElementById(q.id)?.value.trim();
        if (val) text += `${index + 1}. ${q.title.toUpperCase()}\n${val}\n\n`;
      });
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'my-safety-plan.txt';
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
}

// ===== Emergency Exit =====
function initEmergencyExit() {
  const btn = document.getElementById('emergencyExit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
  });
}

// ===== Calm Space / Zen Mode =====
function initCalmSpace() {
  const openBtn = document.getElementById('openCalmSpace');
  const closeBtn = document.getElementById('closeCalmSpace');
  const space = document.getElementById('calmSpace');
  const orb = document.getElementById('calmOrb');
  const text = document.getElementById('calmText');
  if (!space) return;

  const phrases = [
    'Breathe in slowly...',
    'Hold...',
    'Breathe out gently...',
    'You are safe here.',
    'Let the tension melt away.',
    'This moment is just for you.',
    'You are doing enough.',
    'You are allowed to rest.',
    'Each breath is a new beginning.',
    'You are more resilient than you know.'
  ];

  function cycleText() {
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      if (!space.classList.contains('active')) { clearInterval(interval); return; }
      text.style.opacity = '0';
      setTimeout(() => {
        text.textContent = phrases[i % phrases.length];
        text.style.opacity = '1';
        i++;
      }, 400);
    }, 3500);
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      space.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (text) { text.textContent = 'Breathe in slowly...'; text.style.opacity = '1'; }
      cycleText();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      space.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// ===== 15-Minute Crisis Timer =====
function initCrisisTimer() {
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');
  const display = document.getElementById('timerDisplay');
  const ringFill = document.getElementById('timerRingFill');
  const message = document.getElementById('timerMessage');
  const activities = document.querySelectorAll('.timer-activity');
  if (!startBtn || !display) return;

  const messages = [
    { time: 900, text: "You're doing something incredibly brave right now. Just by staying, you are choosing life." },
    { time: 840, text: "In the next 14 minutes, things might not change. But your perspective might shift — even a little." },
    { time: 780, text: "Think of one person who would miss you. Not in a guilty way — in a 'they love you' way." },
    { time: 720, text: "Try naming 3 things you can feel right now. The ground under you. Air on your skin." },
    { time: 660, text: "You've already made it 5 minutes. Your strength is showing." },
    { time: 600, text: "If you're near water, splash some on your face. If not, hold something cold. Let your body feel alive." },
    { time: 540, text: "Write one sentence about how you're feeling. No judgment. Just observation." },
    { time: 480, text: "Halfway there. You're proving to yourself that you can ride this wave." },
    { time: 420, text: "Text someone — anyone. It can just be 'hi.' Connection is powerful." },
    { time: 360, text: "Stand up and stretch. Reach your arms as high as they'll go. Your body wants to keep going." },
    { time: 300, text: "Think of the last time you laughed. It happened once. It will happen again." },
    { time: 240, text: "You're in the home stretch. These last few minutes are where the heaviness often starts to lift." },
    { time: 180, text: "Take 5 deep breaths with us. In through the nose, out through the mouth." },
    { time: 120, text: "2 minutes left. You have done something extraordinary today: you waited." },
    { time: 60, text: "1 minute. You are so close. When this ends, take a moment to feel proud of yourself." },
    { time: 0, text: "15 minutes. You stayed. You are alive. That is victory. Now: rest, reach out, or try another tool." }
  ];

  let timer = null;
  let seconds = 900;
  let running = false;

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  }

  function update() {
    display.textContent = format(seconds);
    if (ringFill) {
      const pct = (900 - seconds) / 900;
      ringFill.style.transform = `rotate(${pct * 360}deg)`;
    }

    const msg = messages.find(m => seconds <= m.time && seconds > m.time - 60);
    if (msg && message) message.textContent = msg.text;

    if (seconds <= 0) {
      clearInterval(timer);
      running = false;
      startBtn.textContent = 'Start Again';
      if (message) message.innerHTML = '<span style="color:var(--accent-warm); font-weight:600;">15 minutes. You stayed. You chose life. That is everything.</span>';
      return;
    }
    seconds--;
  }

  startBtn.addEventListener('click', () => {
    if (running) {
      clearInterval(timer);
      running = false;
      startBtn.textContent = 'Resume';
      return;
    }
    if (seconds <= 0) { seconds = 900; }
    running = true;
    startBtn.textContent = 'Pause';
    timer = setInterval(update, 1000);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timer);
      running = false;
      seconds = 900;
      display.textContent = format(seconds);
      if (ringFill) ringFill.style.transform = 'rotate(0deg)';
      startBtn.textContent = 'Start 15 Minutes';
      if (message) message.textContent = messages[0].text;
      activities.forEach(a => a.classList.remove('completed'));
    });
  }

  activities.forEach(act => {
    act.addEventListener('click', () => act.classList.toggle('completed'));
  });
}

// ===== Interactive Grounding Steps =====
function initInteractiveGrounding() {
  const steps = document.querySelectorAll('.grounding-step[data-step]');
  if (!steps.length) return;

  steps.forEach(step => {
    const input = step.querySelector('.grounding-input');
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });
  });
}

// ===== Utility =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initReveal();
  initBreathing();
  initMoodCheck();
  initSpinner();
  initHopeWall();
  initFutureMe();
  initReasonsJar();
  initSafetyPlan();
  initEmergencyExit();
  initCalmSpace();
  initCrisisTimer();
  initInteractiveGrounding();
  initThemeToggle();
  initTriageFlow();
  initHoldOnWidget();
  initAccessibilityControls();
});

/* ===== Theme Toggle ===== */
function initThemeToggle() {
  const saved = localStorage.getItem('mindbridge_theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('mindbridge_theme', 'dark');
        btn.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('mindbridge_theme', 'light');
        btn.textContent = '☀️';
      }
    });
    // Set initial icon
    btn.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
  });
}

/* ===== Triage Flow ===== */
function initTriageFlow() {
  const container = document.querySelector('.triage-container');
  if (!container) return;

  const question = container.querySelector('.triage-question');
  const options = container.querySelector('.triage-options');
  const results = container.querySelectorAll('.triage-result');
  const backBtn = container.querySelector('.triage-back');

  if (!options) return;

  options.querySelectorAll('.triage-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) {
        question.style.display = 'none';
        options.style.display = 'none';
        results.forEach(r => r.classList.remove('active'));
        const result = container.querySelector('#' + target);
        if (result) {
          result.classList.add('active');
          result.style.display = 'block';
        }
        if (backBtn) backBtn.style.display = 'inline-block';
      }
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      question.style.display = 'block';
      options.style.display = 'grid';
      results.forEach(r => {
        r.classList.remove('active');
        r.style.display = 'none';
      });
      backBtn.style.display = 'none';
    });
    backBtn.style.display = 'none';
  }
}

/* ===== Hold On Widget ===== */
function initHoldOnWidget() {
  const widget = document.querySelector('.hold-on-widget');
  if (!widget) return;

  // Don't show on certain pages
  const hidePages = ['help-now.html', 'timer.html'];
  const current = window.location.pathname.split('/').pop();
  if (hidePages.includes(current)) {
    widget.classList.add('hidden');
    return;
  }

  // Streak
  const STORAGE_KEY = 'mindbridge_pledges';
  const streakEl = widget.querySelector('.streak');
  if (streakEl) {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      if (list.length > 0) {
        const last = new Date(list[list.length - 1].date);
        const now = new Date();
        const diff = Math.floor((now - last) / (1000 * 60 * 60));
        if (diff < 48) {
          streakEl.textContent = `You've kept your promise for ${diff < 1 ? 'less than an hour' : diff + ' hour' + (diff > 1 ? 's' : '')}. You're doing it.`;
        }
      }
    } catch { }
  }

  // Random hope snippet
  const hopeSnippets = [
    "You have survived 100% of your hardest days.",
    "This feeling is temporary. You are permanent.",
    "Someone out there is glad you exist today.",
    "The fact that you're still here is proof of your strength.",
    "You don't have to have it all figured out. Just keep going.",
    "Your story isn't over. This is just a hard chapter.",
    "You matter. Not because of what you do, but because you are.",
    "It's okay to not be okay. It's not okay to give up.",
    "Tomorrow might be the day everything shifts. Stay.",
    "You are more than this moment."
  ];

  const snippetEl = widget.querySelector('.hope-snippet');
  const refreshBtn = widget.querySelector('.hope-btn');

  function showRandomSnippet() {
    if (snippetEl) snippetEl.textContent = '"' + hopeSnippets[Math.floor(Math.random() * hopeSnippets.length)] + '"';
  }

  showRandomSnippet();
  if (refreshBtn) refreshBtn.addEventListener('click', showRandomSnippet);

  // Close button
  const closeBtn = widget.querySelector('.close-widget');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      widget.classList.add('hidden');
      localStorage.setItem('mindbridge_widget_closed', Date.now());
    });
  }

  // Re-show after 24 hours
  try {
    const closed = parseInt(localStorage.getItem('mindbridge_widget_closed'));
    if (closed && Date.now() - closed < 24 * 60 * 60 * 1000) {
      widget.classList.add('hidden');
    }
  } catch { }
}

/* ===== Accessibility Controls ===== */
function initAccessibilityControls() {
  const bar = document.querySelector('.a11y-bar');
  if (!bar) return;

  const fontBtns = bar.querySelectorAll('[data-font]');
  const motionBtn = bar.querySelector('[data-motion]');

  // Load saved preferences
  const savedFont = localStorage.getItem('mindbridge_font');
  const savedMotion = localStorage.getItem('mindbridge_motion');

  if (savedFont) document.body.classList.add(savedFont);
  if (savedMotion === 'reduced') document.body.classList.add('reduced-motion');

  // Font size buttons
  fontBtns.forEach(btn => {
    const size = btn.dataset.font;
    if (savedFont === size) btn.classList.add('active');

    btn.addEventListener('click', () => {
      document.body.classList.remove('font-small', 'font-large', 'font-xlarge');
      fontBtns.forEach(b => b.classList.remove('active'));
      if (size !== 'normal') {
        document.body.classList.add(size);
        localStorage.setItem('mindbridge_font', size);
        btn.classList.add('active');
      } else {
        localStorage.removeItem('mindbridge_font');
      }
    });
  });

  // Motion toggle
  if (motionBtn) {
    if (savedMotion === 'reduced') motionBtn.classList.add('active');

    motionBtn.addEventListener('click', () => {
      document.body.classList.toggle('reduced-motion');
      if (document.body.classList.contains('reduced-motion')) {
        localStorage.setItem('mindbridge_motion', 'reduced');
        motionBtn.classList.add('active');
      } else {
        localStorage.removeItem('mindbridge_motion');
        motionBtn.classList.remove('active');
      }
    });
  }
}
