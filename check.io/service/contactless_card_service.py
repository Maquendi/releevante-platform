from smartcard.CardConnection import CardConnection
from contactless import cardPassword
from contactless import cardProcessing


class ContactlessCardService:
    connection: CardConnection
    onConnectHandler: any

    def __init__(self):
        pass

    def onConnection(self, connection: CardConnection):
        self.connection = connection
        cardPassword.onNewConnection(connection)
        self.onConnectHandler.onConnected(self.readContent())

    def readContent(self) -> str:
        return cardProcessing.read_card_content(self.connection)

    def writeContent(self, content: str) -> str:
        return cardProcessing.write_ndef_message(self.connection, content)

    def subscribe(self, handler):
        self.onConnectHandler = handler
