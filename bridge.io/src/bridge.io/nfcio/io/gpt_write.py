from smartcard.System import readers
from smartcard.util import toBytes, toHexString
import hashlib
from typing import Dict, List
# Convert "Summ" to its corresponding hex value for the password (4 bytes)
# PASSWORD = [0x53, 0x75, 0x6D, 0x6D]  # "Summ" in ASCII
PASSWORD_TEXT = "Summer01"
#PASSWORD_APDU = [0xFF, 0x00, 0x00, 0x00, 0x04] + PASSWORD  # APDU to authenticate with password


# APDU command to write 4 bytes to a specific page
def write_to_page(connection, page, data):
    if len(data) != 4:
        raise ValueError("Data length must be exactly 4 bytes.")
    
    WRITE_COMMAND = [0xFF, 0xD6, 0x00, page, 0x04] + data
    response, sw1, sw2 = connection.transmit(WRITE_COMMAND)
    
    if sw1 == 0x90 and sw2 == 0x00:
        print(f"Successfully wrote to page {page}")
    else:
        print(f"Failed to write to page {page}. SW1={hex(sw1)}, SW2={hex(sw2)}")

# Example function to encode a URL as an NDEF message
def encode_url_as_ndef(url):
    # URL prefix mapping based on NDEF standard
    url_prefixes = {
        "http://www.": 0x01,
        "https://www.": 0x02,
        "http://": 0x03,
        "https://": 0x04
    }

    # Detect URL prefix
    prefix_byte = 0x00
    for prefix, code in url_prefixes.items():
        if url.startswith(prefix):
            prefix_byte = code
            url = url[len(prefix):]
            break
    
    # NDEF Message Format
    ndef_message = [
        0xD1,               # NDEF record header (Short record, type URI)
        0x01,               # Type Length (1 byte for URI type)
        len(url) + 1,       # Payload Length (URL length + 1 for prefix byte)
        0x55,               # URI identifier code (0x55 for URI)
        prefix_byte          # URL prefix byte
    ]

    # Add URL as UTF-8 encoded bytes
    ndef_message += list(url.encode('utf-8'))

    # Add TLV terminator
    ndef_message += [0xFE]

    return ndef_message

# Function to authenticate with the NTAG215 tag using the password
def authenticate_tag(connection):

    # command = [0xFF, 0x00, 0x00, 0x00, 0x07, 0xD4, 0x42, 0x1B] + password
    
    PASSWORD = derive_password(PASSWORD_TEXT)
    PASSWORD_APDU = [0xFF, 0x00, 0x00, 0x00, 0x07, 0xD4, 0x42, 0x1B] + PASSWORD
   # PASSWORD_APDU = [0xFF, 0x00, 0x00, 0x00, 0x04] + PASSWORD 

    response, sw1, sw2 = connection.transmit(PASSWORD_APDU)
    
    if sw1 == 0x90 and sw2 == 0x00:
        print("Authentication successful!")
        return True
    else:
        print(f"Authentication failed. SW1={hex(sw1)}, SW2={hex(sw2)}")
        return False

# Function to chunk data into 4-byte pages for NTAG writing
def chunk_data(data, page_size=4):
    return [data[i:i+page_size] for i in range(0, len(data), page_size)]

# Main writing function
def write_url_to_tag(connection, url):

     # Authenticate with the card using the password
    if not authenticate_tag(connection):
        print("Cannot write without authentication.")
        return

    # Encode the URL as NDEF
    ndef_message = encode_url_as_ndef(url)

    # Break the NDEF message into 4-byte pages
    ndef_pages = chunk_data(ndef_message)

    # Start writing from block 4 (first writable block for NDEF on NTAG215)
    starting_page = 4

    for i, page_data in enumerate(ndef_pages):
        # Ensure each page is exactly 4 bytes
        if len(page_data) < 4:
            page_data += [0x00] * (4 - len(page_data))
        
        # Write the page to the tag
        write_to_page(connection, starting_page + i, page_data)
    
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

# Main program
available_readers = readers()

if len(available_readers) == 0:
    print("No NFC reader found.")
else:
    # Select the first available reader
    reader = available_readers[0]
    print(f"Using reader: {reader}")

    # Connect to the reader
    connection = reader.createConnection()
    connection.connect()

    # URL to write to the NFC tag
    url_to_write = "https://www.example.com"

    # Write the URL to the NFC tag
    write_url_to_tag(connection, url_to_write)
