// ==========================================================================
// Mysticink Studio - Haute-Artisan Interactive Engine
// Multi-Currency Converter, Dynamic Reviews, Gallery Lightbox & WhatsApp Concierge
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initReviewsEngine();
  initCurrencySwitcher();
  initGalleryFilterAndLightbox();
  initArtistAvatarSwitcher();
  initWhatsAppConcierge();
  initNavigation();
});

/* ==========================================================================
   1. Dynamic Google Reviews Engine
   ========================================================================== */
function initReviewsEngine() {
  const chipsContainer = document.getElementById('review-filter-chips');
  const reviewsGrid = document.getElementById('reviews-cards-grid');

  if (!chipsContainer || !reviewsGrid || typeof GOOGLE_REVIEWS_DATA === 'undefined') return;

  // Render Filter Chips
  chipsContainer.innerHTML = GOOGLE_REVIEWS_DATA.categories.map((cat, idx) => `
    <button class="chip-btn ${idx === 0 ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.label}</span>
      <span class="chip-count">${cat.count}</span>
    </button>
  `).join('');

  // Initial render
  renderReviews('all');

  // Filter click event
  chipsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;

    chipsContainer.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
    chip.classList.add('active');

    const selectedCategory = chip.getAttribute('data-category');
    renderReviews(selectedCategory);
  });

  function renderReviews(category) {
    const filtered = category === 'all' 
      ? GOOGLE_REVIEWS_DATA.reviews 
      : GOOGLE_REVIEWS_DATA.reviews.filter(r => r.tags.includes(category));

    if (filtered.length === 0) {
      reviewsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p>Showing verified 5.0★ Google Reviews for Mysticink Studio.</p>
        </div>
      `;
      return;
    }

    reviewsGrid.innerHTML = filtered.map(review => `
      <div class="review-card">
        <div>
          <div class="reviewer-meta">
            <div class="reviewer-avatar">${review.initial}</div>
            <div class="reviewer-details">
              <h4>
                ${review.author}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#38bdf8" title="Verified Reviewer"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </h4>
              <p class="reviewer-origin">${review.origin || 'Verified Visitor'}</p>
            </div>
          </div>

          <div class="review-stars">★★★★★</div>
          <p class="review-text">"${review.text}"</p>
        </div>

        <div class="review-footer">
          <span>${review.relativeTime}</span>
          <span style="display: flex; align-items: center; gap: 4px; color: var(--gold-primary);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Google Verified
          </span>
        </div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   2. Multi-Currency Live Converter (INR, EUR, USD, GBP)
   ========================================================================== */
const PRICING_TIERS = {
  fineline: {
    name: "Fine-Line & Sacred Script",
    INR: "₹3,500 – ₹6,000",
    EUR: "€38 – €66",
    USD: "$42 – $72",
    GBP: "£33 – £56"
  },
  sleeve: {
    name: "Custom Project / Session",
    INR: "₹9,000 – ₹16,000",
    EUR: "€99 – €175",
    USD: "$108 – $192",
    GBP: "£85 – £150"
  },
  piercing: {
    name: "Sterile Body Piercing",
    INR: "₹1,500 – ₹2,500",
    EUR: "€16 – €28",
    USD: "$18 – $30",
    GBP: "£14 – £24"
  }
};

let currentCurrency = 'INR';

function initCurrencySwitcher() {
  const currencyButtons = document.querySelectorAll('.currency-btn');
  
  function updatePrices(curr) {
    currentCurrency = curr;
    
    // Update all currency buttons state across header and pricing section
    currencyButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-curr') === curr);
    });

    // Update prices on the DOM
    const finelineEl = document.getElementById('price-tier-fineline');
    const sleeveEl = document.getElementById('price-tier-sleeve');
    const piercingEl = document.getElementById('price-tier-piercing');

    if (finelineEl) finelineEl.innerHTML = `${PRICING_TIERS.fineline[curr]} <span>/ piece</span>`;
    if (sleeveEl) sleeveEl.innerHTML = `${PRICING_TIERS.sleeve[curr]} <span>/ session</span>`;
    if (piercingEl) piercingEl.innerHTML = `${PRICING_TIERS.piercing[curr]} <span>/ standard</span>`;
  }

  currencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const curr = btn.getAttribute('data-curr');
      updatePrices(curr);
    });
  });

  // Default initialize
  updatePrices('INR');
}

/* ==========================================================================
   3. Gallery Filter & Modal Lightbox
   ========================================================================== */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalClose = document.getElementById('lightbox-close');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.portfolio-card-title');
      const style = card.querySelector('.portfolio-style-badge');

      if (img && modal && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Tattoo Preview';
        modalCaption.textContent = title ? `${title.textContent} • ${style ? style.textContent : ''}` : '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   4. Traveler WhatsApp Concierge
   ========================================================================== */
function initWhatsAppConcierge() {
  const form = document.getElementById('traveler-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim() || 'Visitor';
    const origin = document.getElementById('client-origin')?.value.trim() || 'Not specified';
    const travelDates = document.getElementById('client-travel-dates')?.value.trim() || 'Dates flexible';
    const service = document.getElementById('service-type')?.value || 'Custom Tattoo';
    const placement = document.getElementById('tattoo-placement')?.value.trim() || 'To be discussed';
    const idea = document.getElementById('tattoo-idea')?.value.trim() || 'Concept consultation requested.';

    const message = 
`✨ *MYSTICINK STUDIO CONSULTATION INQUIRY* ✨
• *Name:* ${name}
• *Country / City:* ${origin}
• *Travel Dates in McLeod Ganj:* ${travelDates}
• *Preferred Service:* ${service}
• *Placement:* ${placement}
• *Design Concept / Reference:*
${idea}

(Preferred Currency: ${currentCurrency})
Looking forward to discussing with the resident artist!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917876132315?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   5. Mobile Navigation & Header Scroll State
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileClose = document.getElementById('mobile-close-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const header = document.querySelector('.main-header');

  function openMobileMenu() {
    mobileDrawer?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileDrawer?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Close when clicking any nav link or CTA inside mobile drawer
  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside content on overlay
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileMenu();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Header background elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Dynamic Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==========================================================================
   6. Resident Master Artist Interactive Avatar Switcher
   ========================================================================== */
function initArtistAvatarSwitcher() {
  const thumbBtns = document.querySelectorAll('.avatar-thumb-btn');
  const featuredAvatarImg = document.getElementById('featured-artist-avatar');
  const badgeText = document.getElementById('featured-avatar-badge-text');
  const titleEl = document.getElementById('featured-avatar-title');
  const descEl = document.getElementById('featured-avatar-desc');

  if (!thumbBtns.length || !featuredAvatarImg) return;

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      // Update active thumbnail
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const src = btn.getAttribute('data-src');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      const badge = btn.getAttribute('data-badge');

      // Cinematic smooth transition
      featuredAvatarImg.classList.add('fading');

      setTimeout(() => {
        if (src) featuredAvatarImg.src = src;
        if (title && titleEl) titleEl.textContent = title;
        if (desc && descEl) descEl.textContent = desc;
        if (badge && badgeText) badgeText.textContent = badge;

        featuredAvatarImg.classList.remove('fading');
      }, 180);
    });
  });
}
