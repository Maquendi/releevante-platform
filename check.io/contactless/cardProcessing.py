from smartcard.CardConnection import CardConnection
from typing import Dict
import ndef
from smartcard.util import toHexString


def decode_atr(atr: str) -> Dict[str, str]:
    """Decode the ATR (Answer to Reset) string into readable components.

    Args:
        atr (str): ATR string.

    Returns:
        Dict[str, str]: Dictionary containing readable information about the card.
    """
    atr = atr.split(" ")

    rid = atr[7:12]
    standard = atr[12]
    card_name = atr[13:15]

    card_names = {
        "00 01": "MIFARE Classic 1K",
        "00 38": "MIFARE Plus® SL2 2K",
        "00 02": "MIFARE Classic 4K",
        "00 39": "MIFARE Plus® SL2 4K",
        "00 03": "MIFARE Ultralight®",
        "00 30": "Topaz and Jewel",
        "00 26": "MIFARE Mini®",
        "00 3B": "FeliCa",
        "00 3A": "MIFARE Ultralight® C",
        "FF 28": "JCOP 30",
        "00 36": "MIFARE Plus® SL1 2K",
        "FF[SAK]": "undefined tags",
        "00 37": "MIFARE Plus® SL1 4K",
        "00 07": "SRIX",
    }

    standards = {"03": "ISO 14443A, Part 3", "11": "FeliCa"}

    return {
        "RID": " ".join(rid),
        "Standard": standards.get(standard, "Unknown"),
        "Card Name": card_names.get(" ".join(card_name), "Unknown"),
    }


def create_ndef_record(url: str) -> bytes:
    """Encodes a given URI into a complete NDEF message using ndeflib.

    Args:
        url (str): The URI to be encoded into an NDEF message.

    Returns:
        bytes: The complete NDEF message as bytes, ready to be written to an NFC tag.
    """

    uri_record = ndef.TextRecord(url)

    # Encode the NDEF message
    encoded_message = b"".join(ndef.message_encoder([uri_record]))

    # Calculate total length of the NDEF message (excluding start byte and terminator)
    message_length = len(encoded_message)

    # Create the initial part of the message with start byte, length, encoded message, and terminator
    initial_message = (
        b"\x03" + message_length.to_bytes(1, "big") + encoded_message + b"\xFE"
    )

    # Calculate padding to align to the nearest block size (assuming 4 bytes per block)
    padding_length = -len(initial_message) % 4
    complete_message = initial_message + (b"\x00" * padding_length)
    return complete_message


def write_ndef_message(connection: CardConnection, data: str) -> bool:
    """Writes the NDEF message to the NFC tag.

    Args:
        connection (CardConnection): The connection to the NFC tag.
        ndef_message (bytes): The NDEF message to be written.

    Returns:
        bool: True if the write operation is successful, False otherwise.
    """
    read_command = [0xFF, 0xB0, 0x00, 4, 0x04]
    page = 4
    ndef_message: bytes = create_ndef_record(data)
    while ndef_message:
        block_data = ndef_message[:4]
        ndef_message = ndef_message[4:]
        WRITE_COMMAND = [0xFF, 0xD6, 0x00, page, 0x04] + list(block_data)
        response, sw1, sw2 = connection.transmit(WRITE_COMMAND)
        if sw1 != 0x90 or sw2 != 0x00:
            print(
                f"Failed to write to page {
                  page}, SW1: {sw1:02X}, SW2: {sw2:02X}"
            )
            return False
        print(f"Successfully wrote to page {page}")
        page += 1
    return True


def read_card_uid(connection: CardConnection) -> str:
    SELECT = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    response, sw1, sw2 = connection.transmit(SELECT)
    uid = toHexString(response)
    return uid


def read_card_content(connection: CardConnection) -> str:
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
        return decodeNdefMessage(content)
    except Exception as e:
        print(e)
        return "No content found in card"


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
