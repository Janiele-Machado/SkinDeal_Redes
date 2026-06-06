// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpar erros
function clearErrors() {
    document.getElementById('emailError').classList.remove('active');
    document.getElementById('passwordError').classList.remove('active');
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
}

// Mostrar erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

const API_URL = '../api.php';

// Submit do formulário
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    clearErrors();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    // Validação do e-mail
    if (!email) {
        showError('email', 'Por favor, insira seu e-mail');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Por favor, insira um e-mail válido');
        isValid = false;
    }
    
    // Validação da senha
    if (!password) {
        showError('password', 'Por favor, insira sua senha');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'A senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    if (isValid) {
        try {
            const response = await fetch(`${API_URL}?route=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();

            if (!result.success) {
                showError('password', result.message || 'E-mail ou senha invalidos');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(result.user));
            window.location.href = 'home.html';
        } catch (error) {
            showError('password', 'Nao foi possivel conectar ao servidor');
        }
    }
});

// Botão Steam
document.getElementById('steamBtn').addEventListener('click', function() {
    // Abre a página da Steam em nova aba
    window.open('https://steamcommunity.com/login', '_blank');
    
    // Redireciona para home após breve delay
    setTimeout(function() {
        window.location.href = 'home.html';
    }, 500);
});
