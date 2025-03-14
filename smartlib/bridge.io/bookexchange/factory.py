from appserver.sever_init import sio

from bookexchange.messageHandler import MessageHandler
from bookexchange.messageSender import MessageSender

message_sender = MessageSender(sio)

message_handler = MessageHandler(message_sender)
