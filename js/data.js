'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['flat', 'house', 'bungalo'];
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var generateAd = function () {
    for (var i = 0; i < 8; i++) {
      var locationX = window.util.getRandomArbitrary(300, 900);
      var locationY = window.util.getRandomArbitrary(100, 500);
      var features = FEATURES.slice();
      features.length = window.util.getRandomArbitrary(0, FEATURES.length);
      window.util.adsArray.push({
        'author': {
          'avatar': 'img/avatars/user0' + (i + 1) + '.png'
        },
        'offer': {
          'title': TITLES[i],
          'address': '' + locationX + ', ' + locationY,
          'price': window.util.getRandomArbitrary(1000, 1000000),
          'type': TYPES[window.util.getRandomArbitrary(0, TYPES.length)],
          'rooms': window.util.getRandomArbitrary(1, 5),
          'guests': window.util.getRandomArbitrary(1, 30),
          'checkin': TIMES[window.util.getRandomArbitrary(0, TYPES.length)],
          'checkout': TIMES[window.util.getRandomArbitrary(0, TYPES.length)],
          'features': features,
          'description': '',
          'photos': []
        },
        'location': {
          'x': locationX,
          'y': locationY
        },
        'id': i
      });
    }
  };
  generateAd();
})();
