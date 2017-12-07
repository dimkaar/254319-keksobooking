'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

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
    adsArray: []
  };
})();
