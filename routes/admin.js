
var mysql = require('./mysql');

var mongo = require("./mongo");
var mongodb = require('mongodb');
var database = "mongodb://localhost:27017/airbnb";
var fs = require('fs');

var uuid = require('node-uuid');

var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'cmpe273_airbnb';

exports.login = function(req, res){
	res.render('adminLogin');
};

exports.searchBill = function(req, res){
	res.render('searchBill');
};

exports.adminLogin = function(req, res) {
	var email = req.param("email");
	var pwd = req.param("password");
	var encPwd = encrypt(pwd);
	var getAdmin = "select * from admin where email='" + email + "' and password='" + encPwd + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var adminID = results[0].admin_id;
				console.log("valid Login");
				req.session.admin_id = adminID;
				var json_responses = {
					"statusCode" : "200",
					"admin_id" : adminID
				};
				console.log("index.js:" + json_responses);
				res.send(json_responses);

			} else {
				console.log("Invalid Login");
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getAdmin);
};

exports.adminHome = function(req, res) {
	console.log("here");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('adminHome', {
		title : 'Express'
	});
};


exports.pendingRequest=function(req,res){
	var getPendingHostRequest = "select * from  user_profile where status = 1";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var user_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				user_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("pendingRequest", {pendingRequests:result, user_ssn:user_ssn});
		}
	},getPendingHostRequest);
};

exports.viewhost = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var query = "select * from user_profile left join listings on user_profile.user_id = listings.host_id left join reviews on listings.host_id = reviews.host_id where user_profile.user_id="+userid+"";	
	var query1= "select * from user_profile where user_id = "+ userid +"";
	var query2 ="select * from listings where host_id="+userid+"";
	var query3 ="select * from reviews where host_id="+userid+"";
	console.log(JSON.stringify(query));
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}else{
							var user_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							var host_ssn = userid.slice(1,4)+"-"+userid.slice(4,6)+"-"+userid.slice(6,10);
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].user_id);
								var str3 = JSON.stringify(result[i].review_id);
								var str4 = JSON.stringify(result[i].prop_id);
								var str5 = JSON.stringify(result[i].trip_id);
								user_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewhost", {review:result, listing, host, str, host_ssn:host_ssn, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn, property_ssn:property_ssn});
						}
					},query3);
					var listing=result;
					var property_ssn = [];
					for(var i=0; i<result.length; i++){
						var str1 = JSON.stringify(result[i].prop_id);
						property_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
					}
				}
			},query2);
			var host=result;
			if(result[0].birthday == null){
				var str ="";
			}else{
			var bday = result[0].birthday;
			var d = bday.slice(0, 10).split('-'); 
			var str = d[1] +'/'+ d[2] +'/'+ d[0];}
		}
	},query1);
};

exports.viewuser = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	console.log("to check"+userid);
	var query = "select * from user_profile left join listings on user_profile.user_id = listings.host_id left join reviews on listings.host_id = reviews.host_id where user_profile.user_id="+userid+"";	
	var query1= "select * from user_profile where user_id = "+ userid +"";
	var query2 ="select * from trips left join listings on trips.prop_id = listings.prop_id where user_id="+userid+"";
	var query3 ="select * from userreviews where ruser_id="+userid+"";
	//var query4 ="select * from "
	console.log(JSON.stringify(query));
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}
						else{
							var host_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							var user_ssn = userid.slice(1,4)+"-"+userid.slice(4,6)+"-"+userid.slice(6,10);
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].rhost_id);
								var str3 = JSON.stringify(result[i].ureview_id);
								var str4 = JSON.stringify(result[i].rprop_id);
								var str5 = JSON.stringify(result[i].rtrip_id);
								host_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewuser", {review:result, trip, user, host_ssn:host_ssn, checkin:checkin, checkout:checkout, str, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn});
						}
					},query3);
					var trip=result;
					var checkin = [];
					var checkout = [];
					for (var i=0; i<result.length; i++){
						var str1 = result[i].check_in;
						var str2 = result[i].check_out;
						checkin.push(str1.toString().substring(0,16));
						checkout.push(str2.toString().substring(0,16));
					}
				}
			},query2);
			var user=result;
			if(result[0].birthday == null){
				var str ="";
			}
			else{var bday = result[0].birthday;
			var d = bday.slice(0, 10).split('-'); 
			var str = d[1] +'/'+ d[2] +'/'+ d[0];}
		}
	},query1);
};

