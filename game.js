var canvasPlayer = document.getElementById("player");
var canvasBackground = document.getElementById("background");
var replayButton = document.getElementById("replay");
var context = canvasPlayer.getContext("2d");
var cxBackground = canvasBackground.getContext("2d");
var container;
var player;
var stones = [];
var gameLoop;
var score;
var doneState;
var launched;
var prevTime;
var endGame;

function control(event) {
	if (event.keyCode == 32) {
		launched = 1;
		player.velocity = new Vector(-20, -20);
		player.position.y = Screen.height - player.size - Render.lineWidth - 1;
		window.removeEventListener("keydown", control);
		doneState++;
	}
}

function initialize() {
	var evilsCount = 0, prizesCount = 0, contents = [], contentTemp;
	doneState = 0;
	score = 0;
	doneState = 0;
	launched = 0;
	stones = [];
	endGame = "indeterminate";
	document.getElementById("message").style.display = "none";
	prevTime = Date.now();
	var i;
	for (i = 0; i < 5; ++i) {
		contentTemp = Math.floor(Math.random() * 2);
		if (contentTemp == 0) {
			if (evilsCount == 3) {
				contents[i] = "prize";
				prizesCount++;
			}
			else {
				contents[i] = "evil";
				evilsCount++;
			}
		}
		else  {
			if (prizesCount == 2) {
				contents[i] = "evil";
				evilsCount++;
			}
			else {
				contents[i] = "prize";
				prizesCount++;
			}
		}
	}
	container = new Container(contents);
	player = new Player(container.bigWallRight.x - 40);
	window.addEventListener("keydown", control);
	var playAreaLength = container.smallWalls[4].x - container.smallWalls[1].x + 1000/12;
	stones.push(new Stone(container.smallWalls[0].x - 40 - Render.lineWidth + 2*playAreaLength/5, Screen.height - 400, 30));
	stones.push(new Stone(container.smallWalls[0].x - 40 - Render.lineWidth + 4*playAreaLength/5, Screen.height - 400, 30));
	for (i = 0; i < 3; ++i)
		stones.push(new Stone(container.smallWalls[0].x - 40 - Render.lineWidth + (2*i + 1)*playAreaLength/5, Screen.height - 320, 30));
	stones.push(new Stone(container.smallWalls[0].x - 40 - Render.lineWidth + 2*playAreaLength/5, Screen.height - 240, 30));
	stones.push(new Stone(container.smallWalls[0].x - 40 - Render.lineWidth + 4*playAreaLength/5, Screen.height - 240, 30));
	loadSprites();
	renderContainer();
}

function reInitialize() {
	launched = 0;
	doneState = 0;
	var evilsCount = 0, prizesCount = 0, contents = [], contentTemp;
	var i;
	for (i = 0; i < 5; ++i) {
		contentTemp = Math.floor(Math.random() * 2);
		if (contentTemp == 0) {
			if (evilsCount == 3) {
				contents[i] = "prize";
				prizesCount++;
			}
			else {
				contents[i] = "evil";
				evilsCount++;
			}
		}
		else  {
			if (prizesCount == 2) {
				contents[i] = "evil";
				evilsCount++;
			}
			else {
				contents[i] = "prize";
				prizesCount++;
			}
		}
	}
	container = new Container(contents);
	player = new Player(container.bigWallRight.x - 40);
	window.addEventListener("keydown", control);
	renderContainer();
}

function update() {
	var newTime;
	if (player.position.y >= Screen.height - player.size - Render.lineWidth && doneState == 1 && player.velocity.y > 0) {
		doneState = 2;
		if (launched) {
			if (score < 2 && player.checkContainerContents(container) == "evil") {
				score++;
				reInitialize();
			}
			else if (score == 2 && player.checkContainerContents(container) == "prize") {
				score++;
				//cleanup("You win");
				endGame = "win";
				return;
			}
			else {
				//cleanup("You lose");
				endGame = "lose";
				return;
			}
		}
	}
	if (player.position.x + player.size + Render.lineWidth/2 + Render.playerLineWidth < container.smallWalls[4].x && container.smallWalls[4].height != 460) {
		container.smallWalls[4].height = 460;
		container.redraw = true;
	}
	player.checkCollisionWithContainer(container);
	stones.forEach(function (stone) {
		player.checkCollisionWithStone(stone);
	});
	newTime = Date.now();
	player.velocity.add(new Vector(0, 5).mult(1/(newTime - prevTime)));
	player.position.add(Vector.mult(player.velocity, 10/(newTime - prevTime)));
	prevTime = Date.now();
}

