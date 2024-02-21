# Pyrobots - Code Robots in Python and Battle
This project was made for the Software Engineering course at FAMAF Córdoba National University
It's a web application that lets players create robots in Python code, upload them to the site and use them in battles.\
It's a Python version of Crobots (https://tpoindex.github.io/crobots/) \
PyRobots is a game for programmers. Unlike arcade-style games that require human input to control an object, all of PyRobots' strategy must be completed before the game begins. The game's strategy is condensed into a Python program that you must design and write. Your program controls a robot whose mission is to search, track, and destroy other robots, each running different programs. Each robot is equally equipped, and up to 4 robots can compete simultaneously.
Each robot has functions to scan enemies, start and stop the engine, fire cannons, etc. After the robots are started, each running a program, the battle can be observed. Robots moving, missiles flying and exploding, and certain real-time status information.

![](https://github.com/WalaSTH/pyrobots/blob/master/images/home.png)

## Installation
This project is yet to be deployed so in order to run it you have to run the backend and frontend processes locally.

For the backend, you will need Python 3.10.12 and pip to install all the required dependencies.

For the frontend, you will need Node.js v19.8.1 or higher.

### Backend
First, move to the _backend_ directory:

```cd backend```

Install requirements:

```pip install -r requirements.txt```

And then run:

```uvicorn app:app```

### Frontend
Move to the _frontend_ directory:

```cd frontend```

Install node modules:

```npm install```

And finally run:

```npm start```


## Usage
PyRobots can only be played by first registering with the system. The game allows registration of new users using an email, username, and avatar image. Each user can create as many robots as they wish to use in the game.
### Game modes
PyRobots can be played in two ways: single, where the game can be observed in fullscreen mode, or multiple, where a number of matches are run and only the number of matches won by each player is shown. By default, it is a single game. Multiple games are intended to see how each program performs on average.
See the rules and how the game works, as well as how to create your robot [The Game](#the-game)

## Main Features

### Robot Creation
You can create Robots by uploading the .py file containing their code. You can also give them a name and an avatar.\
The app comes with two default Robots that every user has: Spinner Cheto and Sniper Cheto\


### Robot Listing
Every robot a user has can be viewed in the List Robots menu, you can visualize its code, and also each robot's stats: matches played, won, and win percentage.

### Match creation and Browseing
You can create a Match, where you can set its name, number of players, games, and rounds.
After that, select your robot and wait for players to join.\
You'll see players entering your match in real time!\
You can also search for available matches to join and filter the results.

![](https://github.com/WalaSTH/pyrobots/blob/master/images/RoomJoin2.gif?raw=true)

### Simulation
Create a simulation where you can visualize a single game of up to four fighting robots.
Select the number of rounds you want and play the simulation. You can pause, speed up or rewind the simulation at anytime.

![](https://github.com/WalaSTH/pyrobots/blob/master/images/fight.gif)
### See history and user stats
You have access to your history of matches played, where you can see which robot won and in which position every robot ended, including how many games each of those robots won in that match.
You can also view your user stats, where you'll find your total matches played, your total matches won and your percentage of winrate.

### Profile customization
You can upload a custom profile picture and change it at any time. You can also change your account password.

## The Game
### Battlefield
The battlefield is a square of 1000 x 1000 meters. The field is surrounded by a wall around its perimeter, so when a robot collides with the wall, it incurs damage.
The coordinates (0, 0) correspond to the bottom-left corner. The coordinates (999, 999) correspond to the top-right corner.

- The directions are as follows:
- Right (east): 0 degrees
- Up (north): 90 degrees
- Left (west): 180 degrees
- Down (south): 270 degrees

### Offensive
The main offensive weapons are the cannon and the scanner. The cannon has a range of 700 meters. An unlimited number of missiles can be fired, but after each shot, the cannon needs time to recharge. The cannon is mounted on an independent turret and can therefore fire in any direction (0 to 359 degrees), beyond the robot's flight direction.
The scanner is an optical device that can scan in any direction (0 to 359 degrees), with a resolution of 0 to ±10 degrees.
### Defensive 
The only available defenses are the engine and the status. The engine can be activated in any direction (0 to 359 degrees), at speeds from 0% to 100%. A speed of 0% stops the engine. There are acceleration and deceleration factors. It can turn at speeds equal to or less than 50%, towards any direction.
The program can access certain status information at all times: percentage of damage, position, and current speed.
### Eliminating Enemies
A robot is considered dead when the damage percentage reaches 100%. Damage is inflicted in the following ways:

- Collision with another robot: both receive damage of 2%
- Collision with the wall: 2%
- Missile explosion within 40 meters: 3%
- Missile explosion within 20 meters: 5%
- Missile explosion within 5 meters: 10%
Damage is cumulative and cannot be repaired. However, a robot does not lose mobility or firing power due to high damage. In other words, a robot with 99% damage performs exactly the same as a robot with no damage.

### Rounds
A game consists of at most 10000 rounds. In a round, all robots simultaneously perform certain actions (read status, fire the cannon, aim the scanner, actuate the engine).
The program decides which actions to perform, and at the end of the round, all actions are executed. For example, a robot may decide to fire the cannon at 58% at a distance of 534 meters and accelerate the engine to 60% speed. But these actions will only be executed at the end of the round.

## Creating a Robot
A robot is a file that contains a class inheriting from the Robot class.  The class and the file must have the same name. For example, if the class is named SuperMegaRobot, the file should be named super_mega_robot.py. All robots must be saved in the robots subdirectory.

The class must implement at least 2 methods:  *initialize* and *response*:
```
class SuperMegaRobot(Robot):

   def initialize(self):
        ...

    def respond(self):
        ...
```
*initialize* is executed exactly once when the robot is created. It can be used to initialize variables, for example.\
*respond* is executed exactly once per robot in each round. In this method, any of the public methods of the Robot class can be used, which are described below. Using an internal method (those starting with _) is prohibited.

### Canon:
*is_cannon_ready()*: When a missile is fired, the cannon requires time to recharge. This function can be used to check if the cannon is fully recharged.\
*cannon(degree, distance)*: When this method is called, the cannon is prepared to fire. If this method is called twice in a row, only the last one takes effect. The firing is executed only at the end of the round.
### Scanner:
*point_scanner(direction, resolution_in_degrees)*: With this method, the scanner can be aimed in any direction. However, the result of the scan will be available in the next round, through the following method.\
*scanned()*: Returns the result of the previous round's scan. It returns the distance to the nearest robot in the aimed direction.
### Engine:
*drive(direction, velocity)*: Sets a new direction and velocity for the robot. Similar to cannon, if called twice in a row, only the last one takes effect, at the end of the round.
### Status:
These methods can be called at any time:\
get_direction()\
get_velocity()\
get_position()\
get_damage()\

You can find both default robots in backend/default_bots to use as an example. For instance, the robot SniperCheto will start by scanning until he finds another robot. Once he does, he will get closer if needed and start firing the cannon in the direction he first saw that robot. Note that this robot is very simple and would fail at dealing damage if the enemy robot moves from that position because SniperCheto does not readjust its cannon or scan again. A more sophisticated robot would keep checking where the enemy is and try to catch it again. We encourage users to unleash their creativity and create the most intelligent robots they can in Pyrobots.
