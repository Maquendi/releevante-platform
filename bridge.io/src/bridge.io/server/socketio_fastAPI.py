from flask import jsonify
import uvicorn
import socketio
from fastapi import FastAPI

app = FastAPI()

sio=socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
socket_app = socketio.ASGIApp(sio, socketio_path="socket.io")
app.mount("/ws", socket_app)

@app.get('/health')
def app_health():
    #sio.emit('heaht_report', 'reporting that i am healthy')
    return {"status": "OK"}

@sio.on("connect")
async def connect(sid, env):
    print("New Client Connected to This id :"+" "+str(sid))


@sio.on("message")
async def on_message(sid, env):
    print("Data from client with id :"+" "+str(sid) + " data=" + env)


@sio.on("disconnect")
async def disconnect(sid):
    print("Client Disconnected: "+" "+str(sid))


if __name__=="__main__":
    uvicorn.run("socketio_fastAPI:app", host="0.0.0.0", port=7777, lifespan="on", reload=True)