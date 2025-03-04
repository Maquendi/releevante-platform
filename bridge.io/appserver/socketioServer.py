# from fastapi import FastAPI
# from fastapi.responses import JSONResponse
# import json
# from pydantic import BaseModel
# import socketio
# from bookexchange.messageHandler import MessageHandler
# from bookexchange.messageSender import MessageSender

# # Initialize FastAPI for HTTP routes
# fastapi_app = FastAPI()

# # Initialize Socket.IO server
# sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")

# # Mount FastAPI under the "/api" path
# socket_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)


# message_sender = MessageSender(sio)

# message_handler = MessageHandler(message_sender)


# # ---------------------- FASTAPI ROUTES ----------------------


# class NewStatus(BaseModel):
#     id: str
#     isbn: str
#     status: str


# @fastapi_app.get("/health")
# async def health():
#     await sio.emit("health_report", "Reporting that I am healthy")
#     return JSONResponse(content={"status": "OK"})


# @fastapi_app.post("/new_status")
# async def newStatus(status: NewStatus):
#     await sio.emit("checkout_status", json.dumps(status.__dict__))
#     return JSONResponse(content={"status": "OK"})


# # ---------------------- SOCKET.IO EVENTS ----------------------


# @sio.on("connect")
# async def connect(sid, environ):
#     print(f"Client connected: {sid}")


# @sio.on("disconnect")
# async def disconnect(sid):
#     print(f"Client disconnected: {sid}")


# @sio.on("checkout")
# async def on_checkout(sid, data):
#     print(f"checkout event from {sid}: {data}")
#     await message_handler.handleCheckout(data)


# @sio.on("checkin")
# async def on_checkin(sid, data):
#     print(f"checkin event from {sid}: {data}")
#     await message_handler.handleCheckin(data)
