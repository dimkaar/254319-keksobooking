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
  var adDescription = window.util.noticeForm.querySelector('#description');
  var adFormReset = window.util.noticeForm.querySelector('.form__reset');
  var error = false;
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
    adFormReset.addEventListener('click', resetFields);
    adFormReset.addEventListener('keydown', resetFields);
    window.util.noticeForm.addEventListener('submit', submitHandler);
  };

  var substituteInputValue = function (input, data) {
    if (data) {
      input.value = data;
    }
  };

  var checkTitleValidity = function () {
    if (adTitleInput.validity.tooShort || parseInt(adTitleInput.value.length, 10) < 30 || !adTitleInput.value) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка меньше 30 символов');
      adTitleInput.addEventListener('change', changeTitleHandler);
      error = true;
    } else if (adTitleInput.validity.tooLong || parseInt(adTitleInput.value.length, 10) > 100) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка больше 100 символов');
      adTitleInput.addEventListener('change', changeTitleHandler);
      error = true;
    } else {
      adTitleInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adTitleInput.setCustomValidity('');
      adTitleInput.removeEventListener('change', changeTitleHandler);
      error = false;
    }
  };

  var checkAddressValidity = function () {
    if (adAddressInput === '' || !adAddressInput.value || adAddressInput.validity.valueMissing) {
      adAddressInput.setAttribute('style', 'border: 1px solid #ff0000');
      adAddressInput.setCustomValidity('Укажите адрес в формате: x: 000, y: 000');
      error = true;
    } else {
      adAddressInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adAddressInput.setCustomValidity('');
      error = false;
    }
  };

  var checkPriceValidity = function () {
    if (parseInt(adPriceInput.value, 10) < parseInt(adPriceInput.min, 10) || adPriceInput.validity.rangeUnderflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена меньше минимальной');
      adPriceInput.addEventListener('change', changePriceHandler);
      error = true;
    } else if (parseInt(adPriceInput.value, 10) > parseInt(adPriceInput.max, 10) || adPriceInput.validity.rangeOverflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена больше максимальной');
      adPriceInput.addEventListener('change', changePriceHandler);
      error = true;
    } else {
      adPriceInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adPriceInput.setCustomValidity('');
      adPriceInput.removeEventListener('change', changePriceHandler);
      error = false;
    }
  };

  var resetFields = function () {
    adTitleInput.value = '';
    adTypeSelect.querySelectorAll('option')[0].selected = true;
    adTimeinSelect.querySelectorAll('option')[0].selected = true;
    adRoomNumber.querySelectorAll('option')[0].selected = true;
    window.synchronizeFields(adTypeSelect, adPriceInput, fieldsValuesArrays.BUILDING_TYPES, fieldsValuesArrays.MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, fieldsValuesArrays.TIMES_IN, fieldsValuesArrays.TIMES_OUT, syncValues);
    window.synchronizeFields(adRoomNumber, adCapacity, fieldsValuesArrays.ROOMS_NUMBER, fieldsValuesArrays.CAPACITY_VALUES, syncValues);
    adPriceInput.value = adPriceInput.min;
    adDescription.value = '';
    disableOptions();
  };

  var submitForm = function (evt) {
    if (!error) {
      window.backend.save(new FormData(window.util.noticeForm), successHandler, window.util.errorHandler);
    }
    evt.preventDefault();
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var disableOptions = function () {
    var options = adCapacity.querySelectorAll('option');
    var currentValue = adCapacity.value;
    for (var i = 0; i < options.length; i++) {
      options[i].disabled = true;
    }
    switch (currentValue) {
      case '0': options[3].disabled = false;
        break;
      case '1': options[2].disabled = false;
        break;
      case '2': options[1].disabled = false;
        options[2].disabled = false;
        break;
      case '3': options[0].disabled = false;
        options[1].disabled = false;
        options[2].disabled = false;
        break;
    }
  };

  var updateDefaultInputs = function () {
    adTitleInput.required = true;
    adTitleInput.minLength = 30;
    adTitleInput.maxLength = 100;
    adTitleInput.addEventListener('invalid', checkTitleValidity);
    adAddressInput.readOnly = true;
    adAddressInput.required = true;
    adAddressInput.addEventListener('invalid', checkAddressValidity);
    adPriceInput.required = true;
    adPriceInput.min = 0;
    adPriceInput.value = 1000;
    adPriceInput.max = 1000000;
    adPriceInput.addEventListener('invalid', checkPriceValidity);
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, fieldsValuesArrays.TIMES_IN, fieldsValuesArrays.TIMES_OUT, syncValues);
    window.synchronizeFields(adTypeSelect, adPriceInput, fieldsValuesArrays.BUILDING_TYPES, fieldsValuesArrays.MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adRoomNumber, adCapacity, fieldsValuesArrays.ROOMS_NUMBER, fieldsValuesArrays.CAPACITY_VALUES, syncValues);
    disableOptions();
    substituteInputValue(adAddressInput, window.mapModule.location);
    adTimeinSelect.addEventListener('change', timeinChangeHandler);
    adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
    adTypeSelect.addEventListener('change', typeChangeHandler);
    adRoomNumber.addEventListener('change', roomNumberChangeHandler);
  };

  var changeTitleHandler = function () {
    checkTitleValidity();
  };

  var changePriceHandler = function () {
    checkPriceValidity();
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
  };

  var submitHandler = function (evt) {
    error = false;
    submitForm(evt);
  };

  var successHandler = function () {
    resetFields();
  };

  window.activateForm = activateNoticeForm;
  window.inputAddress = substituteInputValue;
})();
