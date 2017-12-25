'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 64;
  var MAIN_PIN_SPADE = 16;
  var MIN_Y = 100 - (MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE);
  var MAX_Y = 500 - (MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE);
  var mapPins = window.util.mapBlock.querySelector('.map__pins');
  var mapPinsStyle = getComputedStyle(mapPins);
  var minX = mapPins.offsetTop;
  var maxX = parseInt(mapPinsStyle.width.replace('px', ''), 10);
  var appActivated = false;

  var init = function () {
    window.formModule.fieldsetsUpdate(true);
    window.util.mapBlock.classList.add('map--faded');
    window.util.noticeForm.classList.add('notice__form--disabled');
    window.formModule.substituteInputValue(window.util.noticeForm.querySelector('#address'), ('x: ' + window.util.mainPin.offsetLeft + ', y: ' + (window.util.mainPin.offsetTop + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
  };

  var appendFragment = function (fragment) {
    mapPins.appendChild(fragment);
  };

  var activateMap = function () {
    window.util.mapBlock.classList.remove('map--faded');
    appendFragment(window.pinModule.fragment);
    window.formModule.activateNoticeForm();
    return true;
  };

  var updatePins = function () {
    var pinsElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pinsElements.length > 0) {
      pinsElements.forEach(function (pin) {
        mapPins.removeChild(pin);
      });
    }
    window.cardModule.removePopup();
    var filteredAds = window.filterModule.filtrate(window.util.ads);
    window.pinModule.renderPinsFragment(filteredAds);
    appendFragment(window.pinModule.fragment);
  };

  var mainPinMouseDownHandler = function (evt) {
    var currentPinCoords = {};
    var startDragCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mainPinMouseMoveHandler = function (moveEvt) {
      var shift = {
        x: startDragCoords.x - moveEvt.clientX,
        y: startDragCoords.y - moveEvt.clientY
      };

      startDragCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (window.util.mainPin.offsetTop - shift.y >= MIN_Y && window.util.mainPin.offsetTop - shift.y <= MAX_Y) {
        currentPinCoords.locationY = window.util.mainPin.offsetTop - shift.y;
        window.util.mainPin.style.top = currentPinCoords.locationY + 'px';
      }
      if (window.util.mainPin.offsetLeft - shift.x >= minX && window.util.mainPin.offsetLeft - shift.x <= maxX) {
        currentPinCoords.locationX = window.util.mainPin.offsetLeft - shift.x;
        window.util.mainPin.style.left = currentPinCoords.locationX + 'px';
      }
      window.formModule.substituteInputValue(window.util.noticeForm.querySelector('#address'), ('x: ' + currentPinCoords.locationX + ', y: ' + (currentPinCoords.locationY + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
    };

    var mainPinMouseUpHandler = function (mouseUpEvt) {
      if (!appActivated) {
        appActivated = activateMap(mouseUpEvt);
      }

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
    window.util.mainPin.addEventListener('keydown', mainPinKeyDownHandler);
    window.util.mainPin.addEventListener('mouseup', mainPinMouseUpHandler);
  };

  var successHandler = function (data) {
    window.util.ads = data;
    window.pinModule.renderPinsFragment(window.util.ads);
  };

  var mainPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, activateMap, window.formModule.activateNoticeForm);
  };

  window.backend.load(successHandler, window.util.errorHandler);
  window.util.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  window.onload = init;
  window.mapModule = {
    updatePins: updatePins
  };
})();
