// DOM Elements
const backBtn = document.getElementById('back-btn');
const privacyItems = document.querySelectorAll('.privacy-item');
const toggleSwitches = document.querySelectorAll('.toggle-switch');

// Privacy settings state
const privacySettings = {
    profile: true,      // Privar perfil - default ON
    inventory: false,   // Privar Inventário
    email: false,       // Ocultar e-mail
    steamid: false      // Ocultar ID Steam
};

// Load saved settings
loadPrivacySettings();

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'configuracoes.html';
    });
}

// Toggle switches click handlers
toggleSwitches.forEach((toggleSwitch, index) => {
    const privacyItem = privacyItems[index];
    const settingKey = privacyItem.dataset.setting;
    
    // Click on toggle switch
    toggleSwitch.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSetting(settingKey, privacyItem, toggleSwitch);
    });
    
    // Click on privacy item (entire row)
    privacyItem.addEventListener('click', () => {
        toggleSetting(settingKey, privacyItem, toggleSwitch);
    });
});

// Toggle setting function
function toggleSetting(settingKey, privacyItem, toggleSwitch) {
    // Toggle the state
    privacySettings[settingKey] = !privacySettings[settingKey];
    
    // Update UI
    if (privacySettings[settingKey]) {
        privacyItem.classList.add('active');
        toggleSwitch.classList.add('active');
    } else {
        privacyItem.classList.remove('active');
        toggleSwitch.classList.remove('active');
    }
    
    // Save to localStorage
    savePrivacySettings();
    
    // Show notification
    const settingNames = {
        profile: 'Privar perfil',
        inventory: 'Privar Inventário',
        email: 'Ocultar e-mail',
        steamid: 'Ocultar ID Steam'
    };
    
    const status = privacySettings[settingKey] ? 'ativado' : 'desativado';
    showNotification(`${settingNames[settingKey]} ${status}`, 'success');
    
    console.log('Privacy settings:', privacySettings);
}

// Save privacy settings to localStorage
function savePrivacySettings() {
    try {
        localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    } catch (error) {
        console.error('Erro ao salvar configurações de privacidade:', error);
    }
}

// Load privacy settings from localStorage
function loadPrivacySettings() {
    try {
        const savedSettings = localStorage.getItem('privacySettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Update state
            Object.keys(settings).forEach(key => {
                privacySettings[key] = settings[key];
            });
            
            // Update UI
            privacyItems.forEach((item, index) => {
                const settingKey = item.dataset.setting;
                const toggleSwitch = toggleSwitches[index];
                
                if (privacySettings[settingKey]) {
                    item.classList.add('active');
                    toggleSwitch.classList.add('active');
                } else {
                    item.classList.remove('active');
                    toggleSwitch.classList.remove('active');
                }
            });
            
            console.log('Configurações de privacidade carregadas:', privacySettings);
        }
    } catch (error) {
        console.error('Erro ao carregar configurações de privacidade:', error);
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

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Space or Enter to toggle focused toggle switch
    if (e.key === ' ' || e.key === 'Enter') {
        const focusedToggle = document.activeElement;
        if (focusedToggle && focusedToggle.classList.contains('toggle-switch')) {
            e.preventDefault();
            focusedToggle.click();
        }
    }
});
