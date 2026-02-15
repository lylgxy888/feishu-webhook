# 飞书机器人配置指南

## 方案：使用 GitHub API + Actions

### 为什么选择这个方案？

- ✅ 不需要公网服务器
- ✅ 免费且稳定
- ✅ 支持 POST 请求
- ✅ 全球 CDN

### 工作原理

```
飞书用户 → 飞书云端 → GitHub API → GitHub Actions → OpenClaw Gateway → AI 回复 → 飞书
```

## 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击"Generate new token" → "Generate new token (classic)"
3. 勾选权限：
   - ✅ `repo` - Full control of private repositories
4. 点击"Generate token"
5. 复制 Token（只显示一次）

### 2. 配置飞书开放平台

1. 访问 https://open.feishu.cn/app
2. 选择你的应用
3. 进入"事件订阅"页面
4. 添加事件：`im.message.receive_v1`
5. 配置方式选择：**将事件发送至开发者服务器**
6. 请求地址填写：
   ```
   https://api.github.com/repos/lylgxy888/feishu-webhook/dispatch
   ```
7. 订阅方式：长连接
8. 权限：`im:message`
9. 保存

### 3. 配置 GitHub API Token

在你的飞书机器人代码中添加 Token：

```javascript
// 在 .github/workflows/webhook.yml 中添加
const githubToken = process.env.GITHUB_TOKEN; // Actions 自动提供
const repo = 'lylgxy888/feishu-webhook';

// 发送事件到 GitHub API
await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'message',
    client_payload: {
      text: { content: '消息内容' },
      sender: { sender_type: 'user' },
      message_id: 'msg-123'
    }
  })
});
```

### 4. 测试

1. 在飞书群中发送消息给机器人
2. 查看 GitHub Actions 是否运行
3. 检查 AI 是否自动回复

## 常见问题

### Q: 为什么不能直接使用 GitHub Pages URL？

A: GitHub Pages 不支持 POST 请求，只支持 GET。

### Q: 需要部署代码吗？

A: 不需要，直接使用 GitHub Pages。

### Q: 如何获取 GITHUB_TOKEN？

A: GitHub Actions 自动提供，不需要手动配置。

## 下一步

- 配置飞书事件订阅
- 测试机器人回复
- 自定义 AI 回复逻辑
