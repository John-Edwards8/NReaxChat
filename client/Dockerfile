FROM node:slim AS development

WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm ci
COPY . /code

ARG VITE_WEBSOCKET_URL

ENV CI=true
ENV PORT=3000
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

CMD [ "npm", "start" ]

FROM development AS dev-envs
RUN <<EOF
apt-get update
apt-get install -y git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF

COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]

FROM development AS build

RUN ["npm", "run", "build"]

FROM nginx:1.28.0-alpine
COPY --from=build /code/dist /usr/share/nginx/html