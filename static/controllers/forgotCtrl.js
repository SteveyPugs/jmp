angular.module("jmp").controller("forgotCtrl", function($scope, $http, $location){
	$scope.forgot = function(){
		$http.post("/forgot", $scope.ForgotForm).then(function(response){
			$location.path("/reset");
		}, function(err){
			console.log(err);
		});
	};
});