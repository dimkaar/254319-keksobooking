'use strict';

(function () {
  var WHITE_SPADE_HEIGHT = 18;
  var BUBBLE_HEIGHT = 44;
  var fragment = document.createDocumentFragment();
  var buttonTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var secondaryPinClickHandler = function (evt) {
    window.cardModule.removePopup();
    removeActivePin();
    makePinActive(evt);
    window.cardModule.showCard(evt);
    document.addEventListener('keydown', window.mapModule.escKeyDownHandler);
  };

  var successHandler = function (data) {
    window.util.adsArray = data;
    var pinNumberToRender = 8;
    for (var i = 0; i < pinNumberToRender; i++) {
      fragment.appendChild(renderButton(window.util.adsArray[i]));
    }
  };

  var makePinActive = function (evt) {
    var currentPin = evt.currentTarget;
    currentPin.classList.add('map__pin--active');
  };

  var mainPinKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, window.mapModule.activateMap, window.formModule.activateNoticeForm);
  };

  var removeActivePin = function () {
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

  window.util.mainPin.addEventListener('keydown', mainPinKeyDownHandler);
  window.backend.load(successHandler, window.util.errorHandler);

  window.pinModule = {
    fragment: fragment,
    mainPinKeyDownHandler: mainPinKeyDownHandler,
    removeActivePin: removeActivePin
  };
})();
