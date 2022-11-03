class SuperRobotCopy(gameRobot):
    def initialize(self):
        print("Initializing " + self.robot_name + ".")
        count_var: int
        count_var = 0
        self.cannon_cooldown = 0
        self.anglee = 0
        self.counter = 0
        self.counter2 = 0
        self.amount = 1
        if self.robot_name == "Copy1":
            self.count = 0
            self.lastAngle = 0
            self.foundOne = False
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
        if self.robot_name == "Copy2":
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
        if self.robot_name == "Copy1":
            if not self.foundOne:
                if self.scanned() < 1000:
                    print("Enemy scanned, so drive will be set to" + str(self.lastAngle))
                    self.foundOne = True
                    self.drive(self.lastAngle, 100)
                else:
                    self.point_scanner(self.anglee, 5)
                    print("Scanner pointed at " + str(self.anglee))
                    self.lastAngle = self.anglee
                    self.anglee += 5
        if self.robot_name == "Copy2":
            self.counter = self.counter + 1
            print("Drive will be set to (" + str(self.counter) + "," + str(100) + ")")
            self.drive(self.counter, 100)
        if self.robot_name == "Copy3":
            if self.counter2 == 15:
                self.drive(self.amount, 100)
                self.amount = self.amount+1
            else:
                self.drive(0, 100)
                self.counter2+=1
