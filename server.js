/**
 * 8 Puzzle Solver - Backend
 * I don't know why I am using a backend for this, but I am so it is what it is. 
 *
 * Saku (saku.lol)
 * 02.05.2023
 */



const express = require('express');
const cors = require('cors');
const app = express();


// Predefined constants
const POSSIBLE_MOVES = [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }];
const GOAL_STATE = [[1, 2, 3], [4, 5, 6], [7, 8, null]];
const APP_PORT = 5000;



/**
 * Manhattan distance heuristic function
 * This function calculates the sum of the distances of each tile from its goal position
 * 
 * @param {array} state 
 * @returns 
 */
function manhattan(state) {
	let distance = 0;
	for (let i = 0; i < state.length; i++) {
		for (let j = 0; j < state[i].length; j++) {
			const value = state[i][j];
			if (value !== null) {
				const goalPosition = getGoalPosition(value);
				distance += Math.abs(i - goalPosition.row) + Math.abs(j - goalPosition.col);
			}
		}
	}
	return distance;
}


/**
 * Get the goal position of a tile with a given value
 * @param {number} value 
 * @returns 
 */
function getGoalPosition(value) {
	for (let i = 0; i < GOAL_STATE.length; i++) {
		for (let j = 0; j < GOAL_STATE[i].length; j++) {
			if (GOAL_STATE[i][j] === value) {
				return { row: i, col: j };
			}
		}
	}
}


/**
 * Node class
 * This class represents a node in the search tree and contains the state, g, h, f and parent values
 */
class Node {
	constructor(state, g, h, parent) {
		this.state = state;
		this.g = g;
		this.h = h;
		this.f = g + h;
		this.parent = parent;
	}
}


/**
 * Define the A* search algorithm for the puzzle solver
 * This function returns the path from the initial state to the goal state
 * If the goal state is not reachable, this function returns null
 * 
 * @author GitHub Copilot
 * @param {array} initialState 
 * @returns 
 */
function aStarSearch(initialState) {
	const initialNode = new Node(initialState, 0, manhattan(initialState), null);
	const openSet = [initialNode];
	const closedSet = [];

	while (openSet.length > 0) {
		const currentNode = openSet.sort((a, b) => a.f - b.f)[0];

		if (JSON.stringify(currentNode.state) === JSON.stringify(GOAL_STATE)) {
			return getPath(currentNode);
		}

		openSet.splice(openSet.indexOf(currentNode), 1);
		closedSet.push(currentNode);

		for (const move of POSSIBLE_MOVES) {
			const newState = applyMove(currentNode.state, move);
			if (newState !== null && !inClosedSet(newState, closedSet)) {
				const g = currentNode.g + 1;
				const h = manhattan(newState);
				const newNode = new Node(newState, g, h, currentNode);
				if (inOpenSet(newState, openSet)) {
					const existingNode = openSet.find(node => JSON.stringify(node.state) === JSON.stringify(newState));
					if (g < existingNode.g) {
						existingNode.g = g;
						existingNode.f = g + h;
						existingNode.parent = currentNode;
					}
				} else {
					openSet.push(newNode);
				}
			}
		}
	}

	return null;
}


/**
 * Applies the move to the state and returns the new state
 * If the move is not possible, this function returns null
 * 
 * @param {object} state 
 * @param {object} move 
 * @returns 
 */
function applyMove(state, move) {
	if (state === null) {
		return null;
	}

	const nullPosition = getPosition(null, state);
	const newRow = nullPosition.row + move.row;
	const newCol = nullPosition.col + move.col;
	if (newRow >= 0 && newRow < state.length && newCol >= 0 && newCol < state[newRow].length) {
		const newState = copyState(state);
		newState[nullPosition.row][nullPosition.col] = state[newRow][newCol];
		newState[newRow][newCol] = null;
		return newState;
	} else {
		return null;
	}
}


/**
 * Get the position of a tile with a given value in the state
 * @param {number} value
 * @param {array} state
 * @returns 
 */
function getPosition(value, state) {
	for (let i = 0; i < state.length; i++) {
		for (let j = 0; j < state[i].length; j++) {
			if (state[i][j] === value) {
				return { row: i, col: j };
			}
		}
	}
}


/**
 * Copy the state to a new array
 * @param {array} state 
 * @returns 
 */
function copyState(state) {
	const copy = [];
	for (let i = 0; i < state.length; i++) {
		copy.push([...state[i]]);
	}
	return copy;
}


/**
 * Check if the state is in the open set (frontier)
 * @param {object} state 
 * @param {array} openSet 
 * @returns 
 */
function inOpenSet(state, openSet) {
	return openSet.some(node => JSON.stringify(node.state) === JSON.stringify(state));
}


/**
 * Check if the state is in the closed set (explored)
 * @param {object} state
 * @param {array} closedSet
 * @returns
 */
function inClosedSet(state, closedSet) {
	return closedSet.some(node => JSON.stringify(node.state) === JSON.stringify(state));
}


/**
 * Get the path from the initial state to the goal state from the node
 * @param {object} node 
 * @returns 
 */
function getPath(node) {
	const path = [node.state];
	while (node.parent !== null) {
		path.unshift(node.parent.state);
		node = node.parent;
	}
	return path;
}


// Setup express server and middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/solve', (req, res) => {
	const initialState = req.body.initialState;
	const path = aStarSearch(initialState);
	res.type('json');
	res.json(path);
});

app.listen(APP_PORT, () => {
	console.log(`Server listening on port ${APP_PORT}`);
});