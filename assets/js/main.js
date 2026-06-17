document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Cycle the hero logo through the neon-glow palettes
  const heroLogo = document.querySelector('.hero-logo');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroLogo && !prefersReducedMotion) {
    const palettes = ['glow-a', 'glow-b', 'glow-c', 'glow-d'];
    let i = Math.floor(Math.random() * palettes.length);
    heroLogo.classList.add(palettes[i]);
    setInterval(() => {
      heroLogo.classList.remove(palettes[i]);
      i = (i + 1) % palettes.length;
      heroLogo.classList.add(palettes[i]);
    }, 4000);
  }
});
