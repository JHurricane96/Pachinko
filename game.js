var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var container;
var player;
var stones = [];
var gameLoop;
var score = 0;
var doneState = 0;
var launched = 0;
//var initialUpwardThrust = -15.0;

function control(event) {
	//-4 is one
	//-1 is two
	//-8 is three
	//-7.09 is four
	//-6 is five
	if (event.keyCode == 32) {
		launched = 1;
		var vel = Math.floor(Math.random() * 5) + 1;
		if (vel == 1)
			player.velocity = new Vector(-4, -35);
		else if (vel == 2)
			player.velocity = new Vector(-1, -35);
		else if (vel == 3)
			player.velocity = new Vector(-8, -35);
		else if (vel == 4)
			player.velocity = new Vector(-7.09, -35);
		else
			player.velocity = new Vector(-6, -35);
		player.position.y = Screen.height - player.size - Render.lineWidth - 1;
		window.removeEventListener("keydown", control);
		doneState++;
	}
}

function initialize() {
	var evilsCount = 0, prizesCount = 0, contents = [], contentTemp;
	doneState = 0;
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
}

function update() {
	if (player.position.y <= Screen.height - player.size - Render.lineWidth + 2 && player.velocity.mag() <= 0.7143 && doneState == 1) {
		doneState = 2;
		//player.checkContainerContents(container);
		if (launched) {
			if (score < 2 && player.checkContainerContents(container) == "evil") {
				score++;
				console.log(score);
				reInitialize();
			}
			else if (score == 2 && player.checkContainerContents(container) == "prize") {
				score++;
				cleanup("You win");
			}
			else
				cleanup("You lose");
		}
	}
	if (player.position.x + player.size + Render.lineWidth/2 + Render.playerLineWidth < container.smallWalls[4].x)
		container.smallWalls[4].height = 460;
	player.checkCollisionWithContainer(container);
	stones.forEach(function (stone) {
		player.checkCollisionWithStone(stone);
	});
	//Gravity
	player.velocity.add(new Vector(0, 1));
	player.position.add(player.velocity);
}

function render() {
	context.clearRect(0, 0, Screen.width, Screen.height);
	renderContainer();
	context.strokeStyle = "black";
	context.beginPath();
	context.lineWidth = Render.playerLineWidth;
	context.arc(player.position.x, player.position.y, player.size, 0, Math.PI * 2);
	context.stroke();
	context.fillStyle = "grey";
	stones.forEach(function (stone) {
		context.beginPath();
		context.arc(stone.position.x, stone.position.y, stone.size, 0, Math.PI * 2);
		context.fill();
		context.stroke();
	});
}

function cleanup(message) {
	console.log(message);
	document.querySelector("#message p").innerHTML = message;
	document.getElementById("message").style.display = "block";
}

function mainLoop() {
	update();
	render();
}

function main() {
	initialize();
	gameLoop = setInterval(mainLoop, 17);
}

function renderContainer() {
	context.lineWidth = Render.lineWidth;
	context.strokeStyle = "rgb(100, 50, 20)";
	context.beginPath();
	context.moveTo(
		container.bigWallLeft.x,
		Screen.height - container.bigWallLeft.height
	);
	context.lineTo(
		container.bigWallLeft.x,
		Screen.height
	);
	context.stroke();
	//var xOffset = container.bigWallLeft.x - Render.lineWidth/2;
	var i;
	for (i = 0; i < 5; ++i) {
		context.beginPath();
		if (i == 0) {
			context.moveTo(
				container.bigWallLeft.x,
				Screen.height - Render.lineWidth/2
			);
		}
		else {
			context.moveTo(
				container.smallWalls[i - 1].x,
				Screen.height - Render.lineWidth/2
			);
		}
		if (container.contents[i] == "evil")
			context.strokeStyle = "red";
		else
			context.strokeStyle = "blue";
		context.lineTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth/2
		);
		context.stroke();
		context.beginPath();
		context.strokeStyle = "rgb(100, 50, 20)";
		context.moveTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth
		);
		context.lineTo(
			container.smallWalls[i].x,
			Screen.height - container.smallWalls[i].height
		);
		context.moveTo(
			container.smallWalls[i].x,
			Screen.height - Render.lineWidth/2
		);
		context.stroke();
	}
	context.beginPath();
	context.strokeStyle = "rgb(100, 50, 20)";
	context.moveTo(
		container.smallWalls[4].x,
		Screen.height - Render.lineWidth/2
	);
	context.lineTo(
		container.bigWallRight.x,
		Screen.height - Render.lineWidth/2
	);
	context.lineTo(
		container.bigWallRight.x,
		Screen.height - container.bigWallRight.height
	);
	context.stroke();
	context.beginPath();
	context.arc(
		container.roof.center.x,
		container.roof.center.y + Render.lineWidth/2,
		container.roof.radius,
		5 * Math.PI / 4,
		7 * Math.PI / 4
	);
	context.moveTo(
		container.bigWallRight.x,
		Screen.height - container.bigWallRight.height
	);
	context.stroke();
}

main();