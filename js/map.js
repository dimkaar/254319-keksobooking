'use strict';

window.mapModule = (function () {
  var mapModule = {};
  mapModule.location = '';
  var MAIN_PIN_HEIGHT = 64;
  var MAIN_PIN_SPADE = 16;
  var pinsMap = window.util.mapBlock.querySelector('.map__pins');
  var pinsMapStyle = getComputedStyle(pinsMap);
  var minY = 100;
  var maxY = 500;
  var minX = pinsMap.offsetTop;
  var maxX = pinsMapStyle.width;
  maxX = parseInt(maxX.replace('px', ''), 10);
  var init = function () {
    var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
    window.util.mapBlock.classList.add('map--faded');
    window.util.noticeForm.classList.add('notice__form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = true;
    }
  };

  mapModule.activateMap = function (evt) {
    window.util.mapBlock.classList.remove('map--faded');
    pinsMap.appendChild(window.pinModule.fragment);
    window.inputAddress(window.util.noticeForm.querySelector('#address'), ('x: ' + evt.clientX + ', y: ' + (evt.clientY + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
  };

  mapModule.escKeyDownHandler = function (evt) {
    window.util.isEscEvent(evt, window.cardModule.removePopup, window.pinModule.removeActivePin);
  };

  mapModule.mainPinMouseDownHandler = function (evt) {
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

      if (window.util.mainPin.offsetTop - shift.y >= minY && window.util.mainPin.offsetTop - shift.y <= maxY) {
        mapModule.locationY = window.util.mainPin.offsetTop - shift.y;
        window.util.mainPin.style.top = mapModule.locationY + 'px';
      }
      if (window.util.mainPin.offsetLeft - shift.x >= minX && window.util.mainPin.offsetLeft - shift.x <= maxX) {
        mapModule.locationX = window.util.mainPin.offsetLeft - shift.x;
        window.util.mainPin.style.left = mapModule.locationX + 'px';
      }
      window.inputAddress(window.util.noticeForm.querySelector('#address'), ('x: ' + mapModule.locationX + ', y: ' + (mapModule.locationY + MAIN_PIN_HEIGHT / 2 + MAIN_PIN_SPADE)));
    };

    var mainPinMouseUpHandler = function (mouseUpEvt) {
      window.mapModule.activateMap(mouseUpEvt);
      window.activateForm();

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  };

  window.util.mainPin.addEventListener('mouseup', mapModule.mainPinMouseUpHandler);
  window.util.mainPin.addEventListener('mousedown', mapModule.mainPinMouseDownHandler);

  window.onload = init;
  return mapModule;
})();
