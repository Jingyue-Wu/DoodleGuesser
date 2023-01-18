var countDown = 30;
var newRoundTimer = 5;
var start = true;
var gameStarted = false;
var roundOver = false;
var enoughPlayers = false;
var gameInProgress = false;


// Menu screen that contains the play button. Controls when players are allowed to start or join a game
function menu() {
	if (stage == 0) {

		// Hides guessing textbox on menu screen
		input.hide();
		button.hide();

		var c = 138; //colour for button

		push();

		//display start 1
		fill(48, 132, 207);
		noStroke();
		rect(90, 0, 200, 60);
		rect(165, 0, 850, 800);

		if (mouseX > 375 && mouseX < 625 && mouseY > 350 && mouseY < 450) {
			c = 180;
		}

		strokeWeight(5);
		stroke(255);
		fill(48, c, 255);
		rect(375, 350, 250, 100, 10);

		noStroke();
		fill(255);
		textSize(40);
		text('Start', 460, 415);

		fill(255);
		textSize(70);
		text('Doodle Guesser', 270, 270);

		// Players can join after a game has started but can not join in the middle of a round
		// Player is let in once the current round is finished
		if (gameInProgress == true) {
			fill(255);
			textSize(25);
			text('Game is in progress. Please wait for the next round', 210, 540);
		}

		// Can not play the game unless two or more clients are connected to the server
		if (clientListLength == 1) {
			fill(255);
			textSize(25);
			text('You need 2 or more players to start a game!', 260, 540);
		}
		pop();
	}
	else {
		// Show textbox when not in menu
		input.show();
		button.show();
	}
}


function mouseReleased() {
	// Begin game when button is pressed if there are more than 2 clients and there is no round happening
	if (stage == 0 && mouseX > 375 && mouseX < 625 && mouseY > 350 && mouseY < 450) {
		if (gameInProgress == false && clientListLength > 1) {
			stage = 1;
			start = true;
			socket.emit('play', start);
			console.log("play");
		}
	}

	// Return to menu button for game over screen
	if (stage == 3 && mouseX > 770 && mouseX < 950 && mouseY > 480 && mouseY < 560) {
		stage = 0;
	}
}


// Transition screen between matches. Lasts 5 seconds and displays the secret word from the last match
function transitionScreen() {
	if (stage == 2) {
		start = false;

		// Display information on canvas
		push();
		fill(255);
		stroke(0);
		push();
		strokeWeight(16);
		rect(190, 70, 620, 450, 10);
		pop();
		fill(0);
		textSize(35);
		text("Next Round In: " + newRoundTimer, 385, 380);

		// Display the word
		fill(0);
		textSize(50);
		text(revealWord, 435, 280);
		pop();

		// Reset variables for the next round
		updateMouse = true;
		drawingPerms = false;
		guessingPerms = true;
		roundOver = false;
		guess = null;
		lines = [];
	}
}


// Display game over screen after all rounds have been complete
// Shows the leaderboard and who won the game
// Allows clients to return to menu and start another match
function gameOverScreen() {
	if (stage == 3) {
		// hide guessing textbox
		input.hide();
		button.hide();

		start = false;

		// Draw game over screen
		push();
		fill(48, 132, 207);
		noStroke();
		rect(0, 0, 300, 800);

		fill(48, 132, 207);
		noStroke();
		rect(165, 0, 850, 800);
		rect(90, 0, 200, 60);

		fill(255);
		textSize(58);
		text("Game Over", 335, 90);

		// Display the leaderboard in the middle of the screen
		// (Leaderbord adapted from Leader Example)
		let n = 1;

		fill(138, 138, 255);
		stroke(255);
		strokeWeight(3)
		rect(290, 140, 200, 40);
		rect(490, 140, 200, 40);

		fill(255);
		textSize(35);
		noStroke();
		text('Player', 340, 172);
		text('Score', 545, 172);

		for (const client in clients) {
			fill(138, 138, 255);
			stroke(255);
			strokeWeight(3)
			rect(290, n * 40 + 140, 200, 40);
			rect(490, n * 40 + 140, 200, 40);
			
			let aClient = clients[client];
			fill(0, 0, 255);
			if (aClient.id === playerId) {
				fill(5, 245, 13);
			}

			noStroke();
			textSize(28);
			text(aClient.name, 320, n * 40 + 168);
			text(aClient.score, 560, n * 40 + 168);
			n++
		}

		// Back to menu button
		var c = 132;
		if (mouseX > 770 && mouseX < 950 && mouseY > 480 && mouseY < 560) {
			c = 180;
		}

		strokeWeight(5);
		stroke(255);
		fill(48, c, 255);
		rect(770, 480, 180, 80, 10);

		noStroke();
		fill(255);
		textSize(35);
		text('Back', 820, 532);
		pop();

		// Reset variables for next game
		r = 0;
		g = 0;
		b = 0;
		brushThickness = 3;
	}
}


