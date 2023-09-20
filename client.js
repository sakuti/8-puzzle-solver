/**
 * 8 Puzzle Solver - Frontend (paste this or preferably client-min.js to DevTools console)
 * 
 * Saku (saku.lol)
 * 02.05.2023
 */


/**
 * Solve the puzzle using the algorithm in the backend
 */
async function ratkaise() {
	const TIMEOUT_BETWEEN_MOVES = 150;
	const INITIAL_STATE = [[null, null, null], [null, null, null], [null, null, null]]
	
	// Get the numbers from the cells and put them in the initial state
	document.querySelectorAll('.cell').forEach((cell, index) => {
		const number = Number(cell.textContent.match(/\d+/)[0]);
		
		const position = [
			cell.getAttribute('data-position')[0],
			cell.getAttribute('data-position')[2]
		]
	
		INITIAL_STATE[position[0]][position[1]] = number;
	})
	
	// Clear the console and alert the user that the algorithm is being used
	console.clear()
	alert('Käytetään algoritmia ratkaisun selvittämiseksi. Klikkaa jatkaaksesi.')
	
	// Send the initial state to the backend and get the moves back
	await fetch('http://localhost:5000/solve', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ INITIAL_STATE })
	}).then(res => res.json()).then(data => {
		// Loop through each move and click the correct cell
		data.forEach((move, moveIndex) => {
			for (let i = 0; i < move.length; i++) {
				for (let j = 0; j < move[i].length; j++) {
					if (move[i][j] === null) {
						setTimeout(() => {
								document.querySelector(`.cell[data-position="${i}-${j}"]`).dispatchEvent(new Event('mousedown'))
						}, moveIndex * TIMEOUT_BETWEEN_MOVES)
						break;
					}
				}
			}
		})

		// After all moves have been made, alert the user that the puzzle has been solved
		setTimeout(() => { alert('Valmis!') }, (data.length + 1) * TIMEOUT_BETWEEN_MOVES)
	})
}


/**
 * Create event listener for F2 key to solve the puzzle
 */
document.addEventListener('keydown', async function(event) {
	if (event.key === 'F2') {
		await ratkaise();
	}
});


/**
 * Notify the user that he can use the F2 key to solve the puzzle
 * after the page has loaded
 */
window.addEventListener('load', () => {
	alert('Voit käyttää F2-näppäintä ratkaisun selvittämiseen.')
})