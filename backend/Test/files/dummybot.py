class Dummybot(gameRobot):
    def initialize(self):
        print("Initializing " + self.robot_name + ".")
        count_var: int
        count_var = 0
        self.counter = 0
        self.set_position(0, 0)
        self.cannon_cooldown = 0
        if self.robot_name == "Rob1":
            self.set_position(500, 500)
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
        if self.robot_name == "Rob2":
            self.set_position(1, 500)
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
        # posicion

    def respond(self):
        # kitt1 action
        if self.robot_name == "Rob2":
            self.drive(0, 100)
        if self.robot_name == "Rob1":
            self.counter = self.counter + 1
            print("Drive will be set to (" + str(self.counter) + "," + str(100) + ")")
            self.drive(self.counter, 100)
