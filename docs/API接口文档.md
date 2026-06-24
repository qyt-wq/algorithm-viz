# 📡 RESTful API 接口文档

> **Base URL**: `http://{host}:3001`（本地开发）或 `http://{host}/api`（Docker 部署，Nginx 反向代理）  
> **Content-Type**: `application/json`  
> **字符编码**: UTF-8

---

## 一、鉴权说明

除注册/登录/健康检查外，所有需要用户身份的接口要求携带 JWT：

```
Authorization: Bearer <token>
```

Token 在注册/登录成功后返回，有效期 **1 天**。前端存储在 `localStorage.auth_token`。

---

## 二、通用错误码

| 状态码 | 含义 | 触发场景 |
|--------|------|----------|
| `200` | 成功 | 正常响应 |
| `201` | 创建成功 | 注册成功 |
| `400` | 请求参数错误 | 缺少必填字段、格式校验失败 |
| `401` | 未认证 | Token 缺失/无效/过期 |
| `404` | 资源不存在 | 登录时用户不存在 |
| `409` | 资源冲突 | 注册时用户名已存在 |
| `500` | 服务器内部错误 | 数据库异常、未知错误 |

---

## 三、健康检查

### `GET /api/health`

无需认证，用于 Docker healthcheck 和负载均衡探测。

**请求示例**：
```bash
curl http://localhost:3001/api/health
```

**响应 200**：
```json
{
  "status": "ok",
  "timestamp": "2026-06-24T12:00:00.000Z"
}
```

---

## 四、认证模块 `/api/auth`

### 4.1 用户注册

```
POST /api/auth/register
```

**请求体**：

| 字段 | 类型 | 必填 | 约束 |
|------|------|------|------|
| `username` | string | 是 | 2–50 字符，允许字母/数字/下划线/中文 |
| `password` | string | 是 | 最少 3 字符 |

```json
{
  "username": "zhangsan",
  "password": "abc123"
}
```

**响应 201**：
```json
{
  "success": true,
  "message": "注册成功",
  "token": "eyJhbGciOi...",
  "username": "zhangsan"
}
```

**错误响应**：

| 状态码 | error 字段 |
|--------|-----------|
| 400 | `用户名和密码不能为空` |
| 400 | `用户名长度需在 2-50 个字符之间` |
| 400 | `密码长度不能少于 3 个字符` |
| 400 | `用户名只能包含字母、数字、下划线和中文` |
| 409 | `用户名已存在` |

---

### 4.2 用户登录

```
POST /api/auth/login
```

**请求体**：

| 字段 | 类型 | 必填 | 约束 |
|------|------|------|------|
| `username` | string | 是 | 已注册的用户名 |
| `password` | string | 是 | 对应密码 |

```json
{
  "username": "zhangsan",
  "password": "abc123"
}
```

**响应 200**：
```json
{
  "success": true,
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "username": "zhangsan"
}
```

**错误响应**：

| 状态码 | error 字段 |
|--------|-----------|
| 400 | `用户名和密码不能为空` |
| 404 | `用户不存在` |
| 401 | `密码错误` |

---

### 4.3 验证 Token

```
GET /api/auth/me
Authorization: Bearer <token>
```

前端启动时调用，验证 localStorage 中的 token 是否仍然有效。

**响应 200**：
```json
{
  "username": "zhangsan"
}
```

**响应 401**：
```json
{ "error": "未登录" }
```
或
```json
{ "error": "登录已过期，请重新登录" }
```
或
```json
{ "error": "无效的登录凭证" }
```

---

## 五、学习统计模块 `/api/stats`

> 以下接口全部需要 JWT 鉴权，除 `heartbeat-beacon` 外。

### 5.1 记录一次算法执行

```
POST /api/stats/learning
Authorization: Bearer <token>
```

每次用户执行算法后前端静默调用，记录学习行为。

**请求体**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `algorithmId` | string | 是 | 算法 ID，如 `quicksort` |
| `algorithmName` | string | 是 | 算法中文名，如 `快速排序` |
| `stepsCount` | number | 否 | 本次生成的总步骤数 |

```json
{
  "algorithmId": "quicksort",
  "algorithmName": "快速排序",
  "stepsCount": 35
}
```

**响应 200**：
```json
{
  "success": true,
  "message": "学习记录已保存"
}
```

---

### 5.2 获取学习统计

```
GET /api/stats/learning
Authorization: Bearer <token>
```

**响应 200**：
```json
{
  "total": 42,
  "totalSteps": 1280,
  "algorithms": [
    {
      "algorithm_id": "quicksort",
      "algorithm_name": "快速排序",
      "count": 15,
      "totalSteps": 520,
      "lastUsed": "2026-06-24T10:30:00.000Z"
    },
    {
      "algorithm_id": "dijkstra",
      "algorithm_name": "Dijkstra 最短路径",
      "count": 8,
      "totalSteps": 96,
      "lastUsed": "2026-06-23T14:20:00.000Z"
    }
  ],
  "recent": [
    {
      "id": 128,
      "algorithm_id": "quicksort",
      "algorithm_name": "快速排序",
      "steps_count": 35,
      "created_at": "2026-06-24T10:30:00.000Z"
    }
  ]
}
```

