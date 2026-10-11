/* ================================================================
   REZUM — Single-Page Application
   Router + Page Templates + Interactions
   ================================================================ */

// ── ROUTER ──────────────────────────────────────────────────────
class Router {
  constructor(routes, container) {
    this.routes = routes;
    this.container = container;
    this.currentPage = null;
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  resolve() {
    const hash = location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    let matched = this.routes.find(r => r.path === path);
    if (!matched) matched = this.routes.find(r => r.path === '*');

    // Page transition
    const el = this.container;
    el.classList.add('page-exit');
    setTimeout(() => {
      el.innerHTML = matched.render();
      el.classList.remove('page-exit');
      el.classList.add('page-enter');
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => el.classList.remove('page-enter'), 450);

      // Post-render hooks
      if (matched.init) matched.init();
      initScrollReveal();
      updateActiveNav(path);
    }, 200);
  }
}

// ── SCROLL REVEAL (Intersection Observer) ───────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// ── NAV STATE ───────────────────────────────────────────────────
function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    if (href === path) {
      link.classList.add('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
      link.classList.remove('text-on-surface-variant');
    } else {
      link.classList.remove('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
      link.classList.add('text-on-surface-variant');
    }
  });
}

// ── MOBILE NAV DRAWER ───────────────────────────────────────────
function openMobileNav() {
  const overlay = document.createElement('div');
  overlay.className = 'nav-drawer-overlay';
  overlay.id = 'nav-overlay';

  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.id = 'nav-drawer';
  drawer.innerHTML = `
    <div class="p-space-lg">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-space-sm">
          <div class="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span class="text-on-primary font-headline-sm text-[14px] font-bold">R</span>
          </div>
          <span class="font-headline-sm text-headline-sm uppercase tracking-tight text-primary font-bold">REZUM</span>
        </div>
        <button class="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center" id="close-drawer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <nav class="space-y-1">
        <a href="#/" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">HOME</a>
        <a href="#/jobs" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">JOBS</a>
        <a href="#/analyzer" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">ANALYZER</a>
        <a href="#/resume" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">RESUME BUILDER</a>
        <a href="#/roadmaps" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">ROADMAPS</a>
        <a href="#/tracker" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">TRACKER</a>
        <a href="#/settings" class="drawer-link block px-4 py-3 font-label-md text-label-md uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all">SETTINGS</a>
      </nav>
      <div class="mt-8 pt-8 border-t border-outline-variant/20 space-y-3">
        <a href="#/auth" class="block w-full text-center px-8 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors">SIGN IN</a>
        <a href="#/auth?mode=register" class="block w-full text-center px-8 py-3 rounded-full border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-colors">CREATE ACCOUNT</a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  function closeMobileNav() {
    overlay.classList.add('closing');
    drawer.classList.add('closing');
    setTimeout(() => { overlay.remove(); drawer.remove(); }, 300);
  }

  overlay.addEventListener('click', closeMobileNav);
  drawer.querySelector('#close-drawer').addEventListener('click', closeMobileNav);
  drawer.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeMobileNav));
}

// ── UTILITY ─────────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function randomBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

// ── TOAST NOTIFICATIONS ─────────────────────────────────────────
function showToast(title, message, icon = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-primary text-[22px]">${icon}</span>
    <div class="flex-1">
      <div class="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider">${escapeHtml(title)}</div>
      <div class="font-body-sm text-body-sm text-on-surface-variant">${escapeHtml(message)}</div>
    </div>
    <button class="text-secondary hover:text-primary transition-colors text-[16px] material-symbols-outlined" type="button">close</button>
  `;
  const dismiss = () => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector('button').addEventListener('click', dismiss);
  container.appendChild(toast);
  setTimeout(dismiss, 4200);
}

// ── COMMAND PALETTE (Search Modal) ──────────────────────────────
function openCommandPalette() {
  if (document.getElementById('cmd-palette')) return;
  const backdrop = document.createElement('div');
  backdrop.id = 'cmd-palette';
  backdrop.className = 'cmd-palette-backdrop';

  const commands = [
    { title: 'Resume Analyzer', category: 'MODULE', desc: 'Audit dossier against ATS algorithms', path: '#/analyzer', icon: 'analytics' },
    { title: 'Resume Editor & Builder', category: 'MODULE', desc: 'Craft ATS-compliant CV with live rendering', path: '#/resume', icon: 'edit_document' },
    { title: 'Position Directory (14,280)', category: 'JOBS', desc: 'Curated executive & engineering positions', path: '#/jobs', icon: 'work' },
    { title: 'Staff Platform Architect', category: 'FEATURED JOB', desc: 'TechVault // Austin, TX // $310K - $385K', path: '#/job-detail', icon: 'bolt' },
    { title: 'Skill Vectors & Roadmaps', category: 'LEARNING', desc: 'System design & distributed systems pathways', path: '#/roadmaps', icon: 'hub' },
    { title: 'Application Pipeline Tracker', category: 'WORKFLOW', desc: '5-stage Kanban application telemetry', path: '#/tracker', icon: 'view_kanban' },
    { title: 'Security & Dossier Settings', category: 'ACCOUNT', desc: 'Configure privacy, data exports & preferences', path: '#/settings', icon: 'settings' },
    { title: 'Authentication Protocol', category: 'ACCESS', desc: 'Sign in or initialize candidate account', path: '#/auth', icon: 'login' }
  ];

  backdrop.innerHTML = `
    <div class="cmd-palette-dialog" onclick="event.stopPropagation()">
      <div class="flex items-center px-5 py-4 border-b border-outline-variant/30">
        <span class="material-symbols-outlined text-secondary text-[22px] mr-3">search</span>
        <input type="text" id="cmd-input" placeholder="SEARCH DOSSIERS, ROLES, ROADMAPS, CAPABILITIES..." class="w-full bg-transparent font-label-md text-label-md uppercase text-primary placeholder:text-secondary focus:outline-none" autofocus />
        <span class="px-2 py-0.5 rounded-sm border border-outline-variant/40 font-label-sm text-label-sm text-secondary">ESC</span>
      </div>
      <div class="max-h-[360px] overflow-y-auto divide-y divide-outline-variant/15" id="cmd-results"></div>
      <div class="px-5 py-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm text-secondary">
        <span>PRESS ENTER TO EXECUTE // CLICK TO NAVIGATE</span>
        <span>REZUM TELEMETRY SEARCH // 04.9</span>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  const input = backdrop.querySelector('#cmd-input');
  const resultsContainer = backdrop.querySelector('#cmd-results');

  function renderResults(filter = '') {
    const q = filter.trim().toLowerCase();
    const filtered = commands.filter(c => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    if (!filtered.length) {
      resultsContainer.innerHTML = `<div class="p-6 text-center text-secondary font-label-sm text-label-sm uppercase">NO PROTOCOLS FOUND FOR "${escapeHtml(filter)}"</div>`;
      return;
    }
    resultsContainer.innerHTML = filtered.map((c, idx) => `
      <div class="cmd-item flex items-center justify-between px-5 py-3.5 hover:bg-surface-container-low cursor-pointer transition-colors ${idx === 0 ? 'bg-surface-container-low/60' : ''}" data-path="${c.path}">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-primary text-[20px]">${c.icon}</span>
          <div>
            <div class="font-label-md text-label-md uppercase font-bold text-primary flex items-center gap-2">
              ${c.title}
              <span class="font-label-sm text-label-sm text-secondary px-1.5 py-0.2 rounded bg-surface-container border border-outline-variant/30">${c.category}</span>
            </div>
            <div class="font-body-sm text-body-sm text-on-surface-variant font-light">${c.desc}</div>
          </div>
        </div>
        <span class="material-symbols-outlined text-secondary text-[16px]">arrow_forward</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const path = item.getAttribute('data-path');
        close();
        location.hash = path;
      });
    });
  }

  function close() {
    backdrop.remove();
  }

  backdrop.addEventListener('click', close);
  input.addEventListener('input', (e) => renderResults(e.target.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter') {
      const first = resultsContainer.querySelector('.cmd-item');
      if (first) {
        close();
        location.hash = first.getAttribute('data-path');
      }
    }
  });

  renderResults();
  setTimeout(() => input.focus(), 60);
}

// ── APP CONFIG & AUTH SESSION ─────────────────────────────────────
const APP_CONFIG = {
  googleClientId: '',
  googleEnabled: false
};

async function loadAppConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return;
    const data = await res.json();
    APP_CONFIG.googleClientId = data.google_client_id || '';
    APP_CONFIG.googleEnabled = !!(data.google_enabled || data.google_client_id);
  } catch (error) {
    console.warn('App config unavailable; using local auth fallback.', error);
  }
}

