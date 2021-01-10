var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(60, 100, "ironman.jpg", 10, 540, "image");
    myGamePiece.gravity = 20;
    myScore = new component("30px", "Consolas", "black", 1000, 40, "text");
    myGameArea.start();
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        updateGameArea();
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}
function updateGameArea() {
    let x,y, rdheight, rdwidth, minHeight, maxHeight, minWidth, maxWidth;
    let obsPic = ["ultron11.png","ultron2.jpg","ultron3.jpg"];
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            document.getElementById("reset").style.display = 'block';
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        y = Math.floor(Math.random()* obsPic.length);
        minHeight = 20;
        maxHeight = 100;
        rdheight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minWidth = 50;
        maxWidth = 100;
        rdwidth = Math.floor(Math.random() * (maxWidth - minWidth + 1) + minWidth);
        myObstacles.push(new component(60, 100, obsPic[y], x, rdheight + rdwidth, "image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -5;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 38) { myGamePiece.speedY = -5; myGamePiece.image.src = "ironman1.jpg" }
    else myGamePiece.image.src = "ironman.jpg";
    myGamePiece.newPos();
    myGamePiece.update();

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function startgame(n) {
    if (!myGameArea.interval) { myGameArea.interval = setInterval(updateGameArea, 20); }
    myGamePiece.gravity = n;
}
var x = document.getElementById("myAudio");
function play() {
    x.play();
    document.getElementById("start").style.display = 'none';
}

function ResetGame(){
    window.location.reload();
} 