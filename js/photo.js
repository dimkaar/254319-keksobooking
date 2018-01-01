'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PHOTO_SIZES = {
    'WIDTH': 140,
    'HEIGHT': 90
  };
  var fileChoosers = window.util.noticeForm.querySelectorAll('input[type="file"]');
  var avatarPreview = window.util.noticeForm.querySelector('.notice__preview img');
  var photoPreview = window.util.noticeForm.querySelector('.form__photo-container');

  var chooserChangeListener = function (evt) {
    var file = evt.target.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (type) {
        return fileName.endsWith(type);
      });
    }

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        if (evt.target.id === 'avatar') {
          avatarPreview.src = reader.result;
        } else {
          var photo = document.createElement('img');
          photo.src = reader.result;
          photo.width = PHOTO_SIZES.WIDTH;
          photo.height = PHOTO_SIZES.HEIGHT;
          photoPreview.appendChild(photo);
        }
      });

      reader.readAsDataURL(file);
    }
  };

  fileChoosers.forEach(function (chooser) {
    chooser.accept = 'image/jpg,image/jpeg,image/png,image/gif';
    chooser.addEventListener('change', chooserChangeListener);
  });
})();
