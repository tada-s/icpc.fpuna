const CELL_EMPTY = 0;
const CELL_WHITE = 1;
const CELL_BLACK = 2;

const STATE_NONE = 0;
const STATE_WHITE_SELECT = 1;
const STATE_WHITE_MOVE = 2;
const STATE_WHITE_PLACE = 3;
const STATE_WHITE_SURROUND_SELECT = 4;
const STATE_WHITE_SURROUND_MOVE = 5;
const STATE_WHITE_WINS = 6;
const STATE_BLACK_SELECT = 7;
const STATE_BLACK_MOVE = 8;
const STATE_BLACK_PLACE = 9;
const STATE_BLACK_SURROUND_SELECT = 10;
const STATE_BLACK_SURROUND_MOVE = 11;
const STATE_BLACK_WINS = 12;
const STATE_DRAW = 13;

var board = {
	cell: [],
	cellRow: 7,
	cellColumn: 7,
	cellSize: 40,
	screenOffX: 90,
	screenOffY: 120
};

var gameState = STATE_NONE;

var diNeighbor = [1, 1, 0, -1, -1, 0];
var djNeighbor = [0, -1, -1, 0, 1, 1];

function initBoard(){
	board.cell = [];
	for(var i = 0; i < board.cellRow; i++){
		board.cell.push([]);
		for(var j = 0; j < board.cellColumn; j++){
			board.cell[i].push(CELL_EMPTY);
		}
	}
	gameState = STATE_NONE;
}

function anotherColor(color){
	return 3 - color;
}

function isSurroundedBy(i, j, cellColor){
	if(board.cell[i][j] != anotherColor(cellColor)){
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

function input(i, j){
	switch(gameState){
		case STATE_NONE:
			
			break;
		case STATE_WHITE_PLACE:
			if(board.cell[i][j] == CELL_EMPTY){
				board.cell[i][j] = CELL_WHITE;
				gameState = STATE_BLACK_SELECT;
			}
			break;
		case STATE_WHITE_SELECT:
			if(board.cell[i][j] == CELL_BLACK){
				board.cell[i][j] = CELL_WHITE;
				gameState = STATE_WHITE_MOVE;
			}
			break;
		case STATE_WHITE_MOVE:
			if(board.cell[i][j] == CELL_EMPTY){
				board.cell[i][j] = CELL_BLACK;
				if(existSurroundedDiscsBy(CELL_WHITE)){
					gameState = STATE_WHITE_SURROUND_SELECT;
				}else{
					gameState = STATE_BLACK_SELECT;
				}
			}
			break;
		case STATE_WHITE_SURROUND_SELECT:
			if(board.cell[i][j] == CELL_BLACK && isSurroundedBy(i, j, CELL_WHITE)){
				board.cell[i][j] = CELL_EMPTY;
				gameState = STATE_WHITE_SURROUND_MOVE;
			}
			break;
		case STATE_WHITE_SURROUND_MOVE:
			if(board.cell[i][j] == CELL_EMPTY){
				board.cell[i][j] = CELL_BLACK;
				if(existSurroundedDiscsBy(CELL_WHITE)){
					gameState = STATE_WHITE_SURROUND_SELECT;
				}else{
					gameState = STATE_BLACK_SELECT;
				}
			}
			break;
		case STATE_WHITE_WINS:
			
			break;
		case STATE_BLACK_SELECT:
			if(board.cell[i][j] == CELL_WHITE){
				board.cell[i][j] = CELL_BLACK;
				gameState = STATE_BLACK_MOVE;
			}
			break;
		case STATE_BLACK_MOVE:
			if(board.cell[i][j] == CELL_EMPTY){
				board.cell[i][j] = CELL_WHITE;
				if(existSurroundedDiscsBy(CELL_BLACK)){
					gameState = STATE_BLACK_SURROUND_SELECT;
				}else{
					gameState = STATE_WHITE_SELECT;
				}
			}
			break;
		case STATE_BLACK_SURROUND_SELECT:
			if(board.cell[i][j] == CELL_WHITE && isSurroundedBy(i, j, CELL_BLACK)){
				board.cell[i][j] = CELL_EMPTY;
				gameState = STATE_BLACK_SURROUND_MOVE;
			}
			break;
		case STATE_BLACK_SURROUND_MOVE:
			if(board.cell[i][j] == CELL_EMPTY){
				board.cell[i][j] = CELL_WHITE;
				if(existSurroundedDiscsBy(CELL_BLACK)){
					gameState = STATE_BLACK_SURROUND_SELECT;
				}else{
					gameState = STATE_WHITE_SELECT;
				}
			}
			break;
		case STATE_WHITE_WINS:
			
			break;
		case STATE_DRAW:
			
			break;
	}
}
