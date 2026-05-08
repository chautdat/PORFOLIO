// ===== CURSOR — PREMIUM UPGRADE =====
(function () {
  if (window.matchMedia("(pointer:coarse)").matches) return;

  const dot = document.getElementById("cur-dot");
  const ring = document.getElementById("cur-ring");
  const fxCanvas = document.getElementById("cur-fx-canvas");
  const fxCtx = fxCanvas.getContext("2d");

  // Resize FX canvas
  function resizeFx() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  resizeFx();
  window.addEventListener("resize", resizeFx);

  // ── Position ──
  let mx = -300,
    my = -300;
  let rx = -300,
    ry = -300;
  let velX = 0,
    velY = 0; // velocity for skew
  let prevMx = -300,
    prevMy = -300;
  let mode = "default"; // default | hover | view | click

  // ── Mouse ──
  document.addEventListener("mousemove", (e) => {
    prevMx = mx;
    prevMy = my;
    mx = e.clientX;
    my = e.clientY;
    velX = mx - prevMx;
    velY = my - prevMy;
  });
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = ring.style.opacity = "1";
  });

  // ── Magnetic elements ──
  const magnetEls = document.querySelectorAll(
    "a.btn-primary, a.nav-btn, .pg-view-btn, button.mm-close",
  );
  magnetEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      const dx = e.clientX - cx,
        dy = e.clientY - cy;
      el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  // ── Hover & View state ──
  document
    .querySelectorAll("a, button, input, textarea, label, .hamburger")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => setMode("hover"));
      el.addEventListener("mouseleave", () => setMode("default"));
    });

  const viewLabels = {
    "pg-card": "View →",
    "skill-card": "Skill",
    "about-gallery-item": "Photo",
  };
  Object.keys(viewLabels).forEach((cls) => {
    document.querySelectorAll("." + cls).forEach((el) => {
      el.addEventListener("mouseenter", () => setMode("view", viewLabels[cls]));
      el.addEventListener("mouseleave", () => setMode("default"));
    });
  });

  function setMode(m, labelText = "") {
    mode = m;
    const label = document.getElementById("cur-label");
    // Update textpath label
    const tp = document.getElementById("cur-textpath-el");
    if (tp) {
      const txt = labelText || "VIEW PROJECT ✦ VIEW PROJECT ✦ ";
      tp.textContent = txt + " " + txt;
    }
    ring.className = "";
    if (m === "hover") ring.classList.add("is-hover");
    if (m === "view") ring.classList.add("is-view");
    if (m === "click") ring.classList.add("is-click");
    dot.className = "";
    if (m !== "default") dot.classList.add("is-hover");
  }

  // ── Click particle burst ──
  const particles = [];
  document.addEventListener("mousedown", () => {
    setMode("click");
    // Spawn particles
    for (let i = 0; i < 16; i++) {
      const angle = ((Math.PI * 2) / 16) * i + Math.random() * 0.3;
      const speed = Math.random() * 3.5 + 1.5;
      particles.push({
        x: mx,
        y: my,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.035 + 0.025,
        r: Math.random() * 2.5 + 1,
        hue: Math.random() < 0.5 ? "202,170,152" : "232,207,192",
      });
    }
  });
  document.addEventListener("mouseup", () => setMode("default"));

  // ── Skew ring on fast movement ──
  let ringSkewX = 0,
    ringSkewY = 0;

  // ── RAF loop ──
  function tick() {
    // Lerp ring
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;

    // Dot: snap
    dot.style.left = mx + "px";
    dot.style.top = my + "px";

    // Ring: lerped + velocity skew
    const speed = Math.sqrt(velX * velX + velY * velY);
    const maxSkew = 0.18;
    ringSkewX += (-velX * 0.004 - ringSkewX) * 0.18;
    ringSkewY += (-velY * 0.004 - ringSkewY) * 0.18;
    const skewClamp = (v) => Math.max(-maxSkew, Math.min(maxSkew, v));

    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    ring.style.transform = `translate(-50%,-50%) skew(${skewClamp(ringSkewX)}rad, ${skewClamp(ringSkewY)}rad)`;

    // Velocity reset
    velX *= 0.75;
    velY *= 0.75;

    // ── FX canvas: particle burst ──
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= p.decay;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      fxCtx.fillStyle = `rgba(${p.hue},${p.life.toFixed(3)})`;
      fxCtx.fill();
    }

    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== LOADER =====
(function () {
  const bar = document.getElementById("loaderBar");
  const percentEl = document.getElementById("loaderPercent");
  let current = 0;
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(eased * 100);
    if (percentEl) percentEl.textContent = current;
    if (bar) bar.style.width = current + "%";
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (percentEl) percentEl.textContent = "100";
      if (bar) bar.style.width = "100%";
      setTimeout(() => {
        const loaderEl = document.getElementById("loader");
        loaderEl.classList.add("hide");
        document.body.classList.remove("no-scroll");
        setTimeout(() => loaderEl.classList.add("done"), 1000);
        animateStats();
      }, 350);
    }, 300);
  });
})();
document.body.classList.add("no-scroll");

