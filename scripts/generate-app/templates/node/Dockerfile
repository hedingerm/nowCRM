FROM node:22-alpine AS common-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./tsconfig.base.json ./tsconfig.json /app/


COPY ./apps/{{APP_NAME}}/package.json /app/apps/{{APP_NAME}}/
COPY ./libs/services/package.json /app/libs/services/

RUN pnpm install --frozen-lockfile

FROM common-deps AS builder

COPY ./apps/{{APP_NAME}} /app/apps/{{APP_NAME}}
COPY ./libs/services /app/libs/services

RUN pnpm --filter @nowcrm/{{APP_NAME}} build

RUN pnpm deploy --filter={{APP_NAME_KEBAB}} --prod /prod/{{APP_NAME}}

FROM common-deps AS runner

COPY --from=builder /prod/{{APP_NAME}} /prod/{{APP_NAME}}
WORKDIR /prod/{{APP_NAME}}

EXPOSE 3010
CMD ["pnpm", "start"]