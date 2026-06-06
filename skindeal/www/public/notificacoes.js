// DOM Elements
const backBtn = document.getElementById('back-btn');
const notificationItems = document.querySelectorAll('.notification-item');
const toggleSwitches = document.querySelectorAll('.toggle-switch');

// Notification states (stored in localStorage)
const notificationStates = {
    display: true,
    purchase: false,
    sale: false,
    newskins: false
};

// Load saved states from localStorage
function loadNotificationStates() {
    const saved = localStorage.getItem('notificationStates');
    if (saved) {
        const savedStates = JSON.parse(saved);
        Object.assign(notificationStates, savedStates);
    }
    
    // Apply loaded states to UI
    Object.keys(notificationStates).forEach(key => {
        const item = document.querySelector(`[data-notification="${key}"]`);
        const toggle = document.querySelector(`[data-toggle="${key}"]`);
        
        if (item && toggle) {
            if (notificationStates[key]) {
                item.classList.add('active');
                toggle.classList.add('active');
            } else {
                item.classList.remove('active');
                toggle.classList.remove('active');
            }
        }
    });
}

// Save states to localStorage
function saveNotificationStates() {
    localStorage.setItem('notificationStates', JSON.stringify(notificationStates));
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        // Return to configuracoes page
        window.location.href = 'configuracoes.html';
    });
}

// Toggle notification items
notificationItems.forEach(item => {
    item.addEventListener('click', () => {
        const notificationType = item.dataset.notification;
        const toggle = item.querySelector('.toggle-switch');
        
        // Toggle state
        const currentState = notificationStates[notificationType];
        notificationStates[notificationType] = !currentState;
        
        // Update UI
        if (notificationStates[notificationType]) {
            item.classList.add('active');
            toggle.classList.add('active');
            showNotification(`${getNotificationLabel(notificationType)} ativada`);
        } else {
            item.classList.remove('active');
            toggle.classList.remove('active');
            showNotification(`${getNotificationLabel(notificationType)} desativada`);
        }
        
        // Save to localStorage
        saveNotificationStates();
    });
});

// Get notification label for messages
function getNotificationLabel(type) {
    const labels = {
        display: 'Exibir notificações',
        purchase: 'Confirmação de compra',
        sale: 'Confirmação de venda',
        newskins: 'Novas skins adicionadas'
    };
    return labels[type] || 'Notificação';
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
        z-index: 1100;
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

// Initialize on page load
loadNotificationStates();
