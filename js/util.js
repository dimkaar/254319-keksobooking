'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var mapBlock = document.querySelector('.map');
  var noticeForm = document.querySelector('.notice__form');
  var mainPin = mapBlock.querySelector('.map__pin--main');

  window.util = {
    isEscEvent: function (evt, action, nextAction) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
        nextAction();
      }
    },
    isEnterEvent: function (evt, action, nextAction) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
        nextAction();
      }
    },
    getRandomArbitrary: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    removeChilds: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    adsArray: [],
    noticeForm: noticeForm,
    mapBlock: mapBlock,
    mainPin: mainPin
  };
})();
