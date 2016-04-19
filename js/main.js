var SnakeView = require('./snake-view');

$w(function () {
  var rootEl = $w('.snake-game');
  var modal = $w('.game-over');
  var weather = $w('.weather');
  $w.myAjax({
    method: 'GET',
    url: "http://api.openweathermap.org/data/2.5/weather?q=NY,NY&appid=bcb83c4b54aee8418983c2aff3073b3b",
    success: function(weatherData) {
      var parsedWeather = JSON.parse(weatherData);
      var temp = Math.floor(parsedWeather.main.temp * 1.8 - 459.67).toString();
      var weatherDescription = parsedWeather.weather[0].description;
      weather.html(temp + ' degrees and ' + weatherDescription + '.');
      new SnakeView(rootEl, modal);
    },
    error: function() {
      weather.html('unavailable at the moment, please try later!');
      new SnakeView(rootEl, modal);
    },
  });
});
