/**
 * PORTFOLIO - KABISH
 * Interactive JavaScript (HTML5 + CSS3 + Vanilla JS)
 * Finalized Emerald Green Theme
 * Handles: Active Navigation, Mobile Menu, Gmail Mode Switcher, Email Copy, Form Submission & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elements & Constants ---
  const KABISH_EMAIL = 'kabishdirector@gmail.com';

  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinksList = document.getElementById('navLinksList');

  // Contact / Gmail Elements
  const gmailToggleButtons = document.querySelectorAll('.toggle-option-btn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactForm = document.getElementById('contactForm');
  const gmailSendActionBtn = document.getElementById('gmailSendActionBtn');
  const sendButtonText = document.getElementById('sendButtonText');
  const toastNotice = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  // Modal Elements
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentTitle = document.getElementById('modalContentTitle');
  const modalContentBadge = document.getElementById('modalContentBadge');
  const modalContentDesc = document.getElementById('modalContentDesc');
  const modalFeatureList = document.getElementById('modalFeatureList');
  const modalExternalLink = document.getElementById('modalExternalLink');

  // Current Gmail Mode: 'gmail' (Web) | 'default' (Mailto) | 'copy' (Clipboard)
  let currentMailMode = 'gmail';

  // ==========================================================================
  // 1. STICKY HEADER & ACTIVE SECTION HIGHLIGHTING
  // ==========================================================================
  const handleScroll = () => {
    // Header shadow on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active navigation link tracking
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Mobile Menu Toggle
  if (mobileMenuBtn && navLinksList) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinksList.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 2. GMAIL TOGGLE & EMAIL COMPOSER
  // "Contact - Gmail toggle (to kabishdirector@gmail.com)"
  // ==========================================================================

  // Update visual state and button labels based on selected toggle mode
  const updateGmailToggleState = (mode) => {
    currentMailMode = mode;

    gmailToggleButtons.forEach(btn => {
      const btnMode = btn.getAttribute('data-mode');
      if (btnMode === mode) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    if (sendButtonText) {
      if (mode === 'gmail') {
        sendButtonText.textContent = 'Compose in Gmail Web App ↗';
      } else if (mode === 'default') {
        sendButtonText.textContent = 'Open in System Mail Client ✉️';
      } else if (mode === 'copy') {
        sendButtonText.textContent = 'Copy Address & Details 📋';
      }
    }
  };

  gmailToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      updateGmailToggleState(mode);

      if (mode === 'copy') {
        copyEmailAddress();
      } else {
        showToast(`Contact mode set to: ${mode === 'gmail' ? 'Gmail Web Composer' : 'Default Mail Client'}`);
      }
    });
  });

  // Copy Email to Clipboard helper
  const copyEmailAddress = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(KABISH_EMAIL).then(() => {
        if (copyEmailBtn) {
          copyEmailBtn.classList.add('copied');
          copyEmailBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
          `;
          setTimeout(() => {
            copyEmailBtn.classList.remove('copied');
            copyEmailBtn.innerHTML = `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Address
            `;
          }, 3000);
        }
        showToast(`Copied ${KABISH_EMAIL} to clipboard!`);
      }).catch(() => {
        fallbackCopyTextToClipboard(KABISH_EMAIL);
      });
    } else {
      fallbackCopyTextToClipboard(KABISH_EMAIL);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${KABISH_EMAIL} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${KABISH_EMAIL}`);
    }
    document.body.removeChild(textArea);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmailAddress);
  }

  // Handle Contact Form Submission via Gmail or Mailto
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('senderName')?.value.trim() || 'Visitor';
      const senderSubject = document.getElementById('senderSubject')?.value.trim() || 'Collaboration Inquiry from Portfolio';
      const senderMessage = document.getElementById('senderMessage')?.value.trim() || 'Hi Kabish, I came across your portfolio and would like to discuss a project.';

      const formattedSubject = `[Portfolio] ${senderSubject} - from ${senderName}`;
      const formattedBody = `Name: ${senderName}\n\nMessage:\n${senderMessage}\n\n---\nSent via Kabish Portfolio Contact Form`;

      if (currentMailMode === 'gmail') {
        // Direct Web Gmail Compose URL
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(KABISH_EMAIL)}&su=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
        showToast('Opening Gmail web composer...');
      } else if (currentMailMode === 'default') {
        // Mailto protocol
        const mailtoUrl = `mailto:${KABISH_EMAIL}?subject=${encodeURIComponent(formattedSubject)}&body=${encodeURIComponent(formattedBody)}`;
        window.location.href = mailtoUrl;
        showToast('Opening your default mail client...');
      } else if (currentMailMode === 'copy') {
        // Copy text + email
        const fullCopyText = `To: ${KABISH_EMAIL}\nSubject: ${formattedSubject}\n\n${formattedBody}`;
        navigator.clipboard.writeText(fullCopyText).then(() => {
          showToast('Message details copied! You can paste into your email.');
        });
      }
    });
  }

  // Quick Action Buttons in Hero / Nav linking to Gmail
  const quickGmailTriggers = document.querySelectorAll('.trigger-gmail-quick');
  quickGmailTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultSubject = encodeURIComponent('Hi Kabish - Project Inquiry');
      const defaultBody = encodeURIComponent('Hi Kabish,\n\nI was browsing your portfolio and would love to connect regarding web development opportunities.');
      const directUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(KABISH_EMAIL)}&su=${defaultSubject}&body=${defaultBody}`;
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    });
  });

  // ==========================================================================
  // 3. PROJECT MODALS & DEEP DIVES
  // (Especially for E-Billing Swiggy Software and interactive previews)
  // ==========================================================================
  const projectDatabase = {
    'picxels-media': {
      badge: 'Frontend Development • Web Media Agency',
      title: 'Picxels Media Frontend Page',
      desc: 'A responsive and high-impact digital frontend crafted for Picxels Media agency. Built with modular HTML5, modern CSS grid systems, and fluid micro-interactions to showcase high-resolution creative works, client reels, and agency services.',
      features: [
        '⚡ High performance responsive layout optimized for desktop, tablet, and mobile',
        '🎨 Creative agency aesthetic with sleek dark gradients and media showcases',
        '📱 Fully cross-browser verified with fluid animations and rapid load times',
        '🌐 Live deployment on Netlify with automated CI/CD pipeline'
      ],
      linkText: 'Visit Live Site: picxelsmedia.netlify.app',
      linkUrl: 'https://picxelsmedia.netlify.app'
    },
    'ebilling-swiggy': {
      badge: 'POS Software • Web & API Integration',
      title: 'E-Billing with Swiggy Integration Software',
      desc: 'An enterprise-grade point-of-sale and digital billing application built to streamline restaurant operations. Bridges live kitchen order ticketing with automated Swiggy online order ingestion, GST tax invoice generation, and real-time inventory synchronization.',
      features: [
        '🍽️ Automated Swiggy Online Order Ingestion & Live Kitchen Display (KDS)',
        '🧾 Instant GST-compliant digital invoice generation with thermal printer support',
        '📊 Daily sales summaries, revenue breakdown, and order status tracking',
        '🔄 Offline-resilient billing state with synchronized cloud reconciliation',
        '💡 Rapid multi-table POS management tailored for fast-paced hospitality environments'
      ],
      linkText: 'Contact for Live Demonstration & Source',
      linkUrl: '#contact'
    },
    'personal-portfolio': {
      badge: 'Portfolio • Modern Web Experience',
      title: 'Personal Portfolio Showcase',
      desc: 'Kabish\'s dedicated web developer portfolio highlighting full-stack coding capabilities, academic credentials at KGCAS, technical projects, and creative interface engineering.',
      features: [
        '✨ Clean, typography-focused modern minimalist layout',
        '🎯 Interactive project showcases and live Netlify deployments',
        '📍 Direct local profile highlighting student journey at Sathyamangalam, India',
        '📬 Seamless multi-channel contact integration featuring direct Gmail composer'
      ],
      linkText: 'Visit Live Site: kabishp.netlify.app',
      linkUrl: 'https://kabishp.netlify.app'
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectDatabase[projectId];
    if (!data || !projectModal) return;

    modalContentBadge.textContent = data.badge;
    modalContentTitle.textContent = data.title;
    modalContentDesc.textContent = data.desc;

    // Populate features
    modalFeatureList.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.className = 'modal-feature-item';
      li.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${feature}</span>
      `;
      modalFeatureList.appendChild(li);
    });

    // Populate link
    if (modalExternalLink) {
      modalExternalLink.textContent = data.linkText;
      modalExternalLink.setAttribute('href', data.linkUrl);
      if (data.linkUrl.startsWith('http')) {
        modalExternalLink.setAttribute('target', '_blank');
        modalExternalLink.setAttribute('rel', 'noopener noreferrer');
      } else {
        modalExternalLink.removeAttribute('target');
        modalExternalLink.removeAttribute('rel');
        modalExternalLink.addEventListener('click', () => {
          closeProjectModal();
        });
      }
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Wire up detail buttons
  const modalTriggerButtons = document.querySelectorAll('[data-modal-target]');
  modalTriggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      openProjectModal(targetId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Keyboard escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // ==========================================================================
  // 4. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  let toastTimeout;
  function showToast(message) {
    if (!toastNotice || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotice.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // 5. BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
