const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileLinks = mobileMenu?.querySelectorAll("a");
const year = document.querySelector("[data-year]");
const carousel = document.querySelector("[data-carousel]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Otvoriť menu");
  mobileMenu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Otvoriť menu" : "Zatvoriť menu");
  mobileMenu?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mobileLinks?.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (year) {
  year.textContent = new Date().getFullYear();
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (carousel) {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const cards = [...carousel.querySelectorAll(".review-card")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const current = carousel.querySelector("[data-carousel-current]");
  let activeIndex = 0;
  let direction = 1;
  let autoPlay;
  let scrollSync;

  const updateCounter = () => {
    if (current) current.textContent = String(activeIndex + 1).padStart(2, "0");
  };

  const moveTo = (index, smooth = true) => {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));
    viewport?.scrollTo({
      left: cards[activeIndex].offsetLeft,
      behavior: smooth && !reducedMotion ? "smooth" : "auto",
    });
    updateCounter();
  };

  const moveBy = (step) => {
    let nextIndex = activeIndex + step;
    if (nextIndex < 0) nextIndex = cards.length - 1;
    if (nextIndex >= cards.length) nextIndex = 0;
    direction = step < 0 ? -1 : 1;
    moveTo(nextIndex);
  };

  const stopAutoPlay = () => window.clearInterval(autoPlay);
  const startAutoPlay = () => {
    stopAutoPlay();
    if (reducedMotion || cards.length < 2) return;
    autoPlay = window.setInterval(() => {
      if (activeIndex === cards.length - 1) direction = -1;
      if (activeIndex === 0) direction = 1;
      moveTo(activeIndex + direction);
    }, 6000);
  };

  previous?.addEventListener("click", () => {
    moveBy(-1);
    startAutoPlay();
  });
  next?.addEventListener("click", () => {
    moveBy(1);
    startAutoPlay();
  });
  carousel.addEventListener("pointerenter", stopAutoPlay);
  carousel.addEventListener("pointerleave", startAutoPlay);
  viewport?.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(scrollSync);
      scrollSync = window.setTimeout(() => {
        activeIndex = cards.reduce((nearest, card, index) => {
          const currentDistance = Math.abs(cards[nearest].offsetLeft - viewport.scrollLeft);
          const nextDistance = Math.abs(card.offsetLeft - viewport.scrollLeft);
          return nextDistance < currentDistance ? index : nearest;
        }, 0);
        updateCounter();
      }, 120);
    },
    { passive: true },
  );
  carousel.addEventListener("focusin", stopAutoPlay);
  carousel.addEventListener("focusout", startAutoPlay);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });
  window.addEventListener("resize", () => moveTo(activeIndex, false));

  updateCounter();
  startAutoPlay();
}

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealElements.forEach((element) => observer.observe(element));
}
