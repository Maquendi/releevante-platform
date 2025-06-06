import asyncio
from bookexchange.backendCommunicationService import (
    BackendCommService,
    BackendCommand,
    BackendPayload,
)

from bookexchange import messageSender
from bookexchange.models import (
    BookTransaction,
    BookTransactionItemState,
    BookTransactions,
)


class MessageHandler:
    def __init__(
        self,
        message_sender: messageSender.MessageSender,
        backendService: BackendCommService,
    ):
        self.sender = message_sender
        self.backendService = backendService

    async def handleCheckout(self, data: BookTransactions):

        try:
            purchase = data["purchase"]
            if purchase is not None:
                await self.__process__(purchase)
        except Exception as e:
            print(e)
            pass

        try:
            rent = data["rent"]
            if rent is not None:
                await self.__process__(rent)
        except Exception as e:
            print(e)
            pass

    async def __process__(self, data: BookTransaction):
        transaction_id = data["id"]
        transactionType = data["transactionType"]
        items = data["items"]

        for item in items:
            status = dict(
                item,
                transactionType=transactionType,
                exchangeCompleted=False,
                currentlyExchanging=True,
                exchangeWithError=False,
            )

            position = item["position"].split("-")
            door = position[0]
            slot = position[1]

            await self.sender.onItemCheckoutStarted(status)
            
            await self.backendService.sendCommand(
                BackendCommand.OPEN, BackendPayload(door=door, slot=slot)
            )

            status = dict(
                item,
                transactionType=transactionType,
                exchangeCompleted=True,
                currentlyExchanging=False,
                exchangeWithError=True,
            )
            await self.sender.onItemCheckoutSucceeded(status)

        await self.sender.onCheckoutSucceeded({"transactionId": transaction_id})

    async def handleCheckin(self, data: BookTransactionItemState):
        try:
            status = dict(
                data,
                exchangeCompleted=False,
                currentlyExchanging=True,
                exchangeWithError=False,
            )

            await self.sender.onCheckinStarted(status)
            await asyncio.sleep(5)
            status = dict(
                data,
                exchangeCompleted=True,
                currentlyExchanging=False,
                exchangeWithError=False,
            )

            await self.sender.onCheckinSucceeded(status)
        except Exception as e:
            print(e)
            pass
