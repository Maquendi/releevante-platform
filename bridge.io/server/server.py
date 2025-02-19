import asyncio
import json
import os
from pydantic import BaseModel
import socketio
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import chardet
# NFC Imports
from smartcard.CardMonitoring import CardMonitor, CardObserver
from smartcard.util import toHexString
from smartcard.CardConnection import CardConnection
import ndef
from dotenv import load_dotenv
from preferredsoundplayer import *

# Load environment variables
load_dotenv()
NFC_URL: str = os.getenv("NFC_URL", "https://www.youtube.com")

# Initialize FastAPI for HTTP routes
fastapi_app = FastAPI()

# Initialize Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")

# Mount FastAPI under the "/api" path
socket_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app)

cards_processed = 0  # Track number of processed cards

# ---------------------- FASTAPI ROUTES ----------------------


class NewStatus(BaseModel):
    id: str
    isbn: str
    status: str


@fastapi_app.get("/health")
async def health():
    await sio.emit("health_report", "Reporting that I am healthy")
    return JSONResponse(content={"status": "OK"})


@fastapi_app.post("/new_status")
async def newStatus(status: NewStatus):
    await sio.emit("checkout_status", json.dumps(status.__dict__))
    return JSONResponse(content={"status": "OK"})


# ---------------------- SOCKET.IO EVENTS ----------------------


@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")


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

        print("arrived here............ 2")
        await sio.emit("item_checkout_started", status)
        await asyncio.sleep(5)
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
        purchase = data["purchase"]
        if purchase is not None:
            await process(purchase)
    except Exception as e:
        print(e)
        pass

    try:
        rent = data["rent"]
        if rent is not None:
            await process(rent)
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
        await asyncio.sleep(5)
        status = dict(
            data,
            exchangeCompleted=True,
            currentlyExchanging=False,
            exchangeWithError=False,
        )
        await sio.emit("item_checkin_success", status)
    except Exception as e:
        print(e)
        pass


# ---------------------- NFC READING LOGIC ----------------------


class NTAG215Observer(CardObserver):
    """Observer class for NFC card detection and processing."""

    def __init__(self, loop):
        self.loop = loop  # Store reference to the main event loop

    def update(self, observable, actions):
        global cards_processed
        (addedcards, _) = actions
        for card in addedcards:
            print(f"Card detected, ATR: {toHexString(card.atr)}")
            try:
                connection = card.createConnection()
                connection.connect()
                print("Connected to card")

                # expected_ndef_message = self.create_ndef_record(NFC_URL)

                content = self.read_card_content(connection)
                self.beep(True)

                cards_processed += 1
                print(f"Total cards processed: {cards_processed}")

                print(f"Card content: {chardet}")

                print(f"Card: {card}")

                # Emit card detected event to Socket.IO clients (using the stored loop)
                asyncio.run_coroutine_threadsafe(
                    sio.emit("card_detected", {"atr": content}), self.loop
                )

            except Exception as e:
                print(f"An error occurred: {e}")

    def beep(self, success: bool):
        """Play success or error sound."""
        soundplay("ok.wav" if success else "error.wav")

    def create_ndef_record(self, url: str) -> bytes:
        """Create an NDEF record for the URL."""
        uri_record = ndef.UriRecord(url)
        encoded_message = b"".join(ndef.message_encoder([uri_record]))
        return (
            b"\x03"
            + len(encoded_message).to_bytes(1, "big")
            + encoded_message
            + b"\xFE"
        )

    def read_ndef_message(
        self, connection: CardConnection, expected_message: bytes
    ) -> bool:
        """Reads the NDEF message from the NFC tag and compares it to the expected message."""
        read_command = [0xFF, 0xB0, 0x00, 4, 0x04]
        message = b""
        try:
            while True:
                response, sw1, sw2 = connection.transmit(read_command)
                if sw1 == 0x90 and sw2 == 0x00:
                    message += bytes(response[:4])
                    if 0xFE in response:
                        break
                    read_command[3] += 1
                else:
                    return False
            return message == expected_message
        except Exception:
            return False

    def read_card_content(self, connection: CardConnection) -> str:
        """Reads the NDEF message from the NFC tag and compares it to the expected message."""
        read_command = [0xFF, 0xB0, 0x00, 4, 0x04]
        content = b""
        try:
            while True:
                response, sw1, sw2 = connection.transmit(read_command)
                if sw1 == 0x90 and sw2 == 0x00:
                    content += bytes(response[:4])
                    if 0xFE in response:
                        break
                    read_command[3] += 1
                else:
                    return False
            return content
        except Exception as e:
            print(e)
            return "No content found in card"


async def start_nfc_reader():
    """Start the NFC reader asynchronously."""
    loop = asyncio.get_running_loop()  # Get the running event loop
    print("Starting NFC card processing...")
    cardmonitor = CardMonitor()
    cardobserver = NTAG215Observer(loop)  # Pass event loop to observer
    cardmonitor.addObserver(cardobserver)

    while True:
        await asyncio.sleep(1)  # Keep the task alive


# ---------------------- ASYNC ENTRY POINT ----------------------


async def main():
    """Main function to start the server and NFC listener."""
    loop = asyncio.get_running_loop()
    loop.create_task(start_nfc_reader())  # Run NFC reader in background

    import uvicorn

    config = uvicorn.Config(
        socket_app, host="0.0.0.0", port=7777, log_level="info", reload=False
    )
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    asyncio.run(main())
