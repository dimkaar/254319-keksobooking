'use strict';

(function () {
  var mapPins = window.util.mapBlock.querySelector('.map__pins');
  var MAIN_PIN_HEIGHT = 64;
  var MAIN_PIN_SPADE = 16;
  var MIN_Y = 100 - (MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE);
  var MAX_Y = 500 - (MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE);
  var MIN_X = mapPins.offsetLeft;
  var MAX_X = parseInt(getComputedStyle(mapPins).width.replace('px', ''), 10);
  var appActivated = false;

  var init = function () {
    window.form.update(true);
    window.util.mapBlock.classList.add('map--faded');
    window.util.noticeForm.classList.add('notice__form--disabled');
    window.form.fillInput(window.util.noticeForm.querySelector('#address'), ('x: ' + window.util.mainPin.offsetLeft + ', y: ' + (window.util.mainPin.offsetTop + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
  };

  var appendFragment = function (fragment) {
    mapPins.appendChild(fragment);
  };

  var activateMap = function () {
    window.util.mapBlock.classList.remove('map--faded');
    appendFragment(window.pin.fragment);
    window.form.activate();
    return true;
  };

  var updatePins = function () {
    var pinsElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pinsElements.length > 0) {
      pinsElements.forEach(function (pin) {
        mapPins.removeChild(pin);
      });
    }
    window.card.remove();
    var filteredAds = window.filter.filtrate(window.util.ads);
    window.pin.render(filteredAds);
    appendFragment(window.pin.fragment);
  };

  var mainPinMouseDownHandler = function (evt) {
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

      var currentPinCoords = {
        locationX: Math.min(Math.max(window.util.mainPin.offsetLeft - shift.x, MIN_X), MAX_X),
        locationY: Math.min(Math.max(window.util.mainPin.offsetTop - shift.y, MIN_Y), MAX_Y)
      };
      window.util.mainPin.style.top = currentPinCoords.locationY + 'px';
      window.util.mainPin.style.left = currentPinCoords.locationX + 'px';
      window.form.fillInput(window.util.noticeForm.querySelector('#address'), ('x: ' + currentPinCoords.locationX + ', y: ' + (currentPinCoords.locationY + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
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
  };

  var successHandler = function (data) {
    window.util.ads = data;
    window.pin.render(window.util.ads);
  };

  var mainPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, activateMap);
  };

  window.backend.load(successHandler, window.util.errorHandler);
  window.util.mainPin.addEventListener('keydown', mainPinKeyDownHandler);
  window.util.mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  window.onload = init;
  window.map = {
    update: updatePins
  };
})();
