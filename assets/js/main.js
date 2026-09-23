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

  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    const feedUrl = 'https://social.bsidesmunich.org/wp-json/wp/v2/posts?per_page=3&_fields=date,link,title,excerpt';
    const categoryFor = (title, excerpt) => {
      const text = `${title} ${excerpt}`.toLowerCase();
      if (text.includes('ticket')) return 'Tickets';
      if (text.includes('sponsor')) return 'Sponsors';
      if (text.includes('volunteer')) return 'Community';
      if (text.includes('agenda') || text.includes('talk') || text.includes('workshop')) return 'Program';
      return 'News';
    };
    const plainText = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    };
    const shortText = (text, maxLength = 180) => {
      if (text.length <= maxLength) return text;
      return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}\u2026`;
    };
    const renderPosts = (posts) => {
      newsGrid.replaceChildren();
      posts.forEach((post, index) => {
        const title = plainText(post.title.rendered);
        const excerpt = plainText(post.excerpt.rendered);
        const date = new Date(post.date);
        const article = document.createElement('article');
        article.className = `news-card fade-in${index === 0 ? ' news-card--featured' : ''}`;

        const meta = document.createElement('p');
        meta.className = 'news-meta';
        const dateLabel = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('-');
        meta.textContent = `${categoryFor(title, excerpt)}  //  ${dateLabel}`;

        const heading = document.createElement('h3');
        heading.className = 'news-title';
        const link = document.createElement('a');
        link.href = post.link;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = title;
        heading.appendChild(link);

        const summary = document.createElement('p');
        summary.className = 'news-excerpt';
        summary.textContent = shortText(excerpt);

        const readMore = document.createElement('a');
        readMore.className = 'news-read-more';
        readMore.href = post.link;
        readMore.target = '_blank';
        readMore.rel = 'noopener';
        readMore.textContent = 'Read update \u2192';

        article.append(meta, heading, summary, readMore);
        newsGrid.appendChild(article);
        observer.observe(article);
      });
      newsGrid.setAttribute('aria-busy', 'false');
    };
    const renderFeedError = () => {
      newsGrid.innerHTML = '';
      const article = document.createElement('article');
      article.className = 'news-card news-card--fallback';
      const meta = document.createElement('p');
      meta.className = 'news-meta';
      meta.textContent = 'SOCIAL FEED';
      const heading = document.createElement('h3');
      heading.className = 'news-title';
      heading.textContent = 'Latest news is one click away';
      const link = document.createElement('a');
      link.className = 'news-read-more';
      link.href = 'https://social.bsidesmunich.org/';
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open social feed \u2192';
      article.append(meta, heading, link);
      newsGrid.appendChild(article);
      newsGrid.setAttribute('aria-busy', 'false');
    };

    fetch(feedUrl)
      .then(response => {
        if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
        return response.json();
      })
      .then(posts => posts.length ? renderPosts(posts) : renderFeedError())
      .catch(renderFeedError);
  }

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
