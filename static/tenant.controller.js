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
	};
	$scope.getPaymentInformation();
	$scope.getGrievances = function(){
		$http.get("/grievance").then(function(response){
			$scope.grievances = response.data;
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
		$("#NewPaymentOption").get(0).reset();
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
	
	$scope.choosePaymentType = function(value){
		$("#NewPaymentOption").get(0).reset();
		if(value === "CC"){
			$("#CC").removeClass("d-none");
			$("#Checking").addClass("d-none");
		}
		else{
			$("#Checking").removeClass("d-none");
			$("#CC").addClass("d-none");
		}
	};
	$scope.addPaymentOption = function(){
		$http.post("/payment/option", {
			PaymentOptionCreditCardNumber: $scope.PaymentOptionCreditCardNumber,
			PaymentOptionCreditCardExpiration: $scope.PaymentOptionCreditCardExpiration,
			PaymentOptionCreditCardCVV: $scope.PaymentOptionCreditCardCVV,
			PaymentOptionCheckingRouting: $scope.PaymentOptionCheckingRouting,
			PaymentOptionCheckingAccount: $scope.PaymentOptionCheckingAccount
		}).then(function(response){
			if(response){
				$("#NewPaymentOption").get(0).reset();
				$("#Payment").modal("hide");
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
});