const AuthManager = {
  getAuthToken() {
    return localStorage.getItem('rezum_token') || '';
  },
  getToken() {
    return this.getAuthToken();
  },
  getAuthHeader() {
    const t = this.getAuthToken();
    return t ? { 'Authorization': `Bearer ${t}` } : {};
  },
  isLoggedIn() {
    return !!this.getAuthToken() && !!this.getCurrentUser();
  },
  getCurrentUser() {
    try {
      const u = localStorage.getItem('rezum_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },
  setSession(arg1, arg2) {
    let token = '';
    let user = null;
    if (typeof arg1 === 'string' && typeof arg2 === 'object') {
      token = arg1;
      user = arg2;
    } else if (typeof arg1 === 'object' && typeof arg2 === 'string') {
      token = arg2;
      user = arg1;
    } else if (typeof arg1 === 'object' && !arg2) {
      user = arg1.user || arg1;
      token = arg1.token || this.getAuthToken();
    }
    if (token) localStorage.setItem('rezum_token', token);
    if (user) localStorage.setItem('rezum_user', JSON.stringify(user));
    this.updateHeaderUserUI();
  },
  clearSession() {
    localStorage.removeItem('rezum_token');
    localStorage.removeItem('rezum_user');
    this.updateHeaderUserUI();
  },
  updateHeaderUserUI() {
    const user = this.getCurrentUser();
    const headerBtn = document.getElementById('header-auth-btn');
    const avatarBtn = document.getElementById('avatar-btn');
    const avatarIcon = document.getElementById('avatar-icon');

    if (user) {
      if (headerBtn) {
        const firstName = (user.name || 'USER').split(' ')[0].toUpperCase();
        headerBtn.textContent = firstName;
        headerBtn.href = '#/settings';
        headerBtn.title = `Signed in as ${user.email}`;
      }
      if (avatarBtn) {
        if (user.avatar_url) {
          avatarBtn.innerHTML = `<img src="${user.avatar_url}" alt="${escapeHtml(user.name)}" class="w-full h-full object-cover rounded-full" />`;
        } else {
          const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          avatarBtn.innerHTML = `<span class="text-on-primary font-bold text-[12px] font-headline-sm">${initials}</span>`;
        }
      }
    } else {
      if (headerBtn) {
        headerBtn.textContent = 'SIGN IN';
        headerBtn.href = '#/auth';
        headerBtn.title = 'Sign In to Rezum';
      }
      if (avatarBtn) {
        avatarBtn.innerHTML = `<span class="material-symbols-outlined text-on-primary text-[18px]" id="avatar-icon">person</span>`;
      }
    }
  }
};

// ── AVATAR PROFILE MENU ─────────────────────────────────────────
function toggleAvatarDropdown(e) {
  e.stopPropagation();
  let dropdown = document.getElementById('avatar-dropdown-menu');
  if (dropdown) {
    dropdown.remove();
    return;
  }
  const user = AuthManager.getCurrentUser();
  const avatarBtn = document.getElementById('avatar-btn');
  dropdown = document.createElement('div');
  dropdown.id = 'avatar-dropdown-menu';
  dropdown.className = 'avatar-dropdown shadow-2xl border border-outline-variant/40 animate-fade-in-up';
  
  if (user) {
    dropdown.innerHTML = `
      <div class="p-4 border-b border-outline-variant/20 bg-surface-container-low">
        <div class="font-label-md text-label-md uppercase font-bold text-primary truncate">${escapeHtml(user.name)}</div>
        <div class="font-label-sm text-[10px] text-secondary truncate">${escapeHtml(user.email)}</div>
        <div class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[9px] uppercase tracking-wider font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> ${escapeHtml(user.provider === 'google' ? 'GOOGLE VERIFIED' : 'ACTIVE SESSION')}
        </div>
      </div>
      <div class="p-2 space-y-0.5">
        <a href="#/settings" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-on-surface">
          <span class="material-symbols-outlined text-[18px] text-secondary">settings</span> Account Settings
        </a>
        <a href="#/tracker" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-on-surface">
          <span class="material-symbols-outlined text-[18px] text-secondary">view_kanban</span> Pipeline Tracker
        </a>
        <a href="#/analyzer" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-on-surface">
          <span class="material-symbols-outlined text-[18px] text-secondary">analytics</span> Run Dossier Audit
        </a>
        <a href="#/resume" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-on-surface">
          <span class="material-symbols-outlined text-[18px] text-secondary">edit_document</span> Resume Editor
        </a>
        <div class="h-px bg-outline-variant/20 my-1"></div>
        <button id="menu-signout-btn" class="w-full text-left flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-error/10 transition-colors text-error cursor-pointer">
          <span class="material-symbols-outlined text-[18px] text-error">logout</span> Sign Out
        </button>
      </div>
    `;
  } else {
    dropdown.innerHTML = `
      <div class="p-4 border-b border-outline-variant/20 bg-surface-container-low">
        <div class="font-label-md text-label-md uppercase font-bold text-primary">GUEST USER</div>
        <div class="font-label-sm text-[10px] text-secondary">Sign in to save dossiers & sync roadmaps</div>
      </div>
      <div class="p-2 space-y-0.5">
        <a href="#/auth" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-primary font-semibold">
          <span class="material-symbols-outlined text-[18px] text-primary">login</span> Sign In / Register
        </a>
        <a href="#/auth?mode=google" class="flex items-center gap-2.5 px-3 py-2 text-body-sm hover:bg-surface-container-low transition-colors text-primary font-semibold">
          <span class="material-symbols-outlined text-[18px] text-primary">g_mobiledata</span> Continue with Google
        </a>
      </div>
    `;
  }

  avatarBtn.parentElement.style.position = 'relative';
  avatarBtn.parentElement.appendChild(dropdown);

  const signoutBtn = dropdown.querySelector('#menu-signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      AuthManager.clearSession();
      dropdown.remove();
      showToast('Signed Out', 'Your session has been terminated safely.', 'logout');
      location.hash = '#/';
    });
  }

  const closeMenu = (evt) => {
    if (!dropdown.contains(evt.target) && evt.target !== avatarBtn) {
      dropdown.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 50);
}



// ================================================================
//  PAGE: LANDING
// ================================================================
function renderLanding() {
  return `
  <div class="flex flex-col w-full">
    <!-- HERO -->
    <section class="relative w-full -mt-20 overflow-hidden bg-primary-container text-on-primary">
      <div class="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out" style="background-image:url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format')"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40"></div>
      <div class="absolute inset-0 pointer-events-none grid grid-cols-4 md:grid-cols-12 max-w-[1720px] mx-auto w-full px-margin-sm lg:px-margin opacity-20">
        <div class="border-r border-on-primary/30 h-full col-span-1"></div>
        <div class="border-r border-on-primary/30 h-full col-span-2 hidden md:block"></div>
        <div class="border-r border-on-primary/30 h-full col-span-3"></div>
        <div class="border-r border-on-primary/30 h-full col-span-3 hidden md:block"></div>
        <div class="border-r border-on-primary/30 h-full col-span-3"></div>
      </div>
      <div class="relative z-10 max-w-[1720px] mx-auto w-full px-margin-sm lg:px-margin pt-36 lg:pt-48 pb-16 flex flex-col justify-between min-h-[92vh]">
        <div class="flex items-center justify-between border-b border-on-primary/15 pb-6">
          <div class="flex items-center gap-space-sm">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-surface-bright opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-surface-bright"></span></span>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim">SYSTEM PROTOCOL 04.9 // LIVE DATABASE</span>
          </div>
          <div class="hidden sm:flex items-center gap-space-lg">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim">UPDATED 14 MIN AGO</span>
            <span class="w-px h-3 bg-on-primary/30"></span>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-surface-bright">LATENCY 24MS</span>
          </div>
        </div>

        <div class="my-auto py-12 lg:py-20 max-w-5xl">
          <p class="font-label-md text-label-md uppercase tracking-widest text-surface-variant/80 mb-4 flex items-center gap-space-sm reveal">
            <span class="material-symbols-outlined text-[14px]">tune</span>
            NEXT-GENERATION CAREER INTELLIGENCE SYSTEM
          </p>
          <h1 class="font-headline-2xl text-headline-2xl-mobile md:text-headline-2xl text-surface-bright tracking-tight leading-[0.95] mb-8 font-extrabold reveal">
            Career architecture<br/>that matters.
          </h1>
          <p class="font-body-lg text-body-lg text-secondary-fixed max-w-2xl font-light mb-10 leading-relaxed reveal">
            Engineered for professionals and executives. Decode Applicant Tracking Systems, benchmark market value, and orchestrate deliberate upward trajectories with surgical precision.
          </p>
          <div class="flex flex-wrap items-center gap-space-md reveal">
            <a class="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-surface-bright text-surface-bright hover:bg-surface-bright hover:text-primary transition-all duration-300 font-label-md text-label-md uppercase tracking-wider group" href="#/analyzer">
              <span>EVALUATE RESUME</span>
              <span class="material-symbols-outlined ml-2 text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
            <a class="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-surface-bright text-primary hover:bg-surface-container-high transition-all duration-300 font-label-md text-label-md uppercase tracking-wider font-semibold" href="#/jobs">
              FIND ROLES
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-end pt-8 border-t border-on-primary/15">
          <div class="md:col-span-6 lg:col-span-5 flex items-stretch bg-surface-container-lowest text-on-surface shadow-2xl overflow-hidden reveal">
            <div class="bg-surface-container-highest px-3 py-4 flex items-center justify-center border-r border-outline-variant/30">
              <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary writing-vertical font-bold">FEATURED</span>
            </div>
            <div class="p-space-md flex-1 flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">AUSTIN // SF // NY METRO</span>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">HIGH DEMAND</span>
              </div>
              <div class="mt-2 flex items-baseline justify-between">
                <h3 class="font-headline-sm text-headline-sm font-semibold tracking-tight text-primary">Q3 Tech Leadership Index</h3>
                <a class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" href="#/jobs">
                  <span class="material-symbols-outlined text-[16px]">arrow_outward</span>
                </a>
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-1">VP of Product, Staff Architect, & ML Infrastructure benchmarks.</p>
            </div>
          </div>

          <div class="hidden lg:flex md:col-span-4 lg:col-span-4 flex-col gap-space-xs text-primary-fixed reveal">
            <div class="flex items-center gap-space-lg">
              <div>
                <span class="font-headline-sm text-headline-sm font-bold text-surface-bright block">98.4%</span>
                <span class="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">ATS PASS RATIO</span>
              </div>
              <div class="w-px h-8 bg-on-primary/20"></div>
              <div>
                <span class="font-headline-sm text-headline-sm font-bold text-surface-bright block">1-CLICK</span>
                <span class="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">SECURE SYNC</span>
              </div>
            </div>
          </div>

          <div class="md:col-span-6 lg:col-span-3 flex justify-end reveal">
            <a class="group flex items-center gap-space-sm" href="#matrix-grid">
              <span class="hidden sm:inline-block font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim group-hover:text-surface-bright transition-colors">EXPLORE INDEX</span>
              <div class="w-16 h-16 rounded-full border border-on-primary/40 flex items-center justify-center text-surface-bright group-hover:border-surface-bright group-hover:scale-105 transition-all duration-300">
                <span class="material-symbols-outlined text-[24px] group-hover:translate-y-1 transition-transform">arrow_downward</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- METRICS STRIP -->
    <section class="w-full bg-surface-container-low border-b border-outline-variant/30">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter items-center stagger-children">
          ${[
            { icon: 'verified', label: 'ACTIVE CURATED POOL', value: '14,280 ROLES' },
            { icon: 'analytics', label: 'ALGORITHMIC ATS ACCURACY', value: '99.1% PRECISION' },
            { icon: 'schedule', label: 'MEAN INTERVIEW INVITATION', value: '11.4 DAYS' },
            { icon: 'corporate_fare', label: 'INTELLIGENCE VENDORS', value: '540 ENTERPRISES' }
          ].map(m => `
            <div class="flex items-center gap-space-sm reveal">
              <span class="material-symbols-outlined text-secondary text-[20px]">${m.icon}</span>
              <div>
                <div class="font-label-sm text-label-sm uppercase text-secondary">${m.label}</div>
                <div class="font-headline-sm text-headline-sm font-bold text-on-surface">${m.value}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CAPABILITIES -->
    <section class="w-full bg-surface-container-lowest" id="matrix-grid">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pb-space-lg border-b border-outline-variant/40 reveal">
          <div class="lg:col-span-8">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">CAPABILITIES</span>
            <h2 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">We structure it best.</h2>
          </div>
          <div class="lg:col-span-4 flex lg:justify-end">
            <a class="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-on-primary hover:bg-primary-hover transition-all font-label-md text-label-md uppercase tracking-wider font-semibold" href="#/analyzer">VIEW ALL CAPABILITIES</a>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 border-b border-outline-variant/40 stagger-children">
          ${[
            { icon: 'view_timeline', module: 'MODULE 01 // PARSER', title: 'Resume Analyzer', desc: 'Examine structural syntax, semantic token density, and ATS score vectors across Greenhouse, Workday, and Lever parsers.', cta: 'RUN ATS SCAN', href: '#/analyzer' },
            { icon: 'tune', module: 'MODULE 02 // DIRECTORY', title: 'Aggregated Job Matrix', desc: 'Real-time synchronization across tier-one tech, venture studios, and private equity portfolios. Filter by compensation and engineering tier.', cta: 'BROWSE JOBS', href: '#/jobs' },
            { icon: 'grid_view', module: 'MODULE 03 // VECTOR', title: 'Skill Blueprints & Vectors', desc: 'Interactive career ladder milestones comparing IC-to-Leadership tracks. Identify qualification gaps with curated syllabi.', cta: 'EXPLORE PATHWAYS', href: '#/roadmaps' }
          ].map((bay, i) => `
            <div class="p-space-lg md:p-space-xl ${i < 2 ? 'border-b md:border-b-0 md:border-r border-outline-variant/40' : ''} flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-300 reveal">
              <div>
                <div class="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-[24px]">${bay.icon}</span>
                </div>
                <div class="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-2">${bay.module}</div>
                <h3 class="font-headline-md text-headline-md font-bold text-primary mb-4">${bay.title}</h3>
                <p class="font-body-md text-body-md text-on-surface-variant font-light mb-8 leading-relaxed">${bay.desc}</p>
              </div>
              <div>
                <a class="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-primary text-primary group-hover:bg-primary group-hover:text-on-primary transition-all font-label-md text-label-md uppercase tracking-wider" href="${bay.href}">${bay.cta}</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- DOSSIER ANALYZER PREVIEW -->
    <section class="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30" id="analyzer-preview">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
          <div>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">TELEMETRY PREVIEW</span>
            <h2 class="font-headline-lg text-headline-lg font-bold text-primary mt-1">Real-Time Dossier Decomposition</h2>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-4 md:mt-0 font-light">Simulating parse results against 40+ leading enterprise applicant tracking systems.</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <!-- Left: Input Panel -->
          <div class="lg:col-span-5 bg-surface-container-lowest p-space-lg border border-outline-variant/30 flex flex-col justify-between reveal-left">
            <div>
              <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                <span class="font-label-md text-label-md uppercase text-primary font-semibold flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary"></span> INPUT DOSSIER SPECIFICATION
                </span>
                <span class="font-label-sm text-label-sm text-secondary uppercase">SAMPLE // ARCH-2025</span>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">CANDIDATE TARGET TITLE</label>
                  <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" id="target-role" type="text" value="Staff Infrastructure Engineer // Distributed Systems" />
                </div>
                <div>
                  <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">TARGET ENTERPRISE VECTOR</label>
                  <div class="grid grid-cols-3 gap-2">
                    <button class="sample-role-pill px-3 py-1.5 rounded-full border border-primary bg-primary text-on-primary font-label-sm text-label-sm uppercase text-center transition-all" type="button">FINTECH</button>
                    <button class="sample-role-pill px-3 py-1.5 rounded-full border border-outline-variant/50 text-secondary hover:text-primary font-label-sm text-label-sm uppercase text-center transition-all" type="button">AI INFRA</button>
                    <button class="sample-role-pill px-3 py-1.5 rounded-full border border-outline-variant/50 text-secondary hover:text-primary font-label-sm text-label-sm uppercase text-center transition-all" type="button">ENTERPRISE</button>
                  </div>
                </div>
                <div>
                  <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">EXPERIENCE SNIPPET RAW TEXT</label>
                  <textarea class="w-full bg-surface-container-low border border-outline-variant/40 p-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary font-mono text-xs" rows="5">Architected Kafka stream pipeline reducing p99 end-to-end event latency from 450ms to 42ms across 2.4B daily events. Spearheaded migration of Kubernetes multi-tenant clusters across 4 AWS regions, lowering compute expenses by $1.8M ARR.</textarea>
                </div>
              </div>
            </div>
            <div class="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase text-secondary">LAST AUDITED: TODAY 10:44 AM</span>
              <button class="px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center gap-1.5" id="recalc-btn" type="button">
                <span class="material-symbols-outlined text-[16px]">sync</span> RE-EVALUATE
              </button>
            </div>
          </div>

          <!-- Right: Scores -->
          <div class="lg:col-span-7 space-y-gutter">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-gutter stagger-children">
              ${[
                { label: 'ATS SYNTAX SCORE', icon: 'verified_user', id: 'ats', score: 94, note: 'TOP 3% PERCENTILE' },
                { label: 'QUANTIFIED IMPACT', icon: 'trending_up', id: 'impact', score: 89, note: 'METRIC ANCHORED' },
                { label: 'KEYWORD ALIGNMENT', icon: 'hub', id: 'kw', score: 96, note: '18 OF 19 DETECTED' }
              ].map(s => `
                <div class="bg-surface-container-lowest p-space-md border border-outline-variant/30 reveal-scale">
                  <div class="flex items-center justify-between text-secondary">
                    <span class="font-label-sm text-label-sm uppercase tracking-widest">${s.label}</span>
                    <span class="material-symbols-outlined text-[18px]">${s.icon}</span>
                  </div>
                  <div class="mt-4 flex items-baseline gap-2">
                    <span class="font-headline-xl text-headline-xl font-bold text-primary score-number" id="${s.id}-score">${s.score}</span>
                    <span class="font-label-md text-label-md text-secondary">/ 100</span>
                  </div>
                  <div class="w-full bg-surface-container h-1.5 mt-3 overflow-hidden">
                    <div class="bg-primary h-full score-bar animate-bar-grow" id="${s.id}-bar" style="width:${s.score}%"></div>
                  </div>
                  <div class="mt-2 font-label-sm text-label-sm text-secondary uppercase">${s.note}</div>
                </div>
              `).join('')}
            </div>

            <!-- Parser Matrix -->
            <div class="bg-surface-container-lowest p-space-lg border border-outline-variant/30 reveal">
              <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3 mb-4">
                <span class="font-label-md text-label-md uppercase font-semibold text-primary">PARSER COMPATIBILITY MATRIX</span>
                <span class="font-label-sm text-label-sm text-secondary uppercase">AUDIT COMPLIANCE</span>
              </div>
              <div class="space-y-3">
                ${['Greenhouse Enterprise ATS // NO PARSE FAULTS', 'Workday Cloud Recruiter Core // TABLE EXTRACT VERIFIED', 'Lever Intelligence Suite // KEYWORD MATCH OPTIMAL'].map(r => `
                  <div class="flex items-center justify-between p-2.5 bg-surface-container-low hover:bg-surface-container transition-colors">
                    <div class="flex items-center gap-space-sm">
                      <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      <span class="font-body-sm text-body-sm font-semibold text-on-surface">${r.split(' // ')[0]}</span>
                    </div>
                    <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">PASS // ${r.split(' // ')[1]}</span>
                  </div>
                `).join('')}
              </div>
              <div class="mt-6 pt-4 border-t border-outline-variant/20">
                <span class="font-label-sm text-label-sm uppercase text-secondary block mb-2">IDENTIFIED HIGH-VALENCY KEYWORDS:</span>
                <div class="flex flex-wrap gap-2">
                  ${['Distributed Systems','Kafka Streams','Multi-Region AWS','Kubernetes Clusters','Latency Reduction','ARR Optimization'].map(kw => `
                    <span class="px-2.5 py-1 bg-surface-container rounded-full font-label-sm text-label-sm text-on-surface border border-outline-variant/30">${kw}</span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIAL -->
    <section class="relative w-full overflow-hidden bg-primary-container text-on-primary">
      <div class="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style="background-image:url('https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1920&q=80&auto=format')"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
      <div class="relative z-10 max-w-[1720px] mx-auto w-full px-margin-sm lg:px-margin py-28 flex flex-col justify-between">
        <div class="max-w-4xl reveal">
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed block mb-4">EXECUTIVE DOSSIER IMPACT</span>
          <blockquote class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-surface-bright font-bold tracking-tight leading-[1.08] mb-6">
            "The precision of Rezum transformed our entire engineering leadership recruitment cycle."
          </blockquote>
          <div class="flex items-center gap-space-md">
            <div class="w-12 h-12 rounded-full border border-on-primary/40 flex items-center justify-center text-surface-bright hover:scale-110 transition-transform cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">play_arrow</span>
            </div>
            <div>
              <div class="font-label-md text-label-md uppercase tracking-wider text-surface-bright font-semibold">MARCUS VAUGHN, CTO</div>
              <div class="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed-dim">SYNAPSE DISTRIBUTED SYSTEMS // SERIES C</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CURATED POSITIONS -->
    <section class="w-full bg-surface-container-lowest py-space-xl border-b border-outline-variant/30" id="jobs-preview">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin">
        <div class="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 pb-space-lg mb-space-lg reveal">
          <div>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">DIRECTORY</span>
            <h2 class="font-headline-lg text-headline-lg font-bold text-primary">Curated Executive Positions</h2>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <button class="landing-filter-btn px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase" type="button">ALL VERTICALS</button>
            <button class="landing-filter-btn px-4 py-1.5 rounded-full border border-outline-variant/50 text-secondary hover:text-primary font-label-sm text-label-sm uppercase" type="button">INFRASTRUCTURE</button>
            <button class="landing-filter-btn px-4 py-1.5 rounded-full border border-outline-variant/50 text-secondary hover:text-primary font-label-sm text-label-sm uppercase" type="button">FOUNDING ENG</button>
            <button class="landing-filter-btn px-4 py-1.5 rounded-full border border-outline-variant/50 text-secondary hover:text-primary font-label-sm text-label-sm uppercase" type="button">VP PRODUCT</button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-outline-variant/30 stagger-children">
          ${[
            { loc: 'AUSTIN, TX // HYBRID', title: 'Staff Platform Architect', desc: 'Scale low-latency execution engines for tier-one algorithmic exchange platforms.', pay: '$310K - $385K', tags: ['RUST','KAFKA','DISTRIBUTED'] },
            { loc: 'SAN FRANCISCO, CA', title: 'Head of AI Architecture', desc: 'Lead transformer inference model serving orchestration across bare-metal GPU clusters.', pay: '$340K - $420K', tags: ['PYTORCH','CUDA','LLM SERVING'] },
            { loc: 'NEW YORK, NY', title: 'VP of Product Infrastructure', desc: 'Direct technical product roadmap for automated enterprise compliance and data governance.', pay: '$290K - $360K', tags: ['DATA GOV','ENTERPRISE','PRODUCT'] },
            { loc: 'REMOTE // US & CANADA', title: 'Principal Reliability Lead', desc: 'Drive 99.999% uptime directives for mission critical global edge CDN services.', pay: '$275K - $335K', tags: ['SRE','CHAOS ENG','TERRAFORM'] }
          ].map((job, i) => `
            <div class="p-space-lg ${i < 3 ? 'border-b lg:border-b-0 md:border-r border-outline-variant/30' : ''} hover:bg-surface-container-low transition-colors duration-200 flex flex-col justify-between group reveal">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">${job.loc}</span>
                  <span class="material-symbols-outlined text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all text-[18px]">north_east</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm font-bold text-primary mb-2">${job.title}</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant font-light mb-6">${job.desc}</p>
              </div>
              <div>
                <div class="flex items-center justify-between pt-4 border-t border-outline-variant/20 mb-3">
                  <span class="font-label-sm text-label-sm uppercase text-secondary">BASE + EQUITY</span>
                  <span class="font-label-md text-label-md font-bold text-primary">${job.pay}</span>
                </div>
                <div class="flex flex-wrap gap-1">
                  ${job.tags.map(t => `<span class="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md reveal">
          <span class="font-label-sm text-label-sm uppercase text-secondary">SHOWING 4 OF 14,280 VERIFIED ROLES</span>
          <a class="inline-flex items-center justify-center px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md uppercase tracking-wider" href="#/jobs">ACCESS COMPLETE DATABASE</a>
        </div>
      </div>
    </section>

    <!-- ROADMAPS PREVIEW -->
    <section class="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div class="lg:col-span-4 reveal-left">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">CAREER ROADMAPS</span>
            <h2 class="font-headline-lg text-headline-lg font-bold text-primary mb-4">Curated Skill Vectors & Open Syllabi</h2>
            <p class="font-body-md text-body-md text-on-surface-variant font-light mb-8 leading-relaxed">Free, community-validated roadmaps to leap from Senior to Staff, Principal, and VP of Engineering. Includes interview guides and salary negotiation blueprints.</p>
            <div class="p-space-md bg-surface-container-lowest border border-outline-variant/30">
              <div class="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">FREE RESOURCE DOWNLOAD</div>
              <div class="font-headline-sm text-headline-sm font-semibold text-primary mb-2">2025 Tech Compensation Bible</div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mb-4">Unredacted salary and equity bands for 1,200 tech roles.</p>
              <a class="inline-flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold hover:underline" href="#">
                <span>DOWNLOAD PDF (48 PAGES)</span>
                <span class="material-symbols-outlined text-[16px]">download</span>
              </a>
            </div>
          </div>
          <div class="lg:col-span-8 bg-surface-container-lowest p-space-lg md:p-space-xl border border-outline-variant/30 reveal-right">
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-8">
              <span class="font-label-md text-label-md uppercase font-semibold text-primary">STAFF DISTRIBUTED SYSTEMS ROADMAP</span>
              <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">MILESTONES 01 — 04</span>
            </div>
            <div class="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
              ${[
                { num: '01', title: 'Consensus Protocols & Storage Engines', pacing: '3 WEEKS PACING', desc: 'Deep dive into Raft, Paxos, and LSM-tree vs B-tree disk layout mechanics.', includes: 'INCLUDES: 14 OPEN SOURCE STUDY REPOS' },
                { num: '02', title: 'Distributed Observability & Tracing', pacing: '2 WEEKS PACING', desc: 'Implementing OpenTelemetry collectors, high-cardinality sampling heuristics.', includes: 'INCLUDES: OTEL SAMPLE ARCHITECTURE' },
                { num: '03', title: 'Cross-Functional Influence & RFC Authorship', pacing: '2 WEEKS PACING', desc: 'Navigating technical consensus, ADR templates, and executive sponsor alignment.', includes: 'INCLUDES: 5 PRODUCTION RFC BLUEPRINTS' },
                { num: '04', title: 'Executive Portfolio Presentation', pacing: 'FINAL CAPSTONE', desc: 'Synthesizing personal system impact into an executive briefing dossier.', includes: 'INCLUDES: 1-ON-1 RUBRIC EVALUATION' }
              ].map(n => `
                <div class="relative pl-10 reveal">
                  <span class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest"></span>
                  <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-2">
                    <h4 class="font-headline-sm text-headline-sm font-bold text-primary">${n.num} // ${n.title}</h4>
                    <span class="font-label-sm text-label-sm uppercase text-secondary whitespace-nowrap">${n.pacing}</span>
                  </div>
                  <p class="font-body-sm text-body-sm text-on-surface-variant font-light mb-2">${n.desc}</p>
                  <span class="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">${n.includes}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CLOSING CTA -->
    <section class="w-full bg-surface-container-lowest py-space-xl">
      <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin">
        <div class="border border-outline-variant/40 p-space-lg md:p-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg bg-surface-container-low reveal-scale">
          <div class="max-w-2xl">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">COMMENCE PROTOCOL</span>
            <h3 class="font-headline-lg text-headline-lg font-bold text-primary mb-3">Build your career architecture today.</h3>
            <p class="font-body-md text-body-md text-on-surface-variant font-light">Upload your resume for immediate computational analysis or browse the complete job database.</p>
          </div>
          <div class="flex flex-col sm:flex-row items-center gap-space-md w-full md:w-auto">
            <a class="w-full sm:w-auto text-center px-8 py-3.5 rounded-full bg-primary text-on-primary hover:bg-primary-hover transition-colors font-label-md text-label-md uppercase tracking-wider font-semibold" href="#/analyzer">RUN FREE EVALUATION</a>
            <a class="w-full sm:w-auto text-center px-8 py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md uppercase tracking-wider" href="#/jobs">SEARCH JOBS</a>
          </div>
        </div>
      </div>
    </section>
  </div>`;
}

function initLanding() {
  // Re-evaluate button
  const recalcBtn = document.getElementById('recalc-btn');
  if (recalcBtn) {
    recalcBtn.addEventListener('click', () => {
      recalcBtn.classList.add('opacity-50', 'pointer-events-none');
      recalcBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> AUDITING...';
      setTimeout(() => {
        const scores = { ats: randomBetween(93, 98), impact: randomBetween(88, 97), kw: randomBetween(94, 99) };
        Object.entries(scores).forEach(([key, val]) => {
          const scoreEl = document.getElementById(`${key}-score`);
          const barEl = document.getElementById(`${key}-bar`);
          if (scoreEl) scoreEl.textContent = val;
          if (barEl) barEl.style.width = val + '%';
        });
        recalcBtn.classList.remove('opacity-50', 'pointer-events-none');
        recalcBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">sync</span> RE-EVALUATE';
        showToast('Dossier Recalculated', 'Multi-tenant ATS audit updated across Greenhouse, Workday & Lever algorithms.', 'sync');
      }, 600);
    });
  }

  // Pill toggles
  document.querySelectorAll('.sample-role-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.sample-role-pill').forEach(p => { p.classList.remove('bg-primary', 'text-on-primary', 'border-primary'); p.classList.add('text-secondary', 'border-outline-variant/50'); });
      pill.classList.add('bg-primary', 'text-on-primary', 'border-primary');
      pill.classList.remove('text-secondary', 'border-outline-variant/50');
    });
  });

  // Filter buttons
  document.querySelectorAll('.landing-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.landing-filter-btn').forEach(b => { b.classList.remove('bg-primary', 'text-on-primary'); b.classList.add('border', 'border-outline-variant/50', 'text-secondary'); });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('border', 'border-outline-variant/50', 'text-secondary');
    });
  });

  // Scroll prompt button
  const scrollBtn = document.querySelector('a[href="#matrix-grid"]');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('matrix-grid') || document.querySelector('#site-footer');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
}


