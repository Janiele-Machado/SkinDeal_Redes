// Validação de e-mail
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpar erros
function clearErrors() {
    document.getElementById('emailError').classList.remove('active');
    document.getElementById('newPasswordError').classList.remove('active');
    document.getElementById('confirmPasswordError').classList.remove('active');
    document.getElementById('emailError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
}

// Mostrar erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = message;
    errorElement.classList.add('active');
}

// Submit do formulário
document.getElementById('alterarSenhaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    clearErrors();

    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let isValid = true;

    // Validação do e-mail
    if (!email) {
        showError('email', 'Por favor, insira seu e-mail');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Por favor, insira um e-mail válido');
        isValid = false;
    }

    // Validação da nova senha
    if (!newPassword) {
        showError('newPassword', 'Por favor, insira sua nova senha');
        isValid = false;
    } else if (newPassword.length < 6) {
        showError('newPassword', 'A senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }

    // Validação da confirmação de senha
    if (!confirmPassword) {
        showError('confirmPassword', 'Por favor, confirme sua nova senha');
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        showError('confirmPassword', 'As senhas não coincidem');
        isValid = false;
    }

    // Se válido, redireciona
if (isValid) {
    // Desabilita o formulário
    document.getElementById('email').disabled = true;
    document.getElementById('newPassword').disabled = true;
    document.getElementById('confirmPassword').disabled = true;
    document.getElementById('submitBtn').disabled = true;

    
    setTimeout(function() {
        window.location.href = 'confirmacao-codigo.html';
    }, 500);
}

});