exports.viewproperty = function(req, res){
	var propid = JSON.stringify(req.params.propid);	
	var query1= "select * from listings where prop_id = "+ propid +"";
	var query2 ="select * from user_profile, listings where listings.host_id= user_profile.user_id and listings.prop_id = "+propid+"";
	var query3 ="select * from reviews where prop_id="+propid+"";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}
						else{
							var host_ssn = [];
							var user_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].host_id);
								var str2 = JSON.stringify(result[i].user_id);
								var str3 = JSON.stringify(result[i].review_id);
								var str4 = JSON.stringify(result[i].prop_id);
								var str5 = JSON.stringify(result[i].trip_id);
								host_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								user_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewproperty", {review:result, host, property, host_ssn:host_ssn, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn});
						}
					},query3);
					var host=result;
				}
			},query2);
			var property=result;
		}
	},query1);
};


exports.displayHostsList=function(req,res){
	//var query = "select t1.*, COUNT(*) as count from user_profile t1, listings t2 where status = 2 and t1.user_id = t2.host_id group by host_id";
	var query = "select * from user_profile where status = 2";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewHosts", {hosts:result, host_ssn:host_ssn});
		}
	},query);
};

exports.searchhostby=function(req,res){
	var state = JSON.stringify(req.body.state);
	var city = req.body.city;
	var query = "select * from  user_profile where status = 2 and state = "+state+" and city like '%"+city+"%'";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewHosts", {hosts:result, host_ssn:host_ssn});
		}
	},query);
};

exports.displayUsersList=function(req,res){
	var query = "select * from  user_profile where status = 0";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var user_ssn = [];
			for(var i=0; i<result.length; i++){
				var str1 = JSON.stringify(result[i].user_id);
				user_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewUsers", {users:result, user_ssn:user_ssn});
		}
	},query);
};

exports.displayPropertiesList=function(req,res){
	var query = "select * from  listings";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var prop_ssn = [];
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str1 = JSON.stringify(result[i].prop_id);
				var str2 = JSON.stringify(result[i].host_id);
				prop_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewProperties", {properties:result, host_ssn:host_ssn, prop_ssn:prop_ssn});
		}
	},query);
};

exports.getAdminDashboard = function(req, res) {
	console.log("here");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('adminDashboard', {
		title : 'Express'
	});
};

exports.getAdminProfile = function(req, res) {
	var admin_id = req.session.admin_id;
	var getAdminProfile = "select * from  admin where admin_id = " + admin_id;
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var adminProfile = results[0];
				var json_responses = {
					"statusCode" : "200",
					"adminProfile" : adminProfile
				};
				res.send(json_responses);
			} else {
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getAdminProfile);
};

exports.updateAdminProfile = function(req, res) {
	var updates = req.param("updates");
	var updateAdminProfile = "update admin set ";
	if (updates.hasOwnProperty('fname')) {
		updateAdminProfile = updateAdminProfile + "first_name = '" + updates.fname + "',"
	}
	if (updates.hasOwnProperty('lname')) {
		updateAdminProfile = updateAdminProfile + "last_name = '" + updates.lname + "',"
	}

	if (updates.hasOwnProperty('phone_no')) {
		updateAdminProfile = updateAdminProfile + "phone_no = '" + updates.phone_no + "',"
	}
	if (updates.hasOwnProperty('address')) {
		updateProf = updateProf + "address = '" + updates.address + "',"
	}
	updateAdminProfile = updateAdminProfile + "admin_id=" + req.session.admin_id
			+ " where admin_id = " + req.session.admin_id;
	console.log(updateAdminProfile);

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (updates.hasOwnProperty('email')) {

				var updateEmail = "update user_auth set email = '"
						+ updates.email + "' where user_id = "
						+ req.session.user_id;
				mysql.fetchData(function(err, results) {
					if (err) {
						throw err;
						var json_responses = {
							"statusCode" : "400"
						};
						res.send(json_responses);
					} else {

						var json_responses = {
							"statusCode" : "200"
						};

					}
				}, updateEmail);
			}

			var json_responses = {
				"statusCode" : "200"
			};
			res.send(json_responses);

		}
	}, updateAdminProfile);
};



