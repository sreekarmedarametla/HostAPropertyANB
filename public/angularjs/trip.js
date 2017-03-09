var trip = angular.module('trip', []);
// defining the login controller

trip.filter("trustUrl", ['$sce', function ($sce) 
                            {
                                    
                            return function (recordingUrl) 
                            {
                                       
                             return $sce.trustAsResourceUrl(recordingUrl);
                                    
                            };
                                
                            }]);

trip
		.controller(
				'trip',
				function($scope, $http, $filter) {

					
					$scope.date_error = true;
					$scope.unexpected_error = true;
					
					$scope.bid_success = true;
					$scope.validation_error = true;
					$scope.providereview = false;
					$scope.review_success = true;
					$scope.no_review = true;
					$scope.readreview = false;
					$scope.no_pasttrips = true;
					$scope.no_pendingtrips = true;
					$scope.no_confirmedtrips = true;
					$scope.rating = 5;
					$scope.startrating = 1;
					$scope.review_validation = true;
					// $scope.review_submitted = false;

					// getSession();
					getProfilePicFileName();
					getProfile();

					
					$scope.parent = {
						checkOut : ''
					};

					$scope.property = window.listing;
					var prop = $scope.property;

					if (prop != undefined) {
						for (i = 0; i < prop.length; i++) {
							prop = prop.replace('&#34;', '"');
						}
						prop = JSON.parse(prop);
						console.log(prop);
						$scope.property = prop;
					}

					$scope.no_of_guests = window.no_of_guests;
					var no_of_guests = $scope.no_of_guests;
					if (no_of_guests != undefined) {
						for (i = 0; i < no_of_guests.length; i++) {
							no_of_guests = no_of_guests.replace('&#34;', '"');
						}
						no_of_guests = JSON.parse(no_of_guests);
						console.log(no_of_guests);
						$scope.no_of_guests = no_of_guests;
					}

					
					
					$scope.airbnbV = 'http://localhost:3001/getintrovideo/?host_id=' + $scope.property.host_id;
					
					 
					 $scope.getNumber = function() {
						    return new Array($scope.property.noofimages);   
						}
					 
					 /*propReviews ();
					 function propReviews(){
						 console.log("inside getPropertyReviews");
						 console.log($scope.property.prop_id);
						$http({
							method : "POST",
							url : '/getPropertyReviews',
							data : {"prop_id" : $scope.property.prop_id}
						})
								.success(
										function(data) {
												$scope.propReviews = data.rating;
											console.log(data.rating);
										}).error(function(error) {

								});
					}*/
					 
					$scope.avgrating1 = window.avgrating;
					var avgrating1 = $scope.avgrating1;
					if (avgrating1 != undefined) {
						for (i = 0; i < avgrating1.length; i++) {
							avgrating1 = avgrating1.replace('&#34;', '"');
						}
						avgrating1 = JSON.parse(avgrating1);
						console.log(avgrating1);
						$scope.avgrating1 = avgrating1;
					}

					$scope.bid = function() {
						console.log("here");
						console.log($scope.bid_amt);
						if ($scope.check_in == undefined
								|| $scope.check_out == undefined
								|| $scope.no_of_guests == undefined) {
							
							
							$scope.unexpected_error = true;
							$scope.validation_error = false;

						} else {
							$http({
								method : "POST",
								url : '/bid',
								data : {
									"bid_amt" : $scope.bid_amt,
									"property" : $scope.property,
									"no_of_guests" : $scope.no_of_guests,
									"check_out" : $scope.check_out,
									"check_in" : $scope.check_in
								}
							}).success(function(data) {
								// checking the response data for statusCode
								 if (data.statusCode == 200) {
									console.log("made offer");
									$scope.bid_success = false;
									
									$scope.unexpected_error = true;
									$scope.validation_error = true;

								} else {
									console.log("cannot make offer");
									$scope.bid_success = true;
									
									
									$scope.unexpected_error = false;
									$scope.validation_error = true;

								}
								// Making a get call to the
								// '/redirectToHomepage' API
								// window.location.assign("/homepage");
							}).error(function(error) {
								$scope.bid_success = true;
								
								
								$scope.unexpected_error = false;
								$scope.validation_error = true;
							});
						}
					}

					
					getHostProfilePicFileName();
					function getSession() {
						$http({
							method : "GET",
							url : '/getSession'
						}).success(function(data) {
							// checking the response data for statusCode
							if (data.statusCode == 200) {
								console.log("session exists");

								getProfile();
							} else {

								window.location.assign("/");
							}
							// Making a get call to the
							// '/redirectToHomepage' API
							// window.location.assign("/homepage");
						}).error(function(error) {
							$scope.validlogin = true;
							$scope.invalid_login = true;
						});
					}

					function getProfilePicFileName() {
						$http({
							method : "GET",
							url : '/getImageUrl'
						})
								.success(
										function(data) {
											// checking the response
											// data for statusCode
											if (data.statusCode == 200) {
												console.log("get host");
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

					function getProfile() {
						$http({
							method : "POST",
							url : '/getProfile'
						}).success(function(data) {
							// checking the response data for statusCode
							if (data.statusCode == 200) {
								console.log(data);
								$scope.profile = data.profile;

							} else {

							}
							// Making a get call to the
							// '/redirectToHomepage' API
							// window.location.assign("/homepage");
						}).error(function(error) {
							$scope.validlogin = true;
							$scope.invalid_login = true;
						});
					}

					$scope.becomeHost = function() {
						console.log("become host");
						$http({
							method : "POST",
							url : '/becomeHost'
						}).success(function(data) {
							console.log("sent request to admin");
							window.location.assign("/home");
						}).error(function(error) {
							console.log("could not sent request to admin");
						});

					}

					function days_between(date1, date2) {

						// The number of milliseconds in one day
						var ONE_DAY = 1000 * 60 * 60 * 24

						// Convert both dates to milliseconds
						var date1_ms = date1.getTime()
						var date2_ms = date2.getTime()

						// Calculate the difference in milliseconds
						var difference_ms = Math.abs(date1_ms - date2_ms)

						// Convert back to days and return
						return Math.round(difference_ms / ONE_DAY)

					}

					function getHostProfilePicFileName() {
						$http({
							method : "POST",
							url : '/getHostImageUrl',
							data : {
								"user_id" : $scope.property.host_id
							}
						})
								.success(
										function(data) {
											// checking the response
											// data for statusCode
											if (data.statusCode == 200) {
												console.log("get url");
												$scope.hostImageUrl = "http://localhost:3001/getImageByUrl?profile_pic="
														+ data.url;
												console
														.log($scope.hostImageUrl);
											} else {

											}
											// Making a get call to the
											// '/redirectToHomepage' API
											// window.location.assign("/homepage");
										}).error(function(error) {

								});
					}

					$scope.viewPhotos = function() {
						console.log("vuew");
					}

					/*
					 * $scope.loadProperty = function() {
					 * 
					 * $http.get('/propertyDetail').success(function(data) {
					 * console.log(data); $scope.property = data; }) };
					 */

					$scope.listTrips = function() {

						$http
								.get('/getPendingTrips')
								.success(
										function(data) {
											if (data.statusCode == 200) {

												$scope.pendingTrips = data.trips;
												// Pagination

												$scope.currentPage1 = 0;
												$scope.pageSize1 = 1;
												$scope.data1 = [];
												$scope.numberOfPages1 = function() {
													return Math
															.ceil($scope.data1.length
																	/ $scope.pageSize1);
												}
												for (var i = 0; i < data.trips.length; i++) {
													$scope.data1.push(i);
												}

												// Pagination end

											} else if (data.statusCode == 440) {

												$scope.unexpected_error = true;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = true;
												// $scope.no_pasttrips = true;
												$scope.no_pendingtrips = false;
												// $scope.no_confirmedtrips =
												// true;

											} else {

												$scope.unexpected_error = false;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = false;
												$scope.no_pasttrips = true;
												$scope.no_pendingtrips = true;
												$scope.no_confirmedtrips = true;
											}

										})
						$http
								.get('/getConfirmedTrips')
								.success(
										function(data) {

											if (data.statusCode == 200) {

												$scope.confirmedTrips = data.trips;
												// Pagination

												$scope.currentPage2 = 0;
												$scope.pageSize2 = 1;
												$scope.data2 = [];
												$scope.numberOfPages2 = function() {
													return Math
															.ceil($scope.data2.length
																	/ $scope.pageSize2);
												}
												for (var i = 0; i < data.trips.length; i++) {
													$scope.data2.push(i);
												}

												// Pagination end

											} else if (data.statusCode == 440) {

												$scope.unexpected_error = true;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = false;
												// $scope.no_pasttrips = true;
												// $scope.no_pendingtrips =
												// true;
												$scope.no_confirmedtrips = false;

											} else {

												$scope.unexpected_error = false;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = true;
												$scope.no_pasttrips = true;
												$scope.no_pendingtrips = true;
												$scope.no_confirmedtrips = true;
											}

										})

						$http
								.get('/getPastTrips')
								.success(
										function(data) {

											if (data.statusCode == 200) {

												$scope.pastTrips = data.trips;

												// Pagination

												$scope.currentPage3 = 0;
												$scope.pageSize3 = 3;
												$scope.data3 = [];
												$scope.numberOfPages3 = function() {
													return Math
															.ceil($scope.data3.length
																	/ $scope.pageSize3);
												}
												for (var i = 0; i < data.trips.length; i++) {
													$scope.data3.push(i);
												}

												// Pagination end

											} else if (data.statusCode == 440) {

												$scope.unexpected_error = true;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = false;
												$scope.no_pasttrips = false;
												// $scope.no_pendingtrips =
												// true;
												// $scope.no_confirmedtrips =
												// true;

											} else {

												$scope.unexpected_error = false;
												$scope.review_success = true;
												$scope.no_review = true;
												// $scope.readreview = true;
												$scope.no_pasttrips = true;
												$scope.no_pendingtrips = true;
												$scope.no_confirmedtrips = true;
											}

										})

					};

					$scope.bookTrip = function() {

						
						
						if ($scope.check_in == undefined
								|| $scope.check_out == undefined
								|| $scope.no_of_guests == undefined) {
							
							$scope.unexpected_error = true;
							$scope.validation_error = false;

						} else {
							
							var checkIn = $filter('date')(
									$scope.check_in,
									"yyyy-MM-dd");
							var checkOut = $filter('date')(
									$scope.check_out,
									"yyyy-MM-dd");
							var url = "/bookTrip?checkIn="
									+ checkIn + "&checkOut="
									+ checkOut
									+ "&no_of_guests="
									+ $scope.no_of_guests
									+ "&propId="
									+ $scope.property.prop_id;

							console.log(url);
							window.location.assign(url);
						}
					};

					function checkExpiryDate() {

						var month = angular.element($('#card_month')).val();
						var year = angular.element($('#card_year')).val();

						var today = new Date();
						var expiry = new Date(year, month);
						if (today.getTime() > expiry.getTime())

							return false;
						else
							return true;
					}
					;

					$scope.changeTrip = function() {

						if ($scope.check_in == undefined
								|| $scope.check_out == undefined
								|| $scope.no_of_guests == undefined) {
						
							
							$scope.unexpected_error = true;
							$scope.validation_error = false;

						} else {
							var checkIn = $filter('date')($scope.check_in,
									"yyyy-MM-dd");
							var checkOut = $filter('date')($scope.check_out,
									"yyyy-MM-dd");

							$http({
								method : "POST",
								url : '/change',
								data : {
									"no_of_guests" : $scope.no_of_guests,
									"check_out" : checkOut,
									"check_in" : checkIn
								}
							}).success(function(data) {
								if (data.statusCode == 400) {
									
									
									$scope.unexpected_error = true;
									$scope.validation_error = true;

								} else if (data.statusCode == 440) {
									
									
									$scope.unexpected_error = true;
									$scope.validation_error = true;

								} else if (data.statusCode == 200) {

									window.location.assign('/trips');
								}

							}).error(function(error) {
								$scope.unexpected_error = false;
								
								
								$scope.validation_error = true;

							});
						}

					};

					$scope.resetErrors = function() {
						
						$scope.date_error = true;
						$scope.unexpected_error = true;
						
						$scope.bid_success = true;
						$scope.review_success = true;
						$scope.no_review = true;
						$scope.validation_error = true;

					};

					$scope.checkout = function(avgrating) {
						
						var datecheck = checkExpiryDate();
						if(datecheck==false){
							$scope.date_error = false;
						}

						 else {

							$http({
								method : "POST",
								url : '/checkouttrip',
								data : {
									"no_of_guests" : $scope.no_of_guests,
									"property" : $scope.property,
									/*
									 * "check_out" : $scope.check_out,
									 * "check_in" : $scope.check_in, "nights" :
									 * $scope.nights, "subtotal" :
									 * $scope.subtotal, "total" : $scope.total,
									 */
									"cardNumber" : $scope.cardNumber,
									"month" : $scope.month,
									"year" : $scope.year,
									"cvv" : $scope.cvv,
									"firstname" : $scope.firstname,
									"lastname" : $scope.lastname,
									"zip" : $scope.zip
								}
							})
									.success(
											function(data) {
												if (data.statusCode == 200) {
													var url = "/tripConfirmation?no_of_guests="
															+ $scope.no_of_guests
															+ "&propId="
															+ $scope.property.prop_id
															+ "&avgrating="
															+ avgrating;

													console.log(url);
													window.location.assign(url);
												} else if (data.statusCode == 400) {

													$scope.date_error = true;
													
													$scope.unexpected_error = false;
													

												} 

											}).error(function(error) {
										
										$scope.date_error = true;
										
										$scope.unexpected_error = false;
										

									});
						}

					};

					$scope.alterTrip = function(trip) {

						var url = "/alterations?tripId=" + trip.trip_id;

						console.log(url);
						window.location.assign(url);
					};

					$scope.cancelTrip = function() {

						$http.get('/cancel').success(function(data) {
							console.log("successfully deleted");
							window.location.assign('/trips');

						})

					};

					$scope.givereview = function(trip) {
						console.log('invoked uploadvideo function');
						$scope.trip = trip;
						console.log("hi " + $scope.trip.trip_id);
						$scope.providereview = true;

					};
					$scope.readreview = function(trip) {
						console.log('invoked uploadvideo function');
						$scope.trip_new = trip;
						console.log("hi " + $scope.trip_new.trip_id);
						

					};
					$scope.viewreceipt = function(trip) {
						console.log('invoked uploadvideo function');
						$scope.trip_bill = trip;
						console.log("hi " + $scope.trip_bill.trip_id);
						

					};
					
					$scope.rating = function(value) {
						$scope.rating_model = value;
					};

					$scope.rateFunction = function(rating) {
						console.log('Rating selected - ' + rating);
						$scope.rating_model = rating;
					};

					$scope.closeReview = function() {
						console.log("closing the review");
						// window.location.assign("/trips");
						$scope.rating_model = "";
						$scope.review_model = "";
						$scope.review_validation = true;

					}

					$scope.submitrating = function() {
						console.log("entered submitrating");

						if ($scope.review_model == undefined
								|| $scope.review_model == "") {
							$scope.unexpected_error = true;
							$scope.review_success = true;
							$scope.no_review = true;
							// $scope.readreview = false;
							$scope.no_pasttrips = true;
							$scope.no_pendingtrips = true;
							$scope.no_confirmedtrips = true;
							$scope.providereview = false;
							$scope.review_validation = false;

						} else {

							if ($scope.rating_model == undefined
									|| $scope.rating_model == "") {
								$scope.rating_model = 1;
							}

							$http({
								method : "POST",
								url : '/submitrating',
								data : {
									"trip" : $scope.trip,
									"review" : $scope.review_model,
									"rating" : $scope.rating_model

								}
							}).success(function(data) {

								if (data.statusCode == 200) {

									window.location.assign("/trips");

									/*
									 * $scope.unexpected_error = true;
									 * $scope.review_success = false;
									 * $scope.no_review = true; //
									 * $scope.readreview = false;
									 * $scope.no_pasttrips = true;
									 * $scope.no_pendingtrips = true;
									 * $scope.no_confirmedtrips = true;
									 * $scope.review_validation = true;
									 * //$scope.review_submitted = true; //
									 * $scope.providereview = false; //
									 * angular.element($('#please')).value="";
									 * $scope.rating_model = "";
									 * $scope.review_model = ""; $scope.rating =
									 * 1; $scope.startrating = 1;
									 * $scope.trip.review = $scope.review_model;
									 * $scope.trip.rating = $scope.rating_model;
									 */

								} else {

									$scope.unexpected_error = false;
									// $scope.review_submitted = false;
									$scope.review_success = true;
									$scope.no_review = true;
									// $scope.readreview = false;
									$scope.no_pasttrips = true;
									$scope.no_pendingtrips = true;
									$scope.no_confirmedtrips = true;
									$scope.providereview = false;
									$scope.review_validation = true;
								}

							}).error(function(error) {

								$scope.unexpected_error = false;
								$scope.review_success = true;
								$scope.no_review = true;
								// $scope.readreview = false;
								$scope.no_pasttrips = true;
								$scope.no_pendingtrips = true;
								$scope.no_confirmedtrips = true;
								$scope.providereview = false;
								$scope.review_validation = true;
							});
						}

					};

					/*
					 * $scope.givereview = function() { console.log('invoked
					 * uploadvideo function'); $scope.providereview =
					 * !($scope.providereview); };
					 */

					$scope.getreview = function(trip) {

						console.log(trip.trip_id);
						$http({
							method : "POST",
							url : '/getUserReview',
							data : {
								"trip" : trip

							}
						}).success(function(data) {

							if (data.statusCode == 200) {

								$scope.userReview = data.review;
								$scope.readreview = true;
								console.log("got the review");

							} else if (data.statusCode == 440) {

								$scope.unexpected_error = true;
								$scope.review_success = true;
								$scope.no_review = false;
								$scope.readreview = false;
								$scope.no_pasttrips = true;
								$scope.no_pendingtrips = true;
								$scope.no_confirmedtrips = true;

							} else {

								console.log()

								$scope.unexpected_error = false;
								$scope.review_success = true;
								// $scope.no_review = true;
								$scope.readreview = false;
								$scope.no_pasttrips = true;
								$scope.no_pendingtrips = true;
								$scope.no_confirmedtrips = true;
							}

						}).error(function(error) {

							$scope.unexpected_error = false;
							$scope.review_success = true;
							$scope.no_review = true;
							$scope.readreview = false;
							$scope.no_pasttrips = true;
							$scope.no_pendingtrips = true;
							$scope.no_confirmedtrips = true;
						});

					};

					$scope.getPropReviews = function() {

						console.log("get prop review");
						$http({
							method : "POST",
							url : '/getPropReviews',
							data : {
								"propertyId" : $scope.property.prop_id

							}
						}).success(function(data) {

							if (data.statusCode == 200) {

								$scope.reviews = data.reviews;
								$scope.avgrating = data.avgrating;
								// $scope.avgrating = 0;
								$scope.count = data.count;
								// $scope.count = 0;

							} else if (data.statusCode == 440) {

								$scope.count = 0;

							} else {
								$scope.unexpected_error = false;
							}

						}).error(function(error) {

							$scope.unexpected_error = false;
							$scope.review_success = true;
							$scope.no_review = true;
							$scope.readreview = false;
							$scope.no_pasttrips = true;
							$scope.no_pendingtrips = true;
							$scope.no_confirmedtrips = true;
						});

					};

				})
		.directive(
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

trip.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);

		for (var i = 0; i < total; i++) {
			input.push(i);
		}

		return input;
	};
});
trip.filter('rangenew', function() {
	return function(input, total) {
		total = parseInt(total);

		for (var i = total; i < 5; i++) {
			input.push(i);
		}

		return input;
	};
});

trip.filter('startFrom', function() {
	return function(input, start) {
		start = +start; // parse to int
		return input.slice(start);
	}
	
	
	
});
