/* 
 * This javascript contains game coordinate information.
 */

const sqr3_2 = Math.sqrt(3) / 2;

const sizeBoardCell = 40;
const sizeDisk = sizeBoardCell * 0.6;
const sizeBoardBorder = 0;

const coordHexagonX = [0, sqr3_2, sqr3_2, 0, -sqr3_2, -sqr3_2];
const coordHexagonY = [1, 0.5, -0.5, -1, -0.5, 0.5];
const coordBoardScreenOffX = 90;
const coordBoardScreenOffY = 120;
const coordMessage = {
	x: 20,
	y: 30
};

// Coordinates calculated during the execution
var coordBoardPolygonX = [0, 0, 0, 0];
var coordBoardPolygonY = [0, 0, 0, 0];



function initCoordinates(){
	calcBoardPolygon();
}

function calcBoardPolygon(){
	var deltaX = 2 * sizeBoardCell * sqr3_2;
	var deltaY = 3 / 2 * sizeBoardCell;
	var border1DeltaX = Math.sqrt(3) * (sizeBoardBorder + sizeBoardCell) * 1;
	var border1DeltaY = sizeBoardBorder + sizeBoardCell * 1;
	var border2DeltaX = Math.sqrt(3) / 3 * (sizeBoardBorder + sizeBoardCell);
	var border2DeltaY = sizeBoardCell + sizeBoardBorder;
	coordBoardPolygonX = [
		coordBoardScreenOffX - border1DeltaX,
		coordBoardScreenOffX + (board.cellColumn - 1) * sizeBoardCell * sqr3_2 - border2DeltaX,
		coordBoardScreenOffX + (board.cellRow - 1) * deltaX + (board.cellColumn - 1) * sizeBoardCell * sqr3_2 + border1DeltaX,
		coordBoardScreenOffX + (board.cellRow - 1) * deltaX + border2DeltaX
	];
	coordBoardPolygonY = [
		coordBoardScreenOffY - border1DeltaY,
		coordBoardScreenOffY + (board.cellColumn - 1) * deltaY + border2DeltaY,
		coordBoardScreenOffY + (board.cellColumn - 1) * deltaY + border1DeltaY,
		coordBoardScreenOffY - border2DeltaY
	];
}

function isInHexagon(x, y, hX, hY, size){
	for(var i = 0; i < 6; i++){
		var midX = (coordHexagonX[i] + coordHexagonX[(i + 1) % 6]) * size / 2 + hX;
		var midY = (coordHexagonY[i] + coordHexagonY[(i + 1) % 6]) * size / 2 + hY;

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

function getCellX(i, j){
	var deltaX = 2 * sizeBoardCell * sqr3_2;
	return coordBoardScreenOffX + i * deltaX + j * sizeBoardCell * sqr3_2;
}

function getCellY(i, j){
	var deltaY = 3 / 2 * sizeBoardCell;
	return coordBoardScreenOffY + j * deltaY;
}

