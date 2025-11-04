import http.server
import socketserver
import os

# 设置服务器参数
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# 确保在当前目录运行
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 创建并启动服务器
with socketserver.TCPServer(("localhost", PORT), Handler) as httpd:
    print(f"服务器运行在 http://localhost:{PORT}")
    print("按 Ctrl+C 停止服务器")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")