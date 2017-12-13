'use strict';

(function () {
  window.synchronizeFields = function (firstField, secondField, firstFieldValues, secondFieldValues, syncFunction) {
    var valueIndex = firstFieldValues.indexOf(firstField.value);
    syncFunction(secondField, secondFieldValues[valueIndex]);
  };
})();

