/**
 * SKILLX - Find Work Page JavaScript (find-work.js)
 * Renders project listings, handles category filtering, search queries, and empty states.
 */

let activeCategory = 'All';

function renderProjectList() {
  const container = document.getElementById('projectsListContainer');
  if (!container) return;

  const projects = getProjects();
  const searchInput = document.getElementById('projectSearchInput');
  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const filtered = projects.filter(proj => {
    const matchesCategory = (activeCategory === 'All') || (proj.category === activeCategory);
    const searchableText = [
      proj.title,
      proj.category,
      proj.description,
      proj.client ? proj.client.name : '',
      ...(proj.skills || [])
    ].join(' ').toLowerCase();
    const matchesSearch = !q || searchableText.includes(q);
    return matchesCategory && matchesSearch;
  });

  const countLabel = document.getElementById('projectsCountLabel');
  if (countLabel) {
    countLabel.innerText = `Showing ${filtered.length} ${filtered.length === 1 ? 'project' : 'projects'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="project-item-card" style="justify-content: center; text-align: center; padding: 48px 24px; flex-direction: column; align-items: center; gap: 10px;">
        <span class="material-symbols-outlined" style="font-size: 42px; color: var(--text-light);">search_off</span>
        <h3 style="margin: 0; font-size: 1.05rem;">No matching projects found</h3>
        <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">Try clearing your category filter or searching with a different keyword.</p>
        <button type="button" class="btn btn-royal" id="emptyResetBtn" style="margin-top: 8px;">Reset All Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('emptyResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }
    return;
  }

  container.innerHTML = filtered.map(proj => {
    const tagsHtml = (proj.skills || [])
      .map(skill => `<span class="tech-tag-pill">${escapeHtml(skill)}</span>`)
      .join('');
    const postedBy = proj.postedText || `Posted by ${proj.client ? proj.client.name : 'Campus Client'}`;

    return `
      <div class="project-item-card" data-category="${escapeHtml(proj.category)}">
        <div class="project-info-left">
          <div class="project-title-line">
            <h3>${escapeHtml(proj.title)}</h3>
            <span class="badge-tag-category">${escapeHtml(proj.category)}</span>
          </div>
          <p class="project-description">${escapeHtml(proj.description)}</p>
          <div class="project-meta-line">
            ${tagsHtml}
            <span class="post-time-author">&bull; ${escapeHtml(postedBy)}</span>
          </div>
        </div>
        <div class="project-action-right">
          <div class="budget-type">Fixed Budget</div>
          <div class="budget-amount">₹${escapeHtml(String(proj.budget))}</div>
          <a href="project-details.html?id=${encodeURIComponent(proj.id)}" class="btn-apply">View & Apply</a>
        </div>
      </div>
    `;
  }).join('');
}

function selectCategory(categoryName, boxEl, scroll = true) {
  activeCategory = categoryName;

  const badge = document.getElementById('activeCategoryBadge');
  const clearBtn = document.getElementById('clearCatBtn');
  if (badge) badge.innerText = `Filtered: ${categoryName}`;
  if (clearBtn) clearBtn.style.display = 'inline';

  document.querySelectorAll('.category-box').forEach(box => {
    box.style.borderColor = 'var(--border-color)';
  });
  if (boxEl) {
    boxEl.style.borderColor = 'var(--primary-blue)';
  }

  renderProjectList();

  if (scroll) {
    showToast(`Filtered by ${categoryName}`, 'info');
    const target = document.getElementById('all-projects');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }
}

function resetCategoryFilter() {
  activeCategory = 'All';
  const badge = document.getElementById('activeCategoryBadge');
  const clearBtn = document.getElementById('clearCatBtn');
  if (badge) badge.innerText = 'All Categories';
  if (clearBtn) clearBtn.style.display = 'none';

  document.querySelectorAll('.category-box').forEach(box => {
    box.style.borderColor = 'var(--border-color)';
  });
  renderProjectList();
}

function resetAllFilters() {
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) searchInput.value = '';
  resetCategoryFilter();
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('projectSearchInput');
  const searchBtn = document.querySelector('.btn-search');
  const clearBtn = document.getElementById('clearCatBtn');

  // Bind search listeners
  if (searchInput) {
    searchInput.addEventListener('input', renderProjectList);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        renderProjectList();
      }
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', renderProjectList);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', resetCategoryFilter);
  }

  // Bind category box clicks using data-category attribute
  document.querySelectorAll('.category-box[data-category]').forEach(box => {
    box.addEventListener('click', () => {
      selectCategory(box.getAttribute('data-category'), box, true);
    });
  });

  // Read optional ?q= or ?category= URL parameters
  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q');
  const urlCategory = params.get('category');

  if (urlQuery && searchInput) {
    searchInput.value = urlQuery;
  }

  if (urlCategory) {
    const matchingBox = document.querySelector(`.category-box[data-category="${urlCategory}"]`);
    selectCategory(urlCategory, matchingBox, false);
  } else {
    renderProjectList();
  }
});
