// DOM Elements
const backBtn = document.getElementById('back-btn');
const optionCards = document.querySelectorAll('.option-card');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
}

// Option cards click handlers
optionCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        const optionNames = [
            'Minha conta',
            'Notificação',
            'Inventário',
            'Favoritos',
            'Transações',
            'Configurações'
        ];
        
        const optionActions = [
            'minhaconta.html',
            'notificacao.html',
            'inventario.html',
            'favoritos.html',
            'transacoes.html',
            'configuracoes.html'
        ];
        
        console.log(`Clicou em: ${optionNames[index]}`);
        
        // Navigate to specific page if available
        if (optionActions[index]) {
            window.location.href = optionActions[index];
            return;
        }
        
        // Show notification for options under development
        showNotification(`${optionNames[index]} - Em desenvolvimento`);
    });
});



// Show Notification
function showNotification(message) {
    console.log(message);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #10355b;
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Arimo', 'Arial', sans-serif;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2000);
}

// Add CSS animations for toast
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