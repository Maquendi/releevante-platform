from appserver.sever_init import sio

from bookexchange.messageHandler import MessageHandler
from bookexchange.messageSender import MessageSender
from bookexchange.backendCommunicationService import BackendCommService

message_sender = MessageSender(sio)
backendService = BackendCommService()

message_handler = MessageHandler(message_sender, backendService)
