'use strict';

window.cardModule = (function () {
  var cardModule = {};
  var article = document.querySelector('template').content.querySelector('article.map__card');

  cardModule.removePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  };

  cardModule.popupCloseClickHandler = function () {
    cardModule.removePopup();
    window.pinModule.removeActivePin();
  };

  cardModule.showPopup = function (evt) {
    var insertBeforeBlock = document.querySelector('.map__filter-container');
    var pinId = parseInt(evt.currentTarget.dataset.id, 10);
    if (!window.util.mapBlock.querySelector('.popup')) {
      window.util.fragment = renderAd(window.util.adsArray[pinId]);
      window.util.mapBlock.insertBefore(window.util.fragment, insertBeforeBlock);
    }
  };

  cardModule.popupCloseKeydownHandler = function (evt) {
    window.util.isEnterEvent(evt, cardModule.removePopup, window.pinModule.removeActivePin);
  };

  var renderAd = function (adData) {
    var instanceOfAd = article.cloneNode(true);
    var featuresElement = instanceOfAd.querySelector('.popup__features');
    var fragment = document.createDocumentFragment();
    var houseTypeHeader = instanceOfAd.querySelector('h4');
    var popupClose = instanceOfAd.querySelector('.popup__close');
    instanceOfAd.querySelector('h3').textContent = adData.offer.title;
    instanceOfAd.querySelector('small').textContent = adData.offer.address;
    instanceOfAd.querySelectorAll('p')[1].innerHTML = adData.offer.price + '&#x20bd;/ночь';
    switch (adData.offer.type) {
      case 'flat': houseTypeHeader.textContent = 'Квартира';
        break;
      case 'house': houseTypeHeader.textContent = 'Дом';
        break;
      case 'bungalo': houseTypeHeader.textContent = 'Бунгало';
        break;
      default: houseTypeHeader.textContent = 'Не указано';
        break;
    }
    instanceOfAd.querySelectorAll('p')[2].innerHTML = adData.offer.rooms + ' для ' + adData.offer.guests + ' гостей';
    instanceOfAd.querySelectorAll('p')[3].textContent = 'Заезд после: ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
    window.util.removeChilds(featuresElement);
    for (var i = 0; i < adData.offer.features.length; i++) {
      var newLi = document.createElement('li');
      newLi.classList = 'feature feature--' + adData.offer.features[i];
      fragment.appendChild(newLi);
    }
    featuresElement.appendChild(fragment);
    instanceOfAd.querySelector('.popup__avatar').src = adData.author.avatar;
    popupClose.tabIndex = 0;
    popupClose.addEventListener('click', cardModule.popupCloseClickHandler);
    popupClose.addEventListener('keydown', cardModule.popupCloseKeydownHandler);
    return instanceOfAd;
  };

  return cardModule;
})();
