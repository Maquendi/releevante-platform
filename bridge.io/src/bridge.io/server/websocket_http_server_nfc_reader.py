import asyncio
import socketio
import nfc
import threading
from aiohttp import web

# Create a new Async Socket.IO server
sio = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins=['http://localhost:3000'])
app = web.Application()
sio.attach(app)

connected_clients = set()

# Event handler for Socket.IO client connection
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    connected_clients.add(sid)
    await sio.emit('message', 'NFC Reader is ready', room=sid)

# Event handler for receiving a message from Socket.IO clients
@sio.event
async def message(sid, data):
    print(f"Message from {sid}: {data}")

# Event handler for Socket.IO client disconnection
@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    connected_clients.remove(sid)

# Function to read NFC card data
def on_nfc_tag_detected(tag, loop):
    nfc_data = str(tag)
    print(f"NFC Tag detected: {nfc_data}")
    try:
        #loop.run_until_complete(emit_nfc_data(nfc_data))
        asyncio.run(emit_nfc_data(nfc_data))
    except Exception as e:
         print(f"Error emitting NFC data: {e}")


# Coroutine to emit NFC data
async def emit_nfc_data(nfc_data):
   # for sid in connected_clients:
    print(f"SENDING nfc: {nfc_data}")
    await sio.emit('nfc_data', nfc_data)

# NFC tag reader function
def start_nfc_reader(loop):

    try:
        clf = nfc.ContactlessFrontend('usb:072f:1252') # Adjust based on your NFC reader type
        try:
            print("Waiting for NFC tag...")
            while True:
                clf.connect(rdwr={'on-connect': lambda tag: on_nfc_tag_detected(tag, loop)})
            #tag = input('Enter nfc: ')
            # on_nfc_tag_detected(tag, loop)
        except Exception as e:
            print(f"Error with NFC reader: {e}")
        finally:
            clf.close()
    except Exception as error:
        print("Failed with error ", error)


# HTTP route to handle incoming requests
async def handle_http_request(request):
    # Process any query params or request data
    # await sio.emit('nfc_data', "45212468722")
    await emit_nfc_data('14527993000')
    print("Received HTTP request")
    return web.json_response({"status": "success", "message": "HTTP request received"})

# Add the HTTP route to the web app
app.router.add_get('/http-request', handle_http_request)

# Run Socket.IO server and NFC reader concurrently
if __name__ == '__main__':
    # Start NFC reader in a separate thread
    loop = asyncio.get_event_loop()
    nfc_thread = threading.Thread(target=start_nfc_reader, args=(loop,))
    nfc_thread.daemon = True  # Allows the thread to exit when the main program exits
    nfc_thread.start()
    # asyncio.ensure_future(start_nfc_reader())
    # loop.create_task(start_nfc_reader())  # NFC reader runs as an async task
    # Keep the client running
    # sio.wait()
    # Start the web application to handle both HTTP and WebSocket
    # loop.run_until_complete(start_nfc_reader())  # Start NFC reader first
    web.run_app(app, host='localhost', port=5000)
