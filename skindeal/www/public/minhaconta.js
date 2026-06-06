// DOM Elements
const backBtn = document.getElementById('back-btn');
const menuOptions = document.querySelectorAll('.menu-option');
const modalTrocarConta = document.getElementById('modal-trocar-conta');
const modalAccountItems = document.querySelectorAll('.modal-account-item');
const modalAddSession = document.querySelector('.modal-add-session');
const API_URL = '../api.php';

// Account data
const accounts = {
    zeca: {
        name: 'Zeca Pagodinho',
        image: '../Imagens%20do%20site/07a12d69ab4c8ad8a4988544fdc25f16751ed2e5_widemd%201%20(1).png',
        alt: 'Zeca Pagodinho'
    },
    raca: {
        name: 'RAÇA ABSOLUTA',
        image: '../Imagens%20do%20site/images%201%20(1).png',
        alt: 'RAÇA ABSOLUTA'
    }
};

let currentAccount = 'zeca';

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
}

// Menu options click handlers
menuOptions.forEach(option => {
    option.addEventListener('click', () => {
        const action = option.dataset.action;
        
        const actionMessages = {
            'compras': 'Minhas compras',
            'vendas': 'Minhas vendas',
            'historico': 'Histórico de login',
            'trocar': 'Trocar conta',
            'excluir': 'Excluir conta',
            'sair': 'Sair'
        };
        
        const message = actionMessages[action] || 'Opção';
        console.log(`Clicou em: ${message}`);
        
        // Navigate to minhas compras
        if (action === 'compras') {
            window.location.href = 'minhascompras.html';
            return;
        }
        
        // Navigate to minhas vendas
        if (action === 'vendas') {
            window.location.href = 'minhasvendas.html';
            return;
        }
        
        // Navigate to historico de login
        if (action === 'historico') {
            window.location.href = 'historicologin.html';
            return;
        }
        
        // Show modal for trocar conta
        if (action === 'trocar') {
            showModal();
            return;
        }
        
        // Special handling for logout
        if (action === 'sair') {
            if (confirm('Deseja realmente sair da sua conta?')) {
                showNotification('Saindo...');
                fetch(`${API_URL}?route=logout`, { method: 'POST' }).finally(() => {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                });
            }
            return;
        }
        
        // Special handling for delete account
        if (action === 'excluir') {
            // Redirect to confirmation page
            window.location.href = 'confirmarexclusao.html';
            return;
        }
        
        // Show notification for other options
        showNotification(`${message} - Em desenvolvimento`);
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
        font-family: 'Poppins', 'Arial', sans-serif;
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

// Initialize modal with account data
function initializeModal() {
    modalAccountItems.forEach(item => {
        const accountKey = item.dataset.account;
        const account = accounts[accountKey];
        
        if (account) {
            const img = item.querySelector('img');
            const name = item.querySelector('.account-name');
            
            if (img) {
                img.src = account.image;
                img.alt = account.alt;
            }
            
            if (name) {
                name.textContent = account.name;
            }
        }
    });
}

// Add event listeners to modal account items
modalAccountItems.forEach(item => {
    item.addEventListener('click', () => {
        const accountKey = item.dataset.account;
        
        // Don't switch if clicking on current account
        if (accountKey === currentAccount) {
            hideModal();
            return;
        }
        
        const account = accounts[accountKey];
        
        if (account) {
            currentAccount = accountKey;
            updateProfile(accountKey);
            hideModal();
        }
    });
});

// Add event listener to add session button
if (modalAddSession) {
    modalAddSession.addEventListener('click', () => {
        showNotification('Adicionar nova sessão - Em desenvolvimento');
        hideModal();
    });
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalTrocarConta && modalTrocarConta.classList.contains('active')) {
        hideModal();
    }
});

// Show modal function
function showModal() {
    if (modalTrocarConta) {
        modalTrocarConta.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal function
function hideModal() {
    if (modalTrocarConta) {
        modalTrocarConta.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
if (modalTrocarConta) {
    modalTrocarConta.addEventListener('click', (e) => {
        if (e.target === modalTrocarConta) {
            hideModal();
        }
    });
}

// Update profile function
function updateProfile(accountKey) {
    const account = accounts[accountKey];
    
    if (!account) return;
    
    // Update profile name
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = account.name;
    }
    
    // Update profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.src = account.image;
        profileImage.alt = account.alt;
    }
    
    // Update modal states
    updateModalStates(accountKey);
    
    // Show notification
    showNotification(`Conta trocada para ${account.name}`);
}

// Update modal states function
function updateModalStates(newAccountKey) {
    modalAccountItems.forEach(item => {
        const accountKey = item.dataset.account;
        
        // Remove current-account class from all
        item.classList.remove('current-account');
        
        // Remove existing badge
        const existingBadge = item.querySelector('.modal-logado-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add current-account class to the new current account
        if (accountKey === newAccountKey) {
            item.classList.add('current-account');
            
            // Add badge to current account
            const accountInfo = item.querySelector('.modal-account-info');
            if (!accountInfo) {
                // Create account info wrapper if it doesn't exist
                const nameElement = item.querySelector('.modal-account-name');
                if (nameElement && nameElement.parentElement === item) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'modal-account-info';
                    nameElement.parentElement.insertBefore(wrapper, nameElement);
                    wrapper.appendChild(nameElement);
                }
            }
            
            const info = item.querySelector('.modal-account-info');
            if (info) {
                const badge = document.createElement('span');
                badge.className = 'modal-logado-badge';
                badge.textContent = 'Logado';
                info.appendChild(badge);
            }
        }
    });
}

// Initialize modal on page load
initializeModal();

async function loadLoggedUser() {
    try {
        const response = await fetch(`${API_URL}?route=me`);
        const result = await response.json();
        const user = result.success ? result.user : JSON.parse(localStorage.getItem('currentUser') || 'null');

        if (!user) return;

        const profileName = document.querySelector('.profile-name');
        const profileEmail = document.querySelector('.profile-email');
        const profileId = document.querySelector('.profile-id');
        const profileDate = document.querySelector('.profile-date');
        const earnings = document.querySelector('.earnings-value');

        if (profileName) profileName.textContent = user.name || user.usuarios_nome || 'Usuario SkinDeal';
        if (profileEmail) profileEmail.textContent = user.email || user.usuarios_email || '';
        if (profileId) profileId.textContent = `ID: ${user.id || user.usuarios_id || '-'}`;
        if (profileDate && user.createdAt) profileDate.textContent = `Conta Criada em: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}`;
        if (earnings && user.earnings !== undefined) earnings.textContent = `R$ ${Number(user.earnings).toFixed(2).replace('.', ',')}`;
    } catch (error) {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (user) {
            const profileName = document.querySelector('.profile-name');
            const profileEmail = document.querySelector('.profile-email');
            if (profileName) profileName.textContent = user.usuarios_nome || user.name || 'Usuario SkinDeal';
            if (profileEmail) profileEmail.textContent = user.usuarios_email || user.email || '';
        }
    }
}

loadLoggedUser();
