'use strict';

window.mapModule = (function () {
  var mapModule = {};
  var init = function () {
    var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
    window.util.mapBlock.classList.add('map--faded');
    window.util.noticeForm.classList.add('notice__form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = true;
    }
  };

  mapModule.activateMap = function () {
    var pinsMap = window.util.mapBlock.querySelector('.map__pins');
    window.util.mapBlock.classList.remove('map--faded');
    pinsMap.appendChild(window.util.fragment);
  };


  mapModule.escKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, window.cardModule.removePopup, window.pinModule.removeActivePin);
  };

  window.onload = init;
  return mapModule;
})();
