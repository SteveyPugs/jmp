angular.module("jmp").controller("tenantDashCtrl", function($scope, $http, Upload, $uibModal, $window){
	$scope.offset = 0;
	$scope.page = 1;
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
			$http.get("/payment?offset=" + $scope.offset).then(function(response){
				return callback(null, {
					paymentcount: response.data.count,
					payments: response.data.rows,
					pagecount: Math.ceil(response.data.count / 5)
				});
			}, function(err){
				return callback(err);
			});
		},
		getPaymentOption: function(callback){
			$http.get("/payment/option").then(function(response){
				return callback(null, response.data);
			}, function(err){
				return callback(err);
			});
		},
		getGrievances: function(callback){
			var gObject = {};
			$http.get("/grievance/open").then(function(response){
				gObject.grievances_open = response.data.rows;
				gObject.grievances_open_count = response.data.count;
				$http.get("/grievance/closed").then(function(response){
					gObject.grievances_closed = response.data.rows;
					return callback(null, gObject);
				}, function(err){
					return callback(err);
				});
			}, function(err){
				return callback(err);
			});
		}
	}, function(err, results){
		if(err) console.log(err);
		$scope.contacts = results.getContacts;
		$scope.documents = results.getDocuments;
		$scope.paymentcount = results.getPayments.paymentcount;
		$scope.payments = results.getPayments.payments;
		$scope.pageCount = results.getPayments.pagecount;
		$scope.paymentSetting = results.getPaymentOption;
		$scope.grievances_open = results.getGrievances.grievances_open;
		$scope.grievances_open_count = results.getGrievances.grievances_open_count;
		$scope.grievances_closed = results.getGrievances.grievances_closed;
	});
	$scope.openPaymentModal = function(){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/payment_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$http.get("/payment/options").then(function(response){
					$scope.paymentoptions = response.data;
				}, function(err){
					console.log(err);
				});
				$scope.createNewPayment = function(){
					$http.post("/payment", {
						PaymentOptionID: $scope.NewPaymentForm.selectedPaymentType.PaymentOptionID,
						PaymentAmount: $scope.NewPaymentForm.PaymentAmount
					}).then(function(response){
						if(response){
							$uibModalInstance.close();
			// 				$scope.getPaymentInformation();
						}
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
	$scope.openPaymentOptionModal = function(){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/payment_option.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.createNewPaymentOption = function(){
					$http.post("/payment/option", {
						PaymentOptionCreditCardNumber: $scope.NewPaymentOptionForm.PaymentOptionCreditCardNumber,
						PaymentOptionCreditCardExpiration: $scope.NewPaymentOptionForm.PaymentOptionCreditCardExpirationMonth ? $scope.NewPaymentOptionForm.PaymentOptionCreditCardExpirationMonth + "/" + $scope.NewPaymentOptionForm.PaymentOptionCreditCardExpirationYear : null,
						PaymentOptionCreditCardCVV: $scope.NewPaymentOptionForm.PaymentOptionCreditCardCV,
						PaymentOptionCheckingRouting: $scope.NewPaymentOptionForm.PaymentOptionCheckingRouting,
						PaymentOptionCheckingAccount: $scope.NewPaymentOptionForm.PaymentOptionCheckingAccount
					}).then(function(response){
						if(response){
							$uibModalInstance.close();
			// 				$scope.getPaymentInformation();
						}
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
			controller: function($scope, $uibModalInstance){
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
			size: "lg"
		});
	};
	$scope.generateDocument = function(documentID){
		$window.open("/tenant/document/" + documentID);
	};
	$scope.closeGreivance = function(greivanceid){
		$http.delete("/grievance/" + greivanceid).then(function(response){
			if(response){
				// $scope.getGrievances();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.go = function(num){
		$scope.page = $scope.page + num;
		$scope.offset = ($scope.page - 1) * 5;
		$scope.getPaymentInformation();
	};
	$scope.goTo = function(num){
		$scope.page = num;
		$scope.offset = ($scope.page - 1) * 5;
		$scope.getPaymentInformation();
	};
	$scope.pageList = function(num){
		return new Array(num);   
	};
	$scope.isObjectEmpty = function(card){
		if(card) return Object.keys(card).length === 0;
		else return true;
	};
});