from smartcard.CardMonitoring import CardMonitor, CardObserver
from smartcard.util import toHexString
from smartcard.System import *
from service.contactless_card_service import ContactlessCardService


class NTAG215Observer(CardObserver):
    """Observer class for NFC card detection and processing."""

    def __init__(self, contactlessService: ContactlessCardService):
        self.contactlessService = contactlessService

    def update(self, observable, actions):
        (addedcards, _) = actions
        for card in addedcards:
            print(f"Card detected, ATR: {toHexString(card.atr)}")
            try:
                connection = card.createConnection()
                connection.connect()
                print("Connected to card")
                self.contactlessService.onConnection(connection)
            except Exception as e:
                print(f"An error occurred: {e}")


def start_nfc_writer(contactlessService: ContactlessCardService):
    print("Starting NFC card writer processing...")
    # loop = asyncio.get_running_loop()
    cardmonitor = CardMonitor()
    cardobserver = NTAG215Observer(contactlessService)
    cardmonitor.addObserver(cardobserver)
