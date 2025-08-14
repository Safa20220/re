// ===== Enhanced JavaScript for Karmel+ Website =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Enhanced Navigation Functionality =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const headerNav = document.querySelector('.header-nav');
    
    // Enhanced smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (headerNav.classList.contains('active')) {
                    headerNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
                
                // Smooth scroll with offset for fixed header
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add active class with delay for smooth transition
                setTimeout(() => {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }, 500);
            }
        });
    });
    
    // Enhanced active navigation highlighting with throttling
    let ticking = false;
    
    function updateActiveNav() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPosition = window.scrollY + 150;
                
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
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // ===== Enhanced Header Scroll Effect =====
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;
    
    function handleHeaderScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
            
            // Hide/show header on scroll for mobile (but keep menu button visible)
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    // Only hide the nav, keep the menu button visible
                    const nav = header.querySelector('.header-nav');
                    if (nav && !nav.classList.contains('active')) {
                        header.style.transform = 'translateY(-100%)';
                    }
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    // ===== Enhanced Mobile Menu Functionality =====
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    function toggleMobileMenu() {
        headerNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (headerNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            // Ensure header is visible when menu is open
            header.style.transform = 'translateY(0)';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Enhanced mobile menu close functionality
    function closeMobileMenu() {
        headerNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!headerNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && headerNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // ===== Enhanced Scroll to Top Button =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'العودة إلى الأعلى');
    document.body.appendChild(scrollToTopBtn);
    
    function toggleScrollToTop() {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== Enhanced FAQ Functionality =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
    
    // ===== Enhanced Contact Form =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
            // Enhanced form validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
            checkFormCompletion();
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
            checkFormCompletion();
        });
    });
    
    // Check if all required fields are filled
    function checkFormCompletion() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');
        const optionalInputs = contactForm.querySelectorAll('input:not([required]), textarea:not([required])');
        
        let allRequiredFilled = true;
        let allOptionalFilled = true;
        
        // Check required fields
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                allRequiredFilled = false;
            }
        });
        
        // Check optional fields (if any have content, all should be valid)
        optionalInputs.forEach(input => {
            if (input.value.trim()) {
                if (!validateField(input)) {
                    allOptionalFilled = false;
                }
            }
        });
        
        // Change button color based on completion
        if (allRequiredFilled && allOptionalFilled) {
            submitBtn.style.background = '#7c3aed';
            submitBtn.style.boxShadow = '0 4px 15px rgba(124, 58, 237, 0.3)';
        } else {
            submitBtn.style.background = '#6b7280';
            submitBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
    }
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
                    if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const buttonText = submitBtn.querySelector('.button-text');
            const buttonLoading = submitBtn.querySelector('.button-loading');
            const originalBackground = submitBtn.style.background;
            
            // Hide normal text and show loading text
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    showSuccessModal();
                    contactForm.reset();
                    
                    // Restore button state
                    buttonText.style.display = 'inline';
                    buttonLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '#6b7280';
                    submitBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }, 2000);
            }
        });
    }
    
    // ===== Enhanced Form Validation =====
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name || field.placeholder;
        
        // Remove existing error states
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validation rules
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${name} مطلوب`;
        } else if (type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
        } else if (type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = 'يرجى إدخال رقم هاتف صحيح';
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '0.5rem';
            field.parentNode.appendChild(errorElement);
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }
    
    // ===== Enhanced Notification System =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-family: 'Tajawal', sans-serif;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // ===== انيميشن الانتقال بين الأقسام =====
    function initSectionAnimations() {
        const sections = document.querySelectorAll('.section');
        
        // إضافة كلاس active-section للقسم الأول
        if (sections.length > 0) {
            sections[0].classList.add('active-section');
        }
        
        // مراقبة التمرير لتفعيل الانيميشن
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // إزالة كلاس active-section من جميع الأقسام
                    sections.forEach(section => section.classList.remove('active-section'));
                    
                    // إضافة كلاس active-section للقسم الحالي
                    entry.target.classList.add('active-section');
                    
                    // تفعيل الانيميشن للقسم الجديد فقط (ما عدا قسم الخدمات)
                    if (!entry.target.classList.contains('scroll-animate') && 
                        !entry.target.classList.contains('services-modern-wave')) {
                        
                        entry.target.classList.add('scroll-animate');
                        
                        // إزالة كلاس الانيميشن بعد انتهائه
                        setTimeout(() => {
                            entry.target.classList.remove('scroll-animate');
                        }, 800);
                    }
                }
            });
        }, observerOptions);
        
        // مراقبة جميع الأقسام
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ===== Enhanced Touch Interactions =====
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && window.scrollY < 100) {
                // Swipe up at top - could trigger special action
            } else if (diff < 0 && window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
                // Swipe down at bottom - could trigger special action
            }
        }
    }
    
    // ===== Enhanced Performance Optimizations =====
    let scrollTimeout;
    let resizeTimeout;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            updateActiveNav();
            handleHeaderScroll();
            toggleScrollToTop();
        }, 16);
    });
    
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            // Recalculate FAQ heights
            faqItems.forEach(item => {
                const answer = item.querySelector('.faq-answer');
                if (item.classList.contains('active') && answer) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }, 250);
    });
    
    // ===== Enhanced Image Loading =====
    function preloadImages() {
        const criticalImages = [
            'full_logo (1).png',
            'i14.png',
            'circle_dark_icon.png'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // ===== Enhanced Accessibility =====
    function enhanceAccessibility() {
        // Add focus indicators
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--primary-purple)';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
        

    }
    
    // ===== Success Modal Functionality =====
    const successModal = document.getElementById('successModal');
    const successSimpleClose = document.getElementById('successSimpleClose');
    
    // Show success modal
    function showSuccessModal() {
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Close success modal
    function closeSuccessModal() {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Success modal event listeners
    if (successSimpleClose) {
        successSimpleClose.addEventListener('click', closeSuccessModal);
    }
    
    // Close success modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }
    
    // Close success modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.style.display === 'flex') {
            closeSuccessModal();
        }
    });
    
    // ===== Privacy Policy and Terms Modal Functionality =====
    const privacyPolicyLink = document.getElementById('privacyPolicyLink');
    const termsLink = document.getElementById('termsLink');
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    
    // Privacy Policy Modal
    if (privacyPolicyLink && privacyModal) {
        privacyPolicyLink.addEventListener('click', function(e) {
            e.preventDefault();
            privacyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close privacy modal
        const privacyCloseBtn = privacyModal.querySelector('.policy-close');
        if (privacyCloseBtn) {
            privacyCloseBtn.addEventListener('click', function() {
                privacyModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Terms Modal
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            termsModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close terms modal
        const termsCloseBtn = termsModal.querySelector('.policy-close');
        if (termsCloseBtn) {
            termsCloseBtn.addEventListener('click', function() {
                termsModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside
        termsModal.addEventListener('click', function(e) {
            if (e.target === termsModal) {
                termsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close modals on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (privacyModal && privacyModal.style.display === 'flex') {
                privacyModal.style.display = 'none';
                document.body.style.overflow = '';
            }
            if (termsModal && termsModal.style.display === 'flex') {
                termsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    });
    
    // ===== Initialize Everything =====
    function init() {
        preloadImages();
        enhanceAccessibility();
        
        // Initial calls
        updateActiveNav();
        handleHeaderScroll();
        toggleScrollToTop();
        
        // Initialize form completion check
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            setTimeout(() => {
                checkFormCompletion();
            }, 100);
        }
    }
    
    // ===== Utility Functions =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function initWhyKarmelSection() {
        const statNumbers = document.querySelectorAll('.why-karmel-section .stat-number');
        if (!statNumbers.length) return;

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statElement = entry.target;
                    animateStatNumber(statElement);
                    observerInstance.unobserve(statElement); // Animate only once
                }
            });
        }, {
            threshold: 0.8
        });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    function animateStatNumber(statElement) {
        const targetText = statElement.textContent || statElement.innerText;
        const finalNumber = parseInt(targetText);
        const duration = 1000;
        const steps = 20;
        const increment = finalNumber / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                current = finalNumber;
                clearInterval(timer);
            }
            
            if (statElement.textContent.includes('%')) {
                statElement.textContent = Math.round(current) + '%';
            } else if (statElement.textContent.includes('+')) {
                statElement.textContent = Math.round(current) + '+';
            } else {
                statElement.textContent = Math.round(current);
            }
        }, duration / steps);
    }

    // ===== Customer Feedback Section Functionality =====
    function initFeedbackSection() {
        const feedbackCards = document.querySelectorAll('.feedback-card');
        
        if (feedbackCards.length === 0) return;
        
        // Add intersection observer for animation
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        feedbackCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            cardObserver.observe(card);
        });
        
        // Add rating animation
        feedbackCards.forEach(card => {
            const ratingStars = card.querySelectorAll('.feedback-rating i');
            if (ratingStars.length > 0) {
                card.addEventListener('mouseenter', () => {
                    animateRatingStars(ratingStars);
                });
            }
        });
        
        // Add customer image hover effects
        feedbackCards.forEach(card => {
            const customerImage = card.querySelector('.customer-image');
            if (customerImage) {
                card.addEventListener('mouseenter', () => {
                    customerImage.style.transform = 'scale(1.1) rotate(2deg)';
                });
                
                card.addEventListener('mouseleave', () => {
                    customerImage.style.transform = 'scale(1) rotate(0deg)';
                });
            }
        });
    }

    // Animate rating stars
    function animateRatingStars(stars) {
        stars.forEach((star, index) => {
            setTimeout(() => {
                star.style.transform = 'scale(1.3) rotate(15deg)';
                star.style.color = '#f59e0b';
                
                setTimeout(() => {
                    star.style.transform = 'scale(1) rotate(0deg)';
                    star.style.color = '#fbbf24';
                }, 200);
            }, index * 100);
        });
    }

    // ===== Enhanced Navigation for New Sections =====
    function enhanceNavigationForNewSections() {
        // Smooth scroll to new sections
        const whyKarmelLink = document.querySelector('a[href="#why-karmel"]');
        const feedbackLink = document.querySelector('a[href="#feedback"]');
        
        if (whyKarmelLink) {
            whyKarmelLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = document.getElementById('why-karmel');
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
        
        if (feedbackLink) {
            feedbackLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = document.getElementById('feedback');
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // ===== Performance Optimization for New Sections =====
    function optimizeNewSections() {
        // Lazy load images in feedback section
        const customerImages = document.querySelectorAll('.customer-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            customerImages.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
        
        // Add loading states for buttons
        const ctaButtons = document.querySelectorAll('.why-karmel-btn, .feedback-btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.href.includes('#contact')) {
                    // Add loading state
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التوجيه...';
                    this.style.pointerEvents = 'none';
                    
                    // Reset after navigation
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.pointerEvents = 'auto';
                    }, 2000);
                }
            });
        });
    }

    // ===== Accessibility Enhancements for New Sections =====
    function enhanceAccessibilityForNewSections() {
        // Add ARIA labels and roles
        const whyKarmelCards = document.querySelectorAll('.why-karmel-card');
        const feedbackCards = document.querySelectorAll('.feedback-card');
        
        whyKarmelCards.forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `why-karmel-title-${index}`);
            
            const title = card.querySelector('.why-karmel-title');
            if (title) {
                title.id = `why-karmel-title-${index}`;
            }
        });
        
        feedbackCards.forEach((card, index) => {
            card.setAttribute('role', 'article');
            card.setAttribute('aria-labelledby', `feedback-title-${index}`);
            
            const title = card.querySelector('.customer-name');
            if (title) {
                title.id = `feedback-title-${index}`;
            }
        });
        
        // Add keyboard navigation
        const interactiveElements = document.querySelectorAll('.why-karmel-btn, .feedback-btn');
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    // ===== Initialize New Sections =====
    function initNewSections() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initNewSections);
            return;
        }
        
        // Initialize all new section functionality
        initWhyKarmelSection();
        initFeedbackSection();
        enhanceNavigationForNewSections();
        optimizeNewSections();
        enhanceAccessibilityForNewSections();
        
        // Add scroll-triggered animations
        const scrollTriggeredElements = document.querySelectorAll('.why-karmel-card, .feedback-card');
        
        if ('IntersectionObserver' in window) {
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });
            
            scrollTriggeredElements.forEach(el => {
                scrollObserver.observe(el);
            });
        }
    }

    // ===== Enhanced Form Validation for Contact Form =====
    function enhanceContactFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    const errorMessage = input.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                }
            });
        });
        
        // Enhanced submit handling
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Reset form
                contactForm.reset();
                inputs.forEach(input => {
                    input.classList.remove('valid');
                });
            }
        });
    }

    // ===== Services Navigation =====
    function initServicesNavigation() {
        const servicesContainer = document.querySelector('.services-container');
        const servicesScroll = document.getElementById('servicesScroll');
        const prevBtn = document.getElementById('servicesPrev');
        const nextBtn = document.getElementById('servicesNext');

        if (!servicesScroll || !prevBtn || !nextBtn) return;

        const isRTL = document.documentElement.dir === 'rtl';
        let scrollAmount = 0;

        const updateScroll = () => {
            servicesScroll.style.transform = `translateX(${isRTL ? scrollAmount : -scrollAmount}px)`;
        };

        const updateButtons = () => {
            const maxScroll = servicesScroll.scrollWidth - servicesContainer.clientWidth;
            prevBtn.disabled = scrollAmount <= 0;
            nextBtn.disabled = scrollAmount >= maxScroll;
        };

        const getStep = () => {
            const firstItem = servicesScroll.querySelector('.service-modern-item');
            if (!firstItem) return 0;
            const style = window.getComputedStyle(firstItem);
            const marginRight = parseFloat(style.marginRight) || 0;
            const marginLeft = parseFloat(style.marginLeft) || 0;
            return firstItem.offsetWidth + marginRight + marginLeft;
        };

        nextBtn.addEventListener('click', () => {
            const step = getStep();
            const maxScroll = servicesScroll.scrollWidth - servicesContainer.clientWidth;
            if (scrollAmount < maxScroll) {
                scrollAmount += step;
                if (scrollAmount > maxScroll) {
                    scrollAmount = maxScroll;
                }
                updateScroll();
                updateButtons();
            }
        });

        prevBtn.addEventListener('click', () => {
            const step = getStep();
            if (scrollAmount > 0) {
                scrollAmount -= step;
                if (scrollAmount < 0) {
                    scrollAmount = 0;
                }
                updateScroll();
                updateButtons();
            }
        });

        const debounce = (func, wait) => {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        };

        const handleResize = () => {
            scrollAmount = 0;
            updateScroll();
            updateButtons();
        };
        
        window.addEventListener('resize', debounce(handleResize, 250));

        // Initial check
        handleResize();

        // Ensure calculations are correct after everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                handleResize();
            }, 200);
        });
    }

    // ===== Accordion Functionality for Blog =====
    function initBlogAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle the clicked item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        });
    }

    // ===== Initialize Everything Including New Sections =====
    function initAll() {
        // Initialize existing functionality
        init();
        
        // Initialize new sections
        initNewSections();
        
        // Enhance contact form
        enhanceContactFormValidation();
        
        // Initialize services navigation
        initServicesNavigation();
        
        // Initialize blog accordion
        initBlogAccordion();
        
        // Initialize section animations
        initSectionAnimations();
    }

    // Call initAll when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
}); 