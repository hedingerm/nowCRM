FROM node:22-alpine

# Installing system dependencies (libvips-dev needed for sharp)
RUN apk update && apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  nasm \
  bash \
  vips-dev \
  git \
  curl

# Set environment
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Prepare working directory
WORKDIR /opt/

# Copy only dependency files for caching
COPY package.json pnpm-lock.yaml ./

# Configure pnpm fetch retry & install dependencies
RUN pnpm config set fetch-retry-maxtimeout 600000 \
  && pnpm install --frozen-lockfile

# Make global node binaries available
ENV PATH=/opt/node_modules/.bin:$PATH

# Copy application source
WORKDIR /opt/app
COPY . .

# Adjust permissions
RUN chown -R node:node /opt/app
USER node

# Build the app
RUN pnpm run build

# Expose app port
EXPOSE 1337

# Default command (development mode)
CMD ["pnpm", "run","develop"]