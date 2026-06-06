// DOM Elements
const backBtn = document.getElementById('back-btn');
const announcedPriceInput = document.getElementById('announced-price');
const youReceiveInput = document.getElementById('you-receive');
const submitBtn = document.getElementById('submit-btn');
const productImage = document.getElementById('product-image');
const gameIcon = document.getElementById('game-icon');
const chartCanvas = document.getElementById('chart-canvas');
const API_URL = '../api.php';

// Constants
const COMMISSION_RATE = 0.05; // 5% commission

// Load product data from localStorage
function loadProductData() {
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct) {
        try {
            const product = JSON.parse(savedProduct);
            console.log('Produto para venda:', product);
            return product;
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
        }
    }
    
    return {
        name: 'Baioneta Crimson Web',
        price: 1300.82,
        game: 'Counter-Strike 2'
    };
}

// Format currency (BRL)
function formatCurrency(value) {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    if (isNaN(value)) {
        return '0,00';
    }
    
    return value.toFixed(2).replace('.', ',');
}

// Parse currency string to number
function parseCurrency(value) {
    if (!value) return 0;
    
    // Remove everything except numbers and comma
    const cleaned = value.replace(/[^\d,]/g, '');
    // Replace comma with dot
    const number = parseFloat(cleaned.replace(',', '.'));
    
    return isNaN(number) ? 0 : number;
}

// Calculate amount after commission
function calculateYouReceive(announcedPrice) {
    const price = parseCurrency(announcedPrice);
    if (price <= 0) {
        return 0;
    }
    
    // Subtract 5% commission
    const commission = price * COMMISSION_RATE;
    const youReceive = price - commission;
    
    return youReceive;
}

// Format input as currency on typing
function formatInputAsCurrency(input) {
    let value = input.value;
    
    // Remove everything except numbers and comma
    value = value.replace(/[^\d,]/g, '');
    
    // Allow only one comma
    const parts = value.split(',');
    if (parts.length > 2) {
        value = parts[0] + ',' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + ',' + parts[1].substring(0, 2);
    }
    
    // Add thousand separators
    if (parts[0].length > 3) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        value = parts.join(',');
    }
    
    input.value = value;
}

// Update "Você recebe" field
function updateYouReceive() {
    const announcedPrice = announcedPriceInput.value;
    const youReceive = calculateYouReceive(announcedPrice);
    
    youReceiveInput.value = formatCurrency(youReceive);
    
    // Enable/disable submit button
    if (youReceive > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Handle announced price input
if (announcedPriceInput) {
    announcedPriceInput.addEventListener('input', (e) => {
        formatInputAsCurrency(e.target);
        updateYouReceive();
    });
    
    announcedPriceInput.addEventListener('blur', (e) => {
        // Format on blur
        const value = parseCurrency(e.target.value);
        if (value > 0) {
            e.target.value = formatCurrency(value);
        }
    });
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        // Go back to inventory or previous page
        window.history.back();
    });
}

// Submit button - Send trade proposal
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const announcedPrice = parseCurrency(announcedPriceInput.value);
        const youReceive = calculateYouReceive(announcedPriceInput.value);
        const product = loadProductData();
        
        if (announcedPrice <= 0) {
            showNotification('Por favor, insira um preço válido.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}?route=sale-proposals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skinId: product.id || 3,
                    announcedPrice
                })
            });
            const result = await response.json();

            if (!result.success) {
                showNotification(result.message || 'Nao foi possivel enviar a proposta.', 'error');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                return;
            }

            saveTradePropsal({
                announcedPrice: announcedPrice,
                youReceive: youReceive,
                commission: announcedPrice * COMMISSION_RATE,
                commissionRate: COMMISSION_RATE * 100
            });
            
            showNotification('Proposta de troca enviada com sucesso!', 'success');
            
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Proposta Enviada!';
            
            // Redirect after delay
            setTimeout(() => {
                showNotification('Redirecionando para processar troca...', 'info');
                setTimeout(() => {
                    window.location.href = 'troca-venda.html';
                }, 1500);
            }, 2000);
        } catch (error) {
            showNotification('Nao foi possivel conectar ao servidor.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Save trade proposal to localStorage
function saveTradePropsal(proposal) {
    try {
        const product = loadProductData();
        
        const tradeProposal = {
            id: Date.now(),
            product: product,
            announcedPrice: proposal.announcedPrice,
            youReceive: proposal.youReceive,
            commission: proposal.commission,
            commissionRate: proposal.commissionRate,
            date: new Date().toISOString(),
            status: 'Pendente'
        };
        
        // Save to localStorage
        const proposals = JSON.parse(localStorage.getItem('tradeProposals') || '[]');
        proposals.unshift(tradeProposal);
        
        // Keep only last 20 proposals
        if (proposals.length > 20) {
            proposals.splice(20);
        }
        
        localStorage.setItem('tradeProposals', JSON.stringify(proposals));
        
        console.log('Proposta de troca salva:', tradeProposal);
    } catch (error) {
        console.error('Erro ao salvar proposta:', error);
    }
}

// Show notification toast
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

// Add CSS animations for notifications
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

// Draw chart
function drawChart() {
    if (!chartCanvas) return;
    
    // Create grid lines
    const grid = document.createElement('div');
    grid.className = 'chart-grid';
    
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'chart-grid-line';
        grid.appendChild(line);
    }
    
    chartCanvas.appendChild(grid);
    
    // Create SVG for chart lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'chart-svg');
    svg.setAttribute('viewBox', '0 0 272 163');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Green line (Última venda) - smooth curve going up
    const greenPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    greenPath.setAttribute('d', 'M1 55 L17 43 L36 43 L52 34 L67 59 L77 6 L93 94 L96 83 L102 73 L108 83 L119 83 L124 92 L129 73 L143 81 L160 109 L199 109 L206 110 L213 109 L270 109');
    greenPath.setAttribute('stroke', '#00E832');
    greenPath.setAttribute('stroke-width', '2');
    greenPath.setAttribute('stroke-linecap', 'round');
    greenPath.setAttribute('fill', 'none');
    
    // Red line (Procura/oferta) - lower line
    const redPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    redPath.setAttribute('d', 'M1 147 L40 147 L49 152 L63 142 L103 149 L154 140 L206 145 L258 150 L270 147');
    redPath.setAttribute('stroke', '#FF1A00');
    redPath.setAttribute('stroke-width', '2');
    redPath.setAttribute('stroke-linecap', 'round');
    redPath.setAttribute('fill', 'none');
    
    svg.appendChild(greenPath);
    svg.appendChild(redPath);
    
    chartCanvas.appendChild(svg);
}

// Image fallback handling
if (productImage) {
    productImage.addEventListener('error', function() {
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.textContent = '🔪';
        fallback.style.cssText = `
            font-size: 60px;
            transform: rotate(30deg);
        `;
        this.parentElement.appendChild(fallback);
    });
}

if (gameIcon) {
    gameIcon.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/30/10355b/ffffff?text=CS2';
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
    
    // Enter to submit (if enabled)
    if (e.key === 'Enter') {
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
        }
    }
});

// Auto-focus on price input
window.addEventListener('DOMContentLoaded', () => {
    const product = loadProductData();
    console.log('Vender Skin - Página carregada');
    
    // Draw chart
    drawChart();
    
    // Focus on price input after short delay
    setTimeout(() => {
        if (announcedPriceInput) {
            announcedPriceInput.focus();
        }
    }, 500);
});

console.log('Vender Skin - Script carregado');
