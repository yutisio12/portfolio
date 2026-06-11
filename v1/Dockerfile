ARG NODE_VERSION=20.19.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

FROM base as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
