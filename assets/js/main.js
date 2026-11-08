/* Rancho da Brasa | Protótipo: interações do site */
(function () {
  "use strict";

  /* Configure aqui quando o número oficial for confirmado (formato: 55 + DDD + número). */
  var WHATSAPP_NUMBER = "";            // ex.: "5515999999999"
  var WHATSAPP_CONFIGURED = WHATSAPP_NUMBER.length > 0;

  var header = document.getElementById("siteHeader");
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");

  /* Cabeçalho: transparente no topo, escuro ao rolar */
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setMenu(false); closeLightbox(); }
  });

  /* Imagens via data-bg (com fallback em gradiente caso o arquivo não exista) */
  document.querySelectorAll("[data-bg]").forEach(function (el) {
    var src = el.getAttribute("data-bg");
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
    };
    img.src = src;
  });

  /* Animação ao aparecer na tela */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Galeria: ampliar foto */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lastFocus = null;

  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    lightbox.querySelector(".lightbox-close").focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-full");
      var label = btn.querySelector(".gallery-img").getAttribute("aria-label");
      openLightbox(src, label);
    });
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
  });

  /* WhatsApp: mensagem pronta com o item escolhido */
  function waLink(item) {
    var text = item
      ? "Olá! Gostaria de consultar a disponibilidade de: " + item + "."
      : "Olá! Gostaria de mais informações sobre o Rancho da Brasa.";
    var base = WHATSAPP_CONFIGURED
      ? "https://wa.me/" + WHATSAPP_NUMBER
      : "#whatsapp-numero-a-confirmar";
    return base + "?text=" + encodeURIComponent(text);
  }

  document.querySelectorAll("[data-wa-item]").forEach(function (a) {
    var item = a.getAttribute("data-wa-item");
    a.setAttribute("href", waLink(item === "Contato geral" ? "" : item));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    if (!WHATSAPP_CONFIGURED) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        console.info("Defina WHATSAPP_NUMBER em assets/js/main.js para ativar o WhatsApp.");
      });
    }
  });

  /* Rodapé: ano automático */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();