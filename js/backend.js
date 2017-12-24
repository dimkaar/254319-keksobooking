'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';

  var xhrSetup = function (successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error = '';
      switch (xhr.status) {
        case 200: successHandler(xhr.response);
          break;
        case 400: error = 'Неверный запрос';
          break;
        case 404: error = 'Информация не найдена';
          break;
        case 500: error = 'Ошибка сервера';
          break;
        default: error = 'Неизвестный статус запроса: ' + xhr.status + ', содержимое: ' + xhr.statusText;
          break;
      }
      if (error) {
        errorHandler(error);
      }
    });
    xhr.addEventListener('error', function () {
      errorHandler('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Превышен интервал ожидания ' + xhr.timeout / 1000 + ' с');
    });
    xhr.timeout = 10000;
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
