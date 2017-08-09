var fs = require ('fs');

module.exports = {
    readImage: function (imagesLocation, callback) {
        fs.readFile(imagesLocation + '/Amit.jpg', function (err, data) {
            if (err) throw err;
            if (callback && typeof(callback) == 'function') {
                callback(data);
            }
        });
    }
};