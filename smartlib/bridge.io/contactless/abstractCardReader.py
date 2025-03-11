from abc import ABC, abstractmethod


class AbstractCardReader(ABC):
    
    @abstractmethod
    def readUUID(self, card)-> str:
        pass  # This is an abstract method, no implementation here.
    
    @abstractmethod
    def authenticate(self, card)-> bool:
        pass  # This is an abstract method, no implementation here.
    
    @abstractmethod
    def decode_atr(self, card)-> str:
        pass
    
    @abstractmethod
    def read_content(self, card)-> str:
        pass