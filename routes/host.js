
var ejs = require("ejs");
var mysql = require('./mysql');
var mongodb = require('mongodb');
var mongo = require("./mongo");
var fs = require('fs');
var http = require('http');
var util = require('util');
// var fs=require("file-system");

var mongoURL_video = "mongodb://localhost:27017/video";
var mongoURL_picture = "mongodb://localhost:27017/picture";

var FormData = require('form-data');

var no_of_images = -1;
var _this = this;

exports.redirectToHostListings = function(req, res) {
	// console.log("prince1");
	console.log("req.session.status is" + req.session.status);
	if (req.session.user_id && req.session.status == 2) {
	// console.log("prince2");
	res.render('hostlistings');
	} else if (req.session.user_id) {
	// console.log("prince3");
	// res.render('home');
	res.redirect('/home');

	} else {
	// console.log("prince4");
	// res.render('landing');
	res.redirect('/');
	}

};

exports.redirectToCreateNewListing = function(req, res) {
	// READ username from session and pass to frontend

	if (req.session.user_id && req.session.status == 2) {
	res.render("addnewlisting", {
	fname : req.session.fname,
	lname : req.session.lname
	});
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.redirectToHostIntroVideo = function(req, res) {
	if (req.session.user_id && req.session.status == 2) {
	res.render('hostintro');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.redirectToHostReservations = function(req, res) {
	if (req.session.user_id && req.session.status == 2) {
	res.render('hostreservations');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.redirectToHostRequests = function(req, res) {

	if (req.session.user_id && req.session.status == 2) {
	res.render('hostrequests');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.completedreservations = function(req, res) {
	if (req.session.user_id && req.session.status == 2) {
	res.render('completedreservations');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.inbox = function(req, res) {
	if (req.session.user_id && req.session.status == 2) {
	res.render('inbox');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.hostaccount = function(req, res) {
	if (req.session.user_id && req.session.status == 2) {
	res.render('hostaccount');
	} else if (req.session.user_id) {
	res.redirect('/home');
	} else {
	res.redirect('/');
	}

};

exports.submitnewlisitng = function(req, res) {
	console.log("inside submitnewlisting");

	var hostid, title, category, desc, guests, rooms, beds, street, apt, city, state, zip, lats, longs, from_date, to_date, price, wprice, mprice, isbiddable, bidstart, bidend;
	var mydefault = 0;
	var noofdays = 4;
	hostid = req.session.user_id; // read from the session host id

	no_of_images = req.param("noofimages");
	console.log("no_of_images is " + no_of_images);

	title = req.param("title");
	category = req.param("category");
	desc = req.param("desc");
	guests = req.param("guests");
	rooms = req.param("rooms");
	beds = req.param("beds");
	street = req.param("street");
	apt = req.param("apt");

	city = req.param("city");
	state = req.param("state");
	zip = req.param("zip");

	lats = req.param("lats");
	longs = req.param("longs");
	// lats = 0;
	// longs = 0;

	from_date = req.param("from_date");
	to_date = req.param("to_date");
	price = req.param("price");
	wprice = req.param("weekprice");
	mprice = req.param("monthprice");
	isbiddable = req.param("isbiddable");
	/*
	 * if (isbiddable == 0) { bidstart = 0; bidend = 0; } else { // bidstart=0; //
	 * bidend=0; }
	 */

	console
	.log("creating a new listing and storing it into the listings table");
	var getUser = "INSERT INTO listings (`host_id`, `title`, `desc`, `category`, `guests`, `rooms`, `beds`, `street`, `apt`, `city`, `state`, `zip`, `lat`, `long`, `fromdate`, `todate`, `price`, `weekprice`, `monthprice`, `IsBiddable`, `bidstart`, `bidend`, `IsDeleted`, `noofimages` ) VALUES ('"
	+ hostid
	+ "','"
	+ title
	+ "', '"
	+ desc
	+ "', '"
	+ category
	+ "', '"
	+ guests
	+ "', '"
	+ rooms
	+ "', '"
	+ beds
	+ "', '"
	+ street
	+ "', '"
	+ apt
	+ "', '"
	+ city
	+ "', '"
	+ state
	+ "', '"
	+ zip
	+ "', '"
	+ lats
	+ "', '"
	+ longs
	+ "', '"
	+ from_date
	+ "', '"
	+ to_date
	+ "', '"
	+ price
	+ "', '"
	+ wprice
	+ "', '"
	+ mprice
	+ "', '"
	+ isbiddable
	+ "', now(), DATE_ADD(now(), INTERVAL '"
	+ noofdays
	+ "' DAY), '"
	+ mydefault + "', " + no_of_images + ");"

	// "'"+semail+"', '"+ptype+"', now(), DATE_ADD(now(), INTERVAL
	// '"+noofdays+"' DAY));"

	console.log("Query is:" + getUser);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	var getPropId = "select prop_id as prop_id from listings where host_id = '"
	+ hostid + "' and title = '" + title + "'";
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	console
	.log("data successfully inserted into listings table");
	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"prop_id" : results[0].prop_id
	};

	res.send(json_responses);
	}
	}, getPropId);
	}
	}, getUser);

};

exports.getmylistings = function(req, res) {

	var hardcoded = req.session.user_id;

	var results_length;
	console
	.log("reading all the listings from the listings table in the database");

	var getUser = " select * from listings where host_id = '" + hardcoded
	+ "' and isDeleted!= '1'";
	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"listings_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};

exports.deletelisting = function(req, res) {

	listingID = req.param("listing-id");
	var deleted = 1;
	// var getUser = "DELETE FROM listings WHERE `prop_id`='" + listingID + "'";
	var getUser = "UPDATE listings SET `isDeleted`='" + deleted
	+ "' WHERE `prop_id`='" + listingID + "';";
	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	console.log("item removed from the cart")
	var json_responses;
	// json_responses = {"itemsInCart": req.session.currentcart};
	json_responses = {
	"statusCode" : 300
	};
	res.send(json_responses);
	console.log("pushed 300 to client");
	}
	}, getUser);

};

exports.uploadintrovdeo = function(req, res) {

	console.log("Got video upload req");
	console.log("req.files.video.path is " + req.files.video.path);

	// upload to mongo
	mongodb.MongoClient
	.connect(
	'mongodb://localhost:27017/video',
	function(error, db) {
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'videos'
	});
	fs
	.createReadStream(req.files.video.path)
	.pipe(
	bucket
	.openUploadStream(req.session.user_id
	+ '.mp4'))
	.on(
	'error',
	function(error) {
	if (error) {
	res
	.send({
	"status" : 500,
	"errmsg" : "Error: Cannot upload video: "
	+ error
	});
	}
	})
	.on(
	'finish',
	function() {
	console.log('done uploading!');
	res
	.send({
	"status" : 200,
	"message" : "Video uploaded successfully for farmer with puid: prince"
	});
	});
	});
};

exports.uploadptyimages = function(req, res) {
	var flag = 0; // check the value of this flag and then chose response sent
	// to front end
	console.log("inside uploadptyimages");
	console.log("no_of_images is " + no_of_images);
	// var reqData= req.param("reqData");
	// var datalength= req.param("datalength");
	// console.log("datalength is " + datalength);
	console.log(req.url);
	var prop_id = req.url
	prop_id = prop_id.substring(17, 26);
	console.log(prop_id);

	mongodb.MongoClient
	.connect(
	'mongodb://localhost:27017/picture',
	function(error, db) {

	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});

	if (req.files.image0 != undefined) {
	fs.createReadStream(req.files.image0.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_0.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image1 != undefined) {
	fs.createReadStream(req.files.image1.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_1.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});

	}

	if (req.files.image2 != undefined) {
	fs.createReadStream(req.files.image2.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_2.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image3 != undefined) {
	fs.createReadStream(req.files.image3.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_3.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image4 != undefined) {
	fs.createReadStream(req.files.image4.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_4.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image5 != undefined) {
	fs.createReadStream(req.files.image5.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_5.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image6 != undefined) {
	fs.createReadStream(req.files.image6.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_6.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image7 != undefined) {
	fs.createReadStream(req.files.image7.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_7.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image8 != undefined) {
	fs.createReadStream(req.files.image8.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_8.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image9 != undefined) {
	fs.createReadStream(req.files.image9.path)
	.pipe(
	bucket.openUploadStream(prop_id
	+ '_9.png')).on('error',
	function(error) {
	if (error) {

	}
	}).on('finish', function() {
	console.log('done uploading!');

	});
	}

	if (req.files.image10 != undefined) {
	fs.createReadStream(req.files.image10.path).pipe(
	bucket
	.openUploadStream(prop_id
	+ '_10.png')).on('error',
	function(error) {
	if (error) {
	/*
	 * res.send({ "status" : 500,
	 * "errmsg" : "Error: Cannot upload
	 * video: " + error });
	 */
	}
	}).on('finish', function() {
	console.log('done uploading!');
	/*
	 * res.send({ "status" : 200, "message" : "Video
	 * uploaded successfully for farmer with puid:
	 * prince" });
	 */
	});
	}

	if (req.files.image11 != undefined) {
	fs.createReadStream(req.files.image11.path).pipe(
	bucket
	.openUploadStream(prop_id
	+ '_11.png')).on('error',
	function(error) {
	if (error) {
	/*
	 * res.send({ "status" : 500,
	 * "errmsg" : "Error: Cannot upload
	 * video: " + error });
	 */
	}
	}).on('finish', function() {
	console.log('done uploading!');
	/*
	 * res.send({ "status" : 200, "message" : "Video
	 * uploaded successfully for farmer with puid:
	 * prince" });
	 */
	});
	}

	if (req.files.image12 != undefined) {
	fs.createReadStream(req.files.image12.path).pipe(
	bucket
	.openUploadStream(prop_id
	+ '_12.png')).on('error',
	function(error) {
	if (error) {
	/*
	 * res.send({ "status" : 500,
	 * "errmsg" : "Error: Cannot upload
	 * video: " + error });
	 */
	}
	}).on('finish', function() {
	console.log('done uploading!');
	/*
	 * res.send({ "status" : 200, "message" : "Video
	 * uploaded successfully for farmer with puid:
	 * prince" });
	 */
	});
	}

	if (req.files.image13 != undefined) {
	fs.createReadStream(req.files.image13.path).pipe(
	bucket
	.openUploadStream(prop_id
	+ '_13.png')).on('error',
	function(error) {
	if (error) {
	/*
	 * res.send({ "status" : 500,
	 * "errmsg" : "Error: Cannot upload
	 * video: " + error });
	 */
	}
	}).on('finish', function() {
	console.log('done uploading!');
	/*
	 * res.send({ "status" : 200, "message" : "Video
	 * uploaded successfully for farmer with puid:
	 * prince" });
	 */
	});
	}

	if (req.files.image14 != undefined) {
	fs.createReadStream(req.files.image14.path).pipe(
	bucket
	.openUploadStream(prop_id
	+ '_14.png')).on('error',
	function(error) {
	if (error) {
	/*
	 * res.send({ "status" : 500,
	 * "errmsg" : "Error: Cannot upload
	 * video: " + error });
	 */
	}
	}).on('finish', function() {
	console.log('done uploading!');
	/*
	 * res.send({ "status" : 200, "message" : "Video
	 * uploaded successfully for farmer with puid:
	 * prince" });
	 */
	});
	}

	res
	.send({
	"status" : 200,
	"message" : "Video uploaded successfully for farmer with puid: prince"
	});

	});

};

exports.getintrovideo = function(req, res) {

	console.log("getintrovideo");
	console.log(req.query.host_id);
	var host_id = req.query.host_id;
	var fileName = host_id + ".mp4";

	// var fileName = req.session.user_id + '.mp4';
	mongo.connect(mongoURL_video, function(connection) {

	var coll = mongo.connectToCollection('videos.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'video/mp4');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/video', function(error,
	db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'videos'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No intro video exists");
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});

};

exports.isthereintrovideo = function(req, res) {
	var hostID = req.param("hostID");
	var fileName = hostID + '.mp4';
	console.log("isthereintrovideo fiename is: " + fileName);
	mongo.connect(mongoURL_video, function(connection) {

	var coll = mongo.connectToCollection('videos.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {
	console.log("isthereintrovideo intro video exists");
	json_responses = {
	"statusCode" : 200
	};
	res.send(json_responses);
	} else {
	console.log("isthereintrovideo No intro video exists");
	json_responses = {
	"statusCode" : 401
	};
	res.send(json_responses);
	}
	});
	});

};

exports.deactivatehost = function(req, res) {

	// listingID = req.param("listing-id");
	var status_revoked = 0;
	var host_id = req.session.user_id;

	var deleted1 = 1;
	var getUser = "UPDATE user_profile SET `status`='" + status_revoked
	+ "' WHERE `user_id`='" + host_id + "';";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	console.log("host deativated; user_profile status updated")
	// var json_responses;
	// json_responses = {"itemsInCart": req.session.currentcart};
	// json_responses = {"statusCode": 300};
	// res.send(json_responses);
	// console.log("pushed 300 to client-redirect to user homepage in
	// frontend");
	}
	}, getUser);

	// var getUser = "DELETE FROM listings WHERE `host_id`='" + host_id + "'";
	var getUser = "UPDATE listings SET `isDeleted`='" + deleted1
	+ "' WHERE `host_id`='" + host_id + "';";

	console.log("Query is:" + getUser);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	console
	.log("host deativated; listings all removed")
	var json_responses;
	// json_responses = {"itemsInCart":
	// req.session.currentcart};
	json_responses = {
	"statusCode" : 300
	};
	res.send(json_responses);
	console
	.log("pushed 300 to client-redirect to user homepage in frontend");
	}
	}, getUser);
	req.session.status = 0;
};

