/* 
 * This javascript handles the input from web browser events.
 */

window.onload = eventInitialize;

// Canvas Rectangle Position and Resized Dimension
var clientCanvasRect;
// Mouse Corrdinates
var mouse = {
	x: 0,
	y: 0
};
// Select action
var isSelected = false;
var selectedCell = {
	i: -1,
	j: -1
};
// Drag action
var isMouseDragging = false;
var dragStartCell = {
	i: -1,
	j: -1
};
var dragStartMouse = {
	x: -1,
	y: -1
}

/** Event Initialize **/

function eventInitialize(){
	var element = document.getElementById("canvasGame");
	element.addEventListener("mousedown", eventMouseDown);
	element.addEventListener("mouseup", eventMouseUp);
	element.addEventListener("mousemove", eventMouseMove);
	clientCanvasRect = element.getBoundingClientRect();
	
	initCoordinates();
	initDraw();
	initBoard();

	draw();
}

/** Event Mouse Down **/

function eventMouseDown(evt){
	updateMouseCoord(evt);

	var cell = getCellFromPosition(mouse);
	if(cell != null){
		isMouseDragging = true;
		dragStartCell = cell;
		dragStartMouse = mouse;
	}

	draw();
}

/** Event Mouse Up **/

function eventMouseUp(evt){
	updateMouseCoord(evt);

	if(isMouseDragging){
		isMouseDragging = false;
		var cell = getCellFromPosition(getDraggedDiskPosition());
		if(cell != null){
			if(dragStartCell.i == cell.i && dragStartCell.j == cell.j){
				subEventMouseClick(cell);
			}else{
				input(dragStartCell.i, dragStartCell.j, cell.i, cell.j);
				isSelected = false;
			}
		}
	}

	draw();
}

function subEventMouseClick(cell){
	if(gameState == STATE_WHITE_PLACE){
		input(cell.i, cell.j, cell.i, cell.j);
		isSelected = false;
	}else{
		if(isMovable(cell.i, cell.j)){
			selectedCell = cell;
			isSelected = true;
		}else if(isSelected){
			if(board.cell[cell.i][cell.j] == CELL_EMPTY){
				input(selectedCell.i, selectedCell.j, cell.i, cell.j);
			}
			isSelected = false;
		}
	}
}

/** Event Mouse Move **/

function eventMouseMove(evt){
	updateMouseCoord(evt);

	var position;
	if(isMouseDragging){
		position = getDraggedDiskPosition();
	}else{
		position = mouse;
	}
	var cell = getCellFromPosition(position);

	draw();
}

/** Mouse **/

function updateMouseCoord(evt){
	var m = {x:-1, y:-1};
	scaleX = canvas.width / clientCanvasRect.width,
	scaleY = canvas.height / clientCanvasRect.height;
	m.x = (evt.clientX - clientCanvasRect.left) * scaleX;
	m.y = (evt.clientY - clientCanvasRect.top) * scaleY;
	mouse = m;
}

/** Cell and Position **/

function getDraggedDiskPosition(){
	var pos = {x:getCellX(dragStartCell.i, dragStartCell.j) + (mouse.x - dragStartMouse.x), y:getCellY(dragStartCell.j, dragStartCell.j) +  (mouse.y - dragStartMouse.y)};
	return pos;
}

function getCellFromPosition(position){
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = getCellX(i, j);
			var y = getCellY(i, j);
			if(isInHexagon(position.x, position.y, x, y, sizeBoardCell)){
				return {i: i, j: j};
			}
		}
	}
	return null;
}

