var Screen = {
	"width": 1200,
	"height": 600
}

var Render = {
	"lineWidth": 20,
	"playerLineWidth": 5,
	"imgHeight": 90,
	"imgWidth": 90
}

var sprites;

function loadSprites() {
	sprites = {
		"evil1": document.getElementById("evil1"),
		"evil2": document.getElementById("evil2"),
		"evil3": document.getElementById("evil3"),
		"prize1": document.getElementById("prize1"),
		"prize2": document.getElementById("prize2")
	};
}