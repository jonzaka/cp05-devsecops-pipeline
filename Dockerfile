# Imagem de produção do portal de status da Arcanjosa.
# Base pinada em versão específica (não "latest") para que o scan do Trivy
# seja reprodutível e uma atualização de base seja uma decisão explícita.
FROM nginx:1.29-alpine

# Nginx é servidor estático: só copiamos os arquivos do site.
COPY site/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ > /dev/null || exit 1
