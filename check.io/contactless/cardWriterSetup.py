import asyncio
import contactless.ntag215writer as ntag215Writer


def setupNtag215Writer():
    loop = asyncio.get_running_loop()
    # message_parser = CardMessageParser(message_sender)
    loop.create_task(ntag215Writer.start_nfc_writer())  # Run NFC reader in background
