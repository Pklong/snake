var SnakeView = require('./snake-view');

$w(function () {
  var rootEl = $w('.snake-game');
  var modal = $w('.game-over');
  new SnakeView(rootEl, modal);
});
