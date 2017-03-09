
var mongoDB = require('mongodb').MongoClient;
var db;
var db2;
var connected = false;


var option = {
		  db:{
		    numberOfRetries : 5
		  },
		  server: {
		    auto_reconnect: true,
		    poolSize : 5000,
		    socketOptions: {
		        connectTimeoutMS: 5000
		    }
		  },
		  replSet: {},
		  mongos: {}
		};

exports.connect = function(URL, callback) {
    mongoDB.connect(URL, function(error, connection) {
        if(error) {
            throw new Error("Could not connect -- "+error);
        }
        console.log("You are connected");
        callback(connection);

    });
    
};

exports.connectToCollection = function(name, connection) {
    return connection.collection(name);
};


var assert = require('assert');

exports.insertIntoCollection = function(collection, data, success) {
	collection.insertOne(data, function(err, result) {
		assert.equal(err, null);
		success();
	});
};

exports.updateCollection = function(collection, searchData, data, success) {
	collection.updateOne(searchData,data, function(err, results) {
		assert.equal(err, null);
		console.log(results);
		success();
	});
};

exports.readOne = function(collection, searchData, projection, success) {
	if(collection !== null) {
		if(projection !== null) {
			collection.findOne(searchData, projection, function(err, item) {
				assert.equal(err, null);
				success(item);
		});
		}
		else {
			collection.findOne(searchData, function(err, item) {
				assert.equal(err, null);
				success(item);
			});
		}
	}
};

exports.doesExistInDb = function(collection, searchData, success, failure) {
	collection.findOne(searchData, function(err, data) {
		//console.log("exists in db print: ");
		//console.log(JSON.stringify(data));
		if(data === null) {
			failure();
		}
		else {
			success();
		}
	});
};

exports.count = function(collection, searchData, success){
	if(searchData !== null) {
		collection.count(searchData, function(err, count) {
			success(count);
		});
	}
	else {
		collection.count(function(err, count){
			success(count);
		});
	}
};

exports.read = function(collection, searchData, projection, options, success) {
	if(options !== null) {
		if(projection !== null) {
			collection.find(searchData, options).toArray(function(err, data) {
				success(data);
			});
		}
		else {
			collection.find(searchData, projection, options).toArray(function(err, data) {
				success(data);
			});
		}
	}
	else {
		if(projection !== null) {
			collection.find(searchData, projection).toArray(function(err, data) {
				success(data);
			});
		}
		else {
			collection.find(searchData).toArray(function(err, data) {
				console.log(data);
				success(data);
			});
		}
	}
};

//prince
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};