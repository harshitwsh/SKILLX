/**
 * SKILLX - Why Us Page JavaScript (why-us.js)
 * Handles navbar search redirect, pipeline stage selection, and scorecard bar animation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Search Redirect
  const searchInput = document.querySelector('.nav-search input');
  const searchIcon = document.querySelector('.nav-search .material-symbols-outlined');

  function runSearch() {
    if (!searchInput) return;
    const q = searchInput.value.trim();
    if (!q) {
      showToast('Enter a skill or project keyword to search', 'info');
      searchInput.focus();
      return;
    }
    window.location.href = `find-work.html?q=${encodeURIComponent(q)}`;
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSearch();
      }
    });
  }
  if (searchIcon) {
    searchIcon.style.cursor = 'pointer';
    searchIcon.addEventListener('click', runSearch);
  }

  // 2. Smooth Scroll for anchor links (#vetting-pipeline)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Interactive Vetting Pipeline Stage Cards
  const pipelineCards = document.querySelectorAll('.pipeline-card');
  pipelineCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      pipelineCards.forEach(c => c.classList.remove('highlight-card'));
      card.classList.add('highlight-card');
      const title = card.querySelector('h3')?.textContent.trim() || 'Stage';
      const rate = card.querySelector('.pipeline-step-badge')?.textContent.trim() || '';
      showToast(`${title} (${rate})`, 'info');
    });
  });

  // 4. Smooth Animate Scorecard Bars on Load
  document.querySelectorAll('.score-bar-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    bar.style.transition = 'width 0.7s ease-out';
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 100);
    });
  });
});
