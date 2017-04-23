/* 
 * This javascript implements the game rules.
 */

const CELL_EMPTY = 0;
const CELL_WHITE = 1;
const CELL_BLACK = 2;

const STATE_NONE = 0;
const STATE_WHITE_MOVE = 2;
const STATE_WHITE_PLACE = 3;
const STATE_WHITE_SURROUND_MOVE = 5;
const STATE_WHITE_WINS = 6;
const STATE_BLACK_MOVE = 8;
const STATE_BLACK_SURROUND_MOVE = 11;
const STATE_BLACK_WINS = 12;
const STATE_DRAW = 13;

const TURN_WHITE = CELL_WHITE;
const TURN_BLACK = CELL_BLACK;

var board = {
	cell: [],
	cellRow: 7,
	cellColumn: 7
};

var gameState = STATE_NONE;

var diNeighbor = [1, 1, 0, -1, -1, 0];
var djNeighbor = [0, -1, -1, 0, 1, 1];

var ufdsParent = [];

/** Initialization **/

function initBoard(){
	board.cell = [];
	for(var i = 0; i < board.cellRow; i++){
		board.cell.push([]);
		for(var j = 0; j < board.cellColumn; j++){
			board.cell[i].push(CELL_EMPTY);
		}
	}
	//gameState = STATE_NONE;
	gameState = STATE_WHITE_PLACE;
}

/** Game input **/

function input(i1, j1, i2, j2){
	if(gameState == STATE_WHITE_PLACE){
		board.cell[i1][j1] = CELL_WHITE;
		gameState = STATE_BLACK_MOVE;
	}
	
	var playerColor = getColorFromState();
	var oppositePlayerColor = oppositeColor(playerColor);
	switch(gameState){
		case STATE_NONE:
			
			break;
		case STATE_WHITE_MOVE:
		case STATE_BLACK_MOVE:
			if(board.cell[i1][j1] == oppositePlayerColor && areNeighbors(i1, j1, i2, j2) && board.cell[i2][j2] == CELL_EMPTY){
				board.cell[i1][j1] = playerColor;
				board.cell[i2][j2] = oppositePlayerColor;
				if(existSurroundedDiscsBy(playerColor)){
					if(playerColor == TURN_WHITE){
						gameState = STATE_WHITE_SURROUND_MOVE;
					}else{
						gameState = STATE_BLACK_SURROUND_MOVE;
					}
				}else{
					if(playerColor == TURN_WHITE){
						gameState = STATE_BLACK_MOVE;
					}else{
						gameState = STATE_WHITE_MOVE;
					}
				}
			}
			break;
		case STATE_WHITE_SURROUND_MOVE:
		case STATE_BLACK_SURROUND_MOVE:
			if(board.cell[i1][j1] == oppositePlayerColor && isSurroundedBy(i1, j1, playerColor) && board.cell[i2][j2] == CELL_EMPTY){
				board.cell[i1][j1] = CELL_EMPTY;
				board.cell[i2][j2] = oppositePlayerColor;
				if(existSurroundedDiscsBy(playerColor)){
					if(playerColor == TURN_WHITE){
						gameState = STATE_WHITE_SURROUND_MOVE;
					}else{
						gameState = STATE_BLACK_SURROUND_MOVE;
					}
				}else{
					if(playerColor == TURN_WHITE){
						gameState = STATE_BLACK_MOVE;
					}else{
						gameState = STATE_WHITE_MOVE;
					}
				}
			}
			break;
		case STATE_WHITE_WINS:
		case STATE_BLACK_WINS:
			// When wins!
			break;
		case STATE_DRAW:
			break;
	}

	var winner = checkWinner();
	if(winner != STATE_NONE){
		gameState = winner;
	}
}

/** Colors **/

function getColorFromState(){
	switch(gameState){
		case STATE_WHITE_PLACE:
		case STATE_WHITE_MOVE:
		case STATE_WHITE_SURROUND_MOVE:
		case STATE_WHITE_WINS:
			return TURN_WHITE;
		case STATE_BLACK_MOVE:
		case STATE_BLACK_SURROUND_MOVE:
		case STATE_BLACK_WINS:
			return TURN_BLACK;
		case STATE_NONE:
		case STATE_DRAW:
		default:
			return -1;
	}
}

