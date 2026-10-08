"""Serve prototypes so /rtk2 and shared /lib remain siblings."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse, webbrowser
app=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--port',type=int,default=8080)
parser.add_argument('--bind',default='127.0.0.1')
parser.add_argument('--open',action='store_true')
args=parser.parse_args()
if not (app.parent/'lib/js-yaml.js').is_file():raise SystemExit('Place rtk2 beside your existing lib folder. Shared libraries are excluded from this package.')
url=f'http://localhost:{args.port}/rtk2/'
server=ThreadingHTTPServer((args.bind,args.port),partial(SimpleHTTPRequestHandler,directory=str(app.parent)))
print(f'Open {url} — Ctrl+C to stop',flush=True)
if args.open:webbrowser.open(url)
try:server.serve_forever()
except KeyboardInterrupt:server.server_close()
