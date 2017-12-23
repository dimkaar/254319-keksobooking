'use strict';

(function () {
  var TIMES_IN = ['12:00', '13:00', '14:00'];
  var TIMES_OUT = ['12:00', '13:00', '14:00'];
  var BUILDING_TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var MINIMAL_PRICES = ['1000', '0', '5000', '10000'];
  var ROOMS_NUMBER = ['1', '2', '3', '100'];
  var CAPACITY_VALUES = ['1', '2', '3', '0'];
  var adTitleInput = window.util.noticeForm.querySelector('#title');
  var adAddressInput = window.util.noticeForm.querySelector('#address');
  var adPriceInput = window.util.noticeForm.querySelector('#price');
  var adTimeinSelect = window.util.noticeForm.querySelector('#timein');
  var adTimeoutSelect = window.util.noticeForm.querySelector('#timeout');
  var adTypeSelect = window.util.noticeForm.querySelector('#type');
  var adRoomNumber = window.util.noticeForm.querySelector('#room_number');
  var adCapacity = window.util.noticeForm.querySelector('#capacity');
  var adDescription = window.util.noticeForm.querySelector('#description');
  var adFormSubmit = window.util.noticeForm.querySelector('.form__submit');
  var adFormReset = window.util.noticeForm.querySelector('.form__reset');

  var activateNoticeForm = function () {
    var noticeFormFieldsets = window.util.noticeForm.querySelectorAll('fieldset');
    window.util.noticeForm.classList.remove('notice__form--disabled');
    noticeFormFieldsets.forEach(function (fieldset) {
      fieldset.disabled = false;
    });
    updateDefaultInputs();
    adFormReset.addEventListener('click', resetFields);
    adFormReset.addEventListener('keydown', resetFields);
    window.util.noticeForm.addEventListener('submit', submitHandler);
    adFormSubmit.addEventListener('click', submitHandler);
    adFormSubmit.addEventListener('keydown', submitKeyDownHandler);
  };

  var substituteInputValue = function (input, data) {
    if (data) {
      input.value = data;
    }
  };

  var checkFormValidity = function () {
    if (adTitleInput.validity.tooShort || parseInt(adTitleInput.value.length, 10) < 30 || !adTitleInput.value) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка меньше 30 символов');
      adTitleInput.addEventListener('change', checkFormValidity);
      return true;
    } else if (adTitleInput.validity.tooLong || parseInt(adTitleInput.value.length, 10) > 100) {
      adTitleInput.setAttribute('style', 'border: 1px solid #ff0000');
      adTitleInput.setCustomValidity('Длина заголовка больше 100 символов');
      adTitleInput.addEventListener('change', checkFormValidity);
      return true;
    } else if (adAddressInput === '' || !adAddressInput.value || adAddressInput.validity.valueMissing) {
      adAddressInput.setAttribute('style', 'border: 1px solid #ff0000');
      adAddressInput.setCustomValidity('Укажите адрес в формате: x: 000, y: 000');
      return true;
    } else if (parseInt(adPriceInput.value, 10) < parseInt(adPriceInput.min, 10) || adPriceInput.validity.rangeUnderflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена меньше минимальной');
      adPriceInput.addEventListener('change', checkFormValidity);
      return true;
    } else if (parseInt(adPriceInput.value, 10) > parseInt(adPriceInput.max, 10) || adPriceInput.validity.rangeOverflow) {
      adPriceInput.setAttribute('style', 'border: 1px solid #ff0000');
      adPriceInput.setCustomValidity('Цена больше максимальной');
      adPriceInput.addEventListener('change', checkFormValidity);
      return true;
    } else {
      adPriceInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adTitleInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adAddressInput.setAttribute('style', 'border: 1px solid #d9d9d3;');
      adPriceInput.removeEventListener('change', checkFormValidity);
      adTitleInput.removeEventListener('change', checkFormValidity);
      return false;
    }
  };

  var resetFields = function () {
    adTitleInput.value = '';
    adTypeSelect.querySelectorAll('option')[0].selected = true;
    adTimeinSelect.querySelectorAll('option')[0].selected = true;
    adRoomNumber.querySelectorAll('option')[0].selected = true;
    var options = window.util.noticeForm.querySelector('.features').querySelectorAll('input[type=checkbox]');
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    adPriceInput.value = adPriceInput.min;
    adDescription.value = '';
    options.forEach(function (option) {
      option.checked = false;
    });
    disableOptions();
  };

  var submitForm = function (evt, errorCheck) {
    evt.preventDefault();
    if (!errorCheck()) {
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
    adAddressInput.readOnly = true;
    adAddressInput.required = true;
    adPriceInput.required = true;
    adPriceInput.min = 0;
    adPriceInput.value = 1000;
    adPriceInput.max = 1000000;
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    disableOptions();
    substituteInputValue(adAddressInput, window.mapModule.location);
    adTimeinSelect.addEventListener('change', timeinChangeHandler);
    adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
    adTypeSelect.addEventListener('change', typeChangeHandler);
    adRoomNumber.addEventListener('change', roomNumberChangeHandler);
  };

  var timeinChangeHandler = function () {
    window.synchronizeFields(adTimeinSelect, adTimeoutSelect, TIMES_IN, TIMES_OUT, syncValues);
  };

  var timeoutChangeHandler = function () {
    window.synchronizeFields(adTimeoutSelect, adTimeinSelect, TIMES_OUT, TIMES_IN, syncValues);
  };


  var typeChangeHandler = function () {
    window.synchronizeFields(adTypeSelect, adPriceInput, BUILDING_TYPES, MINIMAL_PRICES, syncValueWithMin);
  };

  var roomNumberChangeHandler = function () {
    window.synchronizeFields(adRoomNumber, adCapacity, ROOMS_NUMBER, CAPACITY_VALUES, syncValues);
    disableOptions();
  };

  var submitKeyDownHandler = function (evt) {
    window.util.isEnterEvent(evt, submitHandler);
  };

  var submitHandler = function (evt) {
    submitForm(evt, checkFormValidity);
  };

  var successHandler = function () {
    resetFields();
  };

  window.formModule = {
    activateNoticeForm: activateNoticeForm,
    substituteInputValue: substituteInputValue
  };
})();
