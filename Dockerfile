# Utilise l'image officielle Nginx
FROM nginx:alpine

# Supprime la configuration par défaut (optionnel)
RUN rm -rf /usr/share/nginx/html/*

# Copie les fichiers de ton projet vers le répertoire web de Nginx
COPY index.html /usr/share/nginx/html/
COPY src /usr/share/nginx/html/src

# Expose le port 80
EXPOSE 80

# Lance Nginx en mode non-démon
CMD ["nginx", "-g", "daemon off;"]