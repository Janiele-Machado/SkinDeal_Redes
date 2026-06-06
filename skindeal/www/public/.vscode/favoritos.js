// DOM Elements
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const favoriteCards = document.querySelectorAll('.favorite-card');
const favoriteBtns = document.querySelectorAll('.favorite-btn');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
}

// Search input handler
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log(`Buscando: ${searchTerm}`);
        
        // Filter cards based on search (in a real app, this would filter by item names)
        if (searchTerm.length > 0) {
            showNotification(`Buscando por: "${searchTerm}"`);
        }
    });
}



// Favorite button click handlers
favoriteBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardNumber = btn.dataset.card;
        
        console.log(`Removendo dos favoritos: Card ${cardNumber}`);
        
        // Confirm removal
        if (confirm('Deseja remover este item dos favoritos?')) {
            const card = btn.closest('.favorite-card');
            
            // Animate removal
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
            
            showNotification('Item removido dos favoritos!');
        }
    });
});

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
