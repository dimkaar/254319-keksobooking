'use strict';

window.pinModule = (function () {
  var pinModule = {};
  var WHITE_SPADE_HEIGHT = 18;
  var BUBBLE_HEIGHT = 44;
  var fragment = document.createDocumentFragment();
  pinModule.fragment = fragment;
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var secondaryPinClickHandler = function (evt) {
    window.cardModule.removePopup();
    pinModule.removeActivePin();
    makePinActive(evt);
    window.showCard(evt);
    document.addEventListener('keydown', window.mapModule.escKeyDownHandler);
  };

  var makePinActive = function (evt) {
    var currentPin = evt.currentTarget;
    currentPin.classList.add('map__pin--active');
  };

  pinModule.mainPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, window.mapModule.activateMap, window.activateForm);
  };

  pinModule.removeActivePin = function () {
    var activePin = window.util.mapBlock.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var renderButton = function (elementData) {
    var instanceButton = buttonTemplate.cloneNode(true);
    instanceButton.setAttribute('style', 'left: ' + elementData.location.x + 'px; top: ' + (elementData.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
    instanceButton.querySelector('img').src = elementData.author.avatar;
    instanceButton.dataset.id = elementData.id;
    instanceButton.addEventListener('click', secondaryPinClickHandler);
    return instanceButton;
  };

  for (var i = 0; i < 8; i++) {
    pinModule.fragment.appendChild(renderButton(window.util.adsArray[i]));
  }

  window.util.mainPin.addEventListener('keydown', pinModule.mainPinKeyDownHandler);

  return pinModule;
})();
