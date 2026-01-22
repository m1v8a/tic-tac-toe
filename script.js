const GAME = (function() {
	let GAMEBOARD = createBoard();
	const X = "x"; 
	const O = "o";
	const players = {};
	let turn = O;
	let gameOver = false;
	let draw = false;
	let winner = null;

	// create a 3 x 3 board
	function createBoard() {
		const board = [];
		for(let i = 0; i < 3; i++) {
			const row = [];
			for(let j = 0; j < 3; j++) {
				row.push(null);
			}
			board.push(row);
		}

		return board;
	}

	function resetGame() {
		GAMEBOARD = createBoard();
		gameOver = false;
		turn = O;
	}

	function getWinner(){
		for (let key in players) {
			if(players[key].marker === winner) {
				return players[key].name;
			}
		}
	}

	function play(marker, y, x) {
		// loop throught the gameboard and find x (row) and y (col)
		if(GAMEBOARD[y][x] !== null || gameOver) return;
			GAMEBOARD[y][x] = marker;	
		
			changeTurn();
			checkWinner();
			if(gameOver || draw) return;
			computerPlay();

		GAMEBOARD.forEach(r => console.log(r));
	}

	function computerPlay() {
		let cy = Math.floor(Math.random() * 2);
		let cx = Math.floor(Math.random() * 2);
		let moves = 0;
		while (GAMEBOARD[cy][cx] !== null && moves < 10) {
			cy = Math.floor(Math.random() * 3);
			cx = Math.floor(Math.random() * 3);
			moves++
		}

		if(moves >= 10) {
			for(let y = 0; y < GAMEBOARD.length; y++) {
				for(let x = 0; x < GAMEBOARD[y].length; x++) {
					if(GAMEBOARD[y][x] === null) {
						cy = y;
						cx = x;
						return;
					}
				}
			}
		}
		GAMEBOARD[cy][cx] = getCurrentTurn();
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
			if(GAMEBOARD[r1.y][r1.x] === X && GAMEBOARD[r2.y][r2.x] === X && GAMEBOARD[r3.y][r3.x] === X) {
				gameOver = true;	
				winner = X;
				updateScore(X);
				return;
			} else if(GAMEBOARD[r1.y][r1.x] === O && GAMEBOARD[r2.y][r2.x] === O && GAMEBOARD[r3.y][r3.x] === O) {
				gameOver = true;
				winner = O;
				updateScore(O);
				return;
			}

			draw = checkForDraw();
		}
	}

	function checkForDraw() {
		let emptyCell = 0;
		for(let y = 0; y < GAMEBOARD.length; y++)  {
			for(let x = 0; x < GAMEBOARD[y].length; x++) {
				if(GAMEBOARD[y][x] === null) {
					emptyCell += 1;
				}
			}
		}
		return !isGameOver() && emptyCell === 0;
	}

	function isGameOver() {
		return gameOver;
	}

	function isGameDraw() {
		return draw;
	}

	function updateScore(marker) {
		const players = getPlayers();
		for( let key in players) {
			if(players[key].marker === marker) {
				console.log(players[key]);
				players[key].score += 1;
			}
		}
	}

	function getBoard() {
		return GAMEBOARD;
	}

	function getCurrentTurn() {
		return turn;
	}

	function createPlayer(name, pos) {
		if(pos === 1) {
			players.playerOne =  { name, score: 0, marker: O };
		} else {
			players.playerTwo =  { name: "Computer", score: 0, marker: X};
		}
	}

	function getPlayers() {
		return players;
	}

	return {
		createBoard,
		resetGame,
		getBoard,
		play,
		getCurrentTurn,
		createPlayer,
		getPlayers,
		isGameOver,
		isGameDraw,
		getWinner,
	}
})();

const UI = (function() {
	const boardEl = document.querySelector(".game-board");
	const playerOneNameEl = document.querySelector(".player-one .name");
	const playerOneScoreEl = document.querySelector(".player-one .score");
	const playerTwoNameEl = document.querySelector(".player-two .name");
	const playerTwoScoreEl = document.querySelector(".player-two .score");
	const winnerEl = document.querySelector(".winner");
	const startButton = document.querySelector(".start-button");
	const nextRoundButton = document.querySelector(".next-round-button");

	const screens = {
		start: document.querySelector(".start-screen"),
		game: document.querySelector(".game-screen"),
		["game-over"]: document.querySelector(".game-over-screen"),
	}

	
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
		GAMEBOARD = createBoardUI(board);
	}

	function updateGameOverScreen(winnerName) {
		winnerEl.textContent = winnerName;
	}


	function switchScreen(screen) {
		for(let key in screens) {
			screens[key].classList.add("hidden");
		}
		screens[screen].classList.remove("hidden");
	}

	function setControls() {
		const switchDelay = 500
		boardEl.addEventListener("click", (e) => {
			if(!e.target.classList.contains("cell")) return;
			const targetY = e.target.dataset.y;
			const targetX = e.target.dataset.x;

			GAME.play(GAME.getCurrentTurn(), targetY, targetX);
			updateBoardUI(GAME.getBoard());
			if(GAME.isGameOver()) {
				updateScoreBoard(GAME.getPlayers().playerOne, GAME.getPlayers().playerTwo);	
				setTimeout(() => {
					updateGameOverScreen(`${GAME.getWinner()} Wins!`);
					switchScreen("game-over");
					GAME.resetGame();
					updateBoardUI(GAME.getBoard());
				}, switchDelay);
			} else if(GAME.isGameDraw()) {
				setTimeout(() => {
					GAME.resetGame();
					updateGameOverScreen("Draw!!");
					switchScreen("game-over");
					updateBoardUI(GAME.getBoard());
				}, switchDelay);
			}
				});

		startButton.addEventListener("click", () => {
			const playerName = document.querySelector("input[name='name']").value;
			if(!playerName) {
				const warning = document.querySelector(".warning");
				warning.textContent = "Please input a name";
				warning.classList.remove("hidden");
				return;
			}
			GAME.createPlayer(playerName, 1);
			GAME.createPlayer("Computer", 2);
			updateScoreBoard(GAME.getPlayers().playerOne, GAME.getPlayers().playerTwo);
			switchScreen("game");
		});

		nextRoundButton.addEventListener("click", () => {
			switchScreen("game");
		})
	}


	function updateScoreBoard(playerOne, playerTwo) {
		playerOneNameEl.textContent = playerOne.name		
		playerOneScoreEl.textContent = playerOne.score;
		playerTwoNameEl.textContent = playerTwo.name;
		playerTwoScoreEl.textContent = playerTwo.score;
	}
	

	function getScreens() {
		return screens;
	}

	return {
		createBoardUI, 
		setControls,
		updateBoardUI,
		switchScreen,
		getScreens,
		updateScoreBoard,
	}
})();



GAME.createBoard() // instantiate the gameboard
UI.switchScreen("start"); // set the 'start' screen as initial screen
UI.createBoardUI(GAME.getBoard()); // create the UI for the game board
UI.setControls();



