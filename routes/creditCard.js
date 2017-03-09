/**
 * New node file
 */

exports.valiadteCard = function(callback, req) {
	
	if (req.session.user_id) {
		console.log("In Credit card Application");
		
		var cardNumber = req.param("cardNumber");
		var month = req.param("month");
		var year = req.param("year");
		var cvvNum = req.param("cvv");
		var firstname = req.param("firstname");
		var lastname = req.param("lastname");
		var zip = req.param("zip");
		var flag = 0;
		var result = "Invalid";
		
		


			if (year < new Date().getFullYear()) {
				if (flag == 1) {
					result = result + " ,Expiry Date";
				} else {
					flag = 1;
					result = result + " Expiry Date";
				}
			} else if (year == new Date().getFullYear()) {
				if (month <= new Date().getMonth() + 1) {
					if (flag == 1) {
						result = result + " ,Expiry Date";
					} else {
						flag = 1;
						result = result + " Expiry Date";
					}
				}

			}
		

		if (flag == 0) {

			json_responses = {
				"statusCode" : 200,
				"message" : "Credit card Information is valid"
			};
			//res.send(json_responses);
		} else {
			json_responses = {
				"statusCode" : 404,
				"message" : result
			};
			//res.send(json_responses);

		}
		callback(json_responses);

	} else {
		res.redirect('/');
		// res.render('login', { title: 'Login' });
	}

};
