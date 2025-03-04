from typing import List
from enum import Enum


class TransactionType(Enum):
    RENT = 1
    PURCHASE = 2


class BookTransactionItemState:
    id: str
    isbn: str
    cpy: str
    position: str
    image: str
    title: str
    transactionType: TransactionType
    transactionId: str
    exchangeCompleted: bool
    currentlyExchanging: bool
    exchangeWithError: bool


class BookCategory:
    en: str
    fr: str
    es: str


class BookTransactionItem:
    id: str
    isbn: str
    cpy: str
    position: str
    image: str
    title: str
    author: str
    categories: List[BookCategory]


class UserId:
    value: str


class TransactionStatusEnum(Enum):
    RETURNED = 1
    CURRENT = 2
    OVERDUE = 3
    PENDING = 4


class BookTransactionStatus:
    id: str
    transactionId: str
    status: TransactionStatusEnum
    createdAt: str


class BookTransaction:
    id: str
    clientId: UserId
    transactionType: TransactionType
    items: List[BookTransactionItem]
    status: List[BookTransactionStatus]
    createdAt: str
    returnsAt: str


class BookTransactions:
    rent: BookTransaction
    purchase: BookTransaction
