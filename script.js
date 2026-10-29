/* ============================================================
   PALAK / BROMINE — CONTENT & VISUAL CONFIGURATION
   Change the words in SITE_CONTENT to personalise the experience.
   The animation and date logic below can stay exactly as they are.
   ============================================================ */

const SITE_CONTENT = {
  // Screen 1: star-lettering intro. Use \n if you want to force a line break.
  introText: "I heard someone's birthday is a day closer MUAHAHAH😭✌️",

  // Screen 2: heading and constellation observation notes.
  countdownHeading: "woo hoo, someone's birthday ♡",
  observationNotes: [
    "Antares — the red star doing all the work while the rest of us just exist.",
    "One of the stars is prolly just standing there, minding its own business.",
    "Lowkey impressive how even the tiny stars get their own moment.",
    "Life is not a straight line. Neither is your thought process, apparently.",
    "Scorpius looks weird no?.",
    "Observation: You are the main chracter for this month.",
    "Well the one sided efforts i am putting in this friendship is crazy BUT WORTH IT",
    "The Scorpion has a whole ass dramatic tail. Very on brand for you honestly.",
    "The universe is huge,and we still met call it fate?.",
    "Small star.",
    "YOU ARE WONDERFUL AND ANYONE WHO MAKES YOU FEEL OTHERWISE IS STUPID.",
    "Some things take a while to notice.IYKYK.",
    "official report: you are doing better than you think. do not argue with the scientist."
  ],

  // Screen 3: the message formed out of stars.
  personalMessage: "Well Well Well its NOV 2 that  means 18 DAYS TILL YOU BRITHDAYYY i know i ragebait you are lot , but like bruhh you one of the most GOAT'ed friend and my safe spacee, like you deserve sooo much and dont let anyone make you feel otherwise",

  // Ordinary-day secret. This is available every day of the year.
  ordinarySecret: " You have officially exceeded a human's limit for being STUPID(and iconic). even world's top scientist are confused.",

  // Moon Easter egg. Edit every report line here.
  palakusTitle: "BHONDU MAXIMUS",
  palakusSubtitle: "A highly unserious specimen. Scientists are still recovering.",
  palakusClassification: "Extremely rare.",
  palakusCharacteristics: "Weirdly Chaotic, questionable life choice, and an inexplicable ability to be \"CHOMU\" AND BAUNA.",
  palakusDiscoveryStatus: "Accidentally found by the universe. God is unwilling to return this product.",
  palakusOfficialNote: "Scientists have attempted to explain this phenomenon. They have given up cause you cant explain this cast of stupidity.",
  palakusSignoff: "— The Completely Legitimate Space Research Department",

  // Birthday-only secret. Available only on November 20 in India.
  birthdaySecret: "Happy Birth Dayyyyy! The God has officially approved your existence for another year(Thank god)."
};

const SITE_CONFIG = {
  // Background star density is scaled for performance and device size.
  backgroundStarDensity: 0.00043, // stars per screen pixel
  maxBackgroundStars: 820,
  introAnimationMs: 6200,
  introHoldMs: 1900,
  shootingStarMs: 1500,
  typographyParticleStep: 4,
  maxTypographyParticles: 1450,
  typographyFontScale: 0.092,
  backgroundIntensity: 1,
  moonPosition: { top: "7%", right: "7%" },
  constellationGlow: 1
};

