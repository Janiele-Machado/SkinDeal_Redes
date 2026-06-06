// DOM Elements
const backBtn = document.getElementById('back-btn');
const contentWrapper = document.querySelector('.content-wrapper');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Smooth scroll behavior for content area
if (contentWrapper) {
    // Add smooth scrolling
    contentWrapper.style.scrollBehavior = 'smooth';
    
    // Track scroll position
    let scrollPosition = 0;
    
    contentWrapper.addEventListener('scroll', () => {
        scrollPosition = contentWrapper.scrollTop;
    });
    
    // Restore scroll position if user navigates back
    window.addEventListener('load', () => {
        const savedScrollPosition = sessionStorage.getItem('termsScrollPosition');
        if (savedScrollPosition && contentWrapper) {
            contentWrapper.scrollTop = parseInt(savedScrollPosition, 10);
        }
    });
    
    // Save scroll position before leaving
    window.addEventListener('beforeunload', () => {
        if (contentWrapper) {
            sessionStorage.setItem('termsScrollPosition', contentWrapper.scrollTop);
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key to go back
    if (e.key === 'Escape') {
        backBtn.click();
    }
    
    // Arrow keys for scrolling
    if (contentWrapper) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            contentWrapper.scrollBy({
                top: 100,
                behavior: 'smooth'
            });
        }
        
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            contentWrapper.scrollBy({
                top: -100,
                behavior: 'smooth'
            });
        }
        
        // Page Down
        if (e.key === 'PageDown') {
            e.preventDefault();
            contentWrapper.scrollBy({
                top: contentWrapper.clientHeight - 50,
                behavior: 'smooth'
            });
        }
        
        // Page Up
        if (e.key === 'PageUp') {
            e.preventDefault();
            contentWrapper.scrollBy({
                top: -(contentWrapper.clientHeight - 50),
                behavior: 'smooth'
            });
        }
        
        // Home key - scroll to top
        if (e.key === 'Home') {
            e.preventDefault();
            contentWrapper.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // End key - scroll to bottom
        if (e.key === 'End') {
            e.preventDefault();
            contentWrapper.scrollTo({
                top: contentWrapper.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
});

// Scroll progress indicator (optional enhancement)
function updateScrollProgress() {
    if (!contentWrapper) return;
    
    const scrollTop = contentWrapper.scrollTop;
    const scrollHeight = contentWrapper.scrollHeight - contentWrapper.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Could add a visual indicator here if desired
    console.log(`Scroll progress: ${scrollPercentage.toFixed(0)}%`);
}

if (contentWrapper) {
    contentWrapper.addEventListener('scroll', updateScrollProgress);
}

// Log page view
console.log('Termos e Políticas - Página carregada');

// Accessibility: Focus management
window.addEventListener('load', () => {
    // Set focus to the content area for screen readers
    if (contentWrapper) {
        contentWrapper.setAttribute('tabindex', '0');
        contentWrapper.setAttribute('role', 'article');
        contentWrapper.setAttribute('aria-label', 'Termos de serviço e Políticas de privacidade');
    }
});