// ===== NAVBAR =====
const navbar = document.getElementById("navbar");
// ── Hero kanji parallax + Back to Top + Section Indicator ──
const heroKanji = document.querySelector(".hero-kanji");
const bttBtn = document.getElementById("bttBtn");
const secIndicator = document.getElementById("secIndicator");
const secIndNum = document.getElementById("secIndNum");
const secIndName = document.getElementById("secIndName");

const sectionMeta = [
  { id: "home", num: "01", name: "HOME" },
  { id: "about", num: "02", name: "ABOUT" },
  { id: "skills", num: "03", name: "SKILLS" },
  { id: "services", num: "04", name: "SERVICES" },
  { id: "projects", num: "05", name: "WORK" },
  { id: "photography", num: "06", name: "PHOTOS" },
  { id: "contact", num: "07", name: "CONTACT" },
];

function updateSecIndicator() {
  const sy = window.scrollY;
  let current = sectionMeta[0];
  sectionMeta.forEach((meta) => {
    const el = document.getElementById(meta.id);
    if (el && sy >= el.offsetTop - window.innerHeight * 0.4) current = meta;
  });
  if (secIndNum) secIndNum.textContent = current.num;
  if (secIndName) secIndName.textContent = current.name;
  if (secIndicator) secIndicator.classList.toggle("visible", sy > 100);
}

window.addEventListener("scroll", () => {
  const sy = window.scrollY;
  // Navbar
  navbar.classList.toggle("scrolled", sy > 50);
  // Nav active
  updateActiveNav();
  // Parallax kanji
  if (heroKanji && sy < window.innerHeight) {
    heroKanji.style.transform = `translateY(${sy * 0.25}px)`;
  }
  // Back to top
  if (bttBtn) bttBtn.classList.toggle("visible", sy > 400);
  // Section indicator
  updateSecIndicator();
});

if (bttBtn) {
  bttBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Active nav link on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current)
      link.classList.add("active");
  });
}

// Smooth scroll nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mmClose = document.getElementById("mmClose");
const mmBackdrop = document.getElementById("mmBackdrop");
const mmLinks = document.querySelectorAll(".mm-link, .mm-cta");

function openMobileMenu() {
  mobileMenu.classList.add("open");
  mmBackdrop.classList.add("open");
  hamburger.classList.add("active");
  document.body.classList.add("no-scroll");
}
function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  mmBackdrop.classList.remove("open");
  hamburger.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

hamburger.addEventListener("click", openMobileMenu);
mmClose.addEventListener("click", closeMobileMenu);
mmBackdrop.addEventListener("click", closeMobileMenu);
mmLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

// ===== SCROLL REVEAL SYSTEM (data-scroll) =====
(function () {
  const TYPES = {
    "fade-up": { transform: "translateY(60px)", opacity: "0" },
    "fade-down": { transform: "translateY(-60px)", opacity: "0" },
    "fade-left": { transform: "translateX(-70px)", opacity: "0" },
    "fade-right": { transform: "translateX(70px)", opacity: "0" },
    "scale-in": { transform: "scale(0.82)", opacity: "0" },
    "clip-up": {
      clipPath: "inset(100% 0 0 0)",
      transform: "translateY(20px)",
      opacity: "0",
    },
    "clip-left": { clipPath: "inset(0 100% 0 0)", opacity: "0" },
    "rotate-in": {
      transform: "rotate(-6deg) translateY(40px) scale(0.95)",
      opacity: "0",
    },
  };

  // Hàm reset element về trạng thái ẩn ban đầu
  function hide(el) {
    const type = TYPES[el.dataset.scroll];
    if (!type) return;
    el.style.transition = "none";
    Object.assign(el.style, type);
    el.classList.remove("is-visible");
  }

  // Hàm hiện element với animation
  function show(el) {
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => {
      el.style.transition =
        "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1), clip-path 0.9s cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.clipPath = "none";
      el.classList.add("is-visible");
    }, delay);
  }

  const els = document.querySelectorAll("[data-scroll]");

  // Set trạng thái ẩn ban đầu
  els.forEach((el) => hide(el));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target); // scroll vào → hiện
        } else {
          hide(entry.target); // scroll ra → ẩn lại
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => io.observe(el));
})();

// Section-line reveal — cũng reset khi ra khỏi view
(function () {
  const els = document.querySelectorAll(".section-line-reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
        } else {
          e.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.2 },
  );
  els.forEach((el) => io.observe(el));
})();