(() => {
  "use strict";

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const screens = {
    intro: $("#screen-intro"),
    countdown: $("#screen-countdown"),
    letter: $("#screen-letter"),
    constellation: $("#screen-constellation")
  };

  // Content is inserted as text, not HTML, so personal edits remain safe.
  $("#countdown-heading").textContent = SITE_CONTENT.countdownHeading;
  $("#palakus-title").textContent = `✦ ${SITE_CONTENT.palakusTitle} ✦`;
  $("#palakus-classification").textContent = SITE_CONTENT.palakusClassification;
  $("#palakus-characteristics").textContent = SITE_CONTENT.palakusCharacteristics;
  $("#palakus-discovery").textContent = SITE_CONTENT.palakusDiscoveryStatus;
  $("#palakus-official-note").textContent = SITE_CONTENT.palakusOfficialNote;
  $("#palakus-signoff").textContent = SITE_CONTENT.palakusSignoff;
  $("#ordinary-message").textContent = SITE_CONTENT.ordinarySecret;
  $("#birthday-message").textContent = SITE_CONTENT.birthdaySecret;
  $(".palakus-subtitle").textContent = SITE_CONTENT.palakusSubtitle;

  // --- Layered background star field ---------------------------------------
  const bgCanvas = $("#background-stars");
  const bgCtx = bgCanvas.getContext("2d", { alpha: true });
  let bgStars = [];
  let bgW = 0, bgH = 0, dpr = 1;
  let rafId = 0;
  let lastFrame = 0;

  function resizeBackground() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    bgW = window.innerWidth;
    bgH = window.innerHeight;
    bgCanvas.width = Math.round(bgW * dpr);
    bgCanvas.height = Math.round(bgH * dpr);
    bgCanvas.style.width = `${bgW}px`;
    bgCanvas.style.height = `${bgH}px`;
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(SITE_CONFIG.maxBackgroundStars, Math.max(70, Math.round(bgW * bgH * SITE_CONFIG.backgroundStarDensity)));
    bgStars = Array.from({ length: count }, () => ({
      x: Math.random() * bgW, y: Math.random() * bgH,
      r: Math.random() * 1.15 + .25,
      base: Math.random() * .52 + .12,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * .0008 + .00015,
      drift: (Math.random() - .5) * .04
    }));
  }

  function drawBackground(now = 0) {
    if (document.hidden) { rafId = 0; return; }
    bgCtx.clearRect(0, 0, bgW, bgH);
    for (const s of bgStars) {
      const twinkle = reducedMotion ? 0 : (Math.sin(now * s.speed + s.phase) + 1) * .12;
      const alpha = Math.min(.85, (s.base + twinkle) * SITE_CONFIG.backgroundIntensity);
      bgCtx.beginPath();
      bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(196,220,255,${alpha})`;
      bgCtx.fill();
      if (s.r > 1.05 && alpha > .48) {
        bgCtx.strokeStyle = `rgba(169,213,255,${alpha * .23})`;
        bgCtx.lineWidth = .5;
        bgCtx.beginPath(); bgCtx.moveTo(s.x - 3, s.y); bgCtx.lineTo(s.x + 3, s.y);
        bgCtx.moveTo(s.x, s.y - 3); bgCtx.lineTo(s.x, s.y + 3); bgCtx.stroke();
      }
      if (!reducedMotion) {
        s.y += .012;
        s.x += s.drift;
        if (s.y > bgH + 2) s.y = -2;
        if (s.x < -2) s.x = bgW + 2;
        if (s.x > bgW + 2) s.x = -2;
      }
    }
    rafId = requestAnimationFrame(drawBackground);
  }

  function startBackground() {
    if (!rafId && !document.hidden) rafId = requestAnimationFrame(drawBackground);
  }
  function stopBackground() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // --- Readable glass typography (no particle text, so mobile stays crisp) ----
  class GlassMessage {
    constructor(element, text) {
      this.element = element;
      this.text = text;
      this.prepare();
    }
    prepare() {
      this.element.textContent = this.text;
      this.element.classList.remove("message-revealed");
      void this.element.offsetWidth;
      this.element.classList.add("message-revealed");
    }
    revealNow() {
      this.element.textContent = this.text;
      this.element.classList.add("message-revealed");
    }
    destroy() {}
  }

  const introTypography = new GlassMessage($("#intro-typography"), SITE_CONTENT.introText);
  const letterTypography = new GlassMessage($("#letter-typography"), SITE_CONTENT.personalMessage);

  // --- Screen navigation and intro sequence -------------------------------
  let activeScreen = "intro";
  let introTimer = null;
  let shootingTimer = null;
  function showScreen(name) {
    activeScreen = name;
    Object.entries(screens).forEach(([key, element]) => {
      const active = key === name;
      element.classList.toggle("is-active", active);
      element.setAttribute("aria-hidden", String(!active));
    });
    if (name === "letter") letterTypography.prepare();
    if (name === "countdown") updateBirthdayUI(new Date());
    if (name !== "constellation") $("#palakus-reveal").hidden = true;
    $("#moon-button").setAttribute("aria-expanded", String(name === "constellation"));
    $("#moon-button").classList.remove("is-glowing");
    $("#observation-note").hidden = true;
    $("#ordinary-note").hidden = true;
    $("#toast-note").hidden = true;
  }
  function startIntroSequence() {
    if (reducedMotion) {
      introTypography.revealNow();
      introTimer = setTimeout(() => showScreen("countdown"), 1000);
      return;
    }
    introTimer = setTimeout(() => {
      $("#shooting-star").classList.add("fly");
      shootingTimer = setTimeout(() => showScreen("countdown"), SITE_CONFIG.shootingStarMs);
    }, SITE_CONFIG.introHoldMs + 2900);
  }
  function skipIntro() {
    clearTimeout(introTimer); clearTimeout(shootingTimer);
    $("#shooting-star").classList.remove("fly");
    introTypography.revealNow();
    showScreen("countdown");
  }
  $("#skip-intro").addEventListener("click", skipIntro);
  $("#back-to-intro").addEventListener("click", () => {
    showScreen("intro");
    introTypography.prepare();
    clearTimeout(introTimer); clearTimeout(shootingTimer);
  });
  $("#to-letter").addEventListener("click", () => showScreen("letter"));
  $("#back-to-countdown").addEventListener("click", () => showScreen("countdown"));
  const constellationBack = document.createElement("button");
  constellationBack.type = "button";
  constellationBack.className = "quiet-button constellation-back";
  constellationBack.textContent = "← back to the letter";
  constellationBack.addEventListener("click", () => { palakus.hidden = true; showScreen("letter"); });
  $("#screen-constellation").appendChild(constellationBack);
  $("#reveal-letter").addEventListener("click", () => letterTypography.revealNow());

  // --- Birthday logic: always calculated against Asia/Kolkata --------------
  // India Standard Time is UTC+05:30 year-round. We use Intl to obtain the
  // authoritative Indian calendar date and convert the target midnight to UTC.
  function indianDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(date);
    const result = {};
    for (const part of parts) if (part.type !== "literal") result[part.type] = Number(part.value);
    return result;
  }
  function getBirthdayState(now = new Date()) {
    const p = indianDateParts(now);
    const birthdayMode = p.month === 11 && p.day === 20;
    const targetYear = (p.month > 11 || (p.month === 11 && p.day > 20)) ? p.year + 1 : p.year;
    // Nov 20 00:00 IST equals Nov 19 18:30:00 UTC.
    const target = new Date(Date.UTC(targetYear, 10, 19, 18, 30, 0));
    const diff = Math.max(0, target.getTime() - now.getTime());
    return { birthdayMode, targetYear, target, diff, indian: p };
  }
  function updateBirthdayUI(now = new Date()) {
    const state = getBirthdayState(now);
    $("#countdown-core").hidden = state.birthdayMode;
    $("#birthday-mode").hidden = !state.birthdayMode;
    $("#birthday-secret").hidden = !state.birthdayMode;
    if (state.birthdayMode) {
      $(".heading-subtitle").textContent = "i am more excited than you are for this tbh.";
    } else {
      $(".heading-subtitle").textContent = "i am such a great friend no?.";
      const totalSeconds = Math.floor(state.diff / 1000);
      $("#days").textContent = String(Math.floor(totalSeconds / 86400)).padStart(3, "0");
      $("#hours").textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
      $("#minutes").textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      $("#seconds").textContent = String(totalSeconds % 60).padStart(2, "0");
    }
  }
  window.PalakBirthdayClock = Object.freeze({ getBirthdayState, indianDateParts });
  updateBirthdayUI(new Date());
  const countdownInterval = setInterval(() => updateBirthdayUI(new Date()), 1000);

  // --- Constellation observations ------------------------------------------
  const observationStars = $$(".star-point");
  observationStars.forEach((star, index) => {
    star.setAttribute("tabindex", "0");
    star.setAttribute("role", "button");
    star.setAttribute("aria-label", `Open observation ${index + 1}`);
    const reveal = () => {
      observationStars.forEach(s => s.classList.remove("selected"));
      star.classList.add("selected");
      star.style.filter = "drop-shadow(0 0 13px rgba(220,238,255,1))";
      $("#note-index").textContent = String(index + 1).padStart(2, "0");
      $("#observation-text").textContent = SITE_CONTENT.observationNotes[index % SITE_CONTENT.observationNotes.length];
      const note = $("#observation-note");
      note.hidden = false;
      note.style.left = window.innerWidth < 700 ? "15px" : `${Math.max(18, Math.min(window.innerWidth - 300, (star.getBoundingClientRect().left + 18)))}px`;
      note.style.top = window.innerWidth < 700 ? "auto" : `${Math.max(150, Math.min(window.innerHeight - 180, star.getBoundingClientRect().top + 18))}px`;
      if (window.innerWidth < 700) note.style.bottom = "88px";
    };
    star.addEventListener("click", reveal);
    star.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } });
  });
  $("#close-observation").addEventListener("click", () => { $("#observation-note").hidden = true; });
  $("#close-ordinary").addEventListener("click", () => { $("#ordinary-note").hidden = true; });

  // --- Ordinary-day secret -------------------------------------------------
  $("#ordinary-secret").addEventListener("click", () => {
    showScreen("countdown");
    $("#ordinary-note").hidden = true;
    $("#toast-message").textContent = SITE_CONTENT.ordinarySecret;
    $("#toast-note").hidden = false;
  });
  $("#close-toast").addEventListener("click", () => { $("#toast-note").hidden = true; });

  // --- Moon Easter egg: PALAKUS MAXIMUS -----------------------------------
  const moon = $("#moon-button");
  const palakus = $("#palakus-reveal");
  // The secret is a genuine fourth screen, not an overlay that disappears with the letter.
  $("#constellation-screen-content").appendChild(palakus);
  moon.style.top = SITE_CONFIG.moonPosition.top;
  moon.style.right = SITE_CONFIG.moonPosition.right;
  function openPalakus() {
    palakus.hidden = false;
    $("#scientific-report").hidden = true;
    $("#report-toggle").setAttribute("aria-expanded", "false");
    $("#report-toggle").innerHTML = 'VIEW SCIENTIFIC REPORT <span aria-hidden="true">＋</span>';
    showScreen("constellation");
    moon.setAttribute("aria-expanded", "true");
    moon.classList.add("is-glowing");
  }
  moon.addEventListener("click", openPalakus);
  $("#close-palakus").addEventListener("click", () => {
    palakus.hidden = true;
    showScreen("letter");
  });
  $("#report-toggle").addEventListener("click", () => {
    const report = $("#scientific-report");
    report.hidden = !report.hidden;
    const expanded = !report.hidden;
    $("#report-toggle").setAttribute("aria-expanded", String(expanded));
    $("#report-toggle").innerHTML = `${expanded ? "HIDE SCIENTIFIC REPORT" : "VIEW SCIENTIFIC REPORT"} <span aria-hidden="true">${expanded ? "−" : "＋"}</span>`;
  });

  // --- Birthday-only secret: separate from both other secrets --------------
  $("#birthday-secret").addEventListener("click", () => {
    const state = getBirthdayState(new Date());
    if (!state.birthdayMode) return;
    $("#birthday-reveal").hidden = false;
  });
  $("#close-birthday-reveal").addEventListener("click", () => { $("#birthday-reveal").hidden = true; });

  // --- Lifecycle and reduced background work -------------------------------
  function onVisibilityChange() {
    if (document.hidden) stopBackground();
    else startBackground();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("resize", resizeBackground);
  window.addEventListener("beforeunload", () => {
    stopBackground();
    clearInterval(countdownInterval);
    introTypography.destroy();
    letterTypography.destroy();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });

  resizeBackground();
  startBackground();
  startIntroSequence();
})();