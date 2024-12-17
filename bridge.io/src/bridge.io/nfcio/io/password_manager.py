
from typing import Dict, List
from dotenv import load_dotenv
from smartcard.CardMonitoring import CardMonitor, CardObserver
from smartcard.util import toHexString
from smartcard.CardConnection import CardConnection
from smartcard.System import *
import hashlib
import os
import ndef

PASSPHRASE: str = os.getenv('NFC_PASSPHRASE', 'Summer01')

def remove_password(connection: CardConnection, passphrase: str) -> None:
    """
    Remove password protection from an NTAG215 NFC tag.

    Args:
        connection (CardConnection): The connection to the NFC tag.
        passphrase (str): The passphrase used to derive the password.
    """
    password = derive_password(passphrase)

    # Authenticate with the password first
    # Assuming that the tag requires password authentication for writing
    connection.transmit([0xFF, 0x00, 0x00, 0x00] + password + [0x00])

    # Disable password protection by setting AUTH0 beyond the tag's storage
    # Example: set AUTH0 to 0xFF to disable all protections
    disable_auth0_command = [0xFF, 0xD6, 0x00,
                             0x83, 0x04, 0x00, 0x00, 0x00, 0xFF]
    response, sw1, sw2 = connection.transmit(disable_auth0_command)
    if sw1 == 0x90 and sw2 == 0x00:
        print("Password protection successfully removed.")
    else:
        print(f"Failed to remove password protection, SW1: {sw1}, SW2: {sw2}")



def derive_password(passphrase: str) -> List[int]:
    """Hash passphrase and return first 4 bytes as password for NFC tag authentication.

    Args:
        passphrase (str): Passphrase to hash.

    Returns:
        List[int]: List of the first 4 bytes of the hash.
    """
    hasher = hashlib.sha256()
    hasher.update(passphrase.encode())
    # print(f"Hashed passphrase: {hasher.hexdigest()}")
    # print(f"Password: {list(hasher.digest()[:4])}")
    return list(hasher.digest()[:4])

def is_password_set(connection: CardConnection) -> bool:
    """
    Check if a password is set on an NTAG215 tag by reading the AUTH0 register.

    Args:
        connection (CardConnection): The connection to the NFC tag.

    Returns:
        bool: True if a password is set (AUTH0 not 0xFF), otherwise False.
    """
    # Address 0x83 is used for AUTH0 in NTAG215
    # Convert page address to byte address if necessary
    page_address = 0x83
    # APDU for reading one page (4 bytes)
    read_command = [0xFF, 0xB0, 0x00, page_address, 0x04]

    try:
        response, sw1, sw2 = connection.transmit(read_command)
        # print(f"Read AUTH0, Response: {' '.join(f'{byte:02X}' for byte in response)}, SW1: {sw1:02X}, SW2: {sw2:02X}")

        if sw1 == 0x90 and sw2 == 0x00:
            # Response is expected to be 4 bytes, AUTH0 is the last byte
            auth0 = response[3]
            # print(f"AUTH0 register value: {auth0:02X}")

            # Check if AUTH0 is 0xFF for no password protection
            if auth0 == 0xFF:
                print("No password protection is set.")
                return False
            else:
                print("Password protection is set.")
                return True
        else:
            print("Failed to read AUTH0 register.")
            return False

    except Exception as e:
        print(f"An error occurred: {e}")
        return False


def authenticate_with_password(connection: CardConnection, passphrase: str) -> bool:
    """Authenticate with the NTAG215 NFC tag using the provided passphrase.

    Args:
        connection (CardConnection): Connection to the card.
        passphrase (str): Passphrase for authentication.

    Returns:
        bool: True if authentication is successful, otherwise False.
    """
    password = derive_password(passphrase)

    command = [0xFF, 0x00, 0x00, 0x00, 0x07, 0xD4, 0x42, 0x1B] + password
    response, sw1, sw2 = connection.transmit(command)

    # print(f"Command being sent for authentication: {' '.join(f'{byte:02X}' for byte in command)}")
    # print(f"Response: {' '.join(f'{byte:02X}' for byte in response)}, SW1: {sw1:02X}, SW2: {sw2:02X}")

    if sw1 == 0x90 and sw2 == 0x00:
        # Check if the PACK is part of the response and correctly positioned
        if len(response) >= 5:  # Ensuring the response is long enough
            # Adjust this based on where PACK actually appears
            pack = response[3:5]
            print("Authentication successful, PACK received:",
                  ' '.join(f'{byte:02X}' for byte in pack))
            return True
        else:
            print("PACK not received or incorrectly formatted")
    else:
        print("Authentication failed")
    return False


class NTAG215Observer(CardObserver):
    """Observer class for NFC card detection and processing."""

    def update(self, observable, actions):
        global cards_processed
        (addedcards, _) = actions
        for card in addedcards:
            print(f"Card detected, ATR: {toHexString(card.atr)}")
            try:
                connection = card.createConnection()
                connection.connect()
                print("Connected to card")

                # if password is set, authenticate
                if is_password_set(connection):
                    authenticate_with_password(connection, PASSPHRASE)

                # Get card information
                # info = decode_atr(toHexString(card.atr))
                # print(f"Card Name: {info['Card Name']}, Standard: {
                #       info['Standard']}, RID: {info['RID']}")

                # # Get card UID
                # SELECT = [0xFF, 0xCA, 0x00, 0x00, 0x00]
                # response, sw1, sw2 = connection.transmit(SELECT)
                # uid = toHexString(response)
                # print(f"Card UID: {uid}")

                # Authenticate with the password
                # authenticate_with_password(connection, PASSPHRASE)
                # Remove password protection from the tag
                remove_password(connection, PASSPHRASE)

                cards_processed += 1
                print(f"Total cards flashed: {cards_processed}")

            except Exception as e:
                print(f"An error occurred: {e}")


def main():
    print("Starting NFC card processing...")
    cardmonitor = CardMonitor()
    cardobserver = NTAG215Observer()
    cardmonitor.addObserver(cardobserver)

    try:
        input("Press Enter to stop...\n")
    finally:
        cardmonitor.deleteObserver(cardobserver)
        print(f"Stopped NFC card processing. Total cards processed: {
              cards_processed}")


if __name__ == "__main__":
    # get and print a list of readers attached to the system
    # sc_readers = readers()
    # print(sc_readers)
    cards_processed: int = 0
    main()



