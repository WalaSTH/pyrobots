
from typing import Optional
import random

class BeybladeCheto(gameRobot):
    round: int
    state: Optional[str]
    searching_last_direction: Optional[float]
    last_scan: Optional[float]

    def initialize(self):
        print("Initializing " + self.robot_name + ".")
        self.count_var: int
        self.count_var = 0
        self.cannon_cooldown = 0
        self.anglee = 0
        self.counter = 0
        self.counter2 = 0
        self.amount = 1
        self.round = 0
        self.state = None
        self.searching_last_direction = None
        self.last_scan = None
        self.round = 0
        self.state = None
        self.searching_last_direction = None
        self.last_scan = None
        
        #self.set_position(850, 500)
        xpos = self.x_position
        ypos = self.y_position
        print(
            "Position for "
            + self.robot_name
            + " is "
            + str(xpos)
            + ", "
            + str(ypos)
        )

    def respond(self):
        self.counter += 10
        self.drive(self.counter, 100)
