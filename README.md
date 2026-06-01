# SkinDeal - Infraestrutura com Docker e Serviços de Redes

## Descrição

O SkinDeal é uma aplicação web desenvolvida como parte das disciplinas de Programação Web, Gerência de Projetos e Serviços de Redes. O projeto utiliza uma arquitetura baseada em containers Docker para simular um ambiente de implantação moderno, integrando servidor web, banco de dados, proxy reverso e armazenamento persistente.

A infraestrutura foi projetada para demonstrar conceitos de virtualização, comunicação entre serviços, proxy reverso, persistência de dados e gerenciamento de aplicações utilizando Docker Compose.

---

## Arquitetura da Solução

A aplicação é composta pelos seguintes serviços:

### Apache + PHP

Responsável por executar a aplicação web e processar os scripts PHP.

### MySQL

Banco de dados relacional utilizado para armazenamento das informações da aplicação.

### phpMyAdmin

Ferramenta web para administração e gerenciamento do banco de dados MySQL.

### Nginx Proxy Manager

## Funcionamento do Proxy Reverso

O projeto utiliza o Nginx Proxy Manager como Proxy Reverso para encaminhar as requisições dos usuários para a aplicação executada no servidor Apache.

O Nginx Proxy Manager e o servidor Apache estão conectados à mesma rede Docker, denominada **app_net**. Quando uma rede Docker é criada, o Docker disponibiliza automaticamente um serviço interno de resolução de nomes (DNS interno) para todos os containers conectados a essa rede.

Dessa forma, cada serviço pode ser acessado pelo nome definido no arquivo `docker-compose.yml`. No caso deste projeto, o serviço da aplicação está identificado como **apache_server_skindeal**.

Quando uma requisição chega ao Nginx Proxy Manager, o Proxy Host configurado encaminha a solicitação para o endereço **apache:80**. O nome **apache** não é resolvido por um servidor DNS externo da Internet, mas sim pelo mecanismo de descoberta de serviços (*service discovery*) fornecido pela própria rede Docker.

O fluxo de comunicação ocorre da seguinte forma:

```text
Usuário
    |
    v
Nginx Proxy Manager
    |
    v
apache:80
    |
    v
Aplicação PHP
    |
    v
  MySQL
```

Durante os testes, foi possível verificar que o DNS interno do Docker estava funcionando corretamente através do comando:

```bash
docker exec -it nginx_proxy_manager_skindeal getent hosts apache
```

O resultado retornou o endereço IP interno associado ao container Apache, comprovando que o nome do serviço estava sendo resolvido corretamente pela rede Docker.

Essa abordagem elimina a necessidade de configurar endereços IP fixos entre os containers, tornando a infraestrutura mais flexível, escalável e semelhante aos ambientes modernos de implantação de aplicações.


### Volume Compartilhado (Simulação NFS)

Foi implementado através de volumes Docker para garantir a persistência dos arquivos enviados pelos usuários (uploads), mesmo após a recriação dos containers.

---

## Topologia da Rede

```text
Usuário
    |
    v
Nginx Proxy Manager
    |
    v
Apache + PHP
    |
    v
  MySQL

  Uploads
    |
    v
Volume Docker Persistente
```

Todos os containers estão conectados através de uma rede Docker privada, permitindo a comunicação interna por meio do DNS interno fornecido pelo Docker.

---

## Tecnologias Utilizadas

* Docker
* Docker Compose
* Apache
* PHP
* MySQL 8
* phpMyAdmin
* Nginx Proxy Manager

---

## Estrutura dos Containers

| Container                    | Função                                 |
| ---------------------------- | -------------------------------------- |
| apache_server_skindeal       | Servidor da aplicação PHP              |
| mysql_server_skindeal        | Banco de dados MySQL                   |
| phpmyadmin_server_skindeal   | Administração do banco de dados        |
| nginx_proxy_manager_skindeal | Proxy reverso e gerenciamento de hosts |

---

## Persistência de Dados

O projeto utiliza volumes Docker para garantir a persistência das informações:

### mysql_data

Responsável por armazenar os dados do banco MySQL.

### uploads_data

Responsável por armazenar os arquivos enviados pelos usuários, simulando um ambiente de armazenamento compartilhado semelhante ao NFS.

Dessa forma, os dados permanecem disponíveis mesmo após a remoção ou recriação dos containers.

---

## Variáveis de Ambiente

As credenciais do banco de dados foram externalizadas através de um arquivo `.env`, evitando o armazenamento de informações sensíveis diretamente no código-fonte.

Exemplo ilustrativo:

```env
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=projeto
MYSQL_USER=aluno
MYSQL_PASSWORD=123456

MYSQL_PORT=3356
PHPMYADMIN_PORT=8051
```

---

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
```

### 2. Acessar a pasta do projeto

```bash
cd projeto
```

### 3. Subir os containers

```bash
docker compose up -d --build
```

### 4. Verificar os containers

```bash
docker ps
```

---

## Acessos

### Aplicação

```text
http://localhost
```

### Painel do Nginx Proxy Manager

```text
http://localhost:81
```

### phpMyAdmin

```text
http://localhost:8051
```

---

## Autores

Projeto desenvolvido para fins acadêmicos nas disciplinas de Programação Web, Gerência de Projetos e Serviços de Redes pelos estudantes: Janiele de Farias Machado, Arthur ARTHUR Henrique Dias do Couto, Heitor Messias Gomes, Kaiky Leite Malaquias e Samuel Kushi de Paiva.
