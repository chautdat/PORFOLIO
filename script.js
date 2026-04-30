// ===== CURSOR =====
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");
let mouseX = 0,
  mouseY = 0,
  followerX = 0,
  followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + "px";
  follower.style.top = followerY + "px";
  requestAnimationFrame(animateFollower);
}
animateFollower();

document
  .querySelectorAll("a, button, .skill-card, .project-card, .highlight")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
      follower.classList.add("active");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
      follower.classList.remove("active");
    });
  });

// ===== LOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    document.body.classList.remove("no-scroll");
    animateStats();
  }, 2000);
});
document.body.classList.add("no-scroll");

// ===== NAVBAR =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  updateActiveNav();
});

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

// ===== SIDE SCROLL DOTS =====
(function () {
  const dots = document.querySelectorAll(".scroll-dot");
  const sections = ["home", "about", "skills", "projects", "contact"];

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
    mobileMenuOpen = false;
  });
});

// ===== TEXT SCRAMBLE EFFECT trên hero title =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#@$%&";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const promise = new Promise((res) => (this.resolve = res));
    this.queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameReq);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "",
      complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else output += from;
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) this.resolve();
    else {
      this.frameReq = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Áp dụng scramble cho hero title lines khi load xong
window.addEventListener("load", () => {
  const lines = document.querySelectorAll(".hero-title .line");
  lines.forEach((line, i) => {
    const original = line.textContent.trim();
    const fx = new TextScramble(line);
    setTimeout(() => fx.setText(original), 2200 + i * 200);
  });
});

// ===== PARTICLE CANVAS — STARFIELD =====
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

  let mx = -999,
    my = -999;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  document.addEventListener("mouseleave", () => {
    mx = -999;
    my = -999;
  });

  // ── Stars ──
  const STAR_COUNT = 160;
  let stars = [];

  function mkStar(forced) {
    const size =
      Math.random() < 0.15
        ? Math.random() * 1.8 + 1.2 // big
        : Math.random() < 0.4
          ? Math.random() * 0.9 + 0.5 // medium
          : Math.random() * 0.45 + 0.15; // tiny
    return {
      x: forced ? Math.random() * W : Math.random() * W,
      y: forced ? Math.random() * H : Math.random() * H,
      size,
      baseAlpha: Math.random() * 0.5 + 0.25,
      alpha: 0,
      twinkleSpeed: Math.random() * 0.012 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.06,
      // colour: mostly white, some warm, some blue
      hue:
        Math.random() < 0.3
          ? `rgba(232,207,192,`
          : Math.random() < 0.5
            ? `rgba(180,195,255,`
            : `rgba(255,255,255,`,
    };
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, () => mkStar(true));
  }
  initStars();

  // ── Shooting stars ──
  let meteors = [];
  function spawnMeteor() {
    const fromTop = Math.random() < 0.6;
    meteors.push({
      x: fromTop ? Math.random() * W : -50,
      y: fromTop ? -10 : Math.random() * H * 0.4,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 6 + 5,
      alpha: 1,
      angle: fromTop
        ? Math.PI / 4 + (Math.random() - 0.5) * 0.3
        : Math.PI / 6 + (Math.random() - 0.5) * 0.2,
      width: Math.random() * 1.2 + 0.4,
      tail: [],
    });
  }
  // Spawn meteor every 2.5–5s
  setInterval(spawnMeteor, Math.random() * 2500 + 2500);
  setInterval(() => {
    if (Math.random() < 0.3) spawnMeteor();
  }, 1000);

  // ── Aurora blobs (slow drifting colour blobs at the bottom edge) ──
  const auroras = [
    {
      x: W * 0.15,
      y: H * 0.88,
      r: 320,
      hue: "202,170,152",
      phase: 0,
      speed: 0.003,
    },
    {
      x: W * 0.6,
      y: H * 0.92,
      r: 260,
      hue: "107,130,234",
      phase: 2.1,
      speed: 0.004,
    },
    {
      x: W * 0.85,
      y: H * 0.85,
      r: 200,
      hue: "90,191,116",
      phase: 4.3,
      speed: 0.0025,
    },
  ];

  // ── Draw loop ──
  let tick = 0;
  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    // Aurora glow
    auroras.forEach((a) => {
      a.phase += a.speed;
      const pulse = Math.sin(a.phase) * 0.03 + 0.07;
      const grad = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r);
      grad.addColorStop(0, `rgba(${a.hue},${(pulse * 1.6).toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(${a.hue},${(pulse * 0.5).toFixed(3)})`);
      grad.addColorStop(1, `rgba(${a.hue},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(
        a.x,
        a.y + Math.sin(a.phase * 0.7) * 20,
        a.r * 1.6,
        a.r * 0.55,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    // Stars
    stars.forEach((s) => {
      // Twinkle
      s.twinklePhase += s.twinkleSpeed;
      s.alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(s.twinklePhase));

      // Gentle drift
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -10) s.x = W + 5;
      if (s.x > W + 10) s.x = -5;
      if (s.y < -10) s.y = H + 5;
      if (s.y > H + 10) s.y = -5;

      // Mouse repel (subtle)
      const dx = s.x - mx,
        dy = s.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = ((100 - dist) / 100) * 0.6;
        s.x += (dx / dist) * force;
        s.y += (dy / dist) * force;
      }

      // Draw star with glow for bigger ones
      if (s.size > 1) {
        const grd = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.size * 3.5,
        );
        grd.addColorStop(0, `${s.hue}${s.alpha.toFixed(3)})`);
        grd.addColorStop(0.4, `${s.hue}${(s.alpha * 0.35).toFixed(3)})`);
        grd.addColorStop(1, `${s.hue}0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Core dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `${s.hue}${s.alpha.toFixed(3)})`;
      ctx.fill();

      // Cross sparkle on large stars
      if (s.size > 1.4 && Math.sin(s.twinklePhase) > 0.6) {
        const len = s.size * 5;
        ctx.strokeStyle = `${s.hue}${(s.alpha * 0.35).toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(s.x - len, s.y);
        ctx.lineTo(s.x + len, s.y);
        ctx.moveTo(s.x, s.y - len);
        ctx.lineTo(s.x, s.y + len);
        ctx.stroke();
      }
    });

    // Shooting stars / meteors
    meteors = meteors.filter((m) => m.alpha > 0.01);
    meteors.forEach((m) => {
      const tailX = m.x - Math.cos(m.angle) * m.len;
      const tailY = m.y - Math.sin(m.angle) * m.len;

      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.7, `rgba(232,207,192,${(m.alpha * 0.4).toFixed(3)})`);
      grad.addColorStop(1, `rgba(255,255,255,${m.alpha.toFixed(3)})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = "round";
      ctx.stroke();

      // Leading glow
      const glowGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 4);
      glowGrad.addColorStop(0, `rgba(255,255,255,${m.alpha.toFixed(3)})`);
      glowGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
      ctx.fill();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.alpha -= 0.008;

      // Remove when off screen
      if (m.x > W + 50 || m.y > H + 50) m.alpha = 0;
    });

    // Mouse cursor glow
    if (mx > 0 && my > 0) {
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 90);
      cg.addColorStop(0, "rgba(202,170,152,0.06)");
      cg.addColorStop(1, "rgba(202,170,152,0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mx, my, 90, 0, Math.PI * 2);
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
      }
    });
    // Hide when none intersecting
    const anyVisible = entries.some(
      (e) => e.isIntersecting && sectionLabels[e.target.id],
    );
    if (!anyVisible && !entries.some((e) => e.isIntersecting)) {
      flyLabel.classList.remove("visible");
    }
  },
  { threshold: 0.4 },
);
document
  .querySelectorAll("#about, #skills, #projects, #contact")
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
    background:linear-gradient(105deg, transparent 40%, rgba(202,170,152,0.07) 50%, transparent 60%);
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
  home: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(202,170,152,0.06) 0%, transparent 70%)",
  about:
    "radial-gradient(ellipse 70% 50% at 20% 50%, rgba(154,134,120,0.08) 0%, transparent 60%)",
  skills:
    "radial-gradient(ellipse 60% 60% at 80% 40%, rgba(202,170,152,0.07) 0%, transparent 60%)",
  projects:
    "radial-gradient(ellipse 80% 40% at 50% 80%, rgba(74,64,56,0.12) 0%, transparent 60%)",
  contact:
    "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(202,170,152,0.06) 0%, transparent 60%)",
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
  .querySelectorAll("#home, #about, #skills, #projects, #contact")
  .forEach((s) => ambientObserver.observe(s));

// ── 12. SECTION TITLE GLITCH flicker on entry ──
function glitchFlicker(el) {
  let count = 0;
  const maxFlicker = 5;
  const interval = setInterval(() => {
    el.style.opacity = count % 2 === 0 ? "0.7" : "1";
    el.style.textShadow =
      count % 2 === 0 ? "2px 0 #caaa98, -2px 0 #9a8678" : "none";
    count++;
    if (count > maxFlicker * 2) {
      clearInterval(interval);
      el.style.opacity = "";
      el.style.textShadow = "";
    }
  }, 60);
}

const glitchObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => glitchFlicker(entry.target), 400); // chạy lại mỗi lần vào view
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll('[data-scroll="char-split"]')
  .forEach((el) => glitchObserver.observe(el));
