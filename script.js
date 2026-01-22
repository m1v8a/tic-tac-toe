
(function main() {
	const TICTACTOE = createTicTacToe();
	const UI_CONTROLLER = createUIController();

	UI_CONTROLLER.setControls();
	UI_CONTROLLER.setStartButtonHandler((inputValues) => {
		const playerOne = TICTACTOE.createPlayer(inputValues.name, "x");
		const playerTwo = TICTACTOE.createPlayer("Computer", "o");
		TICTACTOE.setPlayers(playerOne, playerTwo);
		UI_CONTROLLER.switchScreen("game");
	});

	UI_CONTROLLER.setGameBoardHandler((y, x) => {
		const currentTurn = TICTACTOE.getState().currentTurn;
		TICTACTOE.play(currentTurn.getMarker(), y, x);
		
		if(TICTACTOE.getState().isGameOver) {
			UI_CONTROLLER.switchScreen("over");
		}

	});

	UI_CONTROLLER.switchScreen("start");
	UI_CONTROLLER.updateBoard(TICTACTOE.getBoard());
})();



function logBoard(board, state) {
	console.clear();
	for (let i = 0; i < board.length; i++) {
		console.log(board[i]);
	}
	console.log(state);
}


function createTicTacToe() {
	const BOARD_SIZE = 3;
	const X = "x";
	const O = "o";
	const players = {playerOne: null, playerTwo: null};
	let state = { isGameOver: false, winner: null, currentTurn: players.playerOne };
	let board = createBoard();

	function createPlayer(name, marker) {
		const getMarker = () => marker;
		const getName = () => name;
		return { getName, getMarker }
	}

	function setPlayers(playerOne, playerTwo) {
		players.playerOne = playerOne;
		players.playerTwo = playerTwo;
		state.currentTurn = players.playerOne;
	}
	
	function createBoard() {
		const b = [];
		for (let y = 0; y < BOARD_SIZE; y++) {
			const r = []
			for( let x = 0; x < BOARD_SIZE; x++) {
				r.push(null);
			}
			b.push(r);
		}
		return b;
	}

	function getBoard() {
		return board;
	}

	function getState() {
		return state;
	}

	function play(marker, y, x) {
		board[y][x] = marker;
		check();
		switchTurn();
		logBoard(board, state);
	}

	function check() {
		const combinations = [
			["00","01", "02"],
			["10","11", "12"],
			["20","21", "22"],
			["00","11", "22"],
			["02","11", "20"],
			["00","10", "20"],
			["01","11", "21"],
			["02","12", "22"],
		]

		for (let i = 0; i < combinations.length; i++) {
			const c1 = combinations[i][0];
			const c2 = combinations[i][1];
			const c3 = combinations[i][2];
			const b1 = board[+c1[0]][+c1[1]];
			const b2 = board[+c2[0]][+c2[1]];
			const b3 = board[+c3[0]][+c3[1]];	
			if (b1 === O && b2 === O && b3 === O) {
				state.isGameOver = true;	
				state.winner = O;	
			} else if (b1 === X && b2 === X && b3 === X) {
				state.isGameOver = true;	
				state.winner = X;	
			} else if(isDraw()) {
				state.isGameOver = true;
				state.winner = null;
			}
		}
	}

	function isDraw() {
		let emptyCount = 0;
		board.forEach((y) => {
			y.forEach((r) => {
				if(r === null) emptyCount++;
			})
		});
		if(emptyCount === 0) {
			return true;
		}
		return false;
	}


	function switchTurn() {
		const currentTurn = state.currentTurn;
		const playerOne = players.playerOne;
		const playerTwo = players.playerTwo;
		if(playerOne.getMarker() === currentTurn.getMarker()) {
			state.currentTurn = playerTwo;
		} else {
			state.currentTurn = playerOne;
		}
	}


	return { play, getBoard, getState, createPlayer, setPlayers };
}


function createUIController() {
	const boardEl = document.querySelector("#game-board");
	const inputValues = { name: "", };
	let gameBoardHandler = null;
	let startButtonHandler = null;

	const screens = {
		start: document.querySelector("#start-screen"),
		game: document.querySelector("#game-screen"),
		over: document.querySelector("#game-over-screen"),
	}
	
	function setControls() {
		const startButton = document.querySelector("#start-button");
		const nameInputEl = document.querySelector("#name");

		startButton.addEventListener("click", () => {
			startButtonHandler(inputValues);
		});

		nameInputEl.addEventListener("input", () => {
			inputValues.name = nameInputEl.value
		})

		boardEl.addEventListener("click", (e) => {
			const t = e.target;
			if(t.classList.contains("cell")) {
				const y = t.dataset.y;
				const x = t.dataset.x;
				gameBoardHandler(y, x);
			}
		});
	}

	function setGameBoardHandler(fn) {
		gameBoardHandler = fn;
	}

	function setStartButtonHandler(fn) {
		startButtonHandler = fn;
	}

	function updateBoard(board) {
		boardEl.innerHTML = "";
		board.forEach((y, yi) => {
			y.forEach((x, xi) => {
				const cell = document.createElement("div");
				cell.className = "cell";
				cell.dataset.y = yi;
				cell.dataset.x = xi;
				boardEl.appendChild(cell);
			});
		});
	}

	function switchScreen(key) {
		for(let k in screens) {
			screens[k].classList.add("hidden");
		}
		screens[key].classList.remove("hidden");
	}


	return { 
		setControls, 
		switchScreen, 
		updateBoard, 
		setGameBoardHandler,
		setStartButtonHandler,
	};
}