exports.acceptuser = function(req, res) {

	var requests_obj = req.param("request_obj");
	var tripID = requests_obj.trip_id;

	var userID = req.param("userid");
	var propID = req.param("propid");
	var hostID = req.session.user_id;
	var hFname = req.session.fname;
	// req.session.fname = fname; //ask ashna to add this in home.js routes
	var hLname = req.session.lname;
	var uFname;
	var uLname;
	var cardno;

	var checkIn = requests_obj.check_in;
	var checkOut = requests_obj.check_out;

	// var total = 100; //use divya code
	var month = new Date().getMonth() + 1;
	var year = new Date().getFullYear();

	var tempy = 1;

	var date1 = new Date(checkIn);
	var date2 = new Date(checkOut);
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	var ppd = requests_obj.price;
	var subtotal = diffDays * ppd;
	var total = subtotal + 40;
	// req.session.nights = diffDays;

	/* MODIFIED AS PER DIVYA (prop_id to trip_id) */
	var getUser1 = "UPDATE trips SET `status`='" + tempy
	+ "' WHERE `user_id`='" + userID + "' and `trip_id`='" + tripID
	+ "';";

	console.log("Query is:" + getUser1);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {

	var getUser = "SELECT * FROM  user_profile WHERE user_id="
	+ userID;

	console.log("Query is:" + getUser);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	console
	.log("divya billing")
	uFname = results[0].fname;
	uLname = results[0].lname;

	var getTrip = "SELECT payment_id FROM trips WHERE trip_id="
	+ tripID;

	//var getCardno = "SELECT cardnumber FROM  payment WHERE payment_id="
	+ tripID;

	
	mysql
	.fetchData(
	function(
	err,
	results) {
	if (err) {
	throw err;
	} else {
	var getCardno = "SELECT cardnumber FROM  payment WHERE payment_id="
	+ results[0].payment_id;

	mysql
	.fetchData(
	function(
	err,
	results) {
	if (err) {
	throw err;

	} else {

	console
	.log("divya cardno")
	cardno = results[0].cardnumber;

	var deleteBilling = "delete from billing where trip_id="
	+ tripID;

	mysql
	.fetchData(
	function(
	err,
	results) {
	if (err) {
	throw err;

	} else {

	// INSERT
	// TO
	// BILL
	// TABLE
	// _
	// CREATE
	// BILL
	// HERE
	var getUser3 = "INSERT INTO billing (`user_id`, `trip_id`, `total`, date, u_fname, u_lname, h_fname,  h_lname, host_id, cardno, month, year, nights) VALUES ("
	+ userID
	+ ", "
	+ tripID
	+ ", "
	+ total
	+ ", NOW() , '"
	+ uFname

	+ "','"
	+ uLname
	+ "','"
	+ hFname
	+ "','"
	+ hLname
	+ "',"
	+ hostID
	+ ",'"
	+ cardno
	+ "','"
	+ month
	+ "','"
	+ year
	+ "',"
	+ diffDays
	+ ");"
	mysql
	.fetchData(
	function(
	err,
	results) {
	if (err) {
	throw err;
	} else {
	console
	.log("host approved")
	var json_responses;
	// json_responses
	// =
	// {"itemsInCart":
	// req.session.currentcart};
	json_responses = {
	"statusCode" : 300
	};
	res
	.send(json_responses);
	console
	.log("pushed 300 to client-redirect to user homepage in frontend");

	}
	},
	getUser3);

	}
	},
	deleteBilling);

	}
	},
	getCardno);

	}
	}, getTrip);
	}
	}, getUser);

	}
	}, getUser1);

}

