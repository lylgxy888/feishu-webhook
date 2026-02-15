# 飞书 Webhook 服务

基于 GitHub Actions 的飞书机器人 webhook 服务。

## Webhook URL

将以下 URL 配置到飞书开放平台：
```
https://lylgxy888.github.io/feishu-webhook
```

## 配置步骤

### 1. 飞书开放平台配置

1. 访问 https://open.feishu.cn/app
2. 选择你的应用
3. 进入"事件订阅"页面
4. 添加事件：`im.message.receive_v1`
5. 填写请求地址：`https://lylgxy888.github.io/feishu-webhook`
6. 选择"长连接"方式
7. 添加权限：`im:message`

### 2. 发布应用

1. 创建版本
2. 提交审核
3. 等待审核通过（通常几分钟）

## 工作原理

```
飞书用户 → 飞书云端 → GitHub API → GitHub Actions → OpenClaw Gateway → AI Agent
```

1. 用户发送消息到飞书群
2. 飞书通过 GitHub API 推送到仓库
3. GitHub Actions 触发工作流
4. Actions 处理消息并转发到 OpenClaw Gateway
5. Gateway 返回 AI 回复
6. Actions 将回复发送到飞书

## 本地测试

### 测试 Webhook

访问 `https://lylgxy888.github.io/feishu-webhook` 查看服务状态

### 测试按钮

点击"测试 Webhook"按钮发送测试消息

## 故障排查

### 问题1: Webhook 收不到消息

- 检查 GitHub Actions 是否正常运行
- 查看仓库的 Actions 标签页
- 检查飞书应用是否已发布

### 问题2: OpenClaw Gateway 连接失败

- 确保 OpenClaw Gateway 已启动
- 检查端口 18789 是否被占用

### 问题3: 飞书返回错误

- 检查 Webhook URL 是否正确
- 检查权限配置是否完整

## 自定义

### 修改 AI 回复逻辑

编辑 `.github/workflows/webhook.yml` 文件中的脚本部分：

```javascript
// 转发到 OpenClaw Gateway
const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        type: 'message',
        channel: 'feishu',
        text: data.text?.content || '无文本内容'
    })
});
```

### 修改飞书 Webhook URL

将 `https://open.feishu.cn/open-apis/bot/v2/hook/fda77564-40f5-4410-8560-450c8c2b03b5` 替换为你的飞书机器人 Webhook URL。

## 许可证

MIT
