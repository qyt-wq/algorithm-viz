# 阶段1：构建前端
FROM node:18-alpine AS builder

WORKDIR /app

# 使用淘宝 npm 镜像加速（国内服务器）
RUN npm config set registry https://registry.npmmirror.com

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# 阶段2：Nginx 提供静态文件服务
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
