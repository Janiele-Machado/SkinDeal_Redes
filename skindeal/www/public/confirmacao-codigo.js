// Elementos
const codeInputs = document.querySelectorAll('.code-input');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnReenviar = document.getElementById('btnReenviar');
const btnVoltar = document.getElementById('btnVoltar');

// Função para verificar se todos os campos estão preenchidos com números
function checkAllFieldsFilled() {
    let allFilled = true;
    
    codeInputs.forEach(input => {
        const value = input.value.trim();
        if (!value || !/^\d$/.test(value)) {
            allFilled = false;
        }
    });
    
    // Habilita/desabilita o botão confirmar
    btnConfirmar.disabled = !allFilled;
}

// Auto-focus no próximo input ao digitar
codeInputs.forEach((input, index) => {
    input.addEventListener('input', function(e) {
        const value = this.value;
        
        // Apenas permite números
        if (!/^\d*$/.test(value)) {
            this.value = '';
            return;
        }
        
        // Se digitou um número, vai para o próximo campo
        if (value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
        
        checkAllFieldsFilled();
    });
    
    // Permite voltar com backspace
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
            codeInputs[index - 1].focus();
        }
    });
    
    // Permite colar código completo
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (/^\d{5}$/.test(pastedData)) {
            codeInputs.forEach((input, i) => {
                input.value = pastedData[i];
            });
            codeInputs[4].focus();
            checkAllFieldsFilled();
        }
    });
});

// Botão Confirmar
btnConfirmar.addEventListener('click', function() {
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    if (code.length === 5 && /^\d{5}$/.test(code)) {
        // Redireciona para a tela de alterar senha
        window.location.href = 'login.html';
    }
});

// Botão Reenviar
btnReenviar.addEventListener('click', function() {
    alert('Código reenviado para seu e-mail!');
    
    // Limpa os campos
    codeInputs.forEach(input => {
        input.value = '';
    });
    codeInputs[0].focus();
    checkAllFieldsFilled();
});

// Botão Voltar
btnVoltar.addEventListener('click', function() {
    window.location.href = 'login.html';
});

// Auto-focus no primeiro campo ao carregar
window.addEventListener('load', function() {
    codeInputs[0].focus();
});
