// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpar erros
function clearErrors() {
    document.getElementById('nameError').classList.remove('active');
    document.getElementById('emailError').classList.remove('active');
    document.getElementById('passwordError').classList.remove('active');
    document.getElementById('confirmPasswordError').classList.remove('active');
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
}

// Mostrar erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

const API_URL = '../api.php';

// Submit do formulário
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    clearErrors();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;
    
    // Validação do nome
    if (!name) {
        showError('name', 'Por favor, insira seu nome');
        isValid = false;
    }
    
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
    
    // Validação da confirmação de senha
    if (!confirmPassword) {
        showError('confirmPassword', 'Por favor, confirme sua senha');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'As senhas não coincidem');
        isValid = false;
    }
    
    if (isValid) {
        try {
            const response = await fetch(`${API_URL}?route=register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const result = await response.json();

            if (!result.success) {
                showError('email', result.message || 'Nao foi possivel cadastrar');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify(result.user));
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'home.html';
        } catch (error) {
            showError('email', 'Nao foi possivel conectar ao servidor');
        }
    }
});
