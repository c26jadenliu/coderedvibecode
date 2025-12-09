// Scroll progress bar
(function () {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  function update() {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? window.scrollY / docHeight : 0;
    bar.style.transform = `scaleX(${scrolled})`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

// Mobile nav toggle
(function () {
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const open = toggle.classList.toggle("is-open");
    mobileNav.style.display = open ? "block" : "none";
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("is-open");
      mobileNav.style.display = "none";
    });
  });
})();

// Scroll reveal
(function () {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// External image proxy + fallback
(function () {
  const fallbackSrc = "assets/images/gallery-fallback.svg";
  const proxyBase = "https://images.weserv.nl/?url=";
  const externalImages = Array.from(document.images).filter((img) =>
    img.src.includes("projectcodered.com/wp-content/uploads")
  );

  externalImages.forEach((img) => {
    img.decoding = "async";
    img.loading = img.loading || "lazy";

    // Proxy the image through a CDN that allows hotlinking to avoid host blocks.
    if (!img.dataset.proxied) {
      const urlWithoutProtocol = img.src.replace(/^https?:\/\//, "");
      const encoded = encodeURIComponent(urlWithoutProtocol);
      img.dataset.originalSrc = img.src;
      img.src = `${proxyBase}${encoded}&w=1600&output=jpg`;
      img.dataset.proxied = "true";
    }

    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "true";
      img.src = fallbackSrc;
      img.removeAttribute("srcset");
      img.alt = img.alt || "Project Code Red community highlight";
    });

    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });
})();
