app.controller("TenantController", function($scope, $http) {
	$scope.offset = 0;
	$scope.page = 1;
	$scope.getPaymentInformation = function(){
		$http.get("/payment/option").then(function(response){
			$scope.paymentSetting = response.data;
		}, function(err){
			console.log(err);
		});
		$http.get("/payment?offset=" + $scope.offset).then(function(response){
			$scope.paymentcount = response.data.count;
			$scope.payments = response.data.rows;
			$scope.pageCount = Math.ceil(response.data.count / 5);
		}, function(err){
			console.log(err);
		});
		$http.get("/tenant/unit/property").then(function(response){
			$http.get("/property/contact/" + response.data.PropertyID).then(function(response){
				$scope.contacts = response.data;
			}, function(err){
				console.log(err);
			});
		}, function(err){
			console.log(err);
		});
	};
	$scope.getPaymentInformation();
	$scope.getGrievances = function(){
		$http.get("/grievance/open").then(function(response){
			$scope.grievances_open = response.data.rows;
			$scope.grievances_open_count = response.data.count;
		}, function(err){
			console.log(err);
		});
		$http.get("/grievance/closed").then(function(response){
			$scope.grievances_closed = response.data.rows;
		}, function(err){
			console.log(err);
		});
	};
	$scope.getMessages = function(id){
		$http.get("/grievance/messages/" + id).then(function(response){
			$scope.GrievanceMessages = response.data;
			$("#NewComplaintMessage").get(0).reset();
		}, function(err){
			console.log(err);
		});
	};
	$scope.getGrievances();
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
	$("#PaymentOption").on("show.bs.modal", function (e) {
		$("#NewPaymentOptionCredit").get(0).reset();
		$("#NewPaymentOptionCheck").get(0).reset();
	});
	$("#Complaint").on("show.bs.modal", function (e) {
		$("#NewComplaint").get(0).reset();
		$http.get("/grievance/categories").then(function(response){
			$scope.grievance_categories = response.data;
		}, function(err){
			console.log(err);
		});
	});
	$("#PaymentOne").on("show.bs.modal", function (e) {
		$("#OneTimePayment").get(0).reset();
		$http.get("/payment/options").then(function(response){
			$scope.paymentoptions = response.data;
		}, function(err){
			console.log(err);
		});
	});
	$("#ComplaintThread").on("show.bs.modal", function (e) {
		$scope.GrievanceMessage = null;
		$scope.GrievanceID = $(e.relatedTarget).data("greivanceid");
		$scope.getMessages($(e.relatedTarget).data("greivanceid"));
	});
	$scope.addPaymentOption = function(){
		$http.post("/payment/option", {
			PaymentOptionCreditCardNumber: $scope.PaymentOptionCreditCardNumber,
			PaymentOptionCreditCardExpiration: $scope.PaymentOptionCreditCardExpirationMonth ? $scope.PaymentOptionCreditCardExpirationMonth + "/" + $scope.PaymentOptionCreditCardExpirationYear : null,
			PaymentOptionCreditCardCVV: $scope.PaymentOptionCreditCardCV,
			PaymentOptionCheckingRouting: $scope.PaymentOptionCheckingRouting,
			PaymentOptionCheckingAccount: $scope.PaymentOptionCheckingAccount
		}).then(function(response){
			if(response){
				$scope.PaymentOptionCreditCardNumber = null;
				$scope.PaymentOptionCreditCardExpirationMonth = null;
				$scope.PaymentOptionCreditCardExpirationYear = null;
				$scope.PaymentOptionCreditCardCV = null;
				$scope.PaymentOptionCheckingRouting = null;
				$scope.PaymentOptionCheckingAccount = null;
				$("#NewPaymentOptionCredit").get(0).reset();
				$("#NewPaymentOptionCheck").get(0).reset();
				$("#PaymentOption").modal("hide");
				$scope.getPaymentInformation();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.addPaymentSingle = function(){
		$http.post("/payment", {
			PaymentOptionID: $scope.selectedPaymentType.PaymentOptionID,
			PaymentAmount: $scope.PaymentAmount
		}).then(function(response){
			if(response){
				$("#OneTimePayment").get(0).reset();
				$("#PaymentOne").modal("hide");
				$scope.getPaymentInformation();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.addNewComplaint = function(){
		$http.post("/grievance", {
			GrievanceCategoryID: $scope.selectedGrievanceCategory.GrievanceCategoryID,
			GrievanceMessage: $scope.GrievanceMessage
		}).then(function(response){
			if(response){
				$("#NewComplaint").get(0).reset();
				$("#Complaint").modal("hide");
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.addNewComplaintMessage = function(){
		$http.post("/grievance/message/tenant", {
			GrievanceID: $scope.GrievanceID,
			GrievanceMessage: $scope.GrievanceMessage
		}).then(function(response){
			if(response){
				$scope.getMessages($scope.GrievanceID);
				$("#NewComplaintMessage").get(0).reset();
			}
		}, function(err){
			console.log(err);
		});
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
	$("#PaymentTypeTabs").on("click", function (e) {
		if(e.target.id === "check-tab"){
			$scope.PaymentOptionCreditCardNumber = null;
			$scope.PaymentOptionCreditCardExpirationMonth = null;
			$scope.PaymentOptionCreditCardExpirationYear = null;
			$scope.PaymentOptionCreditCardCV = null;
			$("#NewPaymentOptionCredit").get(0).reset();	
		}
		else{
			$scope.PaymentOptionCheckingRouting = null;
			$scope.PaymentOptionCheckingAccount = null;
			$("#NewPaymentOptionCheck").get(0).reset();
		}
	});
});