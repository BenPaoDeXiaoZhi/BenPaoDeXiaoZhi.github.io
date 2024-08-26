from http.server import BaseHTTPRequestHandler
import os
 
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
	server_name = os.environ.get('server_name')
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return