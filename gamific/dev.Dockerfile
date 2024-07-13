FROM node:21-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY next.config.mjs .
COPY tsconfig.json .
COPY postcss.config.mjs .
COPY tailwind.config.ts .
COPY .eslintrc.json .

CMD npm run dev