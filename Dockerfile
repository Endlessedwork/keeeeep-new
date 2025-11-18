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

# Build-time public envs (inlined into web bundle)
ARG EXPO_PUBLIC_FIREBASE_API_KEY
ARG EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG EXPO_PUBLIC_FIREBASE_PROJECT_ID
ARG EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG EXPO_PUBLIC_FIREBASE_APP_ID
ARG EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION
ARG EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL

ENV EXPO_PUBLIC_FIREBASE_API_KEY=$EXPO_PUBLIC_FIREBASE_API_KEY \
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=$EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN \
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=$EXPO_PUBLIC_FIREBASE_PROJECT_ID \
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=$EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET \
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    EXPO_PUBLIC_FIREBASE_APP_ID=$EXPO_PUBLIC_FIREBASE_APP_ID \
    EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION=$EXPO_PUBLIC_FIREBASE_FUNCTIONS_REGION \
    EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL=$EXPO_PUBLIC_FIREBASE_FUNCTIONS_URL

# Build static export for web
ENV CI=true
RUN npx expo export --platform web --output-dir web-dist

# 2) Serve with Nginx
FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/web-dist/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
