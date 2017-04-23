/* 
 * This javascript renders in canvas.
 */

var canvas, ctx;

var boardReady = false;
var boardCanvas, boardCtx, boardImageData;

/** Initialization **/

function initDraw(){
	canvas = document.getElementById("canvasGame");
	ctx = canvas.getContext("2d");
	
	boardReady = false;
	boardCanvas = document.createElement("canvas");
	boardCanvas.width = 800;
	boardCanvas.height = 600;
	boardCtx = boardCanvas.getContext("2d");
}

/** Main draw **/

function draw(){
	clearCanvas();
	drawBoardBack();
	drawBoardCells();
	drawDisks();
	drawMessage();
}

/** Main draw methods **/

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBoardBack(){
	/*if(boardReady){
		ctx.putImageData(boardImageData, 0, 0);
	}else{*/
		console.log(":D");
		ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
		ctx.lineJoin = "round";
		// Shadow
		ctx.lineWidth = 30;
		ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
		var shadowOrder = [0, 1, 2, 3, 0];
		var shadowX = [];
		var shadowY = [];
		for(var i = 0; i < shadowOrder.length; i++){
			shadowX.push(coordBoardPolygonX[shadowOrder[i]]);
			shadowY.push(coordBoardPolygonY[shadowOrder[i]]);
		}
		drawPolygon(shadowX, shadowY);
		ctx.stroke();
		// Edges
		ctx.lineWidth = 20;
		// Black Edge
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		var blackEdgeOrder = [0, 3, 1, 2, 0];
		var blackEdgeX = [];
		var blackEdgeY = [];
		for(var i = 0; i < shadowOrder.length; i++){
			blackEdgeX.push(coordBoardPolygonX[blackEdgeOrder[i]]);
			blackEdgeY.push(coordBoardPolygonY[blackEdgeOrder[i]]);
		}
		drawPolygon(blackEdgeX, blackEdgeY);
		ctx.fill();
		ctx.stroke();
		// White Edge
		ctx.strokeStyle = "rgba(255, 255, 255, 1)";
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		var whiteEdgeOrder = [0, 1, 3, 2, 0];
		var whiteEdgeX = [];
		var whiteEdgeY = [];
		for(var i = 0; i < shadowOrder.length; i++){
			whiteEdgeX.push(coordBoardPolygonX[whiteEdgeOrder[i]]);
			whiteEdgeY.push(coordBoardPolygonY[whiteEdgeOrder[i]]);
		}
		drawPolygon(whiteEdgeX, whiteEdgeY);
		ctx.fill();
		ctx.stroke();
/*		boardImageData = boardCtx.getImageData(0, 0, boardCanvas.width, boardCanvas.height);
		ctx.putImageData(boardImageData, 0, 0);
		boardReady = true;
	}*/
}

function drawBoardCells(){
	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	ctx.fillStyle = "rgba(225, 0, 0, 1)";
	ctx.lineWidth = 2;
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = getCellX(i, j);
			var y = getCellY(i, j);
			pathHexagon(x, y, sizeBoardCell);
			ctx.fill();
		}
	}
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = getCellX(i, j);
			var y = getCellY(i, j);
			pathHexagon(x, y, sizeBoardCell);
			ctx.stroke();
		}
	}
	ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	if(isSelected){
		var x = getCellX(selectedCell.i, selectedCell.j);
		var y = getCellY(selectedCell.i, selectedCell.j);
		pathHexagon(x, y, sizeBoardCell);
		ctx.fill();
		ctx.stroke();
	}
}

function drawDisks(){
	// Draw static disks
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] != CELL_EMPTY && (!isMouseDragging || (isMouseDragging && !(dragStartCell.i == i && dragStartCell.j == j)))){
				var x = getCellX(i, j);
				var y = getCellY(i, j);
			
				ctx.lineWidth = 4;
				if(board.cell[i][j] == CELL_BLACK){
					ctx.fillStyle = "rgba(0, 0, 0, 1)";
				}else{
					ctx.fillStyle = "rgba(255, 255, 255, 1)";
				}
				ctx.strokeStyle = "rgba(0, 0, 0, 0)";
				fillDisc(x, y, sizeDisk);
			}
		}
	}
	// Draw dragged disk
	if(isMouseDragging && (board.cell[dragStartCell.i][dragStartCell.j] != CELL_EMPTY)){
		var x = getCellX(dragStartCell.i, dragStartCell.j);
		var y = getCellY(dragStartCell.i, dragStartCell.j);
		if(isMovable(dragStartCell.i, dragStartCell.j)){
			x += mouse.x - dragStartMouse.x;
			y += mouse.y - dragStartMouse.y;
		}
		if(board.cell[dragStartCell.i][dragStartCell.j] == CELL_BLACK){
			ctx.fillStyle = "rgba(0, 0, 0, 1)";
		}else{
			ctx.fillStyle = "rgba(255, 255, 255, 1)";
		}
		fillDisc(x, y, sizeDisk);
	}
}

function drawMessage(){
	ctx.font = "bold 25px Lucida Sans Unicode";
	ctx.lineWidth = 0.8;
	if(1 <= gameState && gameState <= 6){
		ctx.fillStyle = "rgba(230, 230, 230, 1)";
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.fillText(getGameMessage(), 20, 30);
		ctx.strokeText(getGameMessage(), 20, 30);
	}else{
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.strokeStyle = "rgba(0, 0, 0, 1)";
		ctx.fillText(getGameMessage(), 20, 30);
	}
}

function getGameMessage(){
	switch(gameState){
		case STATE_NONE:
			return "Click to start a new game";
/*		case STATE_WHITE_SELECT:
			return "White Player: Select a Black disk to move";*/
		case STATE_WHITE_MOVE:
			return "White Player: Select an Empty cell to place the Black disk";
		case STATE_WHITE_PLACE:
			return "White Player: Select an Empty cell to place a White disk";
/*		case STATE_WHITE_SURROUND_SELECT:
			return "White Player: Select a surrounded Black disk to move";*/
		case STATE_WHITE_SURROUND_MOVE:
			return "White Player: Select an Empty cell to place the Black disk";
		case STATE_WHITE_WINS:
			return "White Player Win!";
/*		case STATE_BLACK_SELECT:
			return "Black Player: Select a White disk to move";*/
		case STATE_BLACK_MOVE:
			return "Black Player: Select an Empty cell to place the White disk";
/*		case STATE_BLACK_PLACE:
			return "Black Player: Select an Empty cell to place a Black disk";*/
/*		case STATE_BLACK_SURROUND_SELECT:
			return "Black Player: Select a surrounded White disk to move";*/
		case STATE_BLACK_SURROUND_MOVE:
			return "Black Player: Select an Empty cell to place the White disk";
		case STATE_BLACK_WINS:
			return "Black Player Win!";
		case STATE_DRAW:
			return "Draw Game";
		default:
			return "";
	}
}

/** Auxiliar drawing methods **/

function drawPolygon(x, y){
	ctx.beginPath();
	ctx.moveTo(x[0], y[0]);
	for(var i = 1; i < x.length; i++){
		ctx.lineTo(x[i], y[i]);
	}
	ctx.closePath();
}

function fillDisc(x, y, size){
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
}

function pathHexagon(x, y, size){
	ctx.beginPath();
	ctx.moveTo(x + coordHexagonX[5] * size, y + coordHexagonY[5] * size);
	for(var i = 0; i < 6; i++){
		ctx.lineTo(x + coordHexagonX[i] * size, y + coordHexagonY[i] * size);
	}
	ctx.closePath();
}
