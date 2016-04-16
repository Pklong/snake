var SnakeView = require('./snake-view');

$w(function () {
  var rootEl = $w('.snake-game');
  new SnakeView(rootEl);
});
