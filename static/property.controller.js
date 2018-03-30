angular.module("Props", []).controller("PropertyController", function($scope, $http) {
	// console.log($scope.properties)
	$http.get("/property").then(function(response){
		$scope.properties = response.data;
	}, function(err){
		console.log(err);
	});
	$scope.getUnits = function(){
		$http.get("/unit/" + $scope.selectedProperty.PropertyID).then(function(response){
			$scope.selectUnits = response.data;
		}, function(err){
			console.log(err);
		});
	};
	$scope.isEmailDisabled = false;
	$scope.emailOptOut = function(){
		$scope.isEmailDisabled = !$scope.isEmailDisabled;
	};
	$("#Tenant").on("show.bs.modal", function (e) {
		$scope.TenantName = null;
		$(this).find(".modal-body input#UnitID").val($(e.relatedTarget).data("unit"))
		$scope.$apply(function () {
			$scope.isEmailDisabled = false;
		});
		$scope.TenantEmail = null;
		$("#FillVacancy").get(0).reset();
	});
	$scope.addTenant = function(){
		$http.post("/tenant", {
			TenantName: $scope.TenantName,
			TenantEmail: $scope.TenantEmail,
			UnitID: document.getElementById("UnitID").value
		}).then(function(response){
			if(response){
				$("#Tenant").modal("hide");
				$("#TenantFinish").modal("show");
				$scope.getUnits();
			}
		}, function(err){

		});
	};
});