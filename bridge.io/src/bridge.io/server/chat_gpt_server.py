import uvicorn
import socketio
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI()

# Health check endpoint
@app.get("/health")
async def app_health():
    return JSONResponse(content={"status": "OK"})

# Initialize Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")

# Combine FastAPI and Socket.IO apps
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# WebSocket event handlers
@sio.on("connect")
async def connect(sid, env):
    print("New Client Connected: " + str(sid))

@sio.on("message")
async def on_message(sid, data):
    print(f"Message from {sid}: {data}")

@sio.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: " + str(sid))

# Run the server
if __name__ == "__main__":
    uvicorn.run("chat_gpt_server:app", host="0.0.0.0", port=7777, reload=True)
