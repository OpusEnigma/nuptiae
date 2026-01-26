FROM node:24-alpine

WORKDIR /app

# Outils utiles
RUN apk add --no-cache git

# Optimisations npm
ENV npm_config_fund=false \
    npm_config_audit=false

EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host"]
