(function () {
  document.documentElement.classList.add("js");

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  var revealNodes = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function showReveal(el) { el.classList.add("is-in"); }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach(showReveal);
  } else {
    var seen = new Map();
    revealNodes.forEach(function (el) {
      var parent = el.parentElement || document.body;
      var count = seen.get(parent) || 0;
      el.style.transitionDelay = Math.min(count, 5) * 70 + "ms";
      seen.set(parent, count + 1);
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    revealNodes.forEach(function (el) { observer.observe(el); });
    function revealInView() {
      revealNodes.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        var rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.top < window.innerHeight - 8) {
          showReveal(el);
        }
      });
    }
    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView);
    document.addEventListener("visibilitychange", revealInView);
    window.addEventListener("pageshow", revealInView);
    window.addEventListener("load", revealInView);
    requestAnimationFrame(revealInView);
    window.setTimeout(revealInView, 250);
    window.setTimeout(revealInView, 900);
  }

  var shots = Array.prototype.slice.call(document.querySelectorAll(".zoom-btn"));
  var lb = document.querySelector(".lb");
  if (shots.length && lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var index = 0;
    var lastFocus = null;
    var showToken = 0;
    var hasShown = false;

    function show(next) {
      index = (next + shots.length) % shots.length;
      var btn = shots[index];
      var pic = btn.querySelector("img");
      var token = ++showToken;
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var apply = function () {
        if (token !== showToken) return;
        lbImg.src = pic.currentSrc || pic.src;
        lbImg.alt = pic.alt;
        lbCap.textContent = btn.getAttribute("data-caption") || pic.alt || "";
      };
      if (reduceMotion || !hasShown) {
        hasShown = true;
        lbImg.classList.remove("is-out");
        apply();
        return;
      }
      lbImg.classList.add("is-out");
      window.setTimeout(function () {
        apply();
        if (token === showToken) lbImg.classList.remove("is-out");
      }, 180);
    }

    function openAt(i, opener) {
      lastFocus = opener || document.activeElement;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      show(i);
      var closeBtn = lb.querySelector(".lb-close");
      if (closeBtn) closeBtn.focus();
    }

    function closeLb() {
      lb.hidden = true;
      document.body.style.overflow = "";
      lbImg.classList.remove("is-out");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (shots.length < 2) {
      var controls = lb.querySelector(".lb-controls");
      if (controls) controls.hidden = true;
    }

    shots.forEach(function (btn, i) {
      btn.addEventListener("click", function () { openAt(i, btn); });
    });

    lb.querySelector(".lb-close").addEventListener("click", closeLb);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
    lb.addEventListener("click", function (event) {
      if (event.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (event) {
      if (lb.hidden) return;
      if (event.key === "Escape") closeLb();
      if (event.key === "ArrowRight") show(index + 1);
      if (event.key === "ArrowLeft") show(index - 1);
    });
  }

  document.querySelectorAll("form.rfq").forEach(function (form) {
    var send = form.querySelector("[data-send]");
    var result = form.querySelector(".form-result");
    if (!send || !result) return;
    function showDemo(event) {
      if (event) event.preventDefault();
      result.hidden = false;
      result.textContent = "This is a demo form. Nothing was sent.";
    }
    send.addEventListener("click", showDemo);
    form.addEventListener("submit", showDemo);
  });
})();
