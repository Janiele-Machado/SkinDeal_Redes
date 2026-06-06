// DOM Elements
const backBtn = document.getElementById('back-btn');
const paymentBtn = document.getElementById('payment-btn');
const qrCodeSection = document.getElementById('qr-code-section');
const copyBtn = document.getElementById('copy-btn');
const pixCodeInput = document.getElementById('pix-code');
const timerElement = document.getElementById('timer');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
const API_URL = '../api.php';

// Load purchase data
function loadPurchaseData() {
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct) {
        try {
            const product = JSON.parse(savedProduct);
            
            // Update product info
            const productName = document.getElementById('product-preview-name');
            if (productName) {
                productName.textContent = product.name || 'Bayonet Crimson Web';
            }
            
            const productImage = document.getElementById('product-preview-image');
            if (productImage && product.image) {
                productImage.src = product.image;
                productImage.alt = product.name;
            }
            
            // Update payment amount
            const price = product.price || 1312.51;
            const priceFormatted = price.toFixed(2).replace('.', ',');
            
            const paymentAmount = document.getElementById('payment-amount');
            if (paymentAmount) {
                paymentAmount.textContent = `R$ ${priceFormatted}`;
            }
            
            const paymentBtnAmount = document.getElementById('payment-btn-amount');
            if (paymentBtnAmount) {
                paymentBtnAmount.textContent = priceFormatted;
            }
            
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
        price: 1312.51
    };
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'comprar.html';
    });
}

// Payment button - Show QR Code
if (paymentBtn) {
    paymentBtn.addEventListener('click', () => {
        // Show QR code section
        if (qrCodeSection) {
            qrCodeSection.style.display = 'block';
            
            // Render QR Code SVG from Figma
            renderQRCode();
            
            // Scroll to QR code section
            qrCodeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Start countdown timer
            startPaymentTimer();
            
            // Show notification
            showNotification('QR Code gerado com sucesso! Complete o pagamento.', 'success');
        }
    });
}

// Render QR Code Image
function renderQRCode() {
    const qrCodeContainer = document.getElementById('qr-code-svg');
    if (!qrCodeContainer) return;
    
    // Create image element with real QR Code
    const img = document.createElement('img');
    img.src = '../Imagens do site/qrcode%201.svg';
    img.alt = 'QR Code PIX';
    img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    `;
    
    // Error fallback
    img.addEventListener('error', function() {
        this.style.cssText = `
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
        `;
        this.alt = 'QR Code não disponível';
    });
    
    // Clear container and add image
    qrCodeContainer.innerHTML = '';
    qrCodeContainer.appendChild(img);
}

// Copy PIX code
if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        try {
            const pixCode = pixCodeInput.value;
            await navigator.clipboard.writeText(pixCode);
            
            // Change button text temporarily
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copiado!';
            copyBtn.style.backgroundColor = '#00e832';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
            
            showNotification('Código PIX copiado para a área de transferência!', 'success');
        } catch (error) {
            console.error('Erro ao copiar:', error);
            showNotification('Erro ao copiar código', 'error');
        }
    });
}

// Payment Timer (10 minutes countdown)
let timerInterval;
function startPaymentTimer() {
    let timeLeft = 600; // 10 minutes in seconds
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showNotification('Tempo de pagamento expirado. Gere um novo QR Code.', 'error');
            if (qrCodeSection) {
                qrCodeSection.style.display = 'none';
            }
            return;
        }
        
        // Update timer display
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timerElement) {
            timerElement.textContent = timeString;
        }
        
        // Change color when time is running out (last 2 minutes)
        if (timeLeft <= 120 && timerElement) {
            timerElement.parentElement.style.color = '#ff4444';
        }
    }, 1000);
}

// Show Notification Toast
function showNotification(message, type = 'info') {
    console.log(message);
    
    const toast = document.createElement('div');
    toast.textContent = message;
    
    const backgroundColor = type === 'error' ? '#d32f2f' : 
                           type === 'success' ? '#10355b' : '#10355b';
    
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
const productImage = document.getElementById('product-preview-image');
if (productImage) {
    productImage.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/250x150/6b6b6b/ffffff?text=Produto';
    });
}

const advertiserAvatar = document.getElementById('advertiser-avatar');
if (advertiserAvatar) {
    advertiserAvatar.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/50/10355b/ffffff?text=User';
    });
}

const pixLogo = document.getElementById('pix-logo');
if (pixLogo) {
    pixLogo.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/80x60/10355b/ffffff?text=PIX';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to go back
    if (e.key === 'Escape') {
        if (qrCodeSection && qrCodeSection.style.display === 'block') {
            qrCodeSection.style.display = 'none';
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        } else {
            window.location.href = 'comprar.html';
        }
    }
    
    // Ctrl/Cmd + Enter to confirm payment
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (paymentBtn && qrCodeSection.style.display !== 'block') {
            paymentBtn.click();
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// Confirm Payment Button - Redirect to success page
if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', async () => {
        // Stop timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Show loading state
        confirmPaymentBtn.textContent = 'Processando...';
        confirmPaymentBtn.disabled = true;
        
        try {
            const product = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
            const response = await fetch(`${API_URL}?route=purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skinId: product.id || 3,
                    paymentMethod: 'PIX'
                })
            });
            const result = await response.json();

            if (!result.success) {
                showNotification(result.message || 'Nao foi possivel confirmar o pagamento.', 'error');
                confirmPaymentBtn.textContent = 'Confirmar pagamento';
                confirmPaymentBtn.disabled = false;
                return;
            }

            showNotification('Pagamento confirmado com sucesso!', 'success');
            
            // Redirect to confirmation page after short delay
            setTimeout(() => {
                window.location.href = 'pagamento-confirmado.html';
            }, 1000);
        } catch (error) {
            showNotification('Nao foi possivel conectar ao servidor.', 'error');
            confirmPaymentBtn.textContent = 'Confirmar pagamento';
            confirmPaymentBtn.disabled = false;
        }
    });
}

console.log('Finalizar Compra - Página carregada');
