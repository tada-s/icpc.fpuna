window.onload = init;

function init(){
	setupEvents("canvasGame");
	setEventMouseMove(true);
	setEventMouseDown(true);
	setupDraw();
	initBoard();
	
	draw();
	
	gameState = STATE_WHITE_PLACE;
	
	console.log("Game Loaded!");
}

function getGameMessage(){
	switch(gameState){
		case STATE_NONE:
			return "Click to start a new game";
		case STATE_WHITE_SELECT:
			return "White Player: Select a Black disk to move";
		case STATE_WHITE_MOVE:
			return "White Player: Select an Empty cell to place the Black disk";
		case STATE_WHITE_PLACE:
			return "White Player: Select an Empty cell to place a White disk";
		case STATE_WHITE_SURROUND_SELECT:
			return "White Player: Select a surrounded Black disk to move";
		case STATE_WHITE_SURROUND_MOVE:
			return "White Player: Select an Empty cell to place the Black disk";
		case STATE_WHITE_WINS:
			return "White Player Win!";
		case STATE_BLACK_SELECT:
			return "Black Player: Select a White disk to move";
		case STATE_BLACK_MOVE:
			return "Black Player: Select an Empty cell to place the White disk";
		case STATE_BLACK_PLACE:
			return "Black Player: Select an Empty cell to place a Black disk";
		case STATE_BLACK_SURROUND_SELECT:
			return "Black Player: Select a surrounded White disk to move";
		case STATE_BLACK_SURROUND_MOVE:
			return "Black Player: Select an Empty cell to place the White disk";
		case STATE_WHITE_WINS:
			return "Black Player Win!";
		case STATE_DRAW:
			return "Draw Game";
		default:
			return "";
	}
}

function eventMouseDown(){
	cell = getCellFromMouse();
	input(cell.i, cell.j);
	draw();
}

function getCellFromMouse(){
	var deltaX = 2 * board.cellSize * sqr3_2;
	var deltaY = 3 / 2 * board.cellSize;
	
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = board.screenOffX + i * deltaX + j * board.cellSize * sqr3_2;
			var y = board.screenOffY + j * deltaY;
			if(isInHexagon(mouse.x, mouse.y, x, y, board.cellSize)){
				return {i: i, j: j};
			}
		}
	}
	return null;
}
