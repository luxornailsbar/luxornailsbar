// notifications.js - Complete Enhanced Notification System for Luxor Nails Bar
// Black background with white text and gold accents theme

class NotificationSystem {
    constructor() {
        this.notificationContainer = null;
        this.notificationCount = 0;
        this.maxNotifications = 5;
        this.autoHideDelay = 5000; // 5 seconds

        // Notification preferences
        this.notificationPreferences = {
            soundEnabled: true,
            desktopEnabled: true,
            autoHide: true,
            position: 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        };

        this.initialize();
    }

    initialize() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            this.createNotificationContainer();
        } else {
            this.notificationContainer = document.getElementById('notification-container');
        }

        // Load preferences
        this.loadPreferences();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Create notification badge in navbar if needed
        this.createNotificationBadge();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
        this.notificationContainer = container;

        // Set position based on preferences
        this.setContainerPosition();
    }

    createNotificationBadge() {
        // Check if navbar exists
        const navbarNav = document.querySelector('.navbar-nav');
        if (!navbarNav) return;

        // Check if notification dropdown already exists
        if (document.getElementById('notificationDropdown')) return;

        // Create notification dropdown
        const notificationItem = document.createElement('li');
        notificationItem.className = 'nav-item dropdown';
        notificationItem.innerHTML = `
            <a class="nav-link position-relative" href="#" id="notificationDropdown" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-gold notification-badge">
                    <span class="notification-count">0</span>
                    <span class="visually-hidden">unread notifications</span>
                </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end notification-dropdown p-3" aria-labelledby="notificationDropdown" style="min-width: 300px; max-height: 400px; overflow-y: auto;">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0 text-gold">Notifications</h6>
                    <button type="button" class="btn btn-sm btn-outline-gold btn-clear-all" onclick="notificationSystem.clearAllNotifications()">
                        <i class="bi bi-trash"></i> Clear All
                    </button>
                </div>
                <hr class="my-2">
                <div class="notification-list">
                    <div class="notification-empty text-center py-4">
                        <i class="bi bi-bell-slash text-muted fs-1 mb-2"></i>
                        <p class="text-muted mb-0">No notifications yet</p>
                        <small class="text-muted">Your notifications will appear here</small>
                    </div>
                </div>
                <div class="mt-2 text-center">
                    <a href="#" class="btn btn-sm btn-outline-gold btn-settings" onclick="notificationSystem.showSettings()">
                        <i class="bi bi-gear"></i> Settings
                    </a>
                </div>
            </ul>
        `;

        // Add to navbar (before the last item to keep it on the right)
        const navItems = navbarNav.children;
        if (navItems.length > 1) {
            navbarNav.insertBefore(notificationItem, navItems[navItems.length - 1]);
        } else {
            navbarNav.appendChild(notificationItem);
        }

        // Hide badge initially
        document.querySelector('.notification-badge').style.display = 'none';
    }

    showNotification(options) {
        const notificationId = `notification-${Date.now()}-${this.notificationCount++}`;

        // Create notification element
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification notification-${options.type || 'info'}`;

        // Set icon based on type
        let icon = 'bi-info-circle';
        switch (options.type) {
            case 'success': icon = 'bi-check-circle'; break;
            case 'warning': icon = 'bi-exclamation-triangle'; break;
            case 'error': icon = 'bi-x-circle'; break;
            case 'booking': icon = 'bi-calendar-check'; break;
            case 'promotion': icon = 'bi-gift'; break;
            default: icon = 'bi-info-circle';
        }

        // Add category badge if specified
        const categoryBadge = options.category ?
            `<span class="notification-category">${options.category}</span>` : '';

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="bi ${icon}"></i>
            </div>
            <div class="notification-content">
                ${categoryBadge}
                <div class="notification-title">${options.title || 'Notification'}</div>
                <div class="notification-message">${options.message}</div>
                ${options.action ? `
                <div class="notification-actions mt-2">
                    ${options.action.label ? `<a href="${options.action.url || '#'}" class="btn btn-sm btn-outline-gold">${options.action.label}</a>` : ''}
                </div>` : ''}
            </div>
            <button type="button" class="notification-close" onclick="notificationSystem.removeNotification('${notificationId}')">
                <i class="bi bi-x"></i>
            </button>
            <div class="notification-progress"></div>
        `;

        // Add to container
        this.notificationContainer.appendChild(notification);

        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
            notification.classList.add('new');

            // Start progress bar if auto-hide is enabled
            if (options.autoHide !== false && this.notificationPreferences.autoHide) {
                this.startProgressBar(notification, options.autoHideDelay || this.autoHideDelay);
            }

            // Play sound if specified and enabled
            if (options.sound && this.notificationPreferences.soundEnabled) {
                this.playNotificationSound(options.sound);
            }

            // Add to dropdown list
            this.addToNotificationDropdown({
                ...options,
                id: notificationId,
                icon: icon,
                timestamp: new Date()
            });

            // Trigger callback
            if (options.onShow) options.onShow();
        }, 10);

        // Limit number of notifications
        this.limitNotifications();

        return notificationId;
    }

    startProgressBar(notification, duration) {
        const progressBar = notification.querySelector('.notification-progress');
        if (!progressBar) return;

        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';

        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, duration);
    }

    removeNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;

        notification.classList.add('removing');

        // Remove from dropdown list
        this.removeFromNotificationDropdown(notificationId);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.updateNotificationBadge();
        }, 300);
    }

    clearAllNotifications() {
        const notifications = this.notificationContainer.querySelectorAll('.notification');
        notifications.forEach(notification => {
            this.removeNotification(notification.id);
        });

        // Clear dropdown list
        this.clearNotificationDropdown();
    }

    limitNotifications() {
        const notifications = this.notificationContainer.querySelectorAll('.notification');
        if (notifications.length > this.maxNotifications) {
            const oldestNotification = notifications[0];
            this.removeNotification(oldestNotification.id);
        }
    }

    playNotificationSound(soundType) {
        // Simple notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different notification types
            switch (soundType) {
                case 'success':
                    oscillator.frequency.value = 800;
                    break;
                case 'error':
                    oscillator.frequency.value = 400;
                    break;
                case 'gentle':
                default:
                    oscillator.frequency.value = 600;
            }

            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;

            oscillator.start();

            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    // Dropdown management methods
    addToNotificationDropdown(notification) {
        const notificationList = document.querySelector('.notification-list');
        const emptyState = document.querySelector('.notification-empty');

        if (emptyState) {
            emptyState.style.display = 'none';
        }

        if (notificationList) {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'dropdown-item notification-dropdown-item p-2 mb-2';
            notificationItem.dataset.id = notification.id;

            const timeAgo = this.getTimeAgo(notification.timestamp);

            notificationItem.innerHTML = `
                <div class="d-flex w-100">
                    <div class="me-3">
                        <i class="bi ${notification.icon} text-gold fs-5"></i>
                    </div>
                    <div class="flex-grow-1">
                        ${notification.category ? `<span class="badge bg-gold-light text-dark mb-1">${notification.category}</span>` : ''}
                        <h6 class="mb-1">${notification.title}</h6>
                        <p class="mb-0 small">${notification.message}</p>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                    <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="notificationSystem.removeNotification('${notification.id}')">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `;

            // Add click event to show full notification
            notificationItem.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    this.showNotificationModal(notification);
                }
            });

            notificationList.prepend(notificationItem);
            this.updateNotificationBadge();
        }
    }

    removeFromNotificationDropdown(notificationId) {
        const notificationItem = document.querySelector(`.notification-dropdown-item[data-id="${notificationId}"]`);
        if (notificationItem) {
            notificationItem.remove();

            // Show empty state if no notifications left
            const notificationList = document.querySelector('.notification-list');
            if (notificationList && notificationList.children.length === 0) {
                const emptyState = document.querySelector('.notification-empty');
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
        }
    }

    clearNotificationDropdown() {
        const notificationList = document.querySelector('.notification-list');
        if (notificationList) {
            notificationList.innerHTML = '';

            const emptyState = document.querySelector('.notification-empty');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-count');
        if (badge) {
            const count = this.notificationContainer.querySelectorAll('.notification').length;
            badge.textContent = count;
            badge.parentElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';

        return 'Just now';
    }

    // Preferences management
    loadPreferences() {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            this.notificationPreferences = JSON.parse(saved);
        }
    }

    savePreferences() {
        localStorage.setItem('notificationPreferences', JSON.stringify(this.notificationPreferences));
    }

    toggleNotificationSound() {
        this.notificationPreferences.soundEnabled = !this.notificationPreferences.soundEnabled;
        this.savePreferences();

        this.showInfo(
            `Notification sound ${this.notificationPreferences.soundEnabled ? 'enabled' : 'disabled'}`,
            'Sound Settings Updated'
        );
    }

    toggleAutoHide() {
        this.notificationPreferences.autoHide = !this.notificationPreferences.autoHide;
        this.savePreferences();

        this.showInfo(
            `Auto-hide ${this.notificationPreferences.autoHide ? 'enabled' : 'disabled'}`,
            'Display Settings Updated'
        );
    }

    setContainerPosition(position = null) {
        if (position) {
            this.notificationPreferences.position = position;
            this.savePreferences();
        }

        const container = this.notificationContainer;
        if (!container) return;

        container.className = 'notification-container';
        container.classList.add(`notification-${this.notificationPreferences.position}`);
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+N to clear all notifications
            if (e.ctrlKey && e.shiftKey && e.key === 'N') {
                e.preventDefault();
                this.clearAllNotifications();
            }

            // Ctrl+Shift+M to toggle notification sound
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.toggleNotificationSound();
            }

            // Ctrl+Shift+H to toggle auto-hide
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                this.toggleAutoHide();
            }
        });
    }

    // Modal for detailed notification view
    showNotificationModal(notification) {
        // Remove any existing modal
        const existingModal = document.getElementById('notificationModal');
        if (existingModal) existingModal.remove();

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'notificationModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content notification-modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-gold">${notification.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex align-items-center mb-3">
                            <i class="bi ${notification.icon} text-gold fs-4 me-3"></i>
                            ${notification.category ? `<span class="badge bg-gold-light text-dark">${notification.category}</span>` : ''}
                        </div>
                        <p>${notification.message}</p>
                        ${notification.action ? `
                        <div class="mt-4">
                            <a href="${notification.action.url || '#'}" class="btn btn-gold">
                                ${notification.action.label}
                            </a>
                        </div>` : ''}
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <small class="text-muted">${this.formatDate(notification.timestamp)}</small>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Bootstrap modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Remove modal from DOM after hiding
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Settings modal
    showSettings() {
        const modal = document.createElement('div');
        modal.id = 'notificationSettingsModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content notification-modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-gold">Notification Settings</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="soundEnabled" ${this.notificationPreferences.soundEnabled ? 'checked' : ''}>
                            <label class="form-check-label" for="soundEnabled">Enable notification sounds</label>
                        </div>
                        <div class="form-check form-switch mb-3">
                            <input class="form-check-input" type="checkbox" id="autoHideEnabled" ${this.notificationPreferences.autoHide ? 'checked' : ''}>
                            <label class="form-check-label" for="autoHideEnabled">Auto-hide notifications</label>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Notification Position</label>
                            <select class="form-select" id="notificationPosition">
                                <option value="top-right" ${this.notificationPreferences.position === 'top-right' ? 'selected' : ''}>Top Right</option>
                                <option value="top-left" ${this.notificationPreferences.position === 'top-left' ? 'selected' : ''}>Top Left</option>
                                <option value="bottom-right" ${this.notificationPreferences.position === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                                <option value="bottom-left" ${this.notificationPreferences.position === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-outline-gold" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-gold" id="saveSettings">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Save settings
        modal.querySelector('#saveSettings').addEventListener('click', () => {
            this.notificationPreferences.soundEnabled = modal.querySelector('#soundEnabled').checked;
            this.notificationPreferences.autoHide = modal.querySelector('#autoHideEnabled').checked;
            this.notificationPreferences.position = modal.querySelector('#notificationPosition').value;

            this.savePreferences();
            this.setContainerPosition();
            modalInstance.hide();

            this.showSuccess('Notification settings saved!');
        });

        // Remove modal from DOM after hiding
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    // Predefined notification types for common use cases
    showSuccess(message, title = 'Success!', category = null) {
        return this.showNotification({
            type: 'success',
            title: title,
            message: message,
            category: category,
            autoHide: true,
            sound: 'gentle'
        });
    }

    showError(message, title = 'Error!', category = null) {
        return this.showNotification({
            type: 'error',
            title: title,
            message: message,
            category: category,
            autoHide: false // Don't auto-hide errors
        });
    }

    showWarning(message, title = 'Warning', category = null) {
        return this.showNotification({
            type: 'warning',
            title: title,
            message: message,
            category: category,
            autoHide: true
        });
    }

    showInfo(message, title = 'Information', category = null) {
        return this.showNotification({
            type: 'info',
            title: title,
            message: message,
            category: category,
            autoHide: true
        });
    }

    showBookingConfirmation(appointmentDetails) {
        return this.showNotification({
            type: 'booking',
            title: 'Appointment Booked!',
            message: `Your appointment for ${appointmentDetails.service} on ${appointmentDetails.date} at ${appointmentDetails.time} has been confirmed.`,
            category: 'Booking',
            action: {
                label: 'View Details',
                url: '#booking'
            },
            autoHide: false,
            sound: 'success'
        });
    }

    showPromotion(message, title = 'Special Offer!') {
        return this.showNotification({
            type: 'promotion',
            title: title,
            message: message,
            category: 'Promotion',
            action: {
                label: 'Learn More',
                url: '#services'
            },
            autoHide: false
        });
    }

    showWelcomeMessage() {
        return this.showNotification({
            type: 'info',
            title: 'Welcome to Luxor Nails Bar!',
            message: 'Experience premium beauty services in a luxurious environment. Book your appointment today!',
            category: 'Welcome',
            action: {
                label: 'Book Now',
                url: '#booking'
            },
            autoHide: true,
            autoHideDelay: 8000
        });
    }

    // Dark theme specific notification
    showDarkThemeNotification() {
        return this.showNotification({
            type: 'info',
            title: 'Dark Theme Activated',
            message: 'Enjoy our premium services in luxurious dark mode with gold accents.',
            category: 'Theme',
            autoHide: true,
            autoHideDelay: 5000
        });
    }

    // Categorized notification
    showCategorizedNotification(category, options) {
        return this.showNotification({
            ...options,
            category: category
        });
    }
}

// Initialize global notification system
window.notificationSystem = new NotificationSystem();

// Add CSS for notifications with dark theme
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    /* Notification Container */
    .notification-container {
        position: fixed;
        z-index: 99999;
        width: 350px;
        max-width: 90vw;
    }
    
    .notification-container.notification-top-right {
        top: 100px;
        right: 20px;
    }
    
    .notification-container.notification-top-left {
        top: 100px;
        left: 20px;
    }
    
    .notification-container.notification-bottom-right {
        bottom: 20px;
        right: 20px;
    }
    
    .notification-container.notification-bottom-left {
        bottom: 20px;
        left: 20px;
    }
    
    /* Notification Styling */
    .notification {
        background: #111111;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        margin-bottom: 15px;
        padding: 15px;
        border-left: 5px solid #D4AF37;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: flex-start;
        position: relative;
        overflow: hidden;
        border: 1px solid #333333;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left-color: #28a745;
    }
    
    .notification.warning {
        border-left-color: #ffc107;
    }
    
    .notification.error {
        border-left-color: #dc3545;
    }
    
    .notification.info {
        border-left-color: #D4AF37;
    }
    
    .notification.booking {
        border-left-color: #D4AF37;
    }
    
    .notification.promotion {
        border-left-color: #D4AF37;
    }
    
    /* Notification Icon */
    .notification-icon {
        font-size: 1.5rem;
        margin-right: 15px;
        flex-shrink: 0;
    }
    
    .notification.success .notification-icon {
        color: #28a745;
    }
    
    .notification.warning .notification-icon {
        color: #ffc107;
    }
    
    .notification.error .notification-icon {
        color: #dc3545;
    }
    
    .notification.info .notification-icon {
        color: #D4AF37;
    }
    
    .notification.booking .notification-icon {
        color: #D4AF37;
    }
    
    .notification.promotion .notification-icon {
        color: #D4AF37;
    }
    
    /* Notification Content */
    .notification-content {
        flex-grow: 1;
    }
    
    .notification-title {
        font-weight: 600;
        margin-bottom: 5px;
        font-family: 'Playfair Display', serif;
        color: #000000;
    }
    
    .notification-message {
        font-size: 0.9rem;
        color: #CCCCCC;
        margin-bottom: 0;
        line-height: 1.4;
    }
    
    /* Category Badge */
    .notification-category {
        display: inline-block;
        background: rgba(212, 175, 55, 0.2);
        color: #D4AF37;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    
    /* Close Button */
    .notification-close {
        background: none;
        border: none;
        color: #666666;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        line-height: 1;
        transition: color 0.3s;
        flex-shrink: 0;
    }
    
    .notification-close:hover {
        color: #FFFFFF;
    }
    
    /* Progress Bar */
    .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        width: 0%;
        background: rgba(212, 175, 55, 0.5);
    }
    
    /* Actions */
    .notification-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    .notification-actions .btn-outline-gold {
        padding: 4px 12px;
        font-size: 0.85rem;
        border: 1px solid #D4AF37;
        color: #D4AF37 !important;
        background: transparent;
        border-radius: 4px;
        transition: all 0.3s;
        text-decoration: none;
        display: inline-block;
    }
    
    .notification-actions .btn-outline-gold:hover {
        background: #D4AF37;
        color: #000000 !important;
    }
    
    /* Dropdown Styling */
    .notification-dropdown {
        background: #111111 !important;
        border: 1px solid #333333 !important;
    }
    
    .notification-dropdown-item {
        background: #1a1a1a !important;
        border-radius: 8px !important;
        border: 1px solid #333333 !important;
        margin-bottom: 8px !important;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .notification-dropdown-item:hover {
        background: #222222 !important;
        border-color: #D4AF37 !important;
    }
    
    .notification-dropdown-item:last-child {
        margin-bottom: 0 !important;
    }
    
    .notification-dropdown-item h6 {
        color: #FFFFFF !important;
        font-size: 0.9rem;
    }
    
    .notification-dropdown-item p {
        color: #CCCCCC !important;
        font-size: 0.8rem;
    }
    
    .notification-dropdown-item small {
        color: #999999 !important;
    }
    
    /* Badge in Navbar */
    .notification-badge {
        background: #D4AF37 !important;
        color: #000000 !important;
        font-size: 0.7rem;
        padding: 4px 6px;
        min-width: 18px;
        height: 18px;
    }
    
    /* Gold Button */
    .btn-gold {
        background: #D4AF37 !important;
        color: #000000 !important;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        font-weight: 500;
        transition: all 0.3s;
    }
    
    .btn-gold:hover {
        background: #B8860B !important;
        color: #000000 !important;
    }
    
    .bg-gold-light {
        background: rgba(212, 175, 55, 0.2) !important;
        color: #D4AF37 !important;
    }
    
    /* Modal Styling */
    .notification-modal-content {
        background: #111111 !important;
        color: #FFFFFF !important;
        border: 1px solid #333333 !important;
    }
    
    .btn-close-white {
        filter: invert(1) grayscale(100%) brightness(200%);
    }
    
    /* Form Elements for Dark Theme */
    .form-check-input:checked {
        background-color: #D4AF37;
        border-color: #D4AF37;
    }
    
    .form-select {
        background-color: #1a1a1a;
        border-color: #333333;
        color: #FFFFFF;
    }
    
    .form-select:focus {
        border-color: #D4AF37;
        box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
    }
    
    /* Animations */
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutLeft {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    .notification.show {
        animation: slideInRight 0.3s ease forwards;
    }
    
    .notification.removing {
        animation: slideOutRight 0.3s ease forwards;
    }
    
    .notification-container.notification-top-left .notification.show {
        animation: slideInLeft 0.3s ease forwards;
    }
    
    .notification-container.notification-top-left .notification.removing {
        animation: slideOutLeft 0.3s ease forwards;
    }
    
    .notification-container.notification-bottom-left .notification.show {
        animation: slideInLeft 0.3s ease forwards;
    }
    
    .notification-container.notification-bottom-left .notification.removing {
        animation: slideOutLeft 0.3s ease forwards;
    }
    
    @keyframes notificationPulse {
        0% {
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        50% {
            box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        }
        100% {
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
    }
    
    .notification.new {
        animation: notificationPulse 0.5s ease;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .notification-container {
            width: 300px;
        }
        
        .notification-container.notification-top-right,
        .notification-container.notification-top-left {
            top: 80px;
        }
        
        .notification-container.notification-bottom-right,
        .notification-container.notification-bottom-left {
            bottom: 10px;
        }
        
        .notification {
            padding: 12px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            margin-right: 10px;
        }
        
        .notification-dropdown {
            min-width: 280px !important;
        }
    }
    
    @media (max-width: 576px) {
        .notification-container {
            width: calc(100vw - 20px);
            max-width: none;
        }
        
        .notification-container.notification-top-right,
        .notification-container.notification-top-left {
            right: 10px;
            left: 10px;
        }
        
        .notification-container.notification-bottom-right,
        .notification-container.notification-bottom-left {
            right: 10px;
            left: 10px;
        }
    }
    
    /* Dark Theme Adjustments */
    @media (prefers-color-scheme: dark) {
        .notification {
            background: #111111;
            border-color: #333333;
        }
        
        .notification-dropdown {
            background: #111111 !important;
        }
    }
    
    /* Accessibility */
    .notification:focus-within {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
    }
    
    .notification-close:focus {
        outline: 2px solid #D4AF37;
        outline-offset: 2px;
    }
    
    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
        .notification {
            transform: none !important;
            transition: none !important;
            animation: none !important;
        }
        
        .notification.show {
            transform: none !important;
        }
        
        .notification-progress {
            display: none;
        }
    }
`;

document.head.appendChild(notificationStyles);

// Add example notifications on page load (optional)
document.addEventListener('DOMContentLoaded', function () {
    // Show welcome message after a delay
    setTimeout(() => {
        notificationSystem.showWelcomeMessage();
    }, 1000);

    // Show dark theme notification if it's the first visit
    const themeNotified = localStorage.getItem('darkThemeNotified');
    if (!themeNotified) {
        setTimeout(() => {
            notificationSystem.showDarkThemeNotification();
            localStorage.setItem('darkThemeNotified', 'true');
        }, 3000);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationSystem };
}

// Add utility function to test notifications (for development)
window.testNotification = function (type = 'info') {
    const messages = {
        info: { title: 'Test Info', message: 'This is a test information notification.' },
        success: { title: 'Test Success', message: 'This is a test success notification!' },
        warning: { title: 'Test Warning', message: 'This is a test warning notification.' },
        error: { title: 'Test Error', message: 'This is a test error notification.' }
    };

    const message = messages[type] || messages.info;
    notificationSystem.showNotification({
        type: type,
        title: message.title,
        message: message.message,
        category: 'Test',
        autoHide: true
    });

    notificationSystem.showNotification({
        type: 'info',
        title: 'Custom Title',
        message: 'Your custom message here.',
        category: 'Custom',
        action: {
            label: 'Learn More',
            url: '#about'
        },
        autoHide: true,
        autoHideDelay: 8000,
        sound: 'gentle'
    });

};