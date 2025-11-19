FROM node:22-alpine AS common-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./tsconfig.json /app/


COPY ./apps/composer/package.json /app/apps/composer/
COPY ./libs/services/package.json /app/libs/services/

RUN pnpm install --frozen-lockfile

FROM common-deps AS builder

COPY ./apps/composer /app/apps/composer
COPY ./libs/services /app/libs/services

RUN pnpm --filter @nowcrm/composer build

RUN pnpm deploy --filter=composer --prod /prod/composer

FROM common-deps AS runner

COPY --from=builder /prod/composer /prod/composer
WORKDIR /prod/composer

EXPOSE 3020
CMD ["pnpm", "start"]