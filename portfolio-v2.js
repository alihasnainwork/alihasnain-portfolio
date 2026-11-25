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

  // ===== Live matching demo (all data is fictional) =====
  const demo = document.getElementById("flow-demo");
  if (demo) {
    const RECORDS = [
      { address: "1428 Elm Ridge Dr, Charlotte, NC 28205", owner: "Marcus A. Hale", mailing: "PO Box 2214, Charlotte, NC 28247", landline: "(704) 555-0142", wireless: "(704) 555-0177", email: "marcus.hale@example.com", score: 98 },
      { address: "806 Cedar Hollow Ln, Raleigh, NC 27603", owner: "Priya Nair", mailing: "Same as property address", landline: "(919) 555-0118", wireless: "(919) 555-0163", email: "priya.nair@example.com", score: 96 },
      { address: "311 Birchwood Ave, Greensboro, NC 27401", owner: "Daniel & Rosa Whitfield", mailing: "77 Lakeview Ct, Durham, NC 27705", landline: "(336) 555-0129", wireless: "(336) 555-0184", email: "whitfield.dr@example.com", score: 94 },
      { address: "2210 Maple Crest Rd, Charlotte, NC 28209", owner: "Elena M. Cortez", mailing: "9 Harbor Point Dr, Wilmington, NC 28409", landline: "(704) 555-0151", wireless: "(980) 555-0132", email: "elena.cortez@example.com", score: 97 },
      { address: "57 Oak Meadow Ct, Durham, NC 27713", owner: "Thomas J. Reed", mailing: "Same as property address", landline: "(919) 555-0106", wireless: "(919) 555-0198", email: "t.reed@example.com", score: 99 },
      { address: "1903 Willow Bend Way, Fayetteville, NC 28303", owner: "Aisha Rahman", mailing: "4412 Summit Pkwy, Atlanta, GA 30339", landline: "(910) 555-0147", wireless: "(404) 555-0121", email: "aisha.rahman@example.com", score: 95 },
      { address: "640 Pinecrest Blvd, Greensboro, NC 27410", owner: "Gregory L. Doyle", mailing: "PO Box 918, Greensboro, NC 27402", landline: "(336) 555-0165", wireless: "(336) 555-0112", email: "greg.doyle@example.com", score: 93 },
      { address: "3319 Sycamore St, Raleigh, NC 27610", owner: "Linda & Paul Okafor", mailing: "Same as property address", landline: "(919) 555-0139", wireless: "(984) 555-0170", email: "okafor.family@example.com", score: 97 }
    ];
    const q = s => demo.querySelector(s);
    const fields = {};
    demo.querySelectorAll(".flow-fields li").forEach(li => { fields[li.dataset.f] = li; });
    const steps = Array.from(demo.querySelectorAll(".flow-steps li"));
    const recEl = q("#flow-rec"), stateEl = q("#flow-state"), fillEl = q("#flow-meter-fill"), valEl = q("#flow-meter-val");
    const procEl = q("#flow-processed"), matchEl = q("#flow-matched"), scoreEl = q("#flow-score"), list = q("#flow-list");
    let processed = 0, scoreSum = 0, idx = 0;

    const setStep = n => steps.forEach((s, i) => { s.classList.toggle("done", i < n); s.classList.toggle("on", i === n); });
    const setField = (key, state, text) => {
      const li = fields[key];
      li.className = state;
      if (text !== undefined) li.querySelector(".fv").textContent = text;
    };
    const setMeter = v => { fillEl.style.width = v + "%"; valEl.textContent = v + "%"; };
    const setState = (text, ok) => { stateEl.textContent = text; stateEl.classList.toggle("ok", !!ok); };
    const counters = () => {
      procEl.textContent = String(processed);
      matchEl.textContent = String(processed);
      scoreEl.textContent = processed ? Math.round(scoreSum / processed) + "%" : "—";
    };
    const chip = (k, text) => {
      const s = document.createElement("span");
      s.dataset.k = k;
      s.textContent = text;
      return s;
    };
    const feedItem = rec => {
      const li = document.createElement("li");
      li.className = "flow-item";
      const box = document.createElement("div");
      box.className = "fi-box";
      const main = document.createElement("div");
      main.className = "fi-main";
      const name = document.createElement("strong");
      name.textContent = rec.owner;
      const addr = document.createElement("span");
      addr.textContent = rec.address;
      main.append(name, addr);
      const score = document.createElement("b");
      score.className = "fi-score";
      score.textContent = rec.score + "%";
      const contact = document.createElement("div");
      contact.className = "fi-contact";
      contact.append(chip("LANDLINE", rec.landline), chip("WIRELESS", rec.wireless), chip("EMAIL", rec.email));
      box.append(main, score, contact);
      li.appendChild(box);
      return li;
    };
    const addFeed = (rec, instant) => {
      const li = feedItem(rec);
      list.prepend(li);
      if (instant) li.classList.add("in");
      else requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add("in")));
      while (list.children.length > 5) list.lastElementChild.remove();
    };

    const reduceDemo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceDemo || !("IntersectionObserver" in window)) {
      // Static end state: no animation, still shows the finished result
      list.textContent = "";
      for (let i = 4; i >= 1; i--) addFeed(RECORDS[i], true);
      processed = 5;
      scoreSum = RECORDS.slice(0, 5).reduce((a, r) => a + r.score, 0);
      counters();
    } else {
      let visible = false, tabOn = !document.hidden, wake = null;
      const active = () => visible && tabOn;
      const resume = () => { if (active() && wake) { const w = wake; wake = null; w(); } };
      const gate = async () => { while (!active()) await new Promise(r => { wake = r; }); };
      const sleep = async ms => { await gate(); await new Promise(r => setTimeout(r, ms)); await gate(); };
      document.addEventListener("visibilitychange", () => { tabOn = !document.hidden; resume(); });

      const typeInto = async (key, text) => {
        const v = fields[key].querySelector(".fv");
        for (let i = 1; i <= text.length; i++) { v.textContent = text.slice(0, i); await sleep(15); }
      };
      const lookup = async (key, text, searchMs, step) => {
        setStep(step);
        setField(key, "searching", "Searching…");
        await sleep(searchMs);
        setField(key, "typing", "");
        await typeInto(key, text);
        setField(key, "done");
        await sleep(160);
      };
      const animateMeter = async score => {
        await gate();
        const t0 = performance.now(), dur = 900;
        await new Promise(res => {
          (function frame(now) {
            const t = Math.min(1, (now - t0) / dur);
            setMeter(Math.round(score * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(frame); else res();
          })(t0);
        });
      };
      const play = async rec => {
        Object.keys(fields).forEach(k => setField(k, "idle", "—"));
        setMeter(0);
        recEl.textContent = "RECORD #" + String(processed + 1).padStart(4, "0");
        setState("Input received", false);
        setStep(0);
        setField("address", "done", rec.address);
        await sleep(700);
        setState("Matching owner…", false);
        await lookup("owner", rec.owner, 800, 1);
        await lookup("mailing", rec.mailing, 500, 1);
        setState("Finding phones…", false);
        await lookup("landline", rec.landline, 800, 2);
        await lookup("wireless", rec.wireless, 800, 3);
        setState("Checking email…", false);
        await lookup("email", rec.email, 800, 4);
        setStep(5);
        setState("Final check…", false);
        await animateMeter(rec.score);
        setStep(6);
        setState("Matched", true);
        processed++;
        scoreSum += rec.score;
        counters();
        addFeed(rec, false);
        await sleep(1500);
      };

      // Start from a clean state; the first run replaces the static no-JS markup
      list.textContent = "";
      processed = 0; scoreSum = 0;
      counters();
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        resume();
      }, { threshold: 0.2 }).observe(demo);
      (async () => { for (;;) { await play(RECORDS[idx % RECORDS.length]); idx++; } })();
    }
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
