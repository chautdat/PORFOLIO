// ═══════════════════════════════════════════════════════
// MINA-STYLE ANIMATIONS
// ═══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════
// 1. SPACED LETTER ANIMATION — Text reveal khi scroll vào
// ══════════════════════════════════════════════════════════════════
(function () {
  const pretexts = document.querySelectorAll(".manifesto-pretext, .q2-pretext");

  pretexts.forEach((pretext) => {
    const originalText = pretext.textContent;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pretext.innerHTML = "";

            // Wrap each character in span with animation delay
            originalText.split("").forEach((char, index) => {
              const span = document.createElement("span");
              span.textContent = char;
              span.style.display = "inline-block";
              span.style.opacity = "0";
              span.style.transform = "translateY(20px)";
              span.style.animation = `letterReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s forwards`;
              pretext.appendChild(span);
            });

            observer.unobserve(pretext); // Chỉ chạy 1 lần
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(pretext);
  });

  // CSS animation được define trong style
  const style = document.createElement("style");
  style.textContent = `
    @keyframes letterReveal {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
})();

// ══════════════════════════════════════════════════════════════════
// 2. SCRAMBLE TEXT EFFECT — Chữ thay đổi random khi scroll vào
// ══════════════════════════════════════════════════════════════════
function scrambleText(element, finalText, duration = 2000) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  const length = finalText.length;
  let frame = 0;
  const totalFrames = Math.floor(duration / 30);

  const interval = setInterval(() => {
    let scrambled = "";
    for (let i = 0; i < length; i++) {
      if (frame / totalFrames > i / length) {
        // Reveal actual character
        scrambled += finalText[i];
      } else {
        // Random character
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    element.textContent = scrambled;
    frame++;

    if (frame >= totalFrames) {
      clearInterval(interval);
      element.textContent = finalText;
    }
  }, 30);
}

// Apply to elements with data-scramble (chạy khi scroll vào viewport)
document.querySelectorAll("[data-scramble]").forEach((el) => {
  const text = el.textContent;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scrambleText(el, text, 1500);
          observer.unobserve(el); // Chỉ chạy 1 lần
        }
      });
    },
    { threshold: 0.5 },
  );

  observer.observe(el);
});

// ══════════════════════════════════════════════════════════════════
// 3. CHARACTER SPLIT REVEAL — Reveal từng chữ khi scroll
// ══════════════════════════════════════════════════════════════════
function splitTextToChars(element) {
  // Get text content (strips HTML)
  const text = element.textContent;

  // Store original HTML to preserve <span> tags
  const hasHTML = element.innerHTML !== text;

  if (hasHTML) {
    // If has HTML tags, just animate the whole element
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return;
  }

  // No HTML tags - safe to split
  element.innerHTML = "";

  text.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.classList.add("char");
    span.style.opacity = "0";
    span.style.display = "inline-block";
    span.style.transform = "translateY(30px) rotateX(-90deg)";
    span.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s`;
    element.appendChild(span);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate in (chỉ 1 lần)
          entry.target.querySelectorAll(".char").forEach((char) => {
            char.style.opacity = "1";
            char.style.transform = "translateY(0) rotateX(0)";
          });
          observer.unobserve(entry.target); // Stop observing
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(element);
}

// Apply to elements with [data-scroll="char-split"]
document.querySelectorAll('[data-scroll="char-split"]').forEach((el) => {
  splitTextToChars(el);
});

// ══════════════════════════════════════════════════════════════════
// 4. WORD BY WORD REVEAL — Reveal từng từ
// ══════════════════════════════════════════════════════════════════
function splitTextToWords(element) {
  const text = element.textContent;
  element.innerHTML = "";

  const words = text.split(/\s+/).filter((word) => word.length > 0);

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.classList.add("word");
    span.style.display = "inline-block";
    span.style.opacity = "0";
    span.style.transform = "translateY(20px)";
    span.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
    span.style.marginRight = "0.3em"; // Add space between words
    element.appendChild(span);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".word").forEach((word) => {
            word.style.opacity = "1";
            word.style.transform = "translateY(0)";
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(element);
}

// Apply to elements with [data-scroll="word-split"]
document.querySelectorAll('[data-scroll="word-split"]').forEach((el) => {
  splitTextToWords(el);
});

// ══════════════════════════════════════════════════════════════════
// 5. GLITCH TEXT EFFECT — Text glitch khi hover
// ══════════════════════════════════════════════════════════════════
document.querySelectorAll("[data-glitch]").forEach((el) => {
  const originalText = el.textContent;

  el.addEventListener("mouseenter", () => {
    let iteration = 0;
    const chars = "アイウエオカキクケコサシスセソタチツテト";

    const interval = setInterval(() => {
      el.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  });
});

// ══════════════════════════════════════════════════════════════════
// 6. TYPING EFFECT — Chữ xuất hiện như đang gõ
// ══════════════════════════════════════════════════════════════════
function typeWriter(element, text, speed = 50) {
  element.textContent = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Apply to elements with [data-type]
document.querySelectorAll("[data-type]").forEach((el) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const text = el.textContent;
          const speed = parseInt(el.dataset.typeSpeed) || 50;
          typeWriter(el, text, speed);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  observer.observe(el);
});

// ══════════════════════════════════════════════════════════════════
// 7. NUMBER COUNTER WITH EASING — Số đếm lên smooth
// ══════════════════════════════════════════════════════════════════
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutExpo)
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    const current = Math.floor(start + (target - start) * easeProgress);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// Enhanced number counter
document.querySelectorAll(".bn-num[data-target]").forEach((el) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(el.dataset.target);
          animateNumber(el, target, 2000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );
  observer.observe(el);
});

// ══════════════════════════════════════════════════════════════════
// 8. MAGNETIC CURSOR EFFECT — Cursor bị kéo về buttons
// ══════════════════════════════════════════════════════════════════
document
  .querySelectorAll(".btn-primary, .hero-cta-btn, .nav-btn")
  .forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

// ══════════════════════════════════════════════════════════════════
// 9. JAPANESE → ENGLISH NAVBAR ANIMATION
// ══════════════════════════════════════════════════════════════════
document
  .querySelectorAll(".nav-link[data-jp][data-en], .nav-btn[data-jp][data-en]")
  .forEach((link) => {
    const jpText = link.getAttribute("data-jp");
    const enText = link.getAttribute("data-en");

    link.addEventListener("mouseenter", () => {
      let iteration = 0;
      const maxLength = Math.max(jpText.length, enText.length);

      const interval = setInterval(() => {
        link.textContent = enText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return enText[index];
            }
            // Random transition chars
            return jpText[Math.floor(Math.random() * jpText.length)] || char;
          })
          .join("");

        iteration += 1 / 2;

        if (iteration >= enText.length) {
          clearInterval(interval);
          link.textContent = enText;
        }
      }, 30);
    });

    link.addEventListener("mouseleave", () => {
      let iteration = 0;

      const interval = setInterval(() => {
        link.textContent = jpText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return jpText[index];
            }
            // Random transition chars
            return enText[Math.floor(Math.random() * enText.length)] || char;
          })
          .join("");

        iteration += 1 / 2;

        if (iteration >= jpText.length) {
          clearInterval(interval);
          link.textContent = jpText;
        }
      }, 30);
    });
  });

// ══════════════════════════════════════════════════════════════════
// 10. FADE-UP ANIMATION — Elements fade in khi scroll
// ══════════════════════════════════════════════════════════════════
document.querySelectorAll('[data-scroll="fade-up"]').forEach((el) => {
  const delay = parseInt(el.getAttribute("data-delay")) || 0;

  // Set initial state
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(el);
});

// ══════════════════════════════════════════════════════════════════
// 11. JAPANESE TEXT - KEEP STATIC (No hover animation)
// ══════════════════════════════════════════════════════════════════
// Text remains in Japanese from HTML - clean & simple!
console.log("🎌 Japanese text kept static - no animation needed!");

console.log("🎬 Mina-style animations loaded!");
