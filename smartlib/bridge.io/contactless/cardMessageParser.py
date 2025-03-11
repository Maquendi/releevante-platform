import ndef
from bookexchange.messageSender import MessageSender


def decodeNdefMessage(message: bytes) -> str:
    try:
        data1 = message[2 : len(message) - 1]
        dataHex = data1.hex()
        octets = bytearray.fromhex(dataHex)
        card_data = list(ndef.message_decoder(octets))
        card_content = card_data[0].text
        return card_content
    except Exception as e:
        print(f"Error decoding NDEF message: {e}")


class CardMessageParser:
    def __init__(self, message_sender: MessageSender):
        self.sender = message_sender

    async def onCardScanned(self, data: bytes):
        print("NDEF message hex: ", data.hex())
        userId = decodeNdefMessage(data)
        print(f"card data {userId}")
        await self.sender.onCardDetected(userId)
