// DOM Elements
const backBtn = document.getElementById('back-btn');
const steamBtn = document.getElementById('steam-btn');
const browserBtn = document.getElementById('browser-btn');
const userAvatar = document.getElementById('user-avatar');
const botAvatar = document.getElementById('bot-avatar');
const botItem = document.getElementById('bot-item');

// Steam trade URL (exemplo)
const STEAM_TRADE_URL = 'https://steamcommunity.com/tradeoffer/new/?partner=299240299&token=mR2WfR0C';
const STEAM_PROTOCOL_URL = 'steam://openurl/' + STEAM_TRADE_URL;

// Load product data
function loadProductData() {
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct) {
        try {
            const product = JSON.parse(savedProduct);
            console.log('Produto para troca:', product);
            return product;
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
        }
    }
    
    return null;
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
}

// Steam button - Open in Steam client
if (steamBtn) {
    steamBtn.addEventListener('click', () => {
        // Show loading state
        steamBtn.classList.add('loading');
        steamBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            try {
                // Try to open Steam protocol URL
                window.location.href = STEAM_PROTOCOL_URL;
                
                // Show success notification
                showNotification('Abrindo Steam...', 'success');
                
                // Show success state
                steamBtn.classList.remove('loading');
                steamBtn.classList.add('success');
                steamBtn.textContent = 'Aberto na Steam!';
                
                // Redirect to home after delay
                setTimeout(() => {
                    showNotification('Redirecionando para home...', 'info');
                    setTimeout(() => {
                        // Clear selected product
                        localStorage.removeItem('selectedProduct');
                        window.location.href = 'home.html';
                    }, 1500);
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao abrir Steam:', error);
                steamBtn.classList.remove('loading');
                steamBtn.disabled = false;
                showNotification('Erro ao abrir Steam. Tente pelo navegador.', 'error');
            }
        }, 1000);
    });
}

// Browser button - Open in new tab
if (browserBtn) {
    browserBtn.addEventListener('click', () => {
        // Show loading state
        browserBtn.classList.add('loading');
        browserBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            try {
                // Open Steam trade URL in new tab
                const newWindow = window.open(STEAM_TRADE_URL, '_blank');
                
                if (newWindow) {
                    newWindow.focus();
                    showNotification('Steam aberta no navegador!', 'success');
                    
                    // Show success state
                    browserBtn.classList.remove('loading');
                    browserBtn.classList.add('success');
                    browserBtn.textContent = 'Aberto no navegador!';
                    
                    // Redirect to home after delay
                    setTimeout(() => {
                        showNotification('Redirecionando para home...', 'info');
                        setTimeout(() => {
                            // Clear selected product
                            localStorage.removeItem('selectedProduct');
                            window.location.href = 'home.html';
                        }, 1500);
                    }, 2000);
                } else {
                    throw new Error('Popup bloqueado');
                }
                
            } catch (error) {
                console.error('Erro ao abrir navegador:', error);
                browserBtn.classList.remove('loading');
                browserBtn.disabled = false;
                showNotification('Erro ao abrir link. Verifique o bloqueador de pop-ups.', 'error');
            }
        }, 1000);
    });
}

// Show Notification Toast
function showNotification(message, type = 'info') {
    console.log(message);
    
    const toast = document.createElement('div');
    toast.textContent = message;
    
    const backgroundColor = type === 'error' ? '#d32f2f' : 
                           type === 'success' ? '#00e832' : 
                           '#10355b';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: ${backgroundColor};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1100;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', 'Arial', sans-serif;
        font-weight: 600;
        max-width: 90%;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Image fallback handling
if (userAvatar) {
    userAvatar.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/32/10355b/ffffff?text=U';
    });
}

if (botAvatar) {
    botAvatar.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/32/256a9c/ffffff?text=B';
    });
}

if (botItem) {
    botItem.addEventListener('error', function() {
        // Create fallback knife SVG
        const container = this.parentElement;
        container.style.cssText = `
            width: 100px;
            height: 100px;
            background: rgba(64, 64, 64, 0.8);
            border-radius: 12px;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const fallbackText = document.createElement('div');
        fallbackText.textContent = '🔪';
        fallbackText.style.cssText = `
            font-size: 48px;
            transform: rotate(60deg);
        `;
        
        container.innerHTML = '';
        container.appendChild(fallbackText);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to go back
    if (e.key === 'Escape') {
        if (backBtn) {
            backBtn.click();
        }
    }
    
    // S to accept on Steam
    if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (steamBtn && !steamBtn.disabled) {
            steamBtn.click();
        }
    }
    
    // B to accept on browser
    if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        if (browserBtn && !browserBtn.disabled) {
            browserBtn.click();
        }
    }
});

// Show trade instructions
function showTradeInstructions() {
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #10355b 0%, #256a9c 100%);
        color: white;
        padding: 32px;
        border-radius: 16px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        max-width: 500px;
        animation: fadeIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    instructions.innerHTML = `
        <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">Como funciona a troca?</h2>
        <ol style="margin: 0; padding-left: 24px; line-height: 1.8;">
            <li>Clique em "Aceitar na Steam" para abrir o app</li>
            <li>Ou clique em "Aceitar no navegador" para web</li>
            <li>Confirme a troca na Steam</li>
            <li>Aguarde a confirmação</li>
        </ol>
        <button onclick="this.parentElement.remove()" style="
            width: 100%;
            height: 44px;
            background: white;
            color: #10355b;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
            margin-top: 24px;
            transition: opacity 0.2s;
        " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
            Entendi
        </button>
    `;
    
    document.body.appendChild(instructions);
}

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    const product = loadProductData();
    console.log('Troca - Página carregada');
    
    // Show instructions after 1 second
    setTimeout(() => {
        // Uncomment to show instructions on first visit
        // showTradeInstructions();
    }, 1000);
});

console.log('Troca - Script carregado');
