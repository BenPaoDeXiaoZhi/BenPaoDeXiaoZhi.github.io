from http.server import BaseHTTPRequestHandler
import os
 
class handler(BaseHTTPRequestHandler):
    def do_GET(self):
	try:
		server_name = os.environ.get('server_name')
	except Exception as E:
		server_name = repr(E)
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write(server_name.encode('utf-8'))
        return