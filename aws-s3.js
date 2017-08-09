var aws = require('aws-sdk');
var imageHandler = require('./image-handler.js');

var s3 = new aws.S3();
var bucketName = 'ChenKu';

var uploadImagesToBucket = function () {

    var specificImageCallback = function (name, extension, loadedImageData) {
        var params = {
            Bucket: bucketName,
            Key: name + '.' + extension,
            Body: loadedImageData,
            Tagging: 'name=' + name
        };

        s3.putObject(params, function (err, data) {
            if (err) {
                console.error(err);
            }
            else {
                console.info('Successfully uploaded an image of ' + name + ' to the bucket ' + bucketName);
            }
        });
    }

    imageHandler.readImages(specificImageCallback);
};

s3.createBucket({Bucket: bucketName}, uploadImagesToBucket);