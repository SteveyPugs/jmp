angular.module("jmp").controller("landlordDashCtrl", function($scope, $http, Upload, $uibModal, $window){
	//gets all propertys per user
	$scope.getPropertyList = function(){
		$http.get("/property").then(function(response){
			$scope.properties = response.data;
		}, function(err){
			console.log(err);
		});	
	};
	$scope.getPropertyList();
	//generates other data when property is selected
	$scope.$watch("selectedProperty", function(){
		if($scope.selectedProperty){
			async.parallel({
				getUnits: function(callback){
					$http.get("/unit/" + $scope.selectedProperty.PropertyID).then(function(response){
						return callback(null, response.data);
					}, function(err){
						return callback(err);
					});
				},
				getContacts: function(callback){
					$http.get("/property/contact/" + $scope.selectedProperty.PropertyID).then(function(response){
						return callback(null, response.data);
					}, function(err){
						return callback(err);
					});
				}
			}, function(err, results){
				if(err) console.log(err);
				$scope.selectUnits = results.getUnits;
				$scope.contacts = results.getContacts;
			});
		}
	});
	//modals
	$scope.openPropertyModal = function(){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/property_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance, getPropertyList){
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
				$scope.createNewProperty = function(){
					$http.post("/property", $scope.NewPropertyForm).then(function(response){
						if(response){
							getPropertyList();
							$uibModalInstance.close();
						}
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg",
			resolve:{
				getPropertyList: function(){
					return $scope.getPropertyList;
				}
			}
		});
	};
	$scope.openContactModal = function(selectedProperty){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/contact_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.createNewContact = function(){
					$http.post("/property/contact", {
						PropertyContactName: $scope.NewContactForm.EmergencyContactName,
						PropertyContactTelephone: $scope.NewContactForm.EmergencyContactPhone,
						PropertyID: selectedProperty.PropertyID
					}).then(function(response){
						if(response){
							// getPropertyList();
							$uibModalInstance.close();
						}
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openPaymentModal = function(selectedUnit, selectedUser){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/payments.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.selectedUnit = selectedUnit;
				$http.get("/payment/tenant/" + selectedUser).then(function(response){
					$scope.payments = response.data;
				}, function(err){
					console.log(err);
				});
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openComplaintModal = function(selectedUnit, selectedUser){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/complaints.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.selectedUnit = selectedUnit;
				$http.get("/grievance/tenant/" + selectedUser).then(function(response){
					$scope.complaints = response.data;
				}, function(err){
					console.log(err);
				});
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openDocumentModal = function(selectedUser){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/document_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.createNewDocument = function(){
					if($scope.NewDocumentForm.Document){
						Upload.upload({
							method: "POST",
							url: "/tenant/document",
							data: {
								UserID: selectedUser,
								Document: $scope.NewDocumentForm.Document
							}
						}).then(function(response){
							if(response){
								$uibModalInstance.close();
							}
						}, function(err){
							console.log(err);
						});
					}
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openLeaseModal = function(selectedProperty){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/lease.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
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
				$http.get("/property/lease/" + selectedProperty.PropertyID).then(function(response){
					$("#LeaseTemplate").summernote("code", response.data);
				}, function(err){
					console.log(err);
				});
				$scope.saveLease = function(){
					$http.post("/property/lease", {
						PropertyID: selectedProperty.PropertyID,
						LeaseTemplate: $("#LeaseTemplate").summernote("code")
					}).then(function(response){
						if(response){
							$uibModalInstance.close();
						}
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	$scope.openTenantModal = function(selectedUnit){
		var modalInstance = $uibModal.open({
			templateUrl: "/modals/tenant_new.html",
			animation: false,
			backdrop: false,
			controller: function($scope, $uibModalInstance){
				$scope.createNewTenant = function(){
					$http.post("/tenant", {
						TenantName: $scope.NewTenantForm.TenantName,
						TenantEmail: $scope.NewTenantForm.TenantEmail,
						UnitID: selectedUnit
					}).then(function(response){
						if(response){
				// 			$scope.getPropertyInformation();
							$uibModalInstance.close();
						}
					}, function(err){
						console.log(err);
					});
				};
				$scope.cancel = function () {
					$uibModalInstance.close();
				};
			},
			size: "lg"
		});
	};
	//functions
	$scope.generateLease = function(selectedUser, selectedProperty){
		$window.open("/property/lease/" + selectedUser + "/" + selectedProperty);
	};
});