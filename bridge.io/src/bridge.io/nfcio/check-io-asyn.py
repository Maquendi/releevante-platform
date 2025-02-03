# asyncio
import socketio
import asyncio
import nfc

sockit = None

async def establish_connection():
    async with socketio.AsyncSimpleClient() as sio:
        global sockit
        await sio.connect('http://localhost:3000')
        print('my sid is', sio.sid)

       # await sio.emit('my message', {'foo': 'bar'})
        sockit = sio
        # event = await sio.receive()
        # print(f'received event: "{event[0]}" with arguments {event[1:]}')
        @sio.event
        async def on_message(data):
            print('I received a message! ', data)



# NFC Reader related functions
class NFCReader:
    def on_connect(self, tag):
        print(f"NFC Tag detected: {tag}")
        # Extract card data (this is just an example, adjust based on your needs)
        card_id = str(tag)
        
        # Send the NFC card data to the WebSocket server
        on_nfc_card_scanned(f"Card Scanned: {card_id}")
        
        return True



async def on_nfc_card_scanned(data):
    print(data)
    await sockit.emit('user_nfc_id', {'id': data})
    


async def listen_to_nfc():
    # Initialize NFC Reader
    # clf = nfc.ContactlessFrontend('usb')
    print("lissinginn.... ")

    # while True:
    #     print("Waiting for NFC card...")
    #      clf.connect(rdwr={'on-connect': NFCReader().on_connect})
    #      await asyncio.sleep(1)  # Small sleep to avoid high CPU usage


async def main():
    await asyncio.gather(
        establish_connection(),
        listen_to_nfc()
    )
    message = input("message: ")
    await on_nfc_card_scanned(message)


# Run the main function
if __name__ == "__main__":
    asyncio.run(main())