exports.approveHost=function(req,res){

	var user_id =req.body.user_id;
	var query = "Update user_profile set status = 2 where user_id ='" +user_id + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} 
		else {
			var json_response = {"status":"Approved"};
			res.send(json_response);
		}	
	}, query);
};
exports.rejectHost=function(req,res){
	var user_id =req.body.user_id;
	console.log(user_id);
	var query = "Update user_profile set status = 0 where user_id ='" +user_id + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} 
		else {
			var json_response = {"status":"Rejecteded"};
			res.send(json_response);
		}	
	}, query);
};
exports.listAllHost = function(req, res) {
	var admin_id = req.session.admin_id;
	var getAllHost = "select * from  hosts";
	console.log("Query is:" + getAllHost);
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var host = results[0];
				var json_responses = {
					"statusCode" : "200",
					"host" : host
				};
				res.send(json_responses);
			} else {
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getPendingHostRequest);
};

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

exports.saveUserReview = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var rating = JSON.stringify(req.body.rating);
	var review = JSON.stringify(req.body.review);
	var query = "insert into user_reviews (user_id, review, rating) VALUES ("+ userid + ",'" + review + "','" + rating + "')";
	console.log(query);
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.redirect('displayUsersList');
		}
	},query);
};

exports.saveHostReview = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var rating = JSON.stringify(req.body.rating);
	var review = JSON.stringify(req.body.review);
	var query = "insert into reviews (host_id, review, rating) VALUES ("+ userid + ",'" + review + "','" + rating + "')";
	console.log(query);
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.redirect('displayHostsList');
		}
	},query);
};


exports.viewBillDetail = function(req, res){
	var billid = JSON.stringify(req.params.billid);	
	var query= "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.billing_id = "+ billid +"";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			var str1 = JSON.stringify(result[0].billing_id);
			var str2 = result[0].check_in;
			var str3 = result[0].check_out;
			var str4 = result[0].date;
			var str5 = result[0].cardno;
			console.log(str1);
			console.log(str2);
			console.log(str3);
			console.log(str4);
			console.log(str5);
			var billid= str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9);
			var checkin = str2.toString().substring(0,16);
			var checkout = str3.toString().substring(0,16);
			var date = str4.toString().substring(0,16);
			var cardno = str5.slice(12,16);
			console.log(billid);
			console.log(checkin);
			console.log(checkout);
			console.log(date);
			console.log(cardno);
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewbill_detail", {bill:result, billid:billid, checkin: checkin, checkout:checkout, date:date, cardno:cardno});
		}
	},query);
};


exports.searchBillDetails = function(req, res){
	var month = req.body.month;
	var date = req.body.date;
	var year = req.body.year;
	var category = req.body.category;
	var mydate = year+"-"+month+"-"+date;
	console.log(mydate);
	if(category == 'date'){
		var query = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.date = '"+mydate+"'";
		console.log(query);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query);
	}
	if(category == 'month'){
		var query1 = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.year="+year+" and billing.month = "+month+"";
		console.log(query1);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query1);
	}
	if(category == 'year'){
		var query2 = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.year="+year+"";
		console.log(query2);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query2);
	}
};


function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

exports.updatePhoto = function(req, res) {
	console.log("session id checking"+req.session.admin_id);
	var puidData = {};
	var postData = {};
	var imageID = uuid.v4() + ".png";
	puidData.images = [];
	puidData.images.push(imageID);
	puidData.videos = "";
	postData.puid = req.session.admin_id;
	postData[req.session.admin_id] = puidData;
	console.log(req.files.image.path);
	mongo.connect(database, function(connection) {
		var userCollection = mongo.connectToCollection('user', connection);

		userCollection.update({
			"puid" : req.session.admin_id
		}, {
			$set : postData
		}, {
			upsert : true
		}, function(error, result) {
			console.log(result);
			mongodb.MongoClient.connect(database, function(error, db) {
				var bucket = new mongodb.GridFSBucket(db, {
					chunkSizeBytes : 1024,
					bucketName : 'images'
				});
				fs.createReadStream(req.files.image.path).pipe(
						bucket.openUploadStream(imageID)).on(
						'error',
						function(error) {
							if (error) {
								res.send({
									"statusCode" : 500,
									"errmsg" : "Error: Cannot upload image: "
											+ error
								});
							}
						}).on('finish', function() {
					console.log('done!');
					res.send({
						"statusCode" : 200
					});
				});
			});
		});
	});

};

