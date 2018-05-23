var app = angular.module("Props", []);
app.controller("PropertyController", function($scope, $http) {
	$scope.getPropertyList = function(){
		$http.get("/property").then(function(response){
			$scope.properties = response.data;
		}, function(err){
			console.log(err);
		});
	};
	$scope.getPropertyList();
	$scope.getPropertyInformation = function(){
		$http.get("/unit/" + $scope.selectedProperty.PropertyID).then(function(response){
			$scope.selectUnits = response.data;
			$http.get("/property/contact/" + $scope.selectedProperty.PropertyID).then(function(response){
				$scope.contacts = response.data;
			}, function(err){
				console.log(err);
			});
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
		$scope.TenantEmail = null;
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$scope.$apply(function () {
			$scope.isEmailDisabled = false;
		});
		$("#FillVacancy").get(0).reset();
	});
	$("#TenantPayment").on("show.bs.modal", function (e) {
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$http.get("/payment/tenant/" + $(e.relatedTarget).data("tenant")).then(function(response){
			$scope.payments = response.data;
		}, function(err){
			console.log(err);
		});
	});
	$("#TenantComplaint").on("show.bs.modal", function (e) {
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$http.get("/grievance/tenant/" + $(e.relatedTarget).data("tenant")).then(function(response){
			$scope.complaints = response.data;
		}, function(err){
			console.log(err);
		});
	});
	$("#EmergencyContact").on("show.bs.modal", function (e) {
		$scope.EmergencyContactName = null;
		$scope.EmergencyContactPhone = null;
		$scope.PropertyID = $(e.relatedTarget).data("property");
		$("#FillContact").get(0).reset();
	});
	$scope.addTenant = function(){
		$http.post("/tenant", {
			TenantName: $scope.TenantName,
			TenantEmail: $scope.TenantEmail,
			UnitID: $scope.UnitID
		}).then(function(response){
			if(response){
				$("#Tenant").modal("hide");
				$("#TenantFinish").modal("show");
				$scope.getPropertyInformation();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.addEmergencyContact = function(){
		$http.post("/property/contact", {
			PropertyContactName: $scope.EmergencyContactName,
			PropertyContactTelephone: $scope.EmergencyContactPhone,
			PropertyID: $scope.PropertyID
		}).then(function(response){
			if(response){
				$("#EmergencyContact").modal("hide");
				$scope.getPropertyInformation();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.ResidentialTypes = [{
		key: "Single Family",
		value: "Single Family",
		group: "House"
	},{
		key: "Multi Family",
		value: "Multi Family",
		group: "House"
	},{
		key: "Condo",
		value: "Condo",
		group: "Building"
	},{
		key: "Co-op",
		value: "Co-op",
		group: "Building"
	},{
		key: "Other",
		value: "Other",
		group: "Other"
	}];
	$scope.addProperty = function(){
		$http.post("/property", {
			RegisterAddress: $scope.RegisterAddress,
			RegisterCity: $scope.RegisterCity,
			RegisterState: $scope.RegisterState,
			RegisterNumberOfUnits: $scope.RegisterNumberOfUnits,
			RegisterZip: $scope.RegisterZip,
			RegisterTypeOptions: $scope.RegisterTypeOptions,
			ResidentialType: $scope.selectedResidentialType
		}).then(function(response){
			if(response){
				$("#Property").modal("hide");
				$scope.getPropertyList();
			}
		}, function(err){
			console.log(err);
		});
	};
	$scope.evictTenant = function(tenantid, unitid){
		if (confirm("Are you sure you want to do this? This is not reversable.")) {
			$http.post("/tenant/evict", {
				TenantID: tenantid,
				UnitID: unitid
			}).then(function(response){
				if(response){
					$scope.getPropertyInformation();
				}
			}, function(err){
				console.log(err);
			});
		}
	};
});