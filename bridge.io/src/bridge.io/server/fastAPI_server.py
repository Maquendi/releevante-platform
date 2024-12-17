from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()


@app.websocket("/ws")
@app.get("/health")
async def get(websocket: WebSocket):
    websocket.send_text("hello client")
    return HTMLResponse('Im ok!')

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")