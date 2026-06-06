// DOM Elements
const backBtn = document.getElementById('back-btn');
const copyBtn = document.getElementById('copy-btn');
const tradeLinkUrl = document.getElementById('trade-link-url');

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Copy button functionality
if (copyBtn && tradeLinkUrl) {
    copyBtn.addEventListener('click', async () => {
        const linkText = tradeLinkUrl.textContent.trim();
        
        try {
            // Try to use the modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(linkText);
                showNotification('Link copiado com sucesso!', 'success');
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = linkText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        showNotification('Link copiado com sucesso!', 'success');
                    } else {
                        showNotification('Erro ao copiar o link', 'error');
                    }
                } catch (err) {
                    showNotification('Erro ao copiar o link', 'error');
                    console.error('Fallback: Oops, unable to copy', err);
                }
                
                document.body.removeChild(textArea);
            }
        } catch (err) {
            showNotification('Erro ao copiar o link', 'error');
            console.error('Failed to copy: ', err);
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

// Load trade link from localStorage if available
window.addEventListener('DOMContentLoaded', () => {
    const savedTradeLink = localStorage.getItem('userTradeLink');
    
    if (savedTradeLink && tradeLinkUrl) {
        tradeLinkUrl.textContent = savedTradeLink;
    } else {
        // Default trade link (can be empty or a placeholder)
        // tradeLinkUrl.textContent = 'Nenhum Trade Link configurado';
    }
});

// Optional: Add functionality to edit/update the trade link
// You can add an "Edit" button that allows users to update their trade link
