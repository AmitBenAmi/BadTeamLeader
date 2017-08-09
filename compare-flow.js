var compare = require('./compareFaces');
var s3 = require('./aws-s3');
var facesCollection = "facesTiraNg";
var dbNames =  [];
var facesInHour = [];
var minCounter = 0;

var insertFaceIdToDb = function(data, imgName) {
        s3.updateTagForImage(imgName, data.FaceRecords[0].Face.FaceId);    
        console.log("face " + imgName + " was updated to the faces db");
};

var getNamesByIds = function(callback, matcheIds) {
        var matchNames = [];
        
        for (var matchId in matcheIds)
        {
            matchNames.push(/*Get the function from amit and chen*/);
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
    searchByImg: function(callback, snapName) {
        compare.searchFaceByImage(function(data) {
            var facesInMinute = [];
            
            for (var face in data.FaceMatches)
            {
                facesInMinute.push(face.Face.FaceID);
            }

            facesInHour[minCounter] = facesInMinute;
            minCounter = (minCounter + 60) % 60;
            this.compareFacesIds(function (matcheIds){                
                this.getNamesByIds(function(matcheNames) {               
                    
                    console("the name that is mitchapshen is " + "gabbay");
                    console("need to add sms send for each person");
                }, matcheIds);
            }); 
        });   
        
    }    
};