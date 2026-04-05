// main.js – Interactive behavior & scroll‑based animations
// Wrapped in an IIFE to keep the global scope clean.
(() => {
  "use strict";

  /**
   * Smoothly scrolls to the target element referenced by the clicked anchor.
   * @param {Event} event - The click event from an anchor element.
   */
  function smoothScroll(event) {
    // Only handle left‑clicks without modifier keys.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return; // Not an in‑page hash link.
    const targetId = href.slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  /**
   * IntersectionObserver callback – adds a `visible` class when an element
   * enters the viewport (intersection ratio >= threshold).
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  function animateOnScroll(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Once the animation has been triggered we can stop observing the element.
        observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Initialise all interactive behaviours once the DOM is fully parsed.
   */
  function init() {
    // 1. Attach smooth‑scroll to navbar anchor links.
    const navbar = document.getElementById("navbar");
    if (navbar) {
      const navLinks = navbar.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => link.addEventListener("click", smoothScroll));
    }

    // 2. Set up IntersectionObserver for feature cards.
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
      const observerOptions = {
        threshold: 0.2
      };
      const observer = new IntersectionObserver(animateOnScroll, observerOptions);
      featureCards.forEach(card => observer.observe(card));
    }

    // 3. Optional hero title animation trigger after a brief delay.
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      // Adding a small timeout ensures the page has settled before the class is added.
      setTimeout(() => {
        heroTitle.classList.add('animate');
      }, 300);
    }
  }

  // Execute when the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // In case the script is loaded after DOMContentLoaded.
    init();
  }
})();
