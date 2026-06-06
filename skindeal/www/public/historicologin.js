// DOM Elements
const backBtn = document.getElementById('back-btn');
const historyCards = document.querySelectorAll('.history-card');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'minhaconta.html';
    });
}

// History card click handlers
historyCards.forEach((card) => {
    card.addEventListener('click', () => {
        const location = card.dataset.location;
        const deviceInfo = card.querySelector('.device-info').textContent;
        
        console.log(`Login selecionado: ${location} - ${deviceInfo}`);
        showLoginDetails(location, deviceInfo);
    });
});

// Show Login Details
function showLoginDetails(location, deviceInfo) {
    const message = `${location}\n${deviceInfo}`;
    
    showNotification('Detalhes do Login');
    
    // Future: Show detailed login information in a modal
    console.log('Detalhes do Login:', message);
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
