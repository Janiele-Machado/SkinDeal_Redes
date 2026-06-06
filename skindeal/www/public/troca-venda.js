// DOM Elements
const backBtn = document.getElementById('back-btn');
const steamBtn = document.getElementById('steam-btn');
const browserBtn = document.getElementById('browser-btn');
const userAvatar = document.getElementById('user-avatar');
const botAvatar = document.getElementById('bot-avatar');
const userItem = document.getElementById('user-item');
const announcedPriceEl = document.getElementById('announced-price');
const youReceiveEl = document.getElementById('you-receive');
const taxAmountEl = document.getElementById('tax-amount');

// Steam trade URL (exemplo)
const STEAM_TRADE_URL = 'https://steamcommunity.com/tradeoffer/new/?partner=299240299&token=mR2WfR0C';
const STEAM_PROTOCOL_URL = 'steam://openurl/' + STEAM_TRADE_URL;

// Load trade proposal data
function loadTradeProposal() {
    const proposals = localStorage.getItem('tradeProposals');
    
    if (proposals) {
        try {
            const parsedProposals = JSON.parse(proposals);
            if (parsedProposals.length > 0) {
                const latestProposal = parsedProposals[0];
                console.log('Proposta de troca:', latestProposal);
                return latestProposal;
            }
        } catch (error) {
            console.error('Erro ao carregar proposta:', error);
        }
    }
    
    return {
        announcedPrice: 0,
        youReceive: 0,
        commission: 0
    };
}

// Format currency (BRL)
function formatCurrency(value) {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    
    if (isNaN(value)) {
        return 'R$ 0,00';
    }
    
    return 'R$ ' + value.toFixed(2).replace('.', ',');
}

// Display trade information
function displayTradeInfo() {
    const proposal = loadTradeProposal();
    
    if (announcedPriceEl) {
        announcedPriceEl.textContent = formatCurrency(proposal.announcedPrice);
    }
    
    if (youReceiveEl) {
        youReceiveEl.textContent = formatCurrency(proposal.youReceive);
    }
    
    if (taxAmountEl) {
        taxAmountEl.textContent = formatCurrency(proposal.commission);
    }
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
                
                // Save trade as completed
                completeTradeProposal();
                
                // Redirect to home after delay
                setTimeout(() => {
                    showNotification('Venda processada! Redirecionando...', 'info');
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
                    
                    // Save trade as completed
                    completeTradeProposal();
                    
                    // Redirect to home after delay
                    setTimeout(() => {
                        showNotification('Venda processada! Redirecionando...', 'info');
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

// Complete trade proposal
function completeTradeProposal() {
    try {
        const proposals = JSON.parse(localStorage.getItem('tradeProposals') || '[]');
        
        if (proposals.length > 0) {
            // Update the latest proposal status
            proposals[0].status = 'Concluído';
            proposals[0].completedDate = new Date().toISOString();
            
            localStorage.setItem('tradeProposals', JSON.stringify(proposals));
            
            // Also save to sales history
            saveSaleToHistory(proposals[0]);
            
            console.log('Proposta de troca concluída:', proposals[0]);
        }
    } catch (error) {
        console.error('Erro ao concluir proposta:', error);
    }
}

// Save sale to history
function saveSaleToHistory(proposal) {
    try {
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        
        const newSale = {
            id: Date.now(),
            name: proposal.product?.name || 'Produto',
            price: proposal.youReceive,
            announcedPrice: proposal.announcedPrice,
            commission: proposal.commission,
            image: proposal.product?.image || '',
            game: proposal.product?.game || 'Counter-Strike 2',
            date: new Date().toISOString(),
            status: 'Concluído',
            method: 'Steam Trade',
            transactionId: generateTransactionId()
        };
        
        sales.unshift(newSale);
        
        // Keep only last 50 sales
        if (sales.length > 50) {
            sales.splice(50);
        }
        
        localStorage.setItem('sales', JSON.stringify(sales));
        
        console.log('Venda salva no histórico:', newSale);
    } catch (error) {
        console.error('Erro ao salvar venda:', error);
    }
}

// Generate transaction ID
function generateTransactionId() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = 'SALE-';
    for (let i = 0; i < 12; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
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

if (userItem) {
    userItem.addEventListener('error', function() {
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

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
    displayTradeInfo();
    console.log('Troca Venda - Página carregada');
});

console.log('Troca Venda - Script carregado');
