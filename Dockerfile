#Dockerfile

FROM httpd:2.4

MAINTAINER Greg Leitheiser <greg@servantscode.org>

COPY ./dist/parish-manager-ui/ /usr/local/apache2/htdocs
