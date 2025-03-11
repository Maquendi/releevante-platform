import json
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from appserver.sever_init import fastapi_app as app
from bookexchange.factory import message_sender

# ---------------------- FASTAPI ROUTES ----------------------


class NewStatus(BaseModel):
    id: str
    isbn: str
    status: str


@app.get("/health")
async def health():
    await message_sender.onMessage("health_report", "Reporting that I am healthy")
    return JSONResponse(content={"status": "OK"})


@app.post("/new_status")
async def newStatus(status: NewStatus):
    await message_sender.onMessage("checkout_status", json.dumps(status.__dict__))
    return JSONResponse(content={"status": "OK"})


def initialize():
    print("fastapi routes configured")