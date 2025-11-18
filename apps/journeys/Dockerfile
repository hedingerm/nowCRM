FROM node:22-alpine AS common-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./tsconfig.json /app/


COPY ./apps/journeys/package.json /app/apps/journeys/
COPY ./libs/services/package.json /app/libs/services/

RUN pnpm install --frozen-lockfile

FROM common-deps AS builder

COPY ./apps/journeys /app/apps/journeys
COPY ./libs/services /app/libs/services

RUN pnpm --filter @nowcrm/journeys build

RUN pnpm deploy --filter=journeys --prod /prod/journeys

FROM common-deps AS runner

COPY --from=builder /prod/journeys /prod/journeys
WORKDIR /prod/journeys

EXPOSE 3010
CMD ["pnpm", "start"]