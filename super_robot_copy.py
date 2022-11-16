class SuperRobotCopy(gameRobot):
    def initialize(self):
        print("Initializing " + self.robot_name + ".")
        self.count_var: int
        self.count_var = 0
        self.cannon_cooldown = 0
        self.anglee = 0
        self.counter = 0
        self.counter2 = 0
        self.amount = 1
        if self.robot_name == "Copy1":
            self.count = 0
            self.lastAngle = 0
            self.foundOne = False
            self.set_position(100, 500)
            xpos = self.x_position
            ypos = self.y_position
            self.found_far = False
            print(
                "Position for "
                + self.robot_name
                + " is "
                + str(xpos)
                + ", "
                + str(ypos)
            )
        if self.robot_name == "Copy2":
            self.set_position(850, 500)
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
                    if self.scanned()<=700:
                        self.foundOne = True
                        self.enemy_scanned = self.scanned()
                        self.cannon(self.lastAngle, self.enemy_scanned)
                        print("Cannon activated to angle "  + str(self.lastAngle)+ "and distance " + str(self.scanned()))
                    else:
                        self.drive(self.lastAngle, 100)
                        print("Not close enough so will move")
                        self.foundOne = False
                        self.found_far = True
                elif self.found_far == False:
                    self.point_scanner(self.anglee, 15)
                    print("Scanner pointed at " + str(self.anglee))
                    self.lastAngle = self.anglee
                    self.anglee += 10
                else:
                    self.point_scanner(self.lastAngle, 15)
            else:
                #self.drive(self.lastAngle,50)
                self.cannon(self.lastAngle, self.enemy_scanned)
                print("Cannon activated to angle "  + str(self.lastAngle)+ "and distance " + str(self.enemy_scanned))
                #pass
        if self.robot_name == "Copy2":
            self.counter += 10
            #print("Drive will be set to (" + str(self.counter) + "," + str(100) + ")")


            #self.drive(self.counter, 100)
        
