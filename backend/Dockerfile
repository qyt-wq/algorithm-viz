FROM node:18-alpine

WORKDIR /app

# 只复制后端需要的文件
COPY server/ ./server/
COPY package.json package-lock.json* ./

# 安装生产依赖
RUN npm install --omit=dev

# 暴露端口
EXPOSE 3001

# 启动后端服务
CMD ["node", "server/index.js"]