exports.getImageUrl = function(req, res) {
	mongo.connect(database, function(connection) {
		var userCollection = mongo.connectToCollection('user', connection);

		userCollection.findOne({
			"puid" : req.session.admin_id
		}, function(error, result) {

			if (!error && result != null) {
				console.log(result);
				var imageUrl = result[req.session.admin_id].images[0];
				console.log(imageUrl);

				res.send({
					"statusCode" : 200,
					"url" : imageUrl
				});
			}

		});

	});
};

exports.getImageByUrl = function(req, res) {
	try {
		var fileName = req.query.profile_pic;
		console.log(fileName);
		console.log("imagecoll");
		res.setHeader('Content-type', 'image/png');
		mongodb.MongoClient.connect(database, function(error, db) {
			console.log("imagecoll2");
			var bucket = new mongodb.GridFSBucket(db, {
				chunkSizeBytes : 1024,
				bucketName : 'images'
			});
			bucket.openDownloadStreamByName(fileName).pipe(res).on('error',
					function(error) {
					}).on('finish', function() {
			});
		});

	} catch (error) {
	}
};

var mysql = require('./mysql');

var mongo = require("./mongo");
var mongodb = require('mongodb');
var database = "mongodb://localhost:27017/airbnb";
var fs = require('fs');

var uuid = require('node-uuid');

var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'cmpe273_airbnb';

exports.login = function(req, res){
	res.render('adminLogin');
};

exports.searchBill = function(req, res){
	res.render('searchBill');
};

exports.adminLogin = function(req, res) {
	var email = req.param("email");
	var pwd = req.param("password");
	var encPwd = encrypt(pwd);
	var getAdmin = "select * from admin where email='" + email + "' and password='" + encPwd + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var adminID = results[0].admin_id;
				console.log("valid Login");
				req.session.admin_id = adminID;
				var json_responses = {
					"statusCode" : "200",
					"admin_id" : adminID
				};
				console.log("index.js:" + json_responses);
				res.send(json_responses);

			} else {
				console.log("Invalid Login");
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getAdmin);
};

exports.adminHome = function(req, res) {
	console.log("here");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('adminHome', {
		title : 'Express'
	});
};


exports.pendingRequest=function(req,res){
	var getPendingHostRequest = "select * from  user_profile where status = 1";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var user_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				user_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("pendingRequest", {pendingRequests:result, user_ssn:user_ssn});
		}
	},getPendingHostRequest);
};

exports.viewhost = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var query = "select * from user_profile left join listings on user_profile.user_id = listings.host_id left join reviews on listings.host_id = reviews.host_id where user_profile.user_id="+userid+"";	
	var query1= "select * from user_profile where user_id = "+ userid +"";
	var query2 ="select * from listings where host_id="+userid+"";
	var query3 ="select * from reviews where host_id="+userid+"";
	console.log(JSON.stringify(query));
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}else{
							var user_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							var host_ssn = userid.slice(1,4)+"-"+userid.slice(4,6)+"-"+userid.slice(6,10);
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].user_id);
								var str3 = JSON.stringify(result[i].review_id);
								var str4 = JSON.stringify(result[i].prop_id);
								var str5 = JSON.stringify(result[i].trip_id);
								user_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewhost", {review:result, listing:listing, host:host, str:str, host_ssn:host_ssn, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn, property_ssn:property_ssn});
						}
					},query3);
					var listing=result;
					var property_ssn = [];
					for(var i=0; i<result.length; i++){
						var str1 = JSON.stringify(result[i].prop_id);
						property_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
					}
				}
			},query2);
			var host=result;
			if(result[0].birthday == null){
				var str ="";
			}
			else{
			var bday = result[0].birthday;
			var d = bday.slice(0, 10).split('-'); 
			var str = d[1] +'/'+ d[2] +'/'+ d[0];
			}
		}
	},query1);
};

