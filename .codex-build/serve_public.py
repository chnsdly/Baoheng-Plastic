from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import sys


ROOT = r"C:\Users\chnsd\Documents\Plastic-Pallets\public"
LOG = r"C:\Users\chnsd\Documents\Plastic-Pallets\.codex-build\static-server.log"

os.makedirs(os.path.dirname(LOG), exist_ok=True)
log = open(LOG, "a", encoding="utf-8")
sys.stdout = log
sys.stderr = log

handler = partial(SimpleHTTPRequestHandler, directory=ROOT)
server = ThreadingHTTPServer(("127.0.0.1", 1314), handler)
print("Serving public on http://127.0.0.1:1314/", flush=True)
server.serve_forever()
