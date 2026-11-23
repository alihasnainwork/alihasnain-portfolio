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
