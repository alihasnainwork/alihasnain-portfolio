(() => {
  const SITE_EMAIL = "ali@alihasnainvaservices.site";
  const WA_NUMBER = "923263390990";

  // Mobile navigation
  const b = document.getElementById("menu-toggle");
  const n = document.getElementById("nav-items");
  if (b && n) {
    b.addEventListener("click", () => {
      const open = n.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
    n.addEventListener("click", e => {
      if (e.target.closest("a")) {
        n.classList.remove("open");
        b.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ===== Motion: header state, progress bar, scroll reveal, count-up =====
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      if (header) header.classList.toggle("scrolled", y > 12);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduceMotion && "IntersectionObserver" in window) {
    const groups = [".service-grid", ".price-grid", ".steps", ".work-grid", ".faq-grid", ".review-grid", ".trust-grid", ".about-grid", ".contact-grid"];
    const singles = [".section-head", ".current-project", ".direct-testimonial", ".big-cta .wrap", ".disclaimer"];
    const targets = [];
    groups.forEach(sel => document.querySelectorAll(sel).forEach(g => {
      Array.from(g.children).forEach((c, i) => { c.style.setProperty("--d", Math.min(i, 7) * 0.08 + "s"); targets.push(c); });
    }));
    singles.forEach(sel => document.querySelectorAll(sel).forEach(el => { if (!targets.includes(el)) targets.push(el); }));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("in");
        io.unobserve(el);
        // remove helper classes after the reveal so normal hover transitions work again
        setTimeout(() => { el.classList.remove("rv", "in"); el.style.removeProperty("--d"); }, 1200);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(el => { el.classList.add("rv"); io.observe(el); });
  }

  // Count-up for elements marked data-countup (final text is kept as the end state)
  document.querySelectorAll("[data-countup]").forEach(el => {
    const finalText = el.textContent;
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    el.textContent = "0K+";
    const cio = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      cio.disconnect();
      const start = performance.now(), dur = 1600;
      (function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = t < 1 ? Math.round(eased * 1000) + "K+" : finalText;
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }, { threshold: 0.6 });
    cio.observe(el);
  });

  // Inquiry form
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  function values() {
    const d = new FormData(form);
    const get = k => String(d.get(k) || "").trim();
    return { name: get("name"), email: get("email"), service: get("service"), volume: get("volume"), details: get("details"), website: get("website") };
  }

  function body(d) {
    return "Hello Ali,\n\nI'm interested in " + d.service + ".\n\nEstimated volume: " + (d.volume || "not sure yet") +
      "\n\nProject details:\n" + d.details + "\n\nName: " + d.name + "\nEmail: " + d.email +
      "\n\nPlease let me know your availability and pricing.";
  }

  function openMailto(d) {
    location.href = "mailto:" + SITE_EMAIL + "?subject=" + encodeURIComponent("Project inquiry: " + d.service) + "&body=" + encodeURIComponent(body(d));
    status.textContent = "Your email app should open with a prepared draft. Press Send in your email app to deliver it.";
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = values();
    if (d.website) return; // honeypot: bots fill this hidden field

    // If a form endpoint (for example Formspree) is set in data-endpoint, submit directly.
    const endpoint = (form.dataset.endpoint || "").trim();
    if (!endpoint) { openMailto(d); return; }

    const btn = form.querySelector("button[type=submit]");
    if (btn) btn.disabled = true;
    status.textContent = "Sending your inquiry...";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name: d.name, email: d.email, service: d.service, volume: d.volume, details: d.details, _subject: "Website inquiry: " + d.service })
      });
      if (!res.ok) throw new Error("bad status");
      form.reset();
      status.textContent = "Thank you. Your inquiry was sent and I will reply by email, usually within one business day.";
    } catch (err) {
      status.textContent = "The form could not send. Opening your email app instead.";
      openMailto(d);
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  const wa = document.getElementById("send-whatsapp");
  if (wa) {
    wa.addEventListener("click", () => {
      if (!form.reportValidity()) return;
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(body(values())), "_blank", "noopener,noreferrer");
    });
  }
})();