exports.viewuser = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	console.log("to check"+userid);
	var query = "select * from user_profile left join listings on user_profile.user_id = listings.host_id left join reviews on listings.host_id = reviews.host_id where user_profile.user_id="+userid+"";	
	var query1= "select * from user_profile where user_id = "+ userid +"";
	var query2 ="select * from trips left join listings on trips.prop_id = listings.prop_id where user_id="+userid+"";
	var query3 ="select * from userreviews where ruser_id="+userid+"";
	//var query4 ="select * from "
	console.log(JSON.stringify(query));
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}
						else{
							var host_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							var user_ssn = userid.slice(1,4)+"-"+userid.slice(4,6)+"-"+userid.slice(6,10);
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].rhost_id);
								var str3 = JSON.stringify(result[i].ureview_id);
								var str4 = JSON.stringify(result[i].rprop_id);
								var str5 = JSON.stringify(result[i].rtrip_id);
								host_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewuser", {review:result, trip:trip, user:user, host_ssn:host_ssn, checkin:checkin, checkout:checkout, str:str, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn});
						}
					},query3);
					var trip=result;
					var checkin = [];
					var checkout = [];
					for (var i=0; i<result.length; i++){
						var str1 = result[i].check_in;
						var str2 = result[i].check_out;
						checkin.push(str1.toString().substring(0,16));
						checkout.push(str2.toString().substring(0,16));
					}
				}
			},query2);
			var user=result;
			if(result[0].birthday == null){
				var str ="";
			}
			else{
			var bday = result[0].birthday;
			var d = bday.slice(0, 10).split('-'); 
			var str = d[1] +'/'+ d[2] +'/'+ d[0];
			}
		}
	},query1);
};

exports.viewproperty = function(req, res){
	var propid = JSON.stringify(req.params.propid);	
	var query1= "select * from listings where prop_id = "+ propid +"";
	var query2 ="select * from user_profile, listings where listings.host_id= user_profile.user_id and listings.prop_id = "+propid+"";
	var query3 ="select * from reviews where prop_id="+propid+"";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			mysql.fetchData(function(err, result){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err, result){
						if(err){
							throw err;
						}
						else{
							var host_ssn = [];
							var user_ssn = [];
							var revw_ssn = [];
							var prop_ssn = [];
							var trip_ssn = [];
							for(var i=0; i<result.length; i++){
								var str1 = JSON.stringify(result[i].host_id);
								var str2 = JSON.stringify(result[i].user_id);
								var str3 = JSON.stringify(result[i].review_id);
								var str4 = JSON.stringify(result[i].prop_id);
								var str5 = JSON.stringify(result[i].trip_id);
								host_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
								user_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
								revw_ssn.push(str3.slice(0,3)+"-"+str3.slice(3,5)+"-"+str3.slice(5,9));
								prop_ssn.push(str4.slice(0,3)+"-"+str4.slice(3,5)+"-"+str4.slice(5,9));
								trip_ssn.push(str5.slice(0,3)+"-"+str5.slice(3,5)+"-"+str5.slice(5,9));
								}
							res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
							res.render("viewproperty", {review:result, host:host, property:property, host_ssn:host_ssn, user_ssn:user_ssn, revw_ssn:revw_ssn, prop_ssn:prop_ssn, trip_ssn: trip_ssn});
						}
					},query3);
					var host=result;
				}
			},query2);
			var property=result;
		}
	},query1);
};


exports.displayHostsList=function(req,res){
	//var query = "select t1.*, COUNT(*) as count from user_profile t1, listings t2 where status = 2 and t1.user_id = t2.host_id group by host_id";
	var query = "select * from user_profile where status = 2";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewHosts", {hosts:result, host_ssn:host_ssn});
		}
	},query);
};

exports.searchhostby=function(req,res){
	var state = JSON.stringify(req.body.state);
	var city = req.body.city;
	var query = "select * from  user_profile where status = 2 and state = "+state+" and city like '%"+city+"%'";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str2 = JSON.stringify(result[i].user_id);
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewHosts", {hosts:result, host_ssn:host_ssn});
		}
	},query);
};

exports.displayUsersList=function(req,res){
	var query = "select * from  user_profile where status = 0";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var user_ssn = [];
			for(var i=0; i<result.length; i++){
				var str1 = JSON.stringify(result[i].user_id);
				user_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewUsers", {users:result, user_ssn:user_ssn});
		}
	},query);
};

exports.displayPropertiesList=function(req,res){
	var query = "select * from  listings";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			var prop_ssn = [];
			var host_ssn = [];
			for(var i=0; i<result.length; i++){
				var str1 = JSON.stringify(result[i].prop_id);
				var str2 = JSON.stringify(result[i].host_id);
				prop_ssn.push(str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9));
				host_ssn.push(str2.slice(0,3)+"-"+str2.slice(3,5)+"-"+str2.slice(5,9));
			}
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewProperties", {properties:result, host_ssn:host_ssn, prop_ssn:prop_ssn});
		}
	},query);
};

