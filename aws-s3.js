var aws = require('aws-sdk');
var imageHandler = require('./image-handler.js');
var s3 = new aws.S3();

module.exports = {
    bucketName: 'ChenKu',
    uploadtoBucket: function () {
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

        s3.createBucket({ Bucket: bucketName }, uploadImagesToBucket);
    },
    getAllImagesFromBucket: function (callback, marker) {

        var objectListBucketCallback = function (err, data) {
            if (err) throw err;

            if (callback && typeof(callback) == 'function') {
                if (data.IsTruncated) {
                    getAllImagesFromBucket(callback, data.NextMarker)
                }
                else {
                    var images = [];
                    for (var imageIndex = 0; imageIndex < data.Contents.length; imageIndex++) {
                        images.push(data.Contents[imageIndex].Key);
                    }
                    callback(images);
                }
            }
        };

        s3.listObjects({Bucket: bucketName, Marker: marker}, objectListBucketCallback);
    }
};