// ============================
// Mobile nav toggle
// ============================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================
// Scroll-reveal
// ============================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============================
// Hero network graph: staggered draw-in
// ============================
const heroGraph = document.querySelector('.hero-graph');
const graphEdges = document.querySelectorAll('.graph-edge');
graphEdges.forEach((edge, i) => {
  edge.style.transitionDelay = `${i * 0.07}s`;
});
window.requestAnimationFrame(() => {
  setTimeout(() => heroGraph && heroGraph.classList.add('is-drawn'), 250);
});

// ============================
// Live GitHub repositories
// ============================
async function loadRepos() {
  const grid = document.getElementById('repoGrid');
  const username = 'Elangovanmurugan';

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('GitHub API error');
    let repos = await res.json();

    repos = repos
      .filter((r) => !r.fork)
      .filter((r) => r.name.toLowerCase() !== username.toLowerCase())
      .filter((r) => r.name.toLowerCase() !== `${username.toLowerCase()}.github.io`)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    if (repos.length === 0) {
      grid.innerHTML = '<p class="repo-status">No public repositories found.</p>';
      return;
    }

    grid.innerHTML = repos
      .map((repo) => `
        <div class="repo-card">
          <h4><a href="${repo.html_url}" target="_blank" rel="noopener">${escapeHtml(repo.name)} ↗</a></h4>
          <p>${escapeHtml(repo.description || 'No description provided.')}</p>
          <div class="repo-meta">
            ${repo.language ? `<span><span class="repo-lang-dot"></span>${escapeHtml(repo.language)}</span>` : ''}
            <span>★ ${repo.stargazers_count}</span>
          </div>
        </div>
      `)
      .join('');
  } catch (err) {
    grid.innerHTML = `<p class="repo-status">Couldn't load repositories right now — see them directly on <a href="https://github.com/${username}" target="_blank" rel="noopener">GitHub</a>.</p>`;
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadRepos();

// ============================
// Footer year
// ============================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
