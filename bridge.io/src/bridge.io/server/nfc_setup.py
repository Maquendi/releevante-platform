# nfc_reader.py
def start_nfc_reader(loop, socketio):
   # clf = nfc.ContactlessFrontend('usb')  # Adjust based on your NFC reader type
    try:
        print("Waiting for NFC tag...")
        while True:
           # clf.connect(rdwr={'on-connect': lambda tag: on_nfc_tag_detected(tag, loop)})
         tag = input('Enter nfc: ')
         on_nfc_tag_detected(tag, socketio)
    except Exception as e:
        print(f"Error with NFC reader: {e}")
    finally:
        pass
        #clf.close()


# Function to read NFC card data
def on_nfc_tag_detected(tag, socketio):
    nfc_data = str(tag)
    print(f"NFC Tag detected: {nfc_data}")
    try:
        #loop.run_until_complete(emit_nfc_data(nfc_data, socketio))
        emit_nfc_data(nfc_data, socketio)
    except Exception as e:
         print(f"Error emitting NFC data: {e}")

def emit_nfc_data(nfc_data, socketio):
   # for sid in connected_clients:
    socketio.emit('nfc_data', nfc_data)