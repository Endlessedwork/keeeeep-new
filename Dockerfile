# Multi-stage build for Expo Web (static) + Nginx

# 1) Build web bundle
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install system deps sometimes needed by Expo/Sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ git ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# Build static export for web
ENV CI=true
RUN npx expo export --platform web --output-dir web-dist

# 2) Serve with Nginx
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web-dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

