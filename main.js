/**
 * PAW & POLISH — Pet Grooming & Care Studio
 * Interactive Logic: Mobile menu, Smooth scrolling, Active nav highlights,
 * Package selection to booking form sync, Before/After gallery category filtering,
 * Lightbox modal, Wellness Tips expandable modal, Front-end Appointment Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS animation library
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: () => window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // 2. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 3. Dynamic Footer Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 4. Mobile Hamburger Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      const menuIcon = mobileMenuBtn.querySelector('[data-lucide]');
      if (menuIcon) {
        if (!isExpanded) {
          menuIcon.setAttribute('data-lucide', 'x');
        } else {
          menuIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const menuIcon = mobileMenuBtn.querySelector('[data-lucide]');
        if (menuIcon) {
          menuIcon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 5. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinksList = document.querySelectorAll('.mobile-nav-link');

  function highlightActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Desktop Links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.classList.remove('text-charcoal-muted');
          } else {
            link.classList.remove('active');
            link.classList.add('text-charcoal-muted');
          }
        });

        // Mobile Links
        mobileNavLinksList.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  // Initial call on load
  highlightActiveNav();

  const floatingBackToTopBtn = document.getElementById('floating-back-to-top');

  function handleScrollInteractions() {
    highlightActiveNav();

    if (floatingBackToTopBtn) {
      if (window.pageYOffset > 400) {
        floatingBackToTopBtn.classList.remove('hidden');
        floatingBackToTopBtn.classList.add('flex');
      } else {
        floatingBackToTopBtn.classList.add('hidden');
        floatingBackToTopBtn.classList.remove('flex');
      }
    }
  }

  window.addEventListener('scroll', handleScrollInteractions, { passive: true });

  if (floatingBackToTopBtn) {
    floatingBackToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll for footer back to top button
  document.querySelectorAll('.back-to-top-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 6. Package CTA: Auto-scroll & preselect package in booking form
  const packageButtons = document.querySelectorAll('.select-package-btn');
  const packageSelect = document.getElementById('booking-package');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedPkg = btn.getAttribute('data-package');
      if (packageSelect && selectedPkg) {
        packageSelect.value = selectedPkg;
      }
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 7. Gallery Category Filter
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(b => {
        b.classList.remove('bg-forest', 'text-cream');
        b.classList.add('bg-white', 'text-charcoal', 'border', 'border-sage/40');
      });
      btn.classList.add('bg-forest', 'text-cream');
      btn.classList.remove('bg-white', 'text-charcoal', 'border', 'border-sage/40');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 200);
        }
      });
    });
  });

  // 8. Gallery Lightbox Modal
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBeforeImg = document.getElementById('lightbox-before-img');
  const lightboxAfterImg = document.getElementById('lightbox-after-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-preview-trigger');

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.closest('.gallery-item');
      if (!parent) return;
      const beforeSrc = parent.getAttribute('data-before-src');
      const afterSrc = parent.getAttribute('data-after-src');
      const title = parent.getAttribute('data-title');
      const desc = parent.getAttribute('data-desc');

      if (lightboxBeforeImg) lightboxBeforeImg.src = beforeSrc;
      if (lightboxAfterImg) lightboxAfterImg.src = afterSrc;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      if (lightboxModal) {
        lightboxModal.classList.remove('hidden');
        lightboxModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // 9. Wellness Tips Modal Content & Logic
  const tipArticles = {
    'tip-1': {
      title: 'How Often Should Your Dog Be Groomed?',
      category: 'Coat Health & Scheduling',
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1000&q=80',
      content: `
        <p class="mb-4">Grooming frequency varies significantly based on your dog's breed, coat type, activity level, and lifestyle. A dog that hikes daily through muddy trails requires a different grooming calendar than an indoor companion.</p>
        <h4 class="font-bold text-forest text-lg mb-2">General Guidelines by Coat Type:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-charcoal/80">
          <li><strong>Long or Curly Coats (Poodles, Doodles, Shih Tzus):</strong> Every 4 to 6 weeks. These coats are prone to matting and require regular clipping, thorough detangling, and professional bathing.</li>
          <li><strong>Double Coats (Golden Retrievers, Huskies, German Shepherds):</strong> Every 8 to 12 weeks. Double coats should never be shaved down in warm weather because the undercoat acts as thermal insulation. De-shedding treatments during seasonal shedding windows are essential.</li>
          <li><strong>Short, Smooth Coats (Boxers, Beagles, Pugs):</strong> Every 8 to 12 weeks for a bath, nail trim, and ear cleanse. Weekly home brushing with a rubber curry comb keeps shedding under control.</li>
        </ul>
        <p class="text-sm bg-sage/10 p-4 rounded-xl border border-sage/30 text-forest font-medium">💡 <em>Pro Tip:</em> Regular nail trimming every 3 to 4 weeks prevents postural issues and joint pain caused by overgrown quicks.</p>
      `
    },
    'tip-2': {
      title: 'Simple At-Home Paw Care: Protecting Sensitive Pads',
      category: 'Hygiene & Daily Care',
      image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1000&q=80',
      content: `
        <p class="mb-4">Paws are your pet's shock absorbers, temperature regulators, and sensory touchpoints. Keeping them healthy prevents discomfort, bacterial infections, and costly veterinary visits.</p>
        <h4 class="font-bold text-forest text-lg mb-2">Three Steps for Daily Paw Hygiene:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-charcoal/80">
          <li><strong>Post-Walk Wipe Downs:</strong> Use a warm, damp microfiber cloth or unscented pet wipes to clear away sidewalk debris, salt, mud, or lawn allergens between toes.</li>
          <li><strong>Paw Balm Conditioning:</strong> Apply a natural, lick-safe shea butter or beeswax balm once or twice a week to heal dry, cracked pads.</li>
          <li><strong>Trim Interdigital Hair:</strong> Excessive tufts of hair growing between paw pads capture moisture, burrs, and ice pellets. Keep them gently trimmed flush with the pads.</li>
        </ul>
        <p class="text-sm bg-sage/10 p-4 rounded-xl border border-sage/30 text-forest font-medium">🐾 <em>Notice Limping?</em> Inspect paw pads promptly for thorns, foxtails, or cracked nails before attempting home treatments.</p>
      `
    },
    'tip-3': {
      title: 'Helping Your Puppy Enjoy Their First Groom',
      category: 'Puppy Socialization',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80',
      content: `
        <p class="mb-4">A puppy's first grooming visit establishes their emotional attitude toward grooming for the rest of their life. Our gentle, low-stress desensitization approach makes all the difference.</p>
        <h4 class="font-bold text-forest text-lg mb-2">At-Home Preparation Steps:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-charcoal/80">
          <li><strong>Touch Desensitization:</strong> Gently massage paws, handle individual toes, touch ears, and stroke around the muzzle while offering high-value treats.</li>
          <li><strong>Sound Exposure:</strong> Turn on an electric toothbrush or hair dryer in the next room while playing with your pup to normalize buzzing motor sounds.</li>
          <li><strong>Short & Sweet:</strong> Schedule our "Puppy Fresh" introductory session between 12 and 16 weeks of age (after core vaccinations) focusing on fun, gentle splashing, and praise.</li>
        </ul>
        <p class="text-sm bg-sage/10 p-4 rounded-xl border border-sage/30 text-forest font-medium">✨ <em>Patience First:</em> We never rush young pups. We allow playful sniffing and breaks whenever required.</p>
      `
    },
    'tip-4': {
      title: 'Gentle Brushing Tips for Long-Haired Cats',
      category: 'Feline Wellness',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1000&q=80',
      content: `
        <p class="mb-4">Long-haired felines such as Persians, Maine Coons, and Ragdolls have luxurious coats that easily form painful pelted mats if left unbrushed.</p>
        <h4 class="font-bold text-forest text-lg mb-2">Feline-Friendly Brushing Routine:</h4>
        <ul class="list-disc pl-5 mb-4 space-y-2 text-charcoal/80">
          <li><strong>Choose the Right Tools:</strong> Use a wide-toothed metal greyhound comb first, followed by a soft-bristled slicker brush with protective rubber tips.</li>
          <li><strong>Read Body Language:</strong> Cats communicate with subtle tail twitches and skin ripples. Keep sessions under 5 minutes when starting and reward with treats or chin scratches.</li>
          <li><strong>Target High-Friction Zones:</strong> Behind the ears, under the armpits, inner thighs, and sanitary areas are prime matting locations requiring gentle line-brushing.</li>
        </ul>
        <p class="text-sm bg-sage/10 p-4 rounded-xl border border-sage/30 text-forest font-medium">⚠️ <em>Never Use Scissors:</em> Feline skin is remarkably thin. Never attempt to cut tight mats out with scissors at home — let professional groomers shave them safely.</p>
      `
    }
  };

  const tipsModal = document.getElementById('tips-modal');
  const tipsModalCategory = document.getElementById('tips-modal-category');
  const tipsModalTitle = document.getElementById('tips-modal-title');
  const tipsModalImg = document.getElementById('tips-modal-img');
  const tipsModalBody = document.getElementById('tips-modal-body');
  const tipsModalClose = document.getElementById('tips-modal-close');
  const readTipButtons = document.querySelectorAll('.read-tip-btn');

  readTipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tipId = btn.getAttribute('data-tip-id');
      const data = tipArticles[tipId];
      if (data && tipsModal) {
        if (tipsModalCategory) tipsModalCategory.textContent = data.category;
        if (tipsModalTitle) tipsModalTitle.textContent = data.title;
        if (tipsModalImg) tipsModalImg.src = data.image;
        if (tipsModalBody) tipsModalBody.innerHTML = data.content;

        tipsModal.classList.remove('hidden');
        tipsModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeTipsModal() {
    if (tipsModal) {
      tipsModal.classList.add('hidden');
      tipsModal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  if (tipsModalClose) tipsModalClose.addEventListener('click', closeTipsModal);
  if (tipsModal) {
    tipsModal.addEventListener('click', (e) => {
      if (e.target === tipsModal) closeTipsModal();
    });
  }

  // Keyboard escape handler for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeTipsModal();
    }
  });

  // 10. Booking Appointment Form Validation & Submission Handling
  const bookingForm = document.getElementById('appointment-form');
  const dateInput = document.getElementById('booking-date');
  const formSuccessAlert = document.getElementById('form-success-alert');
  const submitBtn = document.getElementById('submit-booking-btn');

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check validity
      let isValid = true;
      const requiredFields = [
        'parent-name',
        'parent-email',
        'parent-phone',
        'pet-name',
        'pet-type',
        'pet-breed',
        'pet-size',
        'booking-package',
        'booking-service',
        'booking-date',
        'booking-time',
        'consent-check'
      ];

      // Simple regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;

      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);

        if (!field) return;

        let hasError = false;

        if (field.type === 'checkbox') {
          if (!field.checked) {
            hasError = true;
          }
        } else if (!field.value.trim()) {
          hasError = true;
        } else if (fieldId === 'parent-email' && !emailRegex.test(field.value.trim())) {
          hasError = true;
        } else if (fieldId === 'parent-phone' && !phoneRegex.test(field.value.trim())) {
          hasError = true;
        } else if (fieldId === 'booking-date') {
          const selectedDate = new Date(field.value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            hasError = true;
          }
        }

        if (hasError) {
          isValid = false;
          field.classList.add('border-red-400', 'bg-red-50/30');
          field.classList.remove('border-sage/40', 'border-gray-300');
          if (errorSpan) errorSpan.classList.remove('hidden');
        } else {
          field.classList.remove('border-red-400', 'bg-red-50/30');
          field.classList.add('border-sage/40');
          if (errorSpan) errorSpan.classList.add('hidden');
        }
      });

      if (!isValid) {
        const firstError = bookingForm.querySelector('.border-red-400');
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      // Prevent duplicate submissions
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Processing Enquiry...
        `;
      }

      // Simulate front-end submission delay
      setTimeout(() => {
        bookingForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Submit Appointment Enquiry</span>
            <i data-lucide="calendar-check" class="w-5 h-5"></i>
          `;
          lucide.createIcons();
        }

        if (formSuccessAlert) {
          formSuccessAlert.classList.remove('hidden');
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 900);
    });

    // Real-time error clearing on input
    bookingForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('border-red-400', 'bg-red-50/30');
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) errorSpan.classList.add('hidden');
      });
      input.addEventListener('change', () => {
        input.classList.remove('border-red-400', 'bg-red-50/30');
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (errorSpan) errorSpan.classList.add('hidden');
      });
    });
  }
});
