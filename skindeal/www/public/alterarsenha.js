// DOM Elements
const backBtn = document.getElementById('back-btn');
const passwordForm = document.getElementById('password-form');
const currentEmailInput = document.getElementById('current-email');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Form validation and submission
if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const currentEmail = currentEmailInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validation
        if (!currentEmail || !newPassword || !confirmPassword) {
            showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(currentEmail)) {
            showNotification('E-mail inválido', 'error');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Check if new password matches confirmation
        if (newPassword !== confirmPassword) {
            showNotification('As senhas não correspondem', 'error');
            return;
        }

        // Validate password strength (optional)
        if (!isPasswordStrong(newPassword)) {
            showNotification('A senha deve conter letras e números', 'error');
            return;
        }

        // Save password change request to localStorage and navigate to confirmation page
        localStorage.setItem('pendingPasswordChange', JSON.stringify({
            email: currentEmail,
            timestamp: Date.now()
        }));

        showNotification('Redirecionando para confirmação...', 'success');

        setTimeout(() => {
            window.location.href = 'confirmarsenha.html';
        }, 1000);
    });
}

// Faz o label subir quando o input está preenchido
document.querySelectorAll('.password-input').forEach(input => {
    const container = input.closest('.input-container');

    function update() {
        if (input.value.trim() !== "") {
            container.classList.add('filled');
        } else {
            container.classList.remove('filled');
        }
    }

    input.addEventListener('input', update);
    input.addEventListener('blur', update);

    // Atualizar no carregamento caso tenha valor salvo
    update();
});



// Password strength validation
function isPasswordStrong(password) {
    // At least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
}

// Real-time validation for confirm password
if (confirmPasswordInput && newPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (confirmPassword && newPassword !== confirmPassword) {
            confirmPasswordInput.parentElement.style.borderColor = '#ff4444';
        } else {
            confirmPasswordInput.parentElement.style.borderColor = '#e0e0e0';
        }
    });
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

// Load current email if available (from localStorage or user session)
window.addEventListener('DOMContentLoaded', () => {
    // You can load the current user's email from localStorage or session
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && currentEmailInput) {
        currentEmailInput.value = userEmail;
    }
});
