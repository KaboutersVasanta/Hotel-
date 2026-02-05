/**
 * Hotel Aurora - Interactive Elements
 * Lightweight JavaScript for enhanced user experience
 * No external dependencies
 */

(function() {
  'use strict';

  // ============================================
  // Sticky Header on Scroll
  // ============================================
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function updateHeader() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    updateHeader();
  }

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!mobileToggle || !mainNav) return;

    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      
      // Update aria-expanded attribute for accessibility
      const isExpanded = mainNav.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      
      // Change icon (if using Unicode characters)
      mobileToggle.textContent = isExpanded ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileToggle.contains(event.target) && !mainNav.contains(event.target)) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      }
    });

    // Close menu when clicking on a nav link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // ============================================
  // Intersection Observer - Reveal Animations
  // ============================================
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately show all elements
      revealElements.forEach(el => el.classList.add('active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: Stop observing after animation triggers
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  // ============================================
  // Smooth Scroll for Internal Links
  // ============================================
  function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Get header height for offset
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;
          
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
        }
      });
    });
  }

  // ============================================
  // Add Mobile Menu Button if it doesn't exist
  // ============================================
  function ensureMobileMenuButton() {
    const header = document.querySelector('.site-header .header-inner');
    const existingToggle = document.querySelector('.mobile-toggle');
    
    if (!header || existingToggle) return;
    
    // Create mobile menu toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-toggle';
    mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.textContent = '☰';
    
    // Insert before the last child (book button) or at the end
    const lastChild = header.lastElementChild;
    header.insertBefore(mobileToggle, lastChild);
  }

  // ============================================
  // Lazy Loading Images (Progressive Enhancement)
  // ============================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback: load all images immediately
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // ============================================
  // Initialize all features when DOM is ready
  // ============================================
  function init() {
    ensureMobileMenuButton();
    initStickyHeader();
    initMobileMenu();
    initRevealAnimations();
    initSmoothScroll();
    initLazyLoading();
    
    console.log('✓ Hotel Aurora interactive features loaded');
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already loaded
    init();
  }

})();