// ===== REVEAL ON SCROLL (legacy .reveal) =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ===== HERO FULLVIEWPORT — MINA STYLE REVEAL =====
(function () {
  function triggerHero() {
    // Big title lines
    document.querySelectorAll(".hbt-line").forEach((el) => {
      el.classList.add("hbt-visible");
    });
    // Descriptor + bottom row
    setTimeout(() => {
      const d = document.querySelector(".hero-descriptor");
      const b = document.querySelector(".hero-bottom-row");
      if (d) d.classList.add("hbt-visible");
      if (b) b.classList.add("hbt-visible");
    }, 300);

    // Counter animation for new hero stats
    document.querySelectorAll(".hsi-num[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 50);
    });
  }

  const loader = document.getElementById("loader");
  if (loader) {
    const mo = new MutationObserver(() => {
      if (loader.classList.contains("hidden") || loader.style.opacity === "0") {
        triggerHero();
        mo.disconnect();
      }
    });
    mo.observe(loader, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }
  // Fallback
  setTimeout(triggerHero, 1800);
})();

// ===== SIDE SCROLL DOTS =====
(function () {
  const dots = document.querySelectorAll(".scroll-dot");
  const sections = [
    "home",
    "about",
    "skills",
    "services",
    "projects",
    "photography",
    "contact",
  ];

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const id = dot.dataset.target;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  function updateDots() {
    let current = "home";
    sections.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec && window.scrollY >= sec.offsetTop - window.innerHeight / 2) {
        current = id;
      }
    });
    dots.forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.target === current);
    });
  }

  window.addEventListener("scroll", updateDots, { passive: true });
  updateDots();
})();

