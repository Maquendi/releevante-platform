# app.py
import ssl


ssl.wrap_socket = ssl.SSLContext().wrap_socket
from httpio.http_setup import get_flask_app
from nfc_setup import start_nfc_reader
import asyncio
import threading

from flask import request
from flask_socketio import SocketIO
from flask_socketio import SocketIO

app = get_flask_app()

socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000'])

@socketio.on('connect')
def connect():
    print(f"Client connected: {request.sid}")
    socketio.emit('message', 'Welcome!', room=request.sid)

@socketio.on('disconnect')
def disconnect():
    print(f"Client disconnected: {request.sid}")

def emit_data(key, value):
    socketio.emit(key, value)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    nfc_thread = threading.Thread(target=start_nfc_reader, args=(loop, socketio))
    nfc_thread.daemon = True
    nfc_thread.start()
    socketio.run(app, host='localhost', port=5000)
