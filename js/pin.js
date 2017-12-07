'use strict';

window.pinModule = (function () {
  var pinModule = {};
  var WHITE_SPADE_HEIGHT = 18;
  var BUBBLE_HEIGHT = 44;

  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var renderButton = function (elementData) {
    var instanceButton = buttonTemplate.cloneNode(true);
    instanceButton.setAttribute('style', 'left: ' + elementData.location.x + 'px; top: ' + (elementData.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
    instanceButton.querySelector('img').src = elementData.author.avatar;
    instanceButton.dataset.id = elementData.id;
    instanceButton.addEventListener('click', secondaryPinClickHandler);
    return instanceButton;
  };

  for (var i = 0; i < 8; i++) {
    window.util.fragment.appendChild(renderButton(window.util.adsArray[i]));
  }

  var makePinActive = function (evt) {
    var currentPin = evt.currentTarget;
    currentPin.classList.add('map__pin--active');
  };

  pinModule.mainPinMouseupHandler = function () {
    window.mapModule.activateMap();
    window.activateForm();
  };

  pinModule.mainPinKeydownHandler = function (evt) {
    window.util.isEnterEvent(evt, window.mapModule.activateMap, window.activateForm);
  };

  var secondaryPinClickHandler = function (evt) {
    window.cardModule.removePopup();
    pinModule.removeActivePin();
    makePinActive(evt);
    window.cardModule.showPopup(evt);
    document.addEventListener('keydown', window.mapModule.escKeydownHandler);
  };


  pinModule.removeActivePin = function () {
    var activePin = window.util.mapBlock.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  window.util.mainPin.addEventListener('mouseup', pinModule.mainPinMouseupHandler);
  window.util.mainPin.addEventListener('keydown', pinModule.mainPinKeydownHandler);

  return pinModule;
})();
