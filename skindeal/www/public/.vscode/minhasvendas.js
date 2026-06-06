// DOM Elements
const backBtn = document.getElementById('back-btn');
const filterBtn = document.getElementById('filter-btn');
const saleCards = document.querySelectorAll('.sale-card');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'minhaconta.html';
    });
}

// Filter button handler
if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        console.log('Classificar vendas');
        showFilterOptions();
    });
}

// Sale card click handlers
saleCards.forEach((card) => {
    card.addEventListener('click', () => {
        const itemName = card.dataset.item;
        const itemDate = card.dataset.date;
        
        console.log(`Venda selecionada: ${itemName} - ${itemDate}`);
        showNotification(`${itemName} - ${itemDate}`);
    });
});

// Show Filter Options
function showFilterOptions() {
    const options = [
        'Mais recentes',
        'Mais antigas',
        'Por jogo',
        'Por nome'
    ];
    
    const optionsText = options.join('\n');
    const selectedOption = prompt(`Classificar por:\n\n${optionsText}\n\nDigite o número (1-4):`);
    
    if (selectedOption && selectedOption >= 1 && selectedOption <= 4) {
        showNotification(`Classificando por: ${options[selectedOption - 1]}`);
        // Future: Implement actual sorting logic here
    }
}

// Show Notification Toast
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
        font-family: 'Poppins', 'Arial', sans-serif;
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
