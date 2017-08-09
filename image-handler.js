var fs = require ('fs'),
    path = require('path');
const imagesDataBaseUrl = '.Images';
const knownImageTypes = ['jpg', 'jpeg', 'png'];

module.exports = {
    readImage: function (imageName, callback) {

        fs.readFile(imagesLocation + '/' + imageName, function (err, data) {
            if (err) throw err;
            if (callback && typeof(callback) == 'function') {
                callback(data);
            }
        });
    },
    readImages: function (callback) {
        var readDirCallback = function (err, files) {
            if (err) throw err;
            if (callback && typeof(callback) == 'function') {
                for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {

                    var fileExtnsionStartIndex = files[fileIndex].lastIndexOf('.');
                    var fileExtension = files[fileIndex].substring(fileExtnsionStartIndex + 1);

                    if (knownImageTypes.includes(fileExtension.toLowerCase())) {
                        var imageData = fs.readFileSync(imagesDataBaseUrl + '\\' + files[fileIndex]);
                        callback(files[fileIndex].substring(0, fileExtnsionStartIndex), fileExtension, imageData);
                    }
                }
            }
        };

        fs.readdir(imagesDataBaseUrl, readDirCallback);
    }
};