// DOM Elements
const backBtn = document.getElementById('back-btn');
const shareBtn = document.getElementById('share-btn');
const feedbackForm = document.getElementById('feedback-form');
const nameInput = document.getElementById('name-input');
const commentInput = document.getElementById('comment-input');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Share button functionality
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'SkinDeal - Feedbacks',
            text: 'Envie seu feedback para ajudar a melhorar a SkinDeal!',
            url: window.location.href
        };

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                showNotification('Compartilhado com sucesso!', 'success');
            } else {
                // Fallback: Copy URL to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copiado para a área de transferência!', 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Erro ao compartilhar:', err);
                showNotification('Erro ao compartilhar', 'error');
            }
        }
    });
}

// Form submission
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();
        
        // Validation
        if (!name) {
            showNotification('Por favor, preencha o campo Nome', 'error');
            nameInput.focus();
            return;
        }
        
        if (!comment) {
            showNotification('Por favor, preencha o campo Comentário', 'error');
            commentInput.focus();
            return;
        }
        
        if (comment.length < 10) {
            showNotification('O comentário deve ter pelo menos 10 caracteres', 'error');
            commentInput.focus();
            return;
        }
        
        // Create feedback object
        const feedback = {
            name: name,
            comment: comment,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        // Save to localStorage
        saveFeedback(feedback);
        
        // Show success message
        showNotification('Feedback enviado com sucesso! Obrigado pela sua contribuição.', 'success');
        
        // Reset form
        feedbackForm.reset();
        
        // Redirect back to settings after a delay
        setTimeout(() => {
            window.location.href = 'configuracoes.html';
        }, 2000);
    });
}

// Save feedback to localStorage
function saveFeedback(feedback) {
    try {
        // Get existing feedbacks
        let feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
        
        // Add new feedback
        feedbacks.push(feedback);
        
        // Save back to localStorage
        localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
        
        console.log('Feedback salvo:', feedback);
    } catch (error) {
        console.error('Erro ao salvar feedback:', error);
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

// Character counter for textarea (optional enhancement)
if (commentInput) {
    commentInput.addEventListener('input', () => {
        const length = commentInput.value.length;
        const maxLength = 500; // Optional max length
        
        // Could add a character counter display here
        console.log(`Caracteres: ${length}/${maxLength}`);
    });
}

// Auto-resize textarea
if (commentInput) {
    commentInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(this.scrollHeight, 157.869) + 'px';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === commentInput) {
            feedbackForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // ESC to go back
    if (e.key === 'Escape') {
        if (confirm('Deseja sair sem enviar o feedback?')) {
            window.location.href = 'configuracoes.html';
        }
    }
});

// Load user data if available
window.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.email && nameInput) {
                nameInput.value = user.email;
            } else if (user.name && nameInput) {
                nameInput.value = user.name;
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }
});

// Log page view
console.log('Feedbacks - Página carregada');
