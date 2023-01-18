function askName() {
	// Pop up to ask client for name
	var name = prompt('What is your name?');

	// Display pop up again if player presses cancel
	if (name == null) {
		name = prompt('What is your name?');
	}

	// Send client's name to server to display on all leaderboards
	socket.emit('new-user', name);
}

function displayPlayers() {
	// Display leaderboard
	push();
	let n = 0;

	// Draw leaderboard titles
	fill(48, 132, 207);
	stroke(255);
	strokeWeight(3)
	rect(10, 70, 95, 40);
	rect(105, 70, 55, 40);

	push();
	fill(255);
	textSize(23);
	noStroke();
	text('Player', 17, 97);
	textSize(16);
	text('Score', 112, 97);
	pop();

	for (const client in clients) {
		// Create new row for each new client joined
		fill(48, 132, 207);
		rect(10, n * 40 + 110, 95, 40);
		rect(105, n * 40 + 110, 55, 40);
		let aClient = clients[client];


		push();
		// Highlights client's own name on leaderboard
		if (aClient.id === playerId) {
			fill(5, 245, 13);
		}

		// Display names and scores together
		
		noStroke();
		textSize(17);

		fill(255);

		text(aClient.name, 20, n * 40 + 135);
		text(aClient.score, 120, n * 40 + 135);
		pop();
		n++;
	}
	pop();
}

function timer() {
	// Displays time information from server
	push();
	fill(255);
	textSize(30);
	text("Time Left: " + countDown, 100, 40);
	pop();
}
