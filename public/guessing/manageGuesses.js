var input;
var button;
var buttons = [];
var guessingPerms = true;
var guess = null;
var correctClients = [];


// Create text box and submit button in setup
function inputs() {
    input = createInput();
    input.position(410, 550);
    button = createButton("Send");
    button.position(580, 550);
    button.mousePressed(sendGuess);
}


// Manages client's guesses
function sendGuess() {
    if (stage == 1) {
        input.show();
        if (guessingPerms == true) {
            // If client is a guesser and not a drawer,
            // Send guesses to the server to be checked
            socket.emit('message', input.value(), socket.id);
        }

        // Reset textBox
        input.value('');
    }
}


// Checks if guess was correct
function checkGuess() {
    socket.on('correct', () => {
        guess = true; // Display notification
        guessingPerms = false; // Can not guess again if correct
    });
}


// Correct notification
function displayGuess() {
    push();
    textSize(25);

    // Tells player if they have guessed the word and recieved points
    if (guess == true) {
        fill(20, 220, 30);
        text('Correct!', 280, 567);
    }
    pop();
}

// Can also use enter instead of the button to submit answers to the server
function keyPressed() {
    if (stage == 1) {
        if (keyCode === 13) {
            sendGuess();
        }
    }
}