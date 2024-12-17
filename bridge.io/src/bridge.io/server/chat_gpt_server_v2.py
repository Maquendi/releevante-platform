import socketio
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Initialize FastAPI for HTTP routes
fastapi_app = FastAPI()

@fastapi_app.get("/health")
async def health():
    await sio.emit("health_report", "Reporting that I am healthy")
    return JSONResponse(content={"status": "OK"})

# Initialize Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")

# Mount FastAPI under the "/api" path
socket_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

# WebSocket event handlers
@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on("message")
async def on_message(sid, data):
    print(f"Message from {sid}: {data}")
    await sio.emit("response", f"Echo: {data}")

@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
