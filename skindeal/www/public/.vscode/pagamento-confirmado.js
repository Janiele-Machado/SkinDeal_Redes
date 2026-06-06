// DOM Elements
const backBtn = document.getElementById('back-btn');
const actionBtn = document.getElementById('action-btn');
const paymentAmount = document.getElementById('payment-amount');
const checkIcon = document.getElementById('check-icon');

// Load payment data from localStorage
function loadPaymentData() {
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct) {
        try {
            const product = JSON.parse(savedProduct);
            const price = product.price || 1312.52;
            const priceFormatted = price.toFixed(2).replace('.', ',');
            
            if (paymentAmount) {
                paymentAmount.textContent = `R$ ${priceFormatted}`;
            }
            
            // Save purchase to history
            savePurchaseToHistory(product, price);
            
            return {
                name: product.name || 'Bayonet Crimson Web',
                price: price
            };
        } catch (error) {
            console.error('Erro ao carregar dados do produto:', error);
        }
    }
    
    return {
        name: 'Bayonet Crimson Web',
        price: 1312.52
    };
}

// Save purchase to history
function savePurchaseToHistory(product, price) {
    try {
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
        
        const newPurchase = {
            id: Date.now(),
            name: product.name || 'Produto',
            price: price,
            image: product.image || '',
            game: product.game || 'Counter-Strike 2',
            date: new Date().toISOString(),
            status: 'Confirmado',
            method: 'PIX',
            transactionId: generateTransactionId()
        };
        
        purchases.unshift(newPurchase);
        
        // Keep only last 50 purchases
        if (purchases.length > 50) {
            purchases.splice(50);
        }
        
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        console.log('Compra salva no histórico:', newPurchase);
    } catch (error) {
        console.error('Erro ao salvar compra:', error);
    }
}

// Generate transaction ID
function generateTransactionId() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = 'TXN-';
    for (let i = 0; i < 12; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        // Go back to home
        window.location.href = 'home.html';
    });
}

// Action button navigation
if (actionBtn) {
    actionBtn.addEventListener('click', () => {
        // Go to trade page
        window.location.href = 'troca.html';
    });
}

// Check icon fallback
if (checkIcon) {
    checkIcon.addEventListener('error', function() {
        // Create SVG check icon as fallback
        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('viewBox', '0 0 200 200');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.style.cssText = 'width: 100%; height: 100%;';
        
        // Circle background
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', '90');
        circle.setAttribute('fill', 'white');
        
        // Check mark
        const checkPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        checkPath.setAttribute('d', 'M60 100 L85 125 L140 70');
        checkPath.setAttribute('stroke', '#10355b');
        checkPath.setAttribute('stroke-width', '16');
        checkPath.setAttribute('stroke-linecap', 'round');
        checkPath.setAttribute('stroke-linejoin', 'round');
        checkPath.setAttribute('fill', 'none');
        
        checkSvg.appendChild(circle);
        checkSvg.appendChild(checkPath);
        
        const container = this.parentElement;
        container.innerHTML = '';
        container.appendChild(checkSvg);
    });
}

// Confetti effect (optional enhancement)
function createConfetti() {
    const colors = ['#00e832', '#10355b', '#ffffff', '#ffd700'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const duration = 2000 + Math.random() * 2000;
        const delay = Math.random() * 500;
        
        setTimeout(() => {
            confetti.style.transition = `all ${duration}ms ease-out`;
            confetti.style.top = '100vh';
            confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
            
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, duration);
        }, delay);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter to go to home
    if (e.key === 'Enter') {
        e.preventDefault();
        if (actionBtn) {
            actionBtn.click();
        }
    }
    
    // ESC to go back
    if (e.key === 'Escape') {
        if (backBtn) {
            backBtn.click();
        }
    }
});

// Show success notification
function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.textContent = '✓ Compra registrada com sucesso!';
    notification.style.cssText = `
        position: fixed;
        bottom: 32px;
        right: 32px;
        background-color: #00e832;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 232, 50, 0.3);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    const productData = loadPaymentData();
    console.log('Pagamento Confirmado - Produto:', productData);
    
    // Optional: Create confetti effect
    setTimeout(() => {
        createConfetti();
    }, 500);
    
    // Show success notification
    setTimeout(() => {
        showSuccessNotification();
    }, 1000);
});

console.log('Pagamento Confirmado - Página carregada');