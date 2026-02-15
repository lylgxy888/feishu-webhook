# 飞书 AI 机器人服务器

接收飞书消息，调用智谱 AI (GLM-4)，自动回复到飞书群聊。

## 功能特点

- ✅ 接收飞书群聊消息
- ✅ 调用智谱 AI 生成回复
- ✅ 支持多轮对话（保存会话历史）
- ✅ 自动回复到飞书

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

### 3. 启动服务器

```bash
npm start
```

## 部署到 Vercel（推荐）

### 1. 准备代码

```bash
cd server
npm install
```

### 2. 部署到 Vercel

```bash
npm i -g vercel
vercel
```

### 3. 配置环境变量

在 Vercel Dashboard 中添加环境变量：
- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `ZHIPU_API_KEY`

### 4. 获取 Webhook URL

部署成功后，Vercel 会给你一个 URL，例如：
```
https://your-project.vercel.app/webhook
```

## 飞书配置

1. 打开飞书开放平台：https://open.feishu.cn/app
2. 选择你的应用 → 事件订阅
3. 填写请求地址：`https://your-server.com/webhook`
4. 添加事件：`im.message.receive_v1`
5. 添加权限：
   - `im:message`
   - `im:message:send_as_bot`
6. 发布应用

## 环境变量说明

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `FEISHU_APP_ID` | 飞书应用 ID | 飞书开放平台 → 应用凭证 |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | 飞书开放平台 → 应用凭证 |
| `ZHIPU_API_KEY` | 智谱 AI API Key | https://open.bigmodel.cn/ |
| `PORT` | 服务器端口 | 默认 3000 |

## 技术栈

- Node.js
- Express
- 智谱 AI (GLM-4)
- 飞书 Open API
