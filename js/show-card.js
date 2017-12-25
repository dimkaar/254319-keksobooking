'use strict';

(function () {
  var article = document.querySelector('template').content.querySelector('article.map__card');

  var showCard = function (data, onClose) {
    var removePopup = function () {
      var popup = document.querySelector('.popup');
      if (popup) {
        document.removeEventListener('keydown', escKeyDownHandler);
        popup.remove();
      }
    };

    var popupCloseClickHandler = function () {
      removePopup();
      onClose();
    };

    var popupCloseKeyDownHandler = function (evt) {
      window.util.isEnterEvent(evt, removePopup, onClose);
    };

    var escKeyDownHandler = function (evt) {
      window.util.isEscEvent(evt, removePopup, onClose);
    };

    removePopup();
    var insertBeforeBlock = document.querySelector('.map__filter-container');

    var card = renderAd(data);
    var popupClose = card.querySelector('.popup__close');
    popupClose.tabIndex = 0;
    popupClose.addEventListener('click', popupCloseClickHandler);
    popupClose.addEventListener('keydown', popupCloseKeyDownHandler);

    window.util.mapBlock.insertBefore(card, insertBeforeBlock);
    document.addEventListener('keydown', escKeyDownHandler);
  };

  var renderAd = function (ad) {
    var instanceOfAd = article.cloneNode(true);
    var fragment = document.createDocumentFragment();
    var featuresElement = instanceOfAd.querySelector('.popup__features');
    var houseTypeHeader = instanceOfAd.querySelector('h4');
    instanceOfAd.querySelector('h3').textContent = ad.offer.title;
    instanceOfAd.querySelector('small').textContent = ad.offer.address;
    instanceOfAd.querySelectorAll('p')[1].innerHTML = ad.offer.price + '&#x20bd;/ночь';
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
    instanceOfAd.querySelectorAll('p')[2].innerHTML = ad.offer.rooms + ' для ' + ad.offer.guests + ' гостей';
    instanceOfAd.querySelectorAll('p')[3].textContent = 'Заезд после: ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
    window.util.removeChilds(featuresElement);
    for (var i = 0; i < ad.offer.features.length; i++) {
      var newLi = document.createElement('li');
      newLi.classList = 'feature feature--' + ad.offer.features[i];
      fragment.appendChild(newLi);
    }
    instanceOfAd.querySelectorAll('p')[4].textContent = ad.offer.description;
    featuresElement.appendChild(fragment);
    instanceOfAd.querySelector('.popup__avatar').src = ad.author.avatar;
    return instanceOfAd;
  };

  window.cardModule = {
    showCard: showCard
  };
})();
