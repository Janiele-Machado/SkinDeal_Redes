<?php

namespace Config;

use PDO;
use PDOException;

class Database
{
    private const HOST = 'mysql_server_skindeal';
    private const PORT = '3306';
    private const NAME = 'projeto_skindeal';
    private const USER = 'desenvolvedor';
    private const PASS = '123456789';

    private PDO $connection;

    public function __construct()
    {
        $this->connect();
    }

    private function connect(): void
    {
        try {
            $dsn = 'mysql:host=' . self::HOST . ';dbname=' . self::NAME . ';port=' . self::PORT . ';charset=utf8mb4';
            $this->connection = new PDO($dsn, self::USER, self::PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $exception) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao conectar ao banco de dados.',
                'detail' => $exception->getMessage(),
            ]);
            exit;
        }
    }

    public function query(string $sql, array $params = []): \PDOStatement
    {
        $statement = $this->connection->prepare($sql);
        $statement->execute($params);
        return $statement;
    }

    public function lastInsertId(): string
    {
        return $this->connection->lastInsertId();
    }
}
