// cursor.js - Custom cursor for desktop devices only

document.addEventListener('DOMContentLoaded', function() {
    // Check if device is touch-enabled
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        return; // Don't add custom cursor on touch devices
    }
    
    // Create cursor elements
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    
    cursor.className = 'custom-cursor';
    cursorDot.className = 'cursor-dot';
    
    // Add to DOM
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    // Mouse move tracking
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let cursorDotX = 0;
    let cursorDotY = 0;
    
    // Smooth cursor movement
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
    
    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Start animation
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll(
        'a, button, .service-card, .nav-link, .btn, input, textarea, select'
    );
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
            document.body.style.cursor = 'none';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', function() {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Hide/show cursor
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Make sure cursor is visible when page loads
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
});