angular.module("jmp").controller("registerCtrl", function($scope, $http, $location){
	$scope.newRegistration = function(){
		$http.post("/register", $scope.RegisterForm).then(function(response){
			if(response.data) $location.path("/register/complete");
			else $location.path("/register/sorry");
		}, function(err){
			console.log(err);
		});
	};
	$scope.showExtraResidential = function(){
		if(document.getElementById("RegisterTypeResidential").checked){
			document.getElementById("ResidentialType").style.display = "block";
			document.getElementById("ResidentialTypeSelect").required = true;
		}
		else{
			document.getElementById("ResidentialType").style.display = "none";
			document.getElementById("ResidentialTypeSelect").required = false;
		}
	};
});