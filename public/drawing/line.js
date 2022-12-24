// Constructor function for creating new line objects
function Line(x, y, px, py, red, green, blue, w) {
	// Each line has its own unique coordinates, colour and thickness that is passed in from the drawing interface when they are created
	this.pos = createVector(x, y);
	this.ppos = createVector(px, py);
	this.r = red;
	this.g = green;
	this.b = blue;
	this.width = w;

	this.show = function () {
		// Displays line that have been drawn by the client when they are the drawer
		// Also draws line that are recieved from the server, drawn by other clients
		push();

		stroke(this.r, this.g, this.b);
		strokeWeight(this.width);

		// Confines the lines inside the canvas
		if (this.pos.x > 810) this.pos.x = 810;
		if (this.pos.x < 190) this.pos.x = 190;

		if (this.pos.y > 520) this.pos.y = 520;
		if (this.pos.y < 70) this.pos.y = 70;

		if (this.ppos.x > 810) this.ppos.x = 810;
		if (this.ppos.x < 190) this.ppos.x = 190;

		if (this.ppos.y > 520) this.ppos.y = 520;
		if (this.ppos.y < 70) this.ppos.y = 70;

		line(this.pos.x, this.pos.y, this.ppos.x, this.ppos.y);

		pop();
	}

	this.broadcast = function () {
		// Sends the coordinates, colour and width of the line to the server to be displayed on other clients' canvases

		var data = {
			x: this.pos.x,
			y: this.pos.y
		}

		var pdata = {
			x: this.ppos.x,
			y: this.ppos.y
		}

		var colour = {
			r: this.r,
			g: this.g,
			b: this.b
		}

		// Only sends mouse data if it is within the canvas
		if (data.x > 170 && data.x < 770 && data.y > 70 && data.y < 520) {
			socket.emit('mouse', data, pdata, colour, this.width);
		}
	}
}   




/* class Line {

	constructor(x, y, px, py, red, green, blue, w) {
		this.pos = createVector(x, y);
		this.ppos = createVector(px, py);
		this.r = red;
		this.g = green;
		this.b = blue;
		this.width = w;
	}

	show() {
		push();

		stroke(this.r, this.g, this.b);
		strokeWeight(this.width);
		if (this.pos.x > 810) this.pos.x = 810;
		if (this.pos.x < 190) this.pos.x = 190;

		if (this.pos.y > 520) this.pos.y = 520;
		if (this.pos.y < 70) this.pos.y = 70;

		if (this.ppos.x > 810) this.ppos.x = 810;
		if (this.ppos.x < 190) this.ppos.x = 190;

		if (this.ppos.y > 520) this.ppos.y = 520;
		if (this.ppos.y < 70) this.ppos.y = 70;

		line(this.pos.x, this.pos.y, this.ppos.x, this.ppos.y);

		pop();
	}


	broadcast() {
		var data = {
			x: this.pos.x,
			y: this.pos.y
		}

		var pdata = {
			x: this.ppos.x,
			y: this.ppos.y
		}

		var colour = {
			r: this.r,
			g: this.g,
			b: this.b
		}

		if (data.x > 190 && data.x < 810 && data.y > 70 && data.y < 520) {

			socket.emit('mouse', data, pdata, colour, this.width);
		}
	}
}
 */