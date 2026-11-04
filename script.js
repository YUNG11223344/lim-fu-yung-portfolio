document.addEventListener('DOMContentLoaded', () => {
  const yearElement = document.getElementById('year');
  const toggleButton = document.getElementById('themeToggle');
  const likeButton = document.getElementById('likeButton');
  const likeCount = document.getElementById('likeCount');
  const mouseGlow = document.querySelector('.mouse-glow');
  const mouseTrail = document.querySelector('.mouse-glow-trail');

  if (likeButton && likeCount) {
    const countKey = 'portfolio-like-count';
    const baseCount = 0;
    const savedCount = Number(localStorage.getItem(countKey));
    let currentCount = Number.isFinite(savedCount) && savedCount >= 0 ? savedCount : baseCount;

    const updateLikeState = () => {
      likeCount.textContent = String(currentCount);
      const isLiked = currentCount > 0;
      likeButton.classList.toggle('is-liked', isLiked);
      likeButton.setAttribute('aria-pressed', String(isLiked));
      likeButton.querySelector('.like-text').textContent = isLiked ? 'Liked' : 'Like Profile';
    };

    updateLikeState();

    likeButton.addEventListener('click', () => {
      currentCount += 1;
      localStorage.setItem(countKey, String(currentCount));
      updateLikeState();

      const burst = document.createElement('span');
      burst.className = 'like-burst';
      burst.textContent = '❤';
      const rect = likeButton.getBoundingClientRect();
      burst.style.left = `${rect.width / 2}px`;
      burst.style.top = `${-8}px`;
      likeButton.appendChild(burst);

      setTimeout(() => {
        burst.remove();
      }, 700);
    });
  }

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (mouseGlow && mouseTrail) {
    let trailPoints = [];

    const updateTrail = (x, y) => {
      trailPoints.push({ x, y, life: 1 });
      trailPoints = trailPoints.slice(-14);

      const trailEls = [...document.querySelectorAll('.trail-dot')];
      trailEls.forEach((el) => el.remove());

      trailPoints.forEach((point, index) => {
        const el = document.createElement('span');
        el.className = 'trail-dot';
        el.style.left = `${point.x}px`;
        el.style.top = `${point.y}px`;
        el.style.opacity = String(Math.max(0.1, point.life * 0.9));
        el.style.transform = `translate(-50%, -50%) scale(${1 + index * 0.08})`;
        document.body.appendChild(el);
      });

      trailPoints.forEach((point) => {
        point.life *= 0.82;
      });
      trailPoints = trailPoints.filter((point) => point.life > 0.05);
    };

    window.addEventListener('pointermove', (event) => {
      mouseGlow.style.left = `${event.clientX}px`;
      mouseGlow.style.top = `${event.clientY}px`;
      mouseGlow.style.opacity = '1';
      mouseTrail.style.left = `${event.clientX}px`;
      mouseTrail.style.top = `${event.clientY}px`;
      mouseTrail.style.opacity = '1';
      updateTrail(event.clientX, event.clientY);
    });

    window.addEventListener('pointerleave', () => {
      mouseGlow.style.opacity = '0';
      mouseTrail.style.opacity = '0';
      [...document.querySelectorAll('.trail-dot')].forEach((el) => el.remove());
    });

    document.addEventListener('pointerenter', () => {
      mouseGlow.style.opacity = '1';
      mouseTrail.style.opacity = '1';
    });
  }

  const interactiveCards = document.querySelectorAll('.about-card, .highlight-box, .experience-card, .project-card, .reference-card, .skill-group, .contact-box');
  interactiveCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
    });
  });

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
