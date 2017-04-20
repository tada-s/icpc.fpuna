var canvas, ctx;
var sqr3_2 = Math.sqrt(3) / 2;
var hexX = [0, sqr3_2, sqr3_2, 0, -sqr3_2, -sqr3_2];
var hexY = [1, 0.5, -0.5, -1, -0.5, 0.5];

function setupDraw(){
	canvas = document.getElementById("canvasGame");
	ctx = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
}

function draw(){
	clearCanvas();
	drawBoardBack();
	drawBoardCells();
	drawDisks();
	drawMessage();
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

function isInHexagon(x, y, hX, hY, size){
	for(var i = 0; i < 6; i++){
		var midX = (hexX[i] + hexX[(i + 1) % 6]) * size / 2 + hX;
		var midY = (hexY[i] + hexY[(i + 1) % 6]) * size / 2 + hY;

		var vX = midX - hX;
		var vY = midY - hY;
		var wX = x - midX;
		var wY = y - midY;
		if(vX * wX + vY * wY > 0){
			return false;
		}
	}
	return true;
}

function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawMouse(x, y){
	ctx.fillStyle="red";
	ctx.fillRect(x, y, 10, 10);
}

function drawBoardBack(){
	var borderSize = 0;

	var deltaX = 2 * board.cellSize * sqr3_2;
	var deltaY = 3 / 2 * board.cellSize;
	var border1DeltaX = Math.sqrt(3) * (borderSize + board.cellSize) * 1;
	var border1DeltaY = borderSize + board.cellSize * 1;
	var border2DeltaX = Math.sqrt(3) / 3 * (borderSize + board.cellSize);
	var border2DeltaY = board.cellSize + borderSize;
	var x0 = board.screenOffX - border1DeltaX;
	var y0 = board.screenOffY - border1DeltaY;
	var x1 = board.screenOffX + (board.cellColumn - 1) * board.cellSize * sqr3_2 - border2DeltaX;
	var y1 = board.screenOffY + (board.cellColumn - 1) * deltaY + border2DeltaY;
	var x2 = board.screenOffX + (board.cellRow - 1) * deltaX + (board.cellColumn - 1) * board.cellSize * sqr3_2 + border1DeltaX;
	var y2 = board.screenOffY + (board.cellColumn - 1) * deltaY + border1DeltaY;
	var x3 = board.screenOffX + (board.cellRow - 1) * deltaX + border2DeltaX;
	var y3 = board.screenOffY - border2DeltaY;

	ctx.lineJoin = "round";

	// Shadow
	ctx.lineWidth = 30;
	ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
	var shadowX = [x0, x1, x2, x3, x0];
	var shadowY = [y0, y1, y2, y3, y0];
	drawPolygon(shadowX, shadowY);
	ctx.stroke();
	// Edges
	ctx.lineWidth = 20;
	// Black Edge
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
	ctx.fillStyle = "rgba(0, 0, 0, 1)";
	var blackEdgeX = [x0, x3, x1, x2, x0];
	var blackEdgeY = [y0, y3, y1, y2, y0];
	drawPolygon(blackEdgeX, blackEdgeY);
	ctx.fill();
	ctx.stroke();
	// White Edge
	ctx.strokeStyle = "rgba(255, 255, 255, 1)";
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	var whiteEdgeX = [x0, x1, x3, x2, x0];
	var whiteEdgeY = [y0, y1, y3, y2, y0];
	drawPolygon(whiteEdgeX, whiteEdgeY);
	ctx.fill();
	ctx.stroke();
}

function drawPolygon(x, y){
	ctx.beginPath();
	ctx.moveTo(x[0], y[0]);
	for(var i = 1; i < x.length; i++){
		ctx.lineTo(x[i], y[i]);
	}
	ctx.closePath();
}

function drawBoardCells(){


	var deltaX = 2 * board.cellSize * sqr3_2;
	var deltaY = 3 / 2 * board.cellSize;
	
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = board.screenOffX + i * deltaX + j * board.cellSize * sqr3_2;
			var y = board.screenOffY + j * deltaY;
			ctx.lineWidth = 4;
			ctx.strokeStyle = "rgba(255, 255, 255, 1)";
			ctx.fillStyle = "rgba(225, 0, 0, 1)";
			drawHexagon(x, y, board.cellSize);
			fillHexagon(x, y, board.cellSize);
			
			if(isInHexagon(mouse.x, mouse.y, x, y, board.cellSize)){
				ctx.strokeStyle = "rgba(0, 0, 0, 1)";
				ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
				fillHexagon(x, y, board.cellSize);
			}
		}
	}
}

function drawDisks(){
	var deltaX = 2 * board.cellSize * sqr3_2;
	var deltaY = 3 / 2 * board.cellSize;
	
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] == CELL_BLACK || board.cell[i][j] == CELL_WHITE){
				var x = board.screenOffX + i * deltaX + j * board.cellSize * sqr3_2;
				var y = board.screenOffY + j * deltaY;
				var diskSize = board.cellSize * 0.6;
				
				ctx.lineWidth = 4;
				if(board.cell[i][j] == CELL_BLACK){
					ctx.fillStyle = "rgba(0, 0, 0, 1)";
				}else{
					ctx.fillStyle = "rgba(255, 255, 255, 1)";
				}
				ctx.strokeStyle = "rgba(0, 0, 0, 0)";
				fillDisc(x, y, diskSize);
			}
		}
	}
}

function fillDisc(x, y, size){
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.stroke();
}

function drawHexagon(x, y, size){
	pathHexagon(x, y, size);
	ctx.stroke();
}

function fillHexagon(x, y, size){
	pathHexagon(x, y, size);
	ctx.closePath();
	ctx.fill();
}

function pathHexagon(x, y, size){
	ctx.beginPath();
	ctx.moveTo(x + hexX[5] * size, y + hexY[5] * size);
	for(var i = 0; i < 6; i++){
		ctx.lineTo(x + hexX[i] * size, y + hexY[i] * size);
	}
	ctx.closePath();
}

