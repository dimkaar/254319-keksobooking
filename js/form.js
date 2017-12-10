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

  var setPriceAndTypeDependency = function () {
    var typeValue = adTypeSelect.value;
    switch (typeValue) {
      case 'bungalo': adPriceInput.min = 0;
        break;
      case 'flat': adPriceInput.min = 1000;
        break;
      case 'house': adPriceInput.min = 5000;
        break;
      case 'palace': adPriceInput.min = 10000;
        break;
    }
  };

  var setRoomsAndCapacityDependency = function () {
    var roomValue = adRoomNumber.value;
    disableOptions();
    switch (roomValue) {
      case '1': adCapacity.value = 1;
        unblockOptions(1);
        break;
      case '2': adCapacity.value = 2;
        unblockOptions(2);
        break;
      case '3': adCapacity.value = 3;
        unblockOptions(3);
        break;
      case '100': adCapacity.value = 0;
        unblockOptions(0);
        break;
    }
  };

  var disableOptions = function () {
    var options = adCapacity.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      options[i].disabled = true;
    }
  };

  var unblockOptions = function (number) {
    var options = adCapacity.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
      if (number === 0) {
        if (parseInt(options[i].value, 10) === 0) {
          options[i].disabled = false;
        }
      } else if (options[i].value <= number) {
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
    adTimeoutSelect.value = adTimeinSelect.value;
  };

  var timeoutChangeHandler = function () {
    adTimeinSelect.value = adTimeoutSelect.value;
  };


  var typeChangeHandler = function () {
    setPriceAndTypeDependency();
  };

  var roomNumberChangeHandler = function () {
    setRoomsAndCapacityDependency();
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
    adTimeoutSelect.value = adTimeinSelect.value;
    substituteInputValue(adAddressInput, window.mapModule.location);
    setPriceAndTypeDependency();
    setRoomsAndCapacityDependency();
    adTimeinSelect.addEventListener('change', timeinChangeHandler);
    adTimeoutSelect.addEventListener('change', timeoutChangeHandler);
    adTypeSelect.addEventListener('change', typeChangeHandler);
    adRoomNumber.addEventListener('change', roomNumberChangeHandler);
    adFormSubmit.addEventListener('click', submitClickHandler);
    adFormSubmit.addEventListener('keydown', submitKeyDownHandler);
  };

  window.activateForm = activateNoticeForm;
})();
