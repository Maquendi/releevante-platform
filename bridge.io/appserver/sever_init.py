from fastapi import FastAPI
import socketio

fastapi_app = FastAPI()
# Initialize Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
# Mount FastAPI under the "/api" path
socket_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)
