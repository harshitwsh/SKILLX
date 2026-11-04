/**
 * SKILLX - Landing Page JavaScript (index.js)
 * Handles navbar search redirect, clickable skill cards, and smooth scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Search Redirect
  const searchInput = document.querySelector('.nav-search input');
  const searchIcon = document.querySelector('.nav-search .material-symbols-outlined');

  function runNavSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (!query) {
      showToast('Enter a skill or keyword to search projects', 'info');
      searchInput.focus();
      return;
    }
    window.location.href = `find-work.html?q=${encodeURIComponent(query)}`;
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runNavSearch();
      }
    });
  }

  if (searchIcon) {
    searchIcon.style.cursor = 'pointer';
    searchIcon.addEventListener('click', runNavSearch);
  }

  // 2. Clickable Skill Badges & Cards -> Jump to filtered projects
  document.querySelectorAll('.popular-skill-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag-badge')) {
        const tagText = e.target.textContent.trim();
        window.location.href = `find-work.html?q=${encodeURIComponent(tagText)}`;
        return;
      }
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
      const categoryMap = {
        'Front-end Development': 'Web Development',
        'UI/UX Design': 'Design & Creative',
        'Back-end Development': 'Web Development',
        'Full-stack Engineering': 'Web Development'
      };
      const cat = categoryMap[title] || '';
      window.location.href = cat
        ? `find-work.html?category=${encodeURIComponent(cat)}`
        : 'find-work.html';
    });
  });

  // 3. Smooth scroll for anchor links (e.g. #popular-skills)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
