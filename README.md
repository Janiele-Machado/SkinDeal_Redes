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
<img width="1628" height="75" alt="Captura de tela 2026-06-01 161621" src="https://github.com/user-attachments/assets/8dbfeb35-abc4-4cb7-b73c-ecdd41e47923" />

O resultado retornou o endereço IP interno associado ao container Apache, comprovando que o nome do serviço estava sendo resolvido corretamente pela rede Docker.

Essa abordagem elimina a necessidade de configurar endereços IP fixos entre os containers, tornando a infraestrutura mais flexível, escalável e semelhante aos ambientes modernos de implantação de aplicações.


### Volume Compartilhado (Simulação NFS)

Foi implementado através de um volume Docker denominado mysql_data, utilizado pelo serviço MySQL para armazenar os dados do banco de dados fora do container.

Esse volume garante a persistência das informações cadastradas no sistema, permitindo que dados como usuários, skins, transações e propostas de venda permaneçam armazenados mesmo após a parada, reinicialização ou recriação dos containers.

A solução simula o conceito de um servidor NFS (Network File System), onde os dados ficam armazenados de forma independente da aplicação, podendo ser acessados continuamente pelos serviços que necessitam dessas informações.

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
  (mysql_data)
```
## Demonstração da Persistência

Para comprovar o funcionamento do volume persistente, foi realizado o seguinte procedimento:

1. Cadastro de um usuário

Foi criado um novo usuário através da aplicação.

2. Verificação no banco de dados

Consulta realizada na tabela de usuários:

<img width="1882" height="913" alt="image" src="https://github.com/user-attachments/assets/95dd2212-0347-454e-b36f-09865b3909a7" />

3. Desligamento dos containers
   
        docker compose down
   
   <img width="1698" height="250" alt="image" src="https://github.com/user-attachments/assets/970db9e8-d262-4279-94c5-b166ce110bb9" />
   
5. Inicialização dos containers

       docker compose up -d
   
<img width="1706" height="282" alt="image" src="https://github.com/user-attachments/assets/03ac5db7-b925-4457-b660-ed32666c95f8" />

5. Verificação da persistência

Nova consulta realizada:

    SELECT * FROM usuarios;

O usuário anteriormente cadastrado permanece armazenado no banco de dados.

<img width="1882" height="913" alt="image" src="https://github.com/user-attachments/assets/95dd2212-0347-454e-b36f-09865b3909a7" />

## Evidência do Volume Docker

## Listagem dos volumes criados:

<img width="1086" height="311" alt="image" src="https://github.com/user-attachments/assets/77051492-0122-4fb1-a84e-89ec342d1daf" />

## Inspeção do Volume

Para verificar o local onde os dados estão armazenados:

    docker volume inspect skindeal_mysql_data

<img width="1635" height="483" alt="image" src="https://github.com/user-attachments/assets/b971d60a-7019-4966-b81d-af384c08ecdb" />

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
<img width="1711" height="357" alt="Captura de tela 2026-06-01 162649" src="https://github.com/user-attachments/assets/a8d24b00-dc40-41cb-a400-b3914c5ee7bb" />

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

Projeto desenvolvido para fins acadêmicos nas disciplinas de Programação Web, Gerência de Projetos e Serviços de Redes pelos estudantes: Janiele de Farias Machado, Arthur Henrique Dias do Couto, Heitor Messias Gomes, Kaiky Leite Malaquias e Samuel Kushi de Paiva.
