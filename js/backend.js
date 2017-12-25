'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000;
  var HTTP_STATUS_CODES = {
    200: [true],
    400: [false, 'Неверный запрос'],
    401: [false, 'Необходима авторизация'],
    403: [false, 'Доступ запрещен'],
    404: [false, 'Запрашиваемые данные не найдены'],
    500: [false, 'Внутренняя ошибка сервера']
  };

  var xhrSetup = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (HTTP_STATUS_CODES[xhr.status] && HTTP_STATUS_CODES[xhr.status][0]) {
        successHandler(xhr.response);
      } else if (!HTTP_STATUS_CODES[xhr.status]) {
        errorHandler('(HTTP status code: ' + xhr.status + ')');
      } else {
        errorHandler(HTTP_STATUS_CODES[xhr.status][1]);
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
    var xhr = xhrSetup(successHandler, errorHandler);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var save = function (data, successHandler, errorHandler) {
    var xhr = xhrSetup(successHandler, errorHandler);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