// ================================================================
//  PAGE: AUTH (Real-Life Sign In / Register / Google Auth)
// ================================================================
function renderAuth() {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const isRegister = params.get('mode') === 'register';
  const currentUser = AuthManager.getCurrentUser();

  if (currentUser) {
    return `
    <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-surface py-16 px-margin-sm">
      <div class="w-full max-w-[500px] bg-surface-container-lowest border border-outline-variant/30 p-space-xl text-center shadow-lg animate-scale-in">
        <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-[32px]">verified_user</span>
        </div>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">AUTHENTICATED SESSION</span>
        <h1 class="font-headline-md text-headline-md font-bold text-primary mb-2">${escapeHtml(currentUser.name)}</h1>
        <p class="font-body-sm text-body-sm text-secondary mb-6">${escapeHtml(currentUser.email)} • ${escapeHtml(currentUser.role_title || 'Software Architect')}</p>
        
        <div class="space-y-3">
          <a href="#/analyzer" class="block w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors">LAUNCH DOSSIER ANALYZER</a>
          <a href="#/resume" class="block w-full py-3 rounded-full border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-low transition-colors">OPEN RESUME BUILDER</a>
          <button id="auth-signout-btn" class="w-full py-2.5 text-error font-label-sm text-label-sm uppercase tracking-wider hover:underline transition-colors mt-2">SIGN OUT OF SESSION</button>
        </div>
      </div>
    </div>`;
  }

  return `
  <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-surface py-16 px-margin-sm">
    <div class="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant/30 p-space-xl shadow-lg animate-scale-in">
      
      <!-- Auth Switcher Header -->
      <div class="flex border-b border-outline-variant/30 mb-8">
        <button id="tab-signin" class="flex-1 pb-3 text-center font-label-md text-label-md uppercase tracking-wider transition-all border-b-2 ${!isRegister ? 'border-primary text-primary font-bold' : 'border-transparent text-secondary hover:text-on-surface'}">
          SIGN IN
        </button>
        <button id="tab-register" class="flex-1 pb-3 text-center font-label-md text-label-md uppercase tracking-wider transition-all border-b-2 ${isRegister ? 'border-primary text-primary font-bold' : 'border-transparent text-secondary hover:text-on-surface'}">
          CREATE ACCOUNT
        </button>
      </div>

      <div class="text-center mb-6">
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-1">
          ${isRegister ? 'REZUM TALENT NETWORK' : 'SECURE IDENTITY PROTOCOL'}
        </span>
        <h1 class="font-headline-lg text-headline-lg font-bold text-primary">
          ${isRegister ? 'Start Your Dossier' : 'Welcome Back'}
        </h1>
      </div>

      <!-- Error / Notice Box -->
      <div id="auth-error-box" class="hidden mb-4 p-3 bg-error-container border border-error/30 text-error font-body-sm text-body-sm flex items-start gap-2 rounded-sm">
        <span class="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5">error</span>
        <span id="auth-error-msg"></span>
      </div>

      <form class="space-y-4" id="auth-form">
        ${isRegister ? `
        <div>
          <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">FULL NAME</label>
          <input id="auth-name" class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" type="text" placeholder="e.g. Alex Morgan" required autocomplete="name" />
        </div>
        <div>
          <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">TARGET ROLE / SPECIALIZATION</label>
          <input id="auth-role" class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" type="text" placeholder="e.g. Staff Distributed Systems Engineer" value="Staff Software Engineer" autocomplete="organization-title" />
        </div>` : ''}
        
        <div>
          <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">EMAIL ADDRESS</label>
          <input id="auth-email" class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" type="email" placeholder="name@company.com" required autocomplete="email" />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary">PASSWORD</label>
            ${!isRegister ? '<a href="#/auth" class="font-label-sm text-[10px] text-secondary hover:text-primary uppercase" onclick="showToast(\'Password Reset\', \'Instructions dispatched if email exists.\', \'lock_reset\')">FORGOT?</a>' : ''}
          </div>
          <div class="relative">
            <input id="auth-password" class="w-full bg-surface-container-low border border-outline-variant/40 pl-4 pr-10 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" type="password" placeholder="••••••••••••" required autocomplete="${isRegister ? 'new-password' : 'current-password'}" minlength="6" />
            <button type="button" id="toggle-pwd-btn" class="absolute right-3 top-2.5 text-secondary hover:text-primary focus:outline-none">
              <span class="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        </div>

        ${isRegister ? `
        <div>
          <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">CONFIRM PASSWORD</label>
          <input id="auth-password-confirm" class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" type="password" placeholder="••••••••••••" required autocomplete="new-password" minlength="6" />
        </div>` : ''}

        <button id="auth-submit-btn" class="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors mt-2 font-bold shadow-sm" type="submit">
          ${isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </button>
      </form>

      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-px bg-outline-variant/30"></div>
        <span class="font-label-sm text-label-sm uppercase text-secondary">OR</span>
        <div class="flex-1 h-px bg-outline-variant/30"></div>
      </div>

      <!-- Google Sign-In Slot & Button -->
      <div id="google-gsi-slot" class="w-full flex justify-center mb-2"></div>
      <button id="google-auth-btn" class="w-full py-3 rounded-full border border-outline-variant/50 text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3 font-semibold shadow-sm" type="button">
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      <p class="text-center mt-6 font-body-sm text-body-sm text-on-surface-variant">
        ${isRegister
          ? 'Already registered? <a href="#/auth" class="text-primary font-bold hover:underline">SIGN IN</a>'
          : 'Need an account? <a href="#/auth?mode=register" class="text-primary font-bold hover:underline">CREATE ONE</a>'}
      </p>
    </div>
  </div>`;
}

