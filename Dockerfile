FROM httpd:2-alpine

COPY ./web/ /usr/local/apache2/htdocs/

# Change apache conf to enable mod_rewrite
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's#AllowOverride [Nn]one#AllowOverride All#' /usr/local/apache2/conf/httpd.conf

VOLUME /usr/local/apache2/htdocs/conf