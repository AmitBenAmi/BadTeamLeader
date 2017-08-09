var aws = require('aws-sdk');
var imageHandler = require('./image-handler.js');
var s3 = new aws.S3();

module.exports = {
    bucketName: 'baseImages',
    screenShotsBucketName: 'screenShots',
    isBucketExist: function (bucketName, existCallback, doesntExistCallback) {
        s3.listBuckets({}, function (err, data) {
            if (err) throw err;

            var isBucketExist = false;
            for (var bucketIndex = 0; bucketIndex < data.Buckets.length; bucketIndex++) {
                if (data.Buckets[bucketIndex].Name == bucketName) {
                    isBucketExist = true;
                    break;
                }
            }

            if (!isBucketExist) {
                doesntExistCallback();
            }
            else {
                existCallback();
            }
        });        
    },
    uploadImageToBucket: function (imageName, extension, imageData, callback) {
        var imageToBucket = function () {
            var params = {
                Bucket: module.exports.screenShotsBucketName,
                Key: imageName + '.' + extension,
                Body: imageData,
                Tagging: 'name=' + imageName
            };

            s3.putObject(params, function (err, data) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.info('Successfully uploaded an image of ' + imageName + ' to the bucket ' + module.exports.bucketName);
                    if (callback && typeof(callback) == 'function') {
                        callback();
                    }
                }
            });
        };

        this.isBucketExist(module.exports.screenShotsBucketName, imageToBucket, function () {
            s3.createBucket({ Bucket: module.exports.screenShotsBucketName }, imageToBucket);
        });
    },
    uploadStaticImagesToBucket: function () {
        var uploadImagesToBucket = function () {
            var specificImageCallback = function (name, extension, loadedImageData) {
                var params = {
                    Bucket: module.exports.bucketName,
                    Key: name + '.' + extension,
                    Body: loadedImageData,
                    Tagging: 'name=' + name
                };

                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('Successfully uploaded an image of ' + name + ' to the bucket ' + module.exports.bucketName);
                    }
                });
            }

            imageHandler.readImages(specificImageCallback);
        };

        this.isBucketExist(module.exports.bucketName, uploadImagesToBucket, function () {
            s3.createBucket({ Bucket: module.exports.bucketName }, uploadImagesToBucket);
        });
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

        s3.listObjects({Bucket: module.exports.bucketName, Marker: marker}, objectListBucketCallback);
    },
    updateTagForImage : function (imageName, faceId) {
        
        var params = {
            Bucket: module.exports.bucketName,
            Key: imageName
        };
        
        s3.getObjectTagging(params, function (err, tags) {
            if (err) {
                console.error(err);
            }
            else {
                tags.TagSet.push({
                    Key: "faceId",
                    Value: faceId.toString()
                });

                params.Tagging = tags;

                s3.putObjectTagging(params, function (error, data) {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        console.info('Successfully updated a tag for faceID ' + faceId + ' to the image ' + imageName);
                    }
                });
            }
        })
       
    },
    getImageName: function (faceId, nameCallback) {
        var callbackArrayImages = function (data) {

            for (var imageIndex = 0; imageIndex < data.length; imageIndex++) {

                var params = {
                    Bucket: module.exports.bucketName,
                    Key: data[imageIndex]
                };

                s3.getObjectTagging(params, function (err, tags) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        for (var tagsIndex = 0; tagsIndex < tags.TagSet.length; tagsIndex++){
                            if (tags.TagSet[tagsIndex].Key == "faceId" && tags.TagSet[tagsIndex].Value == faceId) {
                                    nameCallback = tags.TagSet[0].Value;
                                    console.log("hi it succeed! " + nameCallback);
                                }
                        }
                    }
                })
            }
        };

        module.exports.getAllImagesFromBucket(callbackArrayImages);
    }
};

module.exports.uploadStaticImagesToBucket();