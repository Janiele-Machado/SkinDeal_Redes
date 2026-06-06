// DOM Elements
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const gamesGrid = document.getElementById('games-grid');
const confirmBtn = document.getElementById('confirm-btn');
const gameItems = document.querySelectorAll('.game-item');

// Selected games state
let selectedGames = new Set();

// Load saved preferences
loadSavedPreferences();

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Game item selection
gameItems.forEach(item => {
    item.addEventListener('click', () => {
        const gameName = item.dataset.game;
        
        if (item.classList.contains('selected')) {
            // Deselect
            item.classList.remove('selected');
            selectedGames.delete(gameName);
        } else {
            // Select
            item.classList.add('selected');
            selectedGames.add(gameName);
        }
        
        console.log('Jogos selecionados:', Array.from(selectedGames));
    });
});

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        gameItems.forEach(item => {
            const gameName = item.querySelector('.game-name').textContent.toLowerCase();
            
            if (gameName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Confirm button
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        if (selectedGames.size === 0) {
            showNotification('Selecione pelo menos um jogo', 'error');
            return;
        }
        
        // Save preferences to localStorage
        localStorage.setItem('gamePreferences', JSON.stringify(Array.from(selectedGames)));
        
        showNotification(`${selectedGames.size} ${selectedGames.size === 1 ? 'jogo selecionado' : 'jogos selecionados'}!`, 'success');
        
        // Redirect back to settings after a delay
        setTimeout(() => {
            window.location.href = 'configuracoes.html';
        }, 1500);
    });
}

// Load saved preferences from localStorage
function loadSavedPreferences() {
    const savedPreferences = localStorage.getItem('gamePreferences');
    
    if (savedPreferences) {
        try {
            const preferences = JSON.parse(savedPreferences);
            
            preferences.forEach(gameName => {
                const gameItem = document.querySelector(`[data-game="${gameName}"]`);
                if (gameItem) {
                    gameItem.classList.add('selected');
                    selectedGames.add(gameName);
                }
            });
            
            console.log('Preferências carregadas:', preferences);
        } catch (error) {
            console.error('Erro ao carregar preferências:', error);
        }
    }
}

// Show Notification Toast
function showNotification(message, type = 'info') {
    console.log(message);
    
    // Create toast notification
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
    }, 3000);
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

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Press Enter on search to focus first visible game
    if (e.key === 'Enter' && document.activeElement === searchInput) {
        const firstVisibleGame = Array.from(gameItems).find(item => item.style.display !== 'none');
        if (firstVisibleGame) {
            firstVisibleGame.click();
        }
    }
});
