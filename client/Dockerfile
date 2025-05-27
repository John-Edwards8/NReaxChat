FROM node:slim AS development

ARG VITE_WEBSOCKET_URL
ARG VITE_GATEWAY_URL

ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}
ENV VITE_GATEWAY_URL=${VITE_GATEWAY_URL}

WORKDIR /code
COPY package*.json .
RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM nginx:1.28.0-alpine
COPY --from=build /code/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf