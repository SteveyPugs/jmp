var app = angular.module("Props", ["ngFileUpload"]);
app.controller("PropertyController", function($scope, $http, Upload) {
	$("#LeaseTemplate").summernote({
		height: 300,
		toolbar: [
			["style", ["bold", "italic", "underline", "clear"]],
			["font", ["strikethrough", "superscript", "subscript"]],
			["fontsize", ["fontsize"]],
			["color", ["color"]],
			["para", ["ul", "ol", "paragraph"]],
			["height", ["height"]],
			["custom", ["FullName", "Email"]]
		],
		buttons: {
			FullName: function(context){
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: "<i class='fa fa-child'/> Add Full Name",
					tooltip: "Add Full Name",
					click: function(){
						context.invoke("editor.insertText", "#FullName#");
					},
					container: false
				});
				return button.render();
			},
			Email: function(context){
				var ui = $.summernote.ui;
				var button = ui.button({
					contents: "<i class='fa fa-child'/> Add Email",
					tooltip: "Add Email",
					click: function(){
						context.invoke("editor.insertText", "#Email#");
					},
					container: false
				});
				return button.render();
			}
		}
	});
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
	$("#Tenant").on("show.bs.modal", function (e) {
		$scope.TenantName = null;
		$scope.TenantEmail = null;
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$("#FillVacancy").get(0).reset();
	});
	$("#TenantPayment").on("show.bs.modal", function (e) {
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$http.get("/payment/tenant/" + $(e.relatedTarget).data("user")).then(function(response){
			$scope.payments = response.data;
		}, function(err){
			console.log(err);
		});
	});
	$("#TenantComplaint").on("show.bs.modal", function (e) {
		$scope.UnitID = $(e.relatedTarget).data("unit");
		$http.get("/grievance/tenant/" + $(e.relatedTarget).data("user")).then(function(response){
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
	$("#Lease").on("show.bs.modal", function (e) {
		$scope.PropertyID = $(e.relatedTarget).data("property");
		$http.get("/property/lease/" + $scope.PropertyID).then(function(response){
			$("#LeaseTemplate").summernote("code", response.data);
		}, function(err){
			console.log(err);
		});
		
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
	$scope.editLease = function(){
		$http.post("/property/lease", {
			PropertyID: $scope.PropertyID,
			LeaseTemplate: $("#LeaseTemplate").summernote("code")
		}).then(function(response){
			if(response){
				$("#Lease").modal("hide");
			}
		}, function(err){
			console.log(err);
		});
	};
	$("#AddDocument").on("show.bs.modal", function (e) {
		$scope.UserID = $(e.relatedTarget).data("user");
	});
	$scope.addDocument = function(){
		if($scope.Document){
			Upload.upload({
				method: "POST",
	            url: "/tenant/document",
	            data: {
	            	UserID: $scope.UserID,
	            	Document: $scope.Document
	            }
	        }).then(function(response){
	        	if(response){
					$("#AddDocument").modal("hide");
				}
	        }, function(err){
	            console.log(err);
	        });
		}
	};	
});