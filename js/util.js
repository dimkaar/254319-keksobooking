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
    removeChilds: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    errorHandler: function (message) {
      var div = document.createElement('div');
      div.classList.add('errorBlock');
      div.innerHTML = message;
      div.style.position = 'fixed';
      div.style.top = '50%';
      div.style.left = '50%';
      div.style.zIndex = '10';
      div.style.display = 'flex';
      div.style.justifyContent = 'center';
      div.style.alignItems = 'center';
      div.style.minWidth = '200px';
      div.style.minHeight = '100px';
      div.style.padding = '20px 0';
      div.style.transform = 'translate(-50%, -50%)';
      div.style.boxSizing = 'border-box';
      div.style.color = '#ff5635';
      div.style.fontSize = '24px';
      div.style.lineHeight = '32px';
      div.style.backgroundColor = '#ffffff';
      div.style.border = '3px solid #ff5635';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 10px 10px rgba(255, 86, 53, .7)';
      mapBlock.appendChild(div);
    },
    adsArray: [],
    noticeForm: noticeForm,
    mapBlock: mapBlock,
    mainPin: mainPin
  };
})();
