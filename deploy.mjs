/**
 * 算法过程可视化系统 — 自动部署脚本 (Node.js)
 * 用法: node deploy.mjs <服务器IP> <密码> [用户名]
 */
import { Client } from 'ssh2';
import { createReadStream, unlinkSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { pipeline } from 'stream/promises';

const SERVER_IP = process.argv[2];
const SSH_PASS = process.argv[3];
const SSH_USER = process.argv[4] || 'root';

if (!SERVER_IP || !SSH_PASS) {
  console.log('用法: node deploy.mjs <服务器IP> <密码> [用户名]');
  console.log('示例: node deploy.mjs <服务器IP> <密码> root');
  process.exit(1);
}

const DEPLOY_DIR = '/opt/algoviz';
const TAR_NAME = 'algoviz-deploy.tar.gz';
const TAR_PATH = 'D:/ks/algoviz-deploy.tar.gz';

console.log('============================================');
console.log('  算法过程可视化系统 — Docker 部署');
console.log(`  服务器: ${SSH_USER}@${SERVER_IP}`);
console.log('============================================\n');

// ---- SSH 连接 ----
function sshConnect() {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => resolve(conn));
    conn.on('error', reject);
    conn.connect({
      host: SERVER_IP,
      port: 22,
      username: SSH_USER,
      password: SSH_PASS,
      readyTimeout: 15000,
    });
  });
}

// ---- 执行远程命令 ----
function sshExec(conn, cmd, showOutput = true) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '', stderr = '';
      stream.on('data', (d) => {
        stdout += d.toString();
        if (showOutput) process.stdout.write(d);
      });
      stream.stderr.on('data', (d) => {
        stderr += d.toString();
        if (showOutput) process.stderr.write(d);
      });
      stream.on('close', (code) => {
        if (code !== 0) reject(new Error(`退出码 ${code}: ${stderr.trim()}`));
        else resolve(stdout.trim());
      });
    });
  });
}

// ---- 上传文件 ----
function sftpPut(conn, localPath, remotePath) {
  console.log(`  上传 ${localPath} → ${remotePath}`);
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const readStream = createReadStream(localPath);
      const writeStream = sftp.createWriteStream(remotePath);
      writeStream.on('close', resolve);
      writeStream.on('error', reject);
      let uploaded = 0;
      readStream.on('data', (chunk) => {
        uploaded += chunk.length;
        if (uploaded % (1024 * 1024 * 5) < chunk.length) {
          process.stdout.write(`\r  已上传: ${Math.round(uploaded / 1024 / 1024)} MB`);
        }
      });
      pipeline(readStream, writeStream).catch(reject);
    });
  });
}

// ---- 主流程 ----
async function deploy() {
  // 1. 检查 tar 包
  console.log('[1/5] 检查项目打包...');
  if (!existsSync(TAR_PATH)) {
    console.error('  错误: 未找到 ' + TAR_PATH);
    process.exit(1);
  }
  console.log(`  ✅ 找到 ${TAR_PATH}\n`);

  // 2. SSH 连接
  console.log('[2/5] 连接服务器...');
  const conn = await sshConnect();
  console.log('✅ SSH 连接成功\n');

  try {
    // 3. 检查 Docker
    console.log('[3/5] 检查 Docker 环境...');
    try {
      const ver = await sshExec(conn, 'docker --version', false);
      console.log(`  ${ver}`);
    } catch {
      console.log('  安装 Docker...');
      await sshExec(conn, 'curl -fsSL https://get.docker.com | bash');
      await sshExec(conn, 'systemctl enable docker --now');
      console.log('  ✅ Docker 安装完成');
    }

    // 4. 上传并部署
    console.log('\n[4/5] 上传文件并构建启动...');
    await sshExec(conn, `mkdir -p ${DEPLOY_DIR}`);

    await sftpPut(conn, TAR_PATH, DEPLOY_DIR + '/' + TAR_NAME);
    console.log('  ✅ 上传完成');

    await sshExec(conn, `cd ${DEPLOY_DIR} && tar -xzf ${TAR_NAME} && rm -f ${TAR_NAME}`);
    console.log('  ✅ 解压完成');

    try { await sshExec(conn, `cd ${DEPLOY_DIR} && docker compose down 2>/dev/null || true`, false); } catch {}

    console.log('  构建并启动容器...');
    await sshExec(conn, `cd ${DEPLOY_DIR} && docker compose up -d --build 2>&1`);

    console.log('  等待服务启动 (15秒)...');
    await new Promise((r) => setTimeout(r, 15000));
    await sshExec(conn, `cd ${DEPLOY_DIR} && docker compose ps`);

    // 5. 验证
    console.log('\n[5/5] 验证部署...');
    console.log(`  应用地址: http://${SERVER_IP}`);
    console.log(`  API 健康检查: http://${SERVER_IP}/api/health`);

    try {
      const health = await sshExec(conn, 'curl -s http://localhost/api/health', false);
      console.log(`  ✅ 后端响应: ${health}`);
    } catch {
      console.log('  ⚠ 后端可能还在启动，请稍后手动检查 http://${SERVER_IP}/api/health');
    }

  } finally {
    conn.end();
  }

  console.log('\n============================================');
  console.log('  ✅ 部署完成！');
  console.log(`  访问地址: http://${SERVER_IP}`);
  console.log('============================================');
}

deploy().catch((err) => {
  console.error(`\n❌ 部署失败: ${err.message}`);
  process.exit(1);
});

// 清理
process.on('exit', () => {
  try { unlinkSync(TAR_PATH); } catch {}
});
