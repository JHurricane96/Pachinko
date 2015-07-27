function Player(x) {
	this.size = 12;
	this.position = new Vector(x, Screen.height - this.size - Render.lineWidth);
	this.velocity = new Vector(0, 0);
}

Player.prototype.checkCollisionWithRoof = function (roof) {
	var dist = Vector.dist(this.position, roof.center);
	if (dist >= roof.radius - this.size - Render.lineWidth) {
		var fromRooftoPlayer = Vector.subtract(this.position, roof.center).unit();
		var velocityAlongRadius = this.velocity.dot(fromRooftoPlayer);
		var newVelocityComponent = Vector.mult(fromRooftoPlayer, -velocityAlongRadius);
		this.velocity.add(Vector.mult(newVelocityComponent, 2));
		this.position = Vector.add(roof.center, fromRooftoPlayer.mult(roof.radius - player.size - Render.lineWidth));
		//this.velocity.mult(0.95);
	}
}

Player.prototype.checkCollisionWithBigWalls = function (leftWall, rightWall) {
	if (this.position.x - this.size <= leftWall.x + Render.lineWidth/2) {
		this.velocity.x = -this.velocity.x;
		this.position.x = leftWall.x + Render.lineWidth/2 + this.size;
		this.velocity.mult(0.95);
	}
	else if (this.position.x + this.size >= rightWall.x - Render.lineWidth/2) {
		this.velocity.x = -this.velocity.x;
		this.position.x = rightWall.x - Render.lineWidth/2 - this.size;
		this.velocity.mult(0.95)
	}
}

Player.prototype.checkCollisionWithSmallWalls = function (smallWalls) {
	smallWalls.forEach(function (smallWall) {
		if (Math.abs(this.position.x - smallWall.x) <= this.size + Render.lineWidth/2 && this.position.y >= (Screen.height - smallWall.height)) {
			this.velocity.x = -this.velocity.x;
			if (this.position.x > smallWall.x)
				this.position.x = smallWall.x + Render.lineWidth/2 + this.size;
			else
				this.position.x = smallWall.x - Render.lineWidth/2 - this.size;
			this.velocity.mult(0.95);
		}
		else if (this.position.y + this.size >= Screen.height - smallWall.height && Math.abs(this.position.x - smallWall.x) <= Render.lineWidth) {
			this.position.y = Screen.height - smallWall.height - this.size;
			this.velocity.y = -this.velocity.y;
			this.velocity.mult(0.95);
		}
	}, this);
}

Player.prototype.checkCollisionWithContainer = function (container) {
	this.checkCollisionWithRoof(container.roof);
	this.checkCollisionWithBigWalls(container.bigWallLeft, container.bigWallRight)
	if (this.position.y + this.size >= Screen.height - Render.lineWidth) {
		this.position.y = Screen.height - Render.lineWidth - this.size;
		this.velocity.y = -this.velocity.y;
		this.velocity.mult(0.4);
	}
	this.checkCollisionWithSmallWalls(container.smallWalls);
}

Player.prototype.checkCollisionWithStone = function (stone) {
	var dist = Vector.dist(this.position, stone.position);
	if (dist < this.size + stone.size + Render.playerLineWidth) {
		var fromStoneToPlayer = Vector.subtract(this.position, stone.position).unit();
		var newVelocityMag = this.velocity.dot(fromStoneToPlayer);
		this.velocity.add(Vector.mult(fromStoneToPlayer, -newVelocityMag * 2));
		this.position = Vector.add(stone.position, fromStoneToPlayer.mult(this.size + stone.size + Render.playerLineWidth));
		this.velocity.mult(0.9);
	}
}

Player.prototype.checkContainerContents = function (container) {
	//console.log(Math.floor(((container.bigWallLeft.x - this.position.x) * 5/(container.bigWallLeft.x - container.bigWallRight.x)) + 0.5));
	return container.contents[Math.floor(((container.bigWallLeft.x - this.position.x) * 5/(container.bigWallLeft.x - container.bigWallRight.x)) + 0.5)];
}

function Stone(x, y, size) {
	this.position = new Vector(x, y);
	this.size = size;
}

function SmallWall(x, height) {
	this.x = x;
	this.height = height;
}

function BigWall(x, height) {
	this.x = x;
	this.height = height;
}

function Roof(x, y, radius) {
	this.center = new Vector(x, y);
	this.radius = radius;
}

function Container(contents) {
	this.bigWallLeft = new BigWall(100, 350);
	this.bigWallRight = new BigWall(1100, 350);
	this.width = 1000;
	this.smallWalls = [];
	var i;
	for (i = 0; i < 4; ++i) {
		this.smallWalls[i] = new SmallWall(100 + (i + 1) * 1000/6, 150);
	}
	this.smallWalls[4] = new SmallWall(100 + (i + 1) * 1000/6, 250);
	this.roof = new Roof(600, 750, 1000/Math.sqrt(2));
	this.contents = contents;
}