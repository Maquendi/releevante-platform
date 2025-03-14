from enum import Enum
from pydantic import BaseModel
import asyncio


class BackendCommand(Enum):
    OPEN = 1
    CLOSE = 1


class BackendPayload(BaseModel):
    door: str
    slot: str


class BackendCommService:
    def __init__(self):
        pass

    async def sendCommand(self, command: BackendCommand, payload: BackendPayload):
        await asyncio.sleep(5)

    def subscribe():
        pass
