var aws = require('aws-sdk');
var s3 = require('./aws-s3');

var rekognition = new aws.Rekognition();

module.exports = {
addNewCollection: function (collectionId) {
    var params = {
        CollectionId: collectionId.toString()
    };

    rekognition.createCollection(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);
    });       
},

indexFaces: function (callback, collectionId, bucket, name) {
    var params = {
        CollectionId: collectionId.toString(), 
        DetectionAttributes: [
    ], 
    Image: {
        S3Object: {
            Bucket: bucket, 
            Name: name
            }
        }   
    };

    rekognition.indexFaces(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        } else {
            callback(data); 
        }
    });
},

searchFaceByImage: function(callback, snapName) {
    var params = {
        CollectionId: collectionId.toString(), 
        FaceMatchThreshold: 0, 
        Image: {
            S3Object: {
                Bucket: s3.screenShotsBucketName, 
                Name: snapName
            }
        }, 
        MaxFaces: 10
    };

    rekognition.searchFacesByImage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else callback(data);           // successful response
    })}       
};