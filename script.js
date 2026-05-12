// ── How I Work Slider ──
let hiwIndex = 0;
function hiwCards() {
  return document.querySelectorAll(".hiw-card");
}
function hiwTrackEl() {
  return document.getElementById("hiwTrack");
}

function buildDots() {
  const dots = document.getElementById("hiwDots");
  if (!dots) return;
  dots.innerHTML = "";
  hiwCards().forEach(function (_, i) {
    const d = document.createElement("div");
    d.style.cssText =
      "width:6px;height:6px;border-radius:50%;background:" +
      (i === hiwIndex ? "var(--terracotta)" : "rgba(255,255,255,0.2)") +
      ";transition:background 0.3s;cursor:pointer;";
    d.onclick = function () {
      hiwIndex = i;
      updateSlider();
    };
    dots.appendChild(d);
  });
}

function updateSlider() {
  const track = hiwTrackEl();
  if (!track) return;
  const cardW = 280 + 24;
  track.style.transform = "translateX(-" + hiwIndex * cardW + "px)";
  buildDots();
}

function slideHIW(dir) {
  const cards = hiwCards();
  hiwIndex = Math.max(0, Math.min(cards.length - 1, hiwIndex + dir));
  updateSlider();
}

// Touch swipe
let touchStartX = 0;
document.addEventListener(
  "touchstart",
  function (e) {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true },
);
document.addEventListener(
  "touchend",
  function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    const track = hiwTrackEl();
    if (
      Math.abs(diff) > 50 &&
      track &&
      e.target.closest &&
      e.target.closest("#hiwTrack")
    ) {
      slideHIW(diff > 0 ? 1 : -1);
    }
  },
  { passive: true },
);

window.addEventListener("load", buildDots);

// ── Number counter animation ──
function animateCounters() {
  document.querySelectorAll(".metric-value").forEach(function (el) {
    var text = el.getAttribute("data-val") || el.textContent.trim();
    el.setAttribute("data-val", text);
    var num = parseFloat(text.replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num === 0) return;
    var suffix = text.replace(/[0-9.]/g, "");
    var start = null;
    var duration = 1800;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * num * 10) / 10 + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

var metricsObs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounters();
        metricsObs.disconnect();
      }
    });
  },
  { threshold: 0.3 },
);
var metricsSec = document.getElementById("metrics");
if (metricsSec) metricsObs.observe(metricsSec);

// ── Staggered card entrances ──
var staggerObs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        staggerObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".tools-grid-inner > div, .cert-img")
  .forEach(function (el, i) {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition =
      "opacity 0.5s ease " +
      i * 0.07 +
      "s, transform 0.5s ease " +
      i * 0.07 +
      "s";
    staggerObs.observe(el);
  });

// ── Certificate modal ──
function openCertModal(card) {
  var modal = document.getElementById("certModal");
  if (!modal) return;
  var sourceImg = card.querySelector("img");
  var titleEl = card.querySelector('div[style*="Playfair Display"]');
  var modalImg = modal.querySelector("img");
  var modalCaption = modal.querySelector(".cert-modal-caption");
  if (!sourceImg || !modalImg || !modalCaption) return;
  modalImg.src = sourceImg.src;
  modalImg.alt = sourceImg.alt || "Certificate";
  modalCaption.textContent = titleEl
    ? titleEl.textContent.trim()
    : sourceImg.alt || "Certificate";
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCertModal() {
  var modal = document.getElementById("certModal");
  if (!modal) return;
  modal.classList.remove("open");
  var modalImg = modal.querySelector("img");
  if (modalImg) modalImg.src = "";
  document.body.style.overflow = "";
}

function animateToolScore(el) {
  var target = parseInt(el.getAttribute("data-score"), 10) || 0;
  var start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / 800, 1);
    el.textContent = Math.round(progress * target) + "%";
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var toolScoreObs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateToolScore(e.target);
        toolScoreObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll(".tool-score").forEach(function (el) {
  el.textContent = "0%";
  toolScoreObs.observe(el);
});

// ── FAQ accordion ──
function toggleFaq(btn) {
  var answer = btn.nextElementSibling;
  var icon = btn.querySelector(".faq-icon");
  var isOpen = answer.style.display === "block";
  document.querySelectorAll(".faq-answer").forEach(function (a) {
    a.style.display = "none";
  });
  document.querySelectorAll(".faq-icon").forEach(function (i) {
    i.textContent = "+";
    i.style.transform = "";
  });
  if (!isOpen) {
    answer.style.display = "block";
    icon.textContent = "×";
  }
}

// ── Case study toggle ──
function toggleCS(btn) {
  // Walk up to find cs-body-wrap sibling
  var wrap = null;
  var el = btn;
  while (el && !wrap) {
    if (
      el.nextElementSibling &&
      el.nextElementSibling.classList &&
      el.nextElementSibling.classList.contains("cs-body-wrap")
    ) {
      wrap = el.nextElementSibling;
    } else if (
      el.parentElement &&
      el.parentElement.nextElementSibling &&
      el.parentElement.nextElementSibling.classList &&
      el.parentElement.nextElementSibling.classList.contains("cs-body-wrap")
    ) {
      wrap = el.parentElement.nextElementSibling;
    }
    el = el.parentElement;
  }
  if (!wrap) return;
  var icon = btn.querySelector(".cs-toggle-icon");
  var label = btn.querySelector(".cs-toggle-label");
  var isOpen = wrap.classList.contains("open");
  wrap.classList.toggle("open");
  if (icon) {
    icon.classList.toggle("open");
  }
  btn.setAttribute("aria-expanded", !isOpen);
  if (label)
    label.textContent = isOpen ? "Read full case study" : "Collapse case study";
}

// ── Nav toggle ──
function toggleNav() {
  var nav = document.getElementById("navLinks");
  var btn = document.getElementById("hamburger");
  if (!nav || !btn) return;
  nav.classList.toggle("open");
  btn.classList.toggle("open");
  var isOpen = nav.classList.contains("open");
  btn.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
}
function closeNav() {
  var nav = document.getElementById("navLinks");
  var btn = document.getElementById("hamburger");
  if (!nav || !btn) return;
  nav.classList.remove("open");
  btn.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
window.addEventListener("scroll", closeNav, { passive: true });

// ── Cursor glow ──
var glow = document.getElementById("glowCursor");
document.addEventListener(
  "mousemove",
  function (e) {
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  },
  { passive: true },
);

// ── Reveal on scroll ──
var revealObs = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach(function (el) {
  revealObs.observe(el);
});
