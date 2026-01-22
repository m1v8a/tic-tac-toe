
(function main() {
	const players = { playerOne: null, playerTwo: null };
	const TICTACTOE = createTicTacToe();
	const UI = createUI();

})();

function createPlayer(name, marker) {
	const getMarker = () => marker;
	const getName = () => name;
	return { getName, getMarker }
}


function logBoard(board, result) {
	console.clear();
	for (let i = 0; i < board.length; i++) {
		console.log(board[i]);
	}
	console.log(result)
}


function createTicTacToe() {
	const BOARD_SIZE = 3;
	const X = "x";
	const O = "o";
	let result = null;
	let board = createBoard();

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

	function play(marker, y, x) {
		board[y][x] = marker;
		check();
		logBoard(board, result);
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
				result = O;	
			} else if (b1 === X && b2 === X && b3 === X) {
				result = X;	
			} else if(isDraw()) {
				result = "draw";
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

	return { play }
}


function createUI() {
}