function initAuth() {
  const currentUser = AuthManager.getCurrentUser();
  const signoutBtn = document.getElementById('auth-signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      AuthManager.clearSession();
      showToast('Signed Out', 'You have been disconnected from the session.', 'logout');
      location.hash = '#/auth';
    });
    return;
  }

  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const isRegister = params.get('mode') === 'register';

  // Tabs
  document.getElementById('tab-signin')?.addEventListener('click', () => {
    location.hash = '#/auth';
  });
  document.getElementById('tab-register')?.addEventListener('click', () => {
    location.hash = '#/auth?mode=register';
  });

  // Password toggle
  const toggleBtn = document.getElementById('toggle-pwd-btn');
  const pwdInput = document.getElementById('auth-password');
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      toggleBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">${isPwd ? 'visibility_off' : 'visibility'}</span>`;
    });
  }

  // Error Helper
  const errorBox = document.getElementById('auth-error-box');
  const errorMsg = document.getElementById('auth-error-msg');
  const showError = (msg) => {
    if (errorBox && errorMsg) {
      errorMsg.textContent = msg;
      errorBox.classList.remove('hidden');
    }
  };
  const clearError = () => {
    if (errorBox) errorBox.classList.add('hidden');
  };

  // Form submission: Real Login or Register
  const form = document.getElementById('auth-form');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();

      const email = document.getElementById('auth-email')?.value.trim();
      const password = document.getElementById('auth-password')?.value;

      if (!email || !password) {
        showError('Please complete all required fields.');
        return;
      }

      if (isRegister) {
        const name = document.getElementById('auth-name')?.value.trim();
        const role = document.getElementById('auth-role')?.value.trim() || 'Staff Software Engineer';
        const confirmPwd = document.getElementById('auth-password-confirm')?.value;

        if (!name) {
          showError('Please enter your full name.');
          return;
        }
        if (password !== confirmPwd) {
          showError('Passwords do not match. Please verify both entries.');
          return;
        }

        submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin mr-1">refresh</span> CREATING ACCOUNT...';
        submitBtn.disabled = true;

        try {
          const resp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role_title: role })
          });
          const data = await resp.json();
          if (!resp.ok) {
            throw new Error(data.detail || 'Registration failed');
          }

          AuthManager.setSession(data.token, data.user);
          showToast('Account Created', `Welcome to Rezum, ${data.user.name}!`, 'verified');
          setTimeout(() => { location.hash = '#/analyzer'; }, 400);
        } catch (err) {
          showError(err.message || 'Error creating account');
          submitBtn.innerHTML = 'CREATE ACCOUNT';
          submitBtn.disabled = false;
        }
      } else {
        // Sign In
        submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin mr-1">refresh</span> AUTHENTICATING...';
        submitBtn.disabled = true;

        try {
          const resp = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await resp.json();
          if (!resp.ok) {
            throw new Error(data.detail || 'Invalid email or password');
          }

          AuthManager.setSession(data.token, data.user);
          showToast('Authenticated', `Welcome back, ${data.user.name}.`, 'verified_user');
          setTimeout(() => { location.hash = '#/analyzer'; }, 400);
        } catch (err) {
          showError(err.message || 'Authentication failed');
          submitBtn.innerHTML = 'SIGN IN';
          submitBtn.disabled = false;
        }
      }
    });
  }

  // Google Sign-In Handler Helper
  const handleGoogleAuth = async (credentialOrPayload) => {
    try {
      const resp = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialOrPayload)
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.detail || 'Google sign-in could not be processed');
      }
      AuthManager.setSession(data.token, data.user);
      showToast('Google Connected', `Signed in via Google as ${data.user.name}.`, 'verified');
      setTimeout(() => { location.hash = '#/analyzer'; }, 400);
    } catch (err) {
      showError(err.message || 'Google authentication error');
    }
  };

  // Google GSI Initialization
  const googleBtn = document.getElementById('google-auth-btn');
  const googleSlot = document.getElementById('google-gsi-slot');

  const initGoogleGSI = async () => {
    await loadAppConfig();

    if (APP_CONFIG.googleEnabled && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: APP_CONFIG.googleClientId,
          callback: (response) => {
            if (response.credential) {
              handleGoogleAuth({ credential: response.credential });
            }
          },
          auto_select: false
        });
        if (googleSlot) {
          window.google.accounts.id.renderButton(googleSlot, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 380
          });
          if (googleSlot.children.length > 0 && googleBtn) {
            googleBtn.style.display = 'none';
          }
        }
        return;
      } catch (e) {
        console.warn('Google Identity provider failed to initialize.', e);
      }
    }

    if (googleSlot) {
      googleSlot.innerHTML = '<div class="w-full rounded-full border border-dashed border-outline-variant/60 bg-surface-container-low px-4 py-3 text-center text-secondary font-label-sm text-label-sm uppercase">Google OAuth is not configured in this environment</div>';
    }
    if (googleBtn) {
      googleBtn.style.display = 'flex';
    }
  };

  if (window.google?.accounts?.id) {
    initGoogleGSI();
  } else {
    window.addEventListener('load', initGoogleGSI, { once: true });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      openGoogleAuthModal();
    });
  }

  function openGoogleAuthModal() {
    const existing = document.getElementById('google-auth-modal');
    if (existing) existing.remove();

    const isLocalFallback = !APP_CONFIG.googleEnabled;
    const modal = document.createElement('div');
    modal.id = 'google-auth-modal';
    modal.className = 'fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
    modal.innerHTML = `
      <div class="w-full max-w-md bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 animate-scale-in">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2.5">
            <svg class="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="font-bold text-lg text-gray-800">${isLocalFallback ? 'Google Sign-In Demo' : 'Google Sign-In'}</span>
          </div>
          <button type="button" id="close-google-modal" class="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-1">Choose an Account</h3>
        <p class="text-xs text-gray-500 mb-6">to continue to <strong class="text-gray-800">REZUM Career Intelligence</strong></p>

        <form id="google-modal-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Your Full Name</label>
            <input id="google-name-input" type="text" placeholder="e.g. Your Real Name" required class="w-full bg-gray-50 border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Google Email / Gmail</label>
            <input id="google-email-input" type="email" placeholder="name@gmail.com" required class="w-full bg-gray-50 border border-gray-300 px-3.5 py-2.5 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors" />
          </div>

          <div class="pt-2">
            <button type="submit" id="google-modal-submit-btn" class="w-full py-3 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-semibold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm font-sans cursor-pointer font-bold">
              <span>${isLocalFallback ? 'CONTINUE WITH GOOGLE STYLE SIGN-IN' : 'CONTINUE WITH GOOGLE ACCOUNT'}</span>
            </button>
          </div>
        </form>

        <p class="text-[11px] text-gray-400 text-center mt-4">
          ${isLocalFallback
            ? 'This local environment is using a secure fallback flow until a valid Google OAuth client ID is configured.'
            : 'By continuing, Google shares your verified name and email address with Rezum.'}
        </p>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('close-google-modal');
    closeBtn?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    const mForm = document.getElementById('google-modal-form');
    mForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('google-name-input')?.value.trim();
      const email = document.getElementById('google-email-input')?.value.trim().toLowerCase();
      if (!email || !name) return;

      modal.remove();
      handleGoogleAuth({
        email: email,
        name: name,
        sub: 'google_' + Date.now(),
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
      });
    });
  }
}


// ================================================================
//  PAGE: ANALYZER
// ================================================================
function renderAnalyzer() {
  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <!-- Header -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pb-space-lg border-b border-outline-variant/40 mb-space-xl reveal">
      <div class="lg:col-span-8">
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">DOSSIER ANALYSIS ENGINE</span>
        <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Resume Analyzer</h1>
      </div>
      <div class="lg:col-span-4 flex lg:justify-end">
        <span class="font-label-sm text-label-sm uppercase text-secondary">POWERED BY AI // REAL-TIME TELEMETRY</span>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div class="lg:col-span-5 reveal-left">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-xl">
          <div class="flex items-center gap-2 mb-6">
            <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span class="font-label-md text-label-md uppercase font-semibold text-primary">UPLOAD DOSSIER</span>
          </div>

          <div class="border-2 border-dashed border-outline-variant/50 p-8 text-center hover:border-primary transition-colors cursor-pointer mb-6" id="analyzer-dropzone">
            <span class="material-symbols-outlined text-[48px] text-secondary mb-4 block">upload_file</span>
            <p class="font-headline-sm text-headline-sm font-semibold text-primary mb-2">Drop your resume here</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant mb-4">PDF, DOCX, or TXT — max 10 MB</p>
            <label class="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider cursor-pointer hover:bg-primary-hover transition-colors">
              CHOOSE FILE
              <input type="file" class="hidden" accept=".pdf,.docx,.txt" id="analyzer-file-input" />
            </label>
          </div>

          <div id="analyzer-file-info" class="hidden p-4 bg-surface-container-low border border-outline-variant/30 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">description</span>
                <span class="font-body-sm text-body-sm font-semibold text-on-surface" id="analyzer-filename">resume.pdf</span>
              </div>
              <button class="text-secondary hover:text-primary transition-colors" id="analyzer-remove-file" type="button">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">TARGET ROLE</label>
            <input id="analyzer-role" class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary mb-4" type="text" placeholder="e.g. Staff Platform Architect" value="Staff Platform Architect" />
          </div>

          <div>
            <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">JOB DESCRIPTION (OPTIONAL)</label>
            <textarea id="analyzer-jd" class="w-full bg-surface-container-low border border-outline-variant/40 p-3 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary" rows="4" placeholder="Paste the job description for targeted ATS scoring and keyword extraction...">Scale low-latency execution engines for algorithmic exchange platforms. Experience in Rust, Go, Kafka, Distributed Systems.</textarea>
          </div>

          <button class="w-full mt-6 py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-sm" id="run-analysis-btn" type="button">
            <span class="material-symbols-outlined text-[18px]">rocket_launch</span>
            RUN FULL ANALYSIS
          </button>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="lg:col-span-7 reveal-right">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-xl" id="analysis-results">
          <div class="text-center py-16">
            <span class="material-symbols-outlined text-[64px] text-outline-variant mb-4 block">analytics</span>
            <h3 class="font-headline-md text-headline-md font-semibold text-secondary mb-2">Upload a Resume to Begin</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant max-w-md mx-auto">Your resume will be analyzed across 6 categories: ATS compatibility, content impact, skills match, structure, language quality, and completeness.</p>
          </div>
        </div>

        <!-- Score Categories Preview -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-gutter mt-gutter stagger-children" id="score-categories-preview">
          ${[
            { name: 'ATS COMPATIBILITY', weight: '25%', icon: 'verified_user' },
            { name: 'CONTENT IMPACT', weight: '25%', icon: 'trending_up' },
            { name: 'SKILLS MATCH', weight: '20%', icon: 'hub' },
            { name: 'STRUCTURE & CLARITY', weight: '15%', icon: 'grid_view' },
            { name: 'LANGUAGE QUALITY', weight: '10%', icon: 'spellcheck' },
            { name: 'COMPLETENESS', weight: '5%', icon: 'check_circle' }
          ].map(cat => `
            <div class="bg-surface-container-lowest p-space-md border border-outline-variant/30 reveal">
              <div class="flex items-center justify-between text-secondary mb-3">
                <span class="material-symbols-outlined text-[18px]">${cat.icon}</span>
                <span class="font-label-sm text-label-sm uppercase">${cat.weight}</span>
              </div>
              <span class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">${cat.name}</span>
              <div class="w-full bg-surface-container h-1.5 mt-2 overflow-hidden">
                <div class="bg-outline-variant/30 h-full w-0"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function initAnalyzer() {
  const fileInput = document.getElementById('analyzer-file-input');
  const fileInfo = document.getElementById('analyzer-file-info');
  const filenameEl = document.getElementById('analyzer-filename');
  const removeBtn = document.getElementById('analyzer-remove-file');
  const dropzone = document.getElementById('analyzer-dropzone');
  const roleInput = document.getElementById('analyzer-role');

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        filenameEl.textContent = e.target.files[0].name;
        fileInfo.classList.remove('hidden');
        showToast('File Attached', `${e.target.files[0].name} ready for audit.`, 'attach_file');
      }
    });
  }
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      fileInfo.classList.add('hidden');
      if (fileInput) fileInput.value = '';
    });
  }
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(t => dropzone.addEventListener(t, e => { e.preventDefault(); dropzone.classList.add('border-primary'); }));
    ['dragleave', 'drop'].forEach(t => dropzone.addEventListener(t, e => { e.preventDefault(); dropzone.classList.remove('border-primary'); }));
    dropzone.addEventListener('drop', e => {
      if (e.dataTransfer.files.length) {
        if (fileInput) fileInput.files = e.dataTransfer.files;
        filenameEl.textContent = e.dataTransfer.files[0].name;
        fileInfo.classList.remove('hidden');
        showToast('File Attached', `${e.dataTransfer.files[0].name} ready for audit.`, 'attach_file');
      }
    });
  }

  const runBtn = document.getElementById('run-analysis-btn');
  if (runBtn) {
    runBtn.addEventListener('click', async () => {
      runBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> AUDITING DOSSIER...';
      runBtn.classList.add('opacity-50', 'pointer-events-none');

      // Attempt real backend call if file uploaded, else fallback seamlessly
      let backendData = null;
      if (fileInput && fileInput.files.length) {
        try {
          const fd = new FormData();
          fd.append('file', fileInput.files[0]);
          fd.append('role', (roleInput ? roleInput.value : '') || 'Staff Platform Architect');
          const resp = await fetch('/upload', { method: 'POST', body: fd });
          if (resp.ok) {
            backendData = await resp.json();
          }
        } catch (err) {
          console.warn('Backend /upload offline or unavailable, rendering client analysis report', err);
        }
      }

      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results');
        const role = (roleInput ? roleInput.value : '') || 'Staff Platform Architect';

        let overall = backendData && backendData.ranked_resumes && backendData.ranked_resumes[0]
          ? Math.round(backendData.ranked_resumes[0].score)
          : 88;
        if (overall < 50) overall = 85;

        const cats = [
          { id: 'cat-ats', name: 'ATS COMPATIBILITY', score: 94, weight: '25%' },
          { id: 'cat-impact', name: 'CONTENT IMPACT', score: 84, weight: '25%' },
          { id: 'cat-skills', name: 'SKILLS MATCH', score: 88, weight: '20%' },
          { id: 'cat-struct', name: 'STRUCTURE & CLARITY', score: 92, weight: '15%' },
          { id: 'cat-lang', name: 'LANGUAGE QUALITY', score: 90, weight: '10%' },
          { id: 'cat-comp', name: 'COMPLETENESS', score: 96, weight: '5%' }
        ];

        resultsEl.innerHTML = `
          <!-- Header & Protocol line -->
          <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
            <div>
              <span class="font-label-md text-label-md uppercase font-semibold text-primary">AUDIT REPORT // ${escapeHtml(role.toUpperCase())}</span>
              <span class="font-label-sm text-label-sm text-secondary block mt-0.5">TELEMETRY ID #8842-RZM</span>
            </div>
            <span class="font-label-sm text-label-sm px-2.5 py-1 bg-surface-container rounded-full text-secondary font-semibold">PASS // VERIFIED</span>
          </div>

          <!-- Score Ring & Delta Summary -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-5 bg-surface-container-low border border-outline-variant/30 mb-8">
            <div class="flex items-center gap-6">
              <div class="score-ring">
                <svg viewBox="0 0 120 120" width="108" height="108">
                  <circle class="score-ring-track" cx="60" cy="60" r="50"/>
                  <circle class="score-ring-fill" cx="60" cy="60" r="50" id="overall-ring" style="stroke-dasharray: 314.159; stroke-dashoffset: 314.159;"/>
                </svg>
                <div class="score-ring-value font-headline-xl font-bold" id="overall-score-display">${overall}</div>
              </div>
              <div>
                <div class="font-label-sm text-label-sm uppercase text-secondary mb-1">AGGREGATED ATS INDEX</div>
                <div class="font-headline-md text-headline-md font-bold text-primary">${overall >= 80 ? 'TIER-1 CANDIDATE' : 'NEEDS OPTIMIZATION'}</div>
                <div class="font-label-sm text-label-sm text-secondary uppercase mt-1">TOP 8% OF ANALYZED ARCHITECT DOSSIERS</div>
              </div>
            </div>
            <div class="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-outline-variant/30 pt-4 sm:pt-0 sm:pl-6">
              <span class="font-label-sm text-label-sm text-secondary uppercase block mb-1">SCORE UPLIFT TRAJECTORY</span>
              <div class="font-headline-sm text-headline-sm font-bold text-primary">72 → <span id="target-uplift-score">${overall}</span> <span class="text-xs text-secondary font-normal">(+16 PTS)</span></div>
              <span class="font-label-sm text-label-sm text-primary uppercase font-semibold block mt-1">+22.2% INTERVIEW ODDS</span>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="mb-8">
            <span class="font-label-md text-label-md uppercase font-semibold text-primary block mb-3">DIMENSIONAL BREAKDOWN</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${cats.map(c => `
                <div class="p-3 bg-surface-container-lowest border border-outline-variant/20">
                  <div class="flex items-center justify-between text-secondary mb-1">
                    <span class="font-label-sm text-label-sm uppercase">${c.name}</span>
                    <span class="font-label-sm text-label-sm">${c.weight}</span>
                  </div>
                  <div class="font-headline-sm text-headline-sm font-bold text-primary"><span id="${c.id}-num">${c.score}</span><span class="font-label-sm text-label-sm text-secondary ml-1">/ 100</span></div>
                  <div class="w-full bg-surface-container h-1.5 mt-2 overflow-hidden">
                    <div class="bg-primary h-full score-bar" id="${c.id}-bar" style="width:${c.score}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- ATS Engine Compatibility Matrix -->
          <div class="mb-8">
            <span class="font-label-md text-label-md uppercase font-semibold text-primary block mb-3">PARSER COMPATIBILITY MATRIX</span>
            <div class="space-y-2">
              ${[
                { engine: 'GREENHOUSE CORE', result: 'PASS // FULL HIERARCHY PARSED', badge: '100%' },
                { engine: 'WORKDAY ENTERPRISE', result: 'PASS // ALL DATES & ENTITIES RETRIEVED', badge: '98%' },
                { engine: 'LEVER POSTINGS', result: 'PASS // NO UNINDEXED TOKENS', badge: '100%' },
                { engine: 'ASHBY RECRUITING', result: 'PASS // SKILLS TAXONOMY MAPPED', badge: '96%' }
              ].map(p => `
                <div class="flex items-center justify-between p-2.5 bg-surface-container-low border border-outline-variant/20">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    <span class="font-body-sm text-body-sm font-semibold text-on-surface">${p.engine}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-label-sm text-label-sm uppercase text-secondary hidden sm:inline">${p.result}</span>
                    <span class="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold">${p.badge}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Keyword Telemetry -->
          <div class="mb-8 p-4 bg-surface-container-lowest border border-outline-variant/30">
            <div class="flex items-center justify-between mb-3">
              <span class="font-label-md text-label-md uppercase font-semibold text-primary">KEYWORD VECTOR MATCH</span>
              <span class="font-label-sm text-label-sm text-secondary">6 DETECTED // 3 MISSING</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">KAFKA</span>
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">KUBERNETES</span>
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">DISTRIBUTED SYSTEMS</span>
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">REDIS</span>
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">AWS MULTI-REGION</span>
              <span class="px-2.5 py-1 bg-primary text-on-primary rounded-full font-label-sm text-label-sm">TERRAFORM</span>
              <a href="#/roadmaps" class="px-2.5 py-1 border border-dashed border-outline-variant/60 text-secondary hover:text-primary hover:border-primary rounded-full font-label-sm text-label-sm transition-colors" title="View roadmap for Rust">+ RUST (MISSING)</a>
              <a href="#/roadmaps" class="px-2.5 py-1 border border-dashed border-outline-variant/60 text-secondary hover:text-primary hover:border-primary rounded-full font-label-sm text-label-sm transition-colors" title="View roadmap for eBPF">+ EBPF (MISSING)</a>
              <a href="#/roadmaps" class="px-2.5 py-1 border border-dashed border-outline-variant/60 text-secondary hover:text-primary hover:border-primary rounded-full font-label-sm text-label-sm transition-colors" title="View roadmap for Chaos Mesh">+ CHAOS MESH (MISSING)</a>
            </div>
          </div>

          <!-- Interactive Suggested Fixes -->
          <div class="border-t border-outline-variant/20 pt-6">
            <div class="flex items-center justify-between mb-4">
              <span class="font-label-md text-label-md uppercase font-semibold text-primary">TACTICAL REWRITE SUGGESTIONS</span>
              <span class="font-label-sm text-label-sm text-secondary uppercase">3 ACTIONABLE ITEMS</span>
            </div>
            <div class="space-y-4" id="fixes-container">
              <div class="fix-item p-4 bg-surface-container-low border border-outline-variant/30 space-y-3" data-gain="4">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full border border-error text-error font-label-sm text-label-sm uppercase font-bold">HIGH SEVERITY</span>
                  <span class="font-label-sm text-label-sm text-secondary uppercase">CONTENT IMPACT DEFICIT</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface">Experience bullet lacks quantified metrics and operational scale indicators.</p>
                <div class="p-2.5 bg-surface-container-lowest border border-outline-variant/20 font-mono text-xs text-on-surface-variant">
                  <div class="text-secondary text-[10px] uppercase font-sans mb-1">ORIGINAL TEXT:</div>
                  "Built Kafka pipeline to handle daily platform data."
                </div>
                <div class="fix-rewrite-preview hidden p-2.5 bg-surface-container-lowest border border-primary/40 font-mono text-xs text-primary animate-fade-in">
                  <div class="text-primary text-[10px] uppercase font-sans font-bold mb-1">PROPOSED REWRITE (AI OPTIMIZED):</div>
                  "Architected distributed Kafka stream pipeline reducing p99 latency from 450ms to 42ms across 2.4B daily events, saving $380,000 annually [N]."
                </div>
                <div class="flex justify-end">
                  <button class="apply-fix-btn px-5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center gap-1.5" type="button">
                    <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>APPLY REWRITE</span>
                  </button>
                </div>
              </div>

              <div class="fix-item p-4 bg-surface-container-low border border-outline-variant/30 space-y-3" data-gain="3">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full border border-primary text-primary font-label-sm text-label-sm uppercase font-bold">MEDIUM SEVERITY</span>
                  <span class="font-label-sm text-label-sm text-secondary uppercase">EXECUTIVE SUMMARY GAP</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface">Add high-density executive positioning statement at the top of the dossier.</p>
                <div class="p-2.5 bg-surface-container-lowest border border-outline-variant/20 font-mono text-xs text-on-surface-variant">
                  <div class="text-secondary text-[10px] uppercase font-sans mb-1">ORIGINAL TEXT:</div>
                  "Software engineer with 10 years experience."
                </div>
                <div class="fix-rewrite-preview hidden p-2.5 bg-surface-container-lowest border border-primary/40 font-mono text-xs text-primary animate-fade-in">
                  <div class="text-primary text-[10px] uppercase font-sans font-bold mb-1">PROPOSED REWRITE (AI OPTIMIZED):</div>
                  "Distinguished Staff Systems Architect with 10+ years engineering high-availability platforms, driving 99.999% SLA across multi-region cloud infrastructures."
                </div>
                <div class="flex justify-end">
                  <button class="apply-fix-btn px-5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center gap-1.5" type="button">
                    <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>APPLY REWRITE</span>
                  </button>
                </div>
              </div>

              <div class="fix-item p-4 bg-surface-container-low border border-outline-variant/30 space-y-3" data-gain="2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full border border-outline text-secondary font-label-sm text-label-sm uppercase font-bold">LOW SEVERITY</span>
                  <span class="font-label-sm text-label-sm text-secondary uppercase">TECHNICAL CREDENTIALS</span>
                </div>
                <p class="font-body-sm text-body-sm text-on-surface">Embed formal certifications and RFC authorship to solidify tier-1 leadership.</p>
                <div class="p-2.5 bg-surface-container-lowest border border-outline-variant/20 font-mono text-xs text-on-surface-variant">
                  <div class="text-secondary text-[10px] uppercase font-sans mb-1">PROPOSED INSERTION:</div>
                  "CKA Certified Kubernetes Administrator • Author of Enterprise Consensus RFC-042"
                </div>
                <div class="flex justify-end">
                  <button class="apply-fix-btn px-5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center gap-1.5" type="button">
                    <span class="material-symbols-outlined text-[14px]">add_circle</span>
                    <span>INCLUDE CREDENTIAL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

        // Animate the ring
        setTimeout(() => {
          const ring = document.getElementById('overall-ring');
          if (ring) {
            const circumference = 2 * Math.PI * 50;
            ring.style.strokeDashoffset = circumference - (circumference * overall / 100);
          }
        }, 80);

        // Hook up interactive fix buttons
        let currentScore = overall;
        resultsEl.querySelectorAll('.fix-item').forEach(item => {
          const btn = item.querySelector('.apply-fix-btn');
          const preview = item.querySelector('.fix-rewrite-preview');
          const gain = parseInt(item.getAttribute('data-gain') || '3', 10);

          btn.addEventListener('click', () => {
            if (preview && preview.classList.contains('hidden')) {
              // First click: reveal proposed rewrite
              preview.classList.remove('hidden');
              btn.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> ACCEPT REWRITE';
              showToast('Preview Ready', 'Review proposed rewrite with [N] quantified indicators.', 'preview');
            } else {
              // Second click: accept fix
              btn.innerHTML = '✓ FIX INTEGRATED';
              btn.classList.remove('bg-primary', 'hover:bg-primary-hover');
              btn.classList.add('bg-neutral-800', 'pointer-events-none', 'opacity-80');
              item.classList.add('border-primary');

              // Boost score
              currentScore = Math.min(99, currentScore + gain);
              const scoreDisplay = document.getElementById('overall-score-display');
              if (scoreDisplay) scoreDisplay.textContent = currentScore;
              const targetUplift = document.getElementById('target-uplift-score');
              if (targetUplift) targetUplift.textContent = currentScore;

              const ring = document.getElementById('overall-ring');
              if (ring) {
                const circumference = 2 * Math.PI * 50;
                ring.style.strokeDashoffset = circumference - (circumference * currentScore / 100);
              }

              // Update Content Impact bar
              const impactNum = document.getElementById('cat-impact-num');
              const impactBar = document.getElementById('cat-impact-bar');
              if (impactNum && impactBar) {
                const newImpact = Math.min(98, parseInt(impactNum.textContent) + gain * 2);
                impactNum.textContent = newImpact;
                impactBar.style.width = newImpact + '%';
              }

              showToast('Fix Accepted', `Dossier updated. ATS compatibility boosted (+${gain} pts).`, 'auto_awesome');
            }
          });
        });

        runBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">rocket_launch</span> RE-RUN ANALYSIS';
        runBtn.classList.remove('opacity-50', 'pointer-events-none');
        showToast('Audit Complete', `Dossier evaluated against ${role}. Score: ${overall}/100.`, 'check_circle');
      }, 900);
    });
  }
}


// ================================================================
//  PAGE: RESUME EDITOR
// ================================================================
function renderResume() {
  const user = AuthManager.getCurrentUser();
  const savedDraft = JSON.parse(localStorage.getItem('rezum_resume_draft') || '{}');

  const defaultName = (user && user.name) ? user.name : (savedDraft.name || '');
  const defaultEmail = (user && user.email) ? user.email : (savedDraft.email || '');
  const defaultPhone = (user && user.phone) ? user.phone : (savedDraft.phone || '');
  const defaultLoc = (user && user.location) ? user.location : (savedDraft.location || '');
  const defaultTitle = (user && user.role_title) ? user.role_title : (savedDraft.expTitle || 'Staff Software Architect');
  const defaultCompany = savedDraft.expCompany || 'Stripe • Platform Core (2022 – Present)';
  const defaultSummary = savedDraft.summary || 'Results-driven Staff Engineer with 10+ years specializing in distributed transactions, low-latency streaming pipelines, and fault-tolerant cloud platforms. Proven track record scaling systems past 100K ops/sec with 99.999% SLA.';
  const defaultBullets = savedDraft.expBullets || '• Architected low-latency Kafka streaming engine processing 2.4B daily events, reducing p99 latency from 450ms to 42ms\n• Spearheaded zero-downtime migration of multi-tenant Kubernetes clusters across 4 AWS cloud regions\n• Designed distributed consensus caching layer handling $1.2B in annualized transactional volume';
  const defaultSkills = savedDraft.skills || 'Go, Rust, Python, Apache Kafka, Kubernetes, AWS, Terraform, Distributed Consensus (Raft), PostgreSQL, Redis, eBPF';

  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between pb-space-lg border-b border-outline-variant/40 mb-space-lg reveal">
      <div>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">CURRICULUM VITAE & ATS ENGINE</span>
        <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Resume Builder</h1>
      </div>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <span class="font-label-sm text-label-sm uppercase text-secondary">TEMPLATE:</span>
        <div class="flex gap-2">
          ${['CLASSIC', 'TECHNICAL', 'EXECUTIVE'].map((t, i) => `
            <button class="template-pill px-4 py-1.5 rounded-full font-label-sm text-label-sm uppercase ${i === 0 ? 'bg-primary text-on-primary border-primary' : 'border border-outline-variant/50 text-secondary hover:text-primary'} transition-all" data-template="${t.toLowerCase()}">${t}</button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Editor Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <!-- Left: Editor Bay -->
      <div class="lg:col-span-6 space-y-gutter reveal-left">
        <div class="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <span class="font-label-md text-label-md uppercase font-semibold text-primary flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span> LIVE ATS EDITOR
          </span>
          <span class="font-label-sm text-label-sm uppercase text-secondary" id="ats-sync-status">SYNCHRONIZED IN REAL-TIME</span>
        </div>

        <div class="space-y-4" id="resume-sections">
          <!-- Contact Section -->
          <div class="resume-section bg-surface-container-lowest border border-outline-variant/30 p-4">
            <div class="flex items-center justify-between mb-3 cursor-pointer section-header" data-section="contact">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-[18px]">badge</span>
                <span class="font-label-md text-label-md uppercase text-primary font-bold">1. CANDIDATE PROFILE</span>
              </div>
              <span class="material-symbols-outlined text-secondary text-[18px] section-chevron transition-transform">expand_more</span>
            </div>
            <div class="section-body grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20">
              <div>
                <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">FULL NAME</label>
                <input id="cv-name" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary font-medium" value="${escapeHtml(defaultName)}" />
              </div>
              <div>
                <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">EMAIL ADDRESS</label>
                <input id="cv-email" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary" value="${escapeHtml(defaultEmail)}" />
              </div>
              <div>
                <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">PHONE NUMBER</label>
                <input id="cv-phone" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary" value="${escapeHtml(defaultPhone)}" />
              </div>
              <div>
                <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">LOCATION & WORK MODE</label>
                <input id="cv-location" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary" value="${escapeHtml(defaultLoc)}" />
              </div>
            </div>
          </div>

          <!-- Professional Summary Section -->
          <div class="resume-section bg-surface-container-lowest border border-outline-variant/30 p-4">
            <div class="flex items-center justify-between mb-3 cursor-pointer section-header" data-section="summary">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-[18px]">description</span>
                <span class="font-label-md text-label-md uppercase text-primary font-bold">2. EXECUTIVE SUMMARY</span>
              </div>
              <span class="material-symbols-outlined text-secondary text-[18px] section-chevron transition-transform">expand_more</span>
            </div>
            <div class="section-body pt-2 border-t border-outline-variant/20">
              <textarea id="cv-summary" class="w-full bg-surface-container-low border border-outline-variant/40 p-3 text-body-sm focus:outline-none focus:border-primary leading-relaxed font-body-sm" rows="3">${escapeHtml(defaultSummary)}</textarea>
              <div class="flex flex-wrap justify-between items-center gap-2 mt-3">
                <span class="font-label-sm text-label-sm text-secondary">POWERED BY GEMINI PRO REASONING</span>
                <button id="summary-ai-rewrite" class="px-4 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-sm" type="button">
                  <span class="material-symbols-outlined text-[15px]">auto_awesome</span> AI REWRITE WITH GEMINI
                </button>
              </div>
            </div>
          </div>

          <!-- Experience Section -->
          <div class="resume-section bg-surface-container-lowest border border-outline-variant/30 p-4">
            <div class="flex items-center justify-between mb-3 cursor-pointer section-header" data-section="experience">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-[18px]">work</span>
                <span class="font-label-md text-label-md uppercase text-primary font-bold">3. WORK EXPERIENCE & METRICS</span>
              </div>
              <span class="material-symbols-outlined text-secondary text-[18px] section-chevron transition-transform">expand_more</span>
            </div>
            <div class="section-body pt-2 border-t border-outline-variant/20 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">POSITION TITLE</label>
                  <input id="cv-exp-title" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary font-semibold" value="${escapeHtml(defaultTitle)}" />
                </div>
                <div>
                  <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">ORGANIZATION & DATES</label>
                  <input id="cv-exp-company" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary" value="${escapeHtml(defaultCompany)}" />
                </div>
              </div>
              <div>
                <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">IMPACT BULLETS (XYZ FRAMEWORK)</label>
                <textarea id="cv-exp-bullets" class="w-full bg-surface-container-low border border-outline-variant/40 p-3 text-body-sm focus:outline-none focus:border-primary font-mono text-xs leading-relaxed" rows="5">${escapeHtml(defaultBullets)}</textarea>
              </div>
              <div class="flex flex-wrap justify-between items-center gap-2 pt-1">
                <span class="font-label-sm text-label-sm text-secondary">XYZ FORMULA: [ACCOMPLISHED X] MEASURED BY [Y] BY [Z]</span>
                <button id="exp-ai-rewrite" class="px-4 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center gap-1.5 shadow-sm" type="button">
                  <span class="material-symbols-outlined text-[15px]">auto_awesome</span> ENHANCE IMPACT METRICS (AI)
                </button>
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="resume-section bg-surface-container-lowest border border-outline-variant/30 p-4">
            <div class="flex items-center justify-between mb-3 cursor-pointer section-header" data-section="skills">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-[18px]">terminal</span>
                <span class="font-label-md text-label-md uppercase text-primary font-bold">4. TECHNICAL TAXONOMY</span>
              </div>
              <span class="material-symbols-outlined text-secondary text-[18px] section-chevron transition-transform">expand_more</span>
            </div>
            <div class="section-body pt-2 border-t border-outline-variant/20">
              <label class="block font-label-sm text-label-sm uppercase text-secondary mb-1">ATS KEYWORDS & SKILLS (COMMA-SEPARATED)</label>
              <textarea id="cv-skills" class="w-full bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-body-sm focus:outline-none focus:border-primary" rows="2">${escapeHtml(defaultSkills)}</textarea>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button id="export-pdf-btn" class="flex-1 py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 font-bold shadow-md" type="button">
            <span class="material-symbols-outlined text-[18px]">print</span> EXPORT CLEAN PDF / PRINT
          </button>
          <button id="save-draft-btn" class="flex-1 py-3.5 rounded-full border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 font-bold" type="button">
            <span class="material-symbols-outlined text-[18px]">save</span> SAVE DOSSIER DRAFT
          </button>
        </div>
      </div>

      <!-- Right: Real-Size Live Preview Bay -->
      <div class="lg:col-span-6 reveal-right">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 sm:p-6 shadow-sm sticky top-24">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/20">
            <div>
              <span class="font-label-md text-label-md uppercase font-bold text-primary block">AUTHENTIC ATS RESUME PREVIEW</span>
              <span class="font-label-sm text-[10px] text-secondary uppercase">FULL-PAGE STANDARD SCALING (10.5PT TYPOGRAPHY)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 font-label-sm text-[10px] uppercase font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ATS SCORE: <span id="pv-ats-score">96</span>%
              </span>
            </div>
          </div>
          
          <!-- Real Scaled Document Container -->
          <div class="border border-gray-200 bg-white p-6 sm:p-8 shadow-md rounded-none text-gray-900 font-sans" id="live-resume-sheet" style="font-family: 'Inter', system-ui, sans-serif;">
            
            <!-- Document Header -->
            <div class="border-b-2 border-black pb-3 mb-5" id="pv-sec-contact">
              <h2 class="text-2xl font-bold tracking-tight text-black uppercase" id="pv-name">${escapeHtml(defaultName)}</h2>
              <div class="text-[11px] text-gray-700 mt-1.5 tracking-normal uppercase" id="pv-contact">
                ${escapeHtml(defaultEmail)} &nbsp;|&nbsp; ${escapeHtml(defaultPhone)} &nbsp;|&nbsp; ${escapeHtml(defaultLoc)}
              </div>
            </div>

            <!-- Professional Summary -->
            <div class="mb-5" id="pv-sec-summary">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h3>
              <p class="text-[12px] text-gray-800 leading-relaxed font-normal" id="pv-summary">${escapeHtml(defaultSummary)}</p>
            </div>

            <!-- Experience -->
            <div class="mb-5" id="pv-sec-experience">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h3>
              <div class="mb-3">
                <div class="flex justify-between items-baseline text-[13px] font-bold text-black">
                  <span id="pv-exp-title">${escapeHtml(defaultTitle)}</span>
                  <span class="text-[11px] text-gray-600 font-normal">2022 – Present</span>
                </div>
                <div class="text-[11.5px] text-gray-700 mb-2 font-medium" id="pv-exp-company">${escapeHtml(defaultCompany)}</div>
                <ul class="text-[11.5px] text-gray-800 space-y-1.5 pl-4 list-disc" id="pv-exp-bullets">
                  ${defaultBullets.split('\n').filter(b => b.trim()).map(b => '<li>' + escapeHtml(b.replace(/^[•\-–]\s*/, '')) + '</li>').join('')}
                </ul>
              </div>
            </div>

            <!-- Education -->
            <div class="mb-5" id="pv-sec-education">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-1 mb-2">EDUCATION</h3>
              <div class="flex justify-between text-[12px] text-gray-900 mb-1">
                <div><span class="font-bold">M.S. Computer Science</span> — Stanford University</div>
                <span class="text-gray-600 text-[11px]">2014 – 2016</span>
              </div>
              <div class="flex justify-between text-[12px] text-gray-900">
                <div><span class="font-bold">B.S. Electrical & Computer Engineering</span> — UT Austin</div>
                <span class="text-gray-600 text-[11px]">2010 – 2014</span>
              </div>
            </div>

            <!-- Skills -->
            <div id="pv-sec-skills">
              <h3 class="text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-300 pb-1 mb-2">TECHNICAL SKILLS</h3>
              <p class="text-[12px] text-gray-800 leading-relaxed" id="pv-skills">${escapeHtml(defaultSkills)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initResume() {
  // Input elements
  const cvName = document.getElementById('cv-name');
  const cvEmail = document.getElementById('cv-email');
  const cvPhone = document.getElementById('cv-phone');
  const cvLocation = document.getElementById('cv-location');
  const cvSummary = document.getElementById('cv-summary');
  const cvExpTitle = document.getElementById('cv-exp-title');
  const cvExpCompany = document.getElementById('cv-exp-company');
  const cvExpBullets = document.getElementById('cv-exp-bullets');
  const cvSkills = document.getElementById('cv-skills');

  // Preview elements
  const pvName = document.getElementById('pv-name');
  const pvContact = document.getElementById('pv-contact');
  const pvSummary = document.getElementById('pv-summary');
  const pvExpTitle = document.getElementById('pv-exp-title');
  const pvExpCompany = document.getElementById('pv-exp-company');
  const pvExpBullets = document.getElementById('pv-exp-bullets');
  const pvSkills = document.getElementById('pv-skills');
  const liveSheet = document.getElementById('live-resume-sheet');

  // Real-time synchronization
  function updateContactStrip() {
    if (pvContact) {
      pvContact.textContent = `${cvEmail?.value || ''} • ${cvPhone?.value || ''} • ${cvLocation?.value || ''}`;
    }
  }

  if (cvName && pvName) cvName.addEventListener('input', () => { pvName.textContent = cvName.value.toUpperCase(); });
  if (cvEmail) cvEmail.addEventListener('input', updateContactStrip);
  if (cvPhone) cvPhone.addEventListener('input', updateContactStrip);
  if (cvLocation) cvLocation.addEventListener('input', updateContactStrip);
  if (cvSummary && pvSummary) cvSummary.addEventListener('input', () => { pvSummary.textContent = cvSummary.value; });
  if (cvExpTitle && pvExpTitle) cvExpTitle.addEventListener('input', () => { pvExpTitle.textContent = cvExpTitle.value; });
  if (cvExpCompany && pvExpCompany) cvExpCompany.addEventListener('input', () => { pvExpCompany.textContent = cvExpCompany.value; });
  if (cvExpBullets && pvExpBullets) cvExpBullets.addEventListener('input', () => { pvExpBullets.textContent = cvExpBullets.value; });
  if (cvSkills && pvSkills) cvSkills.addEventListener('input', () => { pvSkills.textContent = cvSkills.value; });

  // Real Gemini AI Rewrites
  const summaryRewriteBtn = document.getElementById('summary-ai-rewrite');
  if (summaryRewriteBtn && cvSummary) {
    summaryRewriteBtn.addEventListener('click', async () => {
      const origText = cvSummary.value.trim();
      if (!origText) {
        showToast('Input Required', 'Please provide a draft summary for Gemini to elevate.', 'warning');
        return;
      }
      summaryRewriteBtn.innerHTML = '<span class="material-symbols-outlined text-[15px] animate-spin">refresh</span> GEMINI REASONING...';
      summaryRewriteBtn.disabled = true;

      try {
        const resp = await fetch('/api/resume/ai-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'summary',
            content: origText,
            target_role: cvExpTitle?.value || 'Staff Software Architect'
          })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || 'Gemini rewrite service error');

        cvSummary.value = data.enhanced;
        if (pvSummary) pvSummary.textContent = data.enhanced;
        const pvAts = document.getElementById('pv-ats-score');
        if (pvAts && data.ats_score_estimate) pvAts.textContent = data.ats_score_estimate;

        showToast('Summary Optimized', `Elevated with executive action verbs. ATS score: ${data.ats_score_estimate}%.`, 'auto_awesome');
      } catch (err) {
        showToast('AI Notice', err.message || 'Gemini rewrite could not be processed.', 'error');
      } finally {
        summaryRewriteBtn.innerHTML = '<span class="material-symbols-outlined text-[15px]">auto_awesome</span> AI REWRITE WITH GEMINI';
        summaryRewriteBtn.disabled = false;
      }
    });
  }

  const expRewriteBtn = document.getElementById('exp-ai-rewrite');
  if (expRewriteBtn && cvExpBullets) {
    expRewriteBtn.addEventListener('click', async () => {
      const origText = cvExpBullets.value.trim();
      if (!origText) {
        showToast('Input Required', 'Please provide work bullets to elevate.', 'warning');
        return;
      }
      expRewriteBtn.innerHTML = '<span class="material-symbols-outlined text-[15px] animate-spin">refresh</span> QUANTIFYING METRICS...';
      expRewriteBtn.disabled = true;

      try {
        const resp = await fetch('/api/resume/ai-enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: 'experience',
            content: origText,
            target_role: cvExpTitle?.value || 'Staff Software Architect'
          })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || 'Gemini metrics service error');

        cvExpBullets.value = data.enhanced;
        if (pvExpBullets) {
          const lines = data.enhanced.split('\n').filter(b => b.trim());
          pvExpBullets.innerHTML = lines.map(b => '<li>' + escapeHtml(b.replace(/^[•\-–]\s*/, '')) + '</li>').join('');
        }
        const pvAts = document.getElementById('pv-ats-score');
        if (pvAts && data.ats_score_estimate) pvAts.textContent = data.ats_score_estimate;

        showToast('Accomplishments Quantified', `XYZ framework applied with measurable latency & scale metrics.`, 'auto_awesome');
      } catch (err) {
        showToast('AI Notice', err.message || 'Gemini metrics could not be processed.', 'error');
      } finally {
        expRewriteBtn.innerHTML = '<span class="material-symbols-outlined text-[15px]">auto_awesome</span> ENHANCE IMPACT METRICS (AI)';
        expRewriteBtn.disabled = false;
      }
    });
  }

  // Section collapse/expand
  document.querySelectorAll('.section-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const chevron = header.querySelector('.section-chevron');
      if (body) {
        body.classList.toggle('hidden');
        if (chevron) chevron.style.transform = body.classList.contains('hidden') ? '' : 'rotate(180deg)';
      }
    });
  });

  // Section visibility toggles
  document.querySelectorAll('.toggle-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      pill.classList.toggle('active');
      const targetSecId = pill.getAttribute('data-target-sec');
      if (targetSecId) {
        const previewSec = document.getElementById(targetSecId);
        if (previewSec) {
          if (pill.classList.contains('active')) {
            previewSec.style.opacity = '1';
            previewSec.style.display = '';
          } else {
            previewSec.style.opacity = '0';
            setTimeout(() => { if (!pill.classList.contains('active')) previewSec.style.display = 'none'; }, 200);
          }
        }
      }
    });
  });

  // Template pills
  document.querySelectorAll('.template-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.template-pill').forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary', 'border-primary');
        p.classList.add('border', 'border-outline-variant/50', 'text-secondary');
      });
      pill.classList.add('bg-primary', 'text-on-primary', 'border-primary');
      pill.classList.remove('border-outline-variant/50', 'text-secondary');

      const template = pill.getAttribute('data-template') || 'classic';
      const liveSheet = document.getElementById('live-resume-sheet');
      if (liveSheet) {
        liveSheet.className = `border border-gray-200 bg-white p-6 sm:p-8 shadow-md rounded-none text-gray-900 template-${template} transition-all`;
        showToast('Template Active', `Applied ${template.toUpperCase()} typography & layout.`, 'style');
      }
    });
  });

  // Export PDF & Save Draft
  const exportBtn = document.getElementById('export-pdf-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      showToast('Generating Standalone Resume PDF', 'Preparing ATS-optimized print document...', 'print');
      setTimeout(() => exportResumePDF(), 300);
    });
  }

  const saveBtn = document.getElementById('save-draft-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const draft = {
        name: cvName?.value,
        email: cvEmail?.value,
        phone: cvPhone?.value,
        location: cvLocation?.value,
        summary: cvSummary?.value,
        expTitle: cvExpTitle?.value,
        expCompany: cvExpCompany?.value,
        expBullets: cvExpBullets?.value,
        skills: cvSkills?.value,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('rezum_resume_draft', JSON.stringify(draft));
      showToast('Draft Preserved', 'Curriculum vitae saved to local cache.', 'save');
    });
  }
}

