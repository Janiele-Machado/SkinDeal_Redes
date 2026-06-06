<?php

declare(strict_types=1);

session_start();

spl_autoload_register(function (string $class): void {
    $path = __DIR__ . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

use Models\SkinDealRepository;

header('Content-Type: application/json; charset=utf-8');

function input(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST;
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function requireUser(): int
{
    if (!isset($_SESSION['user_id'])) {
        respond(['success' => false, 'message' => 'Usuario nao autenticado.'], 401);
    }

    return (int) $_SESSION['user_id'];
}

$repo = new SkinDealRepository();
$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($route === 'register' && $method === 'POST') {
        $data = input();
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = (string) ($data['password'] ?? '');

        if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            respond(['success' => false, 'message' => 'Preencha nome, e-mail valido e senha com pelo menos 6 caracteres.'], 422);
        }

        $id = $repo->createUser($name, $email, $password);
        $_SESSION['user_id'] = $id;
        respond(['success' => true, 'message' => 'Cadastro realizado com sucesso.', 'user' => ['id' => $id, 'name' => $name, 'email' => $email]], 201);
    }

    if ($route === 'login' && $method === 'POST') {
        $data = input();
        $email = trim($data['email'] ?? '');
        $password = (string) ($data['password'] ?? '');
        $user = $repo->authenticate($email, $password, $_SERVER['REMOTE_ADDR'] ?? '');

        if (!$user) {
            respond(['success' => false, 'message' => 'E-mail ou senha invalidos.'], 401);
        }

        $_SESSION['user_id'] = (int) $user['usuarios_id'];
        respond(['success' => true, 'message' => 'Login realizado com sucesso.', 'user' => $user]);
    }

    if ($route === 'logout' && $method === 'POST') {
        session_destroy();
        respond(['success' => true, 'message' => 'Sessao encerrada.']);
    }

    if ($route === 'me' && $method === 'GET') {
        $user = $repo->getUserSummary(requireUser());
        respond(['success' => true, 'user' => $user]);
    }

    if ($route === 'skins' && $method === 'GET') {
        respond(['success' => true, 'skins' => $repo->listSkins($_GET['search'] ?? null)]);
    }

    if ($route === 'skin' && $method === 'GET') {
        $skin = $repo->getSkin((int) ($_GET['id'] ?? 0));
        if (!$skin) {
            respond(['success' => false, 'message' => 'Skin nao encontrada.'], 404);
        }
        respond(['success' => true, 'skin' => $skin]);
    }

    if ($route === 'sale-proposals' && $method === 'POST') {
        $data = input();
        $id = $repo->createSaleProposal(
            requireUser(),
            (int) ($data['skinId'] ?? 0),
            (float) ($data['announcedPrice'] ?? 0)
        );
        respond(['success' => true, 'message' => 'Proposta enviada com sucesso.', 'proposalId' => $id], 201);
    }

    if ($route === 'purchase' && $method === 'POST') {
        $data = input();
        $id = $repo->createPurchase(requireUser(), (int) ($data['skinId'] ?? 0), $data['paymentMethod'] ?? 'PIX');
        respond(['success' => true, 'message' => 'Pagamento confirmado com sucesso.', 'transactionId' => $id], 201);
    }

    respond(['success' => false, 'message' => 'Rota nao encontrada.'], 404);
} catch (InvalidArgumentException $exception) {
    respond(['success' => false, 'message' => $exception->getMessage()], 422);
} catch (Throwable $exception) {
    respond(['success' => false, 'message' => 'Erro interno no servidor.', 'detail' => $exception->getMessage()], 500);
}
