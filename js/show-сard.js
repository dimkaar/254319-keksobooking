'use strict';

var showCard = (function () {
  return function (evt) {
    var insertBeforeBlock = document.querySelector('.map__filter-container');
    var pinId = parseInt(evt.currentTarget.dataset.id, 10);
    if (!window.util.mapBlock.querySelector('.popup')) {
      window.util.fragment = window.cardModule.renderAd(window.util.adsArray[pinId]);
      window.util.mapBlock.insertBefore(window.util.fragment, insertBeforeBlock);
    }
  };
})();
