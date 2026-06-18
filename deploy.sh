#!/bin/bash
# ============================================
# 算法过程可视化系统 — 一键部署脚本
# 用法: bash deploy.sh <服务器IP> [用户名]
# 示例: bash deploy.sh 47.93.170.111 root
# ============================================

set -e

SERVER_IP="${1:?请提供服务器IP}"
SSH_USER="${2:-root}"

echo "============================================"
echo "  算法过程可视化系统 — Docker 部署"
echo "  服务器: ${SSH_USER}@${SERVER_IP}"
echo "============================================"

# 1. 确保服务器已安装 Docker
echo ""
echo "[1/5] 检查服务器 Docker 环境..."
ssh "${SSH_USER}@${SERVER_IP}" '
  command -v docker >/dev/null 2>&1 || {
    echo "正在安装 Docker..."
    curl -fsSL https://get.docker.com | bash
    systemctl enable docker --now
  }
  command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1 || {
    echo "Docker Compose 已内置在 docker compose 中"
  }
  echo "✅ Docker 环境就绪: $(docker --version)"
'

# 2. 打包并上传项目文件
echo ""
echo "[2/5] 打包项目文件..."
tar --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='*.log' \
  -czf /tmp/algoviz-deploy.tar.gz \
  docker-compose.yml \
  backend/ \
  frontend/ \
  server/ \
  src/ \
  public/ \
  index.html \
  package.json \
  package-lock.json \
  vite.config.js \
  .dockerignore

echo "[3/5] 上传到服务器..."
ssh "${SSH_USER}@${SERVER_IP}" 'mkdir -p /opt/algoviz'
scp /tmp/algoviz-deploy.tar.gz "${SSH_USER}@${SERVER_IP}:/opt/algoviz/"
rm -f /tmp/algoviz-deploy.tar.gz

# 4. 解压并构建启动
echo ""
echo "[4/5] 服务器端解压并构建镜像..."
ssh "${SSH_USER}@${SERVER_IP}" << 'EOF'
  set -e
  cd /opt/algoviz

  # 解压
  tar -xzf algoviz-deploy.tar.gz
  rm -f algoviz-deploy.tar.gz

  # 停止旧容器（如果存在）
  docker compose down 2>/dev/null || true

  # 构建镜像并启动
  docker compose up -d --build

  # 等待启动
  echo "等待服务启动..."
  sleep 10

  # 检查状态
  docker compose ps
EOF

# 5. 验证部署
echo ""
echo "[5/5] 验证部署..."
echo "健康检查: http://${SERVER_IP}/api/health"
curl -s "http://${SERVER_IP}/api/health" || echo "⚠ 后端可能还在启动中，请等待几秒后重试"

echo ""
echo "============================================"
echo "  ✅ 部署完成！"
echo "  应用地址: http://${SERVER_IP}"
echo "  API 健康检查: http://${SERVER_IP}/api/health"
echo "============================================"
