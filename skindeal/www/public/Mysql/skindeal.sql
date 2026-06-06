CREATE DATABASE IF NOT EXISTS skindeal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skindeal;

CREATE TABLE IF NOT EXISTS usuarios (
  usuarios_id INT NOT NULL AUTO_INCREMENT,
  usuarios_nome VARCHAR(120) NOT NULL,
  usuarios_email VARCHAR(180) NOT NULL,
  usuarios_senha VARCHAR(255) NOT NULL,
  usuarios_saldo DECIMAL(10,2) NOT NULL DEFAULT 0,
  usuarios_nivel INT NOT NULL DEFAULT 2,
  usuarios_data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuarios_id),
  UNIQUE KEY uk_usuarios_email (usuarios_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jogos (
  jogos_id INT NOT NULL AUTO_INCREMENT,
  jogos_nome VARCHAR(120) NOT NULL,
  jogos_icone VARCHAR(255) NOT NULL,
  PRIMARY KEY (jogos_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS skins (
  skins_id INT NOT NULL AUTO_INCREMENT,
  jogos_id INT NOT NULL,
  skins_nome VARCHAR(160) NOT NULL,
  skins_preco DECIMAL(10,2) NOT NULL,
  skins_exterior VARCHAR(80) DEFAULT NULL,
  skins_descricao TEXT,
  skins_imagem VARCHAR(255) NOT NULL,
  skins_status ENUM('Disponivel','Vendida','Pendente') NOT NULL DEFAULT 'Disponivel',
  PRIMARY KEY (skins_id),
  KEY fk_skins_jogos (jogos_id),
  CONSTRAINT fk_skins_jogos FOREIGN KEY (jogos_id) REFERENCES jogos (jogos_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS propostas_venda (
  propostas_id INT NOT NULL AUTO_INCREMENT,
  usuarios_id INT NOT NULL,
  skins_id INT NOT NULL,
  propostas_preco_anunciado DECIMAL(10,2) NOT NULL,
  propostas_comissao DECIMAL(10,2) NOT NULL,
  propostas_valor_receber DECIMAL(10,2) NOT NULL,
  propostas_status ENUM('Pendente','Concluida','Cancelada') NOT NULL DEFAULT 'Pendente',
  propostas_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (propostas_id),
  KEY fk_propostas_usuarios (usuarios_id),
  KEY fk_propostas_skins (skins_id),
  CONSTRAINT fk_propostas_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios (usuarios_id),
  CONSTRAINT fk_propostas_skins FOREIGN KEY (skins_id) REFERENCES skins (skins_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS transacoes (
  transacoes_id INT NOT NULL AUTO_INCREMENT,
  comprador_id INT NOT NULL,
  skins_id INT NOT NULL,
  transacoes_valor DECIMAL(10,2) NOT NULL,
  transacoes_metodo VARCHAR(40) NOT NULL DEFAULT 'PIX',
  transacoes_status ENUM('Pendente','Confirmada','Cancelada') NOT NULL DEFAULT 'Pendente',
  transacoes_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (transacoes_id),
  KEY fk_transacoes_comprador (comprador_id),
  KEY fk_transacoes_skins (skins_id),
  CONSTRAINT fk_transacoes_comprador FOREIGN KEY (comprador_id) REFERENCES usuarios (usuarios_id),
  CONSTRAINT fk_transacoes_skins FOREIGN KEY (skins_id) REFERENCES skins (skins_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historico_login (
  historico_id INT NOT NULL AUTO_INCREMENT,
  usuarios_id INT NOT NULL,
  historico_ip VARCHAR(45) DEFAULT NULL,
  historico_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (historico_id),
  KEY fk_historico_usuarios (usuarios_id),
  CONSTRAINT fk_historico_usuarios FOREIGN KEY (usuarios_id) REFERENCES usuarios (usuarios_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios (usuarios_nome, usuarios_email, usuarios_senha, usuarios_saldo, usuarios_nivel)
VALUES
('Administrador SkinDeal', 'admin@skindeal.com', '$2y$10$/peleSVzqoDl3Y5i8i0nfO/IQHCjkjn1WAxDaLT2w/k17NWc8gqb.', 0, 1),
('Usuario Teste', 'teste@skindeal.com', '$2y$10$/peleSVzqoDl3Y5i8i0nfO/IQHCjkjn1WAxDaLT2w/k17NWc8gqb.', 1500, 2)
ON DUPLICATE KEY UPDATE usuarios_email = VALUES(usuarios_email);

INSERT INTO jogos (jogos_id, jogos_nome, jogos_icone)
VALUES
(1, 'Counter-Strike 2', '../Imagens%20do%20site/Image%20(Game)%20(2).png'),
(2, 'Rust', '../Imagens%20do%20site/Rust.png'),
(3, 'Dota 2', '../Imagens%20do%20site/dota.jpg')
ON DUPLICATE KEY UPDATE jogos_nome = VALUES(jogos_nome), jogos_icone = VALUES(jogos_icone);

INSERT INTO skins (skins_id, jogos_id, skins_nome, skins_preco, skins_exterior, skins_descricao, skins_imagem)
VALUES
(1, 1, 'Pistola Dourada', 400.00, 'Pouco usada', 'Skin dourada com acabamento brilhante para colecionadores.', '../Imagens%20do%20site/Image%20(Product).png'),
(2, 1, 'Luvas Vermelhas', 1250.00, 'Testado em Campo', 'Luvas esportivas vermelhas com alta procura no mercado.', '../Imagens%20do%20site/Image%20(Product)%20(1).png'),
(3, 1, 'Bayonet - Crimson Web', 2375.00, 'Testado em Campo', 'Baioneta com pintura Crimson Web e alta valorizacao historica.', '../Imagens%20do%20site/Image%20(Product)%20(2).png'),
(4, 1, 'AK-47 Colorida', 285.00, 'Nova de fabrica', 'Rifle AK-47 com pintura colorida e visual chamativo.', '../Imagens%20do%20site/Image%20(Product)%20(3).png'),
(5, 2, 'M4A4 Roxa', 2185.00, 'Bem desgastada', 'Item raro com tons roxos para destaque no inventario.', '../Imagens%20do%20site/Image%20(Product)%20(4).png'),
(6, 3, 'Karambit', 756.00, 'Pouco usada', 'Faca curva popular entre jogadores competitivos.', '../Imagens%20do%20site/Image%20(Product)%20(5).png')
ON DUPLICATE KEY UPDATE skins_nome = VALUES(skins_nome), skins_preco = VALUES(skins_preco);
