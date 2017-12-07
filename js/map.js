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
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  mapBlock.classList.add('map--faded');
  noticeForm.classList.add('notice__form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = true;
  }
};

var activateMap = function () {
  var pinsMap = mapBlock.querySelector('.map__pins');
  mapBlock.classList.remove('map--faded');
  pinsMap.appendChild(fragment);
};

var activateNoticeForm = function () {
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  noticeForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < noticeFormFieldsets.length; i++) {
    noticeFormFieldsets[i].disabled = false;
  }
  updateDefaultInputs();
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
  fragment = renderAd(window.util.adsArray[pinId]);
  mapBlock.insertBefore(fragment, insertBeforeBlock);
};

var removePopup = function () {
  var popup = document.querySelector('.popup');
  popup.remove();
};

var updateDefaultInputs = function () {
  noticeForm.action = 'https://js.dump.academy/keksobooking';
  adTitleInput.required = true;
  adTitleInput.minLength = 30;
  adTitleInput.maxLength = 100;
  adAddressInput.readOnly = true;
  adAddressInput.required = true;
  adPriceInput.required = true;
  adPriceInput.min = 0;
  adPriceInput.value = 1000;
  adPriceInput.max = 1000000;
  adTimeoutSelect.value = adTimeinSelect.value;
  substituteInputValue(adAddressInput);
  setPriceAndTypeDependency();
  setRoomsAndCapacityDependency();
  adTimeinSelect.addEventListener('change', timeinChangeHandler);
  adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
  adTypeSelect.addEventListener('change', typeChangeHandler);
  adRoomNumber.addEventListener('change', roomNumberChangeHandler);
  adFormSubmit.addEventListener('click', submitClickHandler);
  adFormSubmit.addEventListener('keydown', submitKeydownHandler);
};

var substituteInputValue = function (input, data) {
  input.value = data ? data : 'mock address';
};

var checkFormValidity = function () {
  if (adTitleInput.validity.tooShort || adTitleInput.value.length < 30 || !adTitleInput.value) {
    adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
  } else if (adTitleInput.validity.tooLong || adTitleInput.value.length > 100) {
    adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
  }
  if (adAddressInput === '' || !adAddressInput.value) {
    adAddressInput.setAttribute('style', 'border: 1px solid #ff0000');
  }
  if (adPriceInput.value < adPriceInput.min) {
    adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
    adPriceInput.border = '1px solid #ff0000';
  } else if (adPriceInput.value > adPriceInput.max) {
    adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
    adPriceInput.border = '1px solid #ff0000';
  }
};

var setPriceAndTypeDependency = function () {
  var typeValue = adTypeSelect.value;
  switch (typeValue) {
    case 'bungalo': adPriceInput.min = 0;
      break;
    case 'flat': adPriceInput.min = 1000;
      break;
    case 'house': adPriceInput.min = 5000;
      break;
    case 'palace': adPriceInput.min = 10000;
      break;
  }
};

var setRoomsAndCapacityDependency = function () {
  var roomValue = adRoomNumber.value;
  disableOptions();
  switch (roomValue) {
    case '1': adCapacity.value = 1;
      unblockOptions(1);
      break;
    case '2': adCapacity.value = 2;
      unblockOptions(2);
      break;
    case '3': adCapacity.value = 3;
      unblockOptions(3);
      break;
    case '100': adCapacity.value = 0;
      unblockOptions(0);
      break;
  }
};

var disableOptions = function () {
  var options = adCapacity.querySelectorAll('option');
  for (var i = 0; i < options.length; i++) {
    options[i].disabled = true;
  }
};

var unblockOptions = function (number) {
  var options = adCapacity.querySelectorAll('option');
  for (var i = 0; i < options.length; i++) {
    if (number === 0) {
      if (options[i].value === '0') {
        options[i].disabled = false;
      }
    } else if (options[i].value <= number) {
      if (options[i].value === '0') {
        break;
      } else {
        options[i].disabled = false;
      }
    } else if (options[i].value === '0') {
      break;
    }
  }
};

var mainPinMouseupHandler = function () {
  activateMap();
  activateNoticeForm();
};

var mainPinKeydownHandler = function (evt) {
  window.util.isEnterEvent(evt, activateMap, activateNoticeForm);
};

var secondaryPinClickHandler = function (evt) {
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

var timeinChangeHandler = function () {
  adTimeoutSelect.value = adTimeinSelect.value;
};

var timeoutChangeHandler = function () {
  adTimeinSelect.value = adTimeoutSelect.value;
};

var typeChangeHandler = function () {
  setPriceAndTypeDependency();
};

var roomNumberChangeHandler = function () {
  setRoomsAndCapacityDependency();
};

var submitClickHandler = function () {
  checkFormValidity();
};

var submitKeydownHandler = function (evt) {
  window.util.isEnterEvent(evt, checkFormValidity);
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
var noticeForm = document.querySelector('.notice__form');
var adTitleInput = noticeForm.querySelector('#title');
var adAddressInput = noticeForm.querySelector('#address');
var adPriceInput = noticeForm.querySelector('#price');
var adTimeinSelect = noticeForm.querySelector('#timein');
var adTimeoutSelect = noticeForm.querySelector('#timeout');
var adTypeSelect = noticeForm.querySelector('#type');
var adRoomNumber = noticeForm.querySelector('#room_number');
var adCapacity = noticeForm.querySelector('#capacity');
var adFormSubmit = noticeForm.querySelector('.form__submit');
window.onload = init;
mainPin.addEventListener('mouseup', mainPinMouseupHandler);
mainPin.addEventListener('keydown', mainPinKeydownHandler);
