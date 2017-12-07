'use strict';

var WHITE_SPADE_HEIGHT = 18;
var BUBBLE_HEIGHT = 44;

var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');
var article = document.querySelector('template').content.querySelector('article.map__card');

var renderButton = function (elementData) {
  var instanceButton = buttonTemplate.cloneNode(true);
  instanceButton.setAttribute('style', 'left: ' + elementData.location.x + 'px; top: ' + (elementData.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
  instanceButton.querySelector('img').src = elementData.author.avatar;
  instanceButton.dataset.id = elementData.id;
  instanceButton.addEventListener('click', function (evt) {
    secondaryPinClickHandler(evt);
  });
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
  var popupClose = instanceOfAd.querySelector('.popup__close');
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
  popupClose.tabIndex = 0;
  popupClose.addEventListener('click', popupCloseClickHandler);
  popupClose.addEventListener('keydown', popupCloseKeydownHandler);
  return instanceOfAd;
};

var init = function () {
  var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
  mapBlock.classList.add('map--faded');
  window.util.noticeForm.classList.add('notice__form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
};

var activateMap = function () {
  var pinsMap = mapBlock.querySelector('.map__pins');
  mapBlock.classList.remove('map--faded');
  pinsMap.appendChild(fragment);
};

var removeActivePin = function () {
  var activePin = document.querySelector('.map__pin--active');
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }
};

var makePinActive = function (evt) {
  var currentPin = evt.currentTarget;
  currentPin.classList.add('map__pin--active');
};

var showPopup = function (evt) {
  var insertBeforeBlock = document.querySelector('.map__filter-container');
  var pinId = parseInt(evt.currentTarget.dataset.id, 10);
  if (!mapBlock.querySelector('.popup')) {
    fragment = renderAd(window.util.adsArray[pinId]);
    mapBlock.insertBefore(fragment, insertBeforeBlock);
  }
};

var removePopup = function () {
  var popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
};

var mainPinMouseupHandler = function () {
  activateMap();
  window.activateForm();
};

var mainPinKeydownHandler = function (evt) {
  window.util.isEnterEvent(evt, activateMap, window.activateForm);
};

var secondaryPinClickHandler = function (evt) {
  removePopup();
  removeActivePin();
  makePinActive(evt);
  showPopup(evt);
  document.addEventListener('keydown', escKeydownHandler);
};

var popupCloseClickHandler = function () {
  removePopup();
  removeActivePin();
};

var popupCloseKeydownHandler = function (evt) {
  window.util.isEnterEvent(evt, removePopup, removeActivePin);
};

var escKeydownHandler = function (evt) {
  window.util.isEscEvent(evt, removePopup, removeActivePin);
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  fragment.appendChild(renderButton(window.util.adsArray[i]));
}

var mapBlock = document.querySelector('.map');
var mainPin = mapBlock.querySelector('.map__pin--main');

window.onload = init;
mainPin.addEventListener('mouseup', mainPinMouseupHandler);
mainPin.addEventListener('keydown', mainPinKeydownHandler);
