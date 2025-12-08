(function () {
  'use strict';

  // Simple Lightbox implementation — modular, uses event delegation
  class Lightbox {
    constructor() {
      this.lightbox = null;
      this.img = null;
      this.caption = null;
      this.closeBtn = null;
      this.activeClass = 'active';
      this.selectors = ['.timeline img', '.usage-visual img', '.fablab-card-media img', '.hero-visual img'];
      this.selector = this.selectors.join(', ');
      this.previouslyFocused = null;
      this.focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [contenteditable], [tabindex]:not([tabindex="-1"])';
      this.focusableElements = [];
      this._onDocumentClick = this._onDocumentClick.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onLightboxClick = this._onLightboxClick.bind(this);
    }

    init() {
      this.lightbox = document.getElementById('lightbox');
      this.img = document.getElementById('lightbox-img');
      this.caption = document.querySelector('.lightbox-caption');
      this.closeBtn = document.querySelector('.lightbox-close');

      if (!this.lightbox || !this.img || !this.closeBtn) return;

      document.addEventListener('click', this._onDocumentClick);
      this.closeBtn.addEventListener('click', () => this.close());
      this.lightbox.addEventListener('click', this._onLightboxClick);
      document.addEventListener('keydown', this._onKeyDown);
    }

    _onDocumentClick(e) {
      const img = e.target.closest('img');
      if (!img) return;
      if (!img.matches(this.selector)) return;
      if (img.closest('.tool-logo') || img.closest('.logo-image')) return;

      e.preventDefault();
      this.open(img);
    }

    _onLightboxClick(e) {
      if (e.target === this.lightbox) this.close();
    }

    _onKeyDown(e) {
      if (!this.lightbox) return;

      if (this.lightbox.classList.contains(this.activeClass)) {
        if (e.key === 'Escape') {
          this.close();
          return;
        }

        if (e.key === 'Tab') {
          this._handleTabKey(e);
          return;
        }
      }
    }

    open(imgEl) {
      const src = imgEl.currentSrc || imgEl.src;
      const alt = imgEl.alt || '';

      this.img.src = src;
      this.img.alt = alt;
      this.caption.textContent = alt;

      this.lightbox.classList.add(this.activeClass);
      this.lightbox.style.display = 'block';
      // lock scroll
      document.body.style.overflow = 'hidden';

      // set dialog semantics
      try {
        this.lightbox.setAttribute('aria-modal', 'true');
        this.lightbox.removeAttribute('aria-hidden');
      } catch (err) {}

      this.previouslyFocused = document.activeElement;

      this.focusableElements = Array.from(this.lightbox.querySelectorAll(this.focusableSelectors)).filter(Boolean);
      if (!this.focusableElements.length) this.focusableElements = [this.closeBtn];

      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.setAttribute('aria-hidden', 'true');

      this.closeBtn.focus();
    }

    close() {
      this.lightbox.classList.remove(this.activeClass);
      setTimeout(() => {
        this.lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.img.src = '';
        this.caption.textContent = '';
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.removeAttribute('aria-hidden');

        try {
          this.lightbox.setAttribute('aria-modal', 'false');
          this.lightbox.setAttribute('aria-hidden', 'true');
        } catch (err) {}

        if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
          this.previouslyFocused.focus();
        }
        this.previouslyFocused = null;
        this.focusableElements = [];
      }, 200);
    }

    _handleTabKey(e) {
      if (!this.focusableElements || !this.focusableElements.length) return;

      const firstEl = this.focusableElements[0];
      const lastEl = this.focusableElements[this.focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || document.activeElement === this.lightbox) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Lightbox().init());
  } else {
    new Lightbox().init();
  }
})();
