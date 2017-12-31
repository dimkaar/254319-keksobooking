'use strict';

(function () {
  var TIMES_IN = ['12:00', '13:00', '14:00'];
  var TIMES_OUT = ['12:00', '13:00', '14:00'];
  var BUILDING_TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var MINIMAL_PRICES = ['1000', '0', '5000', '10000'];
  var ROOMS_NUMBER = ['1', '2', '3', '100'];
  var CAPACITY_VALUES = ['1', '2', '3', '0'];
  var TITLE_LENGTH = {
    MIN: 30,
    MAX: 100
  };
  var PRICE_VARIATIONS = {
    MIN: 0,
    MAX: 1000000,
    VALUE: 1000
  };
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
  var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
  var features = window.util.noticeForm.querySelector('.features').querySelectorAll('input[type=checkbox]');
  var adCapacityOptions = adCapacity.querySelectorAll('option');
  var adTimeinSelectOptions = adTimeinSelect.querySelectorAll('option');
  var adTypeSelectOptions = adTypeSelect.querySelectorAll('option');
  var adRoomNumberOptions = adRoomNumber.querySelectorAll('option');

  var activateNoticeForm = function () {
    fieldsetsUpdate(false);
    updateDefaultInputs();
    window.util.noticeForm.addEventListener('invalid', formInvalidHandler, true);
    adFormReset.addEventListener('click', resetClickHandler);
    adFormReset.addEventListener('keydown', resetKeyDownHandler);
    window.util.noticeForm.addEventListener('submit', submitHandler);
  };

  var substituteInputValue = function (input, data) {
    if (data) {
      input.value = data;
    }
  };

  var checkTitleValidity = function () {
    if (adTitleInput.validity.tooShort || adTitleInput.validity.patternMismatch || adTitleInput.validity.valueMissing) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка меньше 30 символов');
      adTitleInput.addEventListener('change', titleChangeHandler);
      return false;
    } else if (adTitleInput.validity.tooLong) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка больше 100 символов');
      adTitleInput.addEventListener('change', titleChangeHandler);
      return false;
    }
    adTitleInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
    adTitleInput.removeEventListener('change', titleChangeHandler);
    adTitleInput.setCustomValidity('');
    return true;
  };

  var checkAddressValidity = function () {
    if (adAddressInput.validity.valueMissing) {
      adAddressInput.setAttribute('style', 'border: 1px solid #ff0000');
      adAddressInput.setCustomValidity('Укажите адрес в формате: x: 000, y: 000');
      return false;
    }
    adAddressInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
    adAddressInput.setCustomValidity('');
    return true;
  };

  var checkPriceValidity = function () {
    if (adPriceInput.validity.rangeUnderflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена меньше минимальной');
      adPriceInput.addEventListener('change', priceChangeHandler);
      adPriceInput.addEventListener('blur', priceBlurHandler);
      return false;
    } else if (adPriceInput.validity.rangeOverflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена больше максимальной');
      adPriceInput.addEventListener('change', priceChangeHandler);
      adPriceInput.addEventListener('blur', priceBlurHandler);
      return false;
    } else if (adPriceInput.validity.valueMissing) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Введите цену');
      adPriceInput.addEventListener('change', priceChangeHandler);
      adPriceInput.addEventListener('blur', priceBlurHandler);
      return false;
    }
    adPriceInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
    adPriceInput.setCustomValidity('');
    adPriceInput.removeEventListener('change', priceChangeHandler);
    adPriceInput.removeEventListener('blur', priceBlurHandler);
    return true;
  };

  var resetFields = function () {
    adTitleInput.value = '';
    adTypeSelectOptions[0].selected = true;
    adTimeinSelectOptions[0].selected = true;
    adRoomNumberOptions[0].selected = true;
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    adPriceInput.value = PRICE_VARIATIONS.VALUE;
    adDescription.value = '';
    features.forEach(function (option) {
      option.checked = false;
    });
    disableOptions();
  };

  var submitForm = function (evt, errorCheck) {
    evt.preventDefault();
    if (errorCheck()) {
      window.backend.save(new FormData(window.util.noticeForm), successHandler, window.util.errorHandler);
    }
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var disableOptions = function () {
    var currentValue = adCapacity.value;
    for (var i = 0; i < adCapacityOptions.length; i++) {
      adCapacityOptions[i].disabled = true;
    }
    switch (currentValue) {
      case '0': adCapacityOptions[3].disabled = false;
        break;
      case '1': adCapacityOptions[2].disabled = false;
        break;
      case '2': adCapacityOptions[1].disabled = false;
        adCapacityOptions[2].disabled = false;
        break;
      case '3': adCapacityOptions[0].disabled = false;
        adCapacityOptions[1].disabled = false;
        adCapacityOptions[2].disabled = false;
        break;
    }
  };

  var fieldsetsUpdate = function (toggler) {
    window.util.noticeForm.classList.remove('notice__form--disabled');
    noticeFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = toggler;
    });
  };

  var updateDefaultInputs = function () {
    adTitleInput.required = true;
    adTitleInput.minLength = TITLE_LENGTH.MIN;
    adTitleInput.maxLength = TITLE_LENGTH.MAX;
    adTitleInput.pattern = '.{' + TITLE_LENGTH.MIN + ',' + TITLE_LENGTH.MAX + '}';
    adAddressInput.readOnly = true;
    adAddressInput.required = true;
    adPriceInput.required = true;
    adPriceInput.min = PRICE_VARIATIONS.MIN;
    adPriceInput.value = PRICE_VARIATIONS.VALUE;
    adPriceInput.max = PRICE_VARIATIONS.MAX;
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    disableOptions();
    adTimeinSelect.addEventListener('change', timeinChangeHandler);
    adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
    adTypeSelect.addEventListener('change', typeChangeHandler);
    adRoomNumber.addEventListener('change', roomNumberChangeHandler);
  };

  var focusField = function (evt) {
    var targetField = evt.target;
    switch (targetField) {
      case adTitleInput:
        adTitleInput.focus();
        break;
      case adAddressInput:
        adAddressInput.focus();
        break;
      case adPriceInput:
        adPriceInput.focus();
        break;
    }
  };

  var titleChangeHandler = function () {
    checkTitleValidity();
  };

  var priceChangeHandler = function () {
    checkPriceValidity();
  };

  var priceBlurHandler = function () {
    checkPriceValidity();
  };

  var timeinChangeHandler = function () {
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
  };

  var timeoutChangeHandler = function () {
    window.synchronizeFields(adTimeoutSelect, adTimeinSelect, TIMES_OUT, TIMES_IN, syncValues);
  };

  var typeChangeHandler = function () {
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
    checkPriceValidity();
  };

  var roomNumberChangeHandler = function () {
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    disableOptions();
  };

  var resetKeyDownHandler = function (evt) {
    evt.preventDefault();
    window.util.isEnterEvent(evt, resetFields);
  };

  var resetClickHandler = function (evt) {
    evt.preventDefault();
    resetFields();
  };

  var submitHandler = function (evt) {
    submitForm(evt, formInvalidHandler);
  };

  var formInvalidHandler = function (evt) {
    if (evt) {
      focusField(evt);
    }
    return checkTitleValidity() && checkAddressValidity() && checkPriceValidity();
  };

  var successHandler = function () {
    resetFields();
  };

  window.form = {
    activate: activateNoticeForm,
    fillInput: substituteInputValue,
    update: fieldsetsUpdate
  };
})();