| 返回字段 | 说明 |
|----------|------|
| `total` | 累计执行次数 |
| `totalSteps` | 累计执行步骤总数 |
| `algorithms[]` | 各算法分组统计（按执行次数降序） |
| `recent[]` | 最近 10 条记录（按时间降序） |

---

### 5.3 获取登录统计

```
GET /api/stats/login
Authorization: Bearer <token>
```

**响应 200**：
```json
{
  "totalLogins": 15,
  "firstLogin": "2026-06-01T08:00:00.000Z",
  "lastLogin": "2026-06-24T09:00:00.000Z",
  "recent": [
    { "id": 88, "login_at": "2026-06-24T09:00:00.000Z" },
    { "id": 87, "login_at": "2026-06-23T08:30:00.000Z" }
  ]
}
```

---

### 5.4 心跳上报学习时长

```
POST /api/stats/heartbeat
Authorization: Bearer <token>
```

前端 `SessionTimer` 组件每 **30 秒** 调用一次，记录持续学习时长。

**请求体**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `seconds` | number | 是 | 本次增加的秒数（通常为 30） |

```json
{ "seconds": 30 }
```

**响应 200**：
```json
{ "success": true }
```

> **实现细节**：使用 `INSERT ... ON DUPLICATE KEY UPDATE` 原子累加，首次插入 `user_stats` 行，后续在原值上累加。

---

### 5.5 sendBeacon 上报（页面关闭时）

```
POST /api/stats/heartbeat-beacon
```

> ⚠️ 此接口**不走 Authorization Header**（`sendBeacon` 不支持自定义 Header），token 放在 Body 中。

**请求体**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `token` | string | 是 | JWT 令牌 |
| `seconds` | number | 是 | 页面关闭时未上报的剩余秒数 |

```json
{
  "token": "eyJhbGciOi...",
  "seconds": 12
}
```

**响应 200**：
```json
{ "success": true }
```

> Token 无效时静默返回 `success: true`（不抛错），保证页面关闭流程不被阻塞。

---

### 5.6 获取累计学习时长

```
GET /api/stats/cumulative
Authorization: Bearer <token>
```

**响应 200**：
```json
{ "totalSeconds": 3725 }
```

> 3725 秒 = 1 小时 2 分 5 秒，前端 `formatDuration()` 负责格式化。

---

### 5.7 获取综合统计概览

```
GET /api/stats/summary
Authorization: Bearer <token>
```

用于首页统计面板一次性展示全维度数据。后端使用 `Promise.all` 并行 4 条查询。

**响应 200**：
```json
{
  "totalExecutions": 42,
  "uniqueAlgorithms": 4,
  "totalLogins": 15,
  "totalLoginDays": 8,
  "totalLearningSeconds": 3725,
  "lastLogin": "2026-06-24T09:00:00.000Z",
  "favoriteAlgorithm": "快速排序"
}
```

| 返回字段 | 来源 | 说明 |
|----------|------|------|
| `totalExecutions` | `learning_records` COUNT | 累计执行次数 |
| `uniqueAlgorithms` | `learning_records` COUNT DISTINCT | 学过的不同算法种类数 |
| `totalLogins` | `login_records` COUNT | 累计登录次数 |
| `totalLoginDays` | `login_records` COUNT DISTINCT DATE | 登录天数（去重日期） |
| `totalLearningSeconds` | `user_stats` | 累计学习时长（秒） |
| `lastLogin` | `login_records` MAX | 最后一次登录时间 |
| `favoriteAlgorithm` | `learning_records` GROUP BY TOP 1 | 执行次数最多的算法名 |

---

## 六、接口汇总表

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| `GET` | `/api/health` | — | 健康检查 |
| `POST` | `/api/auth/register` | — | 用户注册 |
| `POST` | `/api/auth/login` | — | 用户登录 |
| `GET` | `/api/auth/me` | Bearer | 验证 Token 有效性 |
| `POST` | `/api/stats/learning` | Bearer | 记录学习行为 |
| `GET` | `/api/stats/learning` | Bearer | 学习统计详情 |
| `GET` | `/api/stats/login` | Bearer | 登录统计详情 |
| `POST` | `/api/stats/heartbeat` | Bearer | 心跳上报（30s 间隔） |
| `POST` | `/api/stats/heartbeat-beacon` | Body Token | sendBeacon 上报（页面关闭） |
| `GET` | `/api/stats/cumulative` | Bearer | 累计学习时长 |
| `GET` | `/api/stats/summary` | Bearer | 综合统计概览 |

---

## 七、前端调用时序

```
应用启动
  │
  ├─ GET /api/auth/me   ─── 验证 localStorage token 是否有效
  │
  ├─ [未登录] → 显示 AuthPage
  │     └─ POST /api/auth/register → 注册
  │     └─ POST /api/auth/login    → 登录 → 存 token
  │
  └─ [已登录] → 进入主界面
        │
        ├─ GET /api/stats/summary   ─── 统计面板初始化
        │
        ├─ [用户执行算法]
        │     └─ POST /api/stats/learning  ─── 记录学习行为（静默）
        │
        ├─ [每 30 秒]
        │     └─ POST /api/stats/heartbeat  ─── 心跳上报
        │
        └─ [用户关闭页面]
              └─ navigator.sendBeacon('/api/stats/heartbeat-beacon')
```

---

*文档基于 `server/routes/auth.js`、`server/routes/stats.js` 实际代码生成。*
