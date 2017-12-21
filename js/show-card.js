'use strict';

(function () {
  var article = document.querySelector('template').content.querySelector('article.map__card');

  var removePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  };

  var popupCloseClickHandler = function () {
    removePopup();
    window.pinModule.removeActivePin();
  };

  var showCard = function (data) {
    var insertBeforeBlock = document.querySelector('.map__filter-container');
    if (!window.util.mapBlock.querySelector('.popup')) {
      var card = renderAd(data);
      window.util.mapBlock.insertBefore(card, insertBeforeBlock);
    }
  };

  var popupCloseKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, removePopup, window.pinModule.removeActivePin);
  };

  var renderAd = function (adData) {
    var instanceOfAd = article.cloneNode(true);
    var fragment = document.createDocumentFragment();
    var featuresElement = instanceOfAd.querySelector('.popup__features');
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
    instanceOfAd.querySelectorAll('p')[4].textContent = adData.offer.description;
    featuresElement.appendChild(fragment);
    instanceOfAd.querySelector('.popup__avatar').src = adData.author.avatar;
    popupClose.tabIndex = 0;
    popupClose.addEventListener('click', popupCloseClickHandler);
    popupClose.addEventListener('keydown', popupCloseKeyDownHandler);
    return instanceOfAd;
  };

  window.cardModule = {
    removePopup: removePopup,
    showCard: showCard
  };
})();
