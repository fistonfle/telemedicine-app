# Build stage
FROM node:20-alpine AS builder

# VITE_API_URL must be passed at build time (e.g. Render: set env var + use --build-arg)
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Vite React app for production
RUN npm run build

# Vite outputs to dist/ - verify structure
RUN echo "=== Build output ===" && ls -la dist/ && ls -la dist/assets/ 2>/dev/null || true

# Runtime stage
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