// ===== PARALLAX on hero elements =====
(function () {
  const heroContent = document.querySelector(".hero-content");
  const heroVisual = document.querySelector(".hero-visual");
  const heroBg = document.querySelector(".hero-bg");

  function onScroll() {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.12}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${y * 0.07}px)`;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ===== COUNTER ANIMATION =====
function animateStats() {
  // About section stats
  document.querySelectorAll(".stat-num").forEach((el) => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else el.textContent = Math.floor(current);
    }, 30);
  });
  // Hero stats (.hsi-num with data-count)
  document.querySelectorAll(".hsi-num[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.max(1, target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else el.textContent = Math.floor(current);
    }, 35);
  });
  // Also ed-fact-num (about editorial)
  document.querySelectorAll(".ed-fact-num").forEach((el) => {
    const raw = el.textContent.replace(/\D/g, "");
    const suffix = el.textContent.replace(/[0-9]/g, "");
    const target = parseInt(raw);
    if (!target) return;
    let current = 0;
    const step = Math.max(1, target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else el.textContent = Math.floor(current) + suffix;
    }, 35);
  });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(this);
      const response = await fetch(this.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        // Success
        btn.innerHTML = '<i class="bx bx-check"></i> Sent successfully!';
        btn.style.background = "linear-gradient(135deg, #4caf6e, #2e7d4f)";
        this.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = "";
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error("Send failed");
      }
    } catch {
      btn.innerHTML = '<i class="bx bx-error"></i> Failed, try again';
      btn.style.background = "linear-gradient(135deg, #e06060, #b03030)";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    }
  });
}

// ===== TILT EFFECT on Hero Orb Scene =====
const heroCard = document.querySelector(".hero-orb-scene");
if (heroCard) {
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const cx = rect.width / 2,
      cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -10,
      ry = ((x - cx) / cx) * 10;
    heroCard.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "perspective(700px) rotateX(0) rotateY(0)";
    heroCard.style.transition = "transform 0.6s ease";
  });
}

// ===== COUNTER ANIMATION on Hero Stats =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"), 10);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}
const statNums = document.querySelectorAll(".hero-stat-num[data-count]");
if (statNums.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  statNums.forEach((el) => io.observe(el));
}

// ===== TYPING EFFECT on Hero Tag =====
const tagText = document.querySelector(".hero-tag");
if (tagText) {
  const texts = [
    "Available for work",
    "Open to projects",
    "Let's create together",
  ];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % texts.length;
    tagText.style.opacity = "0";
    setTimeout(() => {
      const dot = tagText.querySelector(".tag-dot");
      tagText.textContent = texts[index];
      tagText.prepend(dot);
      tagText.style.opacity = "1";
    }, 300);
  }, 3000);
}

// ===== NAV LINK =====
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// ===== PARTICLE CANVAS — STARFIELD (full-page, scroll-aware, synced with cursor) =====
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  });

  // ── Shared mouse state (synced with cursor JS) ──
  let mx = -999,
    my = -999;
  let smx = -999,
    smy = -999; // smoothed for aurora pull
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  document.addEventListener("mouseleave", () => {
    mx = -999;
    my = -999;
  });

  // ── Scroll state for section-aware aurora ──
  let scrollRatio = 0; // 0 = top, 1 = bottom
  let targetScrollRatio = 0;
  window.addEventListener(
    "scroll",
    () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScrollRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    },
    { passive: true },
  );

  // ── Click ripple waves (synced with cursor click burst) ──
  const bgRipples = [];
  document.addEventListener("mousedown", () => {
    if (mx < 0) return;
    bgRipples.push({ x: mx, y: my, r: 0, alpha: 0.35, speed: 3.5 });
    bgRipples.push({ x: mx, y: my, r: 0, alpha: 0.18, speed: 2.2 });
  });

  // ── Stars ──
  const STAR_COUNT = 200;
  let stars = [];

  function mkStar() {
    const size =
      Math.random() < 0.12
        ? Math.random() * 2 + 1.2
        : Math.random() < 0.38
          ? Math.random() * 0.9 + 0.5
          : Math.random() * 0.45 + 0.15;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size,
      baseAlpha: Math.random() * 0.5 + 0.25,
      alpha: 0,
      twinkleSpeed: Math.random() * 0.012 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.07,
      vy: (Math.random() - 0.5) * 0.055,
      hue:
        Math.random() < 0.3
          ? "232,207,192"
          : Math.random() < 0.5
            ? "180,195,255"
            : "255,255,255",
    };
  }
  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, mkStar);
  }
  initStars();

  // ── Shooting stars ──
  let meteors = [];
  function spawnMeteor() {
    const fromTop = Math.random() < 0.6;
    meteors.push({
      x: fromTop ? Math.random() * W : -50,
      y: fromTop ? -10 : Math.random() * H * 0.4,
      len: Math.random() * 130 + 80,
      speed: Math.random() * 6 + 5,
      alpha: 1,
      angle: fromTop
        ? Math.PI / 4 + (Math.random() - 0.5) * 0.3
        : Math.PI / 6 + (Math.random() - 0.5) * 0.2,
      width: Math.random() * 1.2 + 0.4,
    });
  }
  setInterval(() => spawnMeteor(), 3000 + Math.random() * 2000);
  setInterval(() => {
    if (Math.random() < 0.28) spawnMeteor();
  }, 1100);

  // ── Aurora blobs — 5 blobs covering full page depth ──
  // Each aurora "zone" corresponds to a scroll position
  const auroras = [
    // Hero zone — warm primary
    {
      bx: 0.15,
      by: 0.8,
      x: 0,
      y: 0,
      r: 360,
      hue: "202,170,152",
      phase: 0,
      speed: 0.003,
      zone: 0.0,
    },
    // Hero zone — blue accent (top right)
    {
      bx: 0.85,
      by: 0.25,
      x: 0,
      y: 0,
      r: 300,
      hue: "107,130,234",
      phase: 2.1,
      speed: 0.0025,
      zone: 0.05,
    },
    // About/Skills zone — warm mid
    {
      bx: 0.2,
      by: 0.55,
      x: 0,
      y: 0,
      r: 290,
      hue: "202,170,152",
      phase: 1.0,
      speed: 0.004,
      zone: 0.35,
    },
    // Projects zone — blue deep
    {
      bx: 0.75,
      by: 0.6,
      x: 0,
      y: 0,
      r: 260,
      hue: "90,120,220",
      phase: 3.5,
      speed: 0.003,
      zone: 0.65,
    },
    // Contact zone — warm accent
    {
      bx: 0.35,
      by: 0.75,
      x: 0,
      y: 0,
      r: 240,
      hue: "180,130,100",
      phase: 4.8,
      speed: 0.0035,
      zone: 0.88,
    },
  ];
  // Init positions
  auroras.forEach((a) => {
    a.x = a.bx * W;
    a.y = a.by * H;
  });

  // ── Draw loop ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smooth scroll
    scrollRatio += (targetScrollRatio - scrollRatio) * 0.04;

    // Smooth mouse for aurora
    if (mx > 0) {
      smx += (mx - smx) * 0.025;
      smy += (my - smy) * 0.025;
    }

    // ── Aurora blobs ──
    auroras.forEach((a, i) => {
      a.phase += a.speed;

      // Base position from viewport — shifts UP as user scrolls past this aurora's zone
      const scrollDelta = (scrollRatio - a.zone) * H * 0.6;
      const targetY = a.by * H - scrollDelta;
      a.y += (targetY - a.y) * 0.012;
      a.x = a.bx * W;

      // Subtle mouse pull
      if (mx > 0) {
        const pullStrength = 0.00014;
        a.x += (smx - a.x) * pullStrength * 60;
        a.y += (smy - a.y) * pullStrength * 40;
      }

      // Proximity to current scroll zone = brighter
      const zoneProx = Math.max(0, 1 - Math.abs(scrollRatio - a.zone) * 4);
      const pulse = Math.sin(a.phase) * 0.022 + 0.055;
      const extra = zoneProx * 0.045;

      // Brighter near cursor
      let cursorBoost = 0;
      if (mx > 0) {
        const d = Math.hypot(mx - a.x, my - a.y);
        cursorBoost = Math.max(0, 1 - d / 600) * 0.04;
      }

      const intensity = pulse + extra + cursorBoost;
      const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r);
      grad.addColorStop(0, `rgba(${a.hue},${(intensity * 1.8).toFixed(3)})`);
      grad.addColorStop(0.45, `rgba(${a.hue},${(intensity * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${a.hue},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(
        a.x,
        a.y + Math.sin(a.phase * 0.7) * 22,
        a.r * 1.7,
        a.r * 0.5,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    // ── Stars ──
    stars.forEach((s) => {
      s.twinklePhase += s.twinkleSpeed;

      let boost = 1;
      if (mx > 0) {
        const d = Math.hypot(s.x - mx, s.y - my);
        if (d < 160) boost = 1 + (1 - d / 160) * 1.8;
      }
      s.alpha =
        s.baseAlpha *
        (0.5 + 0.5 * Math.sin(s.twinklePhase)) *
        Math.min(boost, 2.2);

      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -10) s.x = W + 5;
      if (s.x > W + 10) s.x = -5;
      if (s.y < -10) s.y = H + 5;
      if (s.y > H + 10) s.y = -5;

      // Repel from cursor
      if (mx > 0) {
        const dx = s.x - mx,
          dy = s.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          const f = ((90 - dist) / 90) * 0.7;
          s.x += (dx / dist) * f;
          s.y += (dy / dist) * f;
        }
      }

      if (s.size > 1) {
        const gr = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.size * 3.8,
        );
        gr.addColorStop(0, `rgba(${s.hue},${Math.min(s.alpha, 1).toFixed(3)})`);
        gr.addColorStop(
          0.4,
          `rgba(${s.hue},${(Math.min(s.alpha, 1) * 0.3).toFixed(3)})`,
        );
        gr.addColorStop(1, `rgba(${s.hue},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.hue},${Math.min(s.alpha, 1).toFixed(3)})`;
      ctx.fill();

      if (s.size > 1.4 && Math.sin(s.twinklePhase) > 0.55) {
        const len = s.size * (5 + boost);
        ctx.strokeStyle = `rgba(${s.hue},${(Math.min(s.alpha, 1) * 0.35).toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y);
        ctx.lineTo(s.x + len, s.y);
        ctx.moveTo(s.x, s.y - len);
        ctx.lineTo(s.x, s.y + len);
        ctx.stroke();
      }
    });

    // ── Meteors ──
    meteors = meteors.filter((m) => m.alpha > 0.01);
    meteors.forEach((m) => {
      const tx = m.x - Math.cos(m.angle) * m.len,
        ty = m.y - Math.sin(m.angle) * m.len;
      const gr = ctx.createLinearGradient(tx, ty, m.x, m.y);
      gr.addColorStop(0, `rgba(255,255,255,0)`);
      gr.addColorStop(0.7, `rgba(232,207,192,${(m.alpha * 0.4).toFixed(3)})`);
      gr.addColorStop(1, `rgba(255,255,255,${m.alpha.toFixed(3)})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = gr;
      ctx.lineWidth = m.width;
      ctx.lineCap = "round";
      ctx.stroke();

      const gg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5);
      gg.addColorStop(0, `rgba(255,255,255,${m.alpha.toFixed(3)})`);
      gg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
      ctx.fill();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= 0.007;
      if (m.x > W + 60 || m.y > H + 60) m.alpha = 0;
    });

    // ── Click ripple waves ──
    for (let i = bgRipples.length - 1; i >= 0; i--) {
      const rp = bgRipples[i];
      rp.r += rp.speed;
      rp.alpha -= 0.005;
      if (rp.alpha <= 0) {
        bgRipples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(202,170,152,${rp.alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ── Cursor ambient glow (large soft) ──
    if (mx > 0) {
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
      cg.addColorStop(0, "rgba(202,170,152,0.07)");
      cg.addColorStop(0.4, "rgba(202,170,152,0.03)");
      cg.addColorStop(1, "rgba(202,170,152,0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mx, my, 200, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}

// ===== MAGNETIC BUTTON =====
document
  .querySelectorAll(".btn-primary, .btn-ghost, .nav-btn")
  .forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });

// ===== SMOOTH COUNTER khi scroll vào about =====
const aboutSection = document.querySelector("#about");
let counted = false;
if (aboutSection) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        animateStats();
      }
    },
    { threshold: 0.3 },
  );
  countObserver.observe(aboutSection);
}

// ===== PROJECT ROW — spotlight red glow theo chuột =====
document.querySelectorAll(".pj-row").forEach((row) => {
  row.addEventListener("mousemove", (e) => {
    const rect = row.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    row.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,32,32,0.06) 0%, transparent 60%)`;
  });
  row.addEventListener("mouseleave", () => {
    row.style.background = "";
  });
});

// ===== SKILL CARDS — spotlight glow theo chuột =====
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", x + "px");
    card.style.setProperty("--mouse-y", y + "px");
  });
});

// ===== PROJECT CARD TILT =====
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left,
      y = e.clientY - rect.top;
    const cx = rect.width / 2,
      cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6,
      ry = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById("scrollProgress");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = pct + "%";
  });
}

/* ================================================================
   ADVANCED SCROLL ANIMATIONS
   ================================================================ */

// ── 1. CHAR SPLIT for section titles ──
function splitIntoChars(el) {
  const original = el.innerHTML;
  // Only split plain text nodes, preserve child elements (like .gradient-text)
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      text.split("").forEach((ch) => {
        if (ch === " ") {
          const s = document.createElement("span");
          s.className = "char space";
          s.innerHTML = "&nbsp;";
          frag.appendChild(s);
        } else {
          const s = document.createElement("span");
          s.className = "char";
          s.textContent = ch;
          frag.appendChild(s);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Wrap span content too (gradient-text etc)
      const inner = node.textContent;
      node.innerHTML = "";
      inner.split("").forEach((ch, i) => {
        if (ch === " ") {
          const s = document.createElement("span");
          s.className = "char space";
          s.innerHTML = "&nbsp;";
          node.appendChild(s);
        } else {
          const s = document.createElement("span");
          s.className = "char";
          s.textContent = ch;
          node.appendChild(s);
        }
      });
    }
  });
  // Stagger delays
  el.querySelectorAll(".char").forEach((ch, i) => {
    ch.style.transitionDelay = `${i * 35}ms`;
  });
  el.classList.add("char-split-wrap");
}

// Apply to all section titles — char-split takes over from clip-up
document.querySelectorAll('[data-scroll="char-split"]').forEach((title) => {
  splitIntoChars(title);
});

const charObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("chars-visible");
      } else {
        entry.target.classList.remove("chars-visible"); // reset khi ra ngoài
      }
    });
  },
  { threshold: 0.3 },
);
document
  .querySelectorAll('[data-scroll="char-split"]')
  .forEach((el) => charObserver.observe(el));

// ── 2. PARAGRAPH REVEAL for about bio (fade-up toàn đoạn, không vỡ layout) ──
document.querySelectorAll(".about-bio p").forEach((p, i) => {
  p.setAttribute("data-scroll", "fade-up");
  p.setAttribute("data-delay", String(i * 150));
});

// ── 3. SKILL BARS injected + animated ──
const skillData = [
  { name: "UI/UX Design", pct: 88 },
  { name: "HTML & CSS", pct: 95 },
  { name: "HTML & CSS", pct: 95 },
  { name: "JavaScript", pct: 82 },
  { name: "React / Next.js", pct: 75 },
  { name: "Performance", pct: 80 },
  { name: "Tools & Workflow", pct: 90 },
];
document.querySelectorAll(".skill-card").forEach((card, i) => {
  const pct = skillData[i] ? skillData[i].pct : 80;
  card.dataset.skillPct = pct;
  const bar = document.createElement("div");
  bar.className = "skill-bar-wrap";
  bar.innerHTML = `<span class="skill-bar-label">${pct}%</span><div class="skill-bar-fill"></div>`;
  card.appendChild(bar);
});

const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const pct = card.dataset.skillPct || 80;
      const fill = card.querySelector(".skill-bar-fill");
      if (entry.isIntersecting) {
        if (fill)
          requestAnimationFrame(() => {
            fill.style.width = pct + "%";
          });
        card.classList.add("bar-animated");
      } else {
        if (fill) fill.style.width = "0%"; // reset khi ra
        card.classList.remove("bar-animated");
      }
    });
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll(".skill-card")
  .forEach((card) => skillBarObserver.observe(card));

// ── 4. SECTION PROGRESS LINE injected into each section ──
document.querySelectorAll(".section").forEach((sec) => {
  const line = document.createElement("div");
  line.className = "section-progress-line";
  sec.prepend(line);
});

const sectionLineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  },
  { threshold: 0.15 },
);
document
  .querySelectorAll(".section")
  .forEach((s) => sectionLineObserver.observe(s));

// ── 5. SECTION TAG line-draw ──
const tagDrawObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("tag-drawn"), 300);
      } else {
        entry.target.classList.remove("tag-drawn"); // reset 2 chiều
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll(".section-tag")
  .forEach((el) => tagDrawObserver.observe(el));

// ── 6. FLOATING SECTION LABEL (left edge) ──
const sectionLabels = {
  about: "ABOUT",
  skills: "SKILLS",
  services: "SERVICES",
  projects: "WORK",
  contact: "CONTACT",
};
const flyLabel = document.createElement("div");
flyLabel.className = "section-fly-label";
document.body.appendChild(flyLabel);

const labelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (sectionLabels[id]) {
          flyLabel.textContent = sectionLabels[id];
          flyLabel.classList.add("visible");
        }
      } else {
        // Hide label when this section leaves view
        const id = entry.target.id;
        if (sectionLabels[id] && flyLabel.textContent === sectionLabels[id]) {
          flyLabel.classList.remove("visible");
        }
      }
    });
  },
  { threshold: 0.3 },
);
document
  .querySelectorAll("#about, #skills, #services, #projects, #contact")
  .forEach((s) => labelObserver.observe(s));

// ── 7. SCROLL VELOCITY — speed up animations when scrolling fast ──
let lastScrollY = window.scrollY;
let scrollVelocity = 0;
window.addEventListener(
  "scroll",
  () => {
    const current = window.scrollY;
    scrollVelocity = Math.abs(current - lastScrollY);
    lastScrollY = current;
    // Scale transition speed based on velocity
    const speed = Math.max(0.4, 1 - scrollVelocity * 0.008);
    document.documentElement.style.setProperty("--scroll-speed", speed);
  },
  { passive: true },
);

// ── 8. SMOOTH COUNTER for about float cards ──
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}
function animateValue(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else {
      el.textContent = to;
      el.classList.add("count-pop");
      setTimeout(() => el.classList.remove("count-pop"), 300);
    }
  }
  requestAnimationFrame(step);
}

const floatCardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const numEl = card.querySelector(".float-num");
        if (numEl) {
          // Lấy target từ data attribute để có thể chạy lại nhiều lần
          const target =
            parseInt(
              card.dataset.floatTarget || numEl.textContent.replace(/\D/g, ""),
              10,
            ) || 0;
          card.dataset.floatTarget = target; // lưu lại để dùng khi scroll lại
          animateValue(numEl, 0, target, 1400);
        }
      }
    });
  },
  { threshold: 0.6 },
);
document
  .querySelectorAll(".about-float-card")
  .forEach((el) => floatCardObserver.observe(el));

// ── 9. ABOUT PILLS stagger ──
document.querySelectorAll(".about-pill").forEach((el, i) => {
  el.setAttribute("data-scroll", "scale-in");
  el.setAttribute("data-delay", String(i * 80));
});

// ── 10. STAGGERED project card entrance ──
document.querySelectorAll(".project-card").forEach((card, i) => {
  card.style.setProperty("--reveal-delay", `${i * 150}ms`);
  // Add a shimmer overlay
  const shimmer = document.createElement("div");
  shimmer.className = "card-shimmer";
  shimmer.style.cssText = `
    position:absolute; inset:0; border-radius:inherit;
    background:linear-gradient(105deg, transparent 40%, rgba(255,32,32,0.06) 50%, transparent 60%);
    background-size: 200% 100%; background-position: -100% 0;
    pointer-events:none; transition: background-position 0.6s ease; z-index:1;
  `;
  if (getComputedStyle(card).position === "static")
    card.style.position = "relative";
  card.appendChild(shimmer);
  card.addEventListener("mouseenter", () => {
    shimmer.style.backgroundPosition = "200% 0";
  });
  card.addEventListener("mouseleave", () => {
    shimmer.style.backgroundPosition = "-100% 0";
  });
});

// ── 11. SCROLL-TRIGGERED ambient background glow ──
const ambientColors = {
  home: "radial-gradient(ellipse 80% 60% at 50% 0%,    rgba(255,32,32,0.05) 0%, transparent 70%)",
  about:
    "radial-gradient(ellipse 70% 50% at 20% 50%,   rgba(200,0,0,0.06)   0%, transparent 60%)",
  skills:
    "radial-gradient(ellipse 60% 60% at 80% 40%,   rgba(255,32,32,0.05) 0%, transparent 60%)",
  services:
    "radial-gradient(ellipse 60% 55% at 40% 50%,   rgba(255,32,32,0.06) 0%, transparent 62%)",
  projects:
    "radial-gradient(ellipse 80% 40% at 50% 80%,   rgba(149,1,1,0.08)   0%, transparent 60%)",
  contact:
    "radial-gradient(ellipse 60% 50% at 50% 100%,  rgba(255,32,32,0.05) 0%, transparent 60%)",
};
const ambientEl = document.createElement("div");
ambientEl.className = "section-ambient";
document.body.appendChild(ambientEl);

const ambientObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id || "home";
        ambientEl.style.background = ambientColors[id] || ambientColors.home;
      }
    });
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll("#home, #about, #skills, #services, #projects, #contact")
  .forEach((s) => ambientObserver.observe(s));

// ── 12. TEXT SCRAMBLE ENGINE (Mina-style) ──
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.update = this.update.bind(this);
  }

  // Scramble plain text nodes only, preserve child elements (spans, etc.)
  setText(newText) {
    const oldText = newText;
    const length = oldText.length;
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i];
      const to = oldText[i];
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 14) + 6;
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble to section titles that have data-scramble attribute
// We scramble text content but preserve inner HTML structure for gradient spans
function scrambleElement(el) {
  // Get all text nodes + gradient spans
  const html = el.innerHTML;
  // Extract plain text for scrambling (keep gradient spans intact)
  const textEl = document.createElement("div");
  textEl.innerHTML = html;

  // Only scramble direct text nodes
  const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    const trimmed = node.textContent.trim();
    if (trimmed.length > 0) textNodes.push(node);
  }

  textNodes.forEach((tNode) => {
    const original = tNode.textContent;
    const span = document.createElement("span");
    span.setAttribute("data-target", original);
    span.textContent = original;
    tNode.parentNode.replaceChild(span, tNode);

    const scrambler = new TextScramble(span);
    scrambler.setText(original);
  });

  el.innerHTML = textEl.innerHTML;
}

const scrambleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => scrambleElement(entry.target), 200);
      }
    });
  },
  { threshold: 0.4 },
);
// Scramble section titles on scroll
document
  .querySelectorAll('[data-scroll="char-split"]')
  .forEach((el) => scrambleObserver.observe(el));

// Scramble hero lines after loader (data-scramble attribute)
(function () {
  function runHeroScramble() {
    document.querySelectorAll("[data-scramble]").forEach((el, i) => {
      const original = el.textContent.trim();
      if (!original) return;
      const fx = new TextScramble(el);
      setTimeout(() => fx.setText(original), 300 + i * 180);
    });
  }
  const loader = document.getElementById("loader");
  if (loader) {
    const mo = new MutationObserver(() => {
      if (loader.classList.contains("hidden") || loader.style.opacity === "0") {
        runHeroScramble();
        mo.disconnect();
      }
    });
    mo.observe(loader, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }
  setTimeout(runHeroScramble, 2000); // fallback
})();

// ── 13. SPACED-LETTER REVEAL on section headings ──
(function () {
  const tags = document.querySelectorAll(".section-tag");
  const tagObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("tag-revealed");
          tagObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  tags.forEach((t) => tagObs.observe(t));
})();

// ===== HOVER REVEAL PORTRAIT =====
(function () {
  const trigger = document.querySelector(".hero-hover-trigger");
  const portrait = document.querySelector(".hero-portrait-reveal");
  if (!trigger || !portrait) return;

  trigger.addEventListener("mouseenter", () => {
    portrait.classList.add("visible");
  });
  trigger.addEventListener("mouseleave", () => {
    portrait.classList.remove("visible");
  });
})();

// ===== PAGE TRANSITION + KEYBOARD NAV =====
(function () {
  window.addEventListener("load", () => {
    const transition = document.getElementById("pageTransition");
    if (!transition) return;
    document.body.classList.add("loading");
    setTimeout(() => {
      transition.classList.add("fade-out");
      document.body.classList.remove("loading");
    }, 500);
  });

  const sections = ["home", "about", "skills", "services", "projects", "photography", "contact"];
  let currentSection = 0;
  const shortcutsModal = document.getElementById("shortcutsModal");
  const shortcutsClose = document.getElementById("shortcutsClose");
  const sectionIndicator = document.getElementById("sectionIndicator");
  const siSection = sectionIndicator
    ? sectionIndicator.querySelector(".si-section")
    : null;

  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function toggleShortcuts() {
    if (shortcutsModal) shortcutsModal.classList.toggle("active");
  }
  function closeShortcuts() {
    if (shortcutsModal) shortcutsModal.classList.remove("active");
  }
  function updateSectionIndicator(sectionId) {
    if (!siSection) return;
    const sectionNames = {
      home: "HOME",
      about: "ABOUT",
      skills: "SKILLS",
      services: "SERVICES",
      projects: "PROJECTS",
      photography: "PHOTOGRAPHY",
      contact: "CONTACT",
    };
    siSection.textContent = sectionNames[sectionId] || sectionId.toUpperCase();
  }

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowDown" || e.key === "j") {
      e.preventDefault();
      currentSection = Math.min(currentSection + 1, sections.length - 1);
      navigateToSection(sections[currentSection]);
    }
    if (e.key === "ArrowUp" || e.key === "k") {
      e.preventDefault();
      currentSection = Math.max(currentSection - 1, 0);
      navigateToSection(sections[currentSection]);
    }
    if (e.key >= "1" && e.key <= "7") {
      e.preventDefault();
      const index = parseInt(e.key, 10) - 1;
      currentSection = index;
      navigateToSection(sections[index]);
    }
    if (e.key === "h" || e.key === "H") {
      e.preventDefault();
      currentSection = 0;
      navigateToSection("home");
    }
    if (e.key === "c" || e.key === "C") {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      currentSection = sections.length - 1;
      navigateToSection("contact");
    }
    if (e.key === "?") {
      e.preventDefault();
      toggleShortcuts();
    }
    if (e.key === "Escape") closeShortcuts();
  });

  if (shortcutsClose) shortcutsClose.addEventListener("click", closeShortcuts);
  if (shortcutsModal) {
    shortcutsModal.addEventListener("click", (e) => {
      if (e.target === shortcutsModal) closeShortcuts();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const index = sections.indexOf(id);
        if (index !== -1) {
          currentSection = index;
          updateSectionIndicator(id);
        }
      });
    },
    { threshold: 0.5 },
  );
  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });

  let hasScrolled = false;
  window.addEventListener("scroll", () => {
    if (!hasScrolled && window.scrollY > 100) {
      hasScrolled = true;
      if (sectionIndicator) sectionIndicator.classList.add("visible");
    }
    if (window.scrollY < 100 && sectionIndicator) {
      sectionIndicator.classList.remove("visible");
      hasScrolled = false;
    }
  });
})();

// ===== IMAGE LAZY LOAD + PRELOAD =====
(function () {
  const images = document.querySelectorAll("img[src]");
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        img.classList.add("lazy-loaded");
        imageObserver.unobserve(img);
      });
    },
    { rootMargin: "50px" },
  );
  images.forEach((img) => imageObserver.observe(img));

  ["images/avatar.jpg"].forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
})();
