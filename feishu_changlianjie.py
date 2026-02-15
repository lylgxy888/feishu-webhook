import requests
from flask import Flask, request as flask_request
import threading
import time

# 1. 配置基础信息
APP_ID = "cli_a91bf0f10e38dcd5"
APP_SECRET = "v4ydVcZX1oIU2HPL5dXhjblEmYly23Y5"
BASE_URL = "https://open.feishu.cn/open-apis"
WEBHOOK_VERIFICATION_TOKEN = "fda77564-40f5-4410-8560-450c8c2b03b5"

# 2. 获取 tenant_access_token
def get_tenant_access_token():
    url = f"{BASE_URL}/auth/v3/tenant_access_token/internal"
    payload = {
        "app_id": APP_ID,
        "app_secret": APP_SECRET
    }
    response = requests.post(url, json=payload)
    try:
        json_data = response.json()
    except Exception as e:
        raise Exception(f"JSON解析失败: {e}, 响应内容: {response.text[:200]}")
    
    if json_data.get("code") == 0:
        return json_data["tenant_access_token"]
    else:
        raise Exception(f"获取tenant_access_token失败: {json_data}")

# 3. 创建 Flask 应用用于接收飞书回调消息
app = Flask(__name__)

@app.route('/webhook/feishu', methods=['POST'])
def receive_feishu_message():
    """
    接收飞书机器人消息的回调接口
    """
    try:
        data = flask_request.get_json()
        print(f"收到飞书消息: {data}")
        
        # 处理消息类型
        msg_type = data.get("msg_type", "")
        
        # 根据消息类型处理
        if msg_type == "text":
            content = data.get("content", {}).get("text", "")
            print(f"文本消息内容: {content}")
            
        elif msg_type == "event_callback":
            event_type = data.get("event", {}).get("type", "")
            print(f"事件类型: {event_type}")
        
        return {"code": 0, "msg": "success"}
    except Exception as e:
        print(f"处理消息异常: {e}")
        return {"code": 1, "msg": str(e)}

def start_webhook_server(port=3000):
    """
    启动 Webhook 服务器
    """
    print(f"启动飞书 Webhook 服务器，监听端口 {port}...")
    print(f"回调 URL: http://<你的服务器IP>:{port}/webhook/feishu")
    app.run(host='0.0.0.0', port=port, debug=False)

if __name__ == "__main__":
    # 验证 token 是否可用
    print("=" * 50)
    print("验证飞书应用配置...")
    
    try:
        tenant_token = get_tenant_access_token()
        print(f"✓ tenant_access_token 获取成功")
    except Exception as e:
        print(f"✗ 获取 token 失败: {e}")
    
    print("=" * 50)
    print("\n配置说明:")
    print("1. 你需要将服务器部署到公网可访问的地址")
    print("2. 在飞书开放平台配置应用回调 URL:")
    print(f"   回调 URL: http://<你的公网IP>:3000/webhook/feishu")
    print("3. 确保服务器防火墙开放 3000 端口")
    print("\n启动 Webhook 服务器...")
    
    start_webhook_server(3000)