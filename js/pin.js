'use strict';

(function () {
  var WHITE_SPADE_HEIGHT = 18;
  var BUBBLE_HEIGHT = 44;
  var PIN_NUMBER_TO_RENDER = 5;
  var fragment = document.createDocumentFragment();
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var secondaryPinClickHandler = function (evt, data) {
    window.cardModule.removePopup();
    removeActivePin();
    makePinActive(evt);
    window.cardModule.showCard(data);
  };

  var makePinActive = function (evt) {
    var currentPin = evt.currentTarget;
    currentPin.classList.add('map__pin--active');
  };

  var removeActivePin = function () {
    var activePin = window.util.mapBlock.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var renderPinsFragment = function (pins) {
    for (var i = 0; i < Math.min(pins.length, PIN_NUMBER_TO_RENDER); i++) {
      fragment.appendChild(renderButton(pins[i]));
    }
  };

  var renderButton = function (elementData) {
    var instanceButton = buttonTemplate.cloneNode(true);
    instanceButton.setAttribute('style', 'left: ' + elementData.location.x + 'px; top: ' + (elementData.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
    instanceButton.querySelector('img').src = elementData.author.avatar;
    instanceButton.addEventListener('click', function (evt) {
      secondaryPinClickHandler(evt, elementData);
    });
    return instanceButton;
  };

  window.pinModule = {
    fragment: fragment,
    renderPinsFragment: renderPinsFragment
  };
})();
