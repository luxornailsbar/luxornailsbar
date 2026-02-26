// contact-script.js - JavaScript specific to the contact page

document.addEventListener('DOMContentLoaded', function() {
    
    // Loading Screen Management (same as main page but customized)
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(hideLoadingScreen, 300);
            }
            loadingProgress.style.width = progress + '%';
        }, 150);
    }
    
    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
            
            // Add animations to contact page elements
            startContactPageAnimations();
        }, 500);
    }
    
    function startContactPageAnimations() {
        // Animate contact info cards
        document.querySelectorAll('.contact-info-card').forEach((card, index) => {
            card.style.animation = `fadeInDown 0.6s ease ${index * 0.2}s forwards`;
            card.style.opacity = '0';
        });
        
        // Animate form
        setTimeout(() => {
            const contactForm = document.querySelector('.contact-form-container');
            if (contactForm) {
                contactForm.style.animation = 'fadeInUp 0.8s ease 0.6s forwards';
                contactForm.style.opacity = '0';
            }
        }, 600);
        
        // Animate map
        setTimeout(() => {
            const mapContainer = document.querySelector('.map-container');
            if (mapContainer) {
                mapContainer.style.animation = 'fadeInUp 0.8s ease 0.8s forwards';
                mapContainer.style.opacity = '0';
            }
        }, 800);
    }
    
    // Start loading simulation
    simulateLoading();
    
    // Fallback timeout
    const loadingTimeout = setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingProgress.style.width = '100%';
            hideLoadingScreen();
        }
    }, 4000);
    
    window.addEventListener('load', function() {
        clearTimeout(loadingTimeout);
        if (loadingProgress) {
            loadingProgress.style.width = '100%';
        }
        setTimeout(hideLoadingScreen, 300);
    });
    
    // Hide scrollbar during loading
    document.body.style.overflow = 'hidden';
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            const newsletter = document.getElementById('newsletter').checked;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Get subject text
            const subjectSelect = document.getElementById('contactSubject');
            const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call (in real app, this would be fetch/axios)
            setTimeout(() => {
                // Success message
                showFormMessage(`
                    <h5>Thank you, ${name}!</h5>
                    <p>Your message has been sent successfully.</p>
                    <p><strong>Subject:</strong> ${subjectText}</p>
                    <p>We'll respond to your inquiry at <strong>${email}</strong> within 24 hours.</p>
                    ${newsletter ? '<p class="text-success">✓ You\'ve subscribed to our newsletter!</p>' : ''}
                    <p class="mt-3">Thank you for contacting Elegance Salon!</p>
                `, 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Scroll to success message
                document.querySelector('.form-message').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 1500);
        });
    }
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message alert alert-${type === 'error' ? 'danger' : 'success'} mt-3`;
        messageDiv.innerHTML = message;
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'btn-close';
        closeBtn.setAttribute('data-bs-dismiss', 'alert');
        closeBtn.setAttribute('aria-label', 'Close');
        messageDiv.appendChild(closeBtn);
        
        // Insert after form
        contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);
        
        // Auto-remove after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 10000);
        }
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('contactPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
            }
            e.target.value = value;
        });
    }
    
    // Update current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('footer p');
    if (yearElement && yearElement.textContent.includes('2023')) {
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
    
    // Initialize custom cursor (from main script, modified for contact page)
    function initContactPageCursor() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            return;
        }
        
        setTimeout(() => {
            const cursor = document.createElement('div');
            const cursorDot = document.createElement('div');
            
            cursor.className = 'custom-cursor';
            cursorDot.className = 'cursor-dot';
            
            document.body.appendChild(cursor);
            document.body.appendChild(cursorDot);
            
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            let cursorDotX = 0, cursorDotY = 0;
            
            function animateCursor() {
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;
                
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
                
                cursorDot.style.left = mouseX + 'px';
                cursorDot.style.top = mouseY + 'px';
                
                requestAnimationFrame(animateCursor);
            }
            
            document.addEventListener('mousemove', function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            animateCursor();
            
            // Add hover effects to contact page specific elements
            const hoverElements = document.querySelectorAll(
                'a, button, .contact-info-card, .form-control, .form-select, .accordion-button'
            );
            
            hoverElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    cursor.classList.add('cursor-hover');
                });
                
                element.addEventListener('mouseleave', function() {
                    cursor.classList.remove('cursor-hover');
                });
            });
            
            // Click effect
            document.addEventListener('mousedown', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });
            
            document.addEventListener('mouseup', function() {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
            
            document.addEventListener('mouseleave', function() {
                cursor.style.opacity = '0';
                cursorDot.style.opacity = '0';
            });
            
            document.addEventListener('mouseenter', function() {
                cursor.style.opacity = '1';
                cursorDot.style.opacity = '1';
            });
            
            document.body.style.cursor = 'none';
            
            setTimeout(() => {
                cursor.style.opacity = '1';
                cursorDot.style.opacity = '1';
            }, 100);
            
        }, 500);
    }
    
    // Initialize custom cursor
    initContactPageCursor();
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile navbar if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const navbarToggler = document.querySelector('.navbar-toggler');
                        if (navbarToggler) navbarToggler.click();
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Make contact link active in navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'contact.html' || 
            (window.location.pathname.includes('contact.html') && link.getAttribute('href') === 'contact.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Accordion enhancement
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add animation class
            const accordionBody = this.nextElementSibling;
            accordionBody.style.transition = 'all 0.3s ease';
        });
    });
    
    // Social media links click tracking (for analytics)
    const socialLinks = document.querySelectorAll('.social-contact a, .social-icons a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.querySelector('i').className.split('bi-')[1];
            console.log(`Social media click: ${platform}`);
            // In a real application, you would send this to your analytics platform
        });
    });
});