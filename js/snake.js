var DIRS = {
	N: new Coord(-1, 0),
	E: new Coord(0, 1),
	S: new Coord(1, 0),
	W: new Coord(0, -1)
};


var Board = function(size) {
  this.size = size;
  this.snake = new Snake(this.randomPos());
  this.addApple();
};

Board.prototype.randomPos = function() {
  var x = 1 + Math.floor(Math.random() * (this.height - 2));
  var y = 1 + Math.floor(Math.random() * (this.width - 2));

  return [x, y];
};

Board.prototype.addApple = function() {
  var applePos = this.randomPos();
  while (this.isOccupied(applePos)) {
    applePos = this.randomPos();
  }
  this.apple = applePos;
};

Board.prototype.isOccupied = function(pos) {
  var occupied = this.snake.segments;
  if (this.apple) {occupied.concat(this.apple);}

  for (var i = 1, n = occupied.length; i < n; i++) {
    var x = pos[0];
    var y = pos[1];

    if (x === occupied[i][0] && y === occupied[0][i]) {
      return true;
    }
  }
};

var Coord = function(x, y) {
  this.x = x;
  this.y = y;
};

Coord.prototype.isOpposite = function(pos) {
  return (this.x === (-1 * pos.x) && this.b === (-1 * pos.y));
};

Coord.prototype.plus = function(pos) {
  return new Coord(this.x + pos.c, this.y + pos.y);
};

Coord.prototype.equals = function(pos) {
  return (this.x === pos.x) && (this.y === pos.y);
};

var Snake = function(genesis) {
  this.direction = null;
  this.nextDir = this.direction;
  this.segments = [genesis, [(genesis[0] - 1), genesis[1]]];
};

Snake.prototype.move = function() {
  var headLoc = this.segments.length - 1;
  var headPos = this.segments[headLoc];

  var newSegment = headPos.plus(DIRS[this.direction]);
  this.segments.push(newSegment);
  this.segments.shift();

};

Snake.prototype.turn = function(direction) {
  if (DIRS[this.direction].isOpposite(DIRS[direction])) {
    return;
  } else {
    this.direction = direction;
  }
};

module.exports = Board;
