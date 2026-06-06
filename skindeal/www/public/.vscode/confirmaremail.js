// DOM Elements
const backBtn = document.getElementById('back-btn');
const codeInputs = document.querySelectorAll('.code-input');
const resendBtn = document.getElementById('resend-btn');
const confirmBtn = document.getElementById('confirm-btn');

// State
let resendCooldown = false;
let cooldownTime = 60; // seconds
let cooldownInterval;

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'alteraremail.html';
    });
}

// Code input handling
codeInputs.forEach((input, index) => {
    // Only allow numbers
    input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Only allow single digit numbers
        if (!/^\d$/.test(value)) {
            e.target.value = '';
            return;
        }
        
        // Move to next input automatically
        if (value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
        
        // Check if all inputs are filled
        checkCodeComplete();
    });
    
    // Handle backspace
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            if (!input.value && index > 0) {
                // Move to previous input if current is empty
                codeInputs[index - 1].focus();
            }
        }
    });
    
    // Handle paste
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        // Check if pasted data is 5 digits
        if (/^\d{5}$/.test(pastedData)) {
            codeInputs.forEach((inp, i) => {
                inp.value = pastedData[i] || '';
            });
            codeInputs[4].focus();
            checkCodeComplete();
        }
    });
    
    // Select all on focus
    input.addEventListener('focus', (e) => {
        e.target.select();
    });
});

// Check if all code inputs are filled
function checkCodeComplete() {
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    if (code.length === 5 && /^\d{5}$/.test(code)) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}

// Resend code functionality
if (resendBtn) {
    resendBtn.addEventListener('click', () => {
        if (resendCooldown) {
            return;
        }
        
        // Simulate sending code
        showNotification('Código reenviado com sucesso!', 'success');
        
        // Start cooldown
        startCooldown();
    });
}

// Start cooldown timer
function startCooldown() {
    resendCooldown = true;
    resendBtn.disabled = true;
    let timeLeft = cooldownTime;
    
    resendBtn.textContent = `Reenviar código (${timeLeft}s)`;
    
    cooldownInterval = setInterval(() => {
        timeLeft--;
        resendBtn.textContent = `Reenviar código (${timeLeft}s)`;
        
        if (timeLeft <= 0) {
            clearInterval(cooldownInterval);
            resendCooldown = false;
            resendBtn.disabled = false;
            resendBtn.textContent = 'Reenviar código';
        }
    }, 1000);
}

// Confirm button functionality
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        
        if (code.length !== 5 || !/^\d{5}$/.test(code)) {
            showNotification('Por favor, insira um código válido de 5 dígitos', 'error');
            return;
        }
        
        // Simulate code verification
        // In a real app, this would verify with backend
        const isValidCode = verifyCode(code);
        
        if (isValidCode) {
            // Get pending email change from localStorage
            const pendingChange = localStorage.getItem('pendingEmailChange');
            
            if (pendingChange) {
                const { newEmail } = JSON.parse(pendingChange);
                
                // Update user email
                localStorage.setItem('userEmail', newEmail);
                
                // Clear pending change
                localStorage.removeItem('pendingEmailChange');
                
                showNotification('E-mail alterado com sucesso!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'configuracoes.html';
                }, 1500);
            }
        } else {
            showNotification('Código inválido. Tente novamente.', 'error');
            
            // Clear inputs
            codeInputs.forEach(input => {
                input.value = '';
            });
            codeInputs[0].focus();
            checkCodeComplete();
        }
    });
}

// Verify code (simulated)
function verifyCode(code) {
    // In a real application, this would verify with the backend
    // For demo purposes, accept any 5-digit code
    // Or you can use a specific code like '12345' for testing
    return code.length === 5 && /^\d{5}$/.test(code);
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

// Focus first input on page load
window.addEventListener('DOMContentLoaded', () => {
    codeInputs[0].focus();
    
    // Check if there's a pending email change
    const pendingChange = localStorage.getItem('pendingEmailChange');
    if (!pendingChange) {
        showNotification('Sessão expirada. Redirecionando...', 'error');
        setTimeout(() => {
            window.location.href = 'alteraremail.html';
        }, 2000);
    }
});
