class SniperCheto(gameRobot):
    def initialize(self):
        self.anglee = 0
        self.count = 0
        self.lastAngle = 0
        self.foundOne = False
        self.found_far = False
    def respond(self):
        if not self.foundOne:
            if self.scanned() < 1000:
                if self.scanned()<=700:
                    self.foundOne = True
                    self.enemy_scanned = self.scanned()
                    self.cannon(self.lastAngle, self.enemy_scanned)
                else:
                    self.drive(self.lastAngle, 100)
                    self.foundOne = False
                    self.found_far = True
            elif self.found_far == False:
                self.point_scanner(self.anglee, 5)
                self.lastAngle = self.anglee
                self.anglee += 5
            else:
                self.point_scanner(self.lastAngle, 10)
        else:
            self.cannon(self.lastAngle, self.enemy_scanned)
