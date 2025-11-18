FROM node:22-alpine AS common-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./tsconfig.json /app/


COPY ./apps/dal/package.json /app/apps/dal/
COPY ./libs/services/package.json /app/libs/services/

RUN pnpm install --frozen-lockfile

FROM common-deps AS builder

COPY ./apps/dal /app/apps/dal
COPY ./libs/services /app/libs/services

RUN pnpm --filter @nowcrm/dal build

RUN pnpm deploy --filter=dal --prod /prod/dal

FROM common-deps AS runner

COPY --from=builder /prod/dal /prod/dal
WORKDIR /prod/dal

EXPOSE 6001
CMD ["pnpm", "start"]