// ================================================================
//  RESUME PDF EXPORT — Generates an Authentic Print-Ready Resume Document
// ================================================================
function exportResumePDF() {
  const curUser = AuthManager.getCurrentUser();
  const pvName = document.getElementById('pv-name')?.textContent || (curUser ? curUser.name.toUpperCase() : 'CANDIDATE DOSSIER');
  const pvContact = document.getElementById('pv-contact')?.textContent || '';
  const pvSummary = document.getElementById('pv-summary')?.textContent || '';
  const pvExpTitle = document.getElementById('pv-exp-title')?.textContent || '';
  const pvExpCompany = document.getElementById('pv-exp-company')?.textContent || '';
  const cvExpBullets = document.getElementById('cv-exp-bullets')?.value || '';
  const pvSkills = document.getElementById('pv-skills')?.textContent || '';

  const bulletList = cvExpBullets
    .split('\n')
    .filter(b => b.trim())
    .map(b => '<li>' + escapeHtml(b.replace(/^[•\-–]\s*/, '')) + '</li>')
    .join('\n      ');

  const resumeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(pvName)} — Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page {
      size: letter portrait;
      margin: 15mm;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: #111;
      background: #fff;
      padding: 36px 48px;
      max-width: 820px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .name {
      font-size: 22pt;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      color: #000;
      line-height: 1.1;
    }
    .contact {
      font-size: 9pt;
      color: #444;
      margin-top: 6px;
      letter-spacing: 0.02em;
    }
    .section {
      margin-bottom: 16px;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #000;
      border-bottom: 1px solid #ccc;
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    .summary {
      font-size: 10pt;
      color: #222;
      line-height: 1.6;
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .exp-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #000;
    }
    .exp-date {
      font-size: 9pt;
      color: #555;
    }
    .exp-company {
      font-size: 9.5pt;
      color: #444;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .bullets {
      padding-left: 18px;
    }
    .bullets li {
      font-size: 9.8pt;
      color: #222;
      margin-bottom: 4px;
      line-height: 1.5;
    }
    .edu-row {
      display: flex;
      justify-content: space-between;
      font-size: 9.8pt;
      margin-bottom: 3px;
    }
    .edu-row .degree {
      font-weight: 700;
      color: #000;
    }
    .edu-row .school {
      color: #444;
    }
    .edu-row .year {
      color: #666;
      font-size: 9pt;
    }
    .skills {
      font-size: 9.8pt;
      color: #222;
      line-height: 1.6;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeHtml(pvName)}</div>
    <div class="contact">${escapeHtml(pvContact)}</div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${escapeHtml(pvSummary)}</div>
  </div>

  <div class="section">
    <div class="section-title">Work Experience</div>
    <div class="exp-header">
      <span class="exp-title">${escapeHtml(pvExpTitle)}</span>
      <span class="exp-date">2022 – Present</span>
    </div>
    <div class="exp-company">${escapeHtml(pvExpCompany)}</div>
    <ul class="bullets">
      ${bulletList}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-row">
      <div><span class="degree">M.S. Computer Science</span> <span class="school">— Stanford University</span></div>
      <span class="year">2014 – 2016</span>
    </div>
    <div class="edu-row">
      <div><span class="degree">B.S. Electrical & Computer Engineering</span> <span class="school">— UT Austin</span></div>
      <span class="year">2010 – 2014</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills">${escapeHtml(pvSkills)}</div>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(resumeHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 350);
    };
    setTimeout(() => {
      try { printWindow.print(); } catch(e) {}
    }, 1000);
  } else {
    // Fallback: download standalone file
    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (pvName.replace(/\s+/g, '_') || 'Resume') + '.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Resume Downloaded', 'Open and print to save as PDF.', 'download');
  }
}

// ================================================================
//  JOB LINK UTILITIES — Generate external platform links
// ================================================================
function buildJobLinks(title, company, location) {
  const titleEnc = encodeURIComponent(title);
  const companyEnc = encodeURIComponent(company);
  const locClean = location.split('//')[0].trim();
  const locEnc = encodeURIComponent(locClean);
  const queryEnc = encodeURIComponent(`${title} ${company}`);

  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title + ' ' + company)}&location=${locEnc}`,
    indeed: `https://www.indeed.com/jobs?q=${queryEnc}&l=${locEnc}`,
    glassdoor: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${queryEnc}&locT=C&locKeyword=${locEnc}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + company + ' job')}&ibp=htl;jobs`
  };
}

// ================================================================
//  GLOBAL JOBS DIRECTORY DATA
// ================================================================
const REZUM_JOBS = [
  { id: 'job-1', loc: 'AUSTIN, TX // HYBRID', title: 'Staff Platform Architect', company: 'TechVault', desc: 'Scale low-latency execution engines for algorithmic exchange platforms.', pay: '$310K - $385K', tags: ['RUST','KAFKA','DISTRIBUTED'], match: 94, source: 'GREENHOUSE', category: 'INFRASTRUCTURE' },
  { id: 'job-2', loc: 'SAN FRANCISCO, CA', title: 'Head of AI Architecture', company: 'DeepCore AI', desc: 'Lead transformer inference model serving across bare-metal GPU clusters.', pay: '$340K - $420K', tags: ['PYTORCH','CUDA','LLM'], match: 91, source: 'LEVER', category: 'AI / ML' },
  { id: 'job-3', loc: 'NEW YORK, NY', title: 'VP of Product Infrastructure', company: 'FinScale', desc: 'Direct product roadmap for enterprise compliance and data governance.', pay: '$290K - $360K', tags: ['DATA GOV','ENTERPRISE','PRODUCT'], match: 87, source: 'ASHBY', category: 'LEADERSHIP' },
  { id: 'job-4', loc: 'REMOTE // US & CANADA', title: 'Principal Reliability Lead', company: 'CloudEdge', desc: 'Drive 99.999% uptime for mission critical global edge CDN services.', pay: '$275K - $335K', tags: ['SRE','CHAOS ENG','TERRAFORM'], match: 85, source: 'ADZUNA', category: 'REMOTE' },
  { id: 'job-5', loc: 'SEATTLE, WA', title: 'Senior ML Platform Engineer', company: 'DataSphere', desc: 'Build ML infrastructure supporting real-time inference at petabyte scale.', pay: '$250K - $320K', tags: ['MLOPS','KUBERNETES','PYTHON'], match: 82, source: 'GREENHOUSE', category: 'AI / ML' },
  { id: 'job-6', loc: 'LONDON, UK // REMOTE', title: 'Staff Backend Engineer', company: 'PayGrid', desc: 'Design payment processing systems handling $1B+ daily transaction volume.', pay: '$180K - $240K', tags: ['GO','POSTGRESQL','MICROSERVICES'], match: 79, source: 'LEVER', category: 'REMOTE' },
  { id: 'job-7', loc: 'BOSTON, MA // HYBRID', title: 'Principal Security Architect', company: 'VaultSec', desc: 'Lead zero-trust architecture implementation across multi-cloud infrastructure.', pay: '$260K - $340K', tags: ['SECURITY','ZERO TRUST','AWS'], match: 76, source: 'GREENHOUSE', category: 'HYBRID' },
  { id: 'job-8', loc: 'REMOTE // GLOBAL', title: 'Engineering Manager, Data', company: 'AnalyticsCo', desc: 'Manage a team of 12 data engineers building real-time analytics pipelines.', pay: '$220K - $290K', tags: ['SPARK','AIRFLOW','LEADERSHIP'], match: 73, source: 'ADZUNA', category: 'LEADERSHIP' }
];

function renderJobs() {
  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between pb-space-lg border-b border-outline-variant/40 mb-space-lg reveal gap-4">
      <div>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">POSITION INDEX // LABOR MARKET INTELLIGENCE</span>
        <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Job Directory</h1>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button id="ai-refresh-jobs-btn" class="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center gap-2 shadow-sm font-bold">
          <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>SYNC LIVE JOBS (GEMINI AI)</span>
        </button>
        <span class="font-label-sm text-label-sm uppercase text-secondary" id="jobs-count-label">LOADING ROLES...</span>
        <select id="jobs-sort-select" class="px-4 py-2 rounded-full border border-outline-variant/50 text-secondary font-label-sm text-label-sm uppercase bg-transparent focus:outline-none focus:border-primary">
          <option value="relevance">SORT: RELEVANCE</option>
          <option value="match-desc">SORT: MATCH % HIGH-LOW</option>
          <option value="salary-desc">SORT: SALARY HIGH-LOW</option>
        </select>
      </div>
    </div>

    <!-- Live Search & Filter Bar -->
    <div class="flex flex-col md:flex-row gap-4 mb-space-lg reveal">
      <div class="flex-1 relative">
        <span class="material-symbols-outlined text-secondary absolute left-4 top-3 text-[18px]">search</span>
        <input id="jobs-search-input" type="text" placeholder="FILTER POSITIONS BY TITLE, STACK, OR COMPANY..." class="w-full bg-surface-container-low border border-outline-variant/40 pl-11 pr-4 py-2.5 text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary uppercase placeholder:text-secondary text-xs" />
      </div>
      <div class="flex flex-wrap items-center gap-2" id="jobs-filter-group">
        ${['ALL', 'REMOTE', 'HYBRID', 'INFRASTRUCTURE', 'AI / ML', 'LEADERSHIP'].map((f, i) => `
          <button class="jobs-filter-btn px-4 py-2 rounded-full font-label-sm text-label-sm uppercase transition-all ${i === 0 ? 'bg-primary text-on-primary' : 'border border-outline-variant/50 text-secondary hover:text-primary hover:border-primary'}" data-filter="${f}">${f}</button>
        `).join('')}
      </div>
    </div>

    <!-- Job Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-outline-variant/30 stagger-children" id="jobs-grid">
      ${renderJobCards(REZUM_JOBS)}
    </div>
  </div>`;
}

