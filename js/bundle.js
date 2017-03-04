/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var SnakeView = __webpack_require__(1);
	
	$w(function () {
	  var rootEl = $w('.snake-game');
	  var modal = $w('.game-over');
	  new SnakeView(rootEl, modal);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	var SNAKE_KEY = {
	  //Arrow keys for direction
	  38: "N",
	  39: "E",
	  37: "W",
	  40: "S",
	};
	
	var View = function($el, $modal) {
	  this.board = new Board(20);
	  this.$el = $el;
	  this.$modal = $modal;
	
	  this.buildBoard();
	  this.render();
	  this.bindKeys();
	
	  this.inPlay = true;
	  this.intervalHandler = setInterval(this.step.bind(this), 100);
	
	};
	
	View.prototype.bindKeys = function() {
	  $w('body').on('keydown', this.handleKeyEvent.bind(this));
	};
	
	View.prototype.handleKeyEvent = function(e) {
	  if (e.keyCode > 36 && e.keyCode < 41) {
	    this.board.snake.turn(SNAKE_KEY[e.keyCode]);
	  } else if (e.keyCode === 13 && !this.inPlay) {
	    // enter to restart game
	    this.reset();
	  }
	};
	
	View.prototype.buildBoard = function() {
	  var html = '';
	  for (var i = 0, n = this.board.size; i < n; i++) {
	    html += '<ul>';
	    for (var j = 0, m = this.board.size; j < m; j++) {
	      html += '<li></li>';
	    }
	    html += '</ul>';
	  }
	  this.$el.html(html);
	  this.$li = this.$el.find('li');
	};
	
	View.prototype.render = function() {
	  this.updateClasses(this.board.snake.segments, 'snake');
	  this.updateClasses([this.board.apple.pos], 'apple');
	};
	
	View.prototype.reset = function() {
	  this.$modal.removeClass('modal');
	  this.$modal.find('div').removeClass('modal-content');
	  this.$modal.addClass('game-over');
	  this.board = new Board(20);
	  this.buildBoard();
	  this.inPlay = true;
	  this.intervalHandler = setInterval(this.step.bind(this), 100);
	};
	
	View.prototype.step = function() {
	  if (this.board.snake.segments.length > 0) {
	    this.board.snake.move();
	    this.render();
	  } else {
	    this.gameOver();
	  }
	};
	
	View.prototype.gameOver = function() {
	  clearInterval(this.intervalHandler);
	  this.inPlay = false;
	  this.$modal.removeClass('game-over');
	  this.$modal.addClass('modal');
	  this.$modal.find('div').addClass('modal-content');
	};
	
	View.prototype.updateClasses = function(coords, className) {
	  this.$li.filter('.' + className).removeClass(className);
	
	  coords.forEach(function(coord){
	    var flatCoord = (coord.x * this.board.size) + coord.y;
	    this.$li.eq(flatCoord).addClass(className);
	  }.bind(this));
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map