function oppositeColor(color){
	if(color == CELL_WHITE) return CELL_BLACK;
	if(color == CELL_BLACK) return CELL_WHITE;
	else return -1;
}

/** Neighborhood **/

function isSurroundedBy(i, j, cellColor){
	if(board.cell[i][j] != oppositeColor(cellColor)){
		return false;
	}
	for(var k = 0; k < 6; k++){
		var ni = i + diNeighbor[k];
		var nj = j + djNeighbor[k];
		if((0 <= ni && ni < board.cellRow) && 0 <= nj && nj < board.cellColumn){
			if(board.cell[ni][nj] != cellColor){
				return false;
			}
		}
	}
	return true;
}

function existSurroundedDiscsBy(cellColor){
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(isSurroundedBy(i, j, cellColor)){
				return true;
			}
		}
	}
	return false;
}

function areNeighbors(i1, j1, i2, j2){
	for(var k = 0; k < 6; k++){
		var ni = i1 + diNeighbor[k];
		var nj = j1 + djNeighbor[k];
		if(i2 == ni && j2 == nj){
			return true;
		}
	}
	return false;
}

/** Validation **/

function isMovable(i, j){
	switch(gameState){
		case STATE_WHITE_MOVE:
		case STATE_BLACK_MOVE:
			if(board.cell[i][j] == oppositeColor(getColorFromState())){
				return true;
			}else{
				return false;
			}
		case STATE_WHITE_SURROUND_MOVE:
		case STATE_BLACK_SURROUND_MOVE:
			if(isSurroundedBy(i, j, getColorFromState())){
				return true;
			}else{
				return false;
			}
		case STATE_NONE:
		case STATE_WHITE_PLACE:
		case STATE_WHITE_WINS:
		case STATE_BLACK_WINS:
		case STATE_DRAW:
		default:
			return false;
	}
}

function checkWinner(){
	// Calculate connected components with Union Find Disjoint Sets
	ufdsParent = [];
	for(var x = 0; x < board.cellRow * board.cellColumn; x++){
		ufdsParent.push(x);
	}

	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			for(var k = 0; k < 6; k++){
				var ni = i + diNeighbor[k];
				var nj = j + djNeighbor[k];
				if((0 <= ni && ni < board.cellRow) && 0 <= nj && nj < board.cellColumn){
					if(board.cell[i][j] == board.cell[ni][nj]){
						var m = i + j * board.cellRow;
						var n = ni + nj * board.cellRow;
						ufdsUnion(m, n);
					}
				}
			}
		}
	}

	// Check black win
	for(var i1 = 0; i1 < board.cellRow; i1++){
		for(var i2 = 0; i2 < board.cellRow; i2++){
			if(board.cell[i1][0] == CELL_BLACK && board.cell[i2][board.cellColumn - 1] == CELL_BLACK){
				var m = i1;
				var n = i2 + (board.cellColumn - 1) * board.cellRow;
				if(ufdsFind(m) == ufdsFind(n)){
					return STATE_BLACK_WINS;
				}
			}
		}
	}

	// Check white win
	for(var j1 = 0; j1 < board.cellColumn; j1++){
		for(var j2 = 0; j2 < board.cellColumn; j2++){
			if(board.cell[0][j1] == CELL_WHITE && board.cell[board.cellRow - 1][j2] == CELL_WHITE){
				var m = j1 * board.cellRow;
				var n = board.cellRow - 1 + j2 * board.cellRow;
				if(ufdsFind(m) == ufdsFind(n)){
					return STATE_WHITE_WINS;
				}
			}
		}
	}

	// Check draw
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			for(var k = 0; k < 6; k++){
				var ni = i + diNeighbor[k];
				var nj = j + djNeighbor[k];
				if((0 <= ni && ni < board.cellRow) && 0 <= nj && nj < board.cellColumn){
// Do something
				}
			}
		}
	}
	return STATE_NONE;
}

/** Union Find Disjoint Set **/

function ufdsFind(i){
	if(ufdsParent[i] != i){
		ufdsParent[i] = ufdsFind(ufdsParent[i])
	}
	return ufdsParent[i];
}

function ufdsUnion(i, j){
	ufdsParent[ufdsFind(i)] = ufdsParent[ufdsFind(j)];
}


