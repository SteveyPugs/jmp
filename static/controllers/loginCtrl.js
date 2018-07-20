angular.module("jmp").controller("loginCtrl", function($scope, $http, $location){
	$scope.title = $location.path().replace("/login/", "").toProperCase();
	$scope.login = function(){
		$http.post("/login", $scope.LoginForm).then(function(response){
			if(response.data){
				switch(parseInt(response.data)){
					case 1:
						$location.path("/");
						break;
					case 2:
						$location.path("/dashboard/landlord");
						break;
					case 3:
						$location.path("/dashboard/tenant");
						break;
				}
			}
			else{
				$location.path("/fail");
			}
		}, function(err){
			console.log(err);
		});
	};
});