# 8-puzzle-solver

🕹️ Automatic [sliding.toys 8 Puzzle](https://sliding.toys/mystic-square/8-puzzle/) solver. I don't know why I am using a external Express backend for this.

## Algorithm
The solver uses A* path finding algorithm. By default it's configured to be used for the 8 puzzle because the algorithm is too slow for the 15 Puzzle or the 24 puzzle. You can try it by modifying the **GOAL_STATE** in the backend and **INTIAL_STATE** in the client to match the correct values.

## Running the solver
Install the dependencies by running `npm i`. Run the server by running `node server.js`. Paste *client-min.js* contents into the DevTools console. When you have the backend running you can press F2 key in the website to automatically solve the puzzle. 

## Disclaimer
Because the solver is implemented in JavaScript it is expected to be slow sometimes. 