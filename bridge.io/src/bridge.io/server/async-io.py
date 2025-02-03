import websocket # type: ignore
import asyncio
import nfc
from threading import Thread


# Global variable to hold the WebSocket connection
ws = None

# WebSocket related functions
def send_message_to_websocket(message):
    if ws:
        print(f"Sending message to WebSocket: {message}")
        ws.send(message)
    else:
        print("WebSocket connection is not established.")

def on_message(ws, message):
    print(f"Received from WebSocket: {message}")

def on_error(ws, error):
    print(f"WebSocket Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print(f"WebSocket Closed: {close_status_code}, {close_msg}")

def on_open(ws):
    print("WebSocket connection opened")
    # Optionally, send an initial message to the server
    ws.send("Client connected, waiting for NFC card scans.")

# WebSocket listener function
async def listen_to_websocket():
    global ws

    # WebSocket URL
    websocket_url = "ws://localhost:3000"

    # Create WebSocket connection
    ws = websocket.WebSocketApp(websocket_url,
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    
    # Run the WebSocket in a separate thread to avoid blocking NFC handling
    ws_thread = Thread(target=ws.run_forever)
    ws_thread.start()

    # Keep the WebSocket alive
    while True:
        await asyncio.sleep(1)

# NFC Reader related functions
class NFCReader:
    def on_connect(self, tag):
        print(f"NFC Tag detected: {tag}")
        # Extract card data (this is just an example, adjust based on your needs)
        card_id = str(tag)
        
        # Send the NFC card data to the WebSocket server
        send_message_to_websocket(f"Card Scanned: {card_id}")
        
        return True

# NFC listener function
async def listen_to_nfc():
    # Initialize NFC Reader
    clf = nfc.ContactlessFrontend('usb')

    while True:
        print("Waiting for NFC card...")
        clf.connect(rdwr={'on-connect': NFCReader().on_connect})
        await asyncio.sleep(1)  # Small sleep to avoid high CPU usage

# Main function to run both WebSocket and NFC listeners concurrently
async def main():
    await asyncio.gather(
        listen_to_websocket(),
       # listen_to_nfc()
    )

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
