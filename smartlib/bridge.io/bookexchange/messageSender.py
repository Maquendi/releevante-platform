from socketio import AsyncServer


class MessageSender:

    def __init__(self, sio: AsyncServer):
        self.sio = sio

    async def onItemCheckoutStarted(self, data):
        print(f"broadcasting message item_checkout_started")
        await self.sio.emit("item_checkout_started", data)

    async def onItemCheckoutSucceeded(self, data):
        print(f"broadcasting message onItemCheckoutSucceeded")
        await self.sio.emit("item_checkout_success", data)

    async def onItemCheckoutFailure(self, data):
        print(f"broadcasting message onItemCheckoutFailure")
        pass

    async def onCheckoutFailure(self, data):
        print(f"broadcasting message onCheckoutFailure")
        pass

    async def onCheckoutSucceeded(self, data):
        print(f"broadcasting message checkout_success")
        await self.sio.emit("checkout_success", data)

    async def onCheckinStarted(self, data):
        print(f"broadcasting message item_checkin_started")
        await self.sio.emit("item_checkin_started", data)

    async def onCheckinSucceeded(self, data):
        print(f"broadcasting message item_checkin_success")
        await self.sio.emit("item_checkin_success", data)

    async def onCardDetected(self, data: str):
        print(f"broadcasting message card_detected")
        await self.sio.emit("card_detected", {"data": data})

    async def onMessage(self, message_type: str, data: any):
        print(f"broadcasting message {message_type}")
        await self.sio.emit(message_type, data)
