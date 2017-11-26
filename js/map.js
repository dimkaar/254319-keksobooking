'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
var article = document.querySelector('template').content.querySelector('article.map__card');
var adsArray = [];

var generateNumbersArray = function (number) {
  var numbersArray = [];
  for (var i = 0; i < number; i++) {
    numbersArray[i] = 1 + i;
  }
  return numbersArray;
};

var getRandomArbitrary = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var getRandomNoRepeatingItem = function (itemsArray) {
  return itemsArray.splice(Math.floor(Math.random() * itemsArray.length), 1);
};

var getRandomParameters = function (parametersArray, numberOfParameters) {
  if (numberOfParameters) {
    var objectOfRandomParameters = {};

    for (var i = 0; i < numberOfParameters; i++) {
      objectOfRandomParameters[getRandomNoRepeatingItem(parametersArray)] = null;
    }

    return objectOfRandomParameters;
  } else {
    return parametersArray[Math.floor(Math.random() * parametersArray.length)];
  }
};

var generateAds = function (numbersArray, numberOfAds) {
  for (var i = 0; i < numberOfAds; i++) {
    var locationX = getRandomArbitrary(300, 900);
    var locationY = getRandomArbitrary(118 + parseInt(buttonTemplate.querySelector('img').getAttribute('height'), 10), 500);
    adsArray[i] = {
      'author': {
        avatar: 'img/avatars/user0' + getRandomNoRepeatingItem(numbersArray) + '.png'
      },
      'offer': {
        title: getRandomNoRepeatingItem(TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomArbitrary(1000, 1000000),
        type: getRandomParameters(TYPES),
        rooms: getRandomArbitrary(1, 5),
        guests: getRandomArbitrary(1, 30),
        checkin: getRandomParameters(TIMES),
        checkout: getRandomParameters(TIMES),
        features: getRandomParameters(FEATURES, getRandomArbitrary(1, FEATURES.length)),
        description: '',
        photos: []
      },
      'location': {
        x: locationX,
        y: locationY
      }
    };
  }
};

var renderButton = function (ad) {
  var instanceOfButton = buttonTemplate.cloneNode(true);
  instanceOfButton.setAttribute('style', 'left: ' + (ad.location.x - instanceOfButton.querySelector('img').getAttribute('width') / 2) + 'px; top: ' + (ad.location.y - instanceOfButton.querySelector('img').getAttribute('height') - 18) + 'px;');
  instanceOfButton.querySelector('img').setAttribute('src', ad.author.avatar);
  return instanceOfButton;
};

var writeInAd = function (ad) {
  var instanceOfArticle = article.cloneNode(true);
  var newElement = '';
  instanceOfArticle.querySelector('h3').textContent = ad.offer.title;
  instanceOfArticle.querySelector('p>small').textContent = ad.offer.address;
  instanceOfArticle.querySelector('.popup__price').innerHTML = ad.offer.price + '&#x20bd;/ночь';
  switch (ad.offer.type) {
    case 'flat': instanceOfArticle.querySelector('h4').textContent = 'Квартира';
      break;
    case 'bungalo': instanceOfArticle.querySelector('h4').textContent = 'Бунгало';
      break;
    case 'house': instanceOfArticle.querySelector('h4').textContent = 'Дом';
      break;
    default: instanceOfArticle.querySelector('h4').textContent = 'Не указано';
      break;
  }
  instanceOfArticle.querySelectorAll('p')[2].textContent = ad.offer.rooms + ' для ' + ad.offer.guests + ' гостей';
  instanceOfArticle.querySelectorAll('p')[3].textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  for (var key in ad.offer.features) {
    if (key) {
      newElement = document.createElement('li');
      newElement.className = 'feature feature--' +
        key;
      instanceOfArticle.querySelector('.popup__features').appendChild(newElement);
    }
  }
  instanceOfArticle.querySelectorAll('p')[4].textContent = ad.offer.description;
  instanceOfArticle.querySelector('.popup__avatar').setAttribute('src', ad.author.avatar);
  return instanceOfArticle;
};

var numbersArray = generateNumbersArray(8);
generateAds(numbersArray, 8);

var mapBlock = document.querySelector('.map');
mapBlock.classList.remove('map--faded');

var fragment = document.createDocumentFragment();
for (var i = 0; i < adsArray.length; i++) {
  fragment.appendChild(renderButton(adsArray[i]));
}
var buttonsMap = document.querySelector('.map__pins');
buttonsMap.appendChild(fragment);

article = writeInAd(adsArray[0]);
console.log(article);

var insertBlock = document.querySelector('.map');
var insertBeforeBlock = document.querySelector('.map__filters-container');
insertBlock.insertBefore(article, insertBeforeBlock);
