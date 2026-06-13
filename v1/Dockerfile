ARG NODE_VERSION=20.19.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps as build
COPY . .
RUN npm run build

FROM base as production
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/server.js ./
COPY --from=build /usr/src/app/public ./public

EXPOSE 3456
CMD ["node", "server.js"]
