(() => {
  const progressBar = document.getElementById('progressBar');
  const chapters = [...document.querySelectorAll('.chapter')];
  const tocNav = document.getElementById('tocNav');
  const shareButton = document.getElementById('shareButton');
  const toast = document.getElementById('toast');

  const roman = chapters.map(ch => ch.querySelector('.chapter-no')?.textContent.trim() || '');

  chapters.forEach((chapter, index) => {
    const link = document.createElement('a');
    link.href = `#${chapter.id}`;
    link.textContent = chapter.dataset.short || chapter.querySelector('h2').textContent;
    link.dataset.n = roman[index];
    link.dataset.target = chapter.id;
    tocNav.appendChild(link);
  });

  const tocLinks = [...tocNav.querySelectorAll('a')];

  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressBar.style.width = `${value * 100}%`;
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

    if (!visible.length) return;
    const id = visible[0].target.id;
    tocLinks.forEach(link => link.classList.toggle('active', link.dataset.target === id));

    const active = tocLinks.find(link => link.dataset.target === id);
    if (active) active.scrollIntoView({ block: 'nearest' });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  chapters.forEach(chapter => observer.observe(chapter));

  let toastTimer;
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  shareButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied. Civilization may proceed.');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showToast('Link copied. Civilization may proceed.');
    }
  });

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();
