var Apple = function (board) {
  this.board = board;
  this.replace();
};

Apple.prototype.replace = function () {
  var x = Math.floor(Math.random() * this.board.size);
  var y = Math.floor(Math.random() * this.board.size);
  while (this.board.snake.isOccupying([x, y])) {
    x = Math.floor(Math.random() * this.board.size);
    y = Math.floor(Math.random() * this.board.size);
  }

  this.pos = new Coord(x, y);
};

var Board = function(size) {
  this.size = size;
  this.snake = new Snake(this);
  this.apple = new Apple(this);
};

Board.prototype.validPosition = function(coord) {
  return (coord.x >= 0) && (coord.x < this.size) &&
         (coord.y >= 0) && (coord.y < this.size);
};

var Coord = function(x, y) {
  this.x = x;
  this.y = y;
};

Coord.prototype.isOpposite = function(pos) {
  return (this.x === (-1 * pos.x) && this.y === (-1 * pos.y));
};

Coord.prototype.plus = function(pos) {
  return new Coord(this.x + pos.x, this.y + pos.y);
};

Coord.prototype.equals = function(pos) {
  return (this.x === pos.x) && (this.y === pos.y);
};

var Snake = function(board) {
  this.direction = 'N';
  this.turning = false;
  this.board = board;

  var midPoint = Math.floor(board.size / 2);
  var center = new Coord(midPoint, midPoint);

  this.segments = [center];

  this.growTurns = 0;
};

Snake.DIRS = {
  'N': new Coord(-1, 0),
  'E': new Coord(0, 1),
  'S': new Coord(1, 0),
  'W': new Coord(0, -1)
};

Snake.GROW_TURNS = 3;

Snake.prototype.move = function() {
  this.segments.push(this.head().plus(Snake.DIRS[this.direction]));

  this.turning = false;

  if (this.eatApple()) {
    this.board.apple.replace();
  }

  if (this.growTurns > 0) {
    this.growTurns -= 1;
  } else {
    this.segments.shift();
  }

  if (!this.isValid()) {
    this.segments = [];
  }
};

Snake.prototype.turn = function(direction) {
  if (Snake.DIRS[this.direction].isOpposite(Snake.DIRS[direction]) ||
    this.turning) {
    return;
  } else {
    this.turning = true;
    this.direction = direction;
  }
};

Snake.prototype.eatApple = function() {
  if (this.head().equals(this.board.apple.pos)) {
    this.growTurns += 3;
    return true;
  } else {
    return false;
  }
};

Snake.prototype.isOccupying = function(pos) {
  var occupied = this.segments;

  for (var i = 0, n = occupied.length; i < n; i++) {
    var x = pos[0];
    var y = pos[1];

    if (x === occupied[i].x && y === occupied[0].y) {
      return true;
    }
  }
  return false;
};

Snake.prototype.head = function() {
  return this.segments[this.segments.length - 1];
};

Snake.prototype.isValid = function() {
  var head = this.head();

  if (!this.board.validPosition(this.head())) {
    return false;
  }

  for (var i = 0, n = this.segments.length - 1; i < n; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }
  return true;
};

module.exports = Board;
