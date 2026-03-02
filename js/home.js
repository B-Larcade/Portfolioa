document.addEventListener('DOMContentLoaded', () => {
    // Simple staggered fade-in on load
    const fadeItems = document.querySelectorAll('.hero-content > *, .highlight-card, .cta-section');
    fadeItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        setTimeout(() => {
            item.style.transition = 'all 1s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 150 * index);
    });
});