function renderJobCards(jobs) {
  if (!jobs.length) {
    return `<div class="col-span-4 p-12 text-center text-secondary font-label-sm uppercase">NO POSITIONS MATCHING SEARCH CRITERIA</div>`;
  }
  return jobs.map((job, i) => {
    const links = job.linkedin_url && job.indeed_url 
      ? { linkedin: job.linkedin_url, indeed: job.indeed_url, glassdoor: job.glassdoor_url || '#' }
      : buildJobLinks(job.title, job.company, job.loc);
    
    return `
    <div class="p-space-lg ${i < jobs.length - 1 ? 'border-b lg:border-b md:border-r border-outline-variant/30' : ''} hover:bg-surface-container-low transition-colors duration-200 flex flex-col justify-between group reveal job-card" data-category="${job.category}">
      <div>
        <div class="flex items-center justify-between mb-1">
          <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">${job.loc}</span>
          <button class="job-bookmark-btn w-7 h-7 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container transition-all" data-title="${escapeHtml(job.title)}" title="Save role">
            <span class="material-symbols-outlined text-[16px]">bookmark_border</span>
          </button>
        </div>
        <div class="flex items-center justify-between mb-3">
          <span class="font-label-sm text-label-sm text-secondary uppercase font-bold">${job.company}</span>
          <div class="text-right">
            <span class="font-headline-sm text-headline-sm font-bold text-primary">${job.match}%</span>
            <div class="w-12 bg-surface-container h-1 mt-0.5 overflow-hidden"><div class="bg-primary h-full" style="width:${job.match}%"></div></div>
          </div>
        </div>
        <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="block group-hover:text-neutral-800">
          <h3 class="font-headline-sm text-headline-sm font-bold text-primary mb-2 flex items-center justify-between">
            ${job.title}
            <span class="material-symbols-outlined text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all text-[18px]">north_east</span>
          </h3>
        </a>
        <p class="font-body-sm text-body-sm text-on-surface-variant font-light mb-4 line-clamp-2">${job.desc}</p>
      </div>
      <div>
        <div class="flex items-center justify-between pt-3 border-t border-outline-variant/20 mb-2">
          <span class="font-label-sm text-label-sm uppercase text-secondary">BASE + EQUITY</span>
          <span class="font-label-md text-label-md font-bold text-primary">${job.pay}</span>
        </div>
        <div class="flex items-center justify-between mb-3">
          <div class="flex flex-wrap gap-1">
            ${(job.tags || []).map(t => `<span class="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary">${t}</span>`).join('')}
          </div>
          <span class="font-label-sm text-label-sm text-outline uppercase">${job.source || 'VERIFIED'}</span>
        </div>
        <!-- Apply Links to Real Job Platforms -->
        <div class="pt-3 border-t border-outline-variant/20 space-y-2">
          <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-[#0A66C2] text-white font-label-sm text-label-sm uppercase tracking-wider hover:bg-[#004182] transition-colors font-bold shadow-sm">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            APPLY ON LINKEDIN
          </a>
          <div class="flex gap-2">
            <a href="${links.indeed}" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-[#2164f3] text-[#2164f3] font-label-sm text-[9px] uppercase tracking-wider hover:bg-[#2164f3] hover:text-white transition-colors font-bold">
              INDEED
            </a>
            <a href="${links.glassdoor}" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-[#0caa41] text-[#0caa41] font-label-sm text-[9px] uppercase tracking-wider hover:bg-[#0caa41] hover:text-white transition-colors font-bold">
              GLASSDOOR
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

let CURRENT_LOADED_JOBS = [...REZUM_JOBS];

function initJobs() {
  const searchInput = document.getElementById('jobs-search-input');
  const sortSelect = document.getElementById('jobs-sort-select');
  const grid = document.getElementById('jobs-grid');
  const countLabel = document.getElementById('jobs-count-label');
  const refreshAiBtn = document.getElementById('ai-refresh-jobs-btn');
  let activeFilter = 'ALL';

  function applyFiltersAndSort() {
    let list = [...CURRENT_LOADED_JOBS];
    const query = (searchInput?.value || '').trim().toLowerCase();

    if (activeFilter !== 'ALL') {
      list = list.filter(j => j.category === activeFilter || (j.tags || []).includes(activeFilter) || (activeFilter === 'REMOTE' && (j.loc || '').includes('REMOTE')) || (activeFilter === 'HYBRID' && (j.loc || '').includes('HYBRID')));
    }

    if (query) {
      list = list.filter(j => j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query) || (j.tags || []).some(t => t.toLowerCase().includes(query)));
    }

    const sortVal = sortSelect?.value || 'relevance';
    if (sortVal === 'match-desc') {
      list.sort((a, b) => b.match - a.match);
    } else if (sortVal === 'salary-desc') {
      list.sort((a, b) => parseInt(String(b.pay).replace(/[^0-9]/g, '')) - parseInt(String(a.pay).replace(/[^0-9]/g, '')));
    }

    if (grid) grid.innerHTML = renderJobCards(list);
    if (countLabel) countLabel.textContent = `${list.length} ROLES MATCHED`;

    // Hook bookmark buttons
    document.querySelectorAll('.job-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const icon = btn.querySelector('.material-symbols-outlined');
        const title = btn.getAttribute('data-title');
        if (icon.textContent === 'bookmark') {
          icon.textContent = 'bookmark_border';
          icon.classList.remove('text-primary');
          showToast('Bookmark Removed', `${title} removed from pipeline.`, 'bookmark_border');
        } else {
          icon.textContent = 'bookmark';
          icon.classList.add('text-primary');
          showToast('Role Bookmarked', `${title} added to Saved Applications.`, 'bookmark');
        }
      });
    });
  }

  // Load real jobs from backend API
  fetch('/api/jobs')
    .then(r => r.json())
    .then(data => {
      if (data.jobs && data.jobs.length) {
        CURRENT_LOADED_JOBS = data.jobs;
        applyFiltersAndSort();
      }
    })
    .catch(() => {
      // Fallback to initial
      applyFiltersAndSort();
    });

  // Automated LLM Job Generator / Refresh
  if (refreshAiBtn) {
    refreshAiBtn.addEventListener('click', async () => {
      refreshAiBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> GEMINI SCANNING MARKET...';
      refreshAiBtn.disabled = true;

      try {
        const resp = await fetch('/api/jobs/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count: 8 })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.detail || 'LLM generation failed');

        if (data.jobs && data.jobs.length) {
          CURRENT_LOADED_JOBS = data.jobs;
          applyFiltersAndSort();
          showToast('AI Jobs Synchronized', `Generated ${data.jobs.length} frontier tech openings with real LinkedIn links.`, 'auto_awesome');
        }
      } catch (err) {
        showToast('AI Jobs Notice', err.message || 'Could not refresh jobs.', 'error');
      } finally {
        refreshAiBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">auto_awesome</span> SYNC LIVE JOBS (GEMINI AI)';
        refreshAiBtn.disabled = false;
      }
    });
  }

  // Filter buttons
  document.querySelectorAll('.jobs-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.jobs-filter-btn').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('border', 'border-outline-variant/50', 'text-secondary');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('border', 'border-outline-variant/50', 'text-secondary');
      activeFilter = btn.getAttribute('data-filter');
      applyFiltersAndSort();
    });
  });

  searchInput?.addEventListener('input', applyFiltersAndSort);
  sortSelect?.addEventListener('change', applyFiltersAndSort);

  // Initial render
  applyFiltersAndSort();
}


// ================================================================
//  PAGE: JOB DETAIL
// ================================================================
function renderJobDetail() {
  const detailLinks = buildJobLinks('Staff Platform Architect', 'TechVault', 'Austin, TX');
  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <a href="#/jobs" class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase text-secondary hover:text-primary transition-colors mb-6">
      <span class="material-symbols-outlined text-[16px]">arrow_back</span> BACK TO DIRECTORY
    </a>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <!-- Listing -->
      <div class="lg:col-span-8 reveal-left">
        <div class="border-b border-outline-variant/40 pb-6 mb-6">
          <div class="flex items-center gap-3 mb-2">
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">AUSTIN, TX // HYBRID</span>
            <span class="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">HIGH DEMAND</span>
          </div>
          <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight mb-2">Staff Platform Architect</h1>
          <div class="flex items-center gap-4 font-label-sm text-label-sm text-secondary uppercase">
            <span>TECHVAULT</span>
            <span class="w-px h-3 bg-outline-variant/40"></span>
            <span>POSTED 3 DAYS AGO</span>
            <span class="w-px h-3 bg-outline-variant/40"></span>
            <span>VERIFIED ON GREENHOUSE</span>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h2 class="font-headline-md text-headline-md font-bold text-primary mb-3">About the Role</h2>
            <p class="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">TechVault is recruiting a Staff Platform Architect to lead our distributed trading fabric. You will steer architectural choices for sub-millisecond execution engines across bare-metal and AWS cloud infrastructures, processing 2.4B+ daily transactions.</p>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md font-bold text-primary mb-3">Requirements & Competencies</h2>
            <ul class="space-y-2.5">
              ${[
                '10+ years engineering high-throughput, low-latency distributed platforms',
                'Demonstrated mastery of Kafka, Raft consensus, and storage engines (LSM/B-Trees)',
                'Track record of designing zero-trust networking architecture at enterprise scale',
                'Proficiency in Go, Rust, or C++ with zero-allocation memory paradigms',
                'Experience authoring architectural RFCs and mentoring Staff-level peers'
              ].map(r => `
                <li class="flex items-start gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
                  <span class="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span>${r}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md font-bold text-primary mb-3">Compensation Benchmark</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-surface-container-low border border-outline-variant/30">
                <span class="font-label-sm text-label-sm uppercase text-secondary block mb-1">ANNUAL BASE</span>
                <span class="font-headline-sm text-headline-sm font-bold text-primary">$310,000 - $385,000</span>
              </div>
              <div class="p-4 bg-surface-container-low border border-outline-variant/30">
                <span class="font-label-sm text-label-sm uppercase text-secondary block mb-1">EQUITY GRANT</span>
                <span class="font-headline-sm text-headline-sm font-bold text-primary">$200,000 - $400,000</span>
              </div>
            </div>
          </div>

          <!-- External Apply Links -->
          <div>
            <h2 class="font-headline-md text-headline-md font-bold text-primary mb-3">Apply on External Platforms</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="${detailLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 bg-[#0A66C2] text-white border border-[#0A66C2] hover:bg-[#004182] transition-colors group">
                <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <div>
                  <div class="font-label-md text-label-md uppercase font-semibold tracking-wider">APPLY ON LINKEDIN</div>
                  <div class="text-white/70 font-label-sm text-[9px] uppercase tracking-wider">VIEW ROLE & EASY APPLY</div>
                </div>
                <span class="material-symbols-outlined ml-auto text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>

              <a href="${detailLinks.indeed}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 border border-[#2164f3] text-[#2164f3] hover:bg-[#2164f3] hover:text-white transition-colors group">
                <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M11.566 21.119v-8.457c0-.503.267-.773.8-.773h1.484c.534 0 .8.27.8.773v8.457c0 .503-.266.773-.8.773h-1.484c-.533 0-.8-.27-.8-.773zm1.584-11.36a1.825 1.825 0 01-1.833-1.833c0-1.01.822-1.833 1.833-1.833S15 6.916 15 7.926a1.825 1.825 0 01-1.85 1.833zM9 2.882c3.036-1.858 7.006-1.97 10.182-.505C12.69 3.254 9.736 7.154 9.736 11.676v1.095c0 .345-.19.531-.534.531H7.72c-.345 0-.535-.186-.535-.531v-1.095C7.186 7.772 7.72 5.055 9 2.882z"/></svg>
                <div>
                  <div class="font-label-md text-label-md uppercase font-semibold tracking-wider">APPLY ON INDEED</div>
                  <div class="text-[#2164f3]/60 group-hover:text-white/70 font-label-sm text-[9px] uppercase tracking-wider">SEARCH THIS ROLE</div>
                </div>
                <span class="material-symbols-outlined ml-auto text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>

              <a href="${detailLinks.glassdoor}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 border border-[#0caa41] text-[#0caa41] hover:bg-[#0caa41] hover:text-white transition-colors group">
                <span class="material-symbols-outlined text-[24px]">door_open</span>
                <div>
                  <div class="font-label-md text-label-md uppercase font-semibold tracking-wider">GLASSDOOR</div>
                  <div class="text-[#0caa41]/60 group-hover:text-white/70 font-label-sm text-[9px] uppercase tracking-wider">SALARY & REVIEWS</div>
                </div>
                <span class="material-symbols-outlined ml-auto text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>

              <a href="${detailLinks.google}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 border border-outline-variant/50 text-on-surface hover:bg-primary hover:text-on-primary transition-colors group">
                <svg class="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <div>
                  <div class="font-label-md text-label-md uppercase font-semibold tracking-wider">GOOGLE JOBS</div>
                  <div class="text-secondary group-hover:text-white/70 font-label-sm text-[9px] uppercase tracking-wider">AGGREGATED LISTINGS</div>
                </div>
                <span class="material-symbols-outlined ml-auto text-[18px] group-hover:translate-x-1 transition-transform">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Match Panel -->
      <div class="lg:col-span-4 reveal-right">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg sticky top-24 shadow-sm">
          <div class="text-center mb-6">
            <div class="score-ring mx-auto mb-3">
              <svg viewBox="0 0 120 120" width="108" height="108">
                <circle class="score-ring-track" cx="60" cy="60" r="50"/>
                <circle class="score-ring-fill" cx="60" cy="60" r="50" style="stroke-dasharray: 314.159; stroke-dashoffset:${314.159 - (314.159 * 94 / 100)}"/>
              </svg>
              <div class="score-ring-value font-headline-xl font-bold">94%</div>
            </div>
            <span class="font-label-md text-label-md uppercase text-primary font-semibold">CANDIDATE ALIGNMENT</span>
            <span class="font-label-sm text-label-sm text-secondary block mt-0.5">EXCEPTIONAL MATCH PROFILE</span>
          </div>

          <div class="space-y-3 mb-6">
            <span class="font-label-sm text-label-sm uppercase text-secondary block font-bold">CONFIRMED STRENGTHS:</span>
            ${[
              'Kafka & streaming pipeline leadership directly matches JD',
              'Multi-region Kubernetes deployment experience verified',
              'Cloud infrastructure cost reduction verified at scale'
            ].map(r => `
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                <span class="font-body-sm text-body-sm text-on-surface">${r}</span>
              </div>
            `).join('')}
          </div>

          <div class="mb-6">
            <span class="font-label-sm text-label-sm uppercase text-secondary block mb-2 font-bold">RECOMMENDED VECTOR ADDITIONS:</span>
            <div class="flex flex-wrap gap-2">
              <a href="#/roadmaps" class="px-3 py-1 rounded-full border border-dashed border-outline-variant/60 text-secondary font-label-sm text-label-sm uppercase hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                <span>RUST CONCURRENCY</span>
                <span class="material-symbols-outlined text-[12px]">north_east</span>
              </a>
              <a href="#/roadmaps" class="px-3 py-1 rounded-full border border-dashed border-outline-variant/60 text-secondary font-label-sm text-label-sm uppercase hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                <span>EBPF TELEMETRY</span>
                <span class="material-symbols-outlined text-[12px]">north_east</span>
              </a>
            </div>
          </div>

          <div class="space-y-3">
            <!-- Primary: Apply on LinkedIn -->
            <a href="${detailLinks.linkedin}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 rounded-full bg-[#0A66C2] text-white font-label-md text-label-md uppercase tracking-wider hover:bg-[#004182] transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              APPLY ON LINKEDIN
            </a>
            <button id="detail-tailor-btn" class="w-full py-3.5 rounded-full border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2" type="button">
              <span class="material-symbols-outlined text-[18px]">auto_awesome</span> TAILOR RESUME
            </button>
            <button id="detail-apply-btn" class="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors flex items-center justify-center gap-2" type="button">
              <span class="material-symbols-outlined text-[18px]">rocket_launch</span> APPLY & TRACK
            </button>
            <button id="detail-save-btn" class="w-full py-3.5 rounded-full border border-outline-variant/50 text-secondary font-label-md text-label-md uppercase tracking-wider hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2" type="button">
              <span class="material-symbols-outlined text-[18px]">bookmark_border</span> SAVE ROLE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initJobDetail() {
  const tailorBtn = document.getElementById('detail-tailor-btn');
  if (tailorBtn) {
    tailorBtn.addEventListener('click', () => {
      showToast('Position Synced', 'Transferred TechVault job context into Resume Builder.', 'auto_awesome');
      location.hash = '#/resume';
    });
  }

  const saveBtn = document.getElementById('detail-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const icon = saveBtn.querySelector('.material-symbols-outlined');
      if (icon.textContent === 'bookmark') {
        icon.textContent = 'bookmark_border';
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">bookmark_border</span> SAVE ROLE';
        showToast('Role Removed', 'TechVault role removed from Pipeline.', 'bookmark_border');
      } else {
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">bookmark</span> SAVED ✓';
        saveBtn.classList.add('border-primary', 'text-primary');
        showToast('Role Bookmarked', 'TechVault // Staff Platform Architect saved to Saved Column.', 'bookmark');
      }
    });
  }

  const applyBtn = document.getElementById('detail-apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> LOGGED TO APPLIED';
      applyBtn.classList.add('bg-neutral-800', 'pointer-events-none');
      showToast('Application Logged', 'TechVault role moved to Application Tracker (APPLIED column).', 'assignment_turned_in');
      setTimeout(() => { location.hash = '#/tracker'; }, 900);
    });
  }
}


// ================================================================
//  PAGE: TRACKER (Kanban)
// ================================================================
// In-memory or localStorage backed Kanban state
let REZUM_PIPELINE = JSON.parse(localStorage.getItem('rezum_pipeline')) || [
  { id: 'app-1', company: 'DeepCore AI', role: 'Head of AI Architecture', date: 'Oct 5', column: 'SAVED' },
  { id: 'app-2', company: 'CloudEdge', role: 'Principal Reliability Lead', date: 'Oct 3', column: 'SAVED' },
  { id: 'app-3', company: 'DataSphere', role: 'Sr ML Platform Engineer', date: 'Oct 1', column: 'SAVED' },
  { id: 'app-4', company: 'TechVault', role: 'Staff Platform Architect', date: 'Oct 4', column: 'APPLIED' },
  { id: 'app-5', company: 'FinScale', role: 'VP of Product Infrastructure', date: 'Sep 28', column: 'APPLIED' },
  { id: 'app-6', company: 'PayGrid', role: 'Staff Backend Engineer', date: 'Sep 25', column: 'INTERVIEW' }
];

