/**
 * 飞书 AI 机器人服务器
 * 接收飞书消息，调用智谱 AI，回复到飞书
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置
const PORT = process.env.PORT || 3000;
const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;

// 存储会话历史（简单实现，生产环境应使用数据库）
const sessions = new Map();

/**
 * 验证飞书请求签名
 */
function verifyFeishuSignature(timestamp, nonce, encrypt, signature) {
  const signString = `${timestamp}\n${nonce}\n${encrypt}\n`;
  const computed = crypto
    .createHmac('sha256', FEISHU_APP_SECRET)
    .update(signString)
    .digest('base64');
  return computed === signature;
}

/**
 * 调用智谱 AI
 */
async function callZhipuAI(message, sessionId) {
  try {
    // 获取或创建会话历史
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [
        {
          role: 'system',
          content: '你是一个友好的AI助手，请用中文回复用户的消息。'
        }
      ]);
    }
    
    const history = sessions.get(sessionId);
    history.push({ role: 'user', content: message });
    
    // 只保留最近 10 轮对话
    if (history.length > 21) {
      history.splice(1, history.length - 21);
    }

    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model: 'glm-4-flash',
        messages: history,
        temperature: 0.7,
        max_tokens: 2048
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZHIPU_API_KEY}`
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    
    // 保存 AI 回复到历史
    history.push({ role: 'assistant', content: aiReply });
    
    return aiReply;
  } catch (error) {
    console.error('调用智谱AI失败:', error.response?.data || error.message);
    return '抱歉，AI服务暂时不可用，请稍后再试。';
  }
}

/**
 * 发送消息到飞书
 */
async function sendToFeishu(message, chatId) {
  try {
    // 先获取 tenant_access_token
    const tokenRes = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      }
    );
    
    const token = tokenRes.data.tenant_access_token;

    // 发送消息
    await axios.post(
      'https://open.feishu.cn/open-apis/im/v1/messages',
      {
        receive_id: chatId,
        msg_type: 'text',
        content: JSON.stringify({ text: message })
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          receive_id_type: 'chat_id'
        }
      }
    );

    console.log('消息已发送到飞书');
  } catch (error) {
    console.error('发送到飞书失败:', error.response?.data || error.message);
  }
}

// 健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '飞书 AI 机器人服务运行中' });
});

// 接收飞书消息
app.post('/webhook', async (req, res) => {
  try {
    console.log('收到飞书消息:', JSON.stringify(req.body, null, 2));
    
    const { header, event } = req.body;
    
    // 处理 URL 验证（飞书首次配置时会发送验证请求）
    if (req.body.type === 'url_verification') {
      return res.json({ challenge: req.body.challenge });
    }
    
    // 处理消息事件
    if (event && event.message) {
      const message = event.message;
      const chatId = message.chat_id;
      const sender = event.sender.sender_id.user_id;
      const sessionId = `${chatId}_${sender}`;
      
      // 只处理文本消息
      if (message.message_type === 'text') {
        const content = JSON.parse(message.content);
        const userMessage = content.text;
        
        console.log('用户消息:', userMessage);
        
        // 调用 AI
        const aiReply = await callZhipuAI(userMessage, sessionId);
        
        // 发送回复
        await sendToFeishu(aiReply, chatId);
      }
    }
    
    res.json({ code: 0, msg: 'success' });
  } catch (error) {
    console.error('处理消息失败:', error);
    res.json({ code: 0, msg: 'success' }); // 飞书要求必须返回成功
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`飞书 AI 机器人服务器运行在端口 ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});
