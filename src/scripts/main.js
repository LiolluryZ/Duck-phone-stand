document.addEventListener("DOMContentLoaded", () => {
  initLenis();
  initTimelineReveal();
  initHeroBamboo();
  initScrollAnimations();
});

function initLenis() {
  if (typeof Lenis === "undefined") return;
  const lenis = new Lenis({
    smoothWheel: true,
    duration: 1.2,
    direction: "vertical"
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

function initTimelineReveal() {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const items = document.querySelectorAll(".section-timeline .timeline-item");

  items.forEach((item) => {
    gsap.from(item, {
      y: 40,
      opacity: 0,
      ease: "power3.out",
      duration: 0.8,
      scrollTrigger: {
        trigger: item,
        start: "top 80%"
      }
    });
  });

  const hero = document.querySelector(".hero");
  if (hero) {
    // Entrée douce du texte du hero
    gsap.from(hero.querySelectorAll(".hero-copy > *"), {
      y: 40,
      opacity: 0,
      ease: "power3.out",
      duration: 0.9,
      stagger: 0.14
    });

    // Légère disparition progressive du texte au scroll pour un effet éditorial
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(".hero-copy", {
          opacity: 1 - progress * 0.35,
          y: progress * -20,
          overwrite: "auto"
        });
      }
    });
  }

  const usageGrid = document.querySelector(".section-usage .usage-grid");
  if (usageGrid) {
    const usageCopy = usageGrid.querySelector(".usage-copy");
    const usageVisual = usageGrid.querySelector(".usage-visual");

    // Reveal séquencé texte + image façon éditorial luxe
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".section-usage",
          start: "top 75%"
        }
      })
      .from(usageCopy.querySelectorAll("p, li"), {
        y: 32,
        opacity: 0,
        ease: "power3.out",
        duration: 0.7,
        stagger: 0.12
      })
      .from(
        usageVisual,
        {
          y: 40,
          opacity: 0,
          scale: 1.03,
          duration: 0.8,
          ease: "power3.out"
        },
        "-=0.4"
      );

    // Micro-parallaxe sur l'image pour un effet de profondeur subtil
    const usageImage = usageGrid.querySelector(".usage-visual .placeholder");
    if (usageImage) {
      gsap.to(usageImage, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: ".section-usage",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }
}

function initHeroBamboo() {
  if (typeof gsap === "undefined") return;

  const heroCopy = document.querySelector(".hero-copy");
  if (!heroCopy || typeof ScrollTrigger === "undefined") return;

  // Parallaxe plus marquée sur le bloc texte
  gsap.to(heroCopy, {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero--bamboo",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Animation du background du hero au scroll (effet de profondeur plus visible)
  gsap.to(".hero--bamboo", {
    backgroundPositionY: "40%",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero--bamboo",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
}

function initScrollAnimations() {
  // Vérifier si l'API IntersectionObserver est supportée
  if (!('IntersectionObserver' in window)) {
    // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
    document.querySelectorAll('.section, .footer').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  // Configuration de l'observateur
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Déclenche quand 10% de l'élément est visible
  };

  // Callback pour l'observateur
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ajouter la classe 'visible' pour déclencher l'animation
        entry.target.classList.add('visible');
        
        // Arrêter d'observer une fois l'animation déclenchée
        observer.unobserve(entry.target);
      }
    });
  };

  // Créer l'observateur
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Observer toutes les sections et le footer
  document.querySelectorAll('.section, .footer').forEach(section => {
    observer.observe(section);
  });

  // Animation spécifique pour les éléments du footer
  const footer = document.querySelector('.footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Délai d'animation pour les colonnes de navigation
          const columns = entry.target.querySelectorAll('.footer-nav-column');
          columns.forEach((col, index) => {
            setTimeout(() => {
              col.style.opacity = '1';
              col.style.transform = 'translateY(0)';
            }, 100 * index);
          });

          // Délai pour les mentions légales
          setTimeout(() => {
            const legal = entry.target.querySelector('.footer-legal');
            if (legal) legal.style.opacity = '1';
          }, 300);

          // Ne pas observer à nouveau
          footerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
  }
}