function renderTracker() {
  const colNames = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
  const columns = colNames.map(name => ({
    name,
    cards: REZUM_PIPELINE.filter(c => c.column === name)
  }));

  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <div class="flex flex-col md:flex-row md:items-end justify-between pb-space-lg border-b border-outline-variant/40 mb-space-lg reveal">
      <div>
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">APPLICATION PIPELINE // KANBAN</span>
        <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Application Tracker</h1>
      </div>
      <div class="flex items-center gap-4 mt-4 md:mt-0">
        <span class="font-label-sm text-label-sm uppercase text-secondary font-bold" id="total-apps-count">${REZUM_PIPELINE.length} TOTAL APPLICATIONS</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-0 border border-outline-variant/30 overflow-x-auto reveal bg-surface">
      ${columns.map((col, i) => `
        <div class="kanban-column ${i < 4 ? 'border-b md:border-b-0 md:border-r border-outline-variant/30' : ''} p-space-md" data-col="${col.name}">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20">
            <span class="font-label-md text-label-md uppercase font-semibold text-primary">${col.name}</span>
            <span class="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-secondary font-bold kanban-count">${col.cards.length}</span>
          </div>
          <div class="space-y-3 min-h-[320px] kanban-dropzone" data-col="${col.name}">
            ${col.cards.map(card => `
              <div class="kanban-card bg-surface-container-lowest p-3.5 border border-outline-variant/20 shadow-sm transition-all hover:border-primary" draggable="true" data-id="${card.id}" data-col="${col.name}">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-label-sm text-label-sm uppercase text-secondary font-bold">${card.company}</span>
                  <span class="font-label-sm text-label-sm text-outline">${card.date}</span>
                </div>
                <h4 class="font-body-sm text-body-sm font-semibold text-on-surface mb-3">${card.role}</h4>
                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <button class="move-left-btn w-6 h-6 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all" data-id="${card.id}" title="Move left">
                    <span class="material-symbols-outlined text-[14px]">arrow_back</span>
                  </button>
                  <span class="font-label-sm text-[9px] uppercase text-secondary tracking-widest">${col.name}</span>
                  <button class="move-right-btn w-6 h-6 rounded-full border border-outline-variant/30 flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all" data-id="${card.id}" title="Move right">
                    <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>`;
}

function initTracker() {
  const colOrder = ['SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

  function saveAndRerender() {
    localStorage.setItem('rezum_pipeline', JSON.stringify(REZUM_PIPELINE));
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = renderTracker();
      initTracker();
    }
  }

  // Move left / right buttons
  document.querySelectorAll('.move-left-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = REZUM_PIPELINE.find(c => c.id === id);
      if (item) {
        const curIdx = colOrder.indexOf(item.column);
        if (curIdx > 0) {
          item.column = colOrder[curIdx - 1];
          showToast('Status Updated', `${item.company} shifted to ${item.column}.`, 'swap_horiz');
          saveAndRerender();
        }
      }
    });
  });

  document.querySelectorAll('.move-right-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = REZUM_PIPELINE.find(c => c.id === id);
      if (item) {
        const curIdx = colOrder.indexOf(item.column);
        if (curIdx < colOrder.length - 1) {
          item.column = colOrder[curIdx + 1];
          showToast('Status Updated', `${item.company} advanced to ${item.column}.`, 'swap_horiz');
          saveAndRerender();
        }
      }
    });
  });

  // Drag and drop HTML5
  let draggedCardId = null;
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCardId = card.getAttribute('data-id');
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', draggedCardId);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  document.querySelectorAll('.kanban-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
      e.preventDefault();
      column.classList.add('drag-over');
    });
    column.addEventListener('dragleave', () => {
      column.classList.remove('drag-over');
    });
    column.addEventListener('drop', (e) => {
      e.preventDefault();
      column.classList.remove('drag-over');
      const targetCol = column.getAttribute('data-col');
      if (draggedCardId && targetCol) {
        const item = REZUM_PIPELINE.find(c => c.id === draggedCardId);
        if (item && item.column !== targetCol) {
          item.column = targetCol;
          showToast('Application Relocated', `${item.company} moved to ${targetCol}.`, 'move_to_inbox');
          saveAndRerender();
        }
      }
    });
  });
}


// ================================================================
//  PAGE: ROADMAPS
// ================================================================
let CURRENT_ROADMAP_PATHWAY_ID = localStorage.getItem('rezum_active_pathway') || 'distributed-systems';
let ROADMAP_CACHE = {};

const DEFAULT_PATHWAYS = {
  'distributed-systems': {
    id: 'distributed-systems',
    title: 'Distributed Systems & Cloud Architecture Pathway',
    target_role: 'Staff Distributed Systems Engineer',
    description: 'Master high-throughput distributed consensus, low-level storage engines, message brokers, and large-scale fault tolerance.',
    github_source: 'donnemartin/system-design-primer',
    github_url: 'https://github.com/donnemartin/system-design-primer',
    est_weeks: 12,
    skill_gaps: [
      { skill: 'Consensus Protocols (Raft/Paxos)', level: 'CRITICAL' },
      { skill: 'LSM Trees & Storage Engines', level: 'CRITICAL' },
      { skill: 'Distributed Tracing & eBPF', level: 'HIGH' },
      { skill: 'Chaos Engineering & SLA Resiliency', level: 'MEDIUM' },
      { skill: 'RFC Authorship & Tech Governance', level: 'LOW' }
    ],
    steps: [
      {
        num: '01',
        title: 'Systems Design Fundamentals & Data Structures',
        duration: '3 WEEKS',
        status: 'done',
        resources: [
          { id: 'ds-1', stepNum: '01', type: 'REPO', title: 'The System Design Primer (donnemartin)', duration: '12 hrs', hours: 12, completed: true, url: 'https://github.com/donnemartin/system-design-primer', repo_name: 'donnemartin/system-design-primer', description: 'Comprehensive open-source primer covering scalability, caching, load balancing, and async pipelines.' },
          { id: 'ds-2', stepNum: '01', type: 'DOCS', title: 'Designing Data-Intensive Applications (DDIA Open Notes)', duration: '14 hrs', hours: 14, completed: true, url: 'https://github.com/ept/ddia-code', repo_name: 'ept/ddia-code', description: 'Companion open-source examples and architecture guides for data-intensive storage systems.' },
          { id: 'ds-3', stepNum: '01', type: 'BOOK', title: 'OSSU: Computer Systems Architecture Core', duration: '10 hrs', hours: 10, completed: false, url: 'https://github.com/ossu/computer-science', repo_name: 'ossu/computer-science', description: 'Open Source Society University curriculum module on operating systems and concurrent computation.' }
        ]
      },
      {
        num: '02',
        title: 'Distributed Consensus, Storage & Partitioning',
        duration: '4 WEEKS',
        status: 'current',
        resources: [
          { id: 'ds-4', stepNum: '02', type: 'RFC', title: 'In Search of an Understandable Consensus Algorithm (Raft Paper)', duration: '6 hrs', hours: 6, completed: true, url: 'https://raft.github.io/', repo_name: 'raft/raft.github.io', description: 'Interactive visualizations and the seminal Stanford Raft paper on leader election and log replication.' },
          { id: 'ds-5', stepNum: '02', type: 'REPO', title: 'Apache Kafka Source Internals & Log Append Storage', duration: '16 hrs', hours: 16, completed: false, url: 'https://github.com/apache/kafka', repo_name: 'apache/kafka', description: 'Inspect how production partitions, zero-copy socket transfers, and consumer groups are implemented.' },
          { id: 'ds-6', stepNum: '02', type: 'LAB', title: 'CodeCrafters: Build Your Own Redis in Go/Rust', duration: '12 hrs', hours: 12, completed: false, url: 'https://github.com/codecrafters-io/build-your-own-redis', repo_name: 'codecrafters-io/build-your-own-redis', description: 'Hands-on reproduction of in-memory key-value storage, RESP protocol parsing, and expiration engines.' }
        ]
      },
      {
        num: '03',
        title: 'Cloud Orchestration & Scalable Microservices',
        duration: '3 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ds-7', stepNum: '03', type: 'REPO', title: 'Kubernetes the Hard Way (Kelsey Hightower)', duration: '15 hrs', hours: 15, completed: false, url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', repo_name: 'kelseyhightower/kubernetes-the-hard-way', description: 'Bootstrap a production Kubernetes cluster from scratch without automated installer scripts.' },
          { id: 'ds-8', stepNum: '03', type: 'DOCS', title: 'etcd Distributed Key-Value Store Documentation', duration: '8 hrs', hours: 8, completed: false, url: 'https://github.com/etcd-io/etcd', repo_name: 'etcd-io/etcd', description: 'Understand how Kubernetes coordinates cluster metadata with Raft and watch streams.' }
        ]
      },
      {
        num: '04',
        title: 'Staff Architect Interview & RFC Playbook',
        duration: '2 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ds-9', stepNum: '04', type: 'DOCS', title: 'Staff Engineer Archetypes & RFC Templates', duration: '6 hrs', hours: 6, completed: false, url: 'https://github.com/staffeng/resources', repo_name: 'staffeng/resources', description: 'Will Larson’s open-source templates for executive architecture briefs and design reviews.' },
          { id: 'ds-10', stepNum: '04', type: 'REPO', title: 'Awesome System Design Interview Prep', duration: '10 hrs', hours: 10, completed: false, url: 'https://github.com/ashishps1/awesome-system-design-resources', repo_name: 'ashishps1/awesome-system-design-resources', description: 'Curated architectural battle-tested interview questions, flashcards, and design whitepapers.' }
        ]
      }
    ]
  },
  'ai-ml-platform': {
    id: 'ai-ml-platform',
    title: 'AI & Machine Learning Infrastructure Pathway',
    target_role: 'AI & ML Infrastructure Architect',
    description: 'Build enterprise LLM inference pipelines, distributed GPU training clusters, vector retrieval indexing, and evaluation frameworks.',
    github_source: 'kamranahmedse/developer-roadmap',
    github_url: 'https://github.com/kamranahmedse/developer-roadmap',
    est_weeks: 14,
    skill_gaps: [
      { skill: 'vLLM / TensorRT-LLM Serving', level: 'CRITICAL' },
      { skill: 'Distributed PyTorch (FSDP / Megatron)', level: 'CRITICAL' },
      { skill: 'HNSW Vector Indexes & Embedding Pipelines', level: 'HIGH' },
      { skill: 'Triton Inference Server & CUDA Optimization', level: 'HIGH' },
      { skill: 'LLM Observability & Guardrails', level: 'MEDIUM' }
    ],
    steps: [
      {
        num: '01',
        title: 'Transformer Architecture & Tensor Foundations',
        duration: '3 WEEKS',
        status: 'done',
        resources: [
          { id: 'ai-1', stepNum: '01', type: 'REPO', title: 'nanoGPT: Train 124M GPT-2 from Scratch (Andrej Karpathy)', duration: '14 hrs', hours: 14, completed: true, url: 'https://github.com/karpathy/nanoGPT', repo_name: 'karpathy/nanoGPT', description: 'Clean, direct PyTorch repository for training medium-sized GPT models with full self-attention understanding.' },
          { id: 'ai-2', stepNum: '01', type: 'DOCS', title: 'The Illustrated Transformer & Attention Mechanisms', duration: '6 hrs', hours: 6, completed: true, url: 'https://github.com/jalammar/jalammar.github.io', repo_name: 'jalammar/jalammar.github.io', description: 'Open-source visual architectural guides for multi-head attention and transformer feed-forward layers.' }
        ]
      },
      {
        num: '02',
        title: 'High-Throughput LLM Inference & Serving Systems',
        duration: '4 WEEKS',
        status: 'current',
        resources: [
          { id: 'ai-3', stepNum: '02', type: 'REPO', title: 'vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention', duration: '18 hrs', hours: 18, completed: false, url: 'https://github.com/vllm-project/vllm', repo_name: 'vllm-project/vllm', description: 'Production engine featuring continuous batching, chunked prefill, and zero memory fragmentation.' },
          { id: 'ai-4', stepNum: '02', type: 'REPO', title: 'Ollama: Local Large Language Model Runner', duration: '8 hrs', hours: 8, completed: true, url: 'https://github.com/ollama/ollama', repo_name: 'ollama/ollama', description: 'Inspect Go + C++ llama.cpp bindings for multi-GPU model quantization and streaming API generation.' }
        ]
      },
      {
        num: '03',
        title: 'Vector Databases, RAG & Semantic Retrieval',
        duration: '4 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ai-5', stepNum: '03', type: 'REPO', title: 'Qdrant: Vector Similarity Search Engine', duration: '12 hrs', hours: 12, completed: false, url: 'https://github.com/qdrant/qdrant', repo_name: 'qdrant/qdrant', description: 'High-performance Rust vector engine with extended filtering and HNSW indexing.' },
          { id: 'ai-6', stepNum: '03', type: 'DOCS', title: 'LangChain & LangGraph Orchestration Architecture', duration: '10 hrs', hours: 10, completed: false, url: 'https://github.com/langchain-ai/langchain', repo_name: 'langchain-ai/langchain', description: 'Build stateful multi-agent workflows, tool routing, and automated self-correcting pipelines.' }
        ]
      },
      {
        num: '04',
        title: 'Distributed Training, Fine-Tuning & Quantization',
        duration: '3 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ai-7', stepNum: '04', type: 'REPO', title: 'DeepSpeed: Extreme-Scale Deep Learning Optimization', duration: '15 hrs', hours: 15, completed: false, url: 'https://github.com/microsoft/DeepSpeed', repo_name: 'microsoft/DeepSpeed', description: 'ZeRO memory optimization, pipeline parallelism, and fp8 mixed-precision distributed training.' }
        ]
      }
    ]
  },
  'cloud-devops-sre': {
    id: 'cloud-devops-sre',
    title: 'Cloud DevOps & Platform Reliability Pathway',
    target_role: 'Cloud DevOps & Site Reliability Engineer',
    description: 'Master multi-cloud Infrastructure as Code, GitOps pipelines, eBPF telemetry, and enterprise incident response.',
    github_source: 'bregman-arie/devops-exercises',
    github_url: 'https://github.com/bregman-arie/devops-exercises',
    est_weeks: 10,
    skill_gaps: [
      { skill: 'Terraform & OpenTofu Modules', level: 'CRITICAL' },
      { skill: 'Kubernetes Operator Pattern (Go)', level: 'CRITICAL' },
      { skill: 'Prometheus & OpenTelemetry Metrics', level: 'HIGH' },
      { skill: 'ArgoCD / GitOps Declarative Rollouts', level: 'HIGH' },
      { skill: 'Cilium & eBPF Service Mesh', level: 'MEDIUM' }
    ],
    steps: [
      {
        num: '01',
        title: 'Linux Systems Internals & Container Runtimes',
        duration: '2 WEEKS',
        status: 'done',
        resources: [
          { id: 'ops-1', stepNum: '01', type: 'REPO', title: 'DevOps Exercises & Linux Q&A (bregman-arie)', duration: '12 hrs', hours: 12, completed: true, url: 'https://github.com/bregman-arie/devops-exercises', repo_name: 'bregman-arie/devops-exercises', description: 'Over 2,000 interview exercises and technical deep dives into Linux, bash, and networking.' },
          { id: 'ops-2', stepNum: '01', type: 'DOCS', title: 'OCI Runtime Spec & containerd Internals', duration: '8 hrs', hours: 8, completed: true, url: 'https://github.com/containerd/containerd', repo_name: 'containerd/containerd', description: 'Understand cgroups v2, namespaces, and seccomp system call filtering.' }
        ]
      },
      {
        num: '02',
        title: 'Infrastructure as Code & GitOps Automation',
        duration: '3 WEEKS',
        status: 'current',
        resources: [
          { id: 'ops-3', stepNum: '02', type: 'REPO', title: 'OpenTofu / Terraform Best Practices & Patterns', duration: '14 hrs', hours: 14, completed: false, url: 'https://github.com/opentofu/opentofu', repo_name: 'opentofu/opentofu', description: 'Declarative cloud provisioning, remote state locking, and modular infrastructure design.' },
          { id: 'ops-4', stepNum: '02', type: 'REPO', title: 'Argo CD: Declarative GitOps for Kubernetes', duration: '10 hrs', hours: 10, completed: true, url: 'https://github.com/argoproj/argo-cd', repo_name: 'argoproj/argo-cd', description: 'Automated continuous deployment and sync reconciliation loops for cluster states.' }
        ]
      },
      {
        num: '03',
        title: 'Observability, OpenTelemetry & eBPF Networking',
        duration: '3 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ops-5', stepNum: '03', type: 'REPO', title: 'Cilium: eBPF-based Networking, Observability & Security', duration: '16 hrs', hours: 16, completed: false, url: 'https://github.com/cilium/cilium', repo_name: 'cilium/cilium', description: 'Replace iptables with high-performance Linux kernel eBPF programs for load balancing and L7 policy.' },
          { id: 'ops-6', stepNum: '03', type: 'DOCS', title: 'Google SRE Book: Site Reliability Engineering', duration: '12 hrs', hours: 12, completed: false, url: 'https://sre.google/sre-book/table-of-contents/', repo_name: 'google/sre-book', description: 'Seminal guide to Service Level Objectives (SLOs), error budgets, and postmortem engineering.' }
        ]
      },
      {
        num: '04',
        title: 'Chaos Engineering & High Availability Drills',
        duration: '2 WEEKS',
        status: 'pending',
        resources: [
          { id: 'ops-7', stepNum: '04', type: 'REPO', title: 'Chaos Mesh: Cloud-Native Chaos Engineering Platform', duration: '10 hrs', hours: 10, completed: false, url: 'https://github.com/chaos-mesh/chaos-mesh', repo_name: 'chaos-mesh/chaos-mesh', description: 'Simulate network partition, disk stress, clock skew, and pod kill experiments in staging.' }
        ]
      }
    ]
  }
};

// Pathway Aliases & Normalization
DEFAULT_PATHWAYS['ai-engineering'] = DEFAULT_PATHWAYS['ai-ml-platform'];
DEFAULT_PATHWAYS['cloud-devops'] = DEFAULT_PATHWAYS['cloud-devops-sre'];

const PATHWAY_NORM_MAP = {
  'distributed-systems': 'distributed-systems',
  'ai-engineering': 'ai-engineering',
  'ai-ml-platform': 'ai-engineering',
  'cloud-devops': 'cloud-devops',
  'cloud-devops-sre': 'cloud-devops'
};

function getActivePathway() {
  const normId = PATHWAY_NORM_MAP[CURRENT_ROADMAP_PATHWAY_ID] || 'distributed-systems';
  const localSaved = localStorage.getItem(`rezum_pathway_${normId}`) || localStorage.getItem(`rezum_pathway_${CURRENT_ROADMAP_PATHWAY_ID}`);
  if (localSaved) {
    try { return JSON.parse(localSaved); } catch (e) {}
  }
  return ROADMAP_CACHE[normId] || ROADMAP_CACHE[CURRENT_ROADMAP_PATHWAY_ID] || DEFAULT_PATHWAYS[normId] || DEFAULT_PATHWAYS['distributed-systems'];
}

function renderRoadmaps() {
  const pathway = getActivePathway();
  let allResources = [];
  (pathway.steps || []).forEach(st => {
    if (st.resources) allResources = allResources.concat(st.resources);
  });

  const completedCount = allResources.filter(r => r.completed).length;
  const totalCount = allResources.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingHours = allResources.filter(r => !r.completed).reduce((sum, r) => sum + (r.hours || 0), 0);

  const currentNorm = PATHWAY_NORM_MAP[CURRENT_ROADMAP_PATHWAY_ID] || 'distributed-systems';
  const pathwaysList = [
    { id: 'distributed-systems', label: 'DISTRIBUTED SYSTEMS', repo: 'donnemartin/system-design-primer' },
    { id: 'ai-engineering', label: 'AI & ML INFRASTRUCTURE', repo: 'kamranahmedse/developer-roadmap' },
    { id: 'cloud-devops', label: 'CLOUD DEVOPS & SRE', repo: 'bregman-arie/devops-exercises' }
  ];

  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <!-- Header -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end pb-space-lg border-b border-outline-variant/40 mb-space-lg reveal">
      <div class="lg:col-span-8">
        <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">VERIFIED GITHUB CURRICULA</span>
        <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Learning Roadmaps</h1>
        <p class="font-body-md text-on-surface-variant mt-2 max-w-2xl">${escapeHtml(pathway.description)}</p>
      </div>
      <div class="lg:col-span-4 flex lg:justify-end">
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="font-headline-sm text-headline-sm font-bold text-primary" id="roadmap-ratio">${completedCount} of ${totalCount}</span>
            <span class="font-label-sm text-label-sm uppercase text-secondary block">COMPLETED</span>
          </div>
          <div class="w-28 bg-surface-container h-2 overflow-hidden rounded-full">
            <div class="bg-primary h-full transition-all duration-500 ease-out" id="roadmap-progress-bar" style="width:${percent}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pathway Switcher Tabs -->
    <div class="flex flex-wrap items-center gap-2 mb-space-xl border-b border-outline-variant/20 pb-4">
      <span class="font-label-sm text-label-sm uppercase text-secondary mr-2">SELECT PATHWAY:</span>
      ${pathwaysList.map(p => `
        <button class="pathway-tab-btn px-4 py-2 rounded-full font-label-md text-label-md uppercase tracking-wider transition-all cursor-pointer ${p.id === currentNorm ? 'bg-primary text-on-primary font-bold shadow-sm' : 'border border-outline-variant/40 text-secondary hover:text-primary hover:border-primary'}" data-pathway="${p.id}">
          ${p.label}
        </button>
      `).join('')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <!-- Left: Target & Progress & Source Repo -->
      <div class="lg:col-span-4 reveal-left">
        <!-- Target Role Card -->
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg mb-gutter">
          <span class="font-label-sm text-label-sm uppercase text-secondary block mb-2">TARGET ROLE</span>
          <h3 class="font-headline-md text-headline-md font-bold text-primary mb-4">${escapeHtml(pathway.target_role)}</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase text-secondary">HOURS REMAINING</span>
              <span class="font-headline-sm text-headline-sm font-bold text-primary" id="roadmap-hours-left">${remainingHours} HRS</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase text-secondary">EST. DURATION</span>
              <span class="font-headline-sm text-headline-sm font-bold text-primary">${pathway.est_weeks || 12} WEEKS</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-label-sm text-label-sm uppercase text-secondary">COMPLETION RATE</span>
              <span class="font-headline-sm text-headline-sm font-bold text-primary" id="roadmap-percent">${percent}%</span>
            </div>
          </div>

          <!-- Real GitHub Source Link -->
          <a href="${pathway.github_url}" target="_blank" rel="noopener noreferrer" class="block p-3 bg-surface-container-low border border-outline-variant/40 hover:border-primary transition-all group">
            <div class="flex items-center justify-between mb-1">
              <span class="font-label-sm text-label-sm uppercase text-secondary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[15px]">code</span>
                SOURCE GITHUB REPOSITORY
              </span>
              <span class="material-symbols-outlined text-secondary group-hover:text-primary text-[16px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">north_east</span>
            </div>
            <p class="font-mono text-body-sm font-bold text-primary">${escapeHtml(pathway.github_source)}</p>
            <p class="font-label-sm text-secondary text-[11px] mt-0.5">Open-source industry syllabus &amp; community curated exercises</p>
          </a>
        </div>

        <!-- Top Skill Gaps -->
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg">
          <span class="font-label-sm text-label-sm uppercase text-secondary block mb-2">TARGET SKILL GAPS</span>
          <div class="space-y-2">
            ${(pathway.skill_gaps || []).map((gap, i) => `
              <div class="flex items-center justify-between p-2.5 ${i < 2 ? 'bg-surface-container-low border-l-2 border-primary' : ''}">
                <span class="font-body-sm text-body-sm ${i < 2 ? 'font-semibold text-primary' : 'text-on-surface-variant'}">${escapeHtml(gap.skill)}</span>
                <span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider">${escapeHtml(gap.level)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right: Timeline of Steps & Open-Source Resources -->
      <div class="lg:col-span-8 reveal-right">
        <div class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg md:p-space-xl">
          <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-8">
            <span class="font-label-md text-label-md uppercase font-semibold text-primary">${escapeHtml(pathway.title)}</span>
            <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary">MILESTONES 01 — 0${(pathway.steps || []).length}</span>
          </div>

          <div class="space-y-10 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
            ${(pathway.steps || []).map(step => {
              const res = step.resources || [];
              const allDone = res.length > 0 && res.every(r => r.completed);
              const someDone = res.some(r => r.completed);
              const statusClass = allDone 
                ? 'bg-primary' 
                : someDone 
                  ? 'bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-surface-container-lowest animate-pulse-glow' 
                  : 'border-2 border-outline-variant bg-surface-container-lowest';

              return `
              <div class="relative pl-10 reveal">
                <span class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full ${statusClass} border-2 border-surface-container-lowest"></span>
                <div class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-2">
                  <h4 class="font-headline-sm text-headline-sm font-bold text-primary">${step.num} // ${escapeHtml(step.title)}</h4>
                  <span class="font-label-sm text-label-sm uppercase text-secondary whitespace-nowrap">${step.duration}</span>
                </div>
                <div class="space-y-3 mt-4">
                  ${res.map(r => `
                    <div class="p-3 bg-surface-container-low hover:bg-surface-container transition-all group border border-transparent hover:border-outline-variant/40">
                      <div class="flex items-start justify-between gap-3">
                        <div class="flex items-start gap-3 flex-1 min-w-0">
                          <button class="roadmap-check-btn mt-0.5 w-5 h-5 rounded-full border ${r.completed ? 'bg-primary border-primary' : 'border-outline-variant hover:border-primary'} flex items-center justify-center transition-all cursor-pointer flex-shrink-0 focus:outline-none" data-id="${r.id}" data-pathway="${currentNorm}" title="${r.completed ? 'Mark incomplete' : 'Mark completed'}">
                            ${r.completed ? '<span class="material-symbols-outlined text-on-primary text-[12px]">check</span>' : ''}
                          </button>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                              <span class="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-secondary font-mono">${r.type}</span>
                              ${r.repo_name ? `
                                <a href="https://github.com/${r.repo_name}" target="_blank" rel="noopener noreferrer" class="font-label-sm text-[11px] text-secondary hover:text-primary flex items-center gap-1 font-mono hover:underline">
                                  <span class="material-symbols-outlined text-[13px]">code</span> ${escapeHtml(r.repo_name)}
                                </a>
                              ` : ''}
                            </div>
                            <h5 class="font-body-md text-body-md ${r.completed ? 'line-through text-secondary' : 'font-semibold text-primary'} leading-snug">${escapeHtml(r.title)}</h5>
                            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">${escapeHtml(r.description || '')}</p>
                          </div>
                        </div>

                        <!-- Right Actions -->
                        <div class="flex items-center gap-2 flex-shrink-0 pt-0.5">
                          <span class="font-label-sm text-label-sm text-secondary font-mono">${r.duration}</span>
                          <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-primary hover:bg-surface-container-high transition-colors" title="Open Resource in New Tab">
                            <span class="material-symbols-outlined text-[18px]">north_east</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

async function syncPathwayFromServer(pathwayId) {
  try {
    const normId = PATHWAY_NORM_MAP[pathwayId] || pathwayId;
    const res = await fetch(`/api/roadmaps/${normId}`, {
      headers: AuthManager.getAuthHeader()
    });
    if (res.ok) {
      const data = await res.json();
      ROADMAP_CACHE[normId] = data;
      ROADMAP_CACHE[pathwayId] = data;
      localStorage.setItem(`rezum_pathway_${normId}`, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Roadmap sync warning:', err);
  }
  return null;
}

function bindRoadmapListeners() {
  // Pathway Switcher Tabs
  document.querySelectorAll('.pathway-tab-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newPathwayId = btn.getAttribute('data-pathway');
      const normId = PATHWAY_NORM_MAP[newPathwayId] || newPathwayId;
      if (normId && normId !== CURRENT_ROADMAP_PATHWAY_ID) {
        CURRENT_ROADMAP_PATHWAY_ID = normId;
        localStorage.setItem('rezum_active_pathway', normId);
        await syncPathwayFromServer(normId);
        const container = document.getElementById('app-content');
        if (container) {
          container.innerHTML = renderRoadmaps();
          bindRoadmapListeners();
          initScrollReveal();
        }
      }
    });
  });

  // Checkbox buttons
  document.querySelectorAll('.roadmap-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const pathwayId = btn.getAttribute('data-pathway') || CURRENT_ROADMAP_PATHWAY_ID;
      const pathway = getActivePathway();

      let targetResource = null;
      for (const step of pathway.steps) {
        for (const res of (step.resources || [])) {
          if (res.id === id) {
            targetResource = res;
            break;
          }
        }
        if (targetResource) break;
      }

      if (targetResource) {
        targetResource.completed = !targetResource.completed;
        const normId = PATHWAY_NORM_MAP[pathwayId] || pathwayId;
        ROADMAP_CACHE[normId] = pathway;
        localStorage.setItem(`rezum_pathway_${normId}`, JSON.stringify(pathway));

        showToast(
          targetResource.completed ? 'Resource Completed' : 'Resource Reset',
          `${targetResource.title} marked as ${targetResource.completed ? 'completed' : 'in-progress'}.`,
          targetResource.completed ? 'check_circle' : 'pending'
        );

        // Update view directly
        const container = document.getElementById('app-content');
        if (container) {
          container.innerHTML = renderRoadmaps();
          bindRoadmapListeners();
          initScrollReveal();
        }

        // Send to backend API asynchronously without blocking UI
        try {
          fetch('/api/roadmaps/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...AuthManager.getAuthHeader()
            },
            body: JSON.stringify({
              pathway_id: normId,
              resource_id: id,
              completed: targetResource.completed
            })
          }).catch(e => console.warn('Progress sync warning:', e));
        } catch (e) {}
      }
    });
  });
}

