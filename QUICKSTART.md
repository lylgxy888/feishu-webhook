# 快速开始指南

## 步骤1: 上传到 GitHub

1. 在 GitHub 上创建新仓库（如 `feishu-webhook`）
2. 将 `D:\sc\feishu\feishu-webhook` 文件夹中的所有文件上传到仓库
3. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/lylgxy888/feishu-webhook.git
git push -u origin main
```

## 步骤2: 启用 GitHub Pages

1. 进入仓库页面
2. 点击 **Settings**
3. 左侧菜单选择 **Pages**
4. **Build and deployment** → **Branch**
5. 选择 `main` 分支，目录选择 `/ (root)`
6. 点击 **Save**

## 步骤3: 等待部署完成

- GitHub Pages 通常需要 1-3 分钟部署
- 部署完成后会显示 URL：`https://lylgxy888.github.io/feishu-webhook`

## 步骤4: 配置飞书

1. 访问 https://open.feishu.cn/app
2. 选择你的应用
3. 进入"事件订阅"页面
4. 添加事件：`im.message.receive_v1`
5. 填写请求地址：`https://lylgxy888.github.io/feishu-webhook`
6. 选择"长连接"方式
7. 添加权限：`im:message`
8. 保存并发布应用

## 步骤5: 测试

1. 在飞书群中发送消息给机器人
2. 查看仓库的 **Actions** 标签页
3. 检查工作流是否正常运行
4. 等待 AI 回复

## 常见问题

### GitHub Pages 无法访问？

- 等待 1-2 分钟让部署完成
- 检查仓库设置中的 Pages 配置
- 查看部署日志

### Actions 运行失败？

1. 进入仓库的 **Actions** 标签页
2. 点击失败的工作流
3. 查看详细的错误日志
4. 根据错误信息调整配置

### 飞书收不到消息？

1. 检查 Webhook URL 是否正确
2. 确认应用已发布
3. 检查事件订阅是否启用
4. 查看飞书开放平台的日志

## 下一步

- 自定义 AI 回复逻辑
- 添加更多飞书功能
- 优化用户体验

## 技术支持

如有问题，请查看 README.md 或提交 Issue。
