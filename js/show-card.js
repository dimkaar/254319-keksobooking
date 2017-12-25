'use strict';

(function () {
  var article = document.querySelector('template').content.querySelector('article.map__card');

  // onClose добавляем функцию, которая будет вызвана при закрытии.
  // onClose должна заменять вызовы window.pin.*
  var showCard = function (data, onClose) {
    var removePopup = function () {
      // document.removeEventListener('keydown', escKeyDownHandler); // <-- может уже не существовать, чиним переносом
      var popup = document.querySelector('.popup');
      if (popup) {
        document.removeEventListener('keydown', escKeyDownHandler); // починили,
        popup.remove(); // посмотри потом, функция remove реализована не во всех браузерах
      }
    };

    var popupCloseClickHandler = function () {
      removePopup();
      onClose(); // onClose
    };

    var popupCloseKeyDownHandler = function (evt) {
      window.util.isEnterEvent(evt, removePopup, onClose);
    };

    var escKeyDownHandler = function (evt) {
      window.util.isEscEvent(evt, removePopup, onClose);
    };

    removePopup(); // <-- здесь удаляем popup
    var insertBeforeBlock = document.querySelector('.map__filter-container');
    // if (!window.util.mapBlock.querySelector('.popup')) { // бесполезная проверка, так как у нас выше мы удаляем блок
    // }

    var card = renderAd(data);
    var popupClose = card.querySelector('.popup__close');
    popupClose.tabIndex = 0;
    popupClose.addEventListener('click', popupCloseClickHandler);
    popupClose.addEventListener('keydown', popupCloseKeyDownHandler);

    window.util.mapBlock.insertBefore(card, insertBeforeBlock);
    document.addEventListener('keydown', escKeyDownHandler);
  };


  var renderAd = function (adData) {
    var instanceOfAd = article.cloneNode(true);
    var fragment = document.createDocumentFragment();
    var featuresElement = instanceOfAd.querySelector('.popup__features');
    var houseTypeHeader = instanceOfAd.querySelector('h4');
    instanceOfAd.querySelector('h3').textContent = adData.offer.title;
    instanceOfAd.querySelector('small').textContent = adData.offer.address;
    instanceOfAd.querySelectorAll('p')[1].innerHTML = adData.offer.price + '&#x20bd;/ночь';
    switch (adData.offer.type) {
      case 'flat': houseTypeHeader.textContent = 'Квартира';
        break;
      case 'house': houseTypeHeader.textContent = 'Дом';
        break;
      case 'bungalo': houseTypeHeader.textContent = 'Лачуга';
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

    return instanceOfAd;
  };

  window.cardModule = {
    // removePopup: removePopup, // Это нам здесь не надо, мы удаляем эту связь
    showCard: showCard
  };
})();
