'use strict';

(function () {
  var article = document.querySelector('template').content.querySelector('article.map__card');
  var insertBeforeBlock = window.util.mapBlock.querySelector('.map__filter-container');

  var removePopup = function () {
    document.removeEventListener('keydown', documentKeyDownHandler);
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
  };

  var showCard = function (ad) {
    removePopup();
    var card = renderAd(ad);
    window.util.mapBlock.insertBefore(card, insertBeforeBlock);
    document.addEventListener('keydown', documentKeyDownHandler);
  };

  var renderPopupElements = function (array, parentNode, classes) {
    for (var i = 0; i < array.length; i++) {
      var newLi = document.createElement('li');
      if (classes) {
        newLi.classList = classes + array[i];
      } else {
        var picture = document.createElement('img');
        picture.src = array[i];
        picture.width = '65';
        picture.height = '45';
        picture.style.marginRight = '5px';
        newLi.appendChild(picture);
      }
      parentNode.appendChild(newLi);
    }
  };

  var renderAd = function (ad) {
    var instanceOfAd = article.cloneNode(true);
    var featuresList = instanceOfAd.querySelector('.popup__features');
    var picturesList = instanceOfAd.querySelector('.popup__pictures');
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
    instanceOfAd.querySelector('p:nth-of-type(3)').textContent = ad.offer.rooms + ' комнат для ' + ad.offer.guests + ' гостей';
    instanceOfAd.querySelector('p:nth-of-type(4)').textContent = 'Заезд после: ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    window.util.removeChilds(featuresList);
    renderPopupElements(ad.offer.features, featuresList, 'feature feature--');
    instanceOfAd.querySelector('p:nth-of-type(5)').textContent = ad.offer.description;
    instanceOfAd.querySelector('.popup__avatar').src = ad.author.avatar;
    window.util.removeChilds(picturesList);
    renderPopupElements(ad.offer.photos, picturesList);
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
