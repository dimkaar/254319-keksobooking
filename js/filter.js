'use strict';

(function () {
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var FILTER_TIMEOUT = 500;
  var filteredAds = [];
  var filtersParentNode = document.querySelector('.map__filters');
  var filters = filtersParentNode.querySelectorAll('.map__filter');

  var returnByPriceRange = function (adPrice, value) {
    switch (value) {
      case 'any': return true;
      case 'low': return adPrice < MIN_PRICE;
      case 'middle': return adPrice >= MIN_PRICE && adPrice <= MAX_PRICE;
      case 'high': return adPrice >= MAX_PRICE;
    }
    return false;
  };

  var filterByPrice = function (arrayOfAds, value) {
    return arrayOfAds.filter(function (ad) {
      return returnByPriceRange(ad.offer.price, value);
    });
  };

  var filterByValue = function (arrayOfAds, filter, value) {
    return arrayOfAds.filter(function (ad) {
      return ad.offer[filter].toString() === value || value === 'any';
    });
  };

  var filterByFeatures = function (arrayOfAds, feature) {
    return arrayOfAds.filter(function (ad) {
      return ad.offer.features.indexOf(feature) !== -1;
    });
  };

  var filtrate = function (arrayOfAds) {
    filteredAds = arrayOfAds.slice(0);
    var features = filtersParentNode.querySelectorAll('input[name="features"]:checked');

    filters.forEach(function (currentFilter) {
      if (currentFilter.value !== 'any') {
        var filterType = currentFilter.name.split('-').splice(1, 1).toString();
        filteredAds = (filterType !== 'price') ? filterByValue(filteredAds, filterType, currentFilter.value) : filterByPrice(filteredAds, currentFilter.value);
      }
    });

    features.forEach(function (currentFeature) {
      filteredAds = filterByFeatures(filteredAds, currentFeature.value);
    });
    return filteredAds;
  };

  filtersParentNode.addEventListener('change', function () {
    window.util.debounce(window.mapModule.updatePins, FILTER_TIMEOUT);
  });

  window.filterModule = {
    filtrate: filtrate
  };
})();
