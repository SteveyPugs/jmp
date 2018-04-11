angular.module("Props", []).controller("TenantController", function($scope, $http) {
	$scope.getPaymentSetting = function(){
		$http.get("/payment").then(function(response){
			$scope.paymentSetting = response.data;
		}, function(err){
			console.log(err);
		});
	};
	$scope.isObjectEmpty = function(card){
		if(card) return Object.keys(card).length === 0;
		else return true;
	};
	$scope.getPaymentSetting();
	$scope.choosePaymentType = function(value){
		if(value === "CC"){
			$scope.PaymentOptionCreditCardNumber = null;
			$scope.PaymentOptionCreditCardExpiration = null;
			$scope.PaymentOptionCreditCardCVV = null;
			$scope.PaymentOptionCheckingRouting = null;
			$scope.PaymentOptionCheckingAccount = null;
			$("#CC").removeClass("d-none");
			$("#Checking").addClass("d-none");
		}
		else{
			$scope.PaymentOptionCreditCardNumber = null;
			$scope.PaymentOptionCreditCardExpiration = null;
			$scope.PaymentOptionCreditCardCVV = null;
			$scope.PaymentOptionCheckingRouting = null;
			$scope.PaymentOptionCheckingAccount = null;
			$("#Checking").removeClass("d-none");
			$("#CC").addClass("d-none");
		}
	};
	$scope.addPaymentOption = function(){
		$http.post("/payment", {
			PaymentOptionCreditCardNumber: $scope.PaymentOptionCreditCardNumber,
			PaymentOptionCreditCardExpiration: $scope.PaymentOptionCreditCardExpiration,
			PaymentOptionCreditCardCVV: $scope.PaymentOptionCreditCardCVV,
			PaymentOptionCheckingRouting: $scope.PaymentOptionCheckingRouting,
			PaymentOptionCheckingAccount: $scope.PaymentOptionCheckingAccount
		}).then(function(response){
			if(response){
				$("#Payment").modal("hide");
				$scope.getPaymentSetting();
			}
		}, function(err){
			console.log(err);
		});
	};
});