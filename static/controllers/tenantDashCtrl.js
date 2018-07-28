angular.module("jmp").controller("tenantDashCtrl", function($scope, $http, Upload, $uibModal, $window, stripe_publishable_key){
	$scope.offset = 0;
	$scope.page = 1;
	$scope.date = new Date();
	$scope.lastday = function(y,m){
		return new Date(y, m +1, 0).getDate();
	};
	$scope.day = $scope.lastday($scope.date.getFullYear(),$scope.date.getMonth()); 
	$scope.getGrievances = function(){
		$http.get("/grievance/open").then(function(response){
			$scope.grievances_open = response.data.rows;
			$scope.grievances_open_count = response.data.count;
			$http.get("/grievance/closed").then(function(response){				
				$scope.grievances_closed = response.data.rows;
			}, function(err){
				console.log(err);
			});
		}, function(err){
			console.log(err);
		});
	};
	$scope.getPayments = function(){
		$http.get("/payment?offset=" + $scope.offset).then(function(response){
			$scope.paymentcount = response.data.count;
			$scope.payments = response.data.rows;
			$scope.isMonthPaid = response.data.isMonthPaid;
			$scope.pageCount = Math.ceil(response.data.count / 5);
			if(!$scope.isMonthPaid){
				var stripe = Stripe(stripe_publishable_key);
				var elements = stripe.elements();
				var style = {
					base: {
						color: "#32325d",
						fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
						fontSmoothing: "antialiased",
						fontSize: "16px",
						"::placeholder": {
							color: "#aab7c4"
						}
					},
					invalid: {
						color: "#fa755a",
						iconColor: "#fa755a"
					}
				};
				var card = elements.create("card", {style: style});
				card.mount("#card-element");
				card.addEventListener("change", function(event) {
					var displayError = document.getElementById("card-errors");
					if (event.error) {
						displayError.textContent = event.error.message;
					} else {
						displayError.textContent = "";
					}
				});
				var form = document.getElementById("payment-form");
				form.addEventListener("submit", function(event) {
					event.preventDefault();
					stripe.createToken(card).then(function(result) {
						console.log(result)
						if(result.error){
							var errorElement = document.getElementById("card-errors");
							errorElement.textContent = result.error.message;
						}
						else {
							stripeTokenHandler(result.token);
						}
					});
				});
				function stripeTokenHandler(token) {
					$http.post("/payment", {
						token: token.id,
						PaymentAmount: $scope.unit.UnitRent
					}).then(function(response){
						if(response){
							$scope.getPayments();
							alert("Payment Complete");
						}
					}, function(err){
						console.log(err);
					});
				}
			}
		}, function(err){
			console.log(err);
		});
	};
	async.parallel({
		getContacts: function(callback){
			$http.get("/tenant/unit/property").then(function(response){
				$http.get("/property/contact/" + response.data.PropertyID).then(function(response){
					return callback(null, response.data);
				}, function(err){
					return callback(err);
				});
			}, function(err){
				return callback(err);
			});
		},
		getDocuments: function(callback){
			$http.get("/tenant/documents").then(function(response){
				return callback(null, response.data);
			}, function(err){
				return callback(err);
			});
		},
		getPayments: function(callback){
			$scope.getPayments();
			return callback(null, null);
		},
		getGrievances: function(callback){
			$scope.getGrievances();
			return callback(null, null)
		},
		getUnit: function(callback){
			$http.get("/unit/rent").then(function(response){
				return callback(null, response.data);
			}, function(err){
				return callback(err);
			});
		},
	}, function(err, results){
		if(err) console.log(err);
		$scope.contacts = results.getContacts;
		$scope.documents = results.getDocuments;
		$scope.unit = results.getUnit;
	});
	$scope.openMessageThreadModal = function(selectedGrievance){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/message_thread.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$http.get("/grievance/messages/" + selectedGrievance).then(function(response){
					$scope.GrievanceMessages = response.data;
				}, function(err){
					console.log(err);
				});
				$scope.createComplaintMessage = function(){
					$http.post("/grievance/message/tenant", {
						GrievanceID: selectedGrievance,
						GrievanceMessage: $scope.GrievanceMessage
					}).then(function(response){
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openComplaintModal = function(){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/complaint_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance, getGrievances){
				$http.get("/grievance/categories").then(function(response){
					$scope.grievance_categories = response.data;
				}, function(err){
					console.log(err);
				});
				$scope.createComplaint = function(){
					$http.post("/grievance", {
						GrievanceCategoryID: $scope.NewComplaintForm.selectedGrievanceCategory.GrievanceCategoryID,
						GrievanceMessage: $scope.NewComplaintForm.GrievanceMessage
					}).then(function(response){
						if(response){
							getGrievances();
							$uibModalInstance.close();
						}
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg",
			resolve:{
				getGrievances: function(){
					return $scope.getGrievances;
				}
			}
		});
	};
	$scope.generateDocument = function(documentID){
		$window.open("/tenant/document/" + documentID);
	};
	$scope.closeGreivance = function(greivanceid){
		$http.delete("/grievance/" + greivanceid).then(function(response){
			if(response){
				$scope.getGrievances();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.go = function(num){
		$scope.page = $scope.page + num;
		$scope.offset = ($scope.page - 1) * 5;
		$scope.getPayments();
	};
	$scope.goTo = function(num){
		$scope.page = num;
		$scope.offset = ($scope.page - 1) * 5;
		$scope.getPayments();
	};
	$scope.pageList = function(num){
		return new Array(num);   
	};
	$scope.isObjectEmpty = function(card){
		if(card) return Object.keys(card).length === 0;
		else return true;
	};
});