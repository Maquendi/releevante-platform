import asyncio
import os
from smartcard.CardMonitoring import CardMonitor, CardObserver
from smartcard.util import toHexString
from smartcard.CardConnection import CardConnection
import ndef
from dotenv import load_dotenv
import preferredsoundplayer
from contactless.cardMessageParser import CardMessageParser

# Load environment variables
# load_dotenv()


class NTAG215Observer(CardObserver):
    """Observer class for NFC card detection and processing."""

    def __init__(
        self, loop: asyncio.AbstractEventLoop, message_parser: CardMessageParser
    ):
        self.loop = loop
        self.message_parser = message_parser

    def update(self, observable, actions):
        global cards_processed
        (addedcards, _) = actions
        for card in addedcards:
            try:
                connection = card.createConnection()
                connection.connect()
                print("Connected to card")
                content = self.read_card_content(connection)
                self.beep(True)
                asyncio.run_coroutine_threadsafe(
                    self.message_parser.onCardScanned(content), self.loop
                )
            except Exception as e:
                print(f"An error occurred: {e}")
                self.beep(False)

    def beep(self, success: bool):
        """Play success or error sound."""
        preferredsoundplayer.soundplay("ok.wav" if success else "error.wav")

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


async def start_nfc_reader(message_parser: CardMessageParser):
    """Start the NFC reader asynchronously."""
    loop = asyncio.get_running_loop()
    cardmonitor = CardMonitor()
    cardobserver = NTAG215Observer(loop, message_parser)
    cardmonitor.addObserver(cardobserver)
