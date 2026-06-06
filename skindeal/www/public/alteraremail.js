// DOM Elements
const backBtn = document.getElementById('back-btn');
const emailForm = document.getElementById('email-form');
const currentEmailInput = document.getElementById('current-email');
const newEmailInput = document.getElementById('new-email');
const confirmEmailInput = document.getElementById('confirm-email');
const submitBtn = document.getElementById('submit-btn');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}
// Faz o label subir quando o input está preenchido
document.querySelectorAll('.email-input').forEach(input => {
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

    // Atualizar ao carregar a página (caso tenha valor salvo)
    update();
});



// Form validation and submission
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const currentEmail = currentEmailInput.value.trim();
        const newEmail = newEmailInput.value.trim();
        const confirmEmail = confirmEmailInput.value.trim();

        // Validation
        if (!currentEmail || !newEmail || !confirmEmail) {
            showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(currentEmail)) {
            showNotification('E-mail atual inválido', 'error');
            return;
        }

        if (!emailRegex.test(newEmail)) {
            showNotification('Novo e-mail inválido', 'error');
            return;
        }

        if (!emailRegex.test(confirmEmail)) {
            showNotification('Confirmação de e-mail inválida', 'error');
            return;
        }

        // Check if new email matches confirmation
        if (newEmail !== confirmEmail) {
            showNotification('Os e-mails não correspondem', 'error');
            return;
        }

        // Check if new email is different from current
        if (currentEmail === newEmail) {
            showNotification('O novo e-mail deve ser diferente do atual', 'error');
            return;
        }

        // Save email to localStorage and navigate to confirmation page
        localStorage.setItem('pendingEmailChange', JSON.stringify({
            currentEmail,
            newEmail,
            timestamp: Date.now()
        }));

        showNotification('Redirecionando para confirmação...', 'success');

        setTimeout(() => {
            window.location.href = 'confirmaremail.html';
        }, 1000);
    });
}

// Real-time validation for confirm email
if (confirmEmailInput && newEmailInput) {
    confirmEmailInput.addEventListener('input', () => {
        const newEmail = newEmailInput.value.trim();
        const confirmEmail = confirmEmailInput.value.trim();

        if (confirmEmail && newEmail !== confirmEmail) {
            confirmEmailInput.style.borderColor = '#ff4444';
        } else {
            confirmEmailInput.style.borderColor = '#e0e0e0';
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