exports.getAdminDashboard = function(req, res) {
	console.log("here");
	res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('adminDashboard', {
		title : 'Express'
	});
};

exports.getAdminProfile = function(req, res) {
	var admin_id = req.session.admin_id;
	var getAdminProfile = "select * from  admin where admin_id = " + admin_id;
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var adminProfile = results[0];
				var json_responses = {
					"statusCode" : "200",
					"adminProfile" : adminProfile
				};
				res.send(json_responses);
			} else {
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getAdminProfile);
};

exports.updateAdminProfile = function(req, res) {
	var updates = req.param("updates");
	var updateAdminProfile = "update admin set ";
	if (updates.hasOwnProperty('fname')) {
		updateAdminProfile = updateAdminProfile + "first_name = '" + updates.fname + "',"
	}
	if (updates.hasOwnProperty('lname')) {
		updateAdminProfile = updateAdminProfile + "last_name = '" + updates.lname + "',"
	}

	if (updates.hasOwnProperty('phone_no')) {
		updateAdminProfile = updateAdminProfile + "phone_no = '" + updates.phone_no + "',"
	}
	if (updates.hasOwnProperty('address')) {
		updateProf = updateProf + "address = '" + updates.address + "',"
	}
	updateAdminProfile = updateAdminProfile + "admin_id=" + req.session.admin_id
			+ " where admin_id = " + req.session.admin_id;
	console.log(updateAdminProfile);

	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (updates.hasOwnProperty('email')) {

				var updateEmail = "update user_auth set email = '"
						+ updates.email + "' where user_id = "
						+ req.session.user_id;
				mysql.fetchData(function(err, results) {
					if (err) {
						throw err;
						var json_responses = {
							"statusCode" : "400"
						};
						res.send(json_responses);
					} else {

						var json_responses = {
							"statusCode" : "200"
						};

					}
				}, updateEmail);
			}

			var json_responses = {
				"statusCode" : "200"
			};
			res.send(json_responses);

		}
	}, updateAdminProfile);
};



exports.approveHost=function(req,res){
	var user_id =req.body.user_id;
	var query = "Update user_profile set status = 2 where user_id ='" +user_id + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} 
		else {
			var json_response = {"status":"Approved"};
			res.send(json_response);
		}	
	}, query);
};
exports.rejectHost=function(req,res){
	var user_id =req.body.user_id;
	console.log(user_id);
	var query = "Update user_profile set status = 0 where user_id ='" +user_id + "'";
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} 
		else {
			var json_response = {"status":"Rejecteded"};
			res.send(json_response);
		}	
	}, query);
};
exports.listAllHost = function(req, res) {
	var admin_id = req.session.admin_id;
	var getAllHost = "select * from  hosts";
	console.log("Query is:" + getAllHost);
	mysql.fetchData(function(err, results) {
		if (err) {
			throw err;
			var json_responses = {
				"statusCode" : "400"
			};
			res.send(json_responses);
		} else {
			if (results.length > 0) {
				var host = results[0];
				var json_responses = {
					"statusCode" : "200",
					"host" : host
				};
				res.send(json_responses);
			} else {
				var json_responses = {
					"statusCode" : "400"
				};
				res.send(json_responses);
			}
		}
	}, getPendingHostRequest);
};

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

exports.saveUserReview = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var rating = JSON.stringify(req.body.rating);
	var review = JSON.stringify(req.body.review);
	var query = "insert into user_reviews (user_id, review, rating) VALUES ("+ userid + ",'" + review + "','" + rating + "')";
	console.log(query);
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.redirect('displayUsersList');
		}
	},query);
};

exports.saveHostReview = function(req, res){
	var userid = JSON.stringify(req.params.userid);
	var rating = JSON.stringify(req.body.rating);
	var review = JSON.stringify(req.body.review);
	var query = "insert into reviews (host_id, review, rating) VALUES ("+ userid + ",'" + review + "','" + rating + "')";
	console.log(query);
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		} else{
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.redirect('displayHostsList');
		}
	},query);
};


