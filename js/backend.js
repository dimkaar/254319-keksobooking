'use strict';

(function () {
  var URL = 'https://1510.dump.academy/keksobooking';

  var xhrSetup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error = '';
      switch (xhr.status) {
        case 200: onLoad(xhr.response);
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
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Превышен интервал ожидания ' + xhr.timeout / 1000 + ' с');
    });
    xhr.timeout = 10000;
    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = xhrSetup(onLoad, onError);
    xhr.open('GET', URL + '/data');
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = xhrSetup(onLoad, onError);
    xhr.open('POST', URL);
    xhr.send();
  };

  window.backend = {
    load: load,
    save: save
  };
})();
