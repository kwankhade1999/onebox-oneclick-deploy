# ---------- builder stage ----------
FROM node:18 AS builder
WORKDIR /app

# copy package manifests first to leverage layer caching
COPY package*.json ./

# install dev deps so tsc/build works
RUN npm ci --no-audit --no-fund

# copy entire project
COPY . .

# build TypeScript to /app/dist (assumes "npm run build" builds to dist)
RUN npm run build

# prune dev deps (optional): keep only production modules in node_modules-prod
RUN npm prune --production

# ---------- runtime stage ----------
FROM node:18-alpine AS runtime
WORKDIR /app

# set node env for smaller footprint
ENV NODE_ENV=production

# copy only build artifacts and production node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# expose the port your app uses
EXPOSE 3000

# default command — adjust if your built entry file is different
CMD ["node","dist/server.js"]

