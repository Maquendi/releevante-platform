import asyncio
from contactless.cardMessageParser import CardMessageParser
import contactless.ntag215reader as ntag215reader
from bookexchange.factory import message_sender


def setupNtag215Reader():
    loop = asyncio.get_running_loop()
    message_parser = CardMessageParser(message_sender)
    loop.create_task(
        ntag215reader.start_nfc_reader(message_parser)
    )  # Run NFC reader in background
