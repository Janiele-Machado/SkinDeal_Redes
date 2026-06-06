// DOM Elements
const backBtn = document.getElementById('back-btn');
const passwordInput = document.getElementById('password');
const confirmTextInput = document.getElementById('confirm-text');
const deleteBtn = document.getElementById('delete-btn');
const cancelBtn = document.getElementById('cancel-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalDeleteBtn = document.getElementById('modal-delete-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'minhaconta.html';
    });
}

// Cancel button navigation
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'minhaconta.html';
    });
}

// Enable delete button only when both fields are filled correctly
function checkInputs() {
    const passwordFilled = passwordInput.value.trim().length > 0;
    const confirmTextCorrect = confirmTextInput.value.trim().toUpperCase() === 'EXCLUIR';
    
    if (passwordFilled && confirmTextCorrect) {
        deleteBtn.disabled = false;
    } else {
        deleteBtn.disabled = true;
    }
}

if (passwordInput) {
    passwordInput.addEventListener('input', checkInputs);
}

if (confirmTextInput) {
    confirmTextInput.addEventListener('input', checkInputs);
}

// Delete button - show modal
if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
        showModal();
    });
}

// Modal delete button - final confirmation
if (modalDeleteBtn) {
    modalDeleteBtn.addEventListener('click', () => {
        const password = passwordInput.value;
        
        // Simulate password validation
        if (password.length > 0) {
            hideModal();
            showNotification('Conta excluída com sucesso');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            hideModal();
            showNotification('Senha inválida');
        }
    });
}

// Modal cancel button
if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => {
        hideModal();
    });
}

// Close modal when clicking outside
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
}

// Show Modal
function showModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide Modal
function hideModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
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

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        hideModal();
    }
});
