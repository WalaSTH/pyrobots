from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        self.connections: dict = defaultdict(dict)

    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        if self.connections[room_id] == {} or len(self.connections[room_id]) == 0:
            self.connections[room_id] = []
        self.connections[room_id].append(websocket)
        print(f"CONNECTIONS : {self.connections[room_id]}")

    def disconnect(self, websocket: WebSocket, room_id : int):
        self.connections[room_id].remove(websocket)
        print(
            f"CONNECTION REMOVED\nREMAINING CONNECTIONS : {self.connections[room_id]}"
        )

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_id : int):
        for connection in self.connections[room_id]:
            await connection.send_json(message)