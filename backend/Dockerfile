FROM node:18-alpine

WORKDIR /app

# 创建日志目录（通过 volume 挂载持久化）
RUN mkdir -p /app/logs

# 只复制后端需要的文件
COPY server/ ./server/
COPY package.json package-lock.json* ./

# 安装生产依赖
RUN npm install --omit=dev

# 暴露端口
EXPOSE 3001

# 健康检查 — 每 30 秒探测 /api/health
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=15s \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动后端服务
CMD ["node", "server/index.js"]
