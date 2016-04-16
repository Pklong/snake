var Board = require('./snake');

var SNAKE_KEY = {
  38: "N",
  39: "E",
  37: "W",
  40: "S"
};

var View = function($el) {
  this.board = new Board(20);
  this.$el = $el;

  this.buildBoard();
  this.render();
  this.bindKeys();

  this.intervalHandler = setInterval(this.step.bind(this), 100);

};

View.prototype.bindKeys = function() {
  $w('body').on('keydown', this.handleKeyEvent.bind(this));
};

View.prototype.handleKeyEvent = function(e) {
  if (SNAKE_KEY[e.keyCode]) {
    this.board.snake.turn(SNAKE_KEY[e.keyCode]);
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

View.prototype.step = function() {
  if (this.board.snake.segments.length > 0) {
    this.board.snake.move();
    this.render();
  } else {
    this.board.lose();
    clearInterval(this.intervalHandler);
  }
};

View.prototype.updateClasses = function(coords, className) {
  this.$li.filter('.' + className).removeClass(className);

  coords.forEach(function(coord){
    var flatCoord = (coord.x * this.board.size) + coord.y;
    this.$li.eq(flatCoord).addClass(className);
  }.bind(this));
};

module.exports = View;
