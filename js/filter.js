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

  var filterByPrice = function (ads, value) {
    return ads.filter(function (ad) {
      return returnByPriceRange(ad.offer.price, value);
    });
  };

  var filterByValue = function (ads, filter, value) {
    return ads.filter(function (ad) {
      return ad.offer[filter].toString() === value || value === 'any';
    });
  };

  var filterByNumberValue = function (ads, filter, value) {
    return ads.filter(function (ad) {
      return parseInt(ad.offer[filter], 10) >= value;
    });
  };

  var filterByFeatures = function (ads, feature) {
    return ads.filter(function (ad) {
      return ad.offer.features.indexOf(feature) !== -1;
    });
  };

  var filtrate = function (ads) {
    filteredAds = ads.slice(0);
    var features = filtersParentNode.querySelectorAll('input[name="features"]:checked');

    filters.forEach(function (currentFilter) {
      if (currentFilter.value !== 'any') {
        var filterType = currentFilter.name.split('-').splice(1, 1).toString();
        if (filterType !== 'price' && (filterType !== 'guests' || isNaN(parseInt(currentFilter.value, 10)))) {
          filteredAds = filterByValue(filteredAds, filterType, currentFilter.value);
        } else if (filterType === 'guests' && !isNaN(parseInt(currentFilter.value, 10))) {
          filteredAds = filterByNumberValue(filteredAds, filterType, parseInt(currentFilter.value, 10));
        } else if (filterType === 'price') {
          filteredAds = filterByPrice(filteredAds, currentFilter.value);
        }
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
