class SpinnerCheto(gameRobot):
    def initialize(self):
        self.counter = 0
    def respond(self):
        self.counter += 10
        self.drive(self.counter, 100)
        self.cannon(self.counter, 500)
