// JavaScript for Elegance Salon Website

document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // LOADING SCREEN FUNCTIONALITY
    // ==============================
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');

    // Simulate loading progress
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);

                // Wait a bit more for all resources to load
                setTimeout(hideLoadingScreen, 300);
            }
            loadingProgress.style.width = progress + '%';
        }, 150);
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');

        // Remove from DOM after animation completes
        setTimeout(() => {
            loadingScreen.style.display = 'none';

            // Show scrollbar
            document.body.style.overflow = 'visible';

            // Trigger any animations that should start after loading
            startPageAnimations();
        }, 500);
    }

    function startPageAnimations() {
        // Add entrance animation to hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroText = document.querySelector('.hero-text');
        const heroButtons = document.querySelector('.hero-section .mt-4');

        if (heroTitle) {
            heroTitle.style.animation = 'fadeInDown 1s ease forwards';
            heroTitle.style.opacity = '0';
        }

        if (heroText) {
            setTimeout(() => {
                heroText.style.animation = 'fadeInDown 0.8s ease 0.3s forwards';
                heroText.style.opacity = '0';
            }, 300);
        }

        if (heroButtons) {
            setTimeout(() => {
                heroButtons.style.animation = 'fadeInDown 0.8s ease 0.6s forwards';
                heroButtons.style.opacity = '0';
            }, 600);
        }

        // Add subtle animation to service cards
        setTimeout(() => {
            document.querySelectorAll('.service-card').forEach((card, index) => {
                card.style.animation = `fadeInDown 0.6s ease ${index * 0.1}s forwards`;
                card.style.opacity = '0';
            });
        }, 800);

        // Add animation to team cards
        setTimeout(() => {
            document.querySelectorAll('.staff-card').forEach((card, index) => {
                card.style.animation = `fadeInDown 0.6s ease ${index * 0.1}s forwards`;
                card.style.opacity = '0';
            });
        }, 1000);
    }

    // Start loading simulation
    simulateLoading();

    // Hide loading screen if page takes too long
    const loadingTimeout = setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingProgress.style.width = '100%';
            hideLoadingScreen();
        }
    }, 4000);

    // Check if page is already loaded
    window.addEventListener('load', function () {
        clearTimeout(loadingTimeout);
        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }
        setTimeout(hideLoadingScreen, 300);
    });

    // Hide scrollbar during loading
    document.body.style.overflow = 'hidden';

    // ==============================
    // CUSTOM CURSOR FUNCTIONALITY
    // ==============================
    function initCustomCursor() {
        // Check if device is touch-enabled (mobile/tablet)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            return; // Don't add custom cursor on touch devices
        }

        // Wait until loading is complete to add cursor
        setTimeout(() => {
            // Create cursor elements
            const cursor = document.createElement('div');
            const cursorDot = document.createElement('div');

            cursor.className = 'custom-cursor';
            cursorDot.className = 'cursor-dot';

            document.body.appendChild(cursor);
            document.body.appendChild(cursorDot);

            // Smooth movement variables
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            let cursorDotX = 0, cursorDotY = 0;

            // Smooth cursor animation
            function animateCursor() {
                // Smooth movement for outer cursor
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;

                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';

                // Immediate movement for dot cursor
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';

                requestAnimationFrame(animateCursor);
            }

            // Track mouse movement
            document.addEventListener('mousemove', function (e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Start animation
            animateCursor();

            // Add hover effects to interactive elements
            const hoverElements = document.querySelectorAll(
                'a, button, .service-card, .nav-link, .btn, input, textarea, select, .staff-card'
            );

            hoverElements.forEach(element => {
                element.addEventListener('mouseenter', function () {
                    cursor.classList.add('cursor-hover');
                });

                element.addEventListener('mouseleave', function () {
                    cursor.classList.remove('cursor-hover');
                });
            });

            // Click effect
            document.addEventListener('mousedown', function () {
                cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });

            document.addEventListener('mouseup', function () {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            // Hide/show cursor when leaving/entering window
            document.addEventListener('mouseleave', function () {
                cursor.style.opacity = '0';
                cursorDot.style.opacity = '0';
            });

            document.addEventListener('mouseenter', function () {
                cursor.style.opacity = '1';
                cursorDot.style.opacity = '1';
            });

            // Hide default cursor
            document.body.style.cursor = 'none';

            // Make sure cursor is visible when initialized
            setTimeout(() => {
                cursor.style.opacity = '1';
                cursorDot.style.opacity = '1';
            }, 100);

        }, 500); // Delay cursor initialization until after loading
    }

    // Initialize custom cursor
    initCustomCursor();

    // ==============================
    // NAVBAR SCROLL EFFECT
    // ==============================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // ==============================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile navbar if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    if (navbarToggler) navbarToggler.click();
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==============================
    // BOOKING FORM HANDLING
    // ==============================
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !phone || !service || !date || !time) {
                alert('Please fill in all required fields.');
                return;
            }

            // In a real application, you would send this data to a server
            // For this example, we'll just show a success message
            const serviceSelect = document.getElementById('service');
            const timeSelect = document.getElementById('time');
            const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
            const timeText = timeSelect.options[timeSelect.selectedIndex].text;

            const confirmationMessage = `
                Thank you, ${name}!
                
                Your appointment has been booked:
                - Service: ${serviceText}
                - Date: ${new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}
                - Time: ${timeText}
                
                We will contact you at ${phone} to confirm your appointment.
                
                ${message ? `Your message: "${message}"` : ''}
            `;

            alert(confirmationMessage);

            // Reset form
            bookingForm.reset();

            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('date').value = tomorrow.toISOString().split('T')[0];

            // Scroll to top of form
            bookingForm.scrollIntoView({ behavior: 'smooth' });
        });

        // Set min date to today
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // ==============================
    // SCROLL ANIMATIONS FOR ELEMENTS
    // ==============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Observe staff cards
    document.querySelectorAll('.staff-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    // ==============================
    // UPDATE CURRENT YEAR IN FOOTER
    // ==============================
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p');
    if (yearElement && yearElement.textContent.includes('2023')) {
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }

    // ==============================
    // HIGHLIGHT CURRENT SECTION IN NAVBAR
    // ==============================
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);

    // Initialize with current section
    highlightCurrentSection();

    // ==============================
    // ADDITIONAL ENHANCEMENTS
    // ==============================

    // Service card hover enhancement
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form input focus effects
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    // Back to top button functionality (optional)
    function addBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '<i class="bi bi-chevron-up"></i>';
        backToTopButton.className = 'btn btn-primary back-to-top';
        backToTopButton.style.position = 'fixed';
        backToTopButton.style.bottom = '30px';
        backToTopButton.style.right = '30px';
        backToTopButton.style.zIndex = '99';
        backToTopButton.style.borderRadius = '50%';
        backToTopButton.style.width = '50px';
        backToTopButton.style.height = '50px';
        backToTopButton.style.display = 'none';
        backToTopButton.style.justifyContent = 'center';
        backToTopButton.style.alignItems = 'center';

        document.body.appendChild(backToTopButton);

        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
    }

    //    const contactForm = document.getElementById('contactForm');
    //    if (contactForm) {
    //        contactForm.addEventListener('submit', function (e) {
    //            e.preventDefault();
    //
    //            // Get form values
    //            const name = document.getElementById('contactName').value;
    //            const email = document.getElementById('contactEmail').value;
    //            const subject = document.getElementById('contactSubject').value;
    //            const message = document.getElementById('contactMessage').value;
    //
    //            // Simple validation
    //            if (!name || !email || !subject || !message) {
    //                alert('Please fill in all required fields.');
    //                return;
    //            }
    //
    //            // Get subject text
    //            const subjectSelect = document.getElementById('contactSubject');
    //            const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    //
    //            // Success message
    //            const successMessage = `
    //                Thank you, ${name}!
    //                
    //                Your message has been sent successfully.
    //                
    //                Subject: ${subjectText}
    //                
    //                We'll respond to your inquiry at ${email} within 24 hours.
    //                
    //                Thank you for contacting Elegance Salon!
    //            `;
    //
    //            alert(successMessage);
    //
    //            // Reset form
    //            contactForm.reset();
    //
    //            // Scroll to top of form
    //            contactForm.scrollIntoView({ behavior: 'smooth' });
    //        });
    //    }

    // Initialize back to top button
    addBackToTopButton();
});


