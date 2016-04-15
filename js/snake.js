var DIRS = {
	N: new Coord(-1, 0),
	E: new Coord(0, 1),
	S: new Coord(1, 0),
	W: new Coord(0, -1)
};


var Board = function() {
  this.snake = new Snake();
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
