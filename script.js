/* ============================================================
   PORTFOLIO - INTERACTIVE JAVASCRIPT
   Rahul Sounder | Senior Manager – Data & Gen AI Engineering
   
   Features:
   - Smooth navigation scrolling
   - Navbar sticky state & active links
   - Mobile menu toggle
   - Contact form validation & submission
   - Intersection Observer animations
   - Scroll animations for sections
   ============================================================ */

// ============================================================
// 1. NAVBAR FUNCTIONALITY
// ============================================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Toggle mobile navigation menu
 */
function toggleNavMenu() {
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

/**
 * Close mobile menu when a link is clicked
 */
function closeNavMenu() {
    navMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// Add event listeners
navToggle.addEventListener('click', toggleNavMenu);

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        e.target.classList.add('active');
        // Close mobile menu
        closeNavMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        closeNavMenu();
    }
});

/**
 * Update active nav link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================================
// 2. SMOOTH SCROLL BEHAVIOR
// ============================================================

/**
 * Smooth scroll to element (fallback for browsers not supporting native smooth scroll)
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const targetPosition = element.offsetTop - 80; // Account for navbar height
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        // easeInOutQuad
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Add smooth scroll to CTA buttons and navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target === '#') return;
        smoothScroll(target);
    });
});

// ============================================================
// 3. INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================

/**
 * Trigger animations when elements come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'slide-up 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('[data-animation]').forEach(el => {
    observer.observe(el);
});

// ============================================================
// 4. CONTACT FORM VALIDATION & SUBMISSION
// ============================================================

const contactForm = document.getElementById('contactForm');
const formNotice = document.getElementById('formNotice');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Clear form errors
 */
function clearFormErrors() {
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
}

/**
 * Validate form before submission
 */
function validateContactForm() {
    clearFormErrors();
    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Name is required';
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }

    // Validate email
    if (!emailInput.value.trim()) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate message
    if (!messageInput.value.trim()) {
        document.getElementById('messageError').textContent = 'Message is required';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission
 * Note: This is a client-side validation demo. For production, implement a backend service.
 */
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateContactForm()) {
        return;
    }

    // Get form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: document.getElementById('subject').value.trim() || 'Portfolio Contact',
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };

    // Disable submit button
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // OPTION 1: If you have a backend endpoint, uncomment and modify:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to send message');
        */

        // OPTION 2: Store in localStorage for demo (client-side only)
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // OPTION 3: Send via email service like FormSubmit or Formspree
        // Uncomment the code below if using FormSubmit (free service)
        /*
        const response = await fetch('https://formsubmit.co/your-email@example.com', {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to send message');
        */

        // Show success message
        formNotice.className = 'form-notice success';
        formNotice.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        formNotice.style.display = 'block';

        // Reset form
        contactForm.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            formNotice.style.display = 'none';
        }, 5000);

    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        formNotice.className = 'form-notice error';
        formNotice.textContent = '✗ Something went wrong. Please try again or contact me directly at sounder.rahul@gmail.com';
        formNotice.style.display = 'block';

    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// ============================================================
// 5. FORM INPUT ANIMATIONS
// ============================================================

/**
 * Add focus animation to form inputs
 */
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--highlight)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
    });

    // Real-time validation
    input.addEventListener('change', validateContactForm);
});

// ============================================================
// 6. SCROLL ANIMATIONS FOR TIMELINE
// ============================================================

/**
 * Animate timeline items on scroll
 */
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slide-up 0.6s ease forwards';
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

timelineItems.forEach((item, index) => {
    item.style.animationDelay = (index * 0.1) + 's';
    timelineObserver.observe(item);
});

// ============================================================
// 7. SKILL CARDS STAGGER ANIMATION
// ============================================================

/**
 * Animate skill cards with stagger effect
 */
const skillCategories = document.querySelectorAll('.skill-category');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fade-in 0.6s ease forwards';
            skillObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

skillCategories.forEach((card, index) => {
    card.style.animationDelay = (index * 0.1) + 's';
    skillObserver.observe(card);
});

// ============================================================
// 8. BLOG CARDS ANIMATION
// ============================================================

/**
 * Animate blog cards with stagger effect
 */
const blogCards = document.querySelectorAll('.blog-card');

const blogObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animation delay is handled in CSS with style attribute
            blogObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

blogCards.forEach(card => {
    blogObserver.observe(card);
});

// ============================================================
// 9. STAT COUNTER ANIMATION
// ============================================================

/**
 * Animate stat numbers when they come into view
 */
const statCards = document.querySelectorAll('.stat-card');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumber = entry.target.querySelector('.stat-number');
            const finalNumber = parseInt(statNumber.textContent);
            let currentNumber = 0;
            const increment = Math.ceil(finalNumber / 50);

            const counter = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(counter);
                }
                statNumber.textContent = currentNumber + (finalNumber === 100 ? '+' : '+');
            }, 30);

            entry.target.classList.add('animated');
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

statCards.forEach(card => {
    statsObserver.observe(card);
});

// ============================================================
// 10. SCROLL TO TOP BUTTON (OPTIONAL)
// ============================================================

/**
 * Show/hide scroll to top button based on scroll position
 */
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTop';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(90deg, var(--highlight), var(--gold));
        color: var(--primary);
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999;
        transition: all 0.3s ease;
        font-weight: bold;
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseover', () => {
        scrollBtn.style.transform = 'translateY(-5px)';
    });

    scrollBtn.addEventListener('mouseout', () => {
        scrollBtn.style.transform = 'translateY(0)';
    });
}

// Initialize scroll to top button on load
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ============================================================
// 11. KEYBOARD NAVIGATION
// ============================================================

/**
 * Close mobile menu on Escape key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNavMenu();
    }
});

// ============================================================
// 12. INITIAL SETUP
// ============================================================

/**
 * Initialize the page on load
 */
window.addEventListener('load', () => {
    // Trigger initial active link update
    updateActiveNavLink();

    // Log portfolio loaded in console
    console.log('%c Rahul Sounder | Senior Manager – Data & Gen AI Engineering ', 
        'background: #1a1a2e; color: #00d4ff; font-size: 16px; font-weight: bold; padding: 10px;');
});

// ============================================================
// 13. PERFORMANCE: LAZY LOADING FOR IMAGES
// ============================================================

/**
 * Lazy load images (if implemented in HTML)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================================
// 14. HELPER UTILITIES
// ============================================================

/**
 * Log form messages to console (for debugging)
 */
function logContactMessages() {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    console.log('Contact Messages:', messages);
}

// Make available globally for debugging
window.logContactMessages = logContactMessages;

/**
 * Clear all stored contact messages
 */
function clearContactMessages() {
    localStorage.removeItem('contactMessages');
    console.log('Contact messages cleared');
}

window.clearContactMessages = clearContactMessages;

// ============================================================
// 15. ACCESSIBILITY IMPROVEMENTS
// ============================================================

/**
 * Ensure focus is visible on interactive elements
 */
document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--highlight);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);
