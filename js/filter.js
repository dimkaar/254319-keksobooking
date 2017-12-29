'use strict';

(function () {
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var FILTER_TIMEOUT = 500;
  var filtersParentNode = document.querySelector('.map__filters');

  var returnByPriceRange = function (price, value) {
    switch (value) {
      case 'any':
        return true;
      case 'low':
        return price < MIN_PRICE;
      case 'middle':
        return price >= MIN_PRICE && price < MAX_PRICE;
      case 'high':
        return price >= MAX_PRICE;
      default:
        return false;
    }
  };

  filtersParentNode.addEventListener('change', function () {
    window.util.debounce(window.map.update, FILTER_TIMEOUT);
  });

  var elementSelectType = filtersParentNode.querySelector('#housing-type');
  var isValidType = function (ad) {
    var type = elementSelectType.value;
    if (type === 'any') {
      return true;
    }
    return type === ad.offer.type;
  };

  var elementSelectPrice = filtersParentNode.querySelector('#housing-price');
  var isValidPrice = function (ad) {
    var price = elementSelectPrice.value;
    return returnByPriceRange(ad.offer.price, price);
  };

  var elementSelectRoom = filtersParentNode.querySelector('#housing-rooms');
  var isValidRooms = function (ad) {
    var rooms = elementSelectRoom.value;
    if (rooms === 'any') {
      return true;
    }
    return parseInt(rooms, 10) <= ad.offer.rooms;
  };

  var elementSelectGuests = filtersParentNode.querySelector('#housing-guests');
  var isValidGuests = function (ad) {
    var guests = elementSelectGuests.value;
    if (guests === 'any') {
      return true;
    }
    return parseInt(guests, 10) <= ad.offer.guests;
  };

  var elementFeature = filtersParentNode.querySelector('#housing-features');
  var isValidFeatures = function (ad) {
    var nodeListFeatures = elementFeature.querySelectorAll('input:checked');
    return Array.prototype.every.call(nodeListFeatures, function (feature) {
      return ad.offer.features.indexOf(feature.value) > -1;
    });
  };

  var filterAll = function (ad) {
    return isValidType(ad)
      && isValidPrice(ad)
      && isValidRooms(ad)
      && isValidGuests(ad)
      && isValidFeatures(ad);
  };

  var filtrateAds = function (ads) {
    var filteredAds = ads.slice(0);
    return filteredAds.filter(filterAll);
  };

  window.filter = {
    filtrate: filtrateAds
  };
})();