exports.declineuser = function(req, res) {
	var propID = req.param("propid");
	var userID = req.param("userid");
	var tempy = 2;

	var getUser = "UPDATE trips SET `status`='" + tempy + "' WHERE `user_id`='"
	+ userID + "' and `prop_id`='" + propID + "';";

	console.log("Query is:" + getUser);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	console.log("host approved")
	var json_responses;
	// json_responses = {"itemsInCart":
	// req.session.currentcart};
	json_responses = {
	"statusCode" : 300
	};
	res.send(json_responses);
	console
	.log("pushed 300 to client-redirect to user homepage in frontend");
	}
	}, getUser);
};

exports.getmyrequests = function(req, res) {

	var hardcoded = req.session.user_id;

	var results_length;
	console
	.log("reading all the requests from the trips table in the database");

	var getUser = "select trips.*,listings.*,user_profile.*, listings.city as city,listings.state as state from trips INNER JOIN listings ON trips.prop_id = listings.prop_id INNER JOIN user_profile ON trips.user_id = user_profile.user_id  where trips.host_id="
	+ hardcoded + " and trips.status=0";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"requests_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};

exports.getmyreservations = function(req, res) {

	var hardcoded = req.session.user_id;

	var results_length;
	console
	.log("reading all the requests from the trips table in the database");

	var getUser = "select trips.*,listings.*,user_profile.*, listings.city as city,listings.state as state from trips INNER JOIN listings ON trips.prop_id = listings.prop_id INNER JOIN user_profile ON trips.user_id = user_profile.user_id  where trips.host_id="
	+ hardcoded
	+ " and trips.status=1 and date(trips.check_out) > now()";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"reservations_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};

exports.getcompletedreservations = function(req, res) {

	var hardcoded = req.session.user_id;

	var results_length;
	console
	.log("reading all the requests from the trips table in the database");

	var getUser = "select trips.*,listings.*,user_profile.*,billing.*, listings.city as city,listings.state as state from trips INNER JOIN listings ON trips.prop_id = listings.prop_id INNER JOIN user_profile ON trips.user_id = user_profile.user_id INNER JOIN billing ON trips.trip_id = billing.trip_id where trips.host_id="
	+ hardcoded
	+ " and trips.status=1 and date(trips.check_out) < now()";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"creservations_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};

exports.getthisuserreviews = function(req, res) {
	var userID = req.param("userid");
	// var userID = req.param("userid");

	var results_length;
	console.log("reading all the getthisuserreviews");

	var getUser = " select * from userreviews where ruser_id = '" + userID
	+ "' ";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"reviews_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};

exports.submitrating = function(req, res) {
	var hostID = 123; // READ FROM SESSION
	var propID = req.param("propid");
	var userID = req.param("userid");
	var myreview = req.param("review");
	var myrating = req.param("rating");

	var getUser = "INSERT INTO userreviews (`ruser_id`, `rprop_id`, `rhost_id`, review, rating) VALUES ('"
	+ userID
	+ "', '"
	+ propID
	+ "', '"
	+ hostID
	+ "', '"
	+ myreview
	+ "', '" + myrating + "');"

	console.log("Query is:" + getUser);
	mysql
	.fetchData(
	function(err, results) {
	if (err) {
	throw err;
	} else {
	console.log("rating submitted")
	var json_responses;
	// json_responses = {"itemsInCart":
	// req.session.currentcart};
	json_responses = {
	"statusCode" : 300
	};
	res.send(json_responses);
	console
	.log("pushed 300 to client-redirect to user homepage in frontend");
	}
	}, getUser);
};

exports.senddefaultfirstpicture = function(req, res) {

	var fileName = "default" + '.png';
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");

	json_responses = {
	"statusCode" : 401
	};
	res.send(json_responses);
	}
	});
	});
};

