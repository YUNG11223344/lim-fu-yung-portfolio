document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  const toggleButton = document.getElementById('themeToggle');

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-mode', isLight);

    if (toggleButton) {
      const icon = toggleButton.querySelector('.toggle-icon');
      const text = toggleButton.querySelector('.toggle-text');
      if (icon) icon.textContent = isLight ? '🌙' : '☀️';
      if (text) text.textContent = isLight ? 'Dark' : 'Light';
    }
  };

  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme) {
    applyTheme(storedTheme);
  } else {
    applyTheme('dark');
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('portfolio-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  const revealElements = document.querySelectorAll('.section, .project-card, .reference-card, .skill-group, .experience-card, .timeline-item, .about-card, .highlight-box');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }
});
