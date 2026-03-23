#!/usr/bin/env python3
# server.py
# Run with: python3 server.py
# Serves files on http://localhost:8000 with correct MIME types for USDZ

import http.server
import socketserver

PORT = 8000

class MIMEHandler(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        mime_type = super().guess_type(path)
        # Override USDZ to use the correct MIME type for <model> elements
        if str(path).endswith(".usdz"):
            return "model/vnd.usdz+zip"
        return mime_type

with socketserver.TCPServer(("", PORT), MIMEHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("USDZ files will be served as model/vnd.usdz+zip")
    httpd.serve_forever()