function renderContainer() {
	cxBackground.clearRect(0, 0, Screen.width, Screen.height);
	cxBackground.lineWidth = Render.lineWidth;
	cxBackground.strokeStyle = "rgb(100, 50, 20)";
	cxBackground.beginPath();
	cxBackground.moveTo(
		container.bigWallLeft.x,
		Screen.height - container.bigWallLeft.height
	);
	cxBackground.lineTo(
		container.bigWallLeft.x,
		Screen.height
	);
	//var xOffset = container.bigWallLeft.x - Render.lineWidth/2;
	var i;
	for (i = 0; i < 5; ++i) {
		if (i == 0) {
			cxBackground.moveTo(
				container.bigWallLeft.x,
				Screen.height - Render.lineWidth/2
			);
		}
		else {
			cxBackground.moveTo(
				container.smallWalls[i - 1].x,
				Screen.height - Render.lineWidth/2
			);
		}
		cxBackground.lineTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth/2
		);
		cxBackground.strokeStyle = "rgb(100, 50, 20)";
		cxBackground.moveTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth
		);
		cxBackground.lineTo(
			container.smallWalls[i].x,
			Screen.height - container.smallWalls[i].height
		);
		cxBackground.moveTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth/2
		);
	}
	cxBackground.strokeStyle = "rgb(100, 50, 20)";
	cxBackground.moveTo(
		container.smallWalls[4].x,
		Screen.height - Render.lineWidth/2
	);
	cxBackground.lineTo(
		container.bigWallRight.x,
		Screen.height - Render.lineWidth/2
	);
	cxBackground.lineTo(
		container.bigWallRight.x,
		Screen.height - container.bigWallRight.height
	);
	cxBackground.stroke();
	cxBackground.beginPath();
	cxBackground.arc(
		container.roof.center.x,
		container.roof.center.y + Render.lineWidth/2,
		container.roof.radius,
		5 * Math.PI / 4,
		7 * Math.PI / 4
	);
	cxBackground.moveTo(
		container.bigWallRight.x,
		Screen.height - container.bigWallRight.height
	);
	cxBackground.stroke();
	var evilsCount = 0;
	var prizesCount = 0;
	container.contents.forEach(function (content, i) {
		if (content == "evil") {
			cxBackground.drawImage(
				sprites["evil" + ++evilsCount],
				container.smallWalls[i].x - Render.imgWidth*1.5 + Render.lineWidth/2,
				Screen.height - Render.lineWidth - Render.imgHeight,
				Render.imgWidth,
				Render.imgHeight
			);
		}
		else if (content == "prize") {
			cxBackground.drawImage(
				sprites["prize" + ++prizesCount],
				container.smallWalls[i].x - Render.imgWidth*1.5 + Render.lineWidth/2,
				Screen.height - Render.lineWidth - Render.imgHeight,
				Render.imgWidth,
				Render.imgHeight
			);
		}
	});
	cxBackground.lineWidth = Render.playerLineWidth;
	cxBackground.strokeStyle = "black";
	cxBackground.fillStyle = "grey";
	stones.forEach(function (stone) {
		cxBackground.beginPath();
		cxBackground.arc(stone.position.x, stone.position.y, stone.size, 0, Math.PI * 2);
		cxBackground.fill();
		cxBackground.stroke();
	});
}

function render() {
	context.clearRect(0, 0, Screen.width, Screen.height);
	if (container.redraw) {
		renderContainer();
		container.redraw = false;
	}
	context.strokeStyle = "black";
	context.beginPath();
	context.lineWidth = Render.playerLineWidth;
	context.arc(player.position.x, player.position.y, player.size, 0, Math.PI * 2);
	context.stroke();
}

function cleanup(message) {
	document.querySelector("#message p").innerHTML = message;
	document.getElementById("message").style.display = "block";
}

function mainLoop() {
	if (endGame == "win") {
		cleanup("You win");
	}
	else if (endGame == "lose") {
		cleanup("You lose");
	}
	else {
		requestAnimationFrame(mainLoop);
		update();
		render();
	}
}

function main() {
	initialize();
	gameLoop = requestAnimationFrame(mainLoop);
	startTime = Date.now();
}

window.onload =  main;
replay.addEventListener("click", main);