

var mysql = require('./mysql');
var mq_client = require('../rpc/client');

//sreekar latest
var winston=require('winston');
var logger = new (winston.Logger)({
	  transports: [
	    new (winston.transports.Console)(),
	    new (winston.transports.File)({ filename: './Logs' +
	    '/userTracking.log'
	    })
	 ]
})


exports.makeOffer = function(req, res) {
	logger.info('landed on bid page',{userid:req.session.user_id});

	var bid_amt = req.param("bid_amt");
	console.log("bid amount is"+bid_amt);
	var property = req.param("property");
	var no_of_guests = req.param("no_of_guests");
	var check_out = req.param("check_out");
	var check_in = req.param("check_in");
	var bidQuery ="insert into bid_table (user_id,prop_id,bid_amt,creation_time) VALUES ("  + req.session.user_id + "," + property.prop_id + "," + bid_amt +", NOW() )";
	
		
		
		 var msg_payload = {
				 "bid_amt":bid_amt,
				 "property":property.prop_id,
				 "no_of_guests" : no_of_guests,
				 "check_out":check_out,
				 "check_in" : check_in,
				 "user_id" :req.session.user_id
		        }
		
		mq_client.make_request('bid_queue',msg_payload, function(err,results){
	 		
	 		console.log(results);
	 		if (err) {
				throw err;
				console.log(err);
				var json_responses = {
					"statusCode" : "500"
				};
				res.send(json_responses);
			} else {

				var json_responses = {
						"statusCode" : "200"
					};
					res.send(json_responses);

			
	 		}  
	 	});
	
	
	
};