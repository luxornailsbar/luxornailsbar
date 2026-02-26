window.addEventListener('DOMContentLoaded', function () {
    // Create loading screen HTML
    const loadingHTML = `
        <div class="loading-screen" id="loadingScreen">
            <div class="loading-container">
                <div class="loading-logo">Luxor Nails Bar</div>
                <div class="loading-spinner"></div>
                <div class="loading-text">PREPARING YOUR BEAUTY EXPERIENCE</div>
                <div class="loading-progress">
                    <div class="loading-progress-bar" id="loadingProgress"></div>
                </div>
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        </div>
    `;

    // Add loading screen to body
    document.body.insertAdjacentHTML('afterbegin', loadingHTML);

    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');

    // Hide scrollbar during loading
    document.body.style.overflow = 'hidden';

    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) {
            progress = 90; // Keep at 90% until window.load
            clearInterval(loadingInterval);
        }
        loadingProgress.style.width = progress + '%';
    }, 100);

    // When everything is loaded
    window.addEventListener('load', function () {
        loadingProgress.style.width = '100%';

        setTimeout(() => {
            loadingScreen.classList.add('hidden');

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'visible';

                // Trigger entrance animations
                document.querySelectorAll('.service-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }, 500);
        }, 300);
    });

    // Fallback - hide loading after 4 seconds max
    setTimeout(() => {
        if (!loadingScreen.classList.contains('hidden')) {
            loadingProgress.style.width = '100%';
            loadingScreen.classList.add('hidden');

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'visible';
            }, 500);
        }
    }, 4000);
});