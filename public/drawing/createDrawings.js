var brushThickness = 3;
var eraserOffset = 0;
var selectedColour = 7;

//brush colours
var r = 0;
var g = 0;
var b = 0;

function drawing() {
	timer();
	words();

	// Display Canvas
	push();
	fill(255);
	stroke(0);
	strokeWeight(16);
	rect(190, 70, 620, 450, 10);
	pop();

	push();
	// Buttons for changing drawing colour
	for (let i = 0; i < 9; i++) {

		// Display buttons
		let shade = 170;
		if (mouseX > 840 && mouseX < 970 && mouseY > i * 50 + 80 && mouseY < i * 50 + 110 || selectedColour == i) {
			shade = 255;
		}

		fill(shade);
		noStroke();
		strokeWeight(5);
		rect(840, i * 50 + 80, 130, 30, 7);
	}

	// Display avaliable colours
	for (let i = 0; i < 7; i++) {
		colorMode(HSB, 7);
		for (var j = 0; j < 7; j++) {
			for (let k = 0; k < 7; k++) {
				fill(i, j, 7);
			}
		}
		noStroke();
		rect(860, i * 50 + 87, 90, 16, 7);
	}
	
	fill(0);
	rect(860, 7 * 50 + 87, 90, 16, 7);

	noFill();
	stroke(0);
	strokeWeight(3);
	rect(860, 8 * 50 + 87, 90, 16, 7);
	pop();

	// Create new line objects when mouse is pressed
	if (drawingPerms == true) {
		guessingPerms = false;

		if (mouseIsPressed) {
			push();
			var line = new Line(mouseX, mouseY, pmouseX, pmouseY, r, g, b, brushThickness);
			lines.push(line);
			setInterval(line.broadcast(), 500);
			pop();
		}
	}

	// Display all line objects
	for (var line of lines) {
		line.show();
	}

	// Canvas border
	push();
	noFill();
	stroke(0);
	strokeWeight(16);
	rect(190, 70, 620, 450, 10);
	pop();
}


function recieveDrawing(rdata, rpdata, rmouse, width) {
	// Create new line objects when line data is recieved from the server
	push();
	fill(255);
	strokeWeight(5);

	var line = new Line(rdata.x, rdata.y, rpdata.x, rpdata.y, rmouse.r, rmouse.g, rmouse.b, width);
	lines.push(line);

	// Display the lines from server
	for (var line of lines) {
		line.show();
	}
	pop();
}

function mousePressed() {
	// Brush colour interface 
	drawingButtons();

	for (let i = 0; i < 9; i++) {
		if (mouseX > 840 && mouseX < 970 && mouseY > i * 50 + 80 && mouseY < i * 50 + 110) {
			selectedColour = i; // Colour index for selection indicator on button
		}
	}
}