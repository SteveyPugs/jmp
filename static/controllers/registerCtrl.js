angular.module("jmp").controller("registerCtrl", function($scope, $http, $location){
	$scope.newRegistration = function(){
		$http.post("/register", $scope.RegisterForm).then(function(response){
			if(response.data) $location.path("/register/complete");
			else $location.path("/register/sorry");
		}, function(err){
			console.log(err);
		});
	};
});