
const GAME = (function() {
	const GAMEBOARD = [];
	const X = "x"; 
	const O = "o";
	let turn = O;
	let isGameOver = false;

	// create a 3 x 3 board
	function createBoard() {
		for(let i = 0; i < 3; i++) {
			const row = [];
			for(let j = 0; j < 3; j++) {
				row.push(null);
			}
			GAMEBOARD.push(row);
		}
	}

	function play(marker, y, x) {
		// loop throught the gameboard and find x (row) and y (col)
		if(GAMEBOARD[y][x] !== null || isGameOver) return;
		GAMEBOARD[y][x] = marker;
		changeTurn();
		checkWinner();
	}

	function changeTurn() {
		if(turn === X) {
			turn = O;
		} else {
			turn = X;
		}
	}
	
	function checkWinner() {
		const winningCombinations = [
			["00", "01", "02"],
			["10", "11", "12"],
			["20", "21", "22"],
			["00", "10", "20"],
			["01", "11", "21"],
			["02", "12", "22"],		
			["00", "10", "20"],
			["01", "11", "21"],
			["00", "11", "22"],
			["02", "11", "20"],
		]

		for(let i = 0; i < winningCombinations.length; i++) {
			const row = winningCombinations[i];
			const r1 = {y: Number(row[0][0]), x: Number(row[0][1])};
			const r2 = {y: Number(row[1][0]), x: Number(row[1][1])};
			const r3 = {y: Number(row[2][0]), x: Number(row[2][1])};
			if(GAMEBOARD[r1.x][r1.y] === X && GAMEBOARD[r2.x][r2.y] === X && GAMEBOARD[r3.x][r3.y] === X) {
				console.log("WINNER X");
				isGameOver = true;
				return;
			}else if(GAMEBOARD[r1.x][r1.y] === O && GAMEBOARD[r2.x][r2.y] === O && GAMEBOARD[r3.x][r3.y] === O) {
				console.log("WINNER O");
				isGameOver = true;
				return;
			}
		}
	}

	function getBoard() {
		return GAMEBOARD;
	}

	function getCurrentTurn() {
		return turn;
	}

	return {
		createBoard,
		getBoard,
		play,
		getCurrentTurn,
	}
})();

const UI = (function() {
	const boardEl = document.querySelector(".board");
	
	function createBoardUI(board) {
		board.forEach((row, y) => {
			row.forEach((c, x) => {
				const cell = document.createElement("div");
				cell.dataset.x = x;
				cell.dataset.y = y;
				cell.classList.add("cell");
				cell.textContent = c;
				boardEl.appendChild(cell);
			});
		});
	}

	function updateBoardUI(board) {
		boardEl.innerHTML = "";
		createBoardUI(board);
	}

	function setControls(inputHandler) {
		boardEl.addEventListener("click", (e) => {
			if(!e.target.classList.contains("cell")) return;
			const targetY = e.target.dataset.y;
			const targetX = e.target.dataset.x;
			inputHandler(targetY, targetX);
		})
	}

	return {
		createBoardUI, 
		setControls,
		updateBoardUI,
	}
})();

GAME.createBoard()
UI.createBoardUI(GAME.getBoard());
UI.setControls((y,x) => {
	GAME.play(GAME.getCurrentTurn(), y, x);
	UI.updateBoardUI(GAME.getBoard());
});


