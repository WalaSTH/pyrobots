# Pyrobots - Code Robots in Python and Battle
This project was made for the Software Engineering course at FAMAF Córdoba National University
It's a web application that lets players create robots in Python code, upload them to the site and use them in battles.

![](https://github.com/WalaSTH/pyrobots/blob/master/images/home.png)

## Instalation and usage
This project is yet to be deployed so in order to run it you have to run the backend and frontend processes locally.

For the backend you will need Python 3.10.12 and pip to install all the requirements.

For the frontend, you will need Node.js v19.8.1 or higher

### Backend
First, move to the _backend_ directory:

```cd backend```

Install requirements:

```pip install -r requirements.txt```

And then run:

```uvicorn app:app```

### Frontend
Move to _frontend_ directory:

```cd frontend```

Install node modules:

```npm install```

And finally run:

```npm start```


Users can create an account, and after validateing their email, they can fully start using the app.

## Main Features
### Match creation and Browseing
You can create a Match, where you can its name, number of players, games and rounds.
After that, select your robot and wait for players to join.
You'll see players entereing your match in real time!
You can also search for available matches to join, and also filter the results.
![](https://github.com/WalaSTH/pyrobots/blob/master/images/RoomJoin2.gif?raw=true)

### Simulation
Create a simulation where you can visualize a single game of up to four fighting robots.
Select the number of rounds you want and play the simulation. You can pause, speed up or rewind the simulation at anytime.
![](https://github.com/WalaSTH/pyrobots/blob/master/images/fight.gif)
### See history and user stats
You have access to your history of matches played, where you can see which robot won and in which position every robot ended, includeing how many games each of those robots won in that match.
You can also view your user stats, where you'll find your total matches played, your total matches won and your percentage of winrate.
### Robot Creation
You can create a Robots by uploading the .py file containing their code. You can also give them a name and an avatar.
The app comes with two default Robots that every user has: Spinner Cheto and Sniper Cheto
Every robot a user has can be viewd in the List Robots menu, you can visualize their code and also each robot's stats, which are just like for users, matches played, won and win percentage.
