FROM nginxinc/nginx-unprivileged

RUN mkdir -p /usr/share/nginx/html

COPY index.html /usr/share/nginx/html/
COPY src /usr/share/nginx/html/src/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]