exports.getpicture0 = function(req, res) {
	console.log("getpicture0");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_0.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture1 = function(req, res) {
	console.log("getpicture1");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_1.png";

	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});

};

exports.getpicture2 = function(req, res) {

	console.log("getpicture2");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_2.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture3 = function(req, res) {

	console.log("getpicture3");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_3.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture4 = function(req, res) {

	console.log("getpicture4");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_4.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture5 = function(req, res) {

	console.log("getpicture5");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_5.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture6 = function(req, res) {

	console.log("getpicture6");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_6.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture7 = function(req, res) {

	console.log("getpicture7");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_7.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture8 = function(req, res) {

	console.log("getpicture8");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_8.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture9 = function(req, res) {

	console.log("getpicture9");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_9.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture10 = function(req, res) {

	console.log("getpicture10");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_10.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture11 = function(req, res) {

	console.log("getpicture11");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_11.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture12 = function(req, res) {

	console.log("getpicture12");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_12.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture13 = function(req, res) {
	console.log("getpicture13");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_13.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.getpicture14 = function(req, res) {

	console.log("getpicture14");
	console.log(req.query.prop_id);
	var prop_id = req.query.prop_id;
	var fileName = prop_id + "_14.png";
	mongo.connect(mongoURL_picture, function(connection) {

	var coll = mongo.connectToCollection('pictures.files', connection);

	coll.findOne({
	filename : fileName
	}, function(err, user) {
	if (user) {

	try {

	console.log(fileName);
	console.log("imagecoll");
	res.setHeader('Content-type', 'image/png');
	mongodb.MongoClient.connect(
	'mongodb://localhost:27017/picture', function(
	error, db) {
	console.log("imagecoll2");
	var bucket = new mongodb.GridFSBucket(db, {
	chunkSizeBytes : 1024,
	bucketName : 'pictures'
	});
	bucket.openDownloadStreamByName(fileName).pipe(
	res).on('error', function(error) {
	}).on('finish', function() {
	});
	});

	} catch (error) {
	}

	} else {
	console.log("No picture exists");
	_this.senddefaultfirstpicture(req, res);
	// json_responses = {"statusCode" : 401};
	// res.send(json_responses);
	}
	});
	});
};

exports.gethostID = function(req, res) {

	var json_responses;
	// json_responses = {"itemsInCart":
	// req.session.currentcart};
	json_responses = {
	"statusCode" : 200,
	"thisisyourID" : req.session.user_id
	};
	res.send(json_responses);

};

exports.checkthisreservation = function(req, res) {

	var hardcodedme = req.param("listing_id");

	var results_length;
	console
	.log("reading all the requests from the trips table in the database");

	var getUser = " select * from trips where prop_id = '" + hardcodedme
	+ "' and trips.status=1 and date(trips.check_out) > now()";

	console.log("Query is:" + getUser);
	mysql.fetchData(function(err, results) {
	if (err) {
	throw err;
	} else {
	if (results.length > 0) {
	results_length = results.length;
	console.log("results.length is " + results.length);
	console.log("results is " + results);

	var rows = results;
	var jsonString = JSON.stringify(results);
	var jsonParse = JSON.parse(jsonString);
	console.log("Results Type: " + (typeof results));
	// console.log("Result Element Type:" + (typeof
	// rows[0].emailid));
	console.log("Results Stringify Type:" + (typeof jsonString));
	console.log("Results Parse Type:" + (typeof jsString));
	console.log("Results: " + (results));
	// console.log("Result Element: "+(rows[0].emailid));
	console.log("Results Stringify:" + (jsonString));
	console.log("Results Parse:" + (jsonParse));
	console.log("results_length is:" + results_length);

	// console.log("results[0] is " + results[0] +" results[0].fname
	// is "+ results[0].fname);

	var json_responses;
	json_responses = {
	"statusCode" : 200,
	"reservations_list" : jsonParse,
	"results_length" : results_length
	};
	res.send(json_responses);

	} else {
	console.log("database empty");
	var json_responses;
	json_responses = {
	"statusCode" : 201
	};
	res.send(json_responses);

	}
	}
	}, getUser);

};