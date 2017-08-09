var aws = require('aws-sdk');
var compare = require('./compareFaces');
var s3 = require('./aws-s3');
var facesCollection = "facesTiraNg";
var awsS3 = new aws.S3();
var dbNames =  [];
var facesInHour = [];
var minCounter = 0;

aws.config.update({region:'us-east-1'});
var insertFaceIdToDb = function(data, imgName) {
        s3.updateTagForImage(imgName, data.FaceRecords[0].Face.FaceId);    
        console.log("face " + imgName + " was updated to the faces db");
};

var getNamesByIds = function(callback, matcheIds) {
    var matchNames = [];
    
    for (var matchId in matcheIds)
    {
        matchNames.push(s3.getImageName(matchId, function(data) {
            matchNames.push(data);
        }));
    }

    callback(matchNames);
};

var compareFacesIds = function(callback) {
    var matches = [];
    var minToCheck = (60 + (minCounter - 10)) % 60; 
    if (facesInHour[minToCheck] != undefined)
    {
        for (var faceId in facesInHour[minCounter])
        {
            if ((facesInHour[minToCheck].indexOf(faceId)))
            {
                matches.push(faceId);
            }
        }

        callback(matches); 
    }

    console.log("These are the faceId that matches" + matches);     
};

module.exports = {    
    addFaceToCollection: function(imgName) {    
        dbNames.push(imgName.substr(0, imgName.length - 5));
        compare.indexFaces(function(data) {
            insertFaceIdToDb(data, imgName);
        }, facesCollection, s3.bucketName, imgName);    
        console.log("face " + imgName + " was finished being added to the faces db and collection");
    },
    searchByImg: function(snapName) {
        compare.searchFaceByImage(function(data) {
            var facesInMinute = [];
            
            for (var faceIndex in data.FaceMatches)
            {
                facesInMinute.push(data.FaceMatches[faceIndex].Face.FaceId);
            }

            facesInHour[minCounter] = facesInMinute;
            minCounter = (minCounter + 1) % 60;
            compareFacesIds(function (matcheIds){                
                getNamesByIds(function(matcheNames) {               
                    
                    console("the name that is mitchapshen is " + matcheNames[0] + "!!!!");
                    console("need to add sms send for each person");
                }, matcheIds);
            }); 
        }, snapName);   
        
    },
    insertHistoryToBucket: function() {
        var params = {
                Bucket: "faces-ids-history",
                Key: "FacesInHour",
                Body: facesInHour                
            };

        awsS3.putObject(params);
    },
    getFacesInHour : function() {
        var params = {
            Bucket: "faces-ids-history",
            Key: "FacesInHour"};
        awsS3.getObject(function(err, res){
            if (err) {console.log(err);}
            else {}
        });
    }
};



//compare.addNewCollection("facesTiraNg");
module.exports.searchByImg("screenShot.jpg");
//module.exports.addFaceToCollection("Tali Cohen.jpg");


