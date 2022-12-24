var word;
var revealWord;

function words() {
	// For the selected drawing client only
	if (drawingPerms == true) {
		//displays the word from the server only to the drawer
		push();
		fill(255);
		textSize(30);
		text("You are the Drawer!", 370, 40);
		text("Word: " + word, 730, 40);
		pop();
	}
}