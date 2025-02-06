from asyncio import sleep
from pydantic import BaseModel
import socketio
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json

class NewStatus(BaseModel):
    id: str
    isbn: str
    status: str

# Initialize FastAPI for HTTP routes
fastapi_app = FastAPI()

@fastapi_app.get("/health")
async def health():
    await sio.emit("health_report", "Reporting that I am healthy")
    return JSONResponse(content={"status": "OK"})

@fastapi_app.post("/new_status")
async def newStatus(status: NewStatus):
    await sio.emit("checkout_status", json.dumps(status.__dict__))
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

async def process(data):
        transaction_id = data['id']
        items   = data['items']

        for item in items:
            res = {"id": item['id'], "isbn": item['isbn']}
            print(res)
            await sio.emit('item_checkout_started', res)
            await sleep(5)
            await sio.emit('item_checkout_success', res)
        
        await sio.emit("checkout_success", {'transactionId': transaction_id})


@sio.on("checkout")
async def on_message(sid, data):
    print(f"checkout event from {sid}: {data}")
    
    try:
            rent = data['rent']
            if rent is not None:
                await process(rent)
    except:
         pass

    try:
             purchase = data['purchase']
             if purchase is not None:
                  await process(purchase)
    except:
         pass


@sio.on("checkin")
async def on_message(sid, data):
    print(f"checkin event from {sid}: {data}")
    try:
            res = {"id": data['id'], "isbn": data['isbn']}
            print(res)
            await sio.emit('item_checkin_started', res)
            await sleep(5)
            await sio.emit('item_checkin_success', res)
    except:
         pass




@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
