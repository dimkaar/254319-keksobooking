'use strict';

(function () {
  var WHITE_SPADE_HEIGHT = 18;
  var BUBBLE_HEIGHT = 44;
  var PIN_NUMBER_TO_RENDER = 5;
  var fragment = document.createDocumentFragment();
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');

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

  var renderButton = function (ad) {
    var pin = buttonTemplate.cloneNode(true);
    pin.setAttribute('style', 'left: ' + ad.location.x + 'px; top: ' + (ad.location.y - BUBBLE_HEIGHT / 2 - WHITE_SPADE_HEIGHT) + 'px;');
    pin.querySelector('img').src = ad.author.avatar;

    var secondaryPinClickHandler = function () {
      removeActivePin();
      pin.classList.add('map__pin--active');
      window.card.show(ad);
    };

    pin.addEventListener('click', secondaryPinClickHandler);
    return pin;
  };

  window.pin = {
    fragment: fragment,
    render: renderPinsFragment,
    remove: removeActivePin
  };
})();
