'use strict';

(function () {
  var adTitleInput = window.util.noticeForm.querySelector('#title');
  var adAddressInput = window.util.noticeForm.querySelector('#address');
  var adPriceInput = window.util.noticeForm.querySelector('#price');
  var adTimeinSelect = window.util.noticeForm.querySelector('#timein');
  var adTimeoutSelect = window.util.noticeForm.querySelector('#timeout');
  var adTypeSelect = window.util.noticeForm.querySelector('#type');
  var adRoomNumber = window.util.noticeForm.querySelector('#room_number');
  var adCapacity = window.util.noticeForm.querySelector('#capacity');
  var adFormSubmit = window.util.noticeForm.querySelector('.form__submit');
  var fieldsValuesArrays = {
    TIMES_IN: ['12:00', '13:00', '14:00'],
    TIMES_OUT: ['12:00', '13:00', '14:00'],
    BUILDING_TYPES: ['flat', 'bungalo', 'house', 'palace'],
    MINIMAL_PRICES: ['1000', '0', '5000', '10000'],
    ROOMS_NUMBER: ['1', '2', '3', '100'],
    CAPACITY_VALUES: ['1', '2', '3', '0']
  };

  var activateNoticeForm = function () {
    var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
    window.util.noticeForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = false;
    }
    updateDefaultInputs();
  };

  var substituteInputValue = function (input, data) {
    input.value = data ? data : 'mock address';
  };

  var checkFormValidity = function () {
    if (adTitleInput.validity.tooShort || adTitleInput.value.length < 30 || !adTitleInput.value) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
    } else if (adTitleInput.validity.tooLong || adTitleInput.value.length > 100) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
    }
    if (adAddressInput === '' || !adAddressInput.value) {
      adAddressInput.setAttribute('style', 'border: 1px solid #ff0000');
    }
    if (adPriceInput.value < adPriceInput.min) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.border = '1px solid #ff0000';
    } else if (adPriceInput.value > adPriceInput.max) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.border = '1px solid #ff0000';
    }
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var disableOptions = function () {
    var options = adCapacity.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      options[i].disabled = true;
    }
  };

  var unblockOptions = function () {
    var currentValue = adCapacity.value;
    var options = adCapacity.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      if (parseInt(currentValue, 10) === 0) {
        if (parseInt(options[i].value, 10) === 0) {
          options[i].disabled = false;
        }
      } else if (options[i].value <= currentValue) {
        if (parseInt(options[i].value, 10) === 0) {
          break;
        } else {
          options[i].disabled = false;
        }
      } else if (parseInt(options[i].value, 10) === 0) {
        break;
      }
    }
  };

  var timeinChangeHandler = function () {
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, fieldsValuesArrays.TIMES_IN, fieldsValuesArrays.TIMES_OUT, syncValues);
  };

  var timeoutChangeHandler = function () {
    window.synchronizeFields(adTimeoutSelect, adTimeinSelect, fieldsValuesArrays.TIMES_OUT, fieldsValuesArrays.TIMES_IN, syncValues);
  };


  var typeChangeHandler = function () {
    window.synchronizeFields(adTypeSelect, adPriceInput, fieldsValuesArrays.BUILDING_TYPES, fieldsValuesArrays.MINIMAL_PRICES, syncValueWithMin);
  };

  var roomNumberChangeHandler = function () {
    window.synchronizeFields(adRoomNumber, adCapacity, fieldsValuesArrays.ROOMS_NUMBER, fieldsValuesArrays.CAPACITY_VALUES, syncValues);
    disableOptions();
    unblockOptions();
  };

  var submitClickHandler = function () {
    checkFormValidity();
  };

  var submitKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, checkFormValidity);
  };

  var updateDefaultInputs = function () {
    window.util.noticeForm.action = 'https://js.dump.academy/keksobooking';
    adTitleInput.required = true;
    adTitleInput.minLength = 30;
    adTitleInput.maxLength = 100;
    adAddressInput.readOnly = true;
    adAddressInput.required = true;
    adPriceInput.required = true;
    adPriceInput.min = 0;
    adPriceInput.value = 1000;
    adPriceInput.max = 1000000;
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, fieldsValuesArrays.TIMES_IN, fieldsValuesArrays.TIMES_OUT, syncValues);
    window.synchronizeFields(adTypeSelect, adPriceInput, fieldsValuesArrays.BUILDING_TYPES, fieldsValuesArrays.MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adRoomNumber, adCapacity, fieldsValuesArrays.ROOMS_NUMBER, fieldsValuesArrays.CAPACITY_VALUES, syncValues);
    disableOptions();
    unblockOptions();
    substituteInputValue(adAddressInput, window.mapModule.location);
    adTimeinSelect.addEventListener('change', timeinChangeHandler);
    adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
    adTypeSelect.addEventListener('change', typeChangeHandler);
    adRoomNumber.addEventListener('change', roomNumberChangeHandler);
    adFormSubmit.addEventListener('click', submitClickHandler);
    adFormSubmit.addEventListener('keydown', submitKeyDownHandler);
  };

  window.activateForm = activateNoticeForm;
})();
