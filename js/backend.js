'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000;
  var HTTP_SUCCESS_CODE = 200;
  var HTTP_ERROR_CODES = {
    400: 'Неверный запрос',
    401: 'Необходима авторизация',
    403: 'Доступ запрещен',
    404: 'Запрашиваемые данные не найдены',
    500: 'Внутренняя ошибка сервера'
  };

  var setupXHR = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_SUCCESS_CODE) {
        successHandler(xhr.response);
      } else {
        errorHandler(HTTP_ERROR_CODES[xhr.status] || 'Статус ' + xhr.status + ': ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Превышен интервал ожидания ' + xhr.timeout / 1000 + ' с');
    });
    xhr.timeout = XHR_TIMEOUT;
    return xhr;
  };

  var load = function (successHandler, errorHandler) {
    var xhr = setupXHR(successHandler, errorHandler);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var save = function (data, successHandler, errorHandler) {
    var xhr = setupXHR(successHandler, errorHandler);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
