<?php
// Arquivo de entrada simples para testar a aplicação e a conexão com o banco
// Exibe mensagens e tenta conectar ao serviço MySQL definido no Docker Compose

// Mensagem inicial (útil para verificar que o PHP está sendo servido)
echo "Hello World!";

// Cria a conexão MySQLi usando as credenciais do docker-compose
$conn = new mysqli(
    "mysql",   // host: nome do serviço MySQL no compose
    "aluno",   // usuário do banco
    "123456",  // senha (em ambiente real, não deixar em plain text)
    "projeto"  // nome do banco de dados
);

// Verifica se houve erro na conexão e encerra com mensagem
if ($conn->connect_error) {
    die("Erro de conexão");
}

// Mensagens de confirmação
echo "<h1>Projeto funcionando!</h1>";
echo "Conectado ao MySQL com sucesso!";

?>