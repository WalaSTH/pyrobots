class DummyOne(gameRobot):
    def initialize(self):
        self.counter = 0

    def respond(self):
        self.counter = self.counter + 1
        print("Drive will be set to (" + str(self.counter) + "," + str(100) + ")")
        self.drive(self.counter, 100)
