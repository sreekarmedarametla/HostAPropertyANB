var hostang = angular.module('hostapp', []);


hostang.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);
	
hostang.filter('startFrom', function() {
	return function(input, start) {
		start = +start; // parse to int
		return input.slice(start);
	}
});	

hostang
		.controller(
				'hostcontroller',
				function($scope, $http) {

					$scope.listings = [];
					$scope.requestss = [];
					$scope.reservations = [];
					$scope.creservations = [];
					$scope.reviews = [];
					

					$scope.uploadmyvideo = false;
					$scope.hostvideopresent = false;
					$scope.nohostvideopresent = false;
					$scope.justhidethis = false;
					$scope.no_video_selected = false;

					$scope.nolistingss = false;
					$scope.yeslistingss = false;
					$scope.toggle_deactivatelisting = false;
					$scope.youcandeactivatelisting = false;
					$scope.youcantdeactivatelisting = false;	


					$scope.pictureno_limit = false;
					$scope.incomplete_listing = false;
					$scope.invalid_entry = false;
					$scope.listing_created = false;
					$scope.defaultpage = true;
					$scope.invalidcharsininput=false;

					$scope.norequests = false;
					$scope.yesrequests = false;
					$scope.yesreviews = false;
					$scope.noreviews = false;
					$scope.requests_default = true;
					$scope.requests_accepted = false;
					$scope.requests_rejected = false;
					
					$scope.yesreservations = false;
					$scope.noreservations = false;

					$scope.toggle_deactivate = false;
					$scope.youcandeactivateaccount = false; 
					$scope.youcantdeactivateaccount = false;

					$scope.yescreservations = false;
					$scope.nocreservations = false;
					$scope.userreviews = false;
					$scope.providereview = false;
					$scope.justhidethisalso = false;
					$scope.invalid_review=false;
					$scope.invalidcharreview=false;
					//divya
					$scope.review_validation = true;
					
					var videoFile;
					var imageFile1 = undefined;
					var noofimages=0;

					isNumber = function(n) {
						var yeah = 1;
						if (n < 0)
							yeah = 0;
						console.log("n is " + n);
						console.log("yeah is " + yeah);
						return !isNaN(parseFloat(n)) && isFinite(n) && yeah;
					}

					/* INTRO VIDEO */
					
					
						$scope.getcurrenthostID = function() {
						console.log("entered getcurrenthostID");
						$http({
							method : "POST",
							url : '/gethostID',
							data : {

							}
						}).success(function(data) {
							// checking the response data for statusCode
							if (data.statusCode == 200) {
								console.log("recieved 200 in getcurrenthostID");
								$scope.myhostID = data.thisisyourID;
								console.log("YOUR ID IS: " + $scope.myhostID);
								$scope.airbnbV = 'http://localhost:3001/getintrovideo/?host_id=' + $scope.myhostID;
								$scope.isthereintrovideo();

							} else {
								console.log("recieved 201: this will never happen");

							}

						}).error(function(error) {
							console.log("some error in getcurrenthostID")
						});

					};

					//DON"T DELETE THIS! ITS MEMORY OF MY BLOOD AND SWEAT.. SLEEPLESS NIGHTS
					//$scope.airbnbV = "http://localhost:3001/getintrovideo/?host_id=123456796";
					//$scope.airbnbV = 'http://localhost:3001/getintrovideo/?host_id=' + $scope.myhostID;
					
							/*$scope.getIframeSrc = function () {
							
							var linky='http://localhost:3001/getintrovideo/?host_id=' + $scope.myhostID;
							console.log("creating the video link: " + link);
							return linky;
							
							};*/
							
					$scope.uploadvideo = function() {
						console.log('invoked uploadvideo function');
						$scope.uploadmyvideo = !($scope.uploadmyvideo);
					};

					$scope.uploadVideoFile = function(files) {
						console.log('files is ' + files);
						videoFile = files;
					};

					$scope.upload_video = function() {

						if (videoFile != undefined) {
							var reqData = new FormData();
							reqData.append("video", videoFile[0]);
							$http({
								method : 'POST',
								url : '/uploadintrovideo',
								// url: '/uploadpicture',
								data : reqData,
								headers : {
									'Content-Type' : undefined
								},
								transformRequest : angular.identity
							}).success(function(data) {
								// alert("successfully sent the video");
								window.location.assign("/hostintrovideo");
							});

						} else {
							$scope.no_video_selected = true;
						}

					};

					$scope.isthereintrovideo = function() {
						console.log("entered isthereintrovideo");
						$http({
							method : "POST",
							url : '/isthereintrovideo',
							data : {
							"hostID" : $scope.myhostID
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in isthereintrovideo");
												$scope.hostvideopresent = true;
												$scope.nohostvideopresent = false;
											} else if (data.statusCode == 401) {
												console
														.log("recieved 401 in isthereintrovideo");
												$scope.nohostvideopresent = true;
												$scope.hostvideopresent = false;
											}

										})
								.error(
										function(error) {
											console
													.log("some error in isthereintrovideo-angular file")
										});

					};

					

					/* LISTINGS */
					
					/*	$scope.mainlistings = function() {
						console.log("entered mainlistings");

						$scope.getlistings();
						
					}; */
					

					
					
					
					$scope.getlistings = function() {
						
						
						
						
						
						console.log("entered getlistings");
						$http({
							method : "POST",
							url : '/getmylistings',
							data : {

							}
						}).success(function(data) {
							// checking the response data for statusCode
							if (data.statusCode == 200) {
								console.log("recieved 200 in getlistings");
								$scope.listings = data.listings_list;
								
								//$scope.resultlength = data.results_length;
								$scope.nolistingss = false;
								$scope.yeslistingss = true;
								
								// Pagination
								$scope.currentPage1 = 0;
								$scope.pageSize1 = 2;
								$scope.data1 = [];
								$scope.numberOfPages1 = function() {
									return Math
											.ceil($scope.data1.length
													/ $scope.pageSize1);
								}
								for (var i = 0; i < data.listings_list.length; i++) {
									$scope.data1.push(i);
								}
								// Pagination end
							} else {
								console.log("recieved 201");

								$scope.yeslistingss = false;
								$scope.nolistingss = true;
								// put some default message when no listings
							}

						}).error(function(error) {
							console.log("some error in homepage-angular file")
						});

					};

					//$scope.getlistings();
					$scope.deactivatelisting = function(currentlisting) {
					$scope.toggle_deactivatelisting = !($scope.toggle_deactivatelisting);
					var currentlistings=currentlisting;
					$scope.checkthisreservation(currentlistings);
					
					};

					$scope.cancel_deactivationlisting = function() {
					console.log("entered cancel_deactivationlisting");
					$scope.toggle_deactivatelisting = !($scope.toggle_deactivatelisting);
					};
						
					$scope.deletelisting = function(listing) {
						console.log("entered deletelisting");
						console.log("listing.prop_id is " + listing.prop_id);
						$http({
							method : "POST",
							url : '/deletelisting',
							data : {
								"listing-id" : listing.prop_id
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 300) {
												console
														.log("recieved 300 in delete listing");
												window.location
														.assign("/hostlistings");
											} else {
												console
														.log("dint recieeve 300; some eroor while removing the item from the lsiting");
											}

										})
								.error(
										function(error) {
											console
													.log("some error in homepage-angular file")
										});

					};
					
					
					$scope.checkthisreservation = function(listing) {
						console.log("entered checkthisreservation");
						console.log("listing.prop_id is " + listing.prop_id);
						$http({
							method : "POST",
							url : '/checkthisreservation',
							data : {
							"listing_id" : listing.prop_id
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in getrequests");

												$scope.listing_in_trips = data.results_length;
												console.log("$scope.listing_in_trips  is: " + $scope.listing_in_trips );

												$scope.youcandeactivatelisting = false;
												$scope.youcantdeactivatelisting = true;	
												
				
											} else {
												console.log("recieved 201");
												$scope.youcandeactivatelisting = true; 
												$scope.youcantdeactivatelisting = false;
											}

										})
								.error(
										function(error) {
											console
													.log("some error in homepage-angular file")
										});

					};					
					
					
					
					
					
					
					

					$scope.createnewlisting = function() {
						console.log("entered createnewlisting");
						window.location.assign("/createnewlisitng");
					};

					/* ADD NEW LISTING */
					$scope.cancellisting = function() {
						console.log("entered cancellisting");
						window.location.assign("/hostlistings");
					};

					$scope.category_value = function(value1) {
						$scope.category_model = value1;
					};


					$scope.findinmap = function() {
						console.log("entered findinmap");
						console.log(street + apt + city + state + street);
						if ($scope.street_model != undefined) {
							if ($scope.apt_model != undefined) {
								if ($scope.city_model != undefined) {
									if ($scope.state_model != "NIL") {
										$scope.full_address = $scope.street_model
												+ ', '
												+ $scope.apt_model
												+ ', '
												+ $scope.city_model
												+ ', ' + $scope.state_model;
									} else {
										$scope.full_address = $scope.street_model
												+ ', '
												+ $scope.apt_model
												+ ', ' + $scope.city_model;
									}
								} else {
									$scope.full_address = $scope.street_model
											+ ', ' + $scope.apt_model;
								}
							} else {
								$scope.full_address = $scope.street_model;
							}
						}

						console.log("full_address is " + $scope.full_address);
						$scope.search_model = $scope.full_address;
					};

					$scope.latlong = function() {
						$scope.lat_model = angular.element($('#lat')).val();
						$scope.long_model = angular.element($('#long')).val();
						console.log("lati is " + $scope.lat_model);
						console.log("longi is " + $scope.long_model);
					};

					//$scope.isitimage = false;
					//var fl;
					
					$scope.uploadImageFile = function(files) {
						console.log('files is ' + files);

						imageFile1 = files;
						noofimages = imageFile1.length;
						
					
					/*fl = document.getElementById('pics');
					fl.onchange = function(e){ 
					var ext = this.value.match(/\.(.+)$/)[1];
					switch(ext)
					{
					case 'jpg':
					//case 'bmp':
					case 'png':
					//case 'tif':
						$scope.isitimage = true;
						console.log("princeishere");
						break;
					default:
						$scope.isitimage = false;
						this.value='';
					}
					};	*/
						
					};
					

					$scope.state_model_fun = function() {
						$scope.state_model="NIL";
					}
					

					$scope.category_model_fun = function() {
						$scope.category_model="NIL";
					}

					$scope.upload_images = function(prop_id) {
						var reqData = new FormData();

						for (var i = 0; i < (imageFile1.length); i++) {
							// image has to be changed with the property id
							// returned by the publish listing function
							var temp = 'image' + i;
							reqData.append(temp, imageFile1[i]);
							
						}

						$http({
							method : 'POST',
							url : '/uploadptyimages/' + prop_id,
							data : reqData,
							headers : {
								'Content-Type' : undefined
							},
							transformRequest : angular.identity
						}).success(function(data) {
							// alert("successfully sent the images");
							 $scope.listing_created=true;
							 $scope.defaultpage=false;
							// MODIFY THIS PART TO REDIRECT TO HOST LISTINGS
							// window.location.assign("/hostintrovideo");
						});

					};
					

					$scope.publishlisting = function() {
						console.log("entered publishlisting");
						$scope.lat_model = angular.element($('#lat')).val();
						$scope.long_model = angular.element($('#long')).val();
						
						
						
						var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.zip_model);
												
						var isValidTitle = /^[A-Za-z0-9_!., ]{0,50}$/.test($scope.title_model);
						// title="Special characters not permitted and maximum of only 25 characters"
						
						var isValidDesc = /^[A-Za-z0-9_!., ]{0,300}$/.test($scope.desc_model);
						// title="Special characters not permitted and maximum of only 300 characters"
					
						var isValidStreet = /^[A-Za-z0-9, ]{0,25}$/.test($scope.street_model);
						// title="Special characters not permitted and enter maximum 25 characters"
						
						var isValidApt = /^[A-Za-z0-9, ]{0,25}$/.test($scope.apt_model);
						// title="Special characters not permitted and enter maximum 25 characters"
						
						var isValidCity = /^[A-Za-z0-9, ]{0,25}$/.test($scope.city_model);
						// title="Special characters not permitted and enter maximum 25 characters"
						
						console.log("isValidZip is "+ isValidZip);
						console.log("isValidTitle is "+ isValidTitle);
						console.log("isValidDesc is "+ isValidDesc);
						console.log("isValidStreet is "+ isValidStreet);
						console.log("isValidApt is "+ isValidApt);
						console.log("isValidCity is "+ isValidCity);
						
						
						if ($scope.lat_model == '')
							$scope.lat_model = undefined;
						if ($scope.long_model == '')
							$scope.long_model = undefined;
						
						//console.log("$scope.isitimage is "+ $scope.isitimage);
						//console.log("isValidZip is "+ isValidZip);

						/*if (($scope.from_date_model > $scope.to_date_model) || ($scope.from_date_model == $scope.to_date_model))
							console.log("BOWWWWWWW");
						else
							console.log("MEOOOOOOOOW");*/

						console.log($scope.title_model + ', '
								+ $scope.category_model + ', '
								+ $scope.desc_model + ', '
								+ $scope.guests_model + ', '
								+ $scope.rooms_model + ', ' + $scope.beds_model
								+ ', ' + $scope.street_model + ', '
								+ $scope.apt_model + ', ' + $scope.city_model
								+ ', ' + $scope.state_model + ', '
								+ $scope.zip_model + ', '
								+ $scope.from_date_model + ', '
								+ $scope.to_date_model + ', '
								+ $scope.price_model + ', ' + $scope.week_price
								+ ', ' + $scope.month_price + ', '
								+ $scope.isbiddable_model + ', '
								+ $scope.lat_model + ', ' + $scope.long_model
								+ ', ' + imageFile1

						);
						
						

						if ($scope.title_model != undefined
								&& $scope.category_model != "NIL"
								&& $scope.desc_model != undefined
								&& $scope.guests_model != undefined
								&& $scope.rooms_model != undefined
								&& $scope.beds_model != undefined
								&& $scope.street_model != undefined
								&& $scope.apt_model != undefined
								&& $scope.city_model != undefined
								&& $scope.state_model != "NIL"
								&& $scope.zip_model != undefined
								&& $scope.from_date_model != undefined
								&& $scope.to_date_model != undefined
								&& $scope.price_model != undefined
								&& $scope.isbiddable_model != undefined
								&& $scope.week_price != undefined
								&& $scope.month_price != undefined
								&& $scope.lat_model != undefined
								&& $scope.long_model != undefined
								&& imageFile1 != undefined) {
							console.log("inside outer if of publishlisting");
							
							if (isValidTitle == true && isValidDesc == true && isValidStreet == true && isValidApt == true && isValidCity == true) {  //first inner if
							$scope.invalidcharsininput=false;

							/*if (($scope.category_model == 'Entire Home'
									|| $scope.category_model == 'Private Room' || $scope.category_model == 'Shared Room' )
									&& isNumber($scope.guests_model)
									&& isNumber($scope.rooms_model)
									&& isNumber($scope.beds_model)
									&& isNumber($scope.zip_model)
									&& isNumber($scope.price_model)
									&& (($scope.from_date_model < $scope.to_date_model) || ($scope.from_date_model == $scope.to_date_model)) && isValidZip) { // inner*/
									
							if ( (($scope.from_date_model < $scope.to_date_model) || ($scope.from_date_model == $scope.to_date_model)) && isValidZip) { // inner		
																								// if
								console
										.log("inside inner if of publishlisting");
								console.log("noofimages is " + noofimages);
								if (noofimages <= 15) { // inception if

									$http(
											{
												method : "POST",
												url : '/submitnewlisitng',
												data : {
													"title" : $scope.title_model,
													"category" : $scope.category_model,
													"desc" : $scope.desc_model,
													"guests" : $scope.guests_model,
													"rooms" : $scope.rooms_model,
													"beds" : $scope.beds_model,
													"street" : $scope.street_model,
													"apt" : $scope.apt_model,
													"city" : $scope.city_model,
													"state" : $scope.state_model,
													"zip" : $scope.zip_model,
													"lats" : $scope.lat_model,
													"longs" : $scope.long_model,
													"from_date" : $scope.from_date_model,
													"to_date" : $scope.to_date_model,
													"price" : $scope.price_model,
													"weekprice" : $scope.week_price,
													"monthprice" : $scope.month_price,
													"isbiddable" : $scope.isbiddable_model,
													"noofimages" : noofimages

												}
											})
											.success(
													function(data) {
														// checking the response
														// data for statusCode
														if (data.statusCode == 201) { // error
																						// case
															console
																	.log("some error while trying to create a new listing");
														} else if (data.statusCode == 200) {

															console
																	.log("successfully created new listing; redirecting to listings page");
															// property id
															// should be
															// returned here and
															// passed to
															// upload_images as
															// a parameter
															$scope
																	.upload_images(data.prop_id);
															// window.location.assign("/hostlistings");

														}
													}).error(function(error) {
												// $scope.unexpected_error =
												// true;
												// $scope.invalid_login = false;
											});

								} // inception if
								{
									$scope.pictureno_limit = true;
									$scope.incomplete_listing = false;
									$scope.invalid_entry = false;
									$scope.invalidcharsininput=false;
									
								}

							} // inner if
							else {
								$scope.invalid_entry = true;
								$scope.incomplete_listing = false;
								$scope.invalidcharsininput=false;
								
							}
						} //first inner if
						else {
						$scope.invalidcharsininput=true;	
						$scope.incomplete_listing=false;	
						}
							
						} // outer if
						else {
							$scope.incomplete_listing = true;
							// $scope.pictureno_limit=false;
						}

					};
					


					/* HOST ACCOUNT */
						$scope.deactivate_account = function() {
						$scope.toggle_deactivate = !($scope.toggle_deactivate);	
						$scope.getreservations();
						console.log("reservations.length is: " + $scope.reservations_length);
						
						if($scope.reservations_length==0 || $scope.reservations_length==undefined) {
						$scope.youcandeactivateaccount = true; 
						$scope.youcantdeactivateaccount = false;
						}
						
						else {
						$scope.youcandeactivateaccount = false;
						$scope.youcantdeactivateaccount = true;		
						}
						};

						$scope.cancel_deactivation = function() {
						console.log("entered cancel_deactivation");
						$scope.toggle_deactivate = !($scope.toggle_deactivate);
						//window.location.assign("/hostaccount");
						};



					$scope.confirm_deactivation = function(listing) {
						console.log("entered confirm_deactivation");
						var host_id = 0; // get host_id from the session
						// console.log ("listing.prop_id is " +
						// listing.prop_id);
						$http({
							method : "POST",
							url : '/deactivatehost',
							data : {
							// "host-id" : host_id
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 300) {
												console
														.log("recieved 300 in confirm_deactivation");
												window.location.assign("/home"); 
											} else {
												console
														.log("dint recieeve 300; some error while deactivating host");
											}

										})
								.error(
										function(error) {
											console
													.log("some error in deactivation-angular file")
										});

					};

					/* HOST REQUESTS */
					$scope.getrequests = function() {
						console.log("entered getrequests");
						$http({
							method : "POST",
							url : '/getmyrequests',
							data : {

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in getrequests");
												$scope.requestss = data.requests_list;
												console
														.log("$scope.requestss is "
																+ $scope.requestss);
												//$scope.resultlength = data.results_length;
												$scope.norequests = false;
												$scope.yesrequests = true;
												
												// Pagination
												$scope.currentPage2 = 0;
												$scope.pageSize2 = 2;
												$scope.data2 = [];
												$scope.numberOfPages2 = function() {
													return Math
															.ceil($scope.data2.length
																	/ $scope.pageSize2);
												}
												for (var i = 0; i < data.requests_list.length; i++) {
													$scope.data2.push(i);
												}
												// Pagination end
												
											} else {
												console.log("recieved 201");
												$scope.norequests = true;
												$scope.yesrequests = false;
												// put some default message when
												// no requests
											}

										})
								.error(
										function(error) {
											console
													.log("some error in homepage-angular file")
										});

					};

					//$scope.getrequests();

					$scope.acceptuser = function(requests) {
						console.log("entered acceptrequest");
						// var host_id=0; // get host_id from the session
						// console.log ("listing.prop_id is " +
						// listing.prop_id);
						$http({
							method : "POST",
							url : '/acceptuser',
							data : {
								"propid" : requests.prop_id,
								"userid" : requests.user_id,
								"request_obj" : requests

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 300) {
												console
														.log("recieved 300 in acceptrequest");
												//window.location.assign("/hostrequests"); // have to actually redirect to someother page with divyas bill logic
												
												$scope.requests_accepted = true;													
												$scope.requests_default = false;
												$scope.requests_rejected = false;		
																					
											} else {
												console
														.log("dint recieeve 300; some error acceptrequest");
											}

										}).error(function(error) {
									console.log("some error in acceptrequest")
								});

					};

					$scope.declineuser = function(requests) {
						console.log("entered declinerequest");
						// var host_id=0; // get host_id from the session
						// console.log ("listing.prop_id is " +
						// listing.prop_id);
						$http({
							method : "POST",
							url : '/declineuser',
							data : {
								"propid" : requests.prop_id,
								"userid" : requests.user_id
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 300) {
												console
														.log("recieved 300 in declinerequest");
												//window.location.assign("/hostrequests"); 
												
												$scope.requests_rejected = true;	
												$scope.requests_default = false;
												$scope.requests_accepted = false;
													
											} else {
												console
														.log("dint recieeve 300; some error declinerequest");
											}

										}).error(function(error) {
									console.log("some error in declinerequest")
								});

					};
					
					$scope.gotorequests = function() {
					window.location.assign("/hostrequests"); 	
					}
					
					$scope.gotoinbox = function() {
					window.location.assign("/inbox"); 	
					}

					$scope.seereview = function(requests) {
						console.log("entered seereview");
						$scope.userreviews = !($scope.userreviews);
						$http({
							method : "POST",
							url : '/getthisuserreviews',
							data : {
								"userid" : requests.user_id
							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in seereview");
												$scope.reviews = data.reviews_list;
												console
														.log("$scope.requestss is "
																+ $scope.requestss);
												//$scope.resultlength = data.results_length;
												$scope.yesreviews = true;
												$scope.noreviews = false;
											} else {
												console.log("recieved 201");
												$scope.yesreviews = false;
												$scope.noreviews = true;
												// put some default message when
												// no requests
											}

										})
								.error(
										function(error) {
											console
													.log("some error in seereview-angular file")
										});

					};

					/* HOST UPCOMING RESERVATIONS */
					$scope.getreservations = function() {
						console.log("entered getrequests");
						$http({
							method : "POST",
							url : '/getmyreservations',
							data : {

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in getrequests");
												$scope.reservations = data.reservations_list;
												console
														.log("$scope.requestss is "
																+ $scope.requestss);
												$scope.reservations_length = data.results_length;
												console.log("$scope.reservations_length is: " + $scope.reservations_length);
												$scope.yesreservations = true;
												$scope.noreservations = false;
												
												
												// Pagination
												$scope.currentPage3 = 0;
												$scope.pageSize3 = 2;
												$scope.data3 = [];
												$scope.numberOfPages3 = function() {
													return Math
															.ceil($scope.data3.length
																	/ $scope.pageSize3);
												}
												for (var i = 0; i < data.reservations_list.length; i++) {
													$scope.data3.push(i);
												}
												// Pagination end												
												
												
											} else {
												console.log("recieved 201");
												$scope.yesreservations = false;
												$scope.noreservations = true;
												// put some default message when
												// no requests
											}

										})
								.error(
										function(error) {
											console
													.log("some error in homepage-angular file")
										});

					};

					//$scope.getreservations();

					/* COMPLETED RESERVATIONS */
					/*$scope.reseterrors = function() {
					$scope.invalid_review=false;	
					}*/
					
					$scope.getcompletedreservations = function() {
						console.log("entered getrequests");
						$http({
							method : "POST",
							url : '/getcompletedreservations',
							data : {

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console
														.log("recieved 200 in getrequests");
												$scope.creservations = data.creservations_list;
												console
														.log("$scope.requestss is "
																+ $scope.requestss);
												//$scope.resultlength = data.results_length;
												$scope.yescreservations = true;
												$scope.nocreservations = false;
												
												// Pagination
												$scope.currentPage4 = 0;
												$scope.pageSize4 = 2;
												$scope.data4 = [];
												$scope.numberOfPages4 = function() {
													return Math
															.ceil($scope.data4.length
																	/ $scope.pageSize4);
												}
												for (var i = 0; i < data.creservations_list.length; i++) {
													$scope.data4.push(i);
												}
												// Pagination end												
												
												
												
											} else {
												console.log("recieved 201");
												$scope.yescreservations = false;
												$scope.nocreservations = true;
												// put some default message when
												// no requests
											}

										})
								.error(
										function(error) {
											console
													.log("some error in homepage-angular file")
										});

					};

					//$scope.getcompletedreservations();


					$scope.givereview = function(reservation) {
						console.log('invoked givereview function');
						$scope.rating_model = "";
						$scope.review_model = "";
						$scope.review_validation = true; 
						$scope.reservation = reservation;
					};
					
					/*$scope.rating = function(value) {
						$scope.rating_model = value;
					};*/
					
					$scope.rating = function(reservation,value2) {	
					reservation.rating_model=value2;	
					};


					$scope.submitrating = function(reservation) {
						console.log("entered submitrating");
						//var myreview = angular.element($('#please')).val();
						//console.log("myreview  is " + myreview);
						//console.log("$scope.rating_model  is " + $scope.rating_model);
								
								
						//console.log("reservation.rating_model is " + reservation.rating_model);			
						//console.log("reservation.review_model is " + reservation.review_model);		

						// var host_id=0; // get host_id from the session
						// console.log ("listing.prop_id is " +
						// listing.prop_id);
						
						//if((reservation.rating_model!=undefined && reservation.review_model!=undefined && reservation.review_model!="") && (reservation.rating_model=="Excellent" || reservation.rating_model=="Good" || reservation.rating_model=="Average" || reservation.rating_model=="Bad" || reservation.rating_model=="Very Bad")){
						
						console.log("$scope.reservation.prop_id  is " + $scope.reservation.prop_id);
						console.log("$scope.reservation.user_id  is " + $scope.reservation.user_id);
						console.log("$scope.rating_model  is " + $scope.rating_model);
						console.log("$scope.review_model  is " + $scope.review_model);
						
						//var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test($scope.zip_model);
						//var isValidReview = !/[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test($scope.review_model);
						//var isValidReview = /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/.test($scope.review_model);
						
						//var isValidReview = /^[0-9a-zA-Z!._ ]+$/.test($scope.review_model);
						var isValidReview = /^[0-9a-zA-Z!._ ]{0,300}$/.test($scope.review_model);
						
						console.log("isValidReview  is " + isValidReview);
						
						if (isValidReview==true){
						if ($scope.review_model == undefined || $scope.review_model == "") 
						{
						$scope.review_validation = false; 
						$scope.invalidcharreview = false;
						}
						else 
						{
							
							if ($scope.rating_model == undefined  || $scope.rating_model == "") 
							{
							$scope.rating_model = 1;
							}	
							
						$http({
							method : "POST",
							url : '/submituserrating',
							data : {
								"userid" : $scope.reservation.user_id,
								"propid" : $scope.reservation.prop_id,
								"review" : $scope.review_model,
								"rating" : $scope.rating_model,

							}
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 300) {
												console
														.log("recieved 300 in submitrating");
												window.location
														.assign("/completedreservations"); // actually redirect
											} else {
												console
														.log("dint recieeve 300; some error submitrating");
											}

										}).error(function(error) {
									console.log("some error in declinerequest")
								});
						//}	
						//else {
						//$scope.invalid_review=true;	
						//}
						}
						}
						else {
						$scope.invalidcharreview = true;	
						$scope.review_validation = true; 	
						}
						
					};

					
					$scope.closeReview = function() {
						console.log("closing the review");
						//window.location.assign("/trips");
						$scope.rating_model = "";
						$scope.review_model = "";
						$scope.review_validation = true; 
						
					}

					// ashna
					getProfilePicFileName();

					function getProfilePicFileName() {
						$http({
							method : "GET",
							url : '/getImageUrl'
						})
								.success(
										function(data) {
											// checking the response data for
											// statusCode
											if (data.statusCode == 200) {
												console.log(data);
												$scope.imageUrl = "http://localhost:3001/getImageByUrl?profile_pic="
														+ data.url;

											} else {

											}
											// Making a get call to the
											// '/redirectToHomepage' API
											// window.location.assign("/homepage");
										}).error(function(error) {

								});
					}
					
					
					// divya
					$scope.rateFunction = function(rating) {
						console.log('Rating selected - ' + rating);
						$scope.rating_model = rating;
					};
					

				}).directive(
				'starRating',
				function() {

					return {
						restrict : 'A',
						template : '<ul class="rating">'
								+ '	<li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">'
								+ '    <i class="fa fa-star"></i>' + '</li>'
								+ '</ul>',
						scope : {
							ratingValue : '=',
							max : '=',
							onRatingSelected : '&'
						},
						link : function(scope, elem, attrs) {
							var updateStars = function() {
								scope.stars = [];
								for (var i = 0; i < scope.max; i++) {
									scope.stars.push({
										filled : i < scope.ratingValue
									});
								}
							};

							scope.toggle = function(index) {
								scope.ratingValue = index + 1;
								scope.onRatingSelected({
									rating : index + 1
								});
							};

							scope.$watch('ratingValue',
									function(oldVal, newVal) {
										if (newVal) {
											updateStars();
										}
									});
						}
					};

				});
