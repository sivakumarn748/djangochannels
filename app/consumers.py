from channels.generic.websocket import WebsocketConsumer
import json

class ChatroomConsumer(WebsocketConsumer) :
    
    def connect(self) : 
        self.accept()

    def receive(self, text_data) :
        print(text_data)
        self.send("A message received : " + text_data)