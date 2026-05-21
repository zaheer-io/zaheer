/*
 * Premium Portfolio Interactivity Engine
 * Muhammed Zaheer R
 * Native Vanilla JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initScrollProgress();
  initStickyNavbar();
  initScrollSpy();
  initMobileMenu();
  initScrollReveal();
  initProjectFilters();
  initContactForm();
});

/**
 * 1. Scroll Progress Indicator Bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/**
 * 2. Sticky Navbar Visual Toggle
 */
function initStickyNavbar() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('glass-nav', 'py-4');
      nav.classList.remove('py-6', 'bg-transparent');
    } else {
      nav.classList.remove('glass-nav', 'py-4');
      nav.classList.add('py-6', 'bg-transparent');
    }
  });
}

/**
 * 3. Scroll Spy (Dynamic Active Nav Item Highlight)
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 160; // offset for nav height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-indigo-600', 'font-semibold', 'border-b-2', 'border-indigo-600');
      
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('text-indigo-600', 'font-semibold');
        // If desktop link, add subtle bottom indicator
        if (link.classList.contains('desktop-link')) {
          link.classList.add('border-b-2', 'border-indigo-600');
        }
      }
    });
  });
}

/**
 * 4. Responsive Mobile Navigation Drawer
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = (open) => {
    if (open) {
      mobileMenu.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden'; // prevent scrolling
    } else {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.overflow = ''; // restore scrolling
    }
  };

  menuBtn.addEventListener('click', () => toggleMenu(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/**
 * 5. Scroll Reveal Engine (IntersectionObserver)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once it reveals, we can unobserve if we want static animation triggers
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // triggers slightly before entering fully
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/**
 * 6. Dynamic Project Category Filtering
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-container');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-200');
        b.classList.add('bg-white', 'text-stone-600', 'hover:bg-stone-50', 'border', 'border-stone-200');
      });

      // Add active state
      btn.classList.remove('bg-white', 'text-stone-600', 'hover:bg-stone-50', 'border', 'border-stone-200');
      btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-200');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden-filter');
          // Add a subtle entrance scale/fade
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden-filter');
        }
      });
    });
  });
}

/**
 * 7. Interactive Contact Form with Success Feedback Loops
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Input Validations
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
      showFormToast('Please fill out all fields before submitting.', 'error');
      return;
    }

    // Capture standard data for visualization / future endpoint bindings
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: msgInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Transition Button State into Premium Spinner
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending message...
    `;

    // Simulate Network Latency
    setTimeout(() => {
      // Complete visual success animation sequence
      submitBtn.classList.remove('bg-gradient-premium');
      submitBtn.classList.add('bg-emerald-600');
      submitBtn.innerHTML = `
        <svg class="w-5 h-5 mr-2 inline-block animate-bounce" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
        </svg>
        Message Sent Successfully!
      `;

      showFormToast(`Thank you, ${formData.name}! Your message has been sent to Muhammed.`, 'success');
      
      // Store in LocalStorage as mock inbox for recruiter proof-of-work
      try {
        const storedMessages = JSON.parse(localStorage.getItem('zaheer_portfolio_messages') || '[]');
        storedMessages.push(formData);
        localStorage.setItem('zaheer_portfolio_messages', JSON.stringify(storedMessages));
      } catch (err) {
        console.error('LocalStorage save issue: ', err);
      }

      // Reset form controls
      form.reset();

      // Reset button layout after brief window
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('bg-emerald-600');
        submitBtn.classList.add('bg-gradient-premium');
        submitBtn.innerHTML = originalBtnHTML;
      }, 4000);

    }, 1500);
  });
}

/**
 * Custom micro-feedback Toast notification system
 */
function showFormToast(message, type = 'success') {
  // Check if active container exists, else construct
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-rose-500';
  const iconSvg = type === 'success' 
    ? `<svg class="w-5 h-5 ${iconColor}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg class="w-5 h-5 ${iconColor}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

  toast.className = `flex items-start gap-3 p-4 rounded-xl border ${bgColor} shadow-lg transition-all duration-300 transform translate-y-10 opacity-0`;
  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 text-sm font-medium leading-relaxed">${message}</div>
    <button class="text-stone-400 hover:text-stone-600 transition-colors" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Trigger animations
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 10);

  // Auto-terminate after 4 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'scale-90');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
