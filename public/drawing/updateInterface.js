// Update the brush colour buttons
function drawingButtons() {
	//red
	if (mouseX > 840 && mouseX < 970 && mouseY > 0 * 50 + 80 && mouseY < 0 * 50 + 110) {
		r = 245;
		g = 21;
		b = 5;
		brushThickness = 3;
	}

	//yellow
	if (mouseX > 840 && mouseX < 970 && mouseY > 1 * 50 + 80 && mouseY < 1 * 50 + 110) {
		r = 245;
		g = 212;
		b = 27;
		brushThickness = 3;
	}

	//green
	if (mouseX > 840 && mouseX < 970 && mouseY > 2 * 50 + 80 && mouseY < 2 * 50 + 110) {
		r = 103;
		g = 245;
		b = 27;
		brushThickness = 3;
	}

	//cyan
	if (mouseX > 840 && mouseX < 970 && mouseY > 3 * 50 + 80 && mouseY < 3 * 50 + 110) {
		r = 26;
		g = 237;
		b = 177;
		brushThickness = 3;
	}

	//blue
	if (mouseX > 840 && mouseX < 970 && mouseY > 4 * 50 + 80 && mouseY < 4 * 50 + 110) {
		r = 27;
		g = 165;
		b = 245;
		brushThickness = 3;
	}

	//purple
	if (mouseX > 840 && mouseX < 970 && mouseY > 5 * 50 + 80 && mouseY < 5 * 50 + 110) {
		r = 125;
		g = 27;
		b = 245;
		brushThickness = 3;
	}

	//pink
	if (mouseX > 840 && mouseX < 970 && mouseY > 6 * 50 + 80 && mouseY < 6 * 50 + 110) {
		r = 245;
		g = 27;
		b = 223;
		brushThickness = 3;
	}

	//black
	if (mouseX > 840 && mouseX < 970 && mouseY > 7 * 50 + 80 && mouseY < 7 * 50 + 110) {
		r = 0;
		g = 0;
		b = 0;
		brushThickness = 3;
	}

	//eraser
	if (mouseX > 840 && mouseX < 970 && mouseY > 8 * 50 + 80 && mouseY < 8 * 50 + 110) {
		r = 255;
		g = 255;
		b = 255;
		brushThickness = 10; // Eraser has a larger width
		eraserOffset = 70; // Due to the larger width, eraser has an offset to prevent it from being displayed outsde the edges of the canvas
	}
	else {
		eraserOffset = 0;
	}
}