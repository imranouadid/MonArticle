FROM php:8.4-fpm
LABEL maintainer="Imrane Ouadid"

RUN apt-get update && apt-get install -y zlib1g-dev g++ git libicu-dev zip libzip-dev libpq-dev zip \
    && docker-php-ext-install intl opcache pdo  \
    && pecl install apcu mongodb \
    && docker-php-ext-enable apcu mongodb \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/backend/

COPY docker/php/custom-php.ini /usr/local/etc/php/conf.d/custom-php.ini

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin


RUN adduser --disabled-password --gecos '' user
RUN chown -R user:user /var/www/backend/

USER user
