# Base image: PHP 8.2 with Apache webserver
FROM php:8.2-apache

# Instala as extensões PHP necessárias para conectar ao MySQL
# - mysqli: extensão procedural/OO para MySQL
# - pdo + pdo_mysql: abstração PDO para acesso ao MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilita o módulo rewrite do Apache, usado por frameworks e .htaccess
RUN a2enmod rewrite

# Ajusta o DocumentRoot padrão do Apache para apontar para a pasta pública
# do projeto (onde está o index.php). Substitui /var/www/html por
# /var/www/html/www/public no arquivo de site padrão do Apache.
RUN sed -i 's!/var/www/html!/var/www/html/www/public!g' /etc/apache2/sites-available/000-default.conf

# Cria uma configuração adicional do Apache para permitir o uso de .htaccess
# e garantir acesso ao diretório público. Isso escreve um arquivo de configuração
# que será habilitado na etapa seguinte.
RUN echo '<Directory /var/www/html/www/public>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/public.conf

# Habilita a configuração criada acima
RUN a2enconf public

# Define o diretório de trabalho para a aplicação dentro do container
WORKDIR /var/www/html/www/public