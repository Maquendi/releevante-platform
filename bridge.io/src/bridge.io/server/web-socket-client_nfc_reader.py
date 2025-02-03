# import socketio

# # Create a Socket.IO client
# sio = socketio.Client()

# @sio.event
# def connect():
#     print('Connected to server')
#     sio.send('Hello from Python client')

# @sio.event
# def message(data):
#     print(f"Message from server: {data}")

# @sio.event
# def disconnect():
#     print('Disconnected from server')

# if __name__ == '__main__':
#     sio.connect('http://localhost:3000')
#     sio.wait()



import socketio
import threading

# Create a Socket.IO client
sio = socketio.Client()

# Event handler for when the connection is established
@sio.event
def connect():
    print('Connected to the server')
    sio.send('Python client connected')

# Event handler for incoming messages from the server
@sio.on('checkio.message')
def message(data):
    print(f"Message from server: {data}")

# Event handler for disconnection
@sio.event
def disconnect():
    print('Disconnected from the server')

# Function to read NFC card data
def on_nfc_tag_detected(tag):
    data = str(tag)
    print(f"NFC Tag detected: {data}")
    # Send the NFC data to the server
    sio.emit('nfc', data)

# NFC tag reader function
def start_nfc_reader():
    # clf = nfc.ContactlessFrontend('usb')  # Adjust according to your NFC reader
    # try:
    #     print("Waiting for NFC tag...")
    #     while True:
    #         clf.connect(rdwr={'on-connect': on_nfc_tag_detected})
    # except Exception as e:
    #     print(f"Error with NFC reader: {e}")
    # finally:
    #     clf.close()

    while True:
        data = input("Enter nfc id: ")
        on_nfc_tag_detected(data)

# Function to start Socket.IO client and NFC reader simultaneously
def start_socket_io_and_nfc_reader():
    # Connect to the Socket.IO server
    sio.connect('http://localhost:8086')
    
    # Start NFC reader in a separate thread
    nfc_thread = threading.Thread(target=start_nfc_reader)
    nfc_thread.daemon = True  # Allows the thread to exit when the main program exits
    nfc_thread.start()
    
    
    # Keep the client running
    #sio.wait()

if __name__ == '__main__':
    start_socket_io_and_nfc_reader()