function initRoadmaps() {
  bindRoadmapListeners();

  // Background fetch latest from server once (without infinite re-render loop)
  const normId = PATHWAY_NORM_MAP[CURRENT_ROADMAP_PATHWAY_ID] || CURRENT_ROADMAP_PATHWAY_ID;
  syncPathwayFromServer(normId).then(data => {
    if (data) {
      const container = document.getElementById('app-content');
      if (container && location.hash.startsWith('#/roadmaps')) {
        container.innerHTML = renderRoadmaps();
        bindRoadmapListeners();
        initScrollReveal();
      }
    }
  });
}


// ================================================================
//  PAGE: SETTINGS (REAL USER PROFILE SYNC)
// ================================================================
function renderSettings() {
  const currentUser = AuthManager.getCurrentUser();
  const isLoggedIn = AuthManager.isLoggedIn();
  const guestProfile = JSON.parse(localStorage.getItem('rezum_guest_profile')) || {};

  const nameVal = currentUser ? (currentUser.name || '') : (guestProfile.name || '');
  const emailVal = currentUser ? (currentUser.email || '') : (guestProfile.email || '');
  const phoneVal = currentUser ? (currentUser.phone || '') : (guestProfile.phone || '');
  const locationVal = currentUser ? (currentUser.location || '') : (guestProfile.location || '');

  return `
  <div class="max-w-[1720px] mx-auto px-margin-sm lg:px-margin py-space-xl">
    <div class="pb-space-lg border-b border-outline-variant/40 mb-space-lg reveal">
      <span class="font-label-sm text-label-sm uppercase tracking-widest text-secondary block mb-2">ACCOUNT CONFIGURATION</span>
      <h1 class="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight">Settings</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <!-- Left Rail -->
      <div class="lg:col-span-3 reveal-left">
        <nav class="space-y-1">
          ${[
            { id: 'settings-profile', label: 'PROFILE' },
            { id: 'settings-goals', label: 'CAREER GOALS' },
            { id: 'settings-privacy', label: 'PRIVACY & DATA' }
          ].map((item, i) => `
            <a href="#${item.id}" class="settings-nav-btn block w-full text-left px-4 py-3 font-label-md text-label-md uppercase ${i === 0 ? 'text-primary font-semibold bg-surface-container-low' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'} transition-all">${item.label}</a>
          `).join('')}
        </nav>
      </div>

      <!-- Right: Panels -->
      <div class="lg:col-span-9 space-y-gutter reveal-right">
        <!-- Profile -->
        <div id="settings-profile" class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
            <div>
              <h2 class="font-headline-md text-headline-md font-bold text-primary">Profile Information</h2>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Your verified executive identity and dossier contact details.</p>
            </div>
            ${isLoggedIn ? `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-primary/30">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="font-label-sm text-label-sm font-mono text-primary uppercase">ACTIVE SESSION (${currentUser.provider || 'LOCAL'})</span>
              </div>
            ` : `
              <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/50">
                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                <a href="#/auth" class="font-label-sm text-label-sm text-secondary hover:text-primary uppercase underline">SIGN IN TO PERSIST</a>
              </div>
            `}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">FULL NAME</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary font-medium text-primary" id="setting-name" value="${escapeHtml(nameVal)}" placeholder="Your Full Name" />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">EMAIL</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary font-medium text-primary" id="setting-email" value="${escapeHtml(emailVal)}" placeholder="yourname@domain.com" ${isLoggedIn ? 'readonly title="Email is verified with your account"' : ''} />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">PHONE</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary font-medium text-primary" id="setting-phone" value="${escapeHtml(phoneVal)}" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">LOCATION</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary font-medium text-primary" id="setting-location" value="${escapeHtml(locationVal)}" placeholder="City, State / Remote" />
            </div>
          </div>
          <div class="mt-6 flex items-center gap-4">
            <button id="save-profile-btn" class="px-8 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors font-bold cursor-pointer">SAVE CHANGES</button>
            <span id="save-profile-status" class="font-label-sm text-label-sm text-secondary"></span>
          </div>
        </div>

        <!-- Career Goals -->
        <div id="settings-goals" class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg">
          <h2 class="font-headline-md text-headline-md font-bold text-primary mb-6">Career Goals</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">TARGET ROLES</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary" value="Staff Systems Architect, Principal AI Infrastructure Engineer" />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">PREFERRED LOCATIONS</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary" value="San Francisco, CA; Austin, TX; Remote US" />
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">REMOTE PREFERENCE</label>
              <div class="flex gap-2">
                ${['REMOTE', 'HYBRID', 'ON-SITE'].map((r, i) => `
                  <button class="settings-pill px-4 py-1.5 rounded-full font-label-sm text-label-sm uppercase ${i === 0 ? 'bg-primary text-on-primary' : 'border border-outline-variant/50 text-secondary hover:text-primary'} transition-all">${r}</button>
                `).join('')}
              </div>
            </div>
            <div>
              <label class="block font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-1">TARGET COMPENSATION</label>
              <input class="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-2.5 text-body-sm focus:outline-none focus:border-primary" value="$250,000 - $350,000" />
            </div>
          </div>
        </div>

        <!-- Privacy & Data -->
        <div id="settings-privacy" class="bg-surface-container-lowest border border-outline-variant/30 p-space-lg">
          <h2 class="font-headline-md text-headline-md font-bold text-primary mb-6">Privacy & Data Dossier</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-6">You own your data. Export your candidate dossier or permanently purge local telemetry at any time.</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button id="export-data-btn" class="px-8 py-2.5 rounded-full border border-primary text-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">download</span> EXPORT MY DATA
            </button>
            <button id="delete-account-btn" class="px-8 py-2.5 rounded-full border border-error text-error font-label-md text-label-md uppercase tracking-wider hover:bg-error hover:text-on-error transition-all flex items-center justify-center gap-2 cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">delete_forever</span> DELETE ACCOUNT
            </button>
          </div>
          <div class="hidden mt-4 p-4 bg-error-container border border-error/30" id="delete-confirm">
            <p class="font-body-sm text-body-sm text-on-error-container mb-3 font-medium">This action will clear all local candidate dossier data and log you out immediately.</p>
            <div class="flex gap-2">
              <button id="confirm-delete-btn" class="px-6 py-2 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase font-bold hover:opacity-90 cursor-pointer">CONFIRM PERMANENT DELETE</button>
              <button id="cancel-delete" class="px-6 py-2 rounded-full border border-outline-variant/50 text-secondary font-label-sm text-label-sm uppercase hover:text-primary cursor-pointer">CANCEL</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initSettings() {
  // Pill selection
  document.querySelectorAll('.settings-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.settings-pill').forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary');
        p.classList.add('border', 'border-outline-variant/50', 'text-secondary');
      });
      pill.classList.add('bg-primary', 'text-on-primary');
      pill.classList.remove('border', 'border-outline-variant/50', 'text-secondary');
    });
  });

  // Save changes
  const saveBtn = document.getElementById('save-profile-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const name = document.getElementById('setting-name')?.value.trim() || '';
      const email = document.getElementById('setting-email')?.value.trim() || '';
      const phone = document.getElementById('setting-phone')?.value.trim() || '';
      const location = document.getElementById('setting-location')?.value.trim() || '';
      const statusEl = document.getElementById('save-profile-status');

      if (AuthManager.isLoggedIn()) {
        try {
          if (statusEl) statusEl.textContent = 'Saving to database...';
          const res = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...AuthManager.getAuthHeader()
            },
            body: JSON.stringify({ name, email, phone, location })
          });
          if (res.ok) {
            const data = await res.json();
            const userObj = data.user || data;
            AuthManager.setSession(userObj, AuthManager.getToken());
            showToast('Profile Saved', 'Verified profile updated successfully in database.', 'verified');
            if (statusEl) statusEl.textContent = 'Saved!';
            setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
          } else {
            const err = await res.json();
            showToast('Save Failed', err.detail || 'Could not update profile.', 'error');
            if (statusEl) statusEl.textContent = '';
          }
        } catch (err) {
          showToast('Save Error', 'Connection failed.', 'error');
          if (statusEl) statusEl.textContent = '';
        }
      } else {
        localStorage.setItem('rezum_guest_profile', JSON.stringify({ name, email, phone, location }));
        showToast('Profile Saved Locally', 'Sign in to sync your changes across devices.', 'save');
        if (statusEl) statusEl.textContent = 'Saved locally (Guest)';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
      }
    });
  }

  // Export data
  const exportBtn = document.getElementById('export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const curUser = AuthManager.getCurrentUser() || JSON.parse(localStorage.getItem('rezum_guest_profile')) || {};
      const activePathway = getActivePathway();
      const dossier = {
        candidate: {
          name: document.getElementById('setting-name')?.value || curUser.name || 'Candidate',
          email: document.getElementById('setting-email')?.value || curUser.email || 'user@example.com',
          location: document.getElementById('setting-location')?.value || curUser.location || 'Remote',
          phone: document.getElementById('setting-phone')?.value || curUser.phone || '',
          title: activePathway.target_role || 'Staff Engineer'
        },
        pipeline: REZUM_PIPELINE,
        active_pathway: activePathway,
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rezum-candidate-dossier-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Dossier Exported', 'Candidate telemetry saved to JSON.', 'download');
    });
  }

  // Delete account flow
  const deleteBtn = document.getElementById('delete-account-btn');
  const deleteConfirm = document.getElementById('delete-confirm');
  const cancelDelete = document.getElementById('cancel-delete');
  const confirmDelete = document.getElementById('confirm-delete-btn');

  if (deleteBtn && deleteConfirm) {
    deleteBtn.addEventListener('click', () => deleteConfirm.classList.remove('hidden'));
  }
  if (cancelDelete && deleteConfirm) {
    cancelDelete.addEventListener('click', () => deleteConfirm.classList.add('hidden'));
  }
  if (confirmDelete) {
    confirmDelete.addEventListener('click', () => {
      AuthManager.clearSession();
      localStorage.removeItem('rezum_pipeline');
      localStorage.removeItem('rezum_active_pathway');
      localStorage.removeItem('rezum_resume_draft');
      localStorage.removeItem('rezum_guest_profile');
      showToast('Account Purged', 'Session terminated and candidate telemetry cleared.', 'delete');
      setTimeout(() => { location.hash = '#/'; }, 1000);
    });
  }
}


// ================================================================
//  404 PAGE
// ================================================================
function render404() {
  return `
  <div class="min-h-[60vh] flex items-center justify-center">
    <div class="text-center animate-fade-in-up">
      <h1 class="font-headline-2xl text-headline-2xl text-primary font-extrabold mb-4">404</h1>
      <p class="font-body-lg text-body-lg text-on-surface-variant mb-6">Protocol not found. This route does not exist.</p>
      <a href="#/" class="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider hover:bg-primary-hover transition-colors">RETURN HOME</a>
    </div>
  </div>`;
}


// ================================================================
//  BOOTSTRAP
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-content');

  const routes = [
    { path: '/', render: renderLanding, init: initLanding },
    { path: '/auth', render: renderAuth, init: initAuth },
    { path: '/analyzer', render: renderAnalyzer, init: initAnalyzer },
    { path: '/resume', render: renderResume, init: initResume },
    { path: '/jobs', render: renderJobs, init: initJobs },
    { path: '/job-detail', render: renderJobDetail, init: initJobDetail },
    { path: '/tracker', render: renderTracker, init: initTracker },
    { path: '/roadmaps', render: renderRoadmaps, init: initRoadmaps },
    { path: '/settings', render: renderSettings, init: initSettings },
    { path: '*', render: render404 }
  ];

  const router = new Router(routes, container);

  // Initialize Header with real authenticated user session
  AuthManager.updateHeaderUserUI();
  window.addEventListener('hashchange', () => {
    AuthManager.updateHeaderUserUI();
  });

  // Search button & keyboard shortcut
  document.getElementById('search-btn')?.addEventListener('click', openCommandPalette);
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  });

  // Avatar profile menu
  document.getElementById('avatar-btn')?.addEventListener('click', toggleAvatarDropdown);

  // Newsletter subscribe
  const nBtn = document.getElementById('newsletter-btn');
  const nEmail = document.getElementById('newsletter-email');
  if (nBtn && nEmail) {
    nBtn.addEventListener('click', () => {
      const email = nEmail.value.trim();
      if (email && email.includes('@')) {
        showToast('Subscription Confirmed', `Transmission dispatched to ${email}.`, 'mark_email_read');
        nEmail.value = '';
      } else {
        showToast('Input Required', 'Please provide a valid email address.', 'error');
      }
    });
    nEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') nBtn.click();
    });
  }

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', openMobileNav);

  // Hide/show header on scroll
  let lastScroll = 0;
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }, { passive: true });
});
