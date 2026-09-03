// ==========================================================================
// Mysticink Studio - Interactive Logic & Google Reviews Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initReviewsEngine();
  initGalleryFilter();
  initWhatsAppBooking();
  initMobileNav();
  initSmoothScroll();
});

/* 1. Google Reviews Dynamic Engine */
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

  // Initial render of reviews
  renderReviews('all');

  // Filter click event
  chipsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip-btn');
    if (!chip) return;

    document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
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
          <p>Showing verified Google Reviews for Mysticink Studio.</p>
        </div>
      `;
      return;
    }

    reviewsGrid.innerHTML = filtered.map(review => `
      <div class="review-card">
        <div>
          <div class="reviewer-meta">
            <div class="reviewer-avatar" style="background-color: ${review.avatarColor};">
              ${review.initial}
            </div>
            <div class="reviewer-info">
              <h4>${review.author}</h4>
              <div class="reviewer-sub">
                <span class="stars-row">${'★'.repeat(review.rating)}</span>
                <span>• ${review.relativeTime}</span>
                <svg class="verified-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <p class="review-text">"${review.text}"</p>
        </div>
        
        <div class="review-tags-row">
          ${review.tags.map(t => {
            const catMatch = GOOGLE_REVIEWS_DATA.categories.find(c => c.id === t);
            return `<span class="review-tag-badge">#${catMatch ? catMatch.label : t}</span>`;
          }).join('')}
        </div>
      </div>
    `).join('');
  }
}

/* 2. Gallery Filter & Lightbox Modal */
function initGalleryFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalClose = document.getElementById('lightbox-close');

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        items.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox Modal
  if (items.length && modal && modalImg) {
    items.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title')?.innerText || 'Tattoo Artwork';
        const desc = item.querySelector('.gallery-desc')?.innerText || 'Mysticink Studio McLeod Ganj';
        
        modalImg.src = img.src;
        modalCaption.innerHTML = `<h4>${title}</h4><p style="color: #9CA3AF; font-size: 0.9rem;">${desc}</p>`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }
}

/* 3. WhatsApp Direct Quote Generator */
function initWhatsAppBooking() {
  const form = document.getElementById('whatsapp-booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim() || 'Visitor';
    const phone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
    const service = document.getElementById('service-type')?.value || 'Custom Tattoo';
    const placement = document.getElementById('tattoo-placement')?.value || 'Arm';
    const size = document.getElementById('tattoo-size')?.value || 'Medium (4-6 in)';
    const idea = document.getElementById('tattoo-idea')?.value.trim() || 'Looking for artist consultation';

    const message = `Hello Mysticink Studio!\nI would like to inquire about a tattoo / piercing appointment:\n\n` +
      `• *Name:* ${name}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Service:* ${service}\n` +
      `• *Placement:* ${placement}\n` +
      `• *Approx Size:* ${size}\n` +
      `• *Design Idea/Notes:* ${idea}\n\n` +
      `Looking forward to your guidance!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917876132315?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* 4. Mobile Navigation Toggle */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    if (isOpen) {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '78px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.backgroundColor = '#0B0B0E';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid var(--border-gold)';
      navLinks.style.zIndex = '99';
    }
  });
}

/* 5. Smooth Scroll */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth <= 992 && navLinks) {
          navLinks.style.display = 'none';
        }
      }
    });
  });
}
