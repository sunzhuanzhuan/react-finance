#Version 1.0  bentley front project basic on alpine

FROM harbor.weiboyi.com/wby/nginx-alpine-base:1.0
MAINTAINER  xuehao  "xuehao@weiboyi.com"

COPY ./build/ /var/www/Front-End-Finance/
COPY ./Front-End-Finance.conf /etc/nginx/conf.d/
COPY ./mknginxproxyapiconf.sh /wby/entrypoint-devbox.sh
RUN chmod +x /wby/entrypoint-devbox.sh

VOLUME  ["/var/log/nginx","/var/log/application"]

LABEL aliyun.logs.nginx=stdout aliyun.logs.front_end_finance_nginx_access=/var/log/nginx/front_end_finance_access-*.log aliyun.logs.front_end_finance_nginx_access.tags="name=front_end_finance_nginx_access" aliyun.logs.nginx=stdout aliyun.logs.front_end_finance_nginx_error=/var/log/nginx/front_end_finance_error-*.log aliyun.logs.front_end_finance_nginx_error.tags="name=front_end_finance_nginx_error"

EXPOSE  80
#Supervisord start nginx php-fpm
CMD ["/wby/entrypoint-devbox.sh"]
