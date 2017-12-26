'use strict';

(function () {
  var article = document.querySelector('template').content.querySelector('article.map__card');

  var removePopup = function () {
    document.removeEventListener('keydown', documentKeyDownHandler);
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  };

  var showCard = function (ad) {
    removePopup();
    var insertBeforeBlock = document.querySelector('.map__filter-container');
    var card = renderAd(ad);
    window.util.mapBlock.insertBefore(card, insertBeforeBlock);
    document.addEventListener('keydown', documentKeyDownHandler);
  };

  var renderAd = function (ad) {
    var instanceOfAd = article.cloneNode(true);
    var featuresList = instanceOfAd.querySelector('.popup__features');
    var houseTypeHeader = instanceOfAd.querySelector('h4');
    var popupClose = instanceOfAd.querySelector('.popup__close');
    instanceOfAd.querySelector('h3').textContent = ad.offer.title;
    instanceOfAd.querySelector('small').textContent = ad.offer.address;
    instanceOfAd.querySelector('.popup__price').textContent = ad.offer.price + '\u20BD/ночь';
    switch (ad.offer.type) {
      case 'flat': houseTypeHeader.textContent = 'Квартира';
        break;
      case 'house': houseTypeHeader.textContent = 'Дом';
        break;
      case 'bungalo': houseTypeHeader.textContent = 'Лачуга';
        break;
      default: houseTypeHeader.textContent = 'Не указано';
        break;
    }
    instanceOfAd.querySelector('p:nth-of-type(3)').innerHTML = ad.offer.rooms + ' комнат для ' + ad.offer.guests + ' гостей';
    instanceOfAd.querySelectorAll('p:nth-of-type(4)').textContent = 'Заезд после: ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    window.util.removeChilds(featuresList);
    for (var i = 0; i < ad.offer.features.length; i++) {
      var newLi = document.createElement('li');
      newLi.classList = 'feature feature--' + ad.offer.features[i];
      featuresList.appendChild(newLi);
    }
    instanceOfAd.querySelectorAll('p:nth-of-type(5)').textContent = ad.offer.description;
    instanceOfAd.querySelector('.popup__avatar').src = ad.author.avatar;
    popupClose.tabIndex = 0;
    popupClose.addEventListener('click', popupCloseClickHandler);
    return instanceOfAd;
  };

  var documentKeyDownHandler = function (evt) {
    window.util.isEscEvent(evt, removePopup, window.pin.remove);
  };

  var popupCloseClickHandler = function () {
    removePopup();
    window.pin.remove();
  };

  window.card = {
    remove: removePopup,
    show: showCard
  };
})();
