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
    transaction_id = data["id"]
    transactionType = data["transactionType"]
    items = data["items"]

    for item in items:
        status = dict(
            item,
            transactionType=transactionType,
            exchangeCompleted=False,
            currentlyExchanging=True,
            exchangeWithError=False,
        )
        await sio.emit("item_checkout_started", status)

        await sleep(5)

        status = dict(
            item,
            transactionType=transactionType,
            exchangeCompleted=True,
            currentlyExchanging=False,
            exchangeWithError=True,
        )
        await sio.emit("item_checkout_success", status)

    await sio.emit("checkout_success", {"transactionId": transaction_id})


@sio.on("checkout")
async def on_message(sid, data):
    print(f"checkout event from {sid}: {data}")

    try:
        rent = data["purchase"]
        if rent is not None:
            await process(rent)
    except Exception as e:
        print(e)
        pass

    try:
        purchase = data["rent"]
        if purchase is not None:
            await process(purchase)
    except Exception as e:
        print(e)
        pass


@sio.on("checkin")
async def on_message(sid, data):
    print(f"checkin event from {sid}: {data}")
    try:
        status = {
            "itemId": data["id"],
            "isbn": data["isbn"],
            "cpy": data["cpy"],
            "transactionType": data["transactionType"],
        }

        status = dict(
            data,
            exchangeCompleted=False,
            currentlyExchanging=True,
            exchangeWithError=False,
        )
        await sio.emit("item_checkin_started", status)
        await sleep(5)
        status = dict(
            data,
            exchangeCompleted=True,
            currentlyExchanging=False,
            exchangeWithError=False,
        )
        await sio.emit("item_checkin_success", status)
    except:
        pass


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
