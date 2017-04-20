var lastMouse = {
	x: 0,
	y: 0
};

var mouse = {
	x: 0,
	y: 0
};

var events_docElement;

function setupEvents(element){
	events_docElement = document.getElementById(element);
}

// Event MouseMove

function setEventMouseMove(flag){
	if(flag == true){
		events_docElement.addEventListener("mousemove", internalEventMouseMove);
	}else{
		events_docElement.removeEventListener("mousemove", internalEventMouseMove);
	}
}

function internalEventMouseMove(evt){
	var rect = events_docElement.getBoundingClientRect();
	scaleX = canvas.width / rect.width,
	scaleY = canvas.height / rect.height;
	lastMouse.x = mouse.x;
	lastMouse.y = mouse.y;
	mouse.x = (evt.clientX - rect.left) * scaleX;
	mouse.y = (evt.clientY - rect.top) * scaleY;
	//eventMouseMove();
}

// Event MouseDown

function setEventMouseDown(flag){
	if(flag == true){
		events_docElement.addEventListener("mousedown", internalEventMouseDown);
	}else{
		events_docElement.removeEventListener("mousedown", internalEventMouseDown);
	}
}

function internalEventMouseDown(evt){
	eventMouseDown();
}

// Event MouseUp

function setEventMouseUp(flag){
	if(flag == true){
		events_docElement.addEventListener("mouseup", internalEventMouseUp);
	}else{
		events_docElement.removeEventListener("mouseup", internalEventMouseUp);
	}
}

function internalEventMouseUp(evt){
	eventMouseUp();
}


