from appserver.sever_init import sio
from bookexchange.factory import message_handler

# ---------------------- SOCKET.IO EVENTS ----------------------


@sio.on("connect")
async def connect(sid, *args):
    print(f"Client connected: {sid}")


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


@sio.on("checkout")
async def on_checkout(sid, data):
    print(f"checkout event from {sid}")
    await message_handler.handleCheckout(data)


@sio.on("checkin")
async def on_checkin(sid, data):
    print(f"checkin event from {sid}")
    await message_handler.handleCheckin(data)


def initialize():
    print("socketio routes configured")