// for notify
// notification-integration.js - Integration of notification system into existing website
// Add this to your scripts.js file or include as separate script

document.addEventListener('DOMContentLoaded', function () {
    // Initialize notification system
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }

    // Show welcome notification after page loads (only once per session)
    if (!sessionStorage.getItem('luxor_welcome_shown')) {
        setTimeout(() => {
            notificationSystem.showWelcomeMessage();
            sessionStorage.setItem('luxor_welcome_shown', 'true');
        }, 2000);
    }

    // Booking form success notification
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const service = document.getElementById('service').value;
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;

            // Show booking confirmation notification
            const appointmentDetails = {
                service: service,
                date: new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: time
            };

            notificationSystem.showBookingConfirmation(appointmentDetails);

            // Reset form
            bookingForm.reset();
        });
    }

    // Contact form success notification
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;

            notificationSystem.showSuccess(
                `Thank you ${name}! Your message has been sent. We'll get back to you within 24 hours.`,
                'Message Sent!'
            );

            contactForm.reset();
        });
    }

    // Show promotion notification based on time of day
    function showTimedPromotions() {
        const hour = new Date().getHours();

        // Morning promotion (9 AM - 12 PM)
        if (hour >= 9 && hour < 12) {
            setTimeout(() => {
                notificationSystem.showPromotion(
                    'Enjoy 20% off all morning appointments (before 12 PM). Limited time offer!',
                    'Morning Special!'
                );
            }, 5000);
        }
        // Evening promotion (4 PM - 8 PM)
        else if (hour >= 16 && hour < 20) {
            setTimeout(() => {
                notificationSystem.showPromotion(
                    'Relax after work with our evening spa specials. Book your appointment now!',
                    'Evening Relaxation'
                );
            }, 5000);
        }
    }

    // Show timed promotions after page loads
    setTimeout(showTimedPromotions, 3000);

    // Newsletter subscription notification
    const newsletterForms = document.querySelectorAll('form input[type="checkbox"][id*="newsletter"]');
    newsletterForms.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                notificationSystem.showSuccess(
                    'Thank you for subscribing to our newsletter! You\'ll receive beauty tips and exclusive offers.',
                    'Subscribed!'
                );
            }
        });
    });

    // Social media follow notification
    const socialLinks = document.querySelectorAll('.social-icons a, .social-contact a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const platform = this.querySelector('i').className.split('bi-')[1];

            notificationSystem.showInfo(
                `Thank you for connecting with us on ${platform}! Follow us for updates and promotions.`,
                'Social Connection'
            );
        });
    });

    // Service selection notification
    const serviceLinks = document.querySelectorAll('a[href*="services"]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (this.textContent.includes('View All')) {
                notificationSystem.showInfo(
                    'Browse our complete menu of premium beauty services and treatments.',
                    'Service Menu'
                );
            }
        });
    });

    // Team member click notification
    const teamCards = document.querySelectorAll('.staff-card');
    teamCards.forEach(card => {
        card.addEventListener('click', function () {
            const name = this.querySelector('h5').textContent;
            const job = this.querySelector('.text-muted').textContent;

            notificationSystem.showInfo(
                `${name} is our expert ${job}. Book an appointment with ${name} for personalized service.`,
                'Meet Our Expert'
            );
        });
    });

    // Offline/Online status notifications
    window.addEventListener('online', function () {
        notificationSystem.showSuccess(
            'You\'re back online! All features are now available.',
            'Connection Restored'
        );
    });

    window.addEventListener('offline', function () {
        notificationSystem.showWarning(
            'You\'re currently offline. Some features may be limited.',
            'Connection Lost'
        );
    });

    // Page transition notifications
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const section = this.getAttribute('href').substring(1);
            const sectionNames = {
                'home': 'Home',
                'about': 'About Us',
                'services': 'Services',
                'team': 'Our Team',
                'testimonials': 'Testimonials',
                'booking': 'Booking',
                'contact': 'Contact'
            };

            if (sectionNames[section]) {
                notificationSystem.showInfo(
                    `Navigating to ${sectionNames[section]} section...`,
                    ''
                );
            }
        });
    });

    // Add notification bell to navbar for mobile users
    function addNotificationBell() {
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar || document.querySelector('#notification-bell')) return;

        const bellItem = document.createElement('li');
        bellItem.className = 'nav-item d-lg-none';

        const bellLink = document.createElement('a');
        bellLink.id = 'notification-bell';
        bellLink.className = 'nav-link';
        bellLink.href = '#';
        bellLink.innerHTML = '<i class="bi bi-bell"></i>';
        bellLink.title = 'Notifications';

        bellItem.appendChild(bellLink);
        navbar.insertBefore(bellItem, navbar.lastElementChild);

        // Add badge for unread notifications
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = '0';
        bellLink.appendChild(badge);

        bellLink.addEventListener('click', function (e) {
            e.preventDefault();
            notificationSystem.showNotification({
                type: 'info',
                title: 'Notifications',
                message: 'Your notifications will appear here. You can also view them in the top right corner.',
                autoHide: true
            });
        });
    }

    setTimeout(addNotificationBell, 1000);

    // Keyboard shortcuts for notifications
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + N to show test notification
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            notificationSystem.showInfo(
                'This is a test notification. Use Ctrl/Cmd + C to clear all notifications.',
                'Test Notification'
            );
        }

        // Ctrl/Cmd + C to clear notifications
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            notificationSystem.clearAllNotifications();
            notificationSystem.showSuccess(
                'All notifications have been cleared.',
                'Notifications Cleared'
            );
        }
    });
});