exports.viewBillDetail = function(req, res){
	var billid = JSON.stringify(req.params.billid);	
	var query= "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.billing_id = "+ billid +"";
	mysql.fetchData(function(err, result){
		if (err) {
			throw err;
		}
		else{
			var str1 = JSON.stringify(result[0].billing_id);
			var str2 = result[0].check_in;
			var str3 = result[0].check_out;
			var str4 = result[0].date;
			var str5 = result[0].cardno;
			console.log(str1);
			console.log(str2);
			console.log(str3);
			console.log(str4);
			console.log(str5);
			var billid= str1.slice(0,3)+"-"+str1.slice(3,5)+"-"+str1.slice(5,9);
			var checkin = str2.toString().substring(0,16);
			var checkout = str3.toString().substring(0,16);
			var date = str4.toString().substring(0,16);
			var cardno = str5.slice(12,16);
			console.log(billid);
			console.log(checkin);
			console.log(checkout);
			console.log(date);
			console.log(cardno);
			res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("viewbill_detail", {bill:result, billid:billid, checkin: checkin, checkout:checkout, date:date, cardno:cardno});
		}
	},query);
};


exports.searchBillDetails = function(req, res){
	var month = req.body.month;
	var date = req.body.date;
	var year = req.body.year;
	var category = req.body.category;
	var mydate = year+"-"+month+"-"+date;
	console.log(mydate);
	if(category == 'date'){
		var query = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.date = '"+mydate+"'";
		console.log(query);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query);
	}
	if(category == 'month'){
		var query1 = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.year="+year+" and billing.month = "+month+"";
		console.log(query1);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query1);
	}
	if(category == 'year'){
		var query2 = "select * from billing left join trips on trips.trip_id = billing.trip_id left join listings on listings.prop_id = trips.prop_id where billing.year="+year+"";
		console.log(query2);
		mysql.fetchData(function(err, result){
			if (err) {
				throw err;
			} else{
				var bill_ssn = [];
				for (var i=0; i<result.length; i++){
					var str = JSON.stringify(result[i].billing_id);
					bill_ssn.push(str.slice(0,3)+"-"+str.slice(3,5)+"-"+str.slice(5,9));
				}
				res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("viewbill_list", {bill:result, bill_ssn:bill_ssn});
			}
		},query2);
	}
};


function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

//added uploading photo for admin
exports.updatePhoto = function(req, res) {
	console.log("session id checking"+req.session.admin_id);
	var puidData = {};
	var postData = {};
	var imageID = uuid.v4() + ".png";
	puidData.images = [];
	puidData.images.push(imageID);
	puidData.videos = "";
	postData.puid = req.session.admin_id;
	postData[req.session.admin_id] = puidData;
	console.log(req.files.image.path);
	mongo.connect(database, function(connection) {
		var userCollection = mongo.connectToCollection('user', connection);

		userCollection.update({
			"puid" : req.session.admin_id
		}, {
			$set : postData
		}, {
			upsert : true
		}, function(error, result) {
			console.log(result);
			mongodb.MongoClient.connect(database, function(error, db) {
				var bucket = new mongodb.GridFSBucket(db, {
					chunkSizeBytes : 1024,
					bucketName : 'images'
				});
				fs.createReadStream(req.files.image.path).pipe(
						bucket.openUploadStream(imageID)).on(
						'error',
						function(error) {
							if (error) {
								res.send({
									"statusCode" : 500,
									"errmsg" : "Error: Cannot upload image: "
											+ error
								});
							}
						}).on('finish', function() {
					console.log('done!');
					res.send({
						"statusCode" : 200
					});
				});
			});
		});
	});

};

exports.getImageUrl = function(req, res) {
	mongo.connect(database, function(connection) {
		var userCollection = mongo.connectToCollection('user', connection);

		userCollection.findOne({
			"puid" : req.session.admin_id
		}, function(error, result) {

			if (!error && result != null) {
				console.log(result);
				var imageUrl = result[req.session.admin_id].images[0];
				console.log(imageUrl);

				res.send({
					"statusCode" : 200,
					"url" : imageUrl
				});
			}

		});

	});
};

exports.getImageByUrl = function(req, res) {
	try {
		var fileName = req.query.profile_pic;
		console.log(fileName);
		console.log("imagecoll");
		res.setHeader('Content-type', 'image/png');
		mongodb.MongoClient.connect(database, function(error, db) {
			console.log("imagecoll2");
			var bucket = new mongodb.GridFSBucket(db, {
				chunkSizeBytes : 1024,
				bucketName : 'images'
			});
			bucket.openDownloadStreamByName(fileName).pipe(res).on('error',
					function(error) {
					}).on('finish', function() {
			});
		});

	} catch (error) {
	}
};

