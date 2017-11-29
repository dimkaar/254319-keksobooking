'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var WHITE_SPADE_HEIGHT = 18;

var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
var article = document.querySelector('template').content.querySelector('article.map__card');
var adsArray = [];

var getRandomArbitrary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generateAd = function (iterator) {
  var locationX = getRandomArbitrary(300, 900);
  var locationY = getRandomArbitrary(100, 500);
  var features = FEATURES.slice();
  features.length = getRandomArbitrary(0, FEATURES.length);
  adsArray.push({
    'author': {
      'avatar': 'img/avatars/user0' + (iterator + 1) + '.png'
    },
    'offer': {
      'title': TITLES[iterator],
      'address': '' + locationX + ', ' + locationY,
      'price': getRandomArbitrary(1000, 1000000),
      'type': TYPES[getRandomArbitrary(0, TYPES.length)],
      'rooms': getRandomArbitrary(1, 5),
      'guests': getRandomArbitrary(1, 30),
      'checkin': TIMES[getRandomArbitrary(0, TYPES.length)],
      'checkout': TIMES[getRandomArbitrary(0, TYPES.length)],
      'features': features,
      'description': '',
      'photos': []
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  });
};

var renderButton = function (elementData) {
  var instanceButton = buttonTemplate.cloneNode(true);
  instanceButton.setAttribute('style', 'left: ' + (elementData.location.x - instanceButton.querySelector('img').width / 2) + 'px; top: ' + (elementData.location.y - instanceButton.querySelector('img').height / 2 - WHITE_SPADE_HEIGHT) + 'px;');
  instanceButton.querySelector('img').src = elementData.author.avatar;
  return instanceButton;
};

var removeChilds = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderAd = function (adData) {
  var instanceOfAd = article.cloneNode(true);
  var featuresElement = instanceOfAd.querySelector('.popup__features');
  var fragment = document.createDocumentFragment();
  var houseTypeHeader = instanceOfAd.querySelector('h4');

  instanceOfAd.querySelector('h3').textContent = adData.offer.title;
  instanceOfAd.querySelector('small').textContent = adData.offer.address;
  instanceOfAd.querySelectorAll('p')[1].innerHTML = adData.offer.price + '&#x20bd;/ночь';
  switch (adData.offer.type) {
    case 'flat': houseTypeHeader.textContent = 'Квартира';
      break;
    case 'house': houseTypeHeader.textContent = 'Дом';
      break;
    case 'bungalo': houseTypeHeader.textContent = 'Бунгало';
      break;
    default: houseTypeHeader.textContent = 'Не указано';
      break;
  }
  instanceOfAd.querySelectorAll('p')[2].innerHTML = adData.offer.rooms + ' для ' + adData.offer.guests + ' гостей';
  instanceOfAd.querySelectorAll('p')[3].textContent = 'Заезд после: ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
  removeChilds(featuresElement);
  for (var i = 0; i < adData.offer.features.length; i++) {
    var newLi = document.createElement('li');
    newLi.classList = 'feature feature--' + adData.offer.features[i];
    fragment.appendChild(newLi);
  }
  featuresElement.appendChild(fragment);
  instanceOfAd.querySelector('.popup__avatar').src = adData.author.avatar;
  return instanceOfAd;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  generateAd(i);
  fragment.appendChild(renderButton(adsArray[i]));
}

var pinsMap = document.querySelector('.map__pins');
pinsMap.appendChild(fragment);

fragment = document.createDocumentFragment();
fragment.appendChild(renderAd(adsArray[0]));

var mapBlock = document.querySelector('.map');
var insertBeforeBlock = document.querySelector('.map__filter-container');
mapBlock.insertBefore(fragment, insertBeforeBlock);

mapBlock.classList.remove('map--faded');
