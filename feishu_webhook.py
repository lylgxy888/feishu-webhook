from flask import Flask, request

app = Flask(__name__)


# 定义接收飞书 Webhook 的接口路径（需与你配置的 URL 路径一致）
@app.route('https://open.feishu.cn/open-apis/bot/v2/hook/fda77564-40f5-4410-8560-450c8c2b03b5', methods=['POST'])
def receive_feishu_webhook():
    # 1. 接收飞书发送的 JSON 数据（飞书 Webhook 默认用 JSON 格式）
    data = request.get_json()  # 解析请求体中的 JSON 数据

    # 2. 打印数据（或存入数据库、转发到其他服务等）
    print("飞书发送的原始数据：", data)

    # 3. 必须返回 200 OK，否则飞书会重复推送
    return "success", 200


if __name__ == '__main__':
    # 本地测试时用，正式环境需部署到公网服务器
    app.run(host='0.0.0.0', port=